import React, { useState } from 'react';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = username.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (username.length < 4) {
      setError('Username harus terdiri dari minimal 4 karakter.');
      return;
    }
    if (/\s/.test(username)) {
      setError('Username tidak boleh mengandung spasi.');
      return;
    }
    if (password.length < 6) {
      setError('Password harus terdiri dari minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLoginSuccess(user.role.toLowerCase()); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-600 opacity-10 blur-3xl transform -skew-y-12 -z-10"></div>
      
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <img 
            src={logoPurbalingga} 
            alt="Logo Purbalingga" 
            className="w-20 h-20 mx-auto mb-4 object-contain drop-shadow-sm"
          />
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">SIPD Purbalingga</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Sistem Pajak Bumi Bangunan</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6 text-sm flex items-start gap-2 shadow-sm">
             <span className="material-symbols-outlined text-lg">error</span>
             <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">person</span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400"
                placeholder="Masukkan password"
                required
              />
              {password.length > 0 && (
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !isFormValid}
            className={`w-full py-2.5 rounded-lg font-bold shadow-sm flex items-center justify-center gap-2 transition-all mt-6 ${
              !isFormValid 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : loading 
                  ? 'bg-blue-700 text-white cursor-not-allowed' 
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:shadow active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk ke Sistem</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} BAKEUDA Kab. Purbalingga<br/>
            Versi 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
