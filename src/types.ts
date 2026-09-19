export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  available: boolean;
}

export interface TransactionItem {
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
  customPrice?: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  total: number;
  deliveryFee?: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'cash' | 'qris';
  status: 'pending' | 'paid' | 'cancelled';
  date: string;
  notes?: string;
}

export type Page = 'dashboard' | 'menu' | 'transaction' | 'reports' | 'promotion' | 'settings';

export interface UserAccount {
  id: string;
  username: string;
  pin: string;
  role: 'admin' | 'kasir' | 'owner';
  fullName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}
