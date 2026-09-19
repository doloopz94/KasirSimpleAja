# 🚀 Deploy DapurKu ke Netlify

Panduan lengkap deploy aplikasi DapurKu ke Netlify dengan environment variables.

---

## 📋 Persiapan

### 1. Build Aplikasi
```bash
npm run build
```

Folder `dist` akan dibuat dengan file hasil build.

### 2. Test Local (Opsional)
```bash
npm run preview
```

Buka http://localhost:4173 untuk test hasil build.

---

## 🌐 Deploy ke Netlify

### **Method 1: Drag & Drop (Paling Mudah)**

1. Buka [Netlify](https://app.netlify.com/)
2. Login / Sign up
3. Di dashboard, cari area **"Deploy manually"**
4. Drag folder `dist` ke area tersebut
5. Tunggu upload selesai (~30 detik)
6. ✅ Selesai! App live di URL Netlify

**Catatan:**
- URL akan seperti: `https://random-name-12345.netlify.app`
- Bisa ganti nama di Site settings

---

### **Method 2: Git Integration (Recommended)**

#### Step 1: Push Code ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit"

# Buat repo di GitHub, lalu:
git remote add origin https://github.com/username/dapurku.git
git push -u origin main
```

#### Step 2: Connect GitHub ke Netlify

1. Buka [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub**
4. Authorize Netlify akses ke repo
5. Pilih repo `dapurku`
6. Configure:
   - **Branch:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click **"Deploy site"**

#### Step 3: Setup Environment Variables

1. Di Netlify dashboard, buka site Anda
2. Go to **Site settings** → **Environment variables**
3. Click **"Add variable"**
4. Tambahkan semua Firebase config:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` (dari Firebase Console) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project-id.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123` |

5. Click **"Save"**
6. **Redeploy** site:
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

---

### **Method 3: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Setup env variables
netlify env:set VITE_FIREBASE_API_KEY "your-api-key"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "your-project.firebaseapp.com"
netlify env:set VITE_FIREBASE_PROJECT_ID "your-project-id"
netlify env:set VITE_FIREBASE_STORAGE_BUCKET "your-project.appspot.com"
netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "your-sender-id"
netlify env:set VITE_FIREBASE_APP_ID "your-app-id"

# Deploy
netlify deploy --prod
```

---

## 🔧 Setup Environment Variables

### **Cara Dapatkan Firebase Config:**

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Click ⚙️ **Settings** → **Project settings**
4. Scroll ke **"Your apps"**
5. Pilih web app (atau buat baru)
6. Copy semua nilai config

### **Format Environment Variables:**

```bash
VITE_FIREBASE_API_KEY=AIzaSyB........................
VITE_FIREBASE_AUTH_DOMAIN=dapurku-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dapurku-app
VITE_FIREBASE_STORAGE_BUCKET=dapurku-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

**⚠️ Penting:**
- Prefix **harus** `VITE_` agar bisa diakses di client-side
- Jangan pakai spasi di sekitar `=`
- Jangan pakai quotes

---

## 🎨 Custom Domain (Opsional)

### Setup Custom Domain:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Masukkan domain Anda (contoh: `dapurku.com`)
4. Follow instruksi DNS:
   - **Option A:** Netlify DNS (recommended)
   - **Option B:** Pakai DNS provider sendiri

### Enable HTTPS:

1. Go to **Domain management** → **HTTPS**
2. Click **"Verify DNS configuration"**
3. Netlify akan auto-generate SSL certificate (Let's Encrypt)
4. ✅ HTTPS aktif otomatis!

---

## 🔄 Auto Deploy dari GitHub

Setiap kali push ke GitHub, Netlify akan auto-deploy:

```bash
# Edit code
git add .
git commit -m "Update fitur"
git push origin main

# ✅ Netlify auto-deploy dalam ~1 menit
```

### Branch Deployments:

- `main` → Production
- `develop` → Staging (opsional)
- Pull requests → Preview deploys

---

## 📊 Monitoring & Logs

### View Deploy Logs:
1. Go to **Deploys** tab
2. Click deploy yang ingin dilihat
3. Lihat **Deploy log** untuk error/warnings

### Function Logs (jika pakai Netlify Functions):
1. Go to **Functions** tab
2. Click function
3. View logs

---

## 🐛 Troubleshooting

### Error: "Failed to compile"
```bash
# Check build local dulu
npm run build

# Fix error, lalu push lagi
git add .
git commit -m "Fix build error"
git push
```

### Error: "Firebase not configured"
- ✅ Check env variables sudah di-set di Netlify
- ✅ Redeploy setelah add env variables
- ✅ Check prefix `VITE_` sudah benar

### Error: "Page not found" (404)
- ✅ Check **Publish directory** = `dist`
- ✅ Tambahkan file `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Env Variables tidak ter-apply
- ✅ Redeploy site setelah add env variables
- ✅ Clear browser cache
- ✅ Check build logs untuk verify env loaded

---

## 📝 netlify.toml (Optional)

Buat file `netlify.toml` di root project untuk konfigurasi advanced:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

---

## ✅ Checklist Deploy

- [ ] Build local sukses (`npm run build`)
- [ ] Firebase config sudah di-setup
- [ ] Environment variables sudah di-add di Netlify
- [ ] Redeploy setelah add env variables
- [ ] Test semua fitur di production
- [ ] Setup custom domain (opsional)
- [ ] Enable HTTPS
- [ ] Test di mobile & desktop

---

## 🎉 Selesai!

Aplikasi DapurKu sekarang live di Netlify!

**URL:** `https://your-site.netlify.app`

**Next steps:**
- Share URL ke pelanggan
- Setup custom domain
- Monitor analytics di Netlify dashboard
- Backup data Firebase rutin

---

## 📞 Support

- [Netlify Docs](https://docs.netlify.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vite Docs](https://vitejs.dev/)

---

**Happy deploying! 🚀**
