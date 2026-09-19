import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { formatCurrency } from '../store';
import { Megaphone, Copy, CheckCircle, MessageCircle, Facebook, Sparkles, RefreshCw, Share2, Edit3, X, Image as ImageIcon, Bot, Loader2 } from 'lucide-react';
import { openRouterService } from '../services/OpenRouterService';

interface Props {
  menuItems: MenuItem[];
}

interface PromoTemplate {
  id: string;
  name: string;
  emoji: string;
  generate: (items: MenuItem[], storeName: string) => string;
}

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

const PromotionPage: React.FC<Props> = ({ menuItems }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('casual');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const storeName = getStoreName();
  const storeLogo = getStoreLogo();

  const availableItems = useMemo(() => {
    return menuItems.filter(item => item.available);
  }, [menuItems]);

  // Select all by default
  React.useEffect(() => {
    if (selectedItems.length === 0 && availableItems.length > 0) {
      setSelectedItems(availableItems.map(item => item.id));
    }
  }, [availableItems]);

  const selectedMenuItems = useMemo(() => {
    return availableItems.filter(item => selectedItems.includes(item.id));
  }, [availableItems, selectedItems]);

  const templates: PromoTemplate[] = [
    {
      id: 'casual',
      name: 'Santai & Akrab',
      emoji: '😊',
      generate: (items, store) => {
        const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
        let msg = `🍽️ *${store}*\n`;
        msg += `📅 ${date}\n\n`;
        msg += `Halo! Hari ini kami siap melayani kamu dengan menu favorit:\n\n`;
        items.forEach((item, idx) => {
          msg += `${idx + 1}. ${item.name}\n   💰 ${formatCurrency(item.price)}\n`;
        });
        msg += `\n✨ Semua menu fresh & homemade!\n`;
        msg += `\n📲 Yuk langsung pesan sekarang!\n`;
        msg += `Terima kasih 🙏`;
        return msg;
      },
    },
    {
      id: 'promo',
      name: 'Promo Spesial',
      emoji: '🎉',
      generate: (items, store) => {
        const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
        let msg = `🔥 *PROMO SPESIAL ${store.toUpperCase()}* 🔥\n`;
        msg += `📅 ${date}\n\n`;
        msg += `🎁 *MENU HARI INI:*\n\n`;
        items.forEach((item, idx) => {
          msg += `✅ ${item.name}\n   💵 ${formatCurrency(item.price)}\n`;
        });
        if (promoDiscount) {
          msg += `\n🎊 *DISKON ${promoDiscount}%* untuk pembelian pertama!\n`;
        }
        msg += `\n⚡ Pesanan diantar cepat & hangat!\n`;
        msg += `\n👉 Order sekarang sebelum kehabisan!\n`;
        msg += `📞 Hubungi kami untuk pemesanan`;
        return msg;
      },
    },
    {
      id: 'formal',
      name: 'Formal & Profesional',
      emoji: '💼',
      generate: (items, store) => {
        const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        let msg = `*${store}*\n`;
        msg += `━━━━━━━━━━━━━━━\n`;
        msg += `📋 *Daftar Menu Tersedia*\n`;
        msg += `📅 ${date}\n\n`;
        items.forEach((item, idx) => {
          msg += `${idx + 1}. *${item.name}*\n`;
          msg += `   ${item.description}\n`;
          msg += `   Harga: ${formatCurrency(item.price)}\n\n`;
        });
        msg += `━━━━━━━━━━━━━━━\n`;
        msg += `📌 Silakan hubungi kami untuk pemesanan.\n`;
        msg += `Terima kasih atas kepercayaan Anda.`;
        return msg;
      },
    },
    {
      id: 'story',
      name: 'Story WA/IG',
      emoji: '📸',
      generate: (items, store) => {
        let msg = `✨ *${store}* ✨\n\n`;
        msg += `🍽️ *TODAY'S MENU*\n\n`;
        items.slice(0, 5).forEach((item) => {
          msg += `• ${item.name} - ${formatCurrency(item.price)}\n`;
        });
        if (items.length > 5) {
          msg += `\n+${items.length - 5} menu lainnya...\n`;
        }
        msg += `\n🔥 *READY NOW!*\n`;
        msg += `📲 *DM / WA to order*`;
        return msg;
      },
    },
    {
      id: 'fb',
      name: 'Facebook Post',
      emoji: '📘',
      generate: (items, store) => {
        const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
        let msg = `🍳 *${store.toUpperCase()} - MENU HARI INI* 🍳\n\n`;
        msg += `Halo tetangga semua! 👋\n\n`;
        msg += `Hari ini (${date}) kami menyajikan menu spesial:\n\n`;
        items.forEach((item) => {
          msg += `🔸 *${item.name}* - ${formatCurrency(item.price)}\n`;
        });
        msg += `\n✅ Homemade\n✅ Bahan segar\n✅ Rasa dijamin enak!\n\n`;
        msg += `📍 Siap antar area sekitar\n`;
        msg += `💬 Komen atau inbox untuk order ya!\n\n`;
        msg += `#MakananRumahan #JualMakanan #MasakanRumahan #${store.replace(/\s/g, '')}`;
        return msg;
      },
    },
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  const generatedMessage = useMemo(() => {
    if (isEditing) return customMessage;
    return currentTemplate.generate(selectedMenuItems, storeName);
  }, [currentTemplate, selectedMenuItems, storeName, isEditing, customMessage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generatedMessage);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const text = encodeURIComponent(generatedMessage);
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, '_blank');
  };

  const handleRegenerate = () => {
    setIsEditing(false);
    setCustomMessage('');
  };

  const handleGenerateWithAI = async () => {
    if (selectedMenuItems.length === 0) {
      setAiError('Pilih minimal 1 menu untuk generate dengan AI');
      setTimeout(() => setAiError(''), 3000);
      return;
    }

    setIsGeneratingAI(true);
    setAiError('');

    try {
      // Get saved AI model from localStorage
      const savedModel = localStorage.getItem('ai_model') || 'inclusionai/ling-3.0-flash-vl:free';
      
      const response = await openRouterService.generatePromotion({
        storeName,
        menuItems: selectedMenuItems.map(item => ({
          name: item.name,
          price: item.price,
          category: item.category
        })),
        style: selectedTemplate as any,
        discount: promoDiscount ? parseInt(promoDiscount) : undefined,
        additionalInfo: additionalInfo || undefined,
        customModel: savedModel
      });

      if (response.success && response.message) {
        setCustomMessage(response.message);
        setIsEditing(true);
      } else {
        setAiError(response.error || 'Gagal generate pesan dengan AI');
        setTimeout(() => setAiError(''), 5000);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setAiError('Terjadi kesalahan saat generate dengan AI');
      setTimeout(() => setAiError(''), 5000);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(availableItems.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const categoryEmojis: Record<string, string> = {
    'Makanan Utama': '🍚',
    'Minuman': '🥤',
    'Pelengkap': '🥗',
    'Snack': '🍟',
    'Dessert': '🍰',
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-24 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Megaphone className="text-orange-500" size={24} />
          Promosi & Broadcast
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Buat pesan promosi untuk disebar ke pelanggan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column - Menu Selection & Template */}
        <div className="lg:col-span-2 space-y-4">
          {/* Template Selector */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Sparkles size={18} className="text-orange-500" />
              Pilih Template Pesan
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${
                    selectedTemplate === template.id
                      ? 'border-orange-400 bg-orange-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{template.emoji}</div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">{template.name}</p>
                </button>
              ))}
            </div>

            {/* Discount input for promo template */}
            {selectedTemplate === 'promo' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Diskon (%) - Opsional
                </label>
                <input
                  type="number"
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(e.target.value)}
                  placeholder="Contoh: 10"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  max="100"
                />
              </div>
            )}

            {/* Additional Info Input */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Informasi Tambahan (Opsional)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Contoh: Gratis ongkir, buka sampai jam 9 malam, dll"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={2}
              />
            </div>

            {/* AI Generate Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleGenerateWithAI}
                disabled={isGeneratingAI || selectedMenuItems.length === 0}
                className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isGeneratingAI
                    ? 'bg-purple-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-200/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating dengan AI...
                  </>
                ) : (
                  <>
                    <Bot size={18} />
                    Generate dengan AI ✨
                  </>
                )}
              </button>
              {aiError && (
                <p className="text-xs text-red-600 mt-2 text-center">{aiError}</p>
              )}
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                💡 AI akan membuat pesan promosi yang lebih menarik dan kreatif
              </p>
            </div>
          </div>

          {/* Menu Selection */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                <ImageIcon size={18} className="text-green-500" />
                Menu Hari Ini ({selectedItems.length}/{availableItems.length})
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={selectAll}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                  Semua
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {availableItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Tidak ada menu tersedia</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {availableItems.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedItems.includes(item.id)
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-lg">{categoryEmojis[item.category] || '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-green-600 font-semibold">{formatCurrency(item.price)}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
            {/* Preview Header */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <Share2 size={18} />
                  Preview Pesan
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setCustomMessage(generatedMessage);
                      setIsEditing(true);
                    }}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Edit pesan"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-4">
              {isEditing ? (
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-orange-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50 font-mono"
                  rows={12}
                />
              ) : (
                <div className="bg-gray-50 rounded-xl p-3 max-h-96 overflow-y-auto">
                  <pre className="text-xs sm:text-sm whitespace-pre-wrap font-sans text-gray-800">
                    {generatedMessage}
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {isEditing && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X size={14} />
                      Batal
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={14} />
                      Regenerate
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCopy}
                  className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle size={18} />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Salin Pesan
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle size={18} />
                  Share ke WhatsApp
                </button>

                <button
                  onClick={handleShareFacebook}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Facebook size={18} />
                  Share ke Facebook
                </button>

                <div className="pt-2 text-center">
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    💡 Tip: Cocok untuk story WA, broadcast, atau post sosmed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionPage;
