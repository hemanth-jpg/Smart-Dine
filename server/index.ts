import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { config } from 'dotenv';
import express, { Request, RequestHandler, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';
import { STAFF_ACCOUNTS } from '../src/data/staffAccounts';
import { INITIAL_SMART_MENU } from '../src/data/smartDineData';
import type { OrderItemDetail, OrderStage, ServiceRequest, SmartDineOrder, SmartMenuItem, StaffAccount } from '../src/types/hotel';
import { verifyPassword } from './staffAuth';

config({ path: ['.env.local', '.env'] });

const port = Number(process.env.PORT || 3001);
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE || 'smart_dine';

if (!mongoUri) {
  throw new Error('MONGODB_URI is required. Add it to .env.local before starting the server.');
}

const client = new MongoClient(mongoUri);
const app = express();
app.disable('x-powered-by');
app.use((_request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'SAMEORIGIN');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '2mb' }));

interface StoredDocument {
  id: string;
  data: unknown;
  updatedAt: Date;
}

interface StoredStaffAccount extends StaffAccount {
  passwordHash?: string;
  passwordSalt?: string;
  passwordConfigured: boolean;
  updatedAt: Date;
}

const collections = {
  menu: 'menu_items',
  orders: 'orders',
  serviceRequests: 'service_requests',
  staffAccounts: 'staff_accounts',
  staffSessions: 'staff_sessions',
} as const;

type DataCollectionKey = 'menu' | 'orders' | 'serviceRequests';

interface StaffSession {
  tokenHash: string;
  staffId: string;
  expiresAt: Date;
}

class RequestValidationError extends Error {}

declare global {
  namespace Express {
    interface Locals {
      staff?: StaffAccount;
      sessionId?: string;
    }
  }
}

function getCollection(key: DataCollectionKey): Collection<StoredDocument> {
  return client.db(databaseName).collection<StoredDocument>(collections[key]);
}

const staffCollection = () => client.db(databaseName).collection<StoredStaffAccount>(collections.staffAccounts);
const sessionCollection = () => client.db(databaseName).collection<StaffSession>(collections.staffSessions);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMenuItem(value: unknown): value is SmartMenuItem {
  return isRecord(value) &&
    (typeof value.id === 'string' || typeof value.id === 'number') &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    typeof value.description === 'string';
}

function getItems(body: unknown): (Record<string, unknown> & { id: string | number })[] {
  if (!Array.isArray(body)) throw new Error('Request body must be an array.');
  if (body.some((item) =>
    !isRecord(item) ||
    (typeof item.id !== 'string' && typeof item.id !== 'number') ||
    (typeof item.id === 'string' && item.id.length === 0)
  )) {
    throw new Error('Every item must be an object with an id.');
  }
  return body as (Record<string, unknown> & { id: string | number })[];
}

async function readCollection(key: DataCollectionKey) {
  const rows = await getCollection(key).find({}, { projection: { _id: 0, data: 1 } }).toArray();
  return rows.map((row) => row.data);
}

async function writeCollection<T extends { id: string | number }>(key: DataCollectionKey, items: T[]) {
  const collection = getCollection(key);
  if (items.length) {
    await collection.bulkWrite(
      items.map((item) => ({
        updateOne: {
          filter: { id: String(item.id) },
          update: {
            $set: { id: String(item.id), data: item, updatedAt: new Date() },
          },
          upsert: true,
        },
      })),
    );
  }
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function limitRequests(maxRequests: number, windowMs: number): RequestHandler {
  return (request, response, next) => {
    const key = `${request.path}:${request.socket.remoteAddress || 'unknown'}`;
    const now = Date.now();
    let entry = loginAttempts.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      loginAttempts.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      response.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
      response.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
      return;
    }
    next();
  };
}

const requireStaff: RequestHandler = (request, response, next) => {
  void (async () => {
    const authorization = request.get('authorization');
    const match = authorization?.match(/^Bearer ([A-Za-z0-9_-]{40,})$/);
    if (!match) {
      response.status(401).json({ error: 'Staff sign-in is required.' });
      return;
    }

    const tokenHash = createHash('sha256').update(match[1]).digest('hex');
    const session = await sessionCollection().findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });
    if (!session) {
      response.status(401).json({ error: 'Your staff session has expired. Sign in again.' });
      return;
    }

    const account = await staffCollection().findOne({
      id: session.staffId,
      passwordConfigured: true,
    });
    if (!account) {
      await sessionCollection().deleteOne({ tokenHash });
      response.status(401).json({ error: 'Your staff account is no longer active.' });
      return;
    }

    const { id, name, role, label, avatarColor } = account;
    response.locals.staff = { id, name, role, label, avatarColor };
    response.locals.sessionId = tokenHash;
    next();
  })().catch((error: unknown) => {
    console.error('Staff session verification failed:', error);
    response.status(500).json({ error: 'Unable to verify your staff session.' });
  });
};

