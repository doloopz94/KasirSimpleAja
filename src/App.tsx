import React, { useState, useEffect } from 'react';
import { Page, MenuItem, Transaction } from './types';
import { getMenuItems, saveMenuItems, getTransactions, addTransaction, subscribeToMenu, subscribeToTransactions, getFirebaseStatus } from './store';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/MenuManagement';
import TransactionPage from './components/TransactionPage';
import Reports from './components/Reports';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import PromotionPage from './components/PromotionPage';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, BarChart3, ChefHat, Settings, LogOut, Megaphone, Wifi, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<{ configured: boolean; mode: string }>({ configured: false, mode: 'localStorage' });

  // Get dynamic branding
  const getStoreName = () => {
    const saved = localStorage.getItem('dapurku_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.storeName || 'DapurKu';
    }
    return 'DapurKu';
  };

  const getStoreLogo = () => {
    return localStorage.getItem('dapurku_logo') || '';
  };

  const storeName = getStoreName();
  const storeLogo = getStoreLogo();

  // Check if user is already logged in and setup Firebase
  useEffect(() => {
    const auth = localStorage.getItem('dapurku_auth');
    if (auth) {
      const userData = JSON.parse(auth);
      setIsLoggedIn(true);
      setCurrentUser(userData);
    }
    
    // Load initial data - async load from Firebase/localStorage
    const loadData = async () => {
      const menu = await getMenuItems();
      setMenuItems(menu);
      
      const trans = await getTransactions();
      setTransactions(trans);
    };
    
    loadData();
    
    // Check Firebase status
    const status = getFirebaseStatus();
    setFirebaseStatus(status);
    
    // Setup Firebase real-time subscriptions if configured
    if (status.configured) {
      const unsubscribeMenu = subscribeToMenu((items) => {
        setMenuItems(items);
      });
      
      const unsubscribeTransactions = subscribeToTransactions((transactions) => {
        setTransactions(transactions);
      });
      
      // Cleanup subscriptions on unmount
      return () => {
        unsubscribeMenu();
        unsubscribeTransactions();
      };
    }
  }, []);

  // Update document title and favicon dynamically
  useEffect(() => {
    document.title = `${storeName} - Sistem Manajemen Penjualan`;
    
    // Update favicon if logo exists
    if (storeLogo) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = storeLogo;
    }
  }, [storeName, storeLogo]);

  const handleLogin = (username: string, role: string) => {
    setIsLoggedIn(true);
    setCurrentUser({ username, role });
  };

  const handleSaveMenu = async (items: MenuItem[]) => {
    // Update UI immediately
    setMenuItems(items);
    // Save to Firebase
    await saveMenuItems(items);
  };

  const handleSaveTransaction = async (transaction: Transaction) => {
    // Save to Firebase (real-time subscription akan update UI otomatis)
    await addTransaction(transaction);
  };

  const handleLogout = () => {
    localStorage.removeItem('dapurku_auth');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const navItems = [
    { key: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'menu' as Page, label: 'Menu', icon: UtensilsCrossed },
    { key: 'transaction' as Page, label: 'Transaksi', icon: ShoppingCart },
    { key: 'promotion' as Page, label: 'Promosi', icon: Megaphone },
    { key: 'reports' as Page, label: 'Laporan', icon: BarChart3 },
    { key: 'settings' as Page, label: 'Setting', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard transactions={transactions} menuItems={menuItems} />;
      case 'menu':
        return <MenuManagement menuItems={menuItems} onSave={handleSaveMenu} />;
      case 'transaction':
        return <TransactionPage menuItems={menuItems} transactions={transactions} onSaveTransaction={handleSaveTransaction} />;
      case 'promotion':
        return <PromotionPage menuItems={menuItems} />;
      case 'reports':
        return <Reports transactions={transactions} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard transactions={transactions} menuItems={menuItems} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 shadow-sm transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {storeLogo ? (
              <img 
                src={storeLogo} 
                alt={storeName}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <ChefHat size={22} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-gray-800 text-lg">{storeName}</h1>
              <p className="text-xs text-gray-500">Makanan Rumahan</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setCurrentPage(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-green-50 text-green-700 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-green-500' : 'text-gray-400'} />
                <span className="text-sm">{item.label}</span>
                {item.key === 'transaction' && (
                  <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    Baru
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button in Sidebar */}
        <div className="absolute bottom-16 lg:bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        <div className="absolute bottom-16 lg:bottom-16 left-0 right-0 p-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
            <p className="text-xs text-green-700 font-medium">💡 Tips</p>
            <p className="text-xs text-green-600 mt-1">Gunakan QRIS untuk pembayaran lebih cepat dan aman!</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden lg:block">
              <h2 className="font-semibold text-gray-800">
                {navItems.find(n => n.key === currentPage)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Firebase Status Indicator */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100" title={`Database: ${firebaseStatus.mode}`}>
                {firebaseStatus.configured ? (
                  <>
                    <Wifi size={14} className="text-green-600" />
                    <span className="text-xs font-medium text-green-700">Firebase</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">Local</span>
                  </>
                )}
              </div>
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{currentUser?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role || 'admin'}</p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-all active:scale-95 overflow-hidden"
                title="Klik untuk logout"
              >
                {storeLogo ? (
                  <img src={storeLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  (currentUser?.username || 'A').charAt(0).toUpperCase()
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30">
        <div className="flex justify-around py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

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
                Anda akan keluar dari aplikasi. Lanjutkan?
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

export default App;
