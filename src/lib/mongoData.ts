import { ServiceRequest, SmartDineOrder, SmartMenuItem, StaffAccount } from '../types/hotel';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

export async function loadMongoData() {
  return request<{ menu: SmartMenuItem[]; orders: SmartDineOrder[]; serviceRequests: ServiceRequest[] }>('/api/data');
}

export async function loginStaff(id: string, password: string, portal: 'admin' | 'kitchen' | 'waiter'): Promise<StaffAccount> {
  const result = await request<{ account: StaffAccount }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ id, password, portal }),
  });
  return result.account;
}

export async function saveMenu(items: SmartMenuItem[]) {
  await request('/api/menu', { method: 'PUT', body: JSON.stringify(items) });
}

export async function saveOrders(items: SmartDineOrder[]) {
  await request('/api/orders', { method: 'PUT', body: JSON.stringify(items) });
}

export async function saveServiceRequests(items: ServiceRequest[]) {
  await request('/api/service-requests', { method: 'PUT', body: JSON.stringify(items) });
}

export async function seedMongoData(
  menu: SmartMenuItem[],
  orders: SmartDineOrder[],
  serviceRequests: ServiceRequest[],
) {
  const existing = await loadMongoData();

  await Promise.all([
    existing.menu.length ? Promise.resolve() : saveMenu(menu),
    existing.orders.length ? Promise.resolve() : saveOrders(orders),
    existing.serviceRequests.length ? Promise.resolve() : saveServiceRequests(serviceRequests),
  ]);
}