function requireRoles(...roles: StaffAccount['role'][]): RequestHandler {
  return (_request, response, next) => {
    if (!response.locals.staff || !roles.includes(response.locals.staff.role)) {
      response.status(403).json({ error: 'Your staff role cannot perform this action.' });
      return;
    }
    next();
  };
}

function requiredText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new RequestValidationError(`${field} must be a non-empty string of at most ${maxLength} characters.`);
  }
  return value.trim();
}

function optionalText(value: unknown, field: string, maxLength: number): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return requiredText(value, field, maxLength);
}

app.get('/api/health', async (_request, response) => {
  try {
    await client.db(databaseName).command({ ping: 1 });
    response.json({ ok: true, database: databaseName, connected: true });
  } catch (error) {
    console.error('MongoDB health check failed:', error);
    response.status(503).json({ ok: false, database: databaseName, connected: false });
  }
});

app.get('/api/menu', async (_request, response) => {
  try {
    const menu = await readCollection('menu');
    response.json({ menu: menu.length ? menu : INITIAL_SMART_MENU });
  } catch (error) {
    console.error('MongoDB menu read failed:', error);
    response.status(500).json({ error: 'Unable to read the menu.' });
  }
});

app.get('/api/data', requireStaff, async (_request, response) => {
  try {
    const [menu, orders, serviceRequests] = await Promise.all([
      readCollection('menu'),
      readCollection('orders'),
      readCollection('serviceRequests'),
    ]);
    response.json({ menu: menu.length ? menu : INITIAL_SMART_MENU, orders, serviceRequests });
  } catch (error) {
    console.error('MongoDB staff data read failed:', error);
    response.status(500).json({ error: 'Unable to read application data.' });
  }
});

const loginRateLimit = limitRequests(10, 15 * 60 * 1000);

