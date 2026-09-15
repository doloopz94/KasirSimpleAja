import React, { useState } from 'react';
import { MenuItem, Transaction, TransactionItem } from '../types';
import { formatCurrency, generateId } from '../store';
import { ShoppingCart, Plus, Minus, Trash2, User, Phone, CreditCard, Banknote, CheckCircle, X } from 'lucide-react';
import QRISPayment from './QRISPayment';

interface Props {
  menuItems: MenuItem[];
  transactions: Transaction[];
  onSaveTransaction: (transaction: Transaction) => void;
}

const TransactionPage: React.FC<Props> = ({ menuItems, transactions, onSaveTransaction }) => {
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [showQRIS, setShowQRIS] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', ...new Set(menuItems.filter(m => m.available).map(m => m.category))];
  
  const filteredMenu = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchSearch && matchCategory && item.available;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const addToCart = (menuItem: MenuItem) => {
    const existing = cart.find(item => item.menuItem.id === menuItem.id);
    if (existing) {
      setCart(cart.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.menuItem.price }
          : item
      ));
    } else {
      setCart([...cart, { menuItem, quantity: 1, subtotal: menuItem.price }]);
    }
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.menuItem.id === menuItemId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null as any;
        return { ...item, quantity: newQty, subtotal: newQty * item.menuItem.price };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter(item => item.menuItem.id !== menuItemId));
  };

  const handleSubmit = (paymentMethod: 'cash' | 'qris') => {
    if (cart.length === 0) return;

    if (paymentMethod === 'qris') {
      setShowQRIS(true);
      return;
    }

    const transaction: Transaction = {
      id: generateId(),
      items: cart,
      total: cartTotal,
      customerName: customerName || 'Pelanggan',
      customerPhone,
      paymentMethod,
      status: 'paid',
      date: new Date().toISOString(),
      notes,
    };

    onSaveTransaction(transaction);
    resetForm();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleQRISComplete = () => {
    const transaction: Transaction = {
      id: generateId(),
      items: cart,
      total: cartTotal,
      customerName: customerName || 'Pelanggan',
      customerPhone,
      paymentMethod: 'qris',
      status: 'paid',
      date: new Date().toISOString(),
      notes,
    };

    onSaveTransaction(transaction);
    setShowQRIS(false);
    resetForm();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetForm = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Transaksi Baru</h1>
        <p className="text-gray-500 text-sm mt-1">Pilih menu dan proses pesanan pelanggan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Category */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="🔍 Cari menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-green-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                    <p className="text-green-600 font-bold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="bg-green-100 group-hover:bg-green-500 p-2 rounded-lg transition-colors">
                    <Plus size={18} className="text-green-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <ShoppingCart size={20} className="text-green-500" />
              Keranjang
              {cart.length > 0 && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} item
                </span>
              )}
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Keranjang kosong</p>
                <p className="text-xs mt-1">Pilih menu untuk memulai</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.menuItem.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{item.menuItem.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(item.menuItem.price)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Customer Info */}
            {cart.length > 0 && (
              <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nama pelanggan"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="No. HP (opsional)"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <textarea
                  placeholder="Catatan pesanan..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                />

                {/* Total */}
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSubmit('cash')}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <Banknote size={16} />
                    Tunai
                  </button>
                  <button
                    onClick={() => handleSubmit('qris')}
                    className="flex items-center justify-center gap-2 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <CreditCard size={16} />
                    QRIS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QRIS Modal */}
      {showQRIS && (
        <QRISPayment
          amount={cartTotal}
          customerName={customerName || 'Pelanggan'}
          onComplete={handleQRISComplete}
          onClose={() => setShowQRIS(false)}
        />
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce z-50">
          <CheckCircle size={20} />
          <span className="font-medium">Transaksi berhasil!</span>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
