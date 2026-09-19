import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './config';
import type { UserAccount } from '../types';

const USERS_COLLECTION = 'users';

export const userService = {
  // Create new user
  createUser: async (user: Omit<UserAccount, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const userDoc = doc(collection(db, USERS_COLLECTION));
      const userData: UserAccount = {
        ...user,
        id: userDoc.id,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(userDoc, userData);
      return userDoc.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async (): Promise<UserAccount[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      const users: UserAccount[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserAccount);
      });
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Get user by username
  getUserByUsername: async (username: string): Promise<UserAccount | null> => {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('username', '==', username)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return querySnapshot.docs[0].data() as UserAccount;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  },

  // Update user
  updateUser: async (userId: string, updates: Partial<UserAccount>): Promise<void> => {
    try {
      const userDoc = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userDoc, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    try {
      const userDoc = doc(db, USERS_COLLECTION, userId);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Update last login
  updateLastLogin: async (userId: string): Promise<void> => {
    try {
      const userDoc = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userDoc, {
        lastLogin: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  },

  // Toggle user active status
  toggleUserActive: async (userId: string, isActive: boolean): Promise<void> => {
    try {
      const userDoc = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userDoc, { isActive });
    } catch (error) {
      console.error('Error toggling user active status:', error);
      throw error;
    }
  },
};
