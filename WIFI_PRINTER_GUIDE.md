# 📶 WiFi Thermal Printer Setup Guide

Panduan lengkap untuk menghubungkan dan menggunakan printer thermal WiFi dengan aplikasi DapurKu.

## 📋 Persyaratan

### **Printer yang Kompatibel:**
- ✅ Printer thermal WiFi dengan protokol ESC/POS
- ✅ Ukuran kertas: **58mm** atau **80mm**
- ✅ Support koneksi jaringan (WiFi/Ethernet)
- ✅ Contoh merk:
  - Epson TM-T82 WiFi
  - Xprinter XP-N160II
  - Muno thermal printer WiFi
  - Rongta RP80 series
  - Dan lain-lain yang support network printing

### **Jaringan:**
- ✅ Router WiFi 2.4GHz atau 5GHz
- ✅ Device (laptop/PC) dan printer dalam **jaringan yang sama**
- ✅ IP address printer sudah di-set (static DHCP recommended)

---

## 🔧 Cara Mengetahui IP Address Printer

### **Method 1: Print Test Page**
1. Nyalakan printer
2. Tekan tombol **Feed** + **Power** bersamaan (atau sesuai manual printer)
3. Printer akan mencetak test page
4. Lihat IP address di hasil cetak

### **Method 2: Cek di Router**
1. Login ke router (biasanya 192.168.1.1)
2. Buka **DHCP Client List** atau **Connected Devices**
3. Cari device dengan nama printer
4. Catat IP address-nya

### **Method 3: Gunakan Network Scanner**
1. Download aplikasi network scanner (Advanced IP Scanner, Fing, dll)
2. Scan jaringan lokal
3. Cari device printer
4. Catat IP address-nya

---

## 🚀 Setup di Aplikasi

### **Step 1: Buka Pengaturan Printer**
1. Login ke aplikasi DapurKu
2. Klik menu **"Pengaturan"**
3. Pilih tab **"Printer"**

### **Step 2: Pilih Metode Koneksi WiFi**
1. Klik tombol **"WiFi"** di bagian Metode Koneksi
2. Form konfigurasi WiFi akan muncul

### **Step 3: Isi Konfigurasi**
```
IP Address: 192.168.1.100  (sesuaikan dengan IP printer Anda)
Port: 9100                  (default port thermal printer)
```

### **Step 4: Hubungkan Printer**
1. Klik tombol **"Hubungkan WiFi Printer"**
2. Tunggu proses koneksi (~2-5 detik)
3. Jika berhasil, akan muncul notifikasi "Printer WiFi berhasil terhubung"
4. Status akan berubah menjadi **"Terhubung: WiFi Printer (192.168.1.100)"**

### **Step 5: Test Cetak**
1. Klik tombol **"Test Cetak"**
2. Printer akan mencetak struk test
3. Jika berhasil → printer siap digunakan! ✅

---

## 📊 Format Struk WiFi Printer

Struk yang dicetak menggunakan format **ESC/POS** standar:

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

### ❌ Error: "Gagal terhubung ke printer WiFi"

**Kemungkinan Penyebab:**
1. IP address salah
2. Port salah
3. Printer tidak dalam jaringan yang sama
4. Printer offline
5. Firewall memblokir koneksi

**Solusi:**
1. **Cek IP address printer**
   - Print test page dari printer
   - Pastikan IP address benar
   
2. **Cek port**
   - Default: 9100
   - Beberapa printer menggunakan port lain (8008, 9101, dll)
   - Cek manual printer
   
3. **Cek jaringan**
   - Pastikan device dan printer di WiFi yang sama
   - Test ping dari command prompt:
     ```bash
     ping 192.168.1.100
     ```
   - Jika tidak bisa ping → masalah jaringan
   
4. **Cek printer**
   - Pastikan printer menyala
   - Cek lampu indicator (harus hijau/biru, bukan merah)
   - Cetak test page manual
   
5. **Cek firewall**
   - Temporarily disable firewall untuk test
   - Add exception untuk port printer (9100)

### ❌ Printer terhubung tapi tidak mencetak

**Solusi:**
1. **Cek kertas**
   - Pastikan kertas thermal terpasang dengan benar
   - Cek arah kertas (harus sesuai)
   
2. **Cek koneksi**
   - Disconnect dan reconnect printer
   - Restart printer
   
3. **Cek format**
   - Beberapa printer butuh format khusus
   - Coba test print dari aplikasi printer vendor
   
4. **Fallback ke browser print**
   - Jika HTTP print gagal, aplikasi akan otomatis buka print dialog
   - Pilih printer WiFi dari daftar
   - Print manual

### ❌ IP address berubah-ubah

**Solusi:**
1. **Set Static IP di Router**
   - Login ke router
   - Buka DHCP Reservation / Static Lease
   - Reserve IP untuk MAC address printer
   
