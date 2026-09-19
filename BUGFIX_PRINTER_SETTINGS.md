# 🔧 Bug Fix: Printer Settings Tidak Bisa Diklik

## 🐛 Masalah

Pada halaman **Settings → Printer**, button-button untuk memilih:
- Metode Koneksi (Bluetooth / WiFi / Cloud Print)
- Ukuran Kertas (58mm / 80mm)

**Tidak bisa diklik** dan tidak ada perubahan visual saat diklik.

---

## 🔍 Root Cause

Button-button printer di `SettingsPage.tsx` tidak memiliki:
1. ❌ `onClick` handler
2. ❌ State management untuk menyimpan pilihan
3. ❌ Visual feedback dinamis (border/background berubah sesuai pilihan)

**Kode Lama:**
```tsx
<button className="py-3 px-4 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-700">
  <Wifi size={16} />
  Bluetooth
</button>
```

Button hanya memiliki `className` statis tanpa fungsi apapun.

---

## ✅ Solusi yang Diterapkan

### 1. Tambah State untuk Printer Settings

**File:** `src/components/SettingsPage.tsx`

```tsx
interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storeAddress: string;
  storePhone: string;
  storeLogo: string;
  printerConnection: 'bluetooth' | 'wifi' | 'cloud';  // ← BARU
  printerPaperSize: '58mm' | '80mm';                  // ← BARU
}

const [storeSettings, setStoreSettings] = useState<StoreSettings>({
  storeName: 'DapurKu',
  storeTagline: 'Makanan Rumahan Online',
  storeAddress: 'Jl. Contoh No. 123, Jakarta',
  storePhone: '0812-3456-7890',
  storeLogo: '',
  printerConnection: 'bluetooth',   // ← Default value
  printerPaperSize: '80mm',         // ← Default value
});
```

### 2. Load Settings dari localStorage

```tsx
useEffect(() => {
  const saved = localStorage.getItem('dapurku_settings');
  if (saved) {
    const parsed = JSON.parse(saved);
    setStoreSettings({
      // ... other settings
      printerConnection: parsed.printerConnection || 'bluetooth',
      printerPaperSize: parsed.printerPaperSize || '80mm',
    });
  }
}, []);
```

### 3. Tambah onClick Handler dengan Visual Feedback

**Metode Koneksi:**
```tsx
<button 
  onClick={() => setStoreSettings({ ...storeSettings, printerConnection: 'bluetooth' })}
  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
    storeSettings.printerConnection === 'bluetooth'
      ? 'border-blue-500 bg-blue-50 text-blue-700'  // ← Aktif
      : 'border-gray-200 hover:border-gray-300 text-gray-600'  // ← Tidak aktif
  }`}
>
  <Wifi size={16} />
  Bluetooth
</button>
```

**Ukuran Kertas:**
```tsx
<button 
  onClick={() => setStoreSettings({ ...storeSettings, printerPaperSize: '58mm' })}
  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
    storeSettings.printerPaperSize === '58mm'
      ? 'border-blue-500 bg-blue-50 text-blue-700'
      : 'border-gray-200 hover:border-gray-300 text-gray-600'
  }`}
>
  58mm
</button>
```

### 4. Update ReceiptModal untuk Baca Printer Settings

**File:** `src/components/ReceiptModal.tsx`

```tsx
const getStoreInfo = () => {
  const saved = localStorage.getItem('dapurku_settings');
  if (saved) {
    const settings = JSON.parse(saved);
    return {
      storeName: settings.storeName || storeName,
      storeTagline: settings.storeTagline || 'Makanan Rumahan Online',
      storeAddress: settings.storeAddress || '',
      storePhone: settings.storePhone || '',
      printerConnection: settings.printerConnection || 'bluetooth',  // ← BARU
      printerPaperSize: settings.printerPaperSize || '80mm'         // ← BARU
    };
  }
  return {
    // ... default values
    printerConnection: 'bluetooth',
    printerPaperSize: '80mm'
  };
};
```

### 5. Gunakan Printer Settings di handlePrintThermal

```tsx
const handlePrintThermal = async () => {
  const storeInfo = getStoreInfo();
  const { storeAddress, storePhone, printerConnection } = storeInfo;
  
  if (printerConnection === 'bluetooth') {
    // Print via Bluetooth
    await thermalPrinter.printReceipt(...);
  } else if (printerConnection === 'wifi') {
    // Print via WiFi
    await wifiPrinter.printReceipt(...);
  } else if (printerConnection === 'cloud') {
    // Print via Cloud
    await cloudPrinter.printReceipt(...);
  }
};
```

---

## 🎯 Hasil Setelah Fix

### ✅ Button Bisa Diklik
- Klik Bluetooth → Bluetooth aktif (border biru, background biru muda)
- Klik WiFi → WiFi aktif (border biru, background biru muda)
- Klik Cloud Print → Cloud Print aktif (border biru, background biru muda)

### ✅ Visual Feedback Dinamis
- Button yang dipilih: `border-blue-500 bg-blue-50 text-blue-700`
- Button yang tidak dipilih: `border-gray-200 text-gray-600`
- Hover effect: `hover:border-gray-300`

