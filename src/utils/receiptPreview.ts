// Receipt Preview Generator - Accurate ESC/POS Style Preview
// This generates text that matches exactly what the thermal printer will output

import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../store';

export interface ReceiptPreviewOptions {
  paperSize: '58mm' | '80mm';
  showLogo?: boolean;
  showStoreName?: boolean;
  showAddress?: boolean;
  showPhone?: boolean;
  showDate?: boolean;
  showCustomerName?: boolean;
  showFooter?: boolean;
  footerText?: string;
}

export const generateReceiptPreview = (
  transaction: Transaction,
  storeName: string,
  storeTagline: string,
  storeAddress: string,
  storePhone: string,
  options: ReceiptPreviewOptions
): string => {
  const { paperSize } = options;
  
  // Character width based on paper size
  // 58mm printer = ~32 characters per line
  // 80mm printer = ~48 characters per line
  const charWidth = paperSize === '58mm' ? 32 : 48;
  
  const lines: string[] = [];
  
  // Helper functions
  const centerText = (text: string): string => {
    if (text.length >= charWidth) return text.substring(0, charWidth);
    const padding = Math.floor((charWidth - text.length) / 2);
    return ' '.repeat(padding) + text;
  };
  
  const leftRight = (left: string, right: string): string => {
    const totalLength = left.length + right.length;
    if (totalLength >= charWidth) {
      return left + ' ' + right;
    }
    const spaces = charWidth - totalLength;
    return left + ' '.repeat(spaces) + right;
  };
  
  const dashedLine = (): string => {
    return '-'.repeat(charWidth);
  };
  
  const doubleLine = (): string => {
    return '='.repeat(charWidth);
  };
  
  // Header
  if (options.showLogo !== false) {
    lines.push(centerText('[LOGO]'));
  }
  
  if (options.showStoreName !== false) {
    lines.push(centerText(storeName));
  }
  
  if (storeTagline) {
    lines.push(centerText(storeTagline));
  }
  
  if (options.showAddress !== false && storeAddress) {
    lines.push(centerText(storeAddress));
  }
  
  if (options.showPhone !== false && storePhone) {
    lines.push(centerText(`Telp: ${storePhone}`));
  }
  
  lines.push(doubleLine());
  
  // Transaction Info
  lines.push(`No: #${transaction.id.slice(-6).toUpperCase()}`);
  
  if (options.showDate !== false) {
    lines.push(`Tgl: ${formatDate(transaction.date)}`);
  }
  
  if (options.showCustomerName !== false) {
    lines.push(`Plg: ${transaction.customerName}`);
  }
  
  if (transaction.customerPhone) {
    lines.push(`HP: ${transaction.customerPhone}`);
  }
  
  lines.push(dashedLine());
  
  // Items Header
  lines.push('ITEM PESANAN:');
  
  // Items
  transaction.items.forEach((item) => {
    const price = item.customPrice || item.menuItem.price;
    const itemName = item.menuItem.name;
    
    // Wrap long item names
    if (itemName.length > charWidth - 2) {
      lines.push(itemName.substring(0, charWidth));
      lines.push('  ' + itemName.substring(charWidth));
    } else {
      lines.push(itemName);
    }
    
    // Quantity and price
    const qtyPrice = `${item.quantity} x ${formatCurrency(price)}`;
    lines.push('  ' + qtyPrice);
    
    // Subtotal for this item
    const subtotal = price * item.quantity;
    lines.push(leftRight('', `= ${formatCurrency(subtotal)}`));
    
    // Custom price note
    if (item.customPrice) {
      lines.push('  * Harga khusus');
    }
    
    // Item notes
    if ((item as any).itemNotes) {
      lines.push(`  Catatan: ${(item as any).itemNotes}`);
    }
  });
  
  lines.push(dashedLine());
  
  // Totals
  const subtotal = transaction.subtotal || (transaction.total - (transaction.deliveryFee || 0) - (transaction.discountAmount || 0));
  lines.push(leftRight('Subtotal:', formatCurrency(subtotal)));
  
  if ((transaction.discount || 0) > 0) {
    lines.push(leftRight(`Diskon (${transaction.discount}%):`, `-${formatCurrency(transaction.discountAmount || 0)}`));
  }
  
  if ((transaction.deliveryFee || 0) > 0) {
    lines.push(leftRight('Ongkir:', formatCurrency(transaction.deliveryFee || 0)));
  }
  
  lines.push(doubleLine());
  lines.push(leftRight('TOTAL:', formatCurrency(transaction.total)));
  lines.push(doubleLine());
  
  // Payment Info
  if (transaction.paymentMethod === 'cash' && transaction.paymentAmount) {
    lines.push(leftRight('Dibayar:', formatCurrency(transaction.paymentAmount)));
    
    if ((transaction.change || 0) > 0) {
      lines.push(leftRight('Kembalian:', formatCurrency(transaction.change || 0)));
    }
  }
  
  lines.push(leftRight('Bayar:', transaction.paymentMethod === 'qris' ? 'QRIS' : 'TUNAI'));
  
  // Notes
  if (transaction.notes) {
    lines.push(dashedLine());
    lines.push(`Catatan: ${transaction.notes}`);
  }
  
  lines.push(doubleLine());
  
  // Footer
  if (options.showFooter !== false) {
    const footerText = options.footerText || 'Terima kasih atas pesanan Anda!';
    lines.push(centerText(footerText));
    lines.push(centerText(`--- ${storeName} ---`));
  }
  
  // Add some blank lines at the end for paper cut
  lines.push('');
  lines.push('');
  lines.push('');
  
  return lines.join('\n');
};

// Preview component data structure
export interface ReceiptPreviewData {
  text: string;
  charWidth: number;
  paperSize: '58mm' | '80mm';
  lineCount: number;
}

export const getReceiptPreviewData = (
  transaction: Transaction,
  storeName: string,
  storeTagline: string,
  storeAddress: string,
  storePhone: string,
  options: ReceiptPreviewOptions
): ReceiptPreviewData => {
  const text = generateReceiptPreview(transaction, storeName, storeTagline, storeAddress, storePhone, options);
  const lines = text.split('\n');
  
  return {
    text,
    charWidth: options.paperSize === '58mm' ? 32 : 48,
    paperSize: options.paperSize,
    lineCount: lines.length
  };
};
