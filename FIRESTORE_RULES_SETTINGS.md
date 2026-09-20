# 🔥 Firestore Rules untuk Settings Sync

## ⚠️ Masalah: Settings Tidak Sync ke Firebase

Jika settings tidak tersinkronisasi ke Firebase, kemungkinan besar **Firestore Rules** belum mengizinkan akses ke collection `settings`.

---

## ✅ Solusi: Update Firestore Rules

### Step 1: Buka Firebase Console

1. Login ke https://console.firebase.google.com/
2. Pilih project Anda
3. Klik menu kiri: **Build** → **Firestore Database**

### Step 2: Buka Tab Rules

1. Klik tab **"Rules"** di bagian atas
2. Anda akan melihat rules saat ini

### Step 3: Update Rules

**Ganti rules Anda dengan ini:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Menu collection - allow all operations
    match /menu/{document=**} {
      allow read, write: if true;
    }
    
    // Transactions collection - allow all operations
    match /transactions/{document=**} {
      allow read, write, delete: if true;
    }
    
    // Settings collection - allow all operations
    match /settings/{document=**} {
      allow read, write: if true;
    }
    
    // Users collection - allow all operations
    match /users/{document=**} {
      allow read, write, delete: if true;
    }
    
  }
}
```

### Step 4: Publish Rules

1. Klik tombol **"Publish"** di pojok kanan atas
2. Tunggu beberapa detik
3. Rules akan aktif

---

## 🔍 Cara Cek Apakah Rules Sudah Benar

### Method 1: Test Manual di Firebase Console

1. Buka Firestore Database
2. Klik tab **"Data"**
3. Cek apakah ada collection `settings`
4. Jika tidak ada, klik **"+ Start collection"**
5. Nama collection: `settings`
6. Document ID: `app`
7. Tambahkan field test:
   - Field: `test`
   - Type: `string`
   - Value: `test`
8. Klik **"Save"**
9. Jika berhasil → rules sudah benar ✅

### Method 2: Test dari Aplikasi

1. Buka aplikasi
2. Buka Settings → Akun Toko
3. Edit nama toko
4. Klik "Simpan Pengaturan"
5. Buka browser console (F12)
6. Cek log:
   ```
   ✅ Settings saved to Firebase
   ```
7. Buka Firebase Console → Firestore → settings
8. Cek apakah document `app` ter-update
9. Jika ter-update → rules sudah benar ✅

---

## 🐛 Troubleshooting

### Error: "Missing or insufficient permissions"

**Penyebab:** Rules belum mengizinkan write ke collection settings

**Solusi:**
1. Update rules seperti di atas
2. Publish rules
3. Tunggu 1-2 menit
4. Retry save settings

### Error: "Collection not found"

**Penyebab:** Collection `settings` belum dibuat

**Solusi:**
1. Buka Firebase Console → Firestore Database
2. Klik **"+ Start collection"**
3. Nama: `settings`
4. Document ID: `app`
5. Tambahkan field kosong dulu
6. Save

### Error: "Network error"

**Penyebab:** Koneksi internet atau Firebase config salah

**Solusi:**
1. Cek koneksi internet
2. Cek Firebase config di `src/firebase/config.ts`
3. Cek browser console untuk detail error
4. Hard refresh browser (Ctrl+Shift+R)

### Settings tersimpan tapi tidak sync ke device lain

**Penyebab:** Real-time subscription tidak aktif

**Solusi:**
1. Cek browser console untuk log subscription
2. Hard refresh browser
3. Cek Firebase Console → settings → data ter-update
4. Buka device lain → hard refresh

---

## 📊 Structure Data di Firebase

### Collection: `settings`

**Document ID:** `app`

**Fields:**
```javascript
{
  storeName: "DapurKu",
  storeTagline: "Makanan Rumahan Online",
  storeAddress: "Jl. Contoh No. 123",
  storePhone: "0812-3456-7890",
  storeLogo: "data:image/png;base64,...",
  printerConnection: "bluetooth",
  printerPaperSize: "80mm",
  qrisMerchantName: "DAPURKU",
  qrisMerchantId: "ID123",
  receiptShowLogo: true,
  receiptShowStoreName: true,
  // ... other settings
}
```

---

## 🧪 Testing Checklist

### 1. Test Rules
- [ ] Update Firestore rules
- [ ] Publish rules
- [ ] Tunggu 1-2 menit
- [ ] Test create document di Firebase Console

### 2. Test Save Settings
- [ ] Buka aplikasi
- [ ] Edit settings
- [ ] Klik "Simpan Pengaturan"
- [ ] Cek Firebase Console → settings
- [ ] Data ter-update

### 3. Test Real-time Sync
- [ ] Buka aplikasi di device A
- [ ] Buka aplikasi di device B
- [ ] Edit settings di device A
- [ ] Cek device B → settings otomatis ter-update

### 4. Test Load Settings
- [ ] Edit settings di Firebase Console manual
- [ ] Refresh aplikasi
- [ ] Settings ter-load dari Firebase

---

## 🔐 Security Notes

**Rules saat ini:**
```javascript
allow read, write: if true;
```

**Artinya:**
- ✅ Semua orang bisa read dan write
- ✅ Mudah untuk development
- ❌ Tidak aman untuk production

**Untuk Production (Optional):**

Jika ingin lebih aman, gunakan rules dengan authentication:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Only authenticated users can read/write
    match /settings/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /menu/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /transactions/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{document=**} {
      allow read, write: if request.auth != null;
    }
    
  }
}
```

**Tapi untuk sekarang,** gunakan `if true` dulu agar mudah testing. Nanti bisa di-update ke rules yang lebih aman setelah semua fitur berjalan.

---

## 📚 Related Documentation

- [Firebase Setup](./FIREBASE_SETUP.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES_SETUP.md)
- [Bug Fix v1.9.1](./BUGFIX_V1.9.1.md)

---

## 🎯 Quick Fix Steps

```bash
# 1. Buka Firebase Console
https://console.firebase.google.com/

# 2. Pilih project → Firestore Database → Rules

# 3. Paste rules ini:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menu/{document=**} {
      allow read, write: if true;
    }
    match /transactions/{document=**} {
      allow read, write, delete: if true;
    }
    match /settings/{document=**} {
      allow read, write: if true;
    }
    match /users/{document=**} {
      allow read, write, delete: if true;
    }
  }
}

# 4. Klik "Publish"

# 5. Tunggu 1-2 menit

# 6. Test save settings dari aplikasi

# 7. Cek Firebase Console → settings → data ter-update
```

---

**Status:** ✅ Rules Updated  
**Testing:** Required  
**Next Step:** Update rules di Firebase Console dan test!
