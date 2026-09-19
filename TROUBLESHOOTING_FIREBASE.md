# 🔧 Troubleshooting Firebase Transactions

## Masalah: Transaksi Tidak Masuk ke Firebase

Jika transaksi tidak masuk ke Firebase meskipun rules sudah benar, ikuti langkah troubleshooting berikut:

---

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Hapus orderBy dari Query**
Masalah utama: Query dengan `orderBy('date', 'desc')` membutuhkan **composite index** di Firestore.

**Solusi:** Sort dilakukan di client-side setelah data diambil, tidak perlu index.

```typescript
// ❌ SEBELUM (Butuh index)
const q = query(transactionCollection, orderBy('date', 'desc'));

// ✅ SESUDAH (Tidak butuh index)
const querySnapshot = await getDocs(transactionCollection);
const sorted = transactions.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});
```

### 2. **Tambah Console Logging**
Sekarang ada logging detail untuk debugging:
- 🔥 Menunjukkan proses save dimulai
- ✅ Menunjukkan sukses
- ❌ Menunjukkan error
- ⚠️ Menunjukkan warning

---

## 🔍 Cara Debug Transaksi

### Step 1: Buka Browser Console
1. Tekan **F12** atau **Ctrl+Shift+I** (Windows/Linux)
2. Tekan **Cmd+Option+I** (Mac)
3. Pilih tab **Console**

### Step 2: Buat Transaksi
1. Buat transaksi baru di aplikasi
2. Lihat console log

**Log yang seharusnya muncul:**
```
🔥 Adding transaction to Firebase... {id: "...", items: [...], ...}
✅ Firebase is configured, attempting to save...
✅ Transaction saved to Firebase with ID: abc123xyz
✅ Transaction saved to localStorage
```

### Step 3: Cek Error
Jika ada error, akan muncul seperti:
```
❌ Error adding transaction to Firebase: FirebaseError: ...
```

---

## 🐛 Kemungkinan Error & Solusi

### Error 1: "Missing or insufficient permissions"

**Penyebab:** Rules Firestore belum benar

**Solusi:** Pastikan rules Firestore Anda seperti ini:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /menu/{document=**} {
      allow read, write: if true;
    }
    
    match /transactions/{document=**} {
      allow read, write: if true;  // ← PENTING!
    }
    
    match /settings/{document=**} {
      allow read, write: if true;
    }
    
    match /users/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Error 2: "The query requires an index"

**Penyebab:** Query menggunakan `orderBy` tanpa index

**Solusi:** Sudah diperbaiki! Query sekarang tidak menggunakan `orderBy` lagi.

### Error 3: "Firebase is not configured"

**Penyebab:** Config Firebase belum benar

**Solusi:** 
1. Cek file `src/firebase/config.ts`
2. Pastikan semua field terisi:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### Error 4: "Network request failed"

**Penyebab:** Koneksi internet atau CORS issue

**Solusi:**
1. Cek koneksi internet
2. Cek Firebase Console → project aktif
3. Cek browser tidak memblokir request

---

## 📊 Cek Data di Firebase Console

### Step 1: Buka Firebase Console
- https://console.firebase.google.com/
- Pilih project Anda

### Step 2: Buka Firestore Database
- Menu kiri: **Build** → **Firestore Database**

### Step 3: Cek Collection `transactions`
- Harus ada collection `transactions`
- Klik untuk lihat dokumen
- Setiap transaksi harus ada di sini

### Step 4: Cek Data
Klik salah satu dokumen untuk lihat detail:
```json
{
  "id": "abc123",
  "items": [...],
  "total": 50000,
  "customerName": "Budi",
  "date": "2024-01-15T14:30:00Z",
  ...
}
```

---

## 🧪 Test Manual di Console

Anda bisa test manual di browser console:

```javascript
// Test 1: Cek Firebase configured
import { isFirebaseConfigured } from './firebase/config';
console.log('Firebase configured:', isFirebaseConfigured());

// Test 2: Cek db instance
import { db } from './firebase/config';
console.log('DB instance:', db);

// Test 3: Manual add transaction
import { transactionService } from './firebase/services';
const testTransaction = {
  items: [{ menuItem: { id: '1', name: 'Test', price: 10000 }, quantity: 1, subtotal: 10000 }],
  total: 10000,
  customerName: 'Test Customer',
  paymentMethod: 'cash',
  status: 'paid',
  date: new Date().toISOString()
};

transactionService.add(testTransaction).then(id => {
  console.log('Transaction added with ID:', id);
});
```

---

## 🔄 Force Sync Data

Jika data tidak sync, coba force sync:

### Method 1: Hard Refresh
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Method 2: Clear Cache
1. Buka DevTools (F12)
2. Tab **Application** → **Storage**
3. Click **Clear site data**
4. Refresh halaman

### Method 3: Manual Trigger
Di browser console:
```javascript
// Force reload menu
const menu = await getMenuItems();
console.log('Menu loaded:', menu);

// Force reload transactions
const transactions = await getTransactions();
console.log('Transactions loaded:', transactions);
```

---

## 📋 Checklist Troubleshooting

- [ ] Buka browser console (F12)
- [ ] Buat transaksi baru
- [ ] Cek console log muncul
- [ ] Tidak ada error merah
- [ ] Cek Firebase Console → transactions collection
- [ ] Data transaksi ada di Firebase
- [ ] Rules Firestore sudah include `transactions`
- [ ] Firebase config sudah benar
- [ ] Koneksi internet stabil
- [ ] Hard refresh browser (Ctrl+Shift+R)

---

## 💡 Tips

1. **Selalu cek console** saat ada masalah
2. **Screenshot error** untuk debugging
3. **Test di incognito mode** untuk排除 cache issue
4. **Cek Firebase quota** di Console → Usage
5. **Backup data** secara berkala

---

## 🆘 Jika Masih Bermasalah

1. Screenshot console log (termasuk error)
2. Screenshot Firebase Console → transactions collection
3. Screenshot rules Firestore
4. Share screenshot untuk debugging lebih lanjut

---

**Build berhasil! Push ke Netlify dan test dengan panduan di atas!** 🚀

Jika masih ada masalah, share console log dan screenshot untuk debugging lebih lanjut.
