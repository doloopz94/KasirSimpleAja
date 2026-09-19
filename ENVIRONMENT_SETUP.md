# 🔐 Panduan Keamanan Environment Variables

## ⚠️ PENTING: Jangan Commit Secret ke Git!

File ini berisi panduan untuk mengelola environment variables dengan aman.

---

## 📋 Environment Variables yang Diperlukan

### Firebase Configuration
```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### OpenRouter API
```bash
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## 🚀 Cara Setup di Netlify

### Step 1: Buka Netlify Dashboard
1. Login ke https://app.netlify.com/
2. Pilih project Anda
3. Klik **Site settings** → **Environment variables**

### Step 2: Tambahkan Variables
Klik **Add variable** dan isi satu per satu:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | *(isi dengan API key dari Firebase Console)* |
| `VITE_FIREBASE_AUTH_DOMAIN` | *(isi dengan auth domain dari Firebase)* |
| `VITE_FIREBASE_PROJECT_ID` | *(isi dengan project ID dari Firebase)* |
| `VITE_FIREBASE_STORAGE_BUCKET` | *(isi dengan storage bucket dari Firebase)* |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | *(isi dengan sender ID dari Firebase)* |
| `VITE_FIREBASE_APP_ID` | *(isi dengan app ID dari Firebase)* |
| `VITE_FIREBASE_MEASUREMENT_ID` | *(isi dengan measurement ID dari Firebase)* |
| `OPENROUTER_API_KEY` | *(isi dengan API key dari OpenRouter)* |

### Step 3: Deploy Ulang
Setelah menambahkan semua variables:
1. Klik **Deploys**
2. Klik **Trigger deploy** → **Deploy site**
3. Tunggu deploy selesai

---

## 🔍 Cara Mendapatkan Firebase Config

1. Buka https://console.firebase.google.com/
2. Pilih project Anda
3. Klik ikon ⚙️ (Settings) → **Project settings**
4. Scroll ke bawah → **Your apps**
5. Klik ikon Web (</>) untuk melihat config
6. Copy semua nilai config

**Contoh format:**
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc",
  measurementId: "G-XXX"
};
```

---

## 🛡️ Best Practices

### ✅ DO:
- ✅ Simpan secret di Netlify environment variables
- ✅ Gunakan prefix `VITE_` untuk variables yang perlu diakses di client
- ✅ Gunakan Netlify Functions untuk API calls yang memerlukan secret
- ✅ Review code sebelum commit untuk memastikan tidak ada secret
- ✅ Gunakan `.gitignore` untuk file `.env`

### ❌ DON'T:
- ❌ Jangan commit secret ke Git
- ❌ Jangan hardcode secret di code
- ❌ Jangan share secret di chat/email
- ❌ Jangan gunakan secret yang sama untuk development dan production
- ❌ Jangan tulis secret di dokumentasi

---

## 🔧 Troubleshooting

### Error: "Secret env var detected in build"

**Penyebab:**
Netlify mendeteksi nilai environment variable yang ditandai sebagai "secret" muncul di file code atau dokumentasi.

**Solusi:**
1. Cek file yang disebutkan di error message
2. Ganti nilai actual dengan placeholder (contoh: `your-project-id`)
3. Commit dan push perubahan
4. Netlify akan rebuild otomatis

### Error: "Firebase not configured"

**Penyebab:**
Environment variables belum di-set di Netlify.

**Solusi:**
1. Cek Netlify Dashboard → Environment variables
2. Pastikan semua variables sudah di-set
3. Redeploy site

### Error: "API request failed"

**Penyebab:**
API key salah atau quota habis.

**Solusi:**
1. Cek API key di environment variables
2. Cek quota di dashboard provider (Firebase/OpenRouter)
3. Rotate API key jika perlu

---

## 📚 Dokumentasi Lengkap

- **Firebase Setup:** `FIREBASE_SETUP.md`
- **OpenRouter Setup:** `OPENROUTER_SETUP.md`
- **Netlify Deploy:** `NETLIFY_DEPLOY.md`
- **Troubleshooting:** `TROUBLESHOOTING_FIREBASE.md`

---

## 🆘 Butuh Bantuan?

Jika ada masalah:
1. Cek Netlify deploy logs
2. Cek browser console (F12)
3. Review dokumentasi terkait
4. Pastikan semua environment variables sudah di-set

---

**Keep your secrets safe! 🔐**
