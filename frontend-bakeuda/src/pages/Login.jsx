import React, { useState } from 'react';
import api from '../utils/axios';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      
      // Mengambil token dan user dari response.data.data (sesuai format auth.service.ts)
      const { token, user } = response.data.data;
      
      // Simpan token & data user ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Beritahu App.jsx bahwa login sukses dan kirimkan role-nya
      onLoginSuccess(user.role.toLowerCase()); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d9e5f4] p-4 font-sans">
      <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#e9eff6] rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[32px] text-[#00236f]">shield_person</span>
          </div>
          <h2 className="text-[26px] font-extrabold text-[#00236f] tracking-tight">SIPD Purbalingga</h2>
          <p className="text-[#555] text-[15px] mt-1 font-medium">Sistem Pajak Bumi Bangunan</p>
        </div>

        {error && (
          <div className="bg-error-container text-error p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
             <span className="material-symbols-outlined text-lg">error</span>
             <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[14px] font-bold text-[#00236f] mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-[#dce8f7] rounded-xl border border-[#c2d3ea] focus:ring-2 focus:ring-[#00236f] outline-none transition-all text-[#333] font-medium placeholder:text-[#8b9eb5]"
              placeholder="Masukkan username Anda"
              required
            />
          </div>
          <div>
            <label className="block text-[14px] font-bold text-[#00236f] mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-14 bg-[#dce8f7] rounded-xl border border-[#c2d3ea] focus:ring-2 focus:ring-[#00236f] outline-none transition-all text-[#333] font-medium placeholder:text-[#8b9eb5]"
                placeholder="Masukkan password Anda"
                required
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5a6a7e] hover:text-[#00236f] transition-colors focus:outline-none flex items-center justify-center p-1"
                >
                  <span className="material-symbols-outlined select-none text-[22px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#00236f] text-white font-bold rounded-full hover:bg-[#001b54] shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2 text-[16px]"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