2. **Set Static IP di Printer**
   - Buka pengaturan printer
   - Set IP address manual (bukan DHCP)
   - Contoh: 192.168.1.100

---

## 🔐 Security & Network

### **Keamanan Jaringan:**
- ✅ Printer hanya menerima data dari jaringan lokal
- ✅ Tidak ada data sensitif dikirim ke internet
- ✅ Koneksi lokal (tidak via internet)
- ✅ Aman untuk data pelanggan

### **Best Practices:**
1. **Gunakan Static IP** untuk printer
2. **Pisahkan jaringan** printer dari jaringan publik
3. **Update firmware** printer secara berkala
4. **Ganti password default** router
5. **Enable WPA2/WPA3** untuk WiFi

---

## 📱 Platform Support

| Platform | WiFi Printer Support |
|----------|---------------------|
| **Windows** | ✅ Full Support |
| **macOS** | ✅ Full Support |
| **Linux** | ✅ Full Support |
| **Android** | ✅ Full Support |
| **iOS** | ✅ Full Support |

**Note:** WiFi printer support di **semua platform** karena menggunakan HTTP protocol.

---

## 💡 Tips & Best Practices

### **Untuk Performa Terbaik:**

1. **Gunakan Static IP**
   - Set static IP di router untuk printer
   - Hindari IP berubah-ubah
   
2. **Jaringan Terpisah**
   - Pisahkan jaringan printer dari jaringan tamu
   - Gunakan VLAN jika memungkinkan
   
3. **Monitor Koneksi**
   - Cek status printer secara berkala
   - Test print setiap pagi sebelum buka
   
4. **Backup Plan**
   - Siapkan printer Bluetooth sebagai backup
   - Atau gunakan cloud printing

### **Untuk Multi-Printer:**

Jika punya banyak printer WiFi:
1. Setiap printer punya IP address berbeda
2. Setup di Settings untuk masing-masing printer
3. Pilih printer aktif saat connect

### **Network Troubleshooting Tools:**

```bash
# Ping printer
ping 192.168.1.100

# Check port
telnet 192.168.1.100 9100

# Network scan (Linux/Mac)
nmap -p 9100 192.168.1.0/24

# Network scan (Windows)
# Gunakan Advanced IP Scanner
```

---

## 🆘 Support & Bantuan

### **Printer Tidak Kompatibel?**

Cek spesifikasi printer Anda:
- ✅ Support **WiFi/Ethernet** connection
- ✅ Support **ESC/POS protocol**
- ✅ Support **raw printing** via port 9100

Jika tidak compatible, alternatif:
- Pakai printer **Bluetooth** (jika browser support)
- Pakai **Cloud Print** (via internet)
- Upgrade ke printer WiFi compatible

### **Butuh Bantuan Lebih Lanjut?**

1. Cek dokumentasi printer Anda
2. Update firmware printer
3. Contact support printer
4. Atau gunakan metode cetak alternatif (Bluetooth/Cloud)

---

## 📊 Perbandingan Metode Koneksi

| Fitur | Bluetooth | WiFi | Cloud Print |
|-------|-----------|------|-------------|
| **Browser Support** | Chrome/Edge only | ✅ Semua browser | ✅ Semua browser |
| **Device Support** | Desktop/Android | ✅ Semua device | ✅ Semua device |
| **Koneksi** | Langsung | Via jaringan lokal | Via internet |
| **Kecepatan** | ⚡ Sangat cepat | ⚡ Sangat cepat | 🌐 Tergantung internet |
| **Offline** | ✅ Bisa | ✅ Bisa | ❌ Butuh internet |
| **Jarak** | ~10 meter | ✅ Satu jaringan | ✅ Dari mana saja |
| **Setup** | Perlu pairing | Perlu IP address | Pilih dari list |
| **Stabilitas** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Best For** | Mobile kasir | Toko dengan jaringan | Multi-location |

---

## ✅ Checklist Setup

Sebelum mulai cetak:

- [ ] Printer WiFi menyala & connected ke jaringan
- [ ] IP address printer sudah diketahui
- [ ] Device dan printer di jaringan yang sama
- [ ] IP address sudah diisi di Settings
- [ ] Port sudah benar (default: 9100)
- [ ] Test ping berhasil
- [ ] Aplikasi sudah connect ke printer
- [ ] Test print berhasil

---

## 🎯 Quick Reference

### **Connect Printer:**
```
Settings → Printer → WiFi → Isi IP & Port → Hubungkan
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

### **Cek IP Printer:**
```
1. Print test page dari printer
2. Atau cek di router DHCP list
3. Atau gunakan network scanner
```

---

**Selamat! Printer WiFi Anda siap digunakan! 🎉**

Jika ada masalah, cek bagian Troubleshooting atau contact support.
