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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('desa'); 
  const [activePage, setActivePage] = useState('dashboard_desa');
  const [selectedTransaksiId, setSelectedTransaksiId] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleNavigate = (page, params = {}) => {
    setActivePage(page);
    if (params.id) {
      setSelectedTransaksiId(params.id);
    }
    if (params.editData) {
      setEditData(params.editData);
    } else if (page === 'formulir_spop' && !params.editData) {
      setEditData(null);
    }
  };

  // Cek sesi saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setIsAuthenticated(true);
      setRole(user.role.toLowerCase());
      setActivePage(user.role === 'BAKEUDA' ? 'dashboard_admin' : 'dashboard_desa');
    }
  }, []);

  const handleLoginSuccess = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    setActivePage(userRole === 'bakeuda' ? 'dashboard_admin' : 'dashboard_desa');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setRole('desa');
  };

  // Page title mapping
  const pageTitles = {
    dashboard_desa: 'Dashboard Perangkat Desa',
    dashboard_admin: 'Dashboard Admin BKD',
    manajemen_akun_desa: 'Manajemen Akun Desa',
    formulir_spop: 'Formulir SPOP Digital',
    antrean_verifikasi: 'Antrean Verifikasi SPOP',
    detail_review: 'Review Verifikasi SPOP',
    daftar_objek: 'Daftar Objek Pajak',
    monitoring_pajak: 'Monitoring Objek Pajak',
    profil: 'Profil Pengguna',
    help: 'Pusat Bantuan',
    logout: 'Log Out'
  };

  const activePageTitle = pageTitles[activePage] || 'SIPD Purbalingga';

  // Render Page Content based on activePage
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard_desa':
        return <DashboardDesa onNavigate={handleNavigate} />;
      case 'dashboard_admin':
        return <DashboardAdmin onNavigate={handleNavigate} />;
      case 'manajemen_akun_desa':
        return <ManajemenAkunDesa />;
      case 'formulir_spop':
        return <FormulirSPOP onNavigate={handleNavigate} initialData={editData} />;
      case 'antrean_verifikasi':
        return <AntreanVerifikasi onNavigate={handleNavigate} />;
      case 'detail_review':
        return <DetailReviewSPOP onNavigate={handleNavigate} transaksiId={selectedTransaksiId} />;
      case 'daftar_objek':
        return <DaftarObjekPajak onNavigate={handleNavigate} />;
      case 'monitoring_pajak':
        return <MonitoringObjekPajak onNavigate={handleNavigate} />;
      case 'profil':
        return <ProfilPengguna role={role} />;
      case 'help':
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
      case 'logout':
        // Langsung eksekusi logout ketika page ini dirender
        handleLogout();
        return null; // Tidak perlu nampilin apa-apa, karena isAuthenticated akan jadi false dan masuk ke halaman Login

      default:
        return <DashboardDesa onNavigate={setActivePage} />;
    }
  };

  // Jika belum login, tampilkan halaman Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppLayout
      role={role}
      onRoleChange={setRole}
      activePage={activePage}
      onNavigate={handleNavigate}
      activePageTitle={activePageTitle}
    >
      {renderPage()}
    </AppLayout>
  );
}
