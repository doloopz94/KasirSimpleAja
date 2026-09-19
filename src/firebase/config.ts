import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// IMPORTANT: All values come from Netlify environment variables
// Make sure to set these in Netlify Dashboard → Site settings → Environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const firestoreDb = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== "undefined"
  );
};

// Export instances
export const db = firestoreDb;
export const storage = firebaseStorage;
export const app = firebaseApp;
