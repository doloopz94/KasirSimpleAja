# 🖨️ Panduan Printer Thermal Bluetooth

Panduan lengkap untuk menghubungkan dan menggunakan printer thermal Bluetooth dengan aplikasi DapurKu.

---

## 📋 Persyaratan

### **Browser yang Didukung:**
- ✅ **Google Chrome** (Desktop & Android) - Recommended
- ✅ **Microsoft Edge** (Desktop)
- ✅ **Opera** (Desktop & Android)
- ❌ Safari (Tidak mendukung Web Bluetooth)
- ❌ Firefox (Belum mendukung Web Bluetooth)

### **Printer yang Kompatibel:**
- Printer thermal Bluetooth dengan protokol **ESC/POS**
- Ukuran kertas: **58mm** atau **80mm**
- Contoh merk:
  - Xprinter XP-58
  - Epson TM-T82
  - Muno thermal printer
  - Rongta RP326
  - Dan lain-lain yang mendukung ESC/POS

### **Sistem Operasi:**
- ✅ Windows 10/11
- ✅ macOS (Chrome/Edge)
- ✅ Linux (Chrome)
- ✅ Android (Chrome)
- ❌ iOS (Tidak mendukung Web Bluetooth)

---

## 🔧 Cara Menghubungkan Printer

### **Step 1: Persiapan Printer**

1. **Nyalakan printer thermal**
2. **Aktifkan mode pairing Bluetooth**
   - Biasanya tekan tombol "Feed" + "Power" bersamaan
   - Atau lihat manual printer Anda
3. **Pastikan printer dalam jangkauan** (max 10 meter)

### **Step 2: Connect di Aplikasi**

1. Buka aplikasi DapurKu
2. Login sebagai admin
3. Klik menu **"Pengaturan"** (icon gear)
4. Pilih tab **"Printer"**
5. Pilih ukuran kertas:
   - **58mm** - Printer kecil
   - **80mm** - Printer standar (recommended)
6. Klik tombol **"Scan & Hubungkan Printer"**
7. Popup browser akan muncul: **"Select a Bluetooth device"**
8. Pilih printer Anda dari daftar
9. Klik **"Pair"** atau **"Connect"**
10. Tunggu hingga muncul: **"Terhubung: [Nama Printer]"**

### **Step 3: Test Cetak**

1. Setelah terhubung, klik tombol **"Test Cetak"**
2. Printer akan mencetak struk test
3. Jika berhasil → printer siap digunakan! ✅

---

## 🧾 Cara Mencetak Struk

### **Otomatis setelah Transaksi:**
Setiap selesai transaksi, struk akan otomatis tercetak jika printer terhubung.

### **Cetak Ulang Struk Lama:**
1. Buka menu **"Laporan"**
2. Klik **"Riwayat Transaksi"**
3. Cari transaksi yang ingin dicetak
4. Klik icon **Printer** 🖨️ di kolom aksi
5. Struk akan tercetak otomatis

---

## 🎨 Format Struk

Struk yang dicetak mencakup:

```
================================
        DapurKu
   Jl. Contoh No. 123
    Telp: 0812-3456-7890
================================
No: #ABC123
Tanggal: 15 Jan 2024, 14:30
Pelanggan: Budi
HP: 081234567890
--------------------------------
ITEM PESANAN:
Nasi Goreng
  2 x Rp 20.000
  = Rp 40.000
Es Teh
  1 x Rp 5.000
  = Rp 5.000
--------------------------------
Subtotal: Rp 45.000
Ongkir: Rp 5.000
TOTAL: Rp 50.000
Bayar: TUNAI
================================
      Terima kasih!
     --- DapurKu ---
```

---

## 🐛 Troubleshooting

### ❌ Error: "Web Bluetooth tidak didukung"

**Solusi:**
- Gunakan **Chrome** atau **Edge**
- Update browser ke versi terbaru
- Jangan pakai Safari atau Firefox

### ❌ Printer tidak muncul di daftar

**Solusi:**
1. Pastikan printer **sudah dinyalakan**
2. Pastikan printer dalam **mode pairing**
3. Jarak printer **< 10 meter**
4. Restart printer (matikan → nyalakan)
5. Refresh browser (Ctrl+F5)
6. Cek Bluetooth laptop/HP sudah aktif

### ❌ Gagal terhubung

**Solusi:**
1. **Unpair** printer dari sistem operasi:
   - Windows: Settings → Bluetooth → Remove device
   - Mac: System Preferences → Bluetooth → Remove
   - Android: Settings → Bluetooth → Unpair
2. Restart browser
3. Coba connect lagi dari aplikasi

