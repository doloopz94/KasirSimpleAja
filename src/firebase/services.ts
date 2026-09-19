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
  setDoc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './config';
import { MenuItem, Transaction } from '../types';

// Menu Operations
export const menuService = {
  // Get all menu items
  getAll: async (): Promise<MenuItem[]> => {
    if (!isFirebaseConfigured() || !db) return [];
    
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
    if (!isFirebaseConfigured() || !db) return () => {};
    
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
    if (!isFirebaseConfigured() || !db) return null;
    
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
    if (!isFirebaseConfigured() || !db) return false;
    
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
    if (!isFirebaseConfigured() || !db) return false;
    
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
    if (!isFirebaseConfigured() || !db) return false;
    
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
    if (!isFirebaseConfigured() || !db) return [];
    
    try {
      const transactionCollection = collection(db, 'transactions');
      // Remove orderBy to avoid index issues - sort client-side instead
      const querySnapshot = await getDocs(transactionCollection);
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      // Sort by date descending on client-side
      return transactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  // Listen to transaction changes (real-time)
  subscribe: (callback: (transactions: Transaction[]) => void) => {
    if (!isFirebaseConfigured() || !db) return () => {};
    
    const transactionCollection = collection(db, 'transactions');
    // Remove orderBy to avoid index issues - sort client-side instead
    return onSnapshot(transactionCollection, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      // Sort by date descending on client-side
      const sorted = transactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order
      });
      
      callback(sorted);
    });
  },

  // Add new transaction
  add: async (transaction: Omit<Transaction, 'id'>): Promise<string | null> => {
    if (!isFirebaseConfigured() || !db) return null;
    
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
    if (!isFirebaseConfigured() || !db) return false;
    
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
    if (!isFirebaseConfigured() || !db) return null;
    
    try {
      const settingsDoc = doc(db, 'settings', 'app');
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
    if (!isFirebaseConfigured() || !db) return false;
    
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
    if (!isFirebaseConfigured() || !storage) return null;
    
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
