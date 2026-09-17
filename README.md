# 🍽️ DapurKu - Sistem Manajemen Penjualan Makanan Rumahan

Aplikasi web modern untuk mengelola penjualan makanan rumahan dengan fitur lengkap termasuk transaksi, promosi, laporan, dan integrasi Firebase untuk sinkronisasi real-time.

## ✨ Fitur Utama

### 📊 Dashboard
- Ringkasan penjualan hari ini
- Statistik pendapatan dan transaksi
- Menu terlaris
- Grafik penjualan

### 🍽️ Kelola Menu
- Tambah, edit, hapus menu
- Kategori menu (Makanan Utama, Minuman, Pelengkap, dll)
- Toggle ketersediaan menu
- Upload gambar menu (coming soon)

### 💳 Transaksi
- Pilih menu dengan popup interaktif
- Atur jumlah dan harga fleksibel
- Catatan per item
- Ongkos kirim (Gratis/Rp3.000/Rp5.000/Rp7.000/Custom)
- Pembayaran Tunai atau QRIS
- Cetak struk (PDF/Thermal/WhatsApp)

### 📢 Promosi
- 5 template pesan promosi
- Pilih menu yang dipromosikan
- Share ke WhatsApp/Facebook
- Copy text untuk broadcast

### 📈 Laporan
- Laporan penjualan harian/mingguan/bulanan
- Grafik pendapatan
- Analisis kategori
- Export CSV
- **Edit transaksi** - Ubah data pelanggan & catatan
- **Cetak ulang struk** - Print struk transaksi lama
- **Hapus transaksi** - Hapus transaksi yang salah

### 🖨️ Printer Thermal (Multi-Method)
- **Bluetooth** - Koneksi langsung via Web Bluetooth API (Chrome/Edge)
- **Cloud Print** - Cetak via internet untuk semua browser (fallback)
- Support printer 58mm & 80mm
- Auto-print struk setelah transaksi
- Cetak ulang struk dari riwayat
- ESC/POS protocol compatible
- Fallback ke print dialog browser

### ⚙️ Pengaturan
- Info toko (nama, alamat, telepon)
- Upload logo toko
- Konfigurasi QRIS
- **Koneksi printer thermal Bluetooth** - Scan & connect langsung
- **Test cetak** - Verify printer bekerja
- Kustomisasi tampilan struk

### 🔐 Sistem Login
- Login dengan PIN
- Session management
- Logout dengan konfirmasi

### 🔄 Firebase Integration
- Real-time sync antar device
- Multi-user support
- Cloud backup
- Access dari mana saja

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase (Opsional tapi Recommended)

