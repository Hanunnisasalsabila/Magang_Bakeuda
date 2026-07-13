import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';

// Import Pages
import DashboardDesa from './pages/DashboardDesa';
import DashboardAdmin from './pages/DashboardAdmin';
import FormulirSPOP from './pages/FormulirSPOP';
import AntreanVerifikasi from './pages/AntreanVerifikasi';
import DetailReviewSPOP from './pages/DetailReviewSPOP';
import DaftarObjekPajak from './pages/DaftarObjekPajak';
import MonitoringObjekPajak from './pages/MonitoringObjekPajak';
import ProfilPengguna from './pages/ProfilPengguna';
import ManajemenAkunDesa from './pages/ManajemenAkunDesa';
import ManajemenWilayah from './pages/ManajemenWilayah';
import PelacakanDokumen from './pages/PelacakanDokumen';
import FormulirLSPOP from './pages/FormulirLSPOP';

import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Page title mapping
const pageTitles = {
  '/dashboard-desa': 'Dashboard Perangkat Desa',
  '/dashboard-admin': 'Dashboard Admin BKD',
  '/manajemen-akun-desa': 'Manajemen Akun Desa',
  '/manajemen-wilayah': 'Manajemen Wilayah',
  '/formulir-spop': 'Formulir SPOP Digital',
  '/formulir-lspop': 'Formulir LSPOP - Data Bangunan',
  '/antrean-verifikasi': 'Antrean Verifikasi SPOP',
  '/detail-review': 'Review Verifikasi SPOP',
  '/daftar-objek': 'Daftar Objek Pajak',
  '/monitoring-pajak': 'Monitoring Objek Pajak',
  '/pelacakan-dokumen': 'Pelacakan Dokumen',
  '/profil': 'Profil Pengguna',
  '/help': 'Pusat Bantuan'
};

function HelpPage() {
  return (
    <div className="p-gutter max-w-4xl mx-auto space-y-6">
      <h3 className="text-2xl font-bold text-primary">Pusat Bantuan &amp; Panduan</h3>
      <div className="bg-white border border-outline-variant p-6 rounded-xl space-y-4 shadow-sm">
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Selamat datang di Pusat Bantuan SIPD Kabupaten Purbalingga. Gunakan panduan di bawah ini untuk memahami alur kerja aplikasi SPOP Digital.
        </p>
        <div className="border-t border-outline-variant/60 pt-4 space-y-3">
          <details className="group cursor-pointer">
            <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
              <span>Bagaimana alur pengisian SPOP oleh Perangkat Desa?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-2 border-l-2 border-primary/20 leading-relaxed">
              Perangkat Desa masuk ke menu "Formulir SPOP", memilih jenis transaksi, mengisi NOP, data subjek pajak, data objek pajak, melakukan konfirmasi, dan menekan submit. Berkas akan dikirim ke antrean verifikator BKD.
            </p>
          </details>
          <details className="group cursor-pointer">
            <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
              <span>Bagaimana verifikator menyetujui pengajuan SPOP?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-2 border-l-2 border-primary/20 leading-relaxed">
              Verifikator BKD membuka menu "Verification Queue", memilih berkas yang perlu ditinjau, memeriksa perbandingan data lama vs baru serta lampiran sertifikat, menulis catatan verifikator, lalu mengklik "Setujui Pengajuan".
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('desa'); 
  const navigate = useNavigate();
  const location = useLocation();

  // Cek sesi saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setIsAuthenticated(true);
      setRole(user.role.toLowerCase());
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    navigate(userRole === 'bakeuda' ? '/dashboard-admin' : '/dashboard-desa');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setRole('desa');
    navigate('/');
  };

  // Get active page title based on current path
  const currentPath = location.pathname;
  let activePageTitle = 'SIPD Purbalingga';
  for (const [path, title] of Object.entries(pageTitles)) {
    if (currentPath.startsWith(path)) {
      activePageTitle = title;
      break;
    }
  }

  // Jika belum login, tampilkan halaman Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppLayout
      role={role}
      onRoleChange={(newRole) => {
        setRole(newRole);
        navigate(newRole === 'bakeuda' ? '/dashboard-admin' : '/dashboard-desa');
      }}
      handleLogout={handleLogout}
      activePageTitle={activePageTitle}
    >
      <Routes>
        <Route path="/dashboard-desa" element={<DashboardDesa />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/manajemen-akun-desa" element={<ManajemenAkunDesa />} />
        <Route path="/manajemen-wilayah" element={<ManajemenWilayah />} />
        <Route path="/formulir-spop" element={<FormulirSPOP />} />
        <Route path="/formulir-lspop" element={<FormulirLSPOP />} />
        <Route path="/antrean-verifikasi" element={<AntreanVerifikasi />} />
        <Route path="/detail-review/:id?" element={<DetailReviewSPOP />} />
        <Route path="/daftar-objek" element={<DaftarObjekPajak />} />
        <Route path="/monitoring-pajak" element={<MonitoringObjekPajak />} />
        <Route path="/pelacakan-dokumen" element={<PelacakanDokumen />} />
        <Route path="/profil" element={<ProfilPengguna role={role} />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to={role === 'bakeuda' ? '/dashboard-admin' : '/dashboard-desa'} />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
