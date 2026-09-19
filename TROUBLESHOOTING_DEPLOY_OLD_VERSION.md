# 🔄 Troubleshooting: Deploy Masih Versi Lama

## ⚠️ Masalah

Setelah push code baru ke GitHub, Netlify deploy berhasil tapi **tampilan masih versi lama**, bukan versi baru yang sudah dikembangkan.

## 🔍 Kemungkinan Penyebab

### 1. File Belum Ter-Push dengan Benar
- Perubahan lokal belum di-commit
- Commit sudah dibuat tapi belum push
- Push gagal tanpa error yang jelas

### 2. Netlify Cache Issue
- Netlify menggunakan cache dari deploy sebelumnya
- Build artifacts tidak ter-update

### 3. Browser Cache
- Browser menampilkan versi lama dari cache
- Service worker masih aktif

### 4. Merge Conflict
- Ada merge conflict yang belum di-resolve
- File di repo masih versi lama

## ✅ Solusi Step-by-Step

### Step 1: Cek Status Git Lokal

Buka terminal di folder project dan jalankan:

```bash
# Cek status git
git status

# Cek commit terakhir
git log -1

# Cek branch yang aktif
git branch
```

**Expected output:**
```
On branch main
nothing to commit, working tree clean
```

Jika ada file yang belum di-commit:
```bash
git add .
git commit -m "Update to latest version"
```

### Step 2: Push ke GitHub

```bash
# Push ke GitHub
git push origin main

# Atau jika ada error, force push
git push origin main --force
```

**Expected output:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/username/repo.git
   abc1234..def5678  main -> main
```

### Step 3: Cek Netlify Deploy

1. Buka Netlify Dashboard
2. Klik tab **Deploys**
3. Cek deploy terbaru:
   - Status harus **Published** (hijau)
   - Cek timestamp deploy
   - Klik deploy untuk lihat log

4. Cek deploy log:
   - Harus ada: `✓ 2004 modules transformed`
   - Harus ada: `✓ built in Xs`
   - Harus ada: `✓ Deploy is ready`

### Step 4: Clear Netlify Cache

Jika deploy masih versi lama:

1. Buka Netlify Dashboard
2. Klik tab **Deploys**
3. Klik **Trigger deploy** → **Clear cache and deploy site**
4. Tunggu deploy selesai (2-3 menit)

### Step 5: Clear Browser Cache

**Method 1: Hard Refresh**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**Method 2: Clear Cache Manually**
1. Buka DevTools (F12)
2. Klik kanan pada tombol refresh
3. Pilih **Empty Cache and Hard Reload**

**Method 3: Incognito Mode**
1. Buka browser dalam incognito/private mode
2. Akses site Anda
3. Jika tampil versi baru → masalah browser cache

### Step 6: Verifikasi File di GitHub

1. Buka repository di GitHub
2. Cek file `src/firebase/config.ts`
3. Harus berisi:
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
     // ... (bukan hardcoded values)
   };
   ```

Jika masih ada hardcoded values:
```typescript
// ❌ SALAH - masih hardcoded
const firebaseConfig = {
  apiKey: "AIzaSyDC9EFmGkqvwDteJ7fMh_ydlTIedi6ydUA",
  // ...
};
```

**Solusi:** File belum ter-push dengan benar. Ulangi Step 1-2.

## 🔧 Quick Fix Commands

Jika semua cara di atas gagal, coba reset dan push ulang:

```bash
# 1. Reset ke commit terakhir
git reset --hard HEAD

# 2. Pull perubahan terbaru
git pull origin main

# 3. Pastikan semua file sudah benar
git status

# 4. Commit semua perubahan
git add .
git commit -m "Force update to latest version"

# 5. Force push
git push origin main --force
```

## 📊 Checklist Verifikasi

### Di Lokal
- [ ] `git status` menunjukkan "working tree clean"
- [ ] `git log -1` menunjukkan commit terbaru
- [ ] File `src/firebase/config.ts` menggunakan `import.meta.env`
- [ ] Tidak ada hardcoded API key di code

### Di GitHub
- [ ] File `src/firebase/config.ts` di repo sudah update
- [ ] Commit timestamp sesuai dengan push terakhir
- [ ] Tidak ada merge conflict
- [ ] Branch `main` adalah branch aktif

### Di Netlify
- [ ] Deploy status **Published**
- [ ] Deploy timestamp sesuai dengan push terakhir
- [ ] Deploy log menunjukkan build sukses
- [ ] Tidak ada error di deploy log

### Di Browser
- [ ] Hard refresh sudah dilakukan
- [ ] Cache browser sudah di-clear
- [ ] Site menampilkan versi terbaru
- [ ] Console tidak ada error

## 🐛 Troubleshooting Lanjutan

### Masalah: File di GitHub masih versi lama

**Penyebab:** Push gagal atau ada merge conflict

**Solusi:**
```bash
# Cek remote
git remote -v

# Reset ke origin/main
git fetch origin
git reset --hard origin/main

# Apply perubahan lokal
# (copy file yang sudah diupdate dari backup)

# Commit dan push
git add .
git commit -m "Update to latest version"
git push origin main --force
```

### Masalah: Netlify deploy sukses tapi site masih lama

**Penyebab:** CDN cache atau browser cache

**Solusi:**
1. Tambah header cache di `netlify.toml`:
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       Cache-Control = "no-cache, no-store, must-revalidate"
   ```

2. Redeploy site

3. Clear browser cache completely

### Masalah: Environment variables tidak ter-load

**Penyebab:** Variables belum di-set di Netlify

**Solusi:**
1. Buka Netlify Dashboard → Site settings → Environment variables
2. Pastikan semua variables sudah di-set:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - dst.
3. Redeploy site

## 📝 Template Commit Message

Gunakan template ini untuk commit:

```bash
git commit -m "feat: Update Firebase config to use environment variables

- Remove hardcoded Firebase API key
- Use import.meta.env for all config values
- Fix security warning from GitHub
- Improve deployment process

Changes:
- src/firebase/config.ts: Use env variables
- .env.example: Add template
- ENVIRONMENT_VARIABLES_SETUP.md: Add setup guide"
```

## 🎯 Expected Result

Setelah semua langkah di atas:

✅ File di GitHub menggunakan environment variables  
✅ Netlify deploy menampilkan versi terbaru  
✅ Site di browser menampilkan fitur terbaru  
✅ Tidak ada warning dari GitHub  
✅ Firebase API key tidak terlihat di code  
✅ Semua fitur berfungsi normal  

## 📚 Dokumentasi Terkait

- [Environment Variables Setup](./ENVIRONMENT_VARIABLES_SETUP.md)
- [Firebase Setup](./FIREBASE_SETUP.md)
- [Netlify Deploy](./NETLIFY_DEPLOY.md)

## 💡 Tips

1. **Selalu cek `git status`** sebelum push
2. **Gunakan commit message yang jelas** untuk tracking
3. **Clear cache setelah deploy** untuk memastikan versi terbaru
4. **Test di incognito mode** untuk exclude browser cache
5. **Monitor deploy log** di Netlify untuk detect masalah

---

**Status:** ✅ Troubleshooting guide ready  
**Last Updated:** 2024
