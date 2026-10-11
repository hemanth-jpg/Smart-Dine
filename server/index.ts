import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import { MongoClient, Collection } from 'mongodb';
import { STAFF_ACCOUNTS } from '../src/data/staffAccounts';
import type { StaffAccount } from '../src/types/hotel';
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
app.use(express.json({ limit: '2mb' }));

interface StoredDocument {
  id: string;
  data: Record<string, unknown>;
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
} as const;

type CollectionKey = keyof typeof collections;

function getCollection(key: CollectionKey): Collection<StoredDocument> {
  return client.db(databaseName).collection<StoredDocument>(collections[key]);
}

const staffCollection = () => client.db(databaseName).collection<StoredStaffAccount>(collections.staffAccounts);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getItems(body: unknown): Record<string, unknown>[] {
  if (!Array.isArray(body)) throw new Error('Request body must be an array.');
  if (body.some((item) => !isRecord(item) || item.id === undefined || item.id === null)) {
    throw new Error('Every item must be an object with an id.');
  }
  return body;
}

async function readCollection(key: CollectionKey) {
  const rows = await getCollection(key).find({}, { projection: { _id: 0, data: 1 } }).toArray();
  return rows.map((row) => row.data);
}

async function writeCollection(key: CollectionKey, items: Record<string, unknown>[]) {
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

app.get('/api/health', async (_request, response) => {
  try {
    await client.db(databaseName).command({ ping: 1 });
    response.json({ ok: true, database: databaseName, connected: true });
  } catch (error) {
    console.error('MongoDB health check failed:', error);
    response.status(503).json({ ok: false, database: databaseName, connected: false });
  }
});

app.get('/api/data', async (_request, response) => {
  try {
    const [menu, orders, serviceRequests] = await Promise.all([
      readCollection('menu'),
      readCollection('orders'),
      readCollection('serviceRequests'),
    ]);
    response.json({ menu, orders, serviceRequests });
  } catch (error) {
    console.error('MongoDB read failed:', error);
    response.status(500).json({ error: 'Unable to read application data.' });
  }
});

app.post('/api/auth/login', async (request, response) => {
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

    const { id: accountId, name, role, label, avatarColor } = account;
    response.json({ account: { id: accountId, name, role, label, avatarColor } satisfies StaffAccount });
  } catch (error) {
    console.error('Staff login failed:', error);
    response.status(500).json({ error: 'Unable to sign in right now.' });
  }
});

const putCollection = (key: CollectionKey) => async (request: Request, response: Response) => {
  try {
    await writeCollection(key, getItems(request.body));
    response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to write application data.';
    console.error(`MongoDB ${key} write failed:`, error);
    response.status(400).json({ error: message });
  }
};

app.put('/api/menu', putCollection('menu'));
app.put('/api/orders', putCollection('orders'));
app.put('/api/service-requests', putCollection('serviceRequests'));

async function start() {
  await client.connect();
  await Promise.all([
    getCollection('menu').createIndex({ id: 1 }, { unique: true }),
    getCollection('orders').createIndex({ id: 1 }, { unique: true }),
    getCollection('serviceRequests').createIndex({ id: 1 }, { unique: true }),
    staffCollection().createIndex({ id: 1 }, { unique: true }),
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
