import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const firestoreDb = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};

// Export instances
export const db = firestoreDb;
export const auth = firebaseAuth;
export const storage = firebaseStorage;
