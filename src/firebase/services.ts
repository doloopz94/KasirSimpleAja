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
      const transactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // CRITICAL FIX: Use doc.id as the ID, remove 'id' field from data if exists
        // This ensures consistency between Firebase document ID and transaction ID
        const { id: dataId, ...restData } = data;
        return {
          id: doc.id, // Always use Firebase document ID
          ...restData
        } as Transaction;
      });
      
      console.log('📊 Loaded transactions from Firebase:', transactions.length);
      console.log('Transaction IDs:', transactions.map(t => t.id));
      
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
      const transactions = snapshot.docs.map(doc => {
        const data = doc.data();
        // CRITICAL FIX: Use doc.id as the ID, remove 'id' field from data if exists
        const { id: dataId, ...restData } = data;
        return {
          id: doc.id, // Always use Firebase document ID
          ...restData
        } as Transaction;
      });
      
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
    if (!isFirebaseConfigured() || !db) {
      console.warn('⚠️ Firebase not configured or db is null');
      return null;
    }
    
    try {
      console.log('📝 Preparing to save transaction to Firebase...');
      
      const transactionCollection = collection(db, 'transactions');
      
      // CRITICAL FIX: Remove 'id' field from data before saving
      // This prevents ID mismatch between localStorage and Firebase
      const { id, ...transactionData } = transaction as any;
      
      // Clean data - remove undefined values
      const cleanData = JSON.parse(JSON.stringify(transactionData));
      console.log('Clean data to save (id removed):', cleanData);
      
      const docRef = await addDoc(transactionCollection, cleanData);
      console.log('✅ Transaction saved with Firebase document ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ Error adding transaction to Firebase:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
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
  },

  // Delete transaction
  delete: async (id: string): Promise<boolean> => {
    if (!isFirebaseConfigured() || !db) {
      console.warn('⚠️ Firebase not configured or db is null');
      return false;
    }
    
    try {
      console.log('🗑️ Attempting to delete transaction from Firebase, ID:', id);
      
      // First, verify the document exists
      const { getDoc } = await import('firebase/firestore');
      const transactionDoc = doc(db, 'transactions', id);
      const docSnap = await getDoc(transactionDoc);
      
      if (!docSnap.exists()) {
        console.warn('⚠️ Transaction document does not exist in Firebase, ID:', id);
        return true; // Consider it success if already deleted
      }
      
      // Delete the document
      await deleteDoc(transactionDoc);
      console.log('✅ Transaction deleted from Firebase successfully, ID:', id);
      
      return true;
    } catch (error) {
      console.error('❌ Error deleting transaction from Firebase:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      return false;
    }
  }
};

// Settings Operations
export const settingsService = {
  // Get settings
  get: async (): Promise<any> => {
    console.log('📥 settingsService.get called');
    console.log('🔧 isFirebaseConfigured:', isFirebaseConfigured());
    console.log('🗄️ db instance:', db ? 'exists' : 'null');
    
    if (!isFirebaseConfigured() || !db) {
      console.warn('⚠️ Firebase not configured or db is null');
      return null;
    }
    
    try {
      const settingsDoc = doc(db, 'settings', 'app');
      console.log('📄 Fetching document:', settingsDoc.path);
      
      const docSnap = await getDoc(settingsDoc);
      console.log('📸 Document exists:', docSnap.exists());
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Settings retrieved from Firebase:', data);
        return data;
      }
      
      console.warn('⚠️ Settings document does not exist in Firebase');
      return null;
    } catch (error) {
      console.error('❌ Error getting settings from Firebase:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      return null;
    }
  },

  // Save settings
  save: async (settings: any): Promise<boolean> => {
    console.log('🔥 settingsService.save called');
    console.log('📝 Settings to save:', settings);
    console.log('🔧 isFirebaseConfigured:', isFirebaseConfigured());
    console.log('🗄️ db instance:', db ? 'exists' : 'null');
    
    if (!isFirebaseConfigured() || !db) {
      console.warn('⚠️ Firebase not configured or db is null');
      return false;
    }
    
    try {
      const settingsDoc = doc(db, 'settings', 'app');
      console.log('📄 Document reference created:', settingsDoc.path);
      
      await setDoc(settingsDoc, settings);
      console.log('✅ Settings saved to Firebase successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving settings to Firebase:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      return false;
    }
  },

  // Subscribe to settings changes (real-time)
  subscribe: (callback: (settings: any) => void) => {
    if (!isFirebaseConfigured() || !db) return () => {};
    
    const settingsDoc = doc(db, 'settings', 'app');
    return onSnapshot(settingsDoc, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    });
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
