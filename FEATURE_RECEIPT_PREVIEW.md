# 📄 Fitur Preview Nota 58mm & 80mm

## ✨ Fitur Baru

Preview visual nota/struk dengan dua ukuran kertas thermal printer:
- **58mm** (Kecil) - Width: 220px
- **80mm** (Standar) - Width: 300px

---

## 🎯 Cara Menggunakan

### 1. Buka Struk Pembayaran
Setelah transaksi selesai, modal struk akan muncul otomatis.

### 2. Pilih Ukuran Kertas Preview
Di bagian atas modal, ada toggle untuk memilih ukuran kertas:

```
┌─────────────────────────────────────┐
│ 📄 Preview Ukuran Kertas            │
├─────────────────────────────────────┤
│ [58mm (Kecil)] [80mm (Standar)]     │
├─────────────────────────────────────┤
│ ✅ Ukuran standar - tampilan optimal│
└─────────────────────────────────────┘
```

### 3. Lihat Preview
Preview struk akan otomatis menyesuaikan dengan ukuran kertas yang dipilih:
- **58mm**: Container width 220px
- **80mm**: Container width 300px

### 4. Indikator Ukuran
Di atas preview, ada label yang menunjukkan ukuran kertas aktif:
- 🟠 Orange badge untuk 58mm
- 🟢 Green badge untuk 80mm

---

## 📊 Perbedaan 58mm vs 80mm

### 58mm (Kecil)
```
┌────────────────────┐
│   [Logo]           │
│   Nama Toko        │
│   Tagline          │
├────────────────────┤
│ No: #ABC123        │
│ Tgl: 15 Jan 2024   │
│ Plg: Budi          │
├────────────────────┤
│ Nasi Goreng        │
│ 2 x Rp 20.000      │
│ = Rp 40.000        │
│                    │
│ Es Teh             │
│ 1 x Rp 5.000       │
│ = Rp 5.000         │
├────────────────────┤
│ Subtotal: Rp 45.000│
│ TOTAL: Rp 45.000   │
│ Bayar: TUNAI       │
├────────────────────┤
│ Terima kasih!      │
└────────────────────┘
```

**Karakteristik:**
- ⚠️ Teks lebih padat
- ⚠️ Beberapa teks panjang mungkin terpotong
- ✅ Hemat kertas
- ✅ Cocok untuk printer portable

### 80mm (Standar)
```
┌──────────────────────────────┐
│        [Logo]                │
│      Nama Toko               │
│      Tagline                 │
├──────────────────────────────┤
│ No. Transaksi: #ABC123       │
│ Tanggal: 15 Jan 2024, 14:30  │
│ Pelanggan: Budi              │
│ No. HP: 081234567890         │
├──────────────────────────────┤
│ Nasi Goreng                  │
│   2 x Rp 20.000              │
│   = Rp 40.000                │
│                              │
│ Es Teh                       │
│   1 x Rp 5.000               │
│   = Rp 5.000                 │
├──────────────────────────────┤
│ Subtotal:         Rp 45.000  │
│ TOTAL:            Rp 45.000  │
│ Bayar: TUNAI                 │
├──────────────────────────────┤
│ Terima kasih atas pesanan!   │
│ --- Nama Toko ---            │
└──────────────────────────────┘
```

**Karakteristik:**
- ✅ Teks lebih lega
- ✅ Semua informasi terlihat jelas
- ✅ Tampilan profesional
- ✅ Standar industri

---

## 🎨 Visual Features

### 1. Paper Size Indicator
```
┌─────────────────────────────────────┐
│ PREVIEW STRUK              [80mm]  │
└─────────────────────────────────────┘
```
- Label "PREVIEW STRUK" di kiri
- Badge ukuran kertas di kanan (58mm/80mm)
- Badge berwarna: orange untuk 58mm, green untuk 80mm

### 2. Paper Container
```
┌─────────────────────────────────────┐
│ ╔═══════════════════════════════╗   │
│ ║                               ║   │
│ ║   [Isi Struk]                 ║   │
│ ║                               ║   │
│ ╚═══════════════════════════════╝   │
└─────────────────────────────────────┘
```
- Border dashed untuk efek kertas
- Shadow untuk depth
- Background gradient untuk texture
- Width sesuai ukuran kertas (220px/300px)

### 3. Toggle Buttons
```
┌─────────────────────────────────────┐
│ [58mm (Kecil)] [80mm (Standar)]     │
└─────────────────────────────────────┘
```
- Button aktif: bg-blue-500 text-white
- Button inactive: bg-white text-blue-700
- Smooth transition saat switch

### 4. Info Text
```
┌─────────────────────────────────────┐
│ ⚠️ Ukuran kecil - beberapa teks     │
│    mungkin terpotong                │
└─────────────────────────────────────┘
```
atau
```
┌─────────────────────────────────────┐
│ ✅ Ukuran standar - tampilan optimal│
└─────────────────────────────────────┘
```

---

## 🔧 Technical Details

### State Management
```typescript
const [previewSize, setPreviewSize] = useState<'58mm' | '80mm'>(
  getStoreInfo().printerPaperSize as '58mm' | '80mm'
);
```

### Preview Container
```typescript
<div 
  className="mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-lg overflow-hidden"
  style={{
    width: previewSize === '58mm' ? '220px' : '300px',
    maxWidth: '100%'
  }}
>
```

### Auto-detect Printer Setting
Preview otomatis menggunakan ukuran kertas dari settings printer:
```typescript
const getStoreInfo = () => {
  const saved = localStorage.getItem('dapurku_settings');
  if (saved) {
    const settings = JSON.parse(saved);
    return {
      // ...
      printerPaperSize: settings.printerPaperSize || '80mm'
    };
  }
  // ...
};
```

---

## 📱 Responsive Behavior

### Desktop
- Preview container centered
- Toggle buttons horizontal
- Full width available

### Tablet
- Preview container centered
- Toggle buttons horizontal
- Adequate width

### Mobile
- Preview container centered
- Toggle buttons horizontal
- Container max-width: 100%
- Scrollable if needed

---

## 🎯 Use Cases

### Kapan Gunakan 58mm?
- ✅ Printer portable/mobile
- ✅ Hemat kertas
- ✅ Struk sederhana (sedikit item)
- ✅ Kios kecil dengan space terbatas

### Kapan Gunakan 80mm?
- ✅ Printer desktop/standar
- ✅ Struk lengkap (banyak item)
- ✅ Tampilan profesional
- ✅ Toko/restaurant standar

---

## 🐛 Troubleshooting

### Preview Tidak Berubah Saat Toggle
**Solusi:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Cek console untuk error

### Teks Terpotong di 58mm
**Solusi:**
1. Gunakan 80mm untuk tampilan lebih baik
2. Atau edit nama menu agar lebih pendek
3. Atau gunakan 58mm hanya untuk struk sederhana

### Preview Tidak Sesuai dengan Hasil Cetak
**Penyebab:**
- Preview adalah visual representation
- Hasil cetak tergantung printer dan driver

**Solusi:**
1. Test print dulu dengan "Test Cetak"
2. Adjust printer settings jika perlu
3. Preview hanya untuk referensi visual

---

## 📋 Testing Checklist

### Basic Functionality
- [ ] Modal struk muncul setelah transaksi
- [ ] Toggle 58mm/80mm berfungsi
- [ ] Preview width berubah sesuai ukuran
- [ ] Label ukuran kertas update
- [ ] Info text update sesuai ukuran

### Visual Quality
- [ ] 58mm preview readable
- [ ] 80mm preview readable
- [ ] Border dashed terlihat
- [ ] Shadow effect terlihat
- [ ] Paper texture effect terlihat

### Responsive
- [ ] Preview centered di desktop
- [ ] Preview centered di tablet
- [ ] Preview centered di mobile
- [ ] Toggle buttons responsive
- [ ] Container max-width bekerja

### Integration
- [ ] Auto-detect printer paper size
- [ ] Preview match dengan settings
- [ ] Switch size tidak reset data
- [ ] Smooth transition

---

## 🎨 Design Specs

### 58mm Preview
- **Width**: 220px
- **Font Size**: 9-11px
- **Padding**: 12px
- **Border**: 2px dashed gray-300
- **Background**: gradient from-gray-50 to-white

### 80mm Preview
- **Width**: 300px
- **Font Size**: 10-12px
- **Padding**: 16px
- **Border**: 2px dashed gray-300
- **Background**: gradient from-gray-50 to-white

### Toggle Buttons
- **Height**: 40px
- **Padding**: 8px 12px
- **Border Radius**: 8px
- **Active**: bg-blue-500 text-white
- **Inactive**: bg-white text-blue-700 border-blue-200

### Paper Size Indicator
- **Height**: 32px
- **Badge Padding**: 4px 8px
- **Badge Radius**: 4px
- **58mm Badge**: bg-orange-100 text-orange-700
- **80mm Badge**: bg-green-100 text-green-700

---

## 📚 Related Features

- [Printer Settings](./BUGFIX_PRINTER_SETTINGS.md)
- [Thermal Printer Guide](./THERMAL_PRINTER_GUIDE.md)
- [Receipt Modal](./ReceiptModal.tsx)

---

## 🚀 Future Enhancements

### Potential Features
- [ ] Custom paper sizes
- [ ] Preview with logo on/off
- [ ] Preview with different fonts
- [ ] Export preview as image
- [ ] Print preview directly
- [ ] Side-by-side comparison (58mm vs 80mm)

---

**Status:** ✅ Implemented  
**Version:** 1.9.8  
**Date:** 2024  
**Files Modified:** 1 (ReceiptModal.tsx)
