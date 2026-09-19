# 📲 Panduan PWA (Progressive Web App)

## 🎯 Apa itu PWA?

PWA (Progressive Web App) adalah teknologi web yang memungkinkan aplikasi web diinstall dan digunakan seperti aplikasi native di device pengguna.

### Keuntungan PWA

✅ **Installable** - Bisa diinstall di home screen  
✅ **Offline Support** - Bisa digunakan tanpa internet  
✅ **Fast** - Loading cepat dengan caching  
✅ **Secure** - HTTPS required  
✅ **Auto Update** - Otomatis update tanpa manual refresh  
✅ **Cross Platform** - Bekerja di semua platform  
✅ **No App Store** - Tidak perlu publish ke app store  

---

## 🚀 Cara Install DapurKu PWA

### 📱 Android (Chrome)

#### **Method 1: Banner Install**
1. Buka aplikasi di Chrome
2. Banner "Install app" akan muncul otomatis
3. Klik **"Install"**
4. Konfirmasi install
5. ✅ Aplikasi terinstall di home screen

#### **Method 2: Menu Install**
1. Buka aplikasi di Chrome
2. Klik menu (⋮) di pojok kanan atas
3. Scroll dan klik **"Install app"** atau **"Add to Home screen"**
4. Konfirmasi install
5. ✅ Aplikasi terinstall di home screen

#### **Method 3: Address Bar**
1. Buka aplikasi di Chrome
2. Klik icon install di address bar (📲)
3. Konfirmasi install
4. ✅ Aplikasi terinstall di home screen

---

### 🍎 iOS (Safari)

**Catatan:** iOS hanya support PWA melalui Safari

1. Buka aplikasi di **Safari** (wajib)
2. Klik tombol **Share** (kotak dengan panah ke atas)
3. Scroll ke bawah dan klik **"Add to Home Screen"**
4. Edit nama aplikasi jika perlu
5. Klik **"Add"**
6. ✅ Aplikasi terinstall di home screen

**Tips iOS:**
- ⚠️ Harus pakai Safari, tidak bisa pakai Chrome
- ⚠️ Icon akan otomatis di-generate
- ⚠️ Splash screen akan otomatis dibuat

---

### 💻 Desktop (Chrome/Edge)

#### **Method 1: Address Bar**
1. Buka aplikasi di Chrome/Edge
2. Klik icon install di address bar (📲)
3. Klik **"Install"**
4. Konfirmasi install
5. ✅ Aplikasi terinstall di desktop

#### **Method 2: Menu**
1. Buka aplikasi di Chrome/Edge
2. Klik menu (⋮) di pojok kanan atas
3. Klik **"Install DapurKu..."** atau **"Apps" → "Install DapurKu"**
4. Konfirmasi install
5. ✅ Aplikasi terinstall di desktop

#### **Method 3: Prompt**
1. Buka aplikasi di Chrome/Edge
2. Prompt install akan muncul otomatis
3. Klik **"Install"**
4. ✅ Aplikasi terinstall di desktop

---

## 🎨 Custom Icon PWA

### Generate Icon

Icon PWA sudah di-generate otomatis oleh vite-plugin-pwa:
- ✅ `pwa-192x192.png` - Icon 192x192
- ✅ `pwa-512x512.png` - Icon 512x512
- ✅ `maskable-icon.png` - Icon untuk Android adaptive

### Custom Icon

Jika ingin custom icon:

1. Siapkan icon PNG (512x512 pixels)
2. Save di folder `public/` dengan nama:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
3. Rebuild aplikasi
4. ✅ Icon custom akan digunakan

---

## 📊 Testing PWA

### 1. Check Manifest

**Desktop:**
1. Buka DevTools (F12)
2. Pilih tab **Application**
3. Klik **Manifest**
4. ✅ Harus ada semua info:
   - Name: DapurKu
   - Short name: DapurKu
   - Theme color: #10b981
   - Icons: 192x192, 512x512

**Mobile:**
1. Buka Chrome DevTools (remote debugging)
2. Pilih tab **Application**
3. Klik **Manifest**
4. ✅ Check semua info

### 2. Check Service Worker

**Desktop:**
1. Buka DevTools (F12)
2. Pilih tab **Application**
3. Klik **Service Workers**
4. ✅ Harus ada:
   - Status: activated and running
   - Scope: /
   - Source: sw.js

**Mobile:**
1. Buka chrome://inspect/#service-workers
2. ✅ Check service worker terdaftar

### 3. Test Offline Mode

**Desktop:**
1. Buka DevTools (F12)
2. Pilih tab **Application**
3. Klik **Storage** → **Clear site data**
4. Pilih tab **Network**
5. Check **Offline**
6. Refresh halaman
7. ✅ Aplikasi harus tetap bisa dibuka

**Mobile:**
1. Matikan WiFi dan data mobile
2. Buka aplikasi
3. ✅ Aplikasi harus tetap bisa dibuka

### 4. Test Install Prompt

**Desktop:**
1. Buka aplikasi di Chrome
2. ✅ Icon install muncul di address bar
3. Klik icon install
4. ✅ Prompt install muncul

**Mobile:**
1. Buka aplikasi di Chrome
2. ✅ Banner install muncul
3. Klik **"Install"**
4. ✅ Aplikasi terinstall

---

## 🔧 Konfigurasi PWA

### Manifest File

File `manifest.webmanifest` di-generate otomatis:

```json
{
  "name": "DapurKu - Sistem Manajemen Penjualan",
  "short_name": "DapurKu",
  "description": "Aplikasi kasir modern untuk makanan rumahan",
  "theme_color": "#10b981",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

File `sw.js` di-generate otomatis oleh Workbox:

```javascript
// Precache static assets
workbox.precaching.precacheAndRoute([
  { url: 'index.html', revision: '...' },
  { url: 'assets/index-*.js', revision: '...' },
  { url: 'assets/index-*.css', revision: '...' }
]);

// Runtime caching
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new workbox.strategies.CacheFirst()
);
```

### Vite Config

Konfigurasi PWA di `vite.config.js`:

```javascript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DapurKu',
        short_name: 'DapurKu',
        theme_color: '#10b981',
        display: 'standalone',
        icons: [...]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [...]
      }
    })
  ]
});
```

---

## 🎯 Caching Strategy

### Precache (Static Assets)
- ✅ HTML files
- ✅ JavaScript bundles
- ✅ CSS files
- ✅ Images
- ✅ Fonts

**Behavior:**
- Download saat first load
- Serve dari cache saat offline
- Auto-update saat ada versi baru

### Runtime Caching (Dynamic Content)

**Cache First:**
- Google Fonts
- Static CDN assets

**Network First:**
- API calls
- Dynamic content

**Stale While Revalidate:**
- HTML pages
- Frequently updated content

---

## 🐛 Troubleshooting PWA

### PWA tidak bisa install

**Penyebab:**
- ❌ Tidak pakai HTTPS
- ❌ Manifest tidak valid
- ❌ Service worker tidak terdaftar
- ❌ Icon tidak ada

**Solusi:**
1. ✅ Pastikan deploy di HTTPS (Netlify otomatis HTTPS)
2. ✅ Check manifest di DevTools → Application → Manifest
3. ✅ Check service worker di DevTools → Application → Service Workers
4. ✅ Check icon ada di folder public/

### PWA tidak update

**Penyebab:**
- ❌ Service worker cache lama
- ❌ Browser cache

**Solusi:**
```javascript
// Di browser console
// Unregister service worker
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});

// Clear cache
caches.keys().then(function(names) {
  for (let name of names) caches.delete(name);
});

// Reload
window.location.reload();
```

### PWA tidak bisa offline

**Penyebab:**
- ❌ Service worker tidak aktif
- ❌ Assets tidak di-precache

**Solusi:**
1. Check service worker status di DevTools
2. Check precache list di DevTools → Application → Cache Storage
3. Reload halaman untuk trigger service worker

### Icon tidak muncul

**Penyebab:**
- ❌ Icon file tidak ada
- ❌ Icon size tidak sesuai
- ❌ Manifest tidak valid

**Solusi:**
1. ✅ Pastikan icon ada di folder public/
2. ✅ Icon size: 192x192 dan 512x512
3. ✅ Check manifest di DevTools
4. ✅ Clear cache dan reload

---

## 📱 Platform Support

| Platform | Browser | Install | Offline | Push |
|----------|---------|---------|---------|------|
| **Android** | Chrome | ✅ | ✅ | ✅ |
| **Android** | Firefox | ✅ | ✅ | ❌ |
| **Android** | Samsung Internet | ✅ | ✅ | ❌ |
| **iOS** | Safari | ✅ | ✅ | ❌ |
| **iOS** | Chrome | ❌ | ❌ | ❌ |
| **Desktop** | Chrome | ✅ | ✅ | ✅ |
| **Desktop** | Edge | ✅ | ✅ | ✅ |
| **Desktop** | Firefox | ❌ | ✅ | ❌ |
| **Desktop** | Safari | ❌ | ✅ | ❌ |

---

## 💡 Best Practices

### 1. Test di Semua Platform
- ✅ Test di Android Chrome
- ✅ Test di iOS Safari
- ✅ Test di Desktop Chrome
- ✅ Test di Desktop Edge

### 2. Optimize Performance
- ✅ Minimize bundle size
- ✅ Lazy load components
- ✅ Optimize images
- ✅ Use CDN for static assets

### 3. Handle Offline Gracefully
- ✅ Show offline indicator
- ✅ Cache important data
- ✅ Sync when online
- ✅ Show clear error messages

### 4. Update Strategy
- ✅ Use auto-update service worker
- ✅ Show update prompt to user
- ✅ Reload app after update
- ✅ Clear old caches

---

## 🎓 Resources

### Official Documentation
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

### Testing Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA audit
- [PWA Builder](https://www.pwabuilder.com/) - Test PWA
- [WebPageTest](https://www.webpagetest.org/) - Performance test

### Icon Generator
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)

---

## 📋 Checklist PWA

### Development
- [ ] Install vite-plugin-pwa
- [ ] Configure manifest
- [ ] Configure service worker
- [ ] Add meta tags
- [ ] Add icons
- [ ] Test in development

### Testing
- [ ] Test manifest validity
- [ ] Test service worker
- [ ] Test offline mode
- [ ] Test install prompt
- [ ] Test on Android
- [ ] Test on iOS
- [ ] Test on Desktop

### Deployment
- [ ] Deploy to HTTPS
- [ ] Check manifest accessible
- [ ] Check service worker registered
- [ ] Test install on production
- [ ] Monitor performance

### Maintenance
- [ ] Monitor service worker updates
- [ ] Clear old caches periodically
- [ ] Update icons if needed
- [ ] Update manifest if needed
- [ ] Monitor PWA metrics

---

**Status:** ✅ Production Ready  
**Version:** 1.7.0  
**PWA Plugin:** vite-plugin-pwa v1.3.0  
**Service Worker:** Workbox v7.0.0