Lihat panduan lengkap di [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**Quick Setup:**
1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Storage
4. Copy konfigurasi Firebase
5. Update file `src/firebase/config.ts`

### 3. Jalankan Aplikasi
```bash
npm run dev
```

Buka http://localhost:5173

### 4. Login
- **Username:** `admin`
- **PIN:** `139755`

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database:** Firebase Firestore (with localStorage fallback)
- **Build Tool:** Vite
- **Hardware:** Web Bluetooth API (Thermal Printer)

## 🗄️ Database

### Mode localStorage (Default)
- Data tersimpan di browser
- Tidak perlu setup server
- Cocok untuk single device
- Kapasitas ~5-10MB

### Mode Firebase (Recommended)
- Real-time sync antar device
- Cloud backup otomatis
- Multi-user support
- Access dari mana saja
- Free tier cukup untuk UMKM

**Cara switch ke Firebase:**
1. Setup Firebase project (lihat FIREBASE_SETUP.md)
2. Update `src/firebase/config.ts` dengan credentials Anda
3. Restart aplikasi
4. Status akan muncul di header: "Firebase" (hijau) atau "Local" (abu-abu)

## 📱 Responsive Design

Aplikasi fully responsive untuk:
- 📱 Smartphone (320px+)
- 📱 Tablet (768px+)
- 💻 Laptop (1024px+)
- 🖥️ Desktop (1280px+)

## 🎨 Fitur UI/UX

- Modern & clean design
- Smooth animations
- Touch-friendly untuk mobile
- Dark mode ready (coming soon)
- Customizable branding (logo, nama toko)

## 📄 Struktur Project

```
src/
├── components/
│   ├── Dashboard.tsx          # Halaman dashboard
│   ├── MenuManagement.tsx     # Kelola menu
│   ├── TransactionPage.tsx    # Halaman transaksi
│   ├── PromotionPage.tsx      # Halaman promosi
│   ├── Reports.tsx            # Laporan penjualan
│   ├── SettingsPage.tsx       # Pengaturan
│   ├── LoginPage.tsx          # Halaman login
│   ├── QRISPayment.tsx        # Modal pembayaran QRIS
│   └── ReceiptModal.tsx       # Modal cetak struk
├── firebase/
│   ├── config.ts              # Konfigurasi Firebase
│   └── services.ts            # Firebase services
├── types.ts                   # TypeScript types
├── store.ts                   # Data management
└── App.tsx                    # Main app component
```

## 🔧 Konfigurasi

### Firebase Config
Edit `src/firebase/config.ts`:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Default Login
Edit `src/components/LoginPage.tsx`:
```typescript
if (username === 'admin' && pin === '139755') {
  // Ganti dengan credentials Anda
}
```

## 📊 Firebase Pricing (Free Tier)

**Firestore:**
- 50K reads/hari
- 20K writes/hari
- 20K deletes/hari
- 1 GB storage

**Storage:**
- 5 GB storage
- 1 GB download/hari
- 20K upload/hari

**Cukup untuk:**
- ~500 transaksi/hari
- ~1000 menu items
- ~100 logo uploads

## 🚢 Deployment

### Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag & drop folder 'dist' ke Netlify
```

## 🐛 Troubleshooting

### Data tidak sync ke Firebase
- Cek konfigurasi Firebase sudah benar
- Cek Firestore Database sudah enabled
- Cek browser console untuk error

### Logo tidak muncul
- Cek Storage sudah enabled
- Cek Storage rules
- Pastikan file < 2MB

### Build error
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Changelog

### v1.2.0 (Current)
- ✅ **Cloud Printing** - Alternatif cetak untuk semua browser (Safari, Firefox, iOS)
- ✅ **Multi-method printing** - Pilih Bluetooth atau Cloud Print
- ✅ **Auto-detect** - Otomatis sarankan Cloud Print jika Web Bluetooth tidak tersedia
- ✅ **Fallback print** - Print dialog browser sebagai backup

### v1.1.0
- ✅ **Printer thermal Bluetooth** - Koneksi langsung via Web Bluetooth
- ✅ **Edit transaksi** - Ubah data pelanggan & catatan
- ✅ **Cetak ulang struk** - Print struk dari riwayat transaksi
- ✅ **Hapus transaksi** - Hapus transaksi yang salah
- ✅ Dashboard & statistik
- ✅ Kelola menu
- ✅ Transaksi dengan QRIS
- ✅ Cetak struk (PDF/Thermal/WA)
- ✅ Promosi & broadcast
- ✅ Laporan penjualan
- ✅ Pengaturan lengkap
- ✅ Upload logo
- ✅ Login system
- ✅ Firebase integration
- ✅ Responsive design

### v1.0.0
- Initial release

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use for your business!

## 💬 Support

Untuk pertanyaan atau bantuan:
- Baca [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) untuk setup Firebase
- Baca [THERMAL_PRINTER_GUIDE.md](./THERMAL_PRINTER_GUIDE.md) untuk setup printer thermal Bluetooth
- Baca [CLOUD_PRINTING_GUIDE.md](./CLOUD_PRINTING_GUIDE.md) untuk cloud printing
- Baca [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md) untuk deploy ke Netlify
- Cek browser console untuk debug
- Review dokumentasi Firebase: https://firebase.google.com/docs

## 🙏 Credits

Dibuat dengan ❤️ untuk UMKM Indonesia

---

**Selamat menggunakan DapurKu! 🎉**