### ✅ Settings Tersimpan
- Pilihan tersimpan ke localStorage
- Saat reload halaman, pilihan tetap ada
- ReceiptModal menggunakan pilihan yang tersimpan

### ✅ Ukuran Kertas Juga Bisa Diklik
- Klik 58mm → 58mm aktif
- Klik 80mm → 80mm aktif
- Visual feedback sama seperti metode koneksi

---

## 📊 Perbandingan: Sebelum vs Sesudah

### Sebelum Fix
```tsx
<button className="py-3 px-4 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-700">
  <Wifi size={16} />
  Bluetooth
</button>
```
❌ Tidak ada onClick  
❌ Tidak ada state  
❌ Tidak ada visual feedback dinamis  
❌ Settings tidak tersimpan  

### Sesudah Fix
```tsx
<button 
  onClick={() => setStoreSettings({ ...storeSettings, printerConnection: 'bluetooth' })}
  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
    storeSettings.printerConnection === 'bluetooth'
      ? 'border-blue-500 bg-blue-50 text-blue-700'
      : 'border-gray-200 hover:border-gray-300 text-gray-600'
  }`}
>
  <Wifi size={16} />
  Bluetooth
</button>
```
✅ onClick handler  
✅ State management  
✅ Visual feedback dinamis  
✅ Settings tersimpan ke localStorage  

---

## 🧪 Testing Guide

### Test 1: Metode Koneksi
1. Buka **Settings → Printer**
2. Klik **Bluetooth** → Harus aktif (biru)
3. Klik **WiFi** → WiFi aktif, Bluetooth tidak aktif
4. Klik **Cloud Print** → Cloud Print aktif, yang lain tidak aktif
5. Refresh halaman → Pilihan harus tetap sama

### Test 2: Ukuran Kertas
1. Buka **Settings → Printer**
2. Klik **58mm** → Harus aktif (biru)
3. Klik **80mm** → 80mm aktif, 58mm tidak aktif
4. Refresh halaman → Pilihan harus tetap sama

### Test 3: Print Struk
1. Pilih metode koneksi (misal: Bluetooth)
2. Buat transaksi baru
3. Klik **Cetak Struk**
4. Klik **Thermal**
5. Harus print menggunakan metode yang dipilih

### Test 4: LocalStorage
1. Buka DevTools (F12)
2. Pilih tab **Application**
3. Buka **Local Storage** → site Anda
4. Cari key `dapurku_settings`
5. Harus ada field:
   - `printerConnection`: "bluetooth" / "wifi" / "cloud"
   - `printerPaperSize`: "58mm" / "80mm"

---

## 📝 Files Modified

1. **`src/components/SettingsPage.tsx`**
   - Tambah `printerConnection` dan `printerPaperSize` di interface
   - Tambah default values di state
   - Load settings dari localStorage
   - Tambah onClick handler untuk semua button printer
   - Visual feedback dinamis dengan conditional className

2. **`src/components/ReceiptModal.tsx`**
   - Update `getStoreInfo()` untuk include printer settings
   - Ganti `printerConnectionMethod` → `printerConnection`
   - Gunakan printer settings di `handlePrintThermal()`

---

## 🔐 Data Structure

### localStorage: `dapurku_settings`
```json
{
  "storeName": "DapurKu",
  "storeTagline": "Makanan Rumahan Online",
  "storeAddress": "Jl. Contoh No. 123, Jakarta",
  "storePhone": "0812-3456-7890",
  "storeLogo": "data:image/png;base64,...",
  "printerConnection": "bluetooth",
  "printerPaperSize": "80mm"
}
```

---

## 💡 Tips

### Untuk Developer
- Selalu gunakan `onClick` handler untuk button interaktif
- Gunakan state management untuk menyimpan pilihan user
- Gunakan conditional className untuk visual feedback
- Simpan settings ke localStorage untuk persistensi

### Untuk User
- Pilih metode koneksi sesuai printer yang digunakan
- Pilih ukuran kertas sesuai printer thermal Anda
- Settings akan tersimpan otomatis
- Tidak perlu setup ulang setiap kali buka aplikasi

---

## 🐛 Troubleshooting

### Button masih tidak bisa diklik
**Solusi:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Cek console untuk error JavaScript
4. Pastikan code terbaru sudah di-deploy

### Settings tidak tersimpan
**Solusi:**
1. Cek localStorage tidak penuh
2. Cek browser tidak dalam private/incognito mode
3. Klik "Simpan Pengaturan" setelah memilih
4. Cek DevTools → Application → Local Storage

### Print tidak menggunakan metode yang dipilih
**Solusi:**
1. Cek localStorage → `dapurku_settings` → `printerConnection`
2. Pastikan value sesuai dengan pilihan
3. Refresh halaman
4. Coba print ulang

---

## 📚 Related Documentation

- [Printer Setup Guide](./THERMAL_PRINTER_GUIDE.md)
- [WiFi Printer Guide](./WIFI_PRINTER_GUIDE.md)
- [Cloud Printing Guide](./CLOUD_PRINTING_GUIDE.md)
- [Settings Branding Features](./FEATURES_SETTINGS_BRANDING.md)

---

**Status:** ✅ Fixed  
**Version:** 1.6.1  
**Date:** 2024  
**Severity:** Medium  
**Impact:** Printer settings tidak bisa digunakan
