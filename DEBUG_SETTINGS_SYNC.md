# 🔍 Debug Guide: Settings Tidak Sync ke Firebase

## 🐛 Masalah

Settings tidak tersinkronisasi ke Firebase meskipun rules sudah diupdate.

---

## ✅ Solusi: Logging untuk Debugging

Saya sudah menambahkan **detailed logging** di semua layer untuk membantu debugging:

### 1. SettingsPage.tsx
- Log saat tombol "Simpan" diklik
- Log data settings yang akan disimpan
- Log hasil dari saveSettings()

### 2. store.ts - saveSettings()
- Log saat saveSettings dipanggil
- Log apakah Firebase configured
- Log hasil dari settingsService.save()

### 3. firebase/services.ts - settingsService.save()
- Log saat save dipanggil
- Log document reference
- Log success/error dengan detail

### 4. firebase/services.ts - settingsService.get()
- Log saat get dipanggil
- Log apakah document exists
- Log data yang diambil

### 5. store.ts - getSettings()
- Log saat getSettings dipanggil
- Log apakah Firebase configured
- Log data dari Firebase atau localStorage

### 6. App.tsx - loadData()
- Log saat aplikasi dimulai
- Log data yang dimuat (menu, transactions, settings)

---

## 🧪 Cara Testing dengan Logging

### Step 1: Buka Browser Console
1. Buka aplikasi di browser
2. Tekan **F12** untuk buka DevTools
3. Pilih tab **Console**

### Step 2: Test Load Settings (Saat Aplikasi Dibuka)
Saat aplikasi dibuka, Anda akan melihat log seperti ini:

```
🚀 Loading initial data...
✅ Menu loaded: 8 items
✅ Transactions loaded: 5 items
📥 Loading settings from Firebase...
📥 getSettings called
🔧 isFirebaseConfigured: true
🔥 Firebase is configured, fetching from Firebase...
📥 settingsService.get called
🔧 isFirebaseConfigured: true
🗄️ db instance: exists
📄 Fetching document: settings/app
📸 Document exists: false
⚠️ Settings document does not exist in Firebase
⚠️ No settings found in Firebase
✅ Settings loaded from localStorage fallback
📦 Settings loaded: {storeName: "DapurKu", ...}
✅ Settings cached to localStorage
```

**Jika document tidak exists:**
- Ini normal untuk pertama kali
- Settings akan dibuat saat pertama kali save

### Step 3: Test Save Settings
1. Buka Settings → Akun Toko
2. Edit nama toko
3. Klik "Simpan Pengaturan"
4. Cek console log:

```
🖱️ handleSaveSettings clicked
📋 Current storeSettings: {storeName: "New Name", ...}
📤 Calling saveSettings...
💾 saveSettings called from store.ts
📦 Settings object: {storeName: "New Name", ...}
✅ Settings saved to localStorage
🔥 Firebase is configured, calling settingsService.save...
🔥 settingsService.save called
📝 Settings to save: {storeName: "New Name", ...}
🔧 isFirebaseConfigured: true
🗄️ db instance: exists
📄 Document reference created: settings/app
✅ Settings saved to Firebase successfully
📊 settingsService.save result: true
📥 saveSettings returned: true
✅ Logo saved to localStorage separately
✅ Settings saved successfully!
```

### Step 4: Verifikasi di Firebase Console
1. Buka https://console.firebase.google.com/
2. Pilih project
3. Build → Firestore Database
4. Klik tab "Data"
5. Cari collection **settings**
6. Klik document **app**
7. Cek apakah data ter-update

---

## 🔍 Analisis Log

### Jika Log Menunjukkan "Firebase is NOT configured"

**Penyebab:**
- Firebase config belum diisi di `src/firebase/config.ts`
- Environment variables belum di-set di Netlify

