import { ServiceRequest, SmartDineOrder, SmartMenuItem, StaffAccount } from '../types/hotel';

let staffAccessToken: string | null = null;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (staffAccessToken) headers.set('Authorization', `Bearer ${staffAccessToken}`);

  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const body = await response.text();
    let message = body || `Request failed with status ${response.status}.`;
    try {
      const parsed: unknown = JSON.parse(body);
      if (typeof parsed === 'object' && parsed !== null && 'error' in parsed && typeof parsed.error === 'string') {
        message = parsed.error;
      }
    } catch {
      // Keep the original response text when the API does not return JSON.
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function loadMenu() {
  return request<{ menu: SmartMenuItem[] }>('/api/menu');
}

export async function loadMongoData() {
  return request<{ menu: SmartMenuItem[]; orders: SmartDineOrder[]; serviceRequests: ServiceRequest[] }>('/api/data');
}

export async function loginStaff(id: string, password: string, portal: 'admin' | 'kitchen' | 'waiter'): Promise<StaffAccount> {
  const result = await request<{ account: StaffAccount; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ id, password, portal }),
  });
  staffAccessToken = result.token;
  return result.account;
}

export async function logoutStaff() {
  if (!staffAccessToken) return;
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } finally {
    staffAccessToken = null;
  }
}

export function clearStaffAccessToken() {
  staffAccessToken = null;
}

export async function saveMenu(items: SmartMenuItem[]) {
  await request('/api/menu', { method: 'PUT', body: JSON.stringify(items) });
}

export async function createOrder(order: SmartDineOrder) {
  const result = await request<{ order: SmartDineOrder }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
  return result.order;
}

export async function setOrderStatus(orderId: string, status: SmartDineOrder['status']) {
  await request(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

async function importOrders(items: SmartDineOrder[]) {
  await request('/api/orders', { method: 'PUT', body: JSON.stringify(items) });
}

export async function createServiceRequest(type: ServiceRequest['type'], target: string) {
  const result = await request<{ serviceRequest: ServiceRequest }>('/api/service-requests', {
    method: 'POST',
    body: JSON.stringify({ type, target }),
  });
  return result.serviceRequest;
}

async function importServiceRequests(items: ServiceRequest[]) {
  await request('/api/service-requests', { method: 'PUT', body: JSON.stringify(items) });
}

export async function setServiceRequestStatus(requestId: string, status: ServiceRequest['status']) {
  await request(`/api/service-requests/${encodeURIComponent(requestId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function seedMongoData(
  menu: SmartMenuItem[],
  orders: SmartDineOrder[],
  serviceRequests: ServiceRequest[],
) {
  const existing = await loadMongoData();

  await Promise.all([
    existing.menu.length ? Promise.resolve() : saveMenu(menu),
    existing.orders.length ? Promise.resolve() : importOrders(orders),
    existing.serviceRequests.length ? Promise.resolve() : importServiceRequests(serviceRequests),
  ]);
}