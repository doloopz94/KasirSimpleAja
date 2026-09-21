import React from 'react';
import { Transaction } from '../types';
import { getReceiptPreviewData } from '../utils/receiptPreview';

interface Props {
  transaction: Transaction;
  storeName: string;
  storeTagline: string;
  storeAddress: string;
  storePhone: string;
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

const ReceiptPreview: React.FC<Props> = ({
  transaction,
  storeName,
  storeTagline,
  storeAddress,
  storePhone,
  paperSize,
  showLogo = true,
  showStoreName = true,
  showAddress = true,
  showPhone = true,
  showDate = true,
  showCustomerName = true,
  showFooter = true,
  footerText = 'Terima kasih atas pesanan Anda!'
}) => {
  const previewData = getReceiptPreviewData(
    transaction,
    storeName,
    storeTagline,
    storeAddress,
    storePhone,
    {
      paperSize,
      showLogo,
      showStoreName,
      showAddress,
      showPhone,
      showDate,
      showCustomerName,
      showFooter,
      footerText
    }
  );

  // Calculate width based on paper size
  // 58mm = ~220px, 80mm = ~300px (approximate for monospace font)
  const containerWidth = paperSize === '58mm' ? '240px' : '320px';
  
  // Font size based on paper size
  const fontSize = paperSize === '58mm' ? '10px' : '11px';

  return (
    <div className="flex flex-col items-center">
      {/* Paper Size Indicator */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700">PREVIEW STRUK</span>
        <span className={`text-xs font-bold px-2 py-1 rounded ${
          paperSize === '58mm' 
            ? 'bg-orange-100 text-orange-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {paperSize}
        </span>
      </div>

      {/* Receipt Container */}
      <div 
        className="bg-white border-2 border-dashed border-gray-400 shadow-lg overflow-hidden"
        style={{
          width: containerWidth,
          maxWidth: '100%',
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: fontSize,
          lineHeight: '1.4',
          padding: '12px',
          whiteSpace: 'pre',
          overflowX: 'auto'
        }}
      >
        <pre style={{ 
          margin: 0, 
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {previewData.text}
        </pre>
      </div>

      {/* Info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-600">
          {paperSize === '58mm' 
            ? `⚠️ ${previewData.charWidth} karakter per baris - ${previewData.lineCount} baris`
            : `✅ ${previewData.charWidth} karakter per baris - ${previewData.lineCount} baris`}
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          Preview ini akurat sesuai output printer thermal
        </p>
      </div>
    </div>
  );
};

export default ReceiptPreview;
