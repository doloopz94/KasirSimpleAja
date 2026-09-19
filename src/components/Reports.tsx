import React, { useState, useMemo } from 'react';
import { Transaction, MenuItem } from '../types';
import { formatCurrency, formatDate, deleteTransaction, updateTransaction } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, DollarSign, ShoppingCart, FileText, Download, Edit2, Trash2, Printer, Eye, X, Plus, Minus } from 'lucide-react';
import ReceiptModal from './ReceiptModal';

interface Props {
  transactions: Transaction[];
  menuItems: MenuItem[];
  userRole?: string;
}

const Reports: React.FC<Props> = ({ transactions, menuItems, userRole = 'admin' }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [showHistory, setShowHistory] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState<Transaction | null>(null);

  const paidTransactions = transactions.filter(t => t.status === 'paid');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return paidTransactions.filter(t => {
      const date = new Date(t.date);
      switch (period) {
        case 'today':
          return date.toDateString() === now.toDateString();
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return date >= weekAgo;
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return date >= monthAgo;
        }
        default:
          return true;
      }
    });
  }, [paidTransactions, period]);

  // Get store info for receipt
  const getStoreInfo = () => {
    const saved = localStorage.getItem('dapurku_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      return {
        storeName: settings.storeName || 'DapurKu',
        storeAddress: settings.storeAddress || '',
        storePhone: settings.storePhone || ''
      };
    }
    return {
      storeName: 'DapurKu',
      storeAddress: '',
      storePhone: ''
    };
  };

  const handleDeleteTransaction = async (id: string) => {
    const success = await deleteTransaction(id);
    if (success) {
      setShowDeleteConfirm(null);
      window.location.reload();
    } else {
      alert('Gagal menghapus transaksi');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;
    
    // Recalculate totals
    const subtotal = editingTransaction.items.reduce((sum, item) => {
      const price = item.customPrice || item.menuItem.price;
      return sum + (price * item.quantity);
    }, 0);
    
    const discountAmount = Math.round(subtotal * ((editingTransaction.discount || 0) / 100));
    const subtotalAfterDiscount = subtotal - discountAmount;
    const total = subtotalAfterDiscount + (editingTransaction.deliveryFee || 0);
    
    const updatedTransaction = {
      ...editingTransaction,
      subtotal,
      discountAmount,
      total
    };
    
    const success = await updateTransaction(editingTransaction.id, updatedTransaction);
    if (success) {
      setEditingTransaction(null);
      window.location.reload();
    } else {
      alert('Gagal mengupdate transaksi');
    }
  };

  // Check if user can edit/delete (admin or owner only)
  const canEditDelete = userRole === 'admin' || userRole === 'owner';

  // Stats
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = filteredTransactions.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const qrisCount = filteredTransactions.filter(t => t.paymentMethod === 'qris').length;
  const cashCount = filteredTransactions.filter(t => t.paymentMethod === 'cash').length;

  // Daily revenue chart data
  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions.forEach(t => {
      const day = new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      map[day] = (map[day] || 0) + t.total;
    });
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue }));
  }, [filteredTransactions]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions.forEach(t => {
      t.items.forEach(item => {
        const cat = item.menuItem.category;
        const price = item.customPrice || item.menuItem.price;
        map[cat] = (map[cat] || 0) + (price * item.quantity);
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // Payment method data
  const paymentData = [
    { name: 'QRIS', value: qrisCount, color: '#8b5cf6' },
    { name: 'Tunai', value: cashCount, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const exportCSV = () => {
    const headers = ['Tanggal', 'Pelanggan', 'Item', 'Total', 'Metode Bayar', 'Status'];
    const rows = filteredTransactions.map(t => [
      formatDate(t.date),
      t.customerName,
      t.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(', '),
      t.total,
      t.paymentMethod === 'qris' ? 'QRIS' : 'Tunai',
      t.status,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-dapurku-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Penjualan</h1>
          <p className="text-gray-500 text-sm mt-1">Analisis dan ringkasan penjualan</p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'today', label: 'Hari Ini' },
          { key: 'week', label: '7 Hari' },
          { key: 'month', label: '30 Hari' },
          { key: 'all', label: 'Semua' },
        ].map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              period === p.key
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign size={16} />
            <span className="text-xs font-medium">Total Pendapatan</span>
          </div>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <ShoppingCart size={16} />
            <span className="text-xs font-medium">Total Transaksi</span>
          </div>
          <p className="text-xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Rata-rata/Order</span>
          </div>
          <p className="text-xl font-bold text-purple-600">{formatCurrency(avgOrder)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <FileText size={16} />
            <span className="text-xs font-medium">QRIS vs Tunai</span>
          </div>
          <p className="text-xl font-bold text-gray-700">{qrisCount} : {cashCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-green-500" />
            Pendapatan Harian
          </h3>
          {dailyData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-500" />
            Penjualan per Kategori
          </h3>
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payment Method Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-blue-500" />
            Metode Pembayaran
          </h3>
          {paymentData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data</p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Transaction Trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            Tren Transaksi
          </h3>
          {dailyData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-gray-500" />
            Riwayat Transaksi ({filteredTransactions.length})
          </h3>
          <span className="text-gray-400">{showHistory ? '▲' : '▼'}</span>
        </button>
        
        {showHistory && (
          <div className="border-t border-gray-100">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Belum ada transaksi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Metode</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[...filteredTransactions]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(t => (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{formatDate(t.date)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.customerName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {t.items.map(i => `${i.menuItem.name} x${i.quantity}${i.customPrice ? ' (harga khusus)' : ''}`).join(', ')}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-right text-green-600">{formatCurrency(t.total)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              t.paymentMethod === 'qris' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {t.paymentMethod === 'qris' ? 'QRIS' : 'Tunai'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setShowReceipt(t)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Cetak Struk"
                              >
                                <Printer size={16} />
                              </button>
                              {canEditDelete && (
                                <>
                                  <button
                                    onClick={() => handleEditTransaction(t)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(t.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setEditingTransaction(null)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-white rounded-2xl z-50 shadow-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Transaksi</h3>
              <button onClick={() => setEditingTransaction(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Edit Items Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Pesanan</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-3">
                  {editingTransaction.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.menuItem.name}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(item.customPrice || item.menuItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const newItems = [...editingTransaction.items];
                            if (newItems[idx].quantity > 1) {
                              newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity - 1 };
                              setEditingTransaction({ ...editingTransaction, items: newItems });
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const newItems = [...editingTransaction.items];
                            newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity + 1 };
                            setEditingTransaction({ ...editingTransaction, items: newItems });
                          }}
                          className="w-7 h-7 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => {
                            const newItems = editingTransaction.items.filter((_, i) => i !== idx);
                            setEditingTransaction({ ...editingTransaction, items: newItems });
                          }}
                          className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Menu Button */}
                  <div className="pt-2 border-t border-gray-200">
                    <select
                      onChange={(e) => {
                        const menuItem = menuItems.find(m => m.id === e.target.value);
                        if (menuItem) {
                          const newItem = {
                            menuItem,
                            quantity: 1,
                            subtotal: menuItem.price
                          };
                          setEditingTransaction({
                            ...editingTransaction,
                            items: [...editingTransaction.items, newItem]
                          });
                        }
                        e.target.value = '';
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      defaultValue=""
                    >
                      <option value="" disabled>+ Tambah Menu</option>
                      {menuItems.filter(m => m.available).map(m => (
                        <option key={m.id} value={m.id}>{m.name} - {formatCurrency(m.price)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pelanggan</label>
                <input
                  type="text"
                  value={editingTransaction.customerName}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">No. HP</label>
                <input
                  type="text"
                  value={editingTransaction.customerPhone}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, customerPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan</label>
                <textarea
                  value={editingTransaction.notes || ''}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setEditingTransaction(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowDeleteConfirm(null)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white rounded-2xl z-50 shadow-2xl p-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Transaksi?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Transaksi ini akan dihapus permanen dan tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteTransaction(showDeleteConfirm)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          transaction={showReceipt}
          storeName={getStoreInfo().storeName}
          onClose={() => setShowReceipt(null)}
        />
      )}
    </div>
  );
};

export default Reports;