### ❌ Struk tidak tercetak

**Solusi:**
1. Cek koneksi printer (harus ada indicator "Terhubung")
2. Cek kertas thermal sudah terpasang
3. Cek printer tidak error (lampu indicator)
4. Klik **"Test Cetak"** untuk test
5. Restart printer dan reconnect

### ❌ Text tidak terbaca / berantakan

**Solusi:**
1. Pastikan **ukuran kertas** sudah benar (58mm/80mm)
2. Cek printer mendukung **ESC/POS protocol**
3. Update firmware printer (jika ada)
4. Coba printer lain untuk test

---

## 📱 Platform Support

| Platform | Browser | Status |
|----------|---------|--------|
| **Windows** | Chrome/Edge | ✅ Full Support |
| **macOS** | Chrome/Edge | ✅ Full Support |
| **Linux** | Chrome | ✅ Full Support |
| **Android** | Chrome | ✅ Full Support |
| **iOS** | Safari/Chrome | ❌ Not Supported |

**Note untuk iOS:**
- iOS tidak mendukung Web Bluetooth API
- Alternatif: Pakai printer WiFi atau cetak via PDF
- Atau gunakan laptop/Android untuk cetak

---

## 🔐 Security & Permissions

### **Browser Permissions:**
Saat pertama kali connect, browser akan minta:
1. **Bluetooth permission** → Klik "Allow"
2. **Select device** → Pilih printer Anda
3. **Pairing** → Klik "Pair"

### **Data Privacy:**
- ✅ Printer hanya menerima data struk
- ✅ Tidak ada data sensitif dikirim ke printer
- ✅ Koneksi lokal (tidak via internet)
- ✅ Aman untuk data pelanggan

---

## 💡 Tips & Best Practices

### **Untuk Performa Terbaik:**

1. **Jaga jarak printer** < 5 meter dari device
2. **Hindari interferensi** dengan device Bluetooth lain
3. **Update browser** ke versi terbaru
4. **Restart printer** jika koneksi tidak stabil
5. **Gunakan kertas berkualitas** untuk hasil cetak terbaik

### **Untuk Multi-Device:**

Jika punya banyak device (kasir, admin, dll):
1. Setiap device harus **connect sendiri** ke printer
2. Printer hanya bisa terhubung ke **1 device dalam 1 waktu**
3. Untuk multi-printer: setup di Settings untuk masing-masing printer

### **Backup Plan:**

Jika printer Bluetooth bermasalah:
1. **Cetak PDF** → Bisa print manual
2. **Kirim WhatsApp** → Struk digital
3. **Copy text** → Paste ke aplikasi lain

---

## 🆘 Support & Bantuan

### **Printer Tidak Kompatibel?**

Cek spesifikasi printer Anda:
- ✅ Support **Bluetooth Low Energy (BLE)**
- ✅ Support **ESC/POS protocol**
- ✅ Service UUID: `000018f0-0000-1000-8000-00805f9b34fb`

Jika tidak compatible, alternatif:
- Pakai printer **WiFi** (cetak via PDF)
- Pakai printer **USB** (via komputer)
- Upgrade ke printer BLE compatible

### **Butuh Bantuan Lebih Lanjut?**

1. Cek dokumentasi printer Anda
2. Update firmware printer
3. Contact support printer
4. Atau gunakan metode cetak alternatif (PDF/WhatsApp)

---

## 📊 Status Koneksi

Di halaman **Settings → Printer**, Anda bisa lihat:

- 🟢 **Hijau** = Printer terhubung & siap
- 🔴 **Merah** = Printer tidak terhubung
- 🟡 **Kuning** = Sedang connecting

---

## 🎯 Quick Reference

### **Connect Printer:**
```
Settings → Printer → Scan & Hubungkan → Pilih printer → Pair
```

### **Test Print:**
```
Settings → Printer → Test Cetak
```

### **Print Receipt:**
```
Transaksi selesai → Auto print
ATAU
Laporan → Riwayat → Icon Printer
```

### **Disconnect:**
```
Settings → Printer → Putuskan Koneksi
```

---

## ✅ Checklist Setup

Sebelum mulai cetak:

- [ ] Browser: Chrome/Edge (versi terbaru)
- [ ] Printer: Menyala & mode pairing aktif
- [ ] Jarak: < 10 meter
- [ ] Bluetooth: Aktif di device
- [ ] Kertas: Terpasang dengan benar
- [ ] Aplikasi: Sudah connect ke printer
- [ ] Test print: Berhasil

---

**Selamat! Printer thermal Anda siap digunakan! 🎉**

Jika ada masalah, cek bagian Troubleshooting atau contact support.
