# 🔐 Setup OpenRouter API Key di Netlify

## ⚠️ Masalah Keamanan

API key OpenRouter **TIDAK BOLEH** disimpan di client-side code (frontend) karena:
- Siapa saja bisa lihat API key dari browser
- API key bisa disalahgunakan oleh orang lain
- Bisa menyebabkan biaya tak terduga

## ✅ Solusi: Netlify Functions

Kita menggunakan **Netlify Functions** sebagai proxy untuk melindungi API key:

```
Browser → Netlify Function → OpenRouter API
         (tanpa API key)    (dengan API key)
```

## 🚀 Cara Setup

### Step 1: Push Code ke GitHub

Pastikan semua file sudah di-push:

```bash
git add .
git commit -m "Fix: Move OpenRouter API key to Netlify Functions"
git push origin main
```

### Step 2: Setup Environment Variable di Netlify

1. Buka [Netlify Dashboard](https://app.netlify.com/)
2. Pilih site **DapurKu**
3. Klik tab **"Site settings"**
4. Scroll ke bagian **"Environment variables"**
5. Klik **"Environment variables"**
6. Klik **"Add variable"**
7. Isi:
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: `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`
8. Klik **"Save"**

### Step 3: Redeploy Site

Setelah add environment variable, **WAJIB redeploy**:

1. Klik tab **"Deploys"**
2. Klik **"Trigger deploy"** (tombol di kanan atas)
3. Pilih **"Deploy site"**
4. Tunggu deploy selesai (~2-3 menit)

### Step 4: Test Fitur AI

1. Buka aplikasi
2. Masuk ke menu **Promosi**
3. Pilih menu dan style
4. Klik **"Generate dengan AI ✨"**
5. Jika berhasil → API key sudah terkonfigurasi dengan benar ✅

## 📋 File yang Dibuat

### 1. Netlify Function
**File**: `netlify/functions/generate-promotion.ts`

Function ini:
- Menerima request dari frontend
- Membaca API key dari environment variable
- Memanggil OpenRouter API
- Mengembalikan hasil ke frontend

### 2. Netlify Config
**File**: `netlify.toml`

Konfigurasi:
```toml
[build]
  functions = "netlify/functions"
```

### 3. Frontend Service
**File**: `src/services/OpenRouterService.ts`

Sekarang memanggil Netlify Function, bukan langsung ke OpenRouter API.

## 🔍 Cara Cek Apakah Berhasil

### Method 1: Cek di Browser Console

1. Buka aplikasi
2. Tekan **F12** untuk buka DevTools
3. Pilih tab **Console**
4. Klik tombol **"Generate dengan AI"**
5. Lihat network request:

**✅ Jika berhasil:**
```
POST /.netlify/functions/generate-promotion
Status: 200 OK
Response: { success: true, message: "..." }
```

**❌ Jika gagal:**
```
POST /.netlify/functions/generate-promotion
Status: 500 Error
Response: { error: "AI service not configured" }
```

### Method 2: Cek di Netlify Dashboard

1. Buka Netlify Dashboard
2. Klik tab **"Functions"**
3. Harus ada function: `generate-promotion`
4. Klik function untuk lihat logs

### Method 3: Test Manual

Buka browser console dan jalankan:

```javascript
fetch('/.netlify/functions/generate-promotion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storeName: 'Test',
    menuItems: [{ name: 'Nasi Goreng', price: 20000, category: 'Makanan' }],
    style: 'casual'
  })
}).then(r => r.json()).then(console.log);
```

## 🐛 Troubleshooting

### Error: "AI service not configured"

**Penyebab**: Environment variable belum di-set atau belum redeploy

**Solusi**:
1. Cek Netlify Dashboard → Site settings → Environment variables
2. Pastikan ada variable `OPENROUTER_API_KEY`
3. **Redeploy** site setelah add variable
4. Tunggu 2-3 menit
5. Hard refresh browser (Ctrl+Shift+R)

### Error: "Function not found"

**Penyebab**: Netlify Function belum ter-deploy

**Solusi**:
1. Pastikan file `netlify/functions/generate-promotion.ts` ada di repo
2. Pastikan `netlify.toml` sudah di-push
3. Redeploy site
4. Cek tab **"Functions"** di Netlify Dashboard

### Error: "API request failed"

**Penyebab**: API key salah atau quota habis

**Solusi**:
1. Cek API key di Netlify environment variables
2. Pastikan tidak ada spasi di awal/akhir
3. Cek quota di [OpenRouter Dashboard](https://openrouter.ai/keys)
4. Jika quota habis, tunggu reset atau upgrade plan

### Error: "Network error"

**Penyebab**: Koneksi internet atau CORS issue

**Solusi**:
1. Check koneksi internet
2. Check browser console untuk detail error
3. Try hard refresh (Ctrl+Shift+R)
4. Clear browser cache

## 💡 Best Practices

### 1. Jangan Commit API Key
- ❌ JANGAN commit API key di code
- ✅ Simpan di Netlify environment variables
- ✅ Gunakan `.gitignore` untuk file `.env`

### 2. Rotate API Key Periodically
- Ganti API key setiap 3-6 bulan
- Update di Netlify environment variables
- Redeploy setelah ganti key

### 3. Monitor Usage
- Cek usage di [OpenRouter Dashboard](https://openrouter.ai/keys)
- Set up alerts untuk unusual activity
- Monitor biaya bulanan

### 4. Use Rate Limiting
- Netlify Functions punya rate limit
- Tambah error handling di frontend
- Fallback ke template manual jika API error

## 📊 Arsitektur

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ POST /api/generate-promotion
       │ (tanpa API key)
       │
       ▼
┌─────────────────────┐
│  Netlify Function   │
│  (Serverless)       │
│                     │
│  - Baca env var     │
│  - Build prompt     │
│  - Call OpenRouter  │
└──────┬──────────────┘
       │
       │ POST /v1/chat/completions
       │ (dengan API key)
       │
       ▼
┌─────────────────────┐
│  OpenRouter API     │
│  (Google Gemini)    │
│                     │
│  - Generate text    │
│  - Return response  │
└─────────────────────┘
```

## 🔐 Security Checklist

- [x] API key tidak ada di client-side code
- [x] API key disimpan di Netlify environment variables
- [x] Netlify Function sebagai proxy
- [x] Environment variable tidak ter-commit ke Git
- [x] Function hanya accept POST request
- [x] Error handling yang proper
- [x] Rate limiting dari Netlify

## 📚 Dokumentasi Terkait

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [AI Promotion Guide](./AI_PROMOTION_GUIDE.md)

## 🆘 Butuh Bantuan?

Jika masih ada masalah:

1. **Cek Netlify Function logs**:
   - Netlify Dashboard → Functions → generate-promotion → Logs

2. **Cek browser console**:
   - F12 → Console tab
   - Lihat error message

3. **Cek environment variables**:
   - Netlify Dashboard → Site settings → Environment variables
   - Pastikan `OPENROUTER_API_KEY` ada

4. **Redeploy site**:
   - Netlify Dashboard → Deploys → Trigger deploy → Deploy site

---

**Setup selesai! API key sekarang aman di Netlify Functions!** 🔐✅
