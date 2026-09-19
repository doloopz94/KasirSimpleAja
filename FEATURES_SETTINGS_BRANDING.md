# 🎨 Fitur Settings: Upload Logo, Tagline, dan Dynamic Branding

## ✨ Fitur Baru yang Ditambahkan

### 1. **Upload Logo Toko** 🖼️
- Upload logo dari Settings → Akun Toko
- Preview logo sebelum save
- Logo otomatis muncul di:
  - Sidebar aplikasi
  - Header nota/struk
  - Favicon browser
  - Print struk thermal

### 2. **Tagline / Slogan** 📝
- Input tagline di Settings → Akun Toko
- Tagline muncul di:
  - Sidebar aplikasi (di bawah nama toko)
  - Header nota/struk
  - Document title browser
  - Print struk thermal

### 3. **Dynamic Branding** 🎯
Semua branding sekarang dynamic dan bisa diubah:
- ✅ Nama toko
- ✅ Tagline
- ✅ Logo
- ✅ Alamat
- ✅ Nomor telepon

Perubahan langsung terlihat di seluruh aplikasi setelah save.

---

## 🚀 Cara Menggunakan

### Step 1: Buka Settings
1. Klik menu **Settings** (icon gear)
2. Pilih tab **"Akun Toko"**

### Step 2: Upload Logo
1. Klik tombol **"Upload Logo"**
2. Pilih file gambar (JPG, PNG, atau SVG)
3. Preview logo akan muncul
4. Logo otomatis tersimpan saat klik "Simpan Pengaturan"

### Step 3: Isi Informasi Toko
1. **Nama Toko** - Nama toko Anda
2. **Tagline / Slogan** - Slogan toko (contoh: "Makanan Rumahan Online")
3. **Alamat Toko** - Alamat lengkap
4. **Nomor Telepon** - Nomor kontak

### Step 4: Simpan
1. Klik **"Simpan Pengaturan Toko"**
2. Tunggu notifikasi "Pengaturan berhasil disimpan!"
3. Perubahan langsung terlihat di seluruh aplikasi

---

## 📊 Dimana Branding Muncul?

### 1. **Sidebar Aplikasi**
```
┌─────────────────────┐
│ [Logo] Nama Toko    │
│        Tagline      │
├─────────────────────┤
│ 📊 Dashboard        │
│ 🍽️ Menu             │
│ 💳 Transaksi        │
│ ...                 │
└─────────────────────┘
```

### 2. **Header Nota/Struk**
```
        [Logo]
      Nama Toko
      Tagline
━━━━━━━━━━━━━━━
No: #ABC123
Tanggal: ...
```

### 3. **Browser Tab**
```
Nama Toko - Tagline
```

### 4. **Favicon**
Logo toko muncul sebagai favicon di browser tab.

### 5. **Print Struk Thermal**
Logo dan tagline muncul di header struk thermal.

---

## 🔧 Technical Details

### State Management
```typescript
interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storeAddress: string;
  storePhone: string;
  storeLogo: string; // Base64 encoded
}
```

### LocalStorage Keys
- `dapurku_settings` - Semua settings toko
- `dapurku_logo` - Logo (untuk quick access)

### Components Updated
1. **SettingsPage.tsx**
   - Tambah state management
   - Tambah upload logo
   - Tambah field tagline
   - Save ke localStorage

2. **App.tsx**
   - Load settings dari localStorage
   - Update document title
   - Update favicon
   - Update sidebar branding

3. **ReceiptModal.tsx**
   - Load tagline dari settings
   - Tampilkan tagline di header nota
   - Include tagline di WhatsApp text
   - Include tagline di print struk

---

## 🎯 Contoh Penggunaan

### Contoh 1: Toko Nasi Goreng
```
Nama Toko: Warung Nasi Goreng Pak Budi
Tagline: Nasi Goreng Terenak Se-Jakarta
Logo: [Upload logo warung]
```

