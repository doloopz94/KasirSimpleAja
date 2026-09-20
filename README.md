# 🍽️ DapurKu - Aplikasi Kasir Makanan Rumahan

Aplikasi kasir modern untuk manajemen penjualan makanan rumahan dengan fitur lengkap, multi-device sync, dan support PWA.

## ✨ Fitur Utama

### 💰 Transaksi & Pembayaran
- ✅ Transaksi cepat dengan popup menu interaktif
- ✅ Pembayaran QRIS dengan scan otomatis
- ✅ Pembayaran tunai dengan kalkulasi kembalian
- ✅ Diskon persentase otomatis
- ✅ Ongkos kirim fleksibel (gratis/custom)
- ✅ Cetak struk thermal (Bluetooth/WiFi/Cloud)

### 📊 Manajemen Data
- ✅ Dashboard real-time dengan statistik
- ✅ Manajemen menu dengan kategori
- ✅ Riwayat transaksi dengan edit/hapus
- ✅ Laporan penjualan harian/mingguan/bulanan
- ✅ Export laporan ke CSV

### 📢 Promosi & Marketing
- ✅ Generate pesan promosi dengan AI (OpenRouter)
- ✅ 5 template pesan (casual, promo, formal, story, facebook)
- ✅ Share ke WhatsApp, Facebook, atau copy text
- ✅ Pilih model AI custom

### 🖨️ Printer Support
- ✅ Thermal printer Bluetooth
- ✅ Thermal printer WiFi
- ✅ Cloud printing (fallback)
- ✅ Status koneksi real-time
- ✅ Test print functionality

### 👥 Multi-User & Security
- ✅ Login dengan PIN
- ✅ Role-based access (Owner/Admin/Kasir)
- ✅ Manajemen akun pengguna
- ✅ Firebase Authentication ready

### 📱 PWA (Progressive Web App)
- ✅ Installable di home screen
- ✅ Offline support
- ✅ Auto-update service worker
- ✅ Icon dinamis dari logo toko
- ✅ Cross-platform (Android/iOS/Desktop)

### 🎨 Customization
- ✅ Upload logo toko
- ✅ Custom nama & tagline
- ✅ Dynamic branding di seluruh aplikasi
- ✅ Theme color customization

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd dapurku
npm install
```

### 2. Setup Firebase
1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Storage
4. Copy konfigurasi Firebase
5. Lihat [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) untuk detail

### 3. Setup Environment Variables
Tambahkan di Netlify Dashboard → Site settings → Environment variables:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
OPENROUTER_API_KEY=your_openrouter_key
```

Lihat [ENVIRONMENT_VARIABLES_SETUP.md](./ENVIRONMENT_VARIABLES_SETUP.md) untuk detail.

### 4. Development
```bash
npm run dev
```
Buka http://localhost:3000

### 5. Build & Deploy
```bash
npm run build
npm run preview  # Test production build
```

Deploy ke Netlify:
1. Push ke GitHub
2. Connect repository ke Netlify
3. Netlify akan auto-deploy

## 📖 Dokumentasi

### Setup & Configuration
- [Firebase Setup](./FIREBASE_SETUP.md) - Setup Firebase project
- [Environment Variables](./ENVIRONMENT_VARIABLES_SETUP.md) - Setup env vars
- [OpenRouter Setup](./OPENROUTER_SETUP.md) - Setup AI promotion

### Features
- [AI Promotion Guide](./AI_PROMOTION_GUIDE.md) - Generate promosi dengan AI
- [Thermal Printer Guide](./THERMAL_PRINTER_GUIDE.md) - Setup thermal printer
- [WiFi Printer Guide](./WIFI_PRINTER_GUIDE.md) - Setup WiFi printer
- [Cloud Printing Guide](./CLOUD_PRINTING_GUIDE.md) - Setup cloud printing

## 🎯 Default Login

```
Username: admin
PIN: 139755
```

**PENTING:** Ganti PIN setelah login pertama!

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (ready)
- **Storage:** Firebase Storage
- **AI:** OpenRouter API
- **PWA:** vite-plugin-pwa
- **Charts:** Recharts
- **Icons:** Lucide React

## 📱 PWA Installation

### Android (Chrome)
1. Buka aplikasi di Chrome
2. Klik menu (⋮) → "Install app"
3. Konfirmasi install
4. ✅ Aplikasi terinstall di home screen

### iOS (Safari)
1. Buka aplikasi di Safari
2. Klik Share → "Add to Home Screen"
3. Konfirmasi nama
4. ✅ Aplikasi terinstall di home screen

### Desktop (Chrome/Edge)
1. Buka aplikasi di browser
2. Klik icon install di address bar
3. Konfirmasi install
4. ✅ Aplikasi terinstall di desktop

## 🔐 Security

- ✅ Firebase API keys di environment variables
- ✅ PIN authentication
- ✅ Role-based access control
- ✅ Firestore security rules
- ✅ HTTPS only (Netlify auto)

## 📊 Database Structure

### Collections
- `menu` - Daftar menu makanan
- `transactions` - Riwayat transaksi
- `users` - Data pengguna
- `settings` - Pengaturan aplikasi

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**PENTING:** Update rules untuk production!

## 🎨 Customization

### Logo & Branding
1. Buka Settings → Akun Toko
2. Upload logo
3. Isi nama toko & tagline
4. Simpan pengaturan
5. ✅ Branding update di seluruh aplikasi

### Printer Settings
1. Buka Settings → Printer
2. Pilih metode koneksi (Bluetooth/WiFi/Cloud)
3. Pilih ukuran kertas (58mm/80mm)
4. Hubungkan printer
5. Test print
6. ✅ Printer siap digunakan

## 🐛 Troubleshooting

### PWA tidak bisa install
- Pastikan deploy di HTTPS
- Check manifest.webmanifest ada
- Check service worker terdaftar
- Clear browser cache

### Printer tidak terhubung
- Check printer menyala
- Check koneksi Bluetooth/WiFi
- Restart printer
- Coba hubungkan ulang

### Data tidak sync
- Check koneksi internet
- Check Firebase Console
- Check Firestore rules
- Reload aplikasi

## 📝 License

MIT License - Bebas digunakan untuk komersial

## 🤝 Contributing

Contributions welcome! Silakan buat issue atau pull request.

## 📞 Support

Untuk pertanyaan atau bantuan:
- Baca dokumentasi di folder docs
- Check Firebase Console untuk error logs
- Check browser console (F12) untuk debugging

## 🎉 Credits

Dibuat dengan ❤️ untuk UMKM Indonesia

---

**Version:** 1.7.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready
