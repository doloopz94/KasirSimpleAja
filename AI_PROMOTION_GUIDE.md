# 🤖 AI Promotion Generator

Fitur pembuatan pesan promosi otomatis menggunakan AI dari OpenRouter API.

## ✨ Fitur

- **Generate Otomatis** - AI membuat pesan promosi yang menarik dan kreatif
- **Multi-Style** - Support 5 style: Casual, Promo, Formal, Story, Facebook
- **Customizable** - Bisa tambah diskon dan informasi tambahan
- **Editable** - Hasil AI bisa diedit sebelum di-share
- **Multi-Platform** - Share ke WhatsApp, Facebook, atau copy text

## 🚀 Cara Menggunakan

### 1. Pilih Menu
- Centang menu yang ingin dipromosikan
- Bisa pilih semua atau beberapa menu saja

### 2. Pilih Style
Pilih salah satu dari 5 style:
- 😊 **Santai & Akrab** - Bahasa gaul, cocok untuk WhatsApp
- 🎉 **Promo Spesial** - Menonjolkan diskon/promo
- 💼 **Formal & Profesional** - Untuk pelanggan korporat
- 📸 **Story WA/IG** - Singkat, cocok untuk story
- 📘 **Facebook Post** - Engaging dengan hashtag

### 3. Isi Informasi Tambahan (Opsional)
- **Diskon** - Isi persentase diskon (khusus style Promo)
- **Informasi Tambahan** - Contoh: "Gratis ongkir", "Buka sampai jam 9 malam", dll

### 4. Generate dengan AI
- Klik tombol **"Generate dengan AI ✨"**
- Tunggu 3-5 detik
- AI akan membuat pesan promosi yang menarik

### 5. Edit & Share
- Hasil AI akan muncul di preview
- Bisa diedit jika perlu
- Share ke WhatsApp/Facebook atau copy text

## 🎯 Contoh Penggunaan

### Contoh 1: Promo Makan Siang
```
Menu: Nasi Goreng, Ayam Goreng, Es Teh
Style: Promo Spesial
Diskon: 20%
Info Tambahan: "Gratis ongkir area Jakarta Selatan"

Hasil AI:
🔥 *PROMO MAKAN SIANG!* 🔥

Halo food lovers! 🍽️
Nikmati diskon 20% untuk semua menu makan siang kami!

✅ Nasi Goreng Spesial - Rp 20.000 → Rp 16.000
✅ Ayam Goreng Kremes - Rp 25.000 → Rp 20.000
✅ Es Teh Manis - Rp 5.000 → Rp 4.000

🎁 GRATIS ONGKIR area Jakarta Selatan!
⏰ Promo berlaku sampai jam 2 siang

Yuk order sekarang sebelum kehabisan! 🏃‍♂️
📲 WA: 0812-3456-7890

#PromoMakan #DiskonMakanan #DapurKu
```

### Contoh 2: Story Instagram
```
Menu: 5 menu terlaris
Style: Story WA/IG
Info Tambahan: "New menu available!"

Hasil AI:
✨ *DAPURKU* ✨

🍽️ TODAY'S MENU

• Nasi Goreng - Rp 20.000
• Ayam Goreng - Rp 25.000
• Mie Goreng - Rp 18.000
• Soto Ayam - Rp 22.000
• Es Teh - Rp 5.000

🔥 NEW MENU AVAILABLE!
📲 DM to order
```

## 💡 Tips

1. **Pilih Style yang Tepat**
   - WhatsApp broadcast → Casual atau Promo
   - Instagram story → Story
   - Facebook post → Facebook
   - Email korporat → Formal

2. **Tambah Informasi Spesifik**
   - Jam buka/tutup
   - Area delivery
   - Minimum order
   - Promo spesial hari ini

3. **Edit Hasil AI**
   - AI memberikan draft awal
   - Edit sesuai kebutuhan
   - Tambah info kontak
   - Sesuaikan dengan brand voice

4. **Gunakan Diskon dengan Bijak**
   - Diskon 10-20% biasanya efektif
   - Jangan terlalu besar (merugikan)
   - Buat urgency dengan batas waktu

## 🔧 Technical Details

### API yang Digunakan
- **Provider**: OpenRouter AI
- **Model**: Google Gemini 2.0 Flash
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`

### Rate Limit
- Free tier: 100 requests/hari
- Cukup untuk penggunaan normal
- Jika limit tercapai, gunakan template manual

### Error Handling
- Jika API error, akan muncul pesan error
- Bisa fallback ke template manual
- Check console untuk detail error

## 🐛 Troubleshooting

### Error: "Gagal generate pesan dengan AI"
**Solusi:**
1. Check koneksi internet
2. Check API key masih valid
3. Coba lagi dalam beberapa detik
4. Gunakan template manual sebagai fallback

### Error: "Pilih minimal 1 menu"
**Solusi:**
- Centang minimal 1 menu sebelum generate

### Hasil AI Kurang Sesuai
**Solusi:**
1. Tambah informasi tambahan yang lebih spesifik
2. Pilih style yang berbeda
3. Edit hasil AI secara manual
4. Generate ulang

## 📊 Perbandingan: AI vs Template Manual

| Fitur | AI Generate | Template Manual |
|-------|-------------|-----------------|
| **Kecepatan** | ⚡ 3-5 detik | ⚡ Instant |
| **Kreativitas** | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐ Medium |
| **Customization** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Full control |
| **Konsistensi** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Very consistent |
| **Offline** | ❌ Butuh internet | ✅ Bisa offline |

**Rekomendasi:**
- Gunakan **AI** untuk ide awal dan variasi
- Gunakan **Template** untuk pesan yang sudah pasti
- **Kombinasi keduanya** untuk hasil terbaik

## 🎨 Contoh Style Guide

### Casual Style
```
Bahasa: Santai, gaul, friendly
Emoji: Banyak (🍽️🔥✨💰📲)
Tone: Seperti ngobrol dengan teman
Length: 10-15 baris
```

### Promo Style
```
Bahasa: Urgent, memotivasi
Emoji: Menonjol (🔥🎉💰⚡👉)
Tone: Exciting, FOMO
Length: 12-18 baris
```

### Formal Style
```
Bahasa: Sopan, profesional
Emoji: Minimal (📋📌✅)
Tone: Respectful, business-like
Length: 15-20 baris
```

### Story Style
```
Bahasa: Singkat, padat
Emoji: Eye-catching (✨🔥📲)
Tone: Quick, direct
Length: 5-7 baris
```

### Facebook Style
```
Bahasa: Engaging, conversational
Emoji: Moderate (🍳🔸✅💬)
Tone: Community-friendly
Length: 15-20 baris + hashtags
```

## 🔐 Security

- API key disimpan di code (client-side)
- Untuk production, pertimbangkan:
  - Gunakan backend proxy
  - Rate limiting
  - API key rotation
- Saat ini aman untuk penggunaan internal/UMKM

## 📈 Future Enhancements

- [ ] Multiple AI models (GPT-4, Claude, dll)
- [ ] Image generation untuk promosi
- [ ] A/B testing pesan
- [ ] Analytics & tracking
- [ ] Scheduled posting
- [ ] Template library
- [ ] Multi-language support

---

**Fitur AI Promotion Generator siap digunakan! 🎉**

Generate pesan promosi yang menarik dan kreatif dalam hitungan detik!
