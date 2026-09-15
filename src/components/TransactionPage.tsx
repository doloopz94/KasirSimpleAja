import React, { useState } from 'react';
import { MenuItem, Transaction, TransactionItem } from '../types';
import { formatCurrency, generateId } from '../store';
import { ShoppingCart, Plus, Minus, Trash2, User, Phone, CreditCard, Banknote, CheckCircle, Search, ChevronRight, ArrowLeft, X, Package, Sparkles } from 'lucide-react';
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
  const [step, setStep] = useState<'menu' | 'cart' | 'checkout'>('menu');
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const categories = ['Semua', ...new Set(menuItems.filter(m => m.available).map(m => m.category))];
  
  const filteredMenu = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchSearch && matchCategory && item.available;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  const clearCart = () => {
    setCart([]);
  };

  const getCartQty = (menuItemId: string) => {
    return cart.find(item => item.menuItem.id === menuItemId)?.quantity || 0;
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
    setStep('menu');
    setShowCartDrawer(false);
  };

  const goToCheckout = () => {
    setShowCartDrawer(false);
    setStep('checkout');
  };

  const categoryEmojis: Record<string, string> = {
    'Makanan Utama': '🍚',
    'Minuman': '🥤',
    'Pelengkap': '🥗',
    'Snack': '🍟',
    'Dessert': '🍰',
    'Semua': '📋',
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {step !== 'menu' ? (
            <button 
              onClick={() => setStep('menu')} 
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-1"
            >
              <ArrowLeft size={16} />
              Kembali ke menu
            </button>
          ) : null}
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 'menu' ? '🍽️ Buat Pesanan Baru' : step === 'checkout' ? '💳 Checkout' : '🛒 Keranjang'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 'menu' ? 'Pilih menu untuk pelanggan' : step === 'checkout' ? 'Konfirmasi dan pilih metode pembayaran' : 'Review pesanan Anda'}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        {[
          { key: 'menu', label: 'Pilih Menu', icon: '🍽️' },
          { key: 'cart', label: 'Keranjang', icon: '🛒' },
          { key: 'checkout', label: 'Bayar', icon: '💳' },
        ].map((s, idx) => (
          <React.Fragment key={s.key}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              step === s.key 
                ? 'bg-green-100 text-green-700' 
                : idx < ['menu', 'cart', 'checkout'].indexOf(step) 
                  ? 'text-green-500'
                  : 'text-gray-400'
            }`}>
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {idx < 2 && <ChevronRight size={16} className="text-gray-300" />}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: Menu Selection */}
      {step === 'menu' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu favorit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-green-500 text-white shadow-md shadow-green-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{categoryEmojis[cat] || '📋'}</span>
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredMenu.map(item => {
              const qty = getCartQty(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg group ${
                    qty > 0 ? 'border-green-400 shadow-md shadow-green-100' : 'border-gray-100 hover:border-green-200'
                  }`}
                >
                  {/* Card Top - Emoji Background */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 text-center relative">
                    <span className="text-4xl">{categoryEmojis[item.category] || '🍽️'}</span>
                    {qty > 0 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                        {qty}
                      </div>
                    )}
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                    <p className="text-green-600 font-bold text-sm mt-2">{formatCurrency(item.price)}</p>
                    
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full mt-2 py-2 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <Plus size={14} />
                        Tambah
                      </button>
                    ) : (
                      <div className="flex items-center justify-between mt-2 bg-green-50 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-green-600 hover:text-red-500 rounded-md transition-colors shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-green-700 text-sm">{qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMenu.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Menu tidak ditemukan</p>
              <p className="text-sm mt-1">Coba kata kunci lain</p>
            </div>
          )}

          {/* Floating Cart Button */}
          {cartCount > 0 && (
            <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 z-20">
              <button
                onClick={() => setShowCartDrawer(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl p-4 shadow-xl shadow-green-200 flex items-center justify-between transition-all transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <ShoppingCart size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium opacity-90">{cartCount} item dipilih</p>
                    <p className="text-lg font-bold">{formatCurrency(cartTotal)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">Lihat</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Checkout */}
      {step === 'checkout' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Package size={18} className="text-green-500" />
                Ringkasan Pesanan
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {cart.map(item => (
                <div key={item.menuItem.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryEmojis[item.menuItem.category] || '🍽️'}</span>
                    <div>
                      <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.menuItem.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Pembayaran</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              Informasi Pelanggan
            </h3>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nama pelanggan"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="No. HP (opsional)"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <textarea
              placeholder="Catatan pesanan (opsional)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={2}
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard size={18} className="text-purple-500" />
              Pilih Metode Pembayaran
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSubmit('cash')}
                className="p-4 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-center transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                  <Banknote size={24} className="text-blue-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">Tunai</p>
                <p className="text-xs text-gray-500 mt-0.5">Bayar langsung</p>
              </button>
              <button
                onClick={() => handleSubmit('qris')}
                className="p-4 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl text-center transition-all group relative overflow-hidden"
              >
                <div className="absolute top-1 right-1">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                    <Sparkles size={8} />
                    Populer
                  </span>
                </div>
                <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                  <CreditCard size={24} className="text-purple-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">QRIS</p>
                <p className="text-xs text-gray-500 mt-0.5">Scan & bayar</p>
              </button>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setStep('menu')}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Kembali ke Menu
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCartDrawer && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCartDrawer(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] flex flex-col shadow-2xl animate-slideUp">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Keranjang</h3>
                  <p className="text-xs text-gray-500">{cartCount} item</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Kosongkan
                  </button>
                )}
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
                  <p>Keranjang masih kosong</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.menuItem.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-2xl">{categoryEmojis[item.menuItem.category] || '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{item.menuItem.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(item.menuItem.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-colors"
                      >
                        <Minus size={12} className="text-gray-600" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-semibold text-green-600 text-sm w-20 text-right">{formatCurrency(item.subtotal)}</p>
                    <button
                      onClick={() => removeFromCart(item.menuItem.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(cartTotal)}</span>
                </div>
                <button
                  onClick={goToCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
                >
                  Lanjut ke Pembayaran
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

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
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <div className="bg-white/20 p-1.5 rounded-full">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="font-bold">Transaksi Berhasil! 🎉</p>
            <p className="text-sm opacity-90">Pesanan telah dicatat</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
