# 🔐 Setup Environment Variables untuk Firebase

## ⚠️ Masalah Keamanan

GitHub mendeteksi Firebase API key (`AIzaSyDC9EFmGkqvwDteJ7fMh_ydlTIedi6ydUA`) di code dan memberikan warning. Meskipun Firebase API key untuk web app memang public by design, kita akan memindahkannya ke environment variables untuk best practice keamanan.

## ✅ Solusi: Gunakan Environment Variables

### Step 1: Setup di Netlify

1. **Buka Netlify Dashboard**
   - Login ke https://app.netlify.com/
   - Pilih site Anda

2. **Tambah Environment Variables**
   - Klik **Site settings** → **Environment variables**
   - Klik **Add variable**
   - Tambahkan satu per satu:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyDC9EFmGkqvwDteJ7fMh_ydlTIedi6ydUA` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `dapurku-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `dapurku-app` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `dapurku-app.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `911368583365` |
| `VITE_FIREBASE_APP_ID` | `1:911368583365:web:d172bfca8d7c1990d618ac` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-FRTGQCLYVB` |

3. **Save** semua variables

### Step 2: Redeploy Site

Setelah menambahkan environment variables:

1. Klik tab **Deploys**
2. Klik **Trigger deploy** → **Deploy site**
3. Tunggu 2-3 menit sampai deploy selesai

### Step 3: Verifikasi

1. Buka site Anda
2. Buka browser console (F12)
3. Cek tidak ada error Firebase
4. Data harus ter-sync ke Firestore

## 📝 Kode yang Sudah Diupdate

File `src/firebase/config.ts` sudah diupdate untuk menggunakan environment variables:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};
```

**Keuntungan:**
- ✅ Tidak ada API key yang ter-hardcode di code
- ✅ Tidak ada warning dari GitHub
- ✅ Lebih aman dan flexible
- ✅ Mudah ganti config tanpa edit code

## 🔍 Cara Cek Apakah Berhasil

### Method 1: Cek di Browser Console

1. Buka site Anda
2. Tekan F12 untuk buka DevTools
3. Pilih tab **Console**
4. Ketik:
   ```javascript
   console.log(import.meta.env.VITE_FIREBASE_API_KEY)
   ```
5. Harus muncul API key Anda

### Method 2: Cek di Netlify

1. Buka Netlify Dashboard
2. Klik tab **Deploys**
3. Klik deploy terbaru
4. Cek **Deploy log**
5. Harus ada: `✓ Deploy is ready`

### Method 3: Test Fungsi

1. Buat transaksi baru
2. Cek Firebase Console → Firestore Database
3. Data harus muncul di collection `transactions`

## 🐛 Troubleshooting

### Error: "Firebase not configured"

**Penyebab:** Environment variables belum di-set atau belum redeploy

**Solusi:**
1. Cek Netlify Dashboard → Environment variables
2. Pastikan semua variables sudah di-set
3. Redeploy site
4. Hard refresh browser (Ctrl+Shift+R)

### Error: "Missing or insufficient permissions"

**Penyebab:** Firestore Rules belum di-setup

**Solusi:**
1. Buka Firebase Console
2. Firestore Database → Rules
3. Paste rules ini:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
4. Klik **Publish**

### API key masih terdeteksi GitHub

**Penyebab:** Code lama masih ada di Git history

**Solusi:**
1. Pastikan file `src/firebase/config.ts` sudah di-commit dengan perubahan terbaru
2. Push ke GitHub
3. Tunggu Netlify auto-deploy
4. GitHub akan scan ulang dan tidak detect API key lagi

## 📊 Perbandingan: Sebelum vs Sesudah

### Sebelum (Hardcoded)
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDC9EFmGkqvwDteJ7fMh_ydlTIedi6ydUA",
  authDomain: "dapurku-app.firebaseapp.com",
  // ...
};
```
❌ API key terlihat di code  
❌ GitHub warning  
❌ Sulit ganti config  

### Sesudah (Environment Variables)
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  // ...
};
```
✅ API key tidak terlihat di code  
✅ Tidak ada GitHub warning  
✅ Mudah ganti config  
✅ Best practice keamanan  

## 🎯 Checklist Setup

- [ ] Buka Netlify Dashboard
- [ ] Tambah semua environment variables
- [ ] Save variables
- [ ] Trigger redeploy
- [ ] Tunggu deploy selesai
- [ ] Test site di browser
- [ ] Cek console tidak ada error
- [ ] Test buat transaksi
- [ ] Cek Firebase Console data masuk
- [ ] Push code terbaru ke GitHub

## 📚 Dokumentasi Terkait

- [Firebase Setup](./FIREBASE_SETUP.md)
- [Netlify Deploy](./NETLIFY_DEPLOY.md)
- [Troubleshooting](./TROUBLESHOOTING_FIREBASE.md)

## 💡 Tips

1. **Jangan commit `.env` file** - Sudah ada di `.gitignore`
2. **Gunakan `.env.example`** - Sebagai template untuk tim
3. **Rotate API key secara berkala** - Untuk keamanan ekstra
4. **Monitor usage** - Cek Firebase Console → Usage
5. **Backup data** - Export data secara berkala

---

**Status:** ✅ Ready to deploy  
**Last Updated:** 2024
