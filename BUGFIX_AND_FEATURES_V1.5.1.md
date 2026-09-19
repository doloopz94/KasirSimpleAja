# 🐛 Bug Fix & Fitur Baru v1.5.1

## 🐛 Bug Fix: Hapus Data Histori Transaksi

### Masalah
Data transaksi yang dihapus masih muncul kembali setelah halaman di-reload.

### Penyebab
1. Fungsi `deleteTransaction` di `store.ts` mengembalikan `true` bahkan jika Firebase delete gagal
2. Tidak ada mekanisme untuk update UI secara real-time setelah delete
3. `window.location.reload()` tidak cukup karena data masih ada di Firebase

### Solusi
1. **Perbaikan `deleteTransaction` di `store.ts`:**
   - Tambah logging untuk debugging
   - Pastikan return value mencerminkan status actual Firebase delete
   - Selalu update localStorage setelah delete
   - Return `false` jika Firebase delete gagal

2. **Perbaikan `Reports.tsx`:**
   - Tambah callback `onTransactionsUpdate` untuk update UI tanpa reload
   - Fallback ke `window.location.reload()` jika callback tidak tersedia
   - Pesan error yang lebih jelas

3. **Perbaikan `App.tsx`:**
   - Pass callback `onTransactionsUpdate` ke Reports component
   - Callback akan reload data dari Firebase dan update state

### Cara Kerja Sekarang
```
1. User klik "Hapus" pada transaksi
2. Konfirmasi hapus
3. deleteTransaction dipanggil
4. Data dihapus dari Firebase
5. Data dihapus dari localStorage
6. Callback onTransactionsUpdate dipanggil
7. Parent component reload data dari Firebase
8. UI terupdate secara real-time
```

### Testing
- [x] Hapus transaksi dari Firebase
- [x] Hapus transaksi dari localStorage
- [x] UI terupdate tanpa reload
- [x] Error handling yang proper
- [x] Logging untuk debugging

---

## ✨ Fitur Baru: Pengaturan Model AI

### Deskripsi
Fitur untuk mengganti model AI yang digunakan untuk generate pesan promosi. Jika model default kadaluarsa atau error, user bisa langsung ganti ke model lain tanpa perlu deploy ulang.

### Cara Pakai

#### 1. Buka Settings
- Klik menu **Settings** (icon gear)
- Pilih tab **"AI Model"**

#### 2. Pilih Model
Ada 2 cara untuk memilih model:

**Cara 1: Input Manual**
- Ketik nama model di input field
- Format: `provider/model-name:version`
- Contoh: `inclusionai/ling-3.0-flash-vl:free`

**Cara 2: Pilih dari Daftar Populer**
- Klik salah satu model dari daftar populer
- Model akan otomatis terisi

#### 3. Test Model
- Klik tombol **"Test Model"**
- Sistem akan mengirim request test ke model
- Jika berhasil, akan muncul pesan sukses dengan preview response
- Jika gagal, akan muncul error message

#### 4. Simpan Model
- Jika test berhasil, klik **"Simpan Model"**
- Model akan disimpan ke localStorage
- Semua generate promosi berikutnya akan menggunakan model ini

### Model Populer yang Tersedia

| Model | Provider | Keterangan |
|-------|----------|------------|
| `inclusionai/ling-3.0-flash-vl:free` | Inclusion AI | Default, cepat & stabil |
| `inclusionai/ling-3.0-flash:free` | Inclusion AI | Versi tanpa vision |
| `google/gemma-3-12b-it:free` | Google | Alternatif stabil |
| `qwen/qwen3.8-27b:free` | Alibaba | Model besar, quality tinggi |
| `mistralai/mistral-7b-instruct:free` | Mistral | Model ringan & cepat |

### Daftar Model Lengkap
Lihat daftar model lengkap di: https://openrouter.ai/models

### Cara Kerja

```
1. User pilih model di Settings → AI Model
2. Model disimpan ke localStorage (key: 'ai_model')
3. Saat generate promosi, PromotionPage membaca model dari localStorage
4. Model dikirim ke Netlify Function sebagai parameter 'customModel'
5. Netlify Function menggunakan model tersebut untuk call OpenRouter API
6. Response dikembalikan ke frontend
```

