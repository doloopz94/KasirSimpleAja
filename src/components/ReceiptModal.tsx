import React, { useState, useRef } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../store';
import { X, MessageCircle, Printer, FileDown, Receipt, Copy, CheckCircle, Bluetooth } from 'lucide-react';

interface Props {
  transaction: Transaction;
  storeName: string;
  onClose: () => void;
}

const ReceiptModal: React.FC<Props> = ({ transaction, storeName, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const receiptText = generateReceiptText(transaction, storeName);

  const handleWhatsApp = () => {
    const phone = transaction.customerPhone?.replace(/\D/g, '');
    const text = encodeURIComponent(receiptText);
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
    setActiveAction('whatsapp');
    setTimeout(() => setActiveAction(null), 2000);
  };

  const handlePrintPDF = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk - ${transaction.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Courier New', monospace; 
            padding: 20px; 
            max-width: 300px; 
            margin: 0 auto;
            font-size: 12px;
          }
          .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-bottom: 10px; }
          .header h1 { font-size: 18px; margin-bottom: 4px; }
          .header p { font-size: 11px; color: #666; }
          .info { margin: 10px 0; font-size: 11px; }
          .info-row { display: flex; justify-content: space-between; margin: 3px 0; }
          .items { border-top: 1px dashed #333; border-bottom: 1px dashed #333; padding: 10px 0; margin: 10px 0; }
          .item { margin: 6px 0; }
          .item-name { font-weight: bold; }
          .item-detail { display: flex; justify-content: space-between; font-size: 11px; }
          .item-notes { font-size: 10px; color: #666; font-style: italic; }
          .total { border-top: 2px dashed #333; padding-top: 10px; margin-top: 10px; }
          .total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin: 4px 0; }
          .payment { text-align: center; margin-top: 10px; padding: 8px; background: #f0f0f0; border-radius: 4px; }
          .footer { text-align: center; margin-top: 15px; font-size: 10px; color: #666; border-top: 1px dashed #333; padding-top: 10px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setActiveAction('pdf');
    setTimeout(() => setActiveAction(null), 2000);
  };

  const handlePrintThermal = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk Thermal</title>
        <style>
          @page { 
            size: 80mm auto; 
            margin: 0; 
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Courier New', monospace; 
            width: 80mm;
            padding: 3mm;
            font-size: 10px;
            line-height: 1.3;
          }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 3mm; margin-bottom: 3mm; }
          .header h1 { font-size: 14px; margin-bottom: 1mm; }
          .header p { font-size: 9px; }
          .info { margin: 2mm 0; font-size: 9px; }
          .info-row { display: flex; justify-content: space-between; margin: 1mm 0; }
          .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 2mm 0; margin: 2mm 0; }
          .item { margin: 1.5mm 0; }
          .item-name { font-weight: bold; font-size: 10px; }
          .item-detail { display: flex; justify-content: space-between; font-size: 9px; }
          .item-notes { font-size: 8px; font-style: italic; }
          .total { border-top: 1px dashed #000; padding-top: 2mm; margin-top: 2mm; }
          .total-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; }
          .payment { text-align: center; margin-top: 2mm; padding: 2mm; border: 1px solid #000; }
          .footer { text-align: center; margin-top: 3mm; font-size: 8px; border-top: 1px dashed #000; padding-top: 2mm; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setActiveAction('thermal');
    setTimeout(() => setActiveAction(null), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Receipt size={18} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Struk Pembayaran</h3>
              <p className="text-xs text-gray-500">Pilih metode pengiriman</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div ref={receiptRef} className="font-mono text-xs">
              <div className="header text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
                <h1 className="text-lg font-bold text-gray-800">{storeName}</h1>
                <p className="text-gray-500 text-[10px]">Makanan Rumahan Online</p>
              </div>

              <div className="info space-y-1 mb-3 text-[11px]">
                <div className="info-row flex justify-between">
                  <span className="text-gray-500">No. Transaksi</span>
                  <span className="font-medium">#{transaction.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="info-row flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
                <div className="info-row flex justify-between">
                  <span className="text-gray-500">Pelanggan</span>
                  <span>{transaction.customerName}</span>
                </div>
                {transaction.customerPhone && (
                  <div className="info-row flex justify-between">
                    <span className="text-gray-500">No. HP</span>
                    <span>{transaction.customerPhone}</span>
                  </div>
                )}
              </div>

              <div className="items border-t border-dashed border-gray-400 border-b border-dashed border-gray-400 py-2 my-2 space-y-2">
                {transaction.items.map((item, idx) => {
                  const price = item.customPrice || item.menuItem.price;
                  return (
                    <div key={idx} className="item">
                      <div className="item-name font-semibold text-gray-800 text-[11px]">{item.menuItem.name}</div>
                      <div className="item-detail flex justify-between text-[10px]">
                        <span>{item.quantity} x {formatCurrency(price)}</span>
                        <span className="font-medium">{formatCurrency(price * item.quantity)}</span>
                      </div>
                      {item.customPrice && (
                        <div className="item-notes text-orange-600 text-[9px]">* Harga khusus</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="total border-t-2 border-dashed border-gray-400 pt-2 mt-2">
                <div className="total-row flex justify-between text-sm font-bold">
                  <span>TOTAL</span>
                  <span className="text-green-600">{formatCurrency(transaction.total)}</span>
                </div>
                <div className="info-row flex justify-between text-[10px] mt-1">
                  <span className="text-gray-500">Metode Bayar</span>
                  <span className="font-medium">{transaction.paymentMethod === 'qris' ? 'QRIS' : 'TUNAI'}</span>
                </div>
              </div>

              {transaction.notes && (
                <div className="mt-2 text-[10px] text-gray-600 italic">
                  Catatan: {transaction.notes}
                </div>
              )}

              <div className="footer text-center mt-3 pt-2 border-t border-dashed border-gray-400 text-[9px] text-gray-500">
                <p>Terima kasih atas pesanan Anda!</p>
                <p className="mt-0.5">--- {storeName} ---</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 space-y-2 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleWhatsApp}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                activeAction === 'whatsapp' 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700'
              }`}
            >
              {activeAction === 'whatsapp' ? (
                <CheckCircle size={20} />
              ) : (
                <MessageCircle size={20} />
              )}
              <span className="text-[10px] font-semibold">WhatsApp</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                activeAction === 'pdf' 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700'
              }`}
            >
              {activeAction === 'pdf' ? (
                <CheckCircle size={20} />
              ) : (
                <FileDown size={20} />
              )}
              <span className="text-[10px] font-semibold">Cetak PDF</span>
            </button>

            <button
              onClick={handlePrintThermal}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                activeAction === 'thermal' 
                  ? 'bg-purple-500 border-purple-500 text-white' 
                  : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700'
              }`}
            >
              {activeAction === 'thermal' ? (
                <CheckCircle size={20} />
              ) : (
                <Bluetooth size={20} />
              )}
              <span className="text-[10px] font-semibold">Thermal</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
              {copied ? 'Tersalin!' : 'Salin Teks'}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function generateReceiptText(transaction: Transaction, storeName: string): string {
  let text = `🧾 *${storeName}*\n`;
  text += `━━━━━━━━━━━━━━━\n`;
  text += `No: #${transaction.id.slice(-6).toUpperCase()}\n`;
  text += `Tanggal: ${formatDate(transaction.date)}\n`;
  text += `Pelanggan: ${transaction.customerName}\n`;
  if (transaction.customerPhone) {
    text += `No. HP: ${transaction.customerPhone}\n`;
  }
  text += `━━━━━━━━━━━━━━━\n`;
  text += `*Pesanan:*\n`;
  
  transaction.items.forEach((item) => {
    const price = item.customPrice || item.menuItem.price;
    text += `• ${item.menuItem.name}\n`;
    text += `  ${item.quantity} x ${formatCurrency(price)} = ${formatCurrency(price * item.quantity)}\n`;
    if (item.customPrice) {
      text += `  _(Harga khusus)_\n`;
    }
  });
  
  text += `━━━━━━━━━━━━━━━\n`;
  text += `*TOTAL: ${formatCurrency(transaction.total)}*\n`;
  text += `Bayar: ${transaction.paymentMethod === 'qris' ? 'QRIS' : 'TUNAI'}\n`;
  
  if (transaction.notes) {
    text += `Catatan: ${transaction.notes}\n`;
  }
  
  text += `━━━━━━━━━━━━━━━\n`;
  text += `Terima kasih! 🙏\n`;
  text += `--- ${storeName} ---`;
  
  return text;
}

export default ReceiptModal;
