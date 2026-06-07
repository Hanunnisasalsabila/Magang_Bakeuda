import React, { useState } from 'react';
import AppLayout from './components/AppLayout';

// Import Pages
import DashboardDesa from './pages/DashboardDesa';
import DashboardAdmin from './pages/DashboardAdmin';
import FormulirSPOP from './pages/FormulirSPOP';
import AntreanVerifikasi from './pages/AntreanVerifikasi';
import DetailReviewSPOP from './pages/DetailReviewSPOP';
import DaftarObjekPajak from './pages/DaftarObjekPajak';
import MonitoringObjekPajak from './pages/MonitoringObjekPajak';
import ProfilPengguna from './pages/ProfilPengguna';

export default function App() {
  const [role, setRole] = useState('desa'); // 'desa' or 'admin'
  const [activePage, setActivePage] = useState('dashboard_desa');

  // Page title mapping
  const pageTitles = {
    dashboard_desa: 'Dashboard Perangkat Desa',
    dashboard_admin: 'Dashboard Admin BKD',
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
        return <DashboardDesa onNavigate={setActivePage} />;
      case 'dashboard_admin':
        return <DashboardAdmin onNavigate={setActivePage} />;
      case 'formulir_spop':
        return <FormulirSPOP onNavigate={setActivePage} />;
      case 'antrean_verifikasi':
        return <AntreanVerifikasi onNavigate={setActivePage} />;
      case 'detail_review':
        return <DetailReviewSPOP onNavigate={setActivePage} />;
      case 'daftar_objek':
        return <DaftarObjekPajak />;
      case 'monitoring_pajak':
        return <MonitoringObjekPajak />;
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
        return (
          <div className="p-gutter flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-3xl">logout</span>
            </div>
            <h3 className="text-2xl font-bold text-primary">Anda Telah Keluar</h3>
            <p className="text-on-surface-variant text-sm mt-2 max-w-sm">
              Terima kasih telah menggunakan SIPD Purbalingga. Untuk masuk kembali, silakan muat ulang halaman.
            </p>
            <button
              onClick={() => {
                setRole('desa');
                setActivePage('dashboard_desa');
              }}
              className="mt-6 px-6 py-2 bg-primary text-on-primary font-bold rounded-full text-sm hover:shadow transition-all"
            >
              Masuk Kembali
            </button>
          </div>
        );
      default:
        return <DashboardDesa onNavigate={setActivePage} />;
    }
  };

  return (
    <AppLayout
      role={role}
      onRoleChange={setRole}
      activePage={activePage}
      onNavigate={setActivePage}
      activePageTitle={activePageTitle}
    >
      {renderPage()}
    </AppLayout>
  );
}