### Fitur Test Model
- Test model sebelum menyimpan
- Prompt test lebih singkat untuk快速 verifikasi
- Max tokens lebih kecil (200) untuk test
- Preview response untuk verifikasi kualitas

### Error Handling
- Jika model tidak valid, akan muncul error message
- Jika API key tidak configured, akan muncul error
- Jika rate limit tercapai, akan muncul error
- User bisa coba model lain

### Tips
- Test model sebelum menyimpan
- Model dengan ":free" adalah model gratis
- Beberapa model memiliki rate limit
- Jika model error, coba model lain
- Lihat daftar model lengkap di openrouter.ai/models

---

## 📊 Technical Changes

### Files Modified

1. **`src/store.ts`**
   - Perbaikan `deleteTransaction` dengan logging
   - Return value yang accurate
   - Always update localStorage

2. **`src/components/Reports.tsx`**
   - Tambah prop `onTransactionsUpdate`
   - Callback untuk update UI tanpa reload
   - Error handling yang lebih baik

3. **`src/App.tsx`**
   - Pass callback `onTransactionsUpdate` ke Reports
   - Reload data dari Firebase setelah update

4. **`src/components/SettingsPage.tsx`**
   - Tambah tab "AI Model"
   - Import AIPromotionSettings component

5. **`src/components/AIPromotionSettings.tsx`** (NEW)
   - Komponen baru untuk pengaturan model AI
   - Input model manual
   - Daftar model populer
   - Test model functionality
   - Save to localStorage

6. **`src/services/OpenRouterService.ts`**
   - Tambah field `customModel` dan `testMode` di PromotionRequest
   - Kirim customModel ke Netlify Function

7. **`src/components/PromotionPage.tsx`**
   - Baca model dari localStorage
   - Kirim customModel ke openRouterService

8. **`netlify/functions/generate-promotion.ts`**
   - Terima parameter `customModel` dari frontend
   - Gunakan customModel jika ada, otherwise use default
   - Support `testMode` untuk test model

---

## 🚀 Deployment

### Step 1: Commit Changes
```bash
git add .
git commit -m "fix: Delete transaction bug & feat: AI model settings

- Fix transaction delete not working properly
- Add callback for real-time UI update
- Add AI model settings page
- Support custom model selection
- Add model test functionality
- Save model to localStorage"
```

### Step 2: Push to GitHub
```bash
git push origin main
```

### Step 3: Netlify Auto Deploy
- Netlify akan otomatis detect push
- Build akan berjalan (~2-3 menit)
- Site akan live otomatis

---

## 🧪 Testing Checklist

### Bug Fix: Delete Transaction
- [ ] Buat transaksi baru
- [ ] Hapus transaksi dari riwayat
- [ ] Cek Firebase Console - transaksi harus terhapus
- [ ] Cek localStorage - transaksi harus terhapus
- [ ] UI harus terupdate tanpa reload
- [ ] Coba reload halaman - transaksi tidak muncul lagi

### Fitur: AI Model Settings
- [ ] Buka Settings → AI Model
- [ ] Pilih model dari daftar populer
- [ ] Klik "Test Model"
- [ ] Verifikasi test berhasil
- [ ] Klik "Simpan Model"
- [ ] Buka Promosi → Generate dengan AI
- [ ] Verifikasi menggunakan model baru
- [ ] Coba ganti model lain
- [ ] Test model yang berbeda
- [ ] Verifikasi error handling

---

## 📝 Catatan Penting

### Untuk Delete Transaction
- Data yang dihapus tidak bisa dikembalikan
- Pastikan backup data secara berkala
- Hanya admin/owner yang bisa hapus

### Untuk AI Model
- Model yang disimpan hanya berlaku untuk browser/device ini
- Jika ganti device, perlu setup model lagi
- Model gratis memiliki rate limit
- Jika model error, coba model lain
- Selalu test model sebelum save

---

## 🔗 Related Documentation

- [Firebase Setup](./FIREBASE_SETUP.md)
- [Netlify Deploy](./NETLIFY_DEPLOY.md)
- [AI Promotion Guide](./AI_PROMOTION_GUIDE.md)
- [Features v1.5.0](./FEATURES_V1.5.0.md)

---

**Version: 1.5.1**  
**Date: 2024**  
**Status: ✅ Production Ready**
