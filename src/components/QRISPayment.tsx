import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../store';
import { X, CheckCircle, Smartphone, QrCode } from 'lucide-react';

interface Props {
  amount: number;
  customerName: string;
  onComplete: () => void;
  onClose: () => void;
}

const QRISPayment: React.FC<Props> = ({ amount, customerName, onComplete, onClose }) => {
  const [status, setStatus] = useState<'waiting' | 'processing' | 'success'>('waiting');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate payment processing after a few seconds
    const processTimer = setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 2000);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(processTimer);
    };
  }, [onComplete]);

  const handleSimulatePayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode size={24} />
              <span className="font-bold text-lg">QRIS Payment</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <p className="text-purple-200 text-sm mt-1">Scan QR Code untuk pembayaran</p>
        </div>

        <div className="p-6">
          {status === 'waiting' && (
            <>
              {/* QR Code Display */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-1">Pembayaran untuk</p>
                <p className="font-semibold text-gray-800">{customerName}</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mx-auto w-fit">
                {/* Simulated QR Code using CSS */}
                <div className="w-48 h-48 relative">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* QR Code Pattern */}
                    <rect width="200" height="200" fill="white"/>
                    {/* Position markers */}
                    <rect x="10" y="10" width="50" height="50" fill="black"/>
                    <rect x="15" y="15" width="40" height="40" fill="white"/>
                    <rect x="20" y="20" width="30" height="30" fill="black"/>
                    
                    <rect x="140" y="10" width="50" height="50" fill="black"/>
                    <rect x="145" y="15" width="40" height="40" fill="white"/>
                    <rect x="150" y="20" width="30" height="30" fill="black"/>
                    
                    <rect x="10" y="140" width="50" height="50" fill="black"/>
                    <rect x="15" y="145" width="40" height="40" fill="white"/>
                    <rect x="20" y="150" width="30" height="30" fill="black"/>
                    
                    {/* Data pattern */}
                    {Array.from({ length: 15 }).map((_, row) =>
                      Array.from({ length: 15 }).map((_, col) => {
                        const x = 70 + col * 5;
                        const y = 70 + row * 5;
                        const show = (row + col) % 3 === 0 || (row * col) % 2 === 0;
                        return show ? (
                          <rect key={`${row}-${col}`} x={x} y={y} width="4" height="4" fill="black" />
                        ) : null;
                      })
                    )}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <rect key={`h-${i}`} x={70 + i * 8} y={10} width="5" height="5" fill="black" />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <rect key={`v-${i}`} x={10} y={70 + i * 8} width="5" height="5" fill="black" />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <rect key={`h2-${i}`} x={70 + i * 8} y={185} width="5" height="5" fill="black" />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <rect key={`v2-${i}`} x={185} y={70 + i * 8} width="5" height="5" fill="black" />
                    ))}
                    
                    {/* Center logo area */}
                    <rect x="80" y="80" width="40" height="40" rx="5" fill="white" stroke="black" strokeWidth="2"/>
                    <text x="100" y="105" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7c3aed">QR</text>
                  </svg>
                </div>
              </div>

              {/* Amount */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">Total Pembayaran</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(amount)}</p>
              </div>

              {/* Timer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">QR Code berlaku dalam</p>
                <p className="text-lg font-mono font-bold text-gray-700">
                  00:{countdown.toString().padStart(2, '0')}
                </p>
              </div>

              {/* Simulate Button */}
              <button
                onClick={handleSimulatePayment}
                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Smartphone size={18} />
                Simulasi Bayar Sekarang
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                * Tombol simulasi untuk demo pembayaran
              </p>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-800">Memproses Pembayaran</p>
              <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <p className="text-lg font-semibold text-gray-800">Pembayaran Berhasil!</p>
              <p className="text-sm text-gray-500 mt-1">Transaksi telah dikonfirmasi</p>
              <p className="text-xl font-bold text-green-600 mt-2">{formatCurrency(amount)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRISPayment;