**Hasil:**
- Sidebar: "Warung Nasi Goreng Pak Budi" + "Nasi Goreng Terenak Se-Jakarta"
- Nota: Header dengan logo dan tagline
- Browser tab: "Warung Nasi Goreng Pak Budi - Nasi Goreng Terenak Se-Jakarta"

### Contoh 2: Coffee Shop
```
Nama Toko: Kopi Senja
Tagline: Brewed with Love
Logo: [Upload logo coffee shop]
```

**Hasil:**
- Sidebar: "Kopi Senja" + "Brewed with Love"
- Nota: Header dengan logo dan tagline
- Browser tab: "Kopi Senja - Brewed with Love"

---

## 💡 Tips

### Logo
- **Ukuran ideal**: 200x200 pixels
- **Format**: PNG dengan background transparan (terbaik)
- **Ukuran file**: Maksimal 2MB
- **Aspect ratio**: 1:1 (square)

### Tagline
- **Panjang ideal**: 20-40 karakter
- **Gunakan**: Slogan yang mudah diingat
- **Hindari**: Terlalu panjang (akan terpotong di UI)

### Branding Konsisten
- Gunakan logo yang sama di semua platform
- Tagline harus mencerminkan brand
- Warna logo harus cocok dengan tema aplikasi

---

## 🐛 Troubleshooting

### Logo tidak muncul setelah upload
**Solusi:**
1. Pastikan file gambar valid (JPG/PNG/SVG)
2. Cek ukuran file < 2MB
3. Klik "Simpan Pengaturan Toko"
4. Refresh halaman (Ctrl+F5)

### Tagline tidak berubah
**Solusi:**
1. Pastikan sudah klik "Simpan Pengaturan Toko"
2. Refresh halaman
3. Clear browser cache

### Favicon tidak berubah
**Solusi:**
1. Upload logo dengan format PNG
2. Simpan settings
3. Hard refresh browser (Ctrl+Shift+R)
4. Favicon mungkin perlu beberapa menit untuk update

### Settings tidak tersimpan
**Solusi:**
1. Cek localStorage tidak penuh
2. Cek browser tidak dalam private/incognito mode
3. Coba clear localStorage dan reload

---

## 📋 Checklist Setup

- [ ] Buka Settings → Akun Toko
- [ ] Upload logo toko
- [ ] Isi nama toko
- [ ] Isi tagline
- [ ] Isi alamat
- [ ] Isi nomor telepon
- [ ] Klik "Simpan Pengaturan Toko"
- [ ] Verifikasi logo muncul di sidebar
- [ ] Verifikasi tagline muncul di sidebar
- [ ] Test buat transaksi baru
- [ ] Cek nota/struk menampilkan branding
- [ ] Cek browser tab menampilkan nama + tagline

---

## 🔐 Data Privacy

- ✅ Logo disimpan di localStorage (browser lokal)
- ✅ Settings tidak dikirim ke server
- ✅ Data hanya tersimpan di device Anda
- ✅ Tidak ada data yang dikirim ke third-party

---

## 🎨 Customization Lanjutan

Jika ingin custom lebih lanjut:

### Ganti Warna Tema
Edit file `src/index.css`:
```css
:root {
  --primary-color: #10b981; /* Ganti warna utama */
  --secondary-color: #059669; /* Ganti warna sekunder */
}
```

### Ganti Font
Edit file `src/index.css`:
```css
body {
  font-family: 'Poppins', sans-serif; /* Ganti font */
}
```

### Ganti Layout Sidebar
Edit file `src/App.tsx` bagian sidebar.

---

## 📚 Dokumentasi Terkait

- [Firebase Setup](./FIREBASE_SETUP.md)
- [Netlify Deploy](./NETLIFY_DEPLOY.md)
- [Printer Setup](./THERMAL_PRINTER_GUIDE.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES_SETUP.md)

---

**Status:** ✅ Production Ready  
**Version:** 1.6.0  
**Date:** 2024
