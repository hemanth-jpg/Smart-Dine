import { StaffAccount } from '../types/hotel';

export const STAFF_ACCOUNTS: Record<string, StaffAccount> = {
  waiter: { id: 'WTR-1001', name: 'Ananya Rao', role: 'waiter', label: 'Lead Floor Butler & Waiter', avatarColor: '#38bdf8' },
  kitchen: { id: 'KTN-1001', name: 'Ravi Kumar', role: 'kitchen', label: 'Executive Line Chef', avatarColor: '#f59e0b' },
  admin: { id: 'ADM-1001', name: 'Meera Shah', role: 'admin', label: 'Operations Admin', avatarColor: '#a855f7' },
  management: { id: 'MGT-1001', name: 'Arjun Mehta', role: 'management', label: 'General Manager & Analytics', avatarColor: '#d4af37' },
};

export const DEMO_LOGIN_IDS = [
  { id: 'KTN-1001', role: 'kitchen' as const, name: 'Chef Ravi Kumar', department: 'Executive Kitchen KDS', portal: 'kitchen' as const },
  { id: 'WTR-1001', role: 'waiter' as const, name: 'Butler Ananya Rao', department: 'Floor Service & Tables', portal: 'waiter' as const },
  { id: 'ADM-1001', role: 'admin' as const, name: 'Admin Meera Shah', department: 'Operations & Menu Lab', portal: 'admin' as const },
  { id: 'MGT-1001', role: 'management' as const, name: 'GM Arjun Mehta', department: 'Hotel Analytics & GM', portal: 'admin' as const },
];