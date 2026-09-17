import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC9EFmGkqvwDteJ7fMh_ydlTIedi6ydUA",
  authDomain: "dapurku-app.firebaseapp.com",
  projectId: "dapurku-app",
  storageBucket: "dapurku-app.firebasestorage.app",
  messagingSenderId: "911368583365",
  appId: "1:911368583365:web:d172bfca8d7c1990d618ac",
  measurementId: "G-FRTGQCLYVB"
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};

// Initialize Firebase
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const firestoreDb: Firestore = getFirestore(firebaseApp);
const firebaseAuth: Auth = getAuth(firebaseApp);
const firebaseStorage: FirebaseStorage = getStorage(firebaseApp);

// Initialize Analytics only in browser environment
let firebaseAnalytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  firebaseAnalytics = getAnalytics(firebaseApp);
}

// Export instances
export const db = firestoreDb;
export const auth = firebaseAuth;
export const storage = firebaseStorage;
export const analytics = firebaseAnalytics;
