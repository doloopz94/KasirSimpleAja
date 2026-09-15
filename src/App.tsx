import React, { useState, useEffect } from 'react';
import { Page, MenuItem, Transaction } from './types';
import { getMenuItems, saveMenuItems, getTransactions, saveTransactions } from './store';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/MenuManagement';
import TransactionPage from './components/TransactionPage';
import Reports from './components/Reports';
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, BarChart3, ChefHat } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMenuItems(getMenuItems());
    setTransactions(getTransactions());
  }, []);

  const handleSaveMenu = (items: MenuItem[]) => {
    setMenuItems(items);
    saveMenuItems(items);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    const updated = [...transactions, transaction];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const navItems = [
    { key: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'menu' as Page, label: 'Kelola Menu', icon: UtensilsCrossed },
    { key: 'transaction' as Page, label: 'Transaksi', icon: ShoppingCart },
    { key: 'reports' as Page, label: 'Laporan', icon: BarChart3 },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard transactions={transactions} menuItems={menuItems} />;
      case 'menu':
        return <MenuManagement menuItems={menuItems} onSave={handleSaveMenu} />;
      case 'transaction':
        return <TransactionPage menuItems={menuItems} transactions={transactions} onSaveTransaction={handleSaveTransaction} />;
      case 'reports':
        return <Reports transactions={transactions} />;
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
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">DapurKu</h1>
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
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
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">Admin DapurKu</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
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
    </div>
  );
};

export default App;
