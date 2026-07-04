import React, { useState } from 'react';
import api from '../utils/axios';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-surface-variant p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-outline-variant">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">shield_person</span>
          </div>
          <h2 className="text-2xl font-bold text-primary">SIPD Purbalingga</h2>
          <p className="text-on-surface-variant text-sm mt-1">Sistem Pajak Bumi Bangunan</p>
        </div>

        {error && (
          <div className="bg-error-container text-error p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
             <span className="material-symbols-outlined text-lg">error</span>
             <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-surface-variant rounded-xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Masukkan username Anda"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-surface-variant rounded-xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Masukkan password Anda"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-on-primary font-bold rounded-full hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
