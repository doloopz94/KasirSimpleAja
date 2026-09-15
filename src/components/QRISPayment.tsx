import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../store';
import { X, CheckCircle, Smartphone, QrCode, Copy, AlertCircle } from 'lucide-react';

interface Props {
  amount: number;
  customerName: string;
  onComplete: () => void;
  onClose: () => void;
}

const QRISPayment: React.FC<Props> = ({ amount, customerName, onComplete, onClose }) => {
  const [status, setStatus] = useState<'waiting' | 'processing' | 'success' | 'failed'>('waiting');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulatePayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onComplete();
      }, 2500);
    }, 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <QrCode size={24} />
              </div>
              <div>
                <h2 className="font-bold text-xl">QRIS Payment</h2>
                <p className="text-purple-200 text-sm">Pembayaran Digital</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {status === 'waiting' && (
            <div className="space-y-5">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Pembayaran untuk</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Aktif</span>
                </div>
                <p className="font-semibold text-gray-800 text-lg">{customerName}</p>
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center">
                <div className="bg-white border-4 border-gray-100 rounded-2xl p-5 shadow-lg">
                  <div className="w-56 h-56 relative">
                    <svg viewBox="0 0 250 250" className="w-full h-full">
                      <rect width="250" height="250" fill="white"/>
                      
                      {/* Position Detection Patterns */}
                      <rect x="10" y="10" width="60" height="60" fill="black"/>
                      <rect x="17" y="17" width="46" height="46" fill="white"/>
                      <rect x="24" y="24" width="32" height="32" fill="black"/>
                      
                      <rect x="180" y="10" width="60" height="60" fill="black"/>
                      <rect x="187" y="17" width="46" height="46" fill="white"/>
                      <rect x="194" y="24" width="32" height="32" fill="black"/>
                      
                      <rect x="10" y="180" width="60" height="60" fill="black"/>
                      <rect x="17" y="187" width="46" height="46" fill="white"/>
                      <rect x="24" y="194" width="32" height="32" fill="black"/>
                      
                      {/* Timing Patterns */}
                      {Array.from({ length: 11 }).map((_, i) => (
                        <React.Fragment key={`timing-${i}`}>
                          {i % 2 === 0 && (
                            <>
                              <rect x={80 + i * 8} y="10" width="6" height="6" fill="black"/>
                              <rect x="10" y={80 + i * 8} width="6" height="6" fill="black"/>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                      
                      {/* Data Modules */}
                      {Array.from({ length: 20 }).map((_, row) =>
                        Array.from({ length: 20 }).map((_, col) => {
                          const x = 80 + col * 6;
                          const y = 80 + row * 6;
                          if (x > 170 || y > 170) return null;
                          
                          const show = (row + col) % 3 === 0 || 
                                      (row * col) % 4 === 0 || 
                                      (row + col) % 5 === 0;
                          return show ? (
                            <rect key={`${row}-${col}`} x={x} y={y} width="5" height="5" fill="black" />
                          ) : null;
                        })
                      )}
                      
                      {/* Alignment Pattern */}
                      <rect x="100" y="100" width="50" height="50" fill="white" stroke="black" strokeWidth="2"/>
                      <rect x="108" y="108" width="34" height="34" fill="white" stroke="black" strokeWidth="2"/>
                      <rect x="116" y="116" width="18" height="18" fill="black"/>
                      
                      {/* Additional data */}
                      {Array.from({ length: 10 }).map((_, i) => (
                        <rect key={`data-${i}`} x={80 + i * 9} y="180" width="5" height="5" fill="black" />
                      ))}
                      {Array.from({ length: 10 }).map((_, i) => (
                        <rect key={`data2-${i}`} x="180" y={80 + i * 9} width="5" height="5" fill="black" />
                      ))}
                    </svg>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Scan QR Code dengan aplikasi</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                    <Smartphone size={14} />
                    <span>BCA, Mandiri, GoPay, OVO, DANA, dll</span>
                  </div>
                </div>
              </div>

              {/* Amount Display */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                    <p className="text-3xl font-bold text-purple-700">{formatCurrency(amount)}</p>
                  </div>
                  <button
                    onClick={handleCopyAmount}
                    className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-sm transition-colors"
                    title="Copy jumlah"
                  >
                    {copied ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Copy size={20} className="text-gray-400" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-2">✓ Jumlah disalin ke clipboard</p>
                )}
              </div>

              {/* Timer */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                  <AlertCircle size={16} className="text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    QR Code berlaku dalam <span className="font-mono font-bold">{formatTime(countdown)}</span>
                  </span>
                </div>
              </div>

              {/* Simulate Button */}
              <button
                onClick={handleSimulatePayment}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Smartphone size={20} />
                Simulasi Pembayaran Berhasil
              </button>
              <p className="text-xs text-gray-400 text-center">
                * Tombol ini untuk demo. Pada aplikasi nyata, pembayaran akan terdeteksi otomatis
              </p>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center py-12 space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">Memverifikasi Pembayaran</p>
                <p className="text-sm text-gray-500 mt-2">Mohon tunggu, sedang memproses transaksi Anda...</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle size={40} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">Pembayaran Berhasil!</p>
                <p className="text-sm text-gray-500 mt-2">Transaksi telah dikonfirmasi</p>
                <div className="mt-4 bg-green-50 rounded-xl p-4 inline-block">
                  <p className="text-sm text-green-700">Total Dibayar</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(amount)}</p>
                </div>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <X size={40} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">QR Code Kadaluarsa</p>
                <p className="text-sm text-gray-500 mt-2">Silakan buat transaksi baru</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRISPayment;
