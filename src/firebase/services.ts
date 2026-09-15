import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './config';
import { MenuItem, Transaction } from '../types';

// Menu Operations
export const menuService = {
  // Get all menu items
  getAll: async (): Promise<MenuItem[]> => {
    if (!isFirebaseConfigured()) return [];
    
    try {
      const menuCollection = collection(db, 'menu');
      const querySnapshot = await getDocs(menuCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
    } catch (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
  },

  // Listen to menu changes (real-time)
  subscribe: (callback: (items: MenuItem[]) => void) => {
    if (!isFirebaseConfigured()) return () => {};
    
    const menuCollection = collection(db, 'menu');
    return onSnapshot(menuCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      callback(items);
    });
  },

  // Add new menu item
  add: async (item: Omit<MenuItem, 'id'>): Promise<string | null> => {
    if (!isFirebaseConfigured()) return null;
    
    try {
      const menuCollection = collection(db, 'menu');
      const docRef = await addDoc(menuCollection, item);
      return docRef.id;
    } catch (error) {
      console.error('Error adding menu item:', error);
      return null;
    }
  },

  // Update menu item
  update: async (id: string, item: Partial<MenuItem>): Promise<boolean> => {
    if (!isFirebaseConfigured()) return false;
    
    try {
      const itemDoc = doc(db, 'menu', id);
      await updateDoc(itemDoc, item);
      return true;
    } catch (error) {
      console.error('Error updating menu item:', error);
      return false;
    }
  },

  // Delete menu item
  delete: async (id: string): Promise<boolean> => {
    if (!isFirebaseConfigured()) return false;
    
    try {
      const itemDoc = doc(db, 'menu', id);
      await deleteDoc(itemDoc);
      return true;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }
  },

  // Save all menu items (replace all)
  saveAll: async (items: MenuItem[]): Promise<boolean> => {
    if (!isFirebaseConfigured()) return false;
    
    try {
      // Delete all existing items
      const menuCollection = collection(db, 'menu');
      const querySnapshot = await getDocs(menuCollection);
      
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      
      // Add new items
      const addPromises = items.map(item => {
        const { id, ...itemData } = item;
        return addDoc(menuCollection, itemData);
      });
      await Promise.all(addPromises);
      
      return true;
    } catch (error) {
      console.error('Error saving all menu items:', error);
      return false;
    }
  }
};

// Transaction Operations
export const transactionService = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    if (!isFirebaseConfigured()) return [];
    
    try {
      const transactionCollection = collection(db, 'transactions');
      const q = query(transactionCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  // Listen to transaction changes (real-time)
  subscribe: (callback: (transactions: Transaction[]) => void) => {
    if (!isFirebaseConfigured()) return () => {};
    
    const transactionCollection = collection(db, 'transactions');
    const q = query(transactionCollection, orderBy('date', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      callback(transactions);
    });
  },

  // Add new transaction
  add: async (transaction: Omit<Transaction, 'id'>): Promise<string | null> => {
    if (!isFirebaseConfigured()) return null;
    
    try {
      const transactionCollection = collection(db, 'transactions');
      const docRef = await addDoc(transactionCollection, transaction);
      return docRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  },

  // Update transaction
  update: async (id: string, transaction: Partial<Transaction>): Promise<boolean> => {
    if (!isFirebaseConfigured()) return false;
    
    try {
      const transactionDoc = doc(db, 'transactions', id);
      await updateDoc(transactionDoc, transaction);
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  }
};

// Settings Operations
export const settingsService = {
  // Get settings
  get: async (): Promise<any> => {
    if (!isFirebaseConfigured()) return null;
    
    try {
      const settingsDoc = doc(db, 'settings', 'app');
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(settingsDoc);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  },

  // Save settings
  save: async (settings: any): Promise<boolean> => {
    if (!isFirebaseConfigured()) return false;
    
    try {
      const settingsDoc = doc(db, 'settings', 'app');
      await setDoc(settingsDoc, settings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
};

// Logo Upload
export const logoService = {
  // Upload logo
  upload: async (file: File): Promise<string | null> => {
    if (!isFirebaseConfigured()) return null;
    
    try {
      const storageRef = ref(storage, `logos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  }
};
