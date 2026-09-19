# 📋 Panduan Setup Firebase untuk DapurKu

## 🚀 Langkah-langkah Setup

### 1. Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add Project"** atau **"Buat Project"**
3. Masukkan nama project (contoh: `your-project-name`)
4. Nonaktifkan Google Analytics (opsional)
5. Klik **"Create Project"**

### 2. Aktifkan Firestore Database

1. Di sidebar kiri, klik **"Build"** → **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** (untuk development)
4. Pilih lokasi server (pilih `asia-southeast2` untuk Singapore/Jakarta)
5. Klik **"Enable"**

### 3. Aktifkan Storage

1. Di sidebar kiri, klik **"Build"** → **"Storage"**
2. Klik **"Get Started"**
3. Pilih **"Start in test mode"**
4. Klik **"Done"**

### 4. Dapatkan Konfigurasi Firebase

1. Klik ikon **⚙️ (Settings)** di kiri atas
2. Pilih **"Project settings"**
3. Scroll ke bawah ke bagian **"Your apps"**
4. Klik ikon **Web (</>)** untuk menambahkan web app
5. Masukkan nama app (contoh: `DapurKu Web`)
6. Klik **"Register app"**
7. **COPY** konfigurasi yang muncul (seperti di bawah ini):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Update File Konfigurasi

1. Buka file `src/firebase/config.ts`
2. Ganti nilai konfigurasi dengan yang Anda copy:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", // Ganti dengan API key Anda
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Save file

### 6. Setup Security Rules (Production)

Untuk production, update Firestore rules:

1. Buka **Firestore Database** → **Rules**
2. Ganti dengan rules berikut:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Menu items - read for all, write for authenticated
    match /menu/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Transactions - only authenticated users
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
    
    // Settings - only authenticated users
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Klik **"Publish"**

### 7. Setup Storage Rules (Production)

1. Buka **Storage** → **Rules**
2. Ganti dengan rules berikut:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /logos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Klik **"Publish"**

### 8. (Opsional) Setup Authentication

Jika ingin menggunakan Firebase Auth:

1. Buka **Build** → **Authentication**
2. Klik **"Get started"**
3. Enable **"Email/Password"** provider
4. Klik **"Save"**

### 9. Deploy ke Firebase Hosting (Opsional)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login ke Firebase:
```bash
firebase login
```

3. Initialize project:
```bash
firebase init hosting
```

4. Pilih:
   - Project: `your-project-name`
   - Public directory: `dist`
   - Single-page app: `Yes`
   - GitHub deploys: `No`

5. Build app:
```bash
npm run build
```

6. Deploy:
```bash
firebase deploy
```

7. App akan tersedia di: `https://your-project-name.web.app`

---

## ✅ Verifikasi Setup

Setelah setup selesai:

1. Jalankan app: `npm run dev`
2. Buka browser console (F12)
3. Cek tidak ada error Firebase
4. Data akan otomatis sync ke Firestore

---

## 🔄 Migrasi Data dari localStorage

Jika sudah ada data di localStorage:

1. Buka app
2. Data lama tetap bisa diakses (fallback ke localStorage)
3. Untuk migrasi manual:
   - Export data dari localStorage (bisa pakai browser dev tools)
   - Import ke Firestore via Firebase Console

---

## 💰 Biaya Firebase

**Free Tier (Spark Plan):**
- Firestore: 50K reads/day, 20K writes/day
- Storage: 5GB storage, 1GB download/day
- Hosting: 10GB transfer/month
- Authentication: Unlimited

**Cukup untuk:**
- ~100-500 transaksi/hari
- ~1000 menu items
- ~5GB gambar/logo

**Jika butuh lebih:**
- Upgrade ke Blaze Plan (pay-as-you-go)
- Biaya sangat murah untuk UMKM

---

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"
- Cek Firestore rules sudah di-setup
- Pastikan rules sudah di-publish

### Error: "Firebase not configured"
- Cek file `src/firebase/config.ts`
- Pastikan semua nilai sudah diisi (bukan "YOUR_...")

### Data tidak sync
- Cek koneksi internet
- Cek browser console untuk error
- Pastikan Firestore database sudah enabled

### Logo tidak upload
- Cek Storage sudah enabled
- Cek Storage rules
- Pastikan file < 2MB dan format image

---

## 📞 Support

Jika ada masalah:
1. Cek Firebase Console untuk error logs
2. Cek browser console untuk error messages
3. Review dokumentasi Firebase: https://firebase.google.com/docs

---

**Selamat! App DapurKu Anda sekarang menggunakan Firebase! 🎉**