app.post('/api/auth/login', loginRateLimit, async (request, response) => {
  try {
    const { id, password, portal } = isRecord(request.body) ? request.body : {};
    if (
      typeof id !== 'string' ||
      typeof password !== 'string' ||
      (portal !== 'admin' && portal !== 'kitchen' && portal !== 'waiter')
    ) {
      response.status(401).json({ error: 'Invalid staff ID or password.' });
      return;
    }

    const account = await staffCollection().findOne({ id: id.trim().toUpperCase() });
    const isValid = Boolean(
      account?.passwordConfigured &&
      account.passwordSalt &&
      account.passwordHash &&
      await verifyPassword(password, account.passwordSalt, account.passwordHash),
    );

    if (!isValid || !account) {
      response.status(401).json({ error: 'Invalid staff ID or password.' });
      return;
    }

    const canAccessPortal = account.role === 'admin' || account.role === 'management' || account.role === portal;
    if (!canAccessPortal) {
      response.status(403).json({ error: 'This staff account cannot access the selected terminal.' });
      return;
    }

    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await sessionCollection().insertOne({ tokenHash, staffId: account.id, expiresAt });
    const key = `${request.path}:${request.socket.remoteAddress || 'unknown'}`;
    loginAttempts.delete(key);

    const { id: accountId, name, role, label, avatarColor } = account;
    response.json({
      account: { id: accountId, name, role, label, avatarColor } satisfies StaffAccount,
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Staff login failed:', error);
    response.status(500).json({ error: 'Unable to sign in right now.' });
  }
});

app.post('/api/auth/logout', requireStaff, async (_request, response) => {
  try {
    await sessionCollection().deleteOne({ tokenHash: response.locals.sessionId });
    response.json({ ok: true });
  } catch (error) {
    console.error('Staff logout failed:', error);
    response.status(500).json({ error: 'Unable to end your staff session.' });
  }
});

const putCollection = (key: DataCollectionKey) => async (request: Request, response: Response) => {
  try {
    const items = getItems(request.body);
    if (key === 'menu' && items.some((item) => !isMenuItem(item))) {
      response.status(400).json({ error: 'Every menu entry must have a valid name, category, price, and description.' });
      return;
    }
    await writeCollection(key, items);
    response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to write application data.';
    console.error(`MongoDB ${key} write failed:`, error);
    response.status(400).json({ error: message });
  }
};

app.put('/api/menu', requireStaff, requireRoles('admin', 'management'), putCollection('menu'));
app.put('/api/orders', requireStaff, requireRoles('admin', 'management'), putCollection('orders'));
app.put('/api/service-requests', requireStaff, requireRoles('admin', 'management'), putCollection('serviceRequests'));

app.post('/api/orders', limitRequests(20, 60 * 1000), async (request, response) => {
  try {
    if (!isRecord(request.body) || !Array.isArray(request.body.detailedItems) || request.body.detailedItems.length === 0 || request.body.detailedItems.length > 30) {
      response.status(400).json({ error: 'An order must contain between 1 and 30 menu items.' });
      return;
    }

    const table = requiredText(request.body.table, 'Table', 20);
    const guestName = requiredText(request.body.guestName, 'Guest name', 80);
    const roomNumber = optionalText(request.body.roomNumber, 'Room number', 80);
    const specialNotes = optionalText(request.body.specialNotes, 'Special instructions', 500);
    const deliveryMode = request.body.deliveryMode;
    const billingOption = request.body.billingOption;
    if (deliveryMode !== 'table' && deliveryMode !== 'room_service') {
      response.status(400).json({ error: 'Select a valid delivery mode.' });
      return;
    }
    if (!['table_folio', 'charge_to_room', 'pay_at_counter_cash', 'pay_on_delivery_cash', 'executive_club_credit'].includes(String(billingOption))) {
      response.status(400).json({ error: 'Select a valid billing option.' });
      return;
    }

    const requestedItems = request.body.detailedItems;
    const itemIds = requestedItems.map((entry: unknown) => {
      if (!isRecord(entry) || !isRecord(entry.item) || (typeof entry.item.id !== 'string' && typeof entry.item.id !== 'number')) {
        throw new RequestValidationError('Each order line must reference a menu item.');
      }
      if (!Number.isInteger(entry.quantity) || (entry.quantity as number) < 1 || (entry.quantity as number) > 20) {
        throw new RequestValidationError('Each item quantity must be between 1 and 20.');
      }
      return String(entry.item.id);
    });

    const menuCollection = getCollection('menu');
    const menuRows = await menuCollection.find({ id: { $in: itemIds } }).toArray();
    if (menuRows.length === 0) {
      await writeCollection('menu', INITIAL_SMART_MENU);
    }
    const menuById = new Map<string, SmartMenuItem>();
    if (menuRows.length === 0) {
      for (const item of INITIAL_SMART_MENU) menuById.set(String(item.id), item);
    } else {
      for (const row of menuRows) {
        if (isMenuItem(row.data)) menuById.set(String(row.id), row.data);
      }
    }

    const detailedItems: OrderItemDetail[] = requestedItems.map((entry: unknown) => {
      const rawItem = entry as Record<string, unknown>;
      const clientItem = rawItem.item as Record<string, unknown>;
      const item = menuById.get(String(clientItem.id));
      if (!item) throw new RequestValidationError('One or more selected dishes are no longer on the menu.');
      return {
        item,
        quantity: rawItem.quantity as number,
        spiceLevel: optionalText(rawItem.spiceLevel, 'Spice level', 40),
        doneness: optionalText(rawItem.doneness, 'Doneness', 40),
        specialInstructions: optionalText(rawItem.specialInstructions, 'Item instructions', 300),
        cutleryCount: rawItem.cutleryCount === undefined ? undefined : Number(rawItem.cutleryCount),
      };
    });
    if (detailedItems.some((item) => item.cutleryCount !== undefined && (!Number.isInteger(item.cutleryCount) || item.cutleryCount < 0 || item.cutleryCount > 20))) {
      response.status(400).json({ error: 'Cutlery count must be between 0 and 20.' });
      return;
    }

    const amount = Math.round(detailedItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0) * 100) / 100;
    const order: SmartDineOrder = {
      id: `ORD-${randomUUID()}`,
      table,
      ...(roomNumber ? { roomNumber } : {}),
      guestName,
      deliveryMode,
      itemsCount: detailedItems.reduce((sum, item) => sum + item.quantity, 0),
      itemsSummary: detailedItems.map((item) => `${item.item.name} ×${item.quantity}`).join(', '),
      detailedItems,
      amount,
      status: 'New',
      payment: billingOption === 'charge_to_room' ? 'Charged to Folio' : 'Pending',
      billingOption: billingOption as SmartDineOrder['billingOption'],
      age: '00 min',
      timestamp: Date.now(),
      ...(specialNotes ? { specialNotes } : {}),
    };

    await getCollection('orders').insertOne({
      id: order.id,
      data: order as unknown as Record<string, unknown>,
      updatedAt: new Date(),
    });
    response.status(201).json({ order });
  } catch (error) {
    console.error('Guest order creation failed:', error);
    if (error instanceof RequestValidationError) {
      response.status(400).json({ error: error.message });
      return;
    }
    response.status(500).json({ error: 'Unable to create the order right now.' });
  }
});

const serviceRequestTypes: ServiceRequest['type'][] = [
  'Waiter Call',
  'Water Refill',
  'Silverware / Napkins',
  'Bill / Folio Summary',
  'Clear Tray',
];

app.post('/api/service-requests', limitRequests(30, 60 * 1000), async (request, response) => {
  try {
    const body = isRecord(request.body) ? request.body : {};
    const type = body.type;
    if (typeof type !== 'string' || !serviceRequestTypes.includes(type as ServiceRequest['type'])) {
      response.status(400).json({ error: 'Select a valid service request.' });
      return;
    }
    const target = requiredText(body.target, 'Table', 30);
    if (!/^Table [A-Za-z0-9 -]+$/i.test(target)) {
      response.status(400).json({ error: 'Service requests must be associated with a valid table.' });
      return;
    }

    const serviceRequest: ServiceRequest = {
      id: `REQ-${randomUUID()}`,
      type: type as ServiceRequest['type'],
      target,
      status: 'Pending',
      time: 'Just now',
      timestamp: Date.now(),
    };
    await getCollection('serviceRequests').insertOne({
      id: serviceRequest.id,
      data: serviceRequest,
      updatedAt: new Date(),
    });
    response.status(201).json({ serviceRequest });
  } catch (error) {
    console.error('Guest service request creation failed:', error);
    if (error instanceof RequestValidationError) {
      response.status(400).json({ error: error.message });
      return;
    }
    response.status(500).json({ error: 'Unable to create the service request right now.' });
  }
});

app.patch('/api/orders/:id/status', requireStaff, requireRoles('kitchen', 'waiter', 'admin', 'management'), async (request, response) => {
  const validStages: OrderStage[] = ['New', 'Preparing', 'Ready', 'Served', 'Cancelled'];
  const status = request.body?.status;
  if (typeof status !== 'string' || !validStages.includes(status as OrderStage)) {
    response.status(400).json({ error: 'Select a valid order status.' });
    return;
  }

  try {
    const update = status === 'Served'
      ? { 'data.status': status, 'data.payment': 'Charged to Folio', updatedAt: new Date() }
      : { 'data.status': status, updatedAt: new Date() };
    const result = await getCollection('orders').updateOne({ id: request.params.id }, { $set: update });
    if (!result.matchedCount) {
      response.status(404).json({ error: 'Order not found.' });
      return;
    }
    response.json({ ok: true });
  } catch (error) {
    console.error('Order status update failed:', error);
    response.status(500).json({ error: 'Unable to update the order status.' });
  }
});

app.patch('/api/service-requests/:id/status', requireStaff, requireRoles('waiter', 'admin', 'management'), async (request, response) => {
  const validStatuses: ServiceRequest['status'][] = ['Pending', 'In Progress', 'Resolved'];
  const status = request.body?.status;
  if (typeof status !== 'string' || !validStatuses.includes(status as ServiceRequest['status'])) {
    response.status(400).json({ error: 'Select a valid service request status.' });
    return;
  }

  try {
    const result = await getCollection('serviceRequests').updateOne(
      { id: request.params.id },
      { $set: { 'data.status': status, updatedAt: new Date() } },
    );
    if (!result.matchedCount) {
      response.status(404).json({ error: 'Service request not found.' });
      return;
    }
    response.json({ ok: true });
  } catch (error) {
    console.error('Service request status update failed:', error);
    response.status(500).json({ error: 'Unable to update the service request.' });
  }
});

async function start() {
  await client.connect();
  await Promise.all([
    getCollection('menu').createIndex({ id: 1 }, { unique: true }),
    getCollection('orders').createIndex({ id: 1 }, { unique: true }),
    getCollection('serviceRequests').createIndex({ id: 1 }, { unique: true }),
    staffCollection().createIndex({ id: 1 }, { unique: true }),
    sessionCollection().createIndex({ tokenHash: 1 }, { unique: true }),
    sessionCollection().createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
  await Promise.all(Object.values(STAFF_ACCOUNTS).map((account) =>
    staffCollection().updateOne(
      { id: account.id },
      { $setOnInsert: { ...account, passwordConfigured: false, updatedAt: new Date() } },
      { upsert: true },
    ),
  ));
  app.listen(port, () => console.log(`Smart Dine API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Unable to start Smart Dine API:', error);
  process.exit(1);
});
