import React from 'react';
import { Transaction, MenuItem } from '../types';
import { formatCurrency, formatDate } from '../store';
import { TrendingUp, ShoppingCart, DollarSign, Clock, ChefHat, Package } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  menuItems: MenuItem[];
}

const Dashboard: React.FC<Props> = ({ transactions, menuItems }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const todayTransactions = transactions.filter(t => t.date.startsWith(today) && t.status === 'paid');
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.filter(t => t.status === 'paid').length;
  const totalRevenue = transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.total, 0);
  const availableMenu = menuItems.filter(m => m.available).length;

  const recentTransactions = [...transactions]
    .filter(t => t.status === 'paid')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Top selling items
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  transactions.filter(t => t.status === 'paid').forEach(t => {
    t.items.forEach(item => {
      if (!itemCounts[item.menuItem.id]) {
        itemCounts[item.menuItem.id] = { name: item.menuItem.name, count: 0, revenue: 0 };
      }
      itemCounts[item.menuItem.id].count += item.quantity;
      const price = item.customPrice || item.menuItem.price;
      itemCounts[item.menuItem.id].revenue += price * item.quantity;
    });
  });
  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Ringkasan penjualan DapurKu hari ini</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Pendapatan Hari Ini</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(todayRevenue)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Transaksi Hari Ini</p>
              <p className="text-2xl font-bold mt-1">{todayTransactions.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Menu Tersedia</p>
              <p className="text-2xl font-bold mt-1">{availableMenu}/{menuItems.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            Transaksi Terakhir
          </h3>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
              <p>Belum ada transaksi</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{t.customerName || 'Pelanggan'}</p>
                    <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(t.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.paymentMethod === 'qris' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {t.paymentMethod === 'qris' ? 'QRIS' : 'Tunai'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ChefHat size={20} className="text-orange-500" />
            Menu Terlaris
          </h3>
          {topItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ChefHat size={40} className="mx-auto mb-2 opacity-50" />
              <p>Belum ada data penjualan</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {topItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.count} porsi terjual</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">{formatCurrency(item.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
