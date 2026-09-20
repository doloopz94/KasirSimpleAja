// Dynamic PWA Manifest Generator
// This script generates manifest.json based on uploaded logo

function generateManifest() {
  const settings = JSON.parse(localStorage.getItem('dapurku_settings') || '{}');
  const logo = settings.storeLogo || localStorage.getItem('dapurku_logo') || '';
  const storeName = settings.storeName || 'DapurKu';
  const storeTagline = settings.storeTagline || 'Makanan Rumahan Online';
  
  const manifest = {
    name: `${storeName} - ${storeTagline}`,
    short_name: storeName,
    description: `Aplikasi kasir ${storeName} untuk manajemen penjualan`,
    theme_color: '#10b981',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'any',
    scope: '/',
    start_url: '/',
    icons: []
  };

  // If logo exists, use it as PWA icon
  if (logo) {
    // Convert base64 to blob URL for PWA icons
    manifest.icons = [
      {
        src: logo,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: logo,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: logo,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ];
  } else {
    // Fallback to default icons
    manifest.icons = [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ];
  }

  return manifest;
}

// Export for use in main app
window.generatePWAManifest = generateManifest;

// Auto-update manifest when settings change
window.addEventListener('storage', (e) => {
  if (e.key === 'dapurku_settings' || e.key === 'dapurku_logo') {
    updatePWAManifest();
  }
});

// Update manifest link in DOM
function updatePWAManifest() {
  const manifest = generateManifest();
  const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  const manifestURL = URL.createObjectURL(manifestBlob);
  
  // Update or create manifest link
  let manifestLink = document.querySelector('link[rel="manifest"]');
  if (!manifestLink) {
    manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    document.head.appendChild(manifestLink);
  }
  manifestLink.href = manifestURL;

  // Update apple-touch-icon
  if (manifest.icons.length > 0) {
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = manifest.icons[0].src;
  }

  // Update theme color
  let themeColor = document.querySelector('meta[name="theme-color"]');
  if (!themeColor) {
    themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    document.head.appendChild(themeColor);
  }
  themeColor.content = manifest.theme_color;

  // Update title
  document.title = manifest.name;
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updatePWAManifest);
} else {
  updatePWAManifest();
}
