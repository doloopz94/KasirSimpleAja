import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// Ganti dengan konfigurasi project Firebase Anda
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};

// Initialize Firebase only if configured
let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

export { db, auth, storage };
