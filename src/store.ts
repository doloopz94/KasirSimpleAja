import { MenuItem, Transaction } from './types';

const MENU_KEY = 'dapurku_menu';
const TRANSACTIONS_KEY = 'dapurku_transactions';

export const getMenuItems = (): MenuItem[] => {
  const data = localStorage.getItem(MENU_KEY);
  if (data) return JSON.parse(data);
  
  // Default menu items
  const defaultMenu: MenuItem[] = [
    { id: '1', name: 'Nasi Goreng Spesial', price: 20000, category: 'Makanan Utama', description: 'Nasi goreng dengan telur, ayam, dan sayuran', available: true },
    { id: '2', name: 'Ayam Goreng Kremes', price: 25000, category: 'Makanan Utama', description: 'Ayam goreng tepung dengan kremesan gurih', available: true },
    { id: '3', name: 'Mie Goreng Jawa', price: 18000, category: 'Makanan Utama', description: 'Mie goreng khas Jawa dengan bumbu spesial', available: true },
    { id: '4', name: 'Soto Ayam', price: 22000, category: 'Makanan Utama', description: 'Soto ayam kuah bening dengan pelengkap', available: true },
    { id: '5', name: 'Es Teh Manis', price: 5000, category: 'Minuman', description: 'Teh manis dingin segar', available: true },
    { id: '6', name: 'Es Jeruk', price: 7000, category: 'Minuman', description: 'Jeruk peras segar dengan es', available: true },
    { id: '7', name: 'Kerupuk', price: 3000, category: 'Pelengkap', description: 'Kerupuk udang renyah', available: true },
    { id: '8', name: 'Nasi Putih', price: 5000, category: 'Pelengkap', description: 'Nasi putih hangat', available: true },
  ];
  localStorage.setItem(MENU_KEY, JSON.stringify(defaultMenu));
  return defaultMenu;
};

export const saveMenuItems = (items: MenuItem[]) => {
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (data) return JSON.parse(data);
  return [];
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
