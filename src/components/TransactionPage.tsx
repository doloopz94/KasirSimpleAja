import React, { useState } from 'react';
import { MenuItem, Transaction, TransactionItem } from '../types';
import { formatCurrency, generateId } from '../store';
import { ShoppingCart, Plus, Minus, Trash2, User, Phone, CreditCard, Banknote, CheckCircle, Search, ChevronRight, ArrowLeft, X, Package, Sparkles, Edit3, Tag, Receipt } from 'lucide-react';
import QRISPayment from './QRISPayment';
import ReceiptModal from './ReceiptModal';

interface Props {
  menuItems: MenuItem[];
  transactions: Transaction[];
  onSaveTransaction: (transaction: Transaction) => void;
}

interface CartItem extends TransactionItem {
  customPrice?: number;
  itemNotes?: string;
}

const STORE_NAME = 'DapurKu';

const TransactionPage: React.FC<Props> = ({ menuItems, transactions, onSaveTransaction }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [showQRIS, setShowQRIS] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [step, setStep] = useState<'menu' | 'checkout'>('menu');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  
  // Popup state
  const [showItemPopup, setShowItemPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const [popupPrice, setPopupPrice] = useState(0);
  const [popupNotes, setPopupNotes] = useState('');
  const [useCustomPrice, setUseCustomPrice] = useState(false);

  // Receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const categories = ['Semua', ...new Set(menuItems.filter(m => m.available).map(m => m.category))];
  
  const filteredMenu = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchSearch && matchCategory && item.available;
  });

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.customPrice || item.menuItem.price;
    return sum + (price * item.quantity);
  }, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openItemPopup = (item: MenuItem) => {
    setSelectedItem(item);
    setPopupQuantity(1);
    setPopupPrice(item.price);
    setPopupNotes('');
    setUseCustomPrice(false);
    setShowItemPopup(true);
  };

  const closeItemPopup = () => {
    setShowItemPopup(false);
    setSelectedItem(null);
  };

  const addToCartFromPopup = () => {
    if (!selectedItem) return;

    const finalPrice = useCustomPrice ? popupPrice : selectedItem.price;
    
    const newItem: CartItem = {
      menuItem: selectedItem,
      quantity: popupQuantity,
      subtotal: finalPrice * popupQuantity,
      customPrice: useCustomPrice ? finalPrice : undefined,
      itemNotes: popupNotes || undefined,
    };

    setCart([...cart, newItem]);
    closeItemPopup();
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(cart.map((item, idx) => {
      if (idx === index) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null as any;
        const price = item.customPrice || item.menuItem.price;
        return { ...item, quantity: newQty, subtotal: price * newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartQty = (menuItemId: string) => {
    return cart.filter(item => item.menuItem.id === menuItemId).reduce((sum, item) => sum + item.quantity, 0);
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
    setLastTransaction(transaction);
    setShowReceipt(true);
    resetForm();
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
    setLastTransaction(transaction);
    setShowReceipt(true);
    resetForm();
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

  const scrollToCart = () => {
    setShowCartDrawer(true);
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
    <div className="space-y-4 lg:space-y-6 pb-24 lg:pb-0">
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {step === 'menu' ? '🍽️ Buat Pesanan Baru' : '💳 Checkout'}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            {step === 'menu' ? 'Pilih menu untuk pelanggan' : 'Konfirmasi dan pilih metode pembayaran'}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-xl p-2 sm:p-3 shadow-sm border border-gray-100">
        {[
          { key: 'menu', label: 'Menu', icon: '🍽️' },
          { key: 'cart', label: 'Keranjang', icon: '🛒' },
          { key: 'checkout', label: 'Bayar', icon: '💳' },
        ].map((s, idx) => {
          const stepIndex = step === 'menu' ? 0 : 2;
          const isActive = (s.key === 'menu' && step === 'menu') || (s.key === 'checkout' && step === 'checkout') || (s.key === 'cart' && cartCount > 0);
          const isDone = idx < stepIndex;
          return (
            <React.Fragment key={s.key}>
              <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-100 text-green-700' 
                  : isDone 
                    ? 'text-green-500'
                    : 'text-gray-400'
              }`}>
                <span className="text-sm sm:text-base">{s.icon}</span>
                <span className="hidden xs:inline sm:inline">{s.label}</span>
              </div>
              {idx < 2 && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: Menu Selection */}
      {step === 'menu' && (
        <div className="space-y-3 sm:space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu favorit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {filteredMenu.map(item => {
              const qty = getCartQty(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border-2 overflow-hidden transition-all group cursor-pointer ${
                    qty > 0 ? 'border-green-400 shadow-md shadow-green-100' : 'border-gray-100 hover:border-green-200 hover:shadow-md'
                  }`}
                  onClick={() => openItemPopup(item)}
                >
                  {/* Card Top - Clickable Image Area */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2.5 sm:p-3 text-center relative active:scale-95 transition-transform">
                    <span className="text-2xl sm:text-3xl">{categoryEmojis[item.category] || '🍽️'}</span>
                    {qty > 0 && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-green-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-sm">
                        {qty}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-1.5 shadow-sm">
                        <Plus size={12} className="text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-2 sm:p-3">
                    <h4 className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight line-clamp-2">{item.name}</h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                    <p className="text-green-600 font-bold text-xs sm:text-sm mt-1.5">{formatCurrency(item.price)}</p>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); openItemPopup(item); }}
                      className={`w-full mt-2 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        qty > 0 
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-green-50 hover:bg-green-500 text-green-600 hover:text-white'
                      }`}
                    >
                      {qty > 0 ? (
                        <>
                          <Edit3 size={12} />
                          Edit ({qty})
                        </>
                      ) : (
                        <>
                          <Plus size={12} />
                          Tambah
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMenu.length === 0 && (
            <div className="text-center py-12 sm:py-16 text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-50" />
              <p className="text-base sm:text-lg font-medium">Menu tidak ditemukan</p>
              <p className="text-xs sm:text-sm mt-1">Coba kata kunci lain</p>
            </div>
          )}

          {/* Floating Cart Button */}
          {cartCount > 0 && (
            <div className="fixed bottom-20 lg:bottom-6 left-3 right-3 sm:left-4 sm:right-4 lg:left-auto lg:right-6 lg:w-80 z-20">
              <button
                onClick={scrollToCart}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl p-3 sm:p-4 shadow-xl shadow-green-200 flex items-center justify-between transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                    <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-medium opacity-90">{cartCount} item dipilih</p>
                    <p className="text-base sm:text-lg font-bold">{formatCurrency(cartTotal)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium">Lihat</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Checkout */}
      {step === 'checkout' && (
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                <Package size={16} className="text-green-500" />
                Ringkasan Pesanan
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {cart.map((item, idx) => {
                const price = item.customPrice || item.menuItem.price;
                return (
                  <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{categoryEmojis[item.menuItem.category] || '🍽️'}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{item.menuItem.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(price)} × {item.quantity}
                          {item.customPrice && (
                            <span className="ml-1 text-orange-600 text-[10px]">(khusus)</span>
                          )}
                        </p>
                        {item.itemNotes && (
                          <p className="text-[10px] text-gray-400 italic truncate">📝 {item.itemNotes}</p>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm flex-shrink-0">{formatCurrency(price * item.quantity)}</p>
                  </div>
                );
              })}
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Total Pembayaran</span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
              <User size={16} className="text-blue-500" />
              Informasi Pelanggan
            </h3>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nama pelanggan"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="No. HP (untuk WhatsApp struk)"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <textarea
              placeholder="Catatan pesanan (opsional)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={2}
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
              <CreditCard size={16} className="text-purple-500" />
              Pilih Metode Pembayaran
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => handleSubmit('cash')}
                className="p-3 sm:p-4 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-center transition-all group active:scale-95"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                  <Banknote size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                </div>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">Tunai</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Bayar langsung</p>
              </button>
              <button
                onClick={() => handleSubmit('qris')}
                className="p-3 sm:p-4 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl text-center transition-all group relative overflow-hidden active:scale-95"
              >
                <div className="absolute top-1 right-1">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                    <Sparkles size={8} />
                    Populer
                  </span>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                  <CreditCard size={20} className="text-purple-600 sm:w-6 sm:h-6" />
                </div>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">QRIS</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Scan & bayar</p>
              </button>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setStep('menu')}
            className="w-full py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ArrowLeft size={16} />
            Kembali ke Menu
          </button>
        </div>
      )}

      {/* Item Popup Modal - Fully Responsive */}
      {showItemPopup && selectedItem && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" 
            onClick={closeItemPopup} 
          />
          
          {/* Popup Container - Responsive Positioning */}
          <div className="fixed z-50 
            /* Mobile: Bottom Sheet */
            inset-x-0 bottom-0 
            /* Tablet & Desktop: Centered Modal */
            sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4
          ">
            <div className="popup-container bg-white w-full 
              /* Mobile: Bottom sheet with rounded top */
              rounded-t-3xl
              /* Tablet & Desktop: Fully rounded */
              sm:rounded-3xl
              /* Width constraints */
              sm:max-w-md md:max-w-lg
              /* Shadow & Animation */
              shadow-2xl animate-slideUp sm:animate-fadeIn
              /* Critical: Flex column with overflow control */
              flex flex-col overflow-hidden
            ">
              
              {/* Close Button */}
              <button
                onClick={closeItemPopup}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-gray-100 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90"
                aria-label="Tutup"
              >
                <X size={18} className="text-gray-600" />
              </button>

              {/* Header - Fixed Height, No Shrink */}
              <div className="popup-header flex-shrink-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-6 pb-4 px-5 sm:pt-8 sm:pb-6 sm:px-6">
                <div className="flex flex-col items-center text-center">
                  {/* Emoji Icon - Smaller Size */}
                  <div className="emoji-icon w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md flex items-center justify-center mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">{categoryEmojis[selectedItem.category] || '🍽️'}</span>
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 line-clamp-2">{selectedItem.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-sm line-clamp-2">{selectedItem.description}</p>
                  
                  {/* Category Badge */}
                  <div className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <span className="text-xs">{categoryEmojis[selectedItem.category]}</span>
                    <span className="text-xs font-medium text-gray-700">{selectedItem.category}</span>
                  </div>
                </div>
              </div>

              {/* Body - Scrollable with min-h-0 (CRITICAL for flex scroll) */}
              <div className="popup-body popup-scroll flex-1 min-h-0 px-5 py-4 sm:px-6 sm:py-5 space-y-4 sm:space-y-5">
                
                {/* Quantity Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                    Jumlah Pesanan
                  </label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1.5">
                    <button
                      onClick={() => setPopupQuantity(Math.max(1, popupQuantity - 1))}
                      disabled={popupQuantity <= 1}
                      className="flex-1 h-11 sm:h-12 flex items-center justify-center bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      <Minus size={18} className="text-gray-700" />
                    </button>
                    <div className="flex-1 text-center">
                      <input
                        type="number"
                        value={popupQuantity}
                        onChange={(e) => setPopupQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center text-xl sm:text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none"
                        min="1"
                      />
                      <p className="text-xs text-gray-500 -mt-1">porsi</p>
                    </div>
                    <button
                      onClick={() => setPopupQuantity(popupQuantity + 1)}
                      className="flex-1 h-11 sm:h-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Price Section */}
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <label className="text-sm font-semibold text-gray-800">
                      Harga Satuan
                    </label>
                    <button
                      onClick={() => {
                        setUseCustomPrice(!useCustomPrice);
                        if (!useCustomPrice) {
                          setPopupPrice(selectedItem.price);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        useCustomPrice 
                          ? 'bg-orange-500 text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Tag size={12} />
                      <span className="hidden xs:inline">{useCustomPrice ? 'Harga Khusus Aktif' : 'Ubah Harga'}</span>
                      <span className="xs:hidden">{useCustomPrice ? 'Aktif' : 'Ubah'}</span>
                    </button>
                  </div>

                  {useCustomPrice ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm sm:text-base">Rp</span>
                        <input
                          type="number"
                          value={popupPrice}
                          onChange={(e) => setPopupPrice(parseInt(e.target.value) || 0)}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 border-2 border-orange-300 rounded-2xl text-base sm:text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-orange-50"
                          min="0"
                        />
                      </div>
                      <p className="text-xs text-orange-600 flex items-center gap-1.5 pl-1">
                        <Tag size={12} />
                        Harga normal: <span className="font-semibold">{formatCurrency(selectedItem.price)}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-3 sm:p-4 text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">{formatCurrency(selectedItem.price)}</p>
                      <p className="text-xs text-green-700 mt-1 font-medium">Harga standar</p>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Catatan Khusus
                    <span className="text-gray-400 font-normal ml-1">(opsional)</span>
                  </label>
                  <textarea
                    value={popupNotes}
                    onChange={(e) => setPopupNotes(e.target.value)}
                    placeholder="Contoh: Pedas sedang, tanpa bawang, extra sambal..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>

                {/* Total Preview - Highlighted */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3 sm:p-4 shadow-lg">
                  <div className="flex justify-between items-center gap-3">
                    <div className="text-white/90 min-w-0">
                      <p className="text-xs font-medium mb-0.5">Total Pembayaran</p>
                      <p className="text-xs opacity-80 truncate">
                        {popupQuantity} × {formatCurrency(useCustomPrice ? popupPrice : selectedItem.price)}
                      </p>
                    </div>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex-shrink-0">
                      {formatCurrency((useCustomPrice ? popupPrice : selectedItem.price) * popupQuantity)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed Height, No Shrink */}
              <div className="flex-shrink-0 px-5 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-white pb-safe">
                <button
                  onClick={addToCartFromPopup}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-2.5 transition-all shadow-lg shadow-green-200/50 active:scale-[0.98]"
                >
                  <ShoppingCart size={18} />
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      {showCartDrawer && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCartDrawer(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl sm:rounded-t-3xl z-50 max-h-[75vh] sm:max-h-[80vh] flex flex-col shadow-2xl animate-slideUp">
            {/* Drawer Header */}
            <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={16} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">Keranjang</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">{cartCount} item</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[10px] sm:text-xs text-red-500 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Kosongkan
                  </button>
                )}
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <ShoppingCart size={36} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Keranjang masih kosong</p>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const price = item.customPrice || item.menuItem.price;
                  return (
                    <div key={idx} className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2.5 sm:p-3">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{categoryEmojis[item.menuItem.category] || '🍽️'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{item.menuItem.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {formatCurrency(price)}
                          {item.customPrice && <span className="text-orange-600 ml-1">(khusus)</span>}
                        </p>
                        {item.itemNotes && (
                          <p className="text-[9px] sm:text-[10px] text-gray-400 italic truncate">📝 {item.itemNotes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-colors active:scale-95"
                        >
                          <Minus size={10} className="text-gray-600" />
                        </button>
                        <span className="w-5 sm:w-6 text-center font-bold text-xs sm:text-sm text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(idx, 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors active:scale-95"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <p className="font-semibold text-green-600 text-[10px] sm:text-xs w-14 sm:w-20 text-right flex-shrink-0">{formatCurrency(price * item.quantity)}</p>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-3 sm:p-4 border-t border-gray-100 bg-white flex-shrink-0 pb-safe">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <span className="text-gray-600 font-medium text-sm">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-green-600">{formatCurrency(cartTotal)}</span>
                </div>
                <button
                  onClick={goToCheckout}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200 active:scale-[0.98]"
                >
                  Lanjut ke Pembayaran
                  <ChevronRight size={16} />
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

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <ReceiptModal
          transaction={lastTransaction}
          storeName={STORE_NAME}
          onClose={() => {
            setShowReceipt(false);
            setLastTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default TransactionPage;
