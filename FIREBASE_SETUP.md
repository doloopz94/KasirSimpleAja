# 📋 Panduan Setup Firebase

## 🚀 Langkah Setup Singkat

### 1. Buat Project Firebase
1. Buka https://console.firebase.google.com/
2. Klik "Add Project"
3. Ikuti wizard setup

### 2. Aktifkan Firestore & Storage
- **Firestore Database**: Build → Firestore Database → Create database → Start in test mode
- **Storage**: Build → Storage → Get started → Start in test mode

### 3. Dapatkan Config
1. Project settings → Your apps → Web app
2. Copy semua nilai config

### 4. Setup di Netlify
Tambahkan environment variables di Netlify Dashboard → Site settings → Environment variables:

```
VITE_FIREBASE_API_KEY=[dari Firebase Console]
VITE_FIREBASE_AUTH_DOMAIN=[dari Firebase Console]
VITE_FIREBASE_PROJECT_ID=[dari Firebase Console]
VITE_FIREBASE_STORAGE_BUCKET=[dari Firebase Console]
VITE_FIREBASE_MESSAGING_SENDER_ID=[dari Firebase Console]
VITE_FIREBASE_APP_ID=[dari Firebase Console]
VITE_FIREBASE_MEASUREMENT_ID=[dari Firebase Console]
```

### 5. Setup Rules (Production)
Update Firestore rules di Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## ✅ Verifikasi
- Jalankan app: `npm run dev`
- Cek browser console (F12) - tidak ada error Firebase
- Data akan auto-sync ke Firestore

## 💰 Biaya
Free tier cukup untuk ~500 transaksi/hari
