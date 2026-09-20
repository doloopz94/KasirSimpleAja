import { MenuItem, Transaction } from './types';
import { isFirebaseConfigured } from './firebase/config';
import { menuService, transactionService, settingsService } from './firebase/services';

const MENU_KEY = 'dapurku_menu';
const TRANSACTIONS_KEY = 'dapurku_transactions';
const SETTINGS_KEY = 'dapurku_settings';

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

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  // Try Firebase first
  if (isFirebaseConfigured()) {
    try {
      const firebaseMenu = await menuService.getAll();
      if (firebaseMenu && firebaseMenu.length > 0) {
        // Cache to localStorage
        localStorage.setItem(MENU_KEY, JSON.stringify(firebaseMenu));
        return firebaseMenu;
      }
    } catch (error) {
      console.error('Error fetching menu from Firebase:', error);
    }
  }
  
  // Fallback to localStorage
  const data = localStorage.getItem(MENU_KEY);
  if (data) return JSON.parse(data);
  
  // No data, use default
  localStorage.setItem(MENU_KEY, JSON.stringify(defaultMenu));
  if (isFirebaseConfigured()) {
    await menuService.saveAll(defaultMenu);
  }
  return defaultMenu;
};

export const saveMenuItems = async (items: MenuItem[]) => {
  // Save to localStorage first (for immediate UI update)
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
  
  // Save to Firebase
  if (isFirebaseConfigured()) {
    try {
      await menuService.saveAll(items);
    } catch (error) {
      console.error('Error saving menu to Firebase:', error);
    }
  }
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  // Try Firebase first
  if (isFirebaseConfigured()) {
    try {
      const firebaseTransactions = await transactionService.getAll();
      if (firebaseTransactions) {
        // Cache to localStorage
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(firebaseTransactions));
        return firebaseTransactions;
      }
    } catch (error) {
      console.error('Error fetching transactions from Firebase:', error);
    }
  }
  
  // Fallback to localStorage
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (data) return JSON.parse(data);
  return [];
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> => {
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
  };
  
  console.log('🔥 Adding transaction to Firebase...', newTransaction);
  
  // Save to Firebase first
  if (isFirebaseConfigured()) {
    try {
      console.log('✅ Firebase is configured, attempting to save...');
      const firebaseId = await transactionService.add(newTransaction);
      if (firebaseId) {
        newTransaction.id = firebaseId;
        console.log('✅ Transaction saved to Firebase with ID:', firebaseId);
      } else {
        console.error('❌ Failed to save transaction to Firebase - no ID returned');
      }
    } catch (error) {
      console.error('❌ Error adding transaction to Firebase:', error);
    }
  } else {
    console.warn('⚠️ Firebase is not configured, saving to localStorage only');
  }
  
  // Update localStorage cache
  const currentTransactions = await getTransactions();
  currentTransactions.push(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(currentTransactions));
  console.log('✅ Transaction saved to localStorage');
  
  return newTransaction;
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<boolean> => {
  // Update in Firebase
  if (isFirebaseConfigured()) {
    try {
      const success = await transactionService.update(id, updates);
      if (success) {
        // Update localStorage cache
        const currentTransactions = await getTransactions();
        const updatedTransactions = currentTransactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        );
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
        return true;
      }
    } catch (error) {
      console.error('Error updating transaction in Firebase:', error);
    }
  }
  
  // Fallback to localStorage only
  const currentTransactions = await getTransactions();
  const updatedTransactions = currentTransactions.map(t => 
    t.id === id ? { ...t, ...updates } : t
  );
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  return true;
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  console.log('🗑️ Deleting transaction:', id);
  
  let firebaseSuccess = false;
  
  // Delete from Firebase
  if (isFirebaseConfigured()) {
    try {
      console.log('📡 Attempting to delete from Firebase...');
      firebaseSuccess = await transactionService.delete(id);
      
      if (firebaseSuccess) {
        console.log('✅ Transaction deleted from Firebase');
        
        // Wait a bit for Firebase to sync
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update localStorage cache
        const currentTransactions = await getTransactions();
        const updatedTransactions = currentTransactions.filter(t => t.id !== id);
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
        console.log('✅ LocalStorage updated, remaining transactions:', updatedTransactions.length);
        
        return true;
      } else {
        console.error('❌ Failed to delete from Firebase');
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting transaction from Firebase:', error);
      return false;
    }
  } else {
    console.warn('⚠️ Firebase not configured, deleting from localStorage only');
    
    // Delete from localStorage only
    try {
      const currentTransactions = await getTransactions();
      const updatedTransactions = currentTransactions.filter(t => t.id !== id);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
      console.log('✅ LocalStorage updated, remaining transactions:', updatedTransactions.length);
      return true;
    } catch (error) {
      console.error('❌ Error updating localStorage:', error);
      return false;
    }
  }
};

