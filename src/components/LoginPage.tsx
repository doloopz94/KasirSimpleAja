import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ChefHat } from 'lucide-react';
import { userService } from '../firebase/userService';
import { isFirebaseConfigured } from '../firebase/config';

interface Props {
  onLogin: (username: string, role: string) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const storeName = getStoreName();
  const storeLogo = getStoreLogo();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if Firebase is configured
      if (!isFirebaseConfigured()) {
        // Fallback to default admin account
        if (username === 'admin' && pin === '139755') {
          localStorage.setItem('dapurku_auth', JSON.stringify({
            username,
            role: 'admin',
            loginTime: new Date().toISOString(),
          }));
          onLogin(username, 'admin');
        } else {
          setError('Username atau PIN salah. Silakan coba lagi.');
          setPin('');
        }
        setIsLoading(false);
        return;
      }

      // Check user in Firebase
      const user = await userService.getUserByUsername(username);

      if (!user) {
        setError('Username tidak ditemukan');
        setPin('');
        setIsLoading(false);
        return;
      }

      if (!user.isActive) {
        setError('Akun Anda telah dinonaktifkan. Hubungi administrator.');
        setPin('');
        setIsLoading(false);
        return;
      }

      if (user.pin !== pin) {
        setError('PIN salah. Silakan coba lagi.');
        setPin('');
        setIsLoading(false);
        return;
      }

      // Update last login
      await userService.updateLastLogin(user.id);

      // Save auth info
      localStorage.setItem('dapurku_auth', JSON.stringify({
        username: user.username,
        role: user.role,
        userId: user.id,
        loginTime: new Date().toISOString(),
      }));

      onLogin(user.username, user.role);
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          {storeLogo ? (
            <img 
              src={storeLogo} 
              alt={storeName}
              className="w-20 h-20 mx-auto rounded-2xl shadow-lg object-cover mb-4"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
              <ChefHat size={40} className="text-white" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{storeName}</h1>
          <p className="text-sm text-gray-600 mt-2">Sistem Manajemen Penjualan</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PIN
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan PIN"
                  required
                  maxLength={10}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Default: username <span className="font-semibold">admin</span> | PIN <span className="font-semibold">139755</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2024 {storeName}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
