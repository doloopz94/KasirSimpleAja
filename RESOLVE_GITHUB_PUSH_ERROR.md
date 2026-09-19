# 🚨 Cara Resolve GitHub Push Protection Error

## Masalah

GitHub mendeteksi API keys di commit history dan memblokir push:

```
remote: error: GH013: Repository rule violations found
remote: - Push cannot contain secrets
remote: - OpenRouter API Key
remote: - Firebase API Key
```

## ✅ Solusi yang Sudah Dilakukan

Saya sudah memperbaiki semua file yang mengandung secret:

1. ✅ **Firebase Config** - Menggunakan environment variables
2. ✅ **OpenRouter Setup** - Menghapus API key dari dokumentasi
3. ✅ **Environment Template** - Buat `.env.example`

## 🔧 Cara Resolve Blocked Push

### **Opsi 1: Allow Secret di GitHub (Cepat)**

Jika Anda ingin tetap menggunakan API key yang sudah ada:

1. **Buka Link dari Error Message**
   ```
   https://github.com/doloopz94/KasirSimpleAja/security/secret-scanning/unblock-secret/3JYtaryMKzf8g0gqirVDMwsGrYp
   ```

2. **Klik "Allow secret"**
   - GitHub akan bertanya apakah Anda yakin
   - Klik **"Allow secret"** atau **"Dismiss alert"**

3. **Push Ulang**
   ```bash
   git push origin online-home-cooked-food-sales-application-3958e
   ```

**⚠️ PERINGATAN**: Ini berarti API key Anda akan tetap ada di Git history. Untuk production, sebaiknya gunakan Opsi 2.

---

### **Opsi 2: Remove Secret dari History (Lebih Aman)**

Jika Anda ingin menghapus secret dari Git history:

#### Step 1: Install BFG Repo-Cleaner

**Mac:**
```bash
brew install bfg
```

**Windows:**
Download dari: https://rtyley.github.io/bfg-repo-cleaner/

**Linux:**
```bash
sudo apt-get install bfg
```

#### Step 2: Clone Repository dengan Mirror

```bash
git clone --mirror https://github.com/doloopz94/KasirSimpleAja.git
cd KasirSimpleAja.git
```

#### Step 3: Hapus File yang Mengandung Secret

```bash
# Hapus file OPENROUTER_SETUP.md dari history
bfg --delete-files OPENROUTER_SETUP.md

# Atau hapus semua file .env
bfg --delete-files .env
bfg --delete-files .env.local
```

#### Step 4: Clean dan Push

```bash
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

#### Step 5: Update Local Repository

```bash
cd ..
git clone https://github.com/doloopz94/KasirSimpleAja.git
cd KasirSimpleAja
```

---

### **Opsi 3: Rebase dan Amend Commit (Paling Aman)**

Jika secret hanya ada di beberapa commit terakhir:

#### Step 1: Cek Commit yang Mengandung Secret

```bash
git log --oneline
```

#### Step 2: Interactive Rebase

```bash
# Ganti NUMBER dengan jumlah commit yang ingin di-rewrite
git rebase -i HEAD~NUMBER
```

#### Step 3: Edit Commit

Di editor, ubah `pick` menjadi `edit` untuk commit yang mengandung secret:

```
pick abc1234 First commit
edit def5678 Commit with secret  <-- Ubah jadi edit
pick ghi9012 Another commit
```

#### Step 4: Amend Commit

```bash
# Git akan stop di commit yang di-edit
# Edit file untuk hapus secret
# Lalu:
git add .
git commit --amend --no-edit
git rebase --continue
```

#### Step 5: Force Push

```bash
git push --force origin online-home-cooked-food-sales-application-3958e
```

---

## 🎯 Rekomendasi Saya

### Untuk Development/Testing:
**Gunakan Opsi 1** (Allow secret) - Cepat dan mudah

### Untuk Production:
**Gunakan Opsi 2 atau 3** (Remove secret) - Lebih aman

---

## 📋 Setup Environment Variables (Setelah Push Berhasil)

Setelah push berhasil, setup environment variables di Netlify:

### 1. Firebase Config

Buka Netlify Dashboard → Site settings → Environment variables

Tambahkan:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. OpenRouter API Key

Tambahkan:
```
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Redeploy Site

```
Netlify Dashboard → Deploys → Trigger deploy → Deploy site
```

---

## 🔐 Cara Cek Apakah Secret Sudah Terhapus

### Method 1: Git Log

```bash
# Cari string secret di history
git log -p | grep "sk-or-v1"
git log -p | grep "AIzaSy"
```

Jika tidak ada output = secret sudah terhapus ✅

### Method 2: GitHub Secret Scanning

1. Buka repository di GitHub
2. Klik tab **"Security"**
3. Klik **"Code scanning alerts"**
4. Cek apakah masih ada alert untuk secret

---

## 🛡️ Best Practices untuk Masa Depan

### 1. Gunakan .gitignore

Pastikan file berikut ada di `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# API keys
*.key
*.pem

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### 2. Gunakan Environment Variables

**❌ JANGAN:**
```typescript
const apiKey = "sk-or-v1-abc123..."; // Hardcoded!
```

**✅ LAKUKAN:**
```typescript
const apiKey = import.meta.env.VITE_API_KEY; // Dari env var
```

### 3. Pre-commit Hook

Install pre-commit hook untuk cek secret sebelum commit:

```bash
npm install --save-dev husky
npx husky install
```

Buat file `.husky/pre-commit`:
```bash
#!/bin/sh
# Cek apakah ada secret yang akan di-commit
if git diff --cached | grep -q "sk-or-v1\|AIzaSy"; then
  echo "❌ Error: Secret detected in commit!"
  echo "Please remove secrets before committing."
  exit 1
fi
```

### 4. Gunakan GitHub Secret Scanning

1. Buka repository settings
2. Klik **"Code security and analysis"**
3. Enable **"Secret scanning"**
4. Enable **"Push protection"**

---

## 📚 Dokumentasi Terkait

- [GitHub Push Protection Docs](https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Firebase Environment Variables](./FIREBASE_SETUP.md)
- [OpenRouter Setup](./OPENROUTER_SETUP.md)

---

## 🆘 Butuh Bantuan?

Jika masih ada masalah:

1. **Cek error message** - Lihat secret apa yang terdeteksi
2. **Cek file yang disebut** - Lihat file mana yang mengandung secret
3. **Pilih opsi yang tepat** - Opsi 1 (cepat) atau Opsi 2/3 (aman)
4. **Setup environment variables** - Setelah push berhasil

---

**Pilih opsi yang sesuai dengan kebutuhan Anda dan ikuti langkah-langkahnya!** 🚀

Untuk development/testing, gunakan **Opsi 1** (Allow secret).
Untuk production, gunakan **Opsi 2 atau 3** (Remove secret).
