import React, { useState } from 'react';
import { User, CreditCard, Printer, FileText, Save, CheckCircle, LogOut, Store, QrCode, Printer as PrinterIcon, Receipt, Shield } from 'lucide-react';

interface SettingsData {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeLogo: string;
  qrisMerchantName: string;
  qrisMerchantId: string;
  qrisAmount: string;
  printerName: string;
  printerType: 'bluetooth' | 'usb' | 'wifi';
  printerPaperSize: '58mm' | '80mm';
  receiptShowLogo: boolean;
  receiptShowStoreName: boolean;
  receiptShowAddress: boolean;
  receiptShowPhone: boolean;
  receiptShowDate: boolean;
  receiptShowCustomerName: boolean;
  receiptShowFooter: boolean;
  receiptFooterText: string;
}

const defaultSettings: SettingsData = {
  storeName: 'DapurKu',
  storeAddress: 'Jl. Contoh No. 123, Jakarta',
  storePhone: '0812-3456-7890',
  storeLogo: '',
  qrisMerchantName: 'DAPURKU FOOD',
  qrisMerchantId: 'ID1023456789',
  qrisAmount: '',
  printerName: 'Thermal Printer',
  printerType: 'bluetooth',
  printerPaperSize: '80mm',
  receiptShowLogo: true,
  receiptShowStoreName: true,
  receiptShowAddress: true,
  receiptShowPhone: true,
  receiptShowDate: true,
  receiptShowCustomerName: true,
  receiptShowFooter: true,
  receiptFooterText: 'Terima kasih atas kunjungan Anda!',
};

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('dapurku_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  const [activeTab, setActiveTab] = useState<'account' | 'qris' | 'printer' | 'receipt'>('account');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = () => {
    localStorage.setItem('dapurku_settings', JSON.stringify(settings));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 2MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSettings({ ...settings, storeLogo: base64 });
      // Also save to separate localStorage key for easy access
      localStorage.setItem('dapurku_logo', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setSettings({ ...settings, storeLogo: '' });
    localStorage.removeItem('dapurku_logo');
  };

  const handleLogout = () => {
    // Clear all data
    localStorage.clear();
    // Redirect or reload
    window.location.reload();
  };

  const tabs = [
    { key: 'account' as const, label: 'Akun', icon: User },
    { key: 'qris' as const, label: 'QRIS', icon: CreditCard },
    { key: 'printer' as const, label: 'Printer', icon: Printer },
    { key: 'receipt' as const, label: 'Nota', icon: FileText },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola akun, QRIS, printer, dan tampilan nota</p>
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

            {/* Upload Logo Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Store size={14} className="inline mr-1.5" />
                Logo Toko
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                {settings.storeLogo ? (
                  <div className="space-y-3">
                    <img 
                      src={settings.storeLogo} 
                      alt="Logo" 
                      className="w-24 h-24 mx-auto rounded-xl object-cover shadow-md"
                    />
                    <div className="flex gap-2 justify-center">
                      <label className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
                        Ganti Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Store size={32} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Upload Logo Toko</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, atau JPEG (Max 2MB)</p>
                    </div>
                    <label className="inline-block px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
                      Pilih File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Logo akan ditampilkan di halaman login dan struk/nota
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Store size={14} className="inline mr-1.5" />
                Nama Toko
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nama toko Anda"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Store size={14} className="inline mr-1.5" />
                Alamat Toko
              </label>
              <textarea
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={2}
                placeholder="Alamat lengkap toko"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User size={14} className="inline mr-1.5" />
                Nomor Telepon Toko
              </label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0812-3456-7890"
              />
            </div>

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
                value={settings.qrisMerchantName}
                onChange={(e) => setSettings({ ...settings, qrisMerchantName: e.target.value })}
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
                value={settings.qrisMerchantId}
                onChange={(e) => setSettings({ ...settings, qrisMerchantId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                placeholder="ID1023456789"
              />
              <p className="text-xs text-gray-500 mt-1.5">ID merchant QRIS yang terdaftar di bank</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Default Amount (Opsional)
              </label>
              <input
                type="number"
                value={settings.qrisAmount}
                onChange={(e) => setSettings({ ...settings, qrisAmount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Kosongkan untuk amount dinamis"
              />
              <p className="text-xs text-gray-500 mt-1.5">Kosongkan jika nominal mengikuti total transaksi</p>
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
                <p className="text-blue-700 text-xs">Konfigurasi printer thermal Bluetooth/USB/WiFi untuk cetak struk</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Printer
              </label>
              <input
                type="text"
                value={settings.printerName}
                onChange={(e) => setSettings({ ...settings, printerName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama printer thermal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipe Koneksi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['bluetooth', 'usb', 'wifi'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setSettings({ ...settings, printerType: type })}
                    className={`py-3 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      settings.printerType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {type === 'bluetooth' ? '🔵 Bluetooth' : type === 'usb' ? '🔌 USB' : '📶 WiFi'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ukuran Kertas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['58mm', '80mm'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSettings({ ...settings, printerPaperSize: size })}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      settings.printerPaperSize === size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => alert('Fitur scan printer akan segera tersedia')}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <PrinterIcon size={18} />
                Scan & Hubungkan Printer
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">Pastikan printer dalam jangkauan dan mode pairing aktif</p>
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
                { key: 'receiptShowLogo', label: 'Logo Toko' },
                { key: 'receiptShowStoreName', label: 'Nama Toko' },
                { key: 'receiptShowAddress', label: 'Alamat Toko' },
                { key: 'receiptShowPhone', label: 'Nomor Telepon' },
                { key: 'receiptShowDate', label: 'Tanggal & Waktu' },
                { key: 'receiptShowCustomerName', label: 'Nama Pelanggan' },
                { key: 'receiptShowFooter', label: 'Footer Nota' },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof SettingsData] as boolean}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            {settings.receiptShowFooter && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teks Footer
                </label>
                <textarea
                  value={settings.receiptFooterText}
                  onChange={(e) => setSettings({ ...settings, receiptFooterText: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={2}
                  placeholder="Terima kasih atas kunjungan Anda!"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200/50 active:scale-[0.98]"
      >
        <Save size={20} />
        Simpan Pengaturan
      </button>

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
