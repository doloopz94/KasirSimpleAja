import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user previously dismissed the prompt
      const dismissed = localStorage.getItem('pwa_install_dismissed');
      if (!dismissed) {
        setShowInstallPrompt(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa_install_dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-96 bg-white rounded-2xl shadow-2xl border-2 border-green-500 p-4 z-50 animate-slideUp">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Tutup"
      >
        <X size={18} className="text-gray-500" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-sm mb-1">
            Install Aplikasi
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Pasang aplikasi di device Anda untuk akses lebih cepat dan bisa digunakan offline
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Install Sekarang
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