**Solusi:**
1. Cek file `src/firebase/config.ts`
2. Pastikan semua field terisi:
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
     // ...
   };
   ```
3. Cek Netlify Dashboard → Environment variables
4. Pastikan semua VITE_FIREBASE_* variables sudah di-set
5. Redeploy site

### Jika Log Menunjukkan "db instance: null"

**Penyebab:**
- Firebase app belum di-initialize
- Ada error saat initialize

**Solusi:**
1. Cek console untuk error saat initialize
2. Cek Firebase config valid
3. Hard refresh browser (Ctrl+Shift+R)

### Jika Log Menunjukkan "Error saving settings to Firebase"

**Penyebab:**
- Firestore rules belum mengizinkan write
- Network error
- Permission denied

**Solusi:**
1. Cek error message detail di console
2. Pastikan Firestore rules sudah di-update:
   ```javascript
   match /settings/{document=**} {
     allow read, write: if true;
   }
   ```
3. Publish rules dan tunggu 1-2 menit
4. Cek koneksi internet

### Jika Log Menunjukkan "Settings saved to Firebase successfully" tapi data tidak muncul di Firebase Console

**Penyebab:**
- Browser cache
- Firebase Console cache
- Data tersimpan di path yang berbeda

**Solusi:**
1. Hard refresh Firebase Console (Ctrl+Shift+R)
2. Cek collection name: harus **settings** (lowercase)
3. Cek document ID: harus **app**
4. Cek browser console untuk error lain

### Jika Log Menunjukkan "Document exists: false" saat get

**Penyebab:**
- Settings belum pernah di-save ke Firebase
- Document dihapus manual

**Solusi:**
1. Ini normal untuk pertama kali
2. Save settings dari aplikasi
3. Document akan dibuat otomatis

---

## 📋 Checklist Debugging

### 1. Cek Console Log
- [ ] Buka browser console (F12)
- [ ] Test load settings saat aplikasi dibuka
- [ ] Test save settings dari SettingsPage
- [ ] Cek semua log muncul dengan benar

### 2. Cek Firebase Config
- [ ] File `src/firebase/config.ts` sudah terisi
- [ ] Environment variables sudah di-set di Netlify
- [ ] `isFirebaseConfigured()` return `true`

### 3. Cek Firestore Rules
- [ ] Rules sudah di-update
- [ ] Collection `settings` diizinkan read/write
- [ ] Rules sudah di-publish
- [ ] Tunggu 1-2 menit setelah publish

### 4. Cek Firebase Console
- [ ] Collection `settings` ada
- [ ] Document `app` ada
- [ ] Data ter-update setelah save
- [ ] Hard refresh Firebase Console

### 5. Cek Network
- [ ] Koneksi internet stabil
- [ ] Tidak ada CORS error
- [ ] Firebase API accessible

---

## 🎯 Expected Flow

### Saat Aplikasi Dibuka:
```
1. App.tsx loadData() dipanggil
2. getSettings() dipanggil
3. settingsService.get() dipanggil
4. Fetch dari Firebase → settings/app
5. Jika ada → return data
6. Jika tidak ada → fallback ke localStorage
7. Cache ke localStorage
```

### Saat Save Settings:
```
1. User klik "Simpan Pengaturan"
2. handleSaveSettings() dipanggil
3. saveSettings() dipanggil
4. Save ke localStorage (immediate)
5. settingsService.save() dipanggil
6. Save ke Firebase → settings/app
7. Return success/failure
8. Show success message
```

### Saat Real-time Sync:
```
1. Device A save settings
2. Firebase update document
3. Device B subscribeToSettings() detect change
4. Update localStorage cache
5. Force reload halaman
6. Settings ter-update di Device B
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Firebase is NOT configured"

**Log:**
```
⚠️ Firebase is NOT configured, only saving to localStorage
```

**Solusi:**
1. Cek `src/firebase/config.ts`
2. Pastikan semua field terisi
3. Cek environment variables di Netlify
4. Redeploy site

### Issue 2: "db instance: null"

**Log:**
```
🗄️ db instance: null
```

**Solusi:**
1. Cek Firebase config valid
2. Cek console untuk error saat initialize
3. Hard refresh browser

### Issue 3: "Permission denied"

**Log:**
```
❌ Error saving settings to Firebase: FirebaseError: Missing or insufficient permissions
```

**Solusi:**
1. Update Firestore rules
2. Publish rules
3. Tunggu 1-2 menit
4. Retry save

### Issue 4: "Document does not exist"

**Log:**
```
⚠️ Settings document does not exist in Firebase
```

**Solusi:**
1. Ini normal untuk pertama kali
2. Save settings dari aplikasi
3. Document akan dibuat otomatis

### Issue 5: Settings tersimpan tapi tidak sync

**Log:**
```
✅ Settings saved to Firebase successfully
```
Tapi data tidak muncul di device lain.

**Solusi:**
1. Cek subscribeToSettings() aktif
2. Cek console untuk subscription log
3. Hard refresh device lain
4. Cek Firebase Console → data ter-update

---

## 📊 Debug Commands

### Cek Firebase Config di Console
```javascript
// Di browser console
import { isFirebaseConfigured } from './firebase/config';
console.log('Firebase configured:', isFirebaseConfigured());
```

### Cek LocalStorage
```javascript
// Di browser console
console.log('Settings:', JSON.parse(localStorage.getItem('dapurku_settings')));
console.log('Logo:', localStorage.getItem('dapurku_logo'));
```

### Manual Save ke Firebase
```javascript
// Di browser console
import { saveSettings } from './store';

const testSettings = {
  storeName: 'Test Store',
  storeTagline: 'Test Tagline',
  // ... other settings
};

saveSettings(testSettings).then(result => {
  console.log('Save result:', result);
});
```

### Manual Load dari Firebase
```javascript
// Di browser console
import { getSettings } from './store';

getSettings().then(settings => {
  console.log('Loaded settings:', settings);
});
```

---

## 📚 Related Documentation

- [Firestore Rules Settings](./FIRESTORE_RULES_SETTINGS.md)
- [Firebase Setup](./FIREBASE_SETUP.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES_SETUP.md)
- [Bug Fix v1.9.1](./BUGFIX_V1.9.1.md)

---

## 🎯 Next Steps

1. **Push code dengan logging** ke GitHub
2. **Deploy ke Netlify**
3. **Buka browser console** (F12)
4. **Test save settings**
5. **Share console log** jika masih ada masalah

---

**Status:** ✅ Logging Added  
**Next:** Test dan share console log jika masih ada masalah
