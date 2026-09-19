import React, { useState, useEffect } from 'react';
import { User, CreditCard, Printer, FileText, Save, CheckCircle, LogOut, Store, QrCode, Printer as PrinterIcon, Receipt, Shield, X, Wifi, WifiOff, Cloud, Globe, Users, Bot, Upload, Image as ImageIcon } from 'lucide-react';
import UserManagement from './UserManagement';
import AIPromotionSettings from './AIPromotionSettings';

interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storeAddress: string;
  storePhone: string;
  storeLogo: string;
  printerConnection: 'bluetooth' | 'wifi' | 'cloud';
  printerPaperSize: '58mm' | '80mm';
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'users' | 'qris' | 'printer' | 'receipt' | 'ai'>('account');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Store settings state
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'DapurKu',
    storeTagline: 'Makanan Rumahan Online',
    storeAddress: 'Jl. Contoh No. 123, Jakarta',
    storePhone: '0812-3456-7890',
    storeLogo: '',
    printerConnection: 'bluetooth',
    printerPaperSize: '80mm',
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dapurku_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStoreSettings({
          storeName: parsed.storeName || 'DapurKu',
          storeTagline: parsed.storeTagline || 'Makanan Rumahan Online',
          storeAddress: parsed.storeAddress || '',
          storePhone: parsed.storePhone || '',
          storeLogo: parsed.storeLogo || '',
          printerConnection: parsed.printerConnection || 'bluetooth',
          printerPaperSize: parsed.printerPaperSize || '80mm',
        });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const tabs = [
    { key: 'account' as const, label: 'Akun Toko', icon: Store },
    { key: 'users' as const, label: 'Manajemen Akun', icon: Users },
    { key: 'qris' as const, label: 'QRIS', icon: CreditCard },
    { key: 'printer' as const, label: 'Printer', icon: Printer },
    { key: 'receipt' as const, label: 'Nota', icon: FileText },
    { key: 'ai' as const, label: 'AI Model', icon: Bot },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setStoreSettings({ ...storeSettings, storeLogo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('dapurku_settings', JSON.stringify(storeSettings));
    localStorage.setItem('dapurku_logo', storeSettings.storeLogo);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola akun, user, QRIS, printer, dan tampilan nota</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 flex gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.key
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
        
        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Admin DapurKu</h3>
                <p className="text-xs text-gray-500">admin@dapurku.com</p>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon size={14} className="inline mr-1.5" />
                Logo Toko
              </label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 border-2 border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                  {storeSettings.storeLogo ? (
                    <img src={storeSettings.storeLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
                    <Upload size={16} />
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Format: JPG, PNG, atau SVG. Maksimal 2MB.
                  </p>
                  {storeSettings.storeLogo && (
                    <button
                      onClick={() => setStoreSettings({ ...storeSettings, storeLogo: '' })}
                      className="text-xs text-red-600 hover:text-red-700 mt-2"
                    >
                      Hapus Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Store size={14} className="inline mr-1.5" />
                Nama Toko
              </label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nama toko Anda"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText size={14} className="inline mr-1.5" />
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={storeSettings.storeTagline}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeTagline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Makanan Rumahan Online"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tagline akan muncul di nota dan header aplikasi
              </p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Store size={14} className="inline mr-1.5" />
                Alamat Toko
              </label>
              <textarea
                value={storeSettings.storeAddress}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={2}
                placeholder="Alamat lengkap toko"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User size={14} className="inline mr-1.5" />
                Nomor Telepon Toko
              </label>
              <input
                type="tel"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0812-3456-7890"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveSettings}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={18} />
                Simpan Pengaturan Toko
              </button>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <UserManagement />
        )}

        {/* QRIS Settings */}
        {activeTab === 'qris' && (
          <div className="space-y-5">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <QrCode size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-purple-900 mb-1">Pengaturan QRIS</p>
                <p className="text-purple-700 text-xs">Konfigurasi informasi merchant QRIS untuk pembayaran digital</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Merchant
              </label>
              <input
                type="text"
                defaultValue="DAPURKU FOOD"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="DAPURKU FOOD"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Merchant ID (NMID)
              </label>
              <input
                type="text"
                defaultValue="ID1023456789"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                placeholder="ID1023456789"
              />
              <p className="text-xs text-gray-500 mt-1.5">ID merchant QRIS yang terdaftar di bank</p>
            </div>
          </div>
        )}

        {/* Printer Settings */}
        {activeTab === 'printer' && (
          <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <PrinterIcon size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">Pengaturan Printer Thermal</p>
                <p className="text-blue-700 text-xs">Konfigurasi printer thermal untuk cetak struk</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Metode Koneksi
              </label>
              <div className="grid grid-cols-3 gap-2">
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
                <button 
                  onClick={() => setStoreSettings({ ...storeSettings, printerConnection: 'wifi' })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    storeSettings.printerConnection === 'wifi'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Globe size={16} />
                  WiFi
                </button>
                <button 
                  onClick={() => setStoreSettings({ ...storeSettings, printerConnection: 'cloud' })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    storeSettings.printerConnection === 'cloud'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Cloud size={16} />
                  Cloud Print
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ukuran Kertas
              </label>
              <div className="grid grid-cols-2 gap-2">
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
                <button 
                  onClick={() => setStoreSettings({ ...storeSettings, printerPaperSize: '80mm' })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    storeSettings.printerPaperSize === '80mm'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  80mm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Settings */}
        {activeTab === 'receipt' && (
          <div className="space-y-5">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <Receipt size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 mb-1">Pengaturan Tampilan Nota</p>
                <p className="text-green-700 text-xs">Atur informasi apa saja yang ditampilkan pada struk/nota</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Informasi yang Ditampilkan</p>
              
              {[
                { key: 'logo', label: 'Logo Toko', checked: true },
                { key: 'storeName', label: 'Nama Toko', checked: true },
                { key: 'address', label: 'Alamat Toko', checked: true },
                { key: 'phone', label: 'Nomor Telepon', checked: true },
                { key: 'date', label: 'Tanggal & Waktu', checked: true },
                { key: 'customer', label: 'Nama Pelanggan', checked: true },
                { key: 'footer', label: 'Footer Nota', checked: true },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teks Footer
              </label>
              <textarea
                defaultValue="Terima kasih atas kunjungan Anda!"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={2}
                placeholder="Terima kasih atas kunjungan Anda!"
              />
            </div>
          </div>
        )}

        {/* AI Model Settings */}
        {activeTab === 'ai' && (
          <AIPromotionSettings />
        )}
      </div>

      {/* Save Button */}
      {activeTab !== 'users' && activeTab !== 'ai' && activeTab !== 'account' && (
        <button
          onClick={handleSaveSettings}
          className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200/50 active:scale-[0.98]"
        >
          <Save size={20} />
          Simpan Pengaturan
        </button>
      )}

      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle size={20} />
          <span className="font-medium">Pengaturan berhasil disimpan!</span>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowLogoutConfirm(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white rounded-2xl z-50 shadow-2xl p-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
              <p className="text-sm text-gray-600 mb-6">
                Anda akan keluar dari aplikasi. Semua data lokal akan dihapus. Lanjutkan?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;
