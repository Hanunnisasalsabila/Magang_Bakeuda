import React from 'react';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function Sidebar({ role, activePage, onNavigate, isOpen, onClose }) {
  const isDesa = role === 'desa';

  const menuItems = isDesa
    ? [
        { id: 'dashboard_desa', label: 'Dashboard', icon: 'dashboard' },
        { id: 'monitoring_pajak', label: 'Monitoring Pajak', icon: 'analytics' },
        { id: 'formulir_spop', label: 'Formulir SPOP', icon: 'description' },
        { id: 'daftar_objek', label: 'Daftar Objek Pajak', icon: 'database' },
        { id: 'profil', label: 'Profil Pengguna', icon: 'person' },
      ]
    : [
        { id: 'dashboard_admin', label: 'Dashboard Admin', icon: 'dashboard' },
        { id: 'manajemen_akun_desa', label: 'Manajemen Akun', icon: 'manage_accounts' },
        { id: 'antrean_verifikasi', label: 'Verification Queue', icon: 'fact_check' },
        { id: 'detail_review', label: 'Review SPOP', icon: 'rate_review' },
        { id: 'profil', label: 'Profil Pengguna', icon: 'person' },
      ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant py-stack-md flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="Logo Kabupaten Purbalingga"
              className="w-10 h-10 object-contain"
              src={logoPurbalingga}
            />
            <div>
              <p className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight leading-none">
                SIPD
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-secondary">
                Purbalingga
              </p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            className="md:hidden p-1 hover:bg-surface-container-low rounded-full text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* User Role Indicator */}
        <div className="px-6 mb-4">
          <div className="bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/50">
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">
              Mode Akses
            </p>
            <p className="font-label-sm text-primary flex items-center gap-2 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">
                {isDesa ? 'home_work' : 'admin_panel_settings'}
              </span>
              {isDesa ? 'Perangkat Desa' : 'Admin BKD'}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-sm text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm translate-x-1'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto px-3 pt-6 border-t border-outline-variant space-y-1">
          <button
            onClick={() => handleItemClick('help')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-on-surface-variant hover:bg-surface-container-low transition-all ${
              activePage === 'help' ? 'bg-surface-container-low font-bold text-primary' : ''
            }`}
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-sm">Bantuan</span>
          </button>
          <button
            onClick={() => handleItemClick('logout')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-error hover:bg-error-container/20 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-sm">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