// Settings
export const getSettings = async (): Promise<any> => {
  console.log('📥 getSettings called');
  console.log('🔧 isFirebaseConfigured:', isFirebaseConfigured());
  
  // Try Firebase first
  if (isFirebaseConfigured()) {
    console.log('🔥 Firebase is configured, fetching from Firebase...');
    try {
      const firebaseSettings = await settingsService.get();
      console.log('📦 Firebase settings:', firebaseSettings);
      
      if (firebaseSettings) {
        // Cache to localStorage
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(firebaseSettings));
        console.log('✅ Settings cached to localStorage');
        return firebaseSettings;
      } else {
        console.warn('⚠️ No settings found in Firebase');
      }
    } catch (error) {
      console.error('❌ Error fetching settings from Firebase:', error);
    }
  } else {
    console.warn('⚠️ Firebase is NOT configured');
  }
  
  // Fallback to localStorage
  const data = localStorage.getItem(SETTINGS_KEY);
  if (data) {
    console.log('✅ Settings loaded from localStorage fallback');
    return JSON.parse(data);
  }
  
  console.warn('⚠️ No settings found anywhere');
  return null;
};

export const saveSettings = async (settings: any): Promise<boolean> => {
  console.log('💾 saveSettings called from store.ts');
  console.log('📦 Settings object:', settings);
  
  // Save to localStorage first (for immediate UI update)
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  console.log('✅ Settings saved to localStorage');
  
  // Save to Firebase
  if (isFirebaseConfigured()) {
    console.log('🔥 Firebase is configured, calling settingsService.save...');
    try {
      const result = await settingsService.save(settings);
      console.log('📊 settingsService.save result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error saving settings to Firebase:', error);
      return false;
    }
  } else {
    console.warn('⚠️ Firebase is NOT configured, only saving to localStorage');
  }
  
  return true;
};

// Firebase Real-time Subscriptions
export const subscribeToMenu = (callback: (items: MenuItem[]) => void) => {
  if (!isFirebaseConfigured()) return () => {};
  return menuService.subscribe(callback);
};

export const subscribeToTransactions = (callback: (transactions: Transaction[]) => void) => {
  if (!isFirebaseConfigured()) return () => {};
  return transactionService.subscribe(callback);
};

export const subscribeToSettings = (callback: (settings: any) => void) => {
  if (!isFirebaseConfigured()) return () => {};
  return settingsService.subscribe(callback);
};

// Utility functions
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

// Check Firebase status
export const getFirebaseStatus = () => {
  return {
    configured: isFirebaseConfigured(),
    mode: isFirebaseConfigured() ? 'Firebase' : 'localStorage'
  };
};

// Manual test function for debugging - can be called from browser console
export const testSettingsSync = async () => {
  console.log('🧪 === MANUAL SETTINGS SYNC TEST ===');
  console.log('🔧 isFirebaseConfigured:', isFirebaseConfigured());
  
  if (!isFirebaseConfigured()) {
    console.error('❌ Firebase is not configured!');
    return;
  }
  
  console.log('📥 Step 1: Loading current settings...');
  const currentSettings = await getSettings();
  console.log('📦 Current settings:', currentSettings);
  
  console.log('📝 Step 2: Creating test settings...');
  const testSettings = {
    storeName: 'Test Store ' + Date.now(),
    storeTagline: 'Test Tagline',
    storeAddress: 'Test Address',
    storePhone: '123456789',
    storeLogo: '',
    printerConnection: 'bluetooth',
    printerPaperSize: '80mm',
    testTimestamp: new Date().toISOString(),
  };
  
  console.log('📤 Step 3: Saving test settings to Firebase...');
  const success = await saveSettings(testSettings);
  console.log('📥 Save result:', success);
  
  if (success) {
    console.log('✅ Step 4: Verifying settings were saved...');
    const verifySettings = await getSettings();
    console.log('🔍 Verified settings:', verifySettings);
    
    if (verifySettings && verifySettings.storeName === testSettings.storeName) {
      console.log('✅✅✅ SETTINGS SYNC IS WORKING! ✅✅✅');
    } else {
      console.error('❌ Settings were saved but verification failed!');
    }
  } else {
    console.error('❌ Failed to save settings!');
  }
  
  console.log('🧪 === TEST COMPLETE ===');
};

// Export to window for console access
if (typeof window !== 'undefined') {
  (window as any).testSettingsSync = testSettingsSync;
}
