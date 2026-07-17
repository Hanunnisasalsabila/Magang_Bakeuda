import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function Sidebar({ role, activePath, handleLogout, isOpen, onClose, isDesktopOpen = true }) {
  const isDesa = role === 'desa';
  const navigate = useNavigate();

  const menuItems = isDesa
    ? [
        { path: '/dashboard-desa', label: 'Dashboard', icon: 'dashboard' },
        { path: '/monitoring-pajak', label: 'Pemantauan PBB-P2', icon: 'analytics' },
        { path: '/formulir-spop', label: 'Pengajuan SPOP', icon: 'description' },
        { path: '/daftar-objek', label: 'Data Objek Pajak', icon: 'database' },
        { path: '/profil', label: 'Profil Akun', icon: 'person' },
      ]
    : [
        { path: '/dashboard-admin', label: 'Dashboard', icon: 'dashboard' },
        { path: '/manajemen-akun-desa', label: 'Data Pengguna', icon: 'manage_accounts' },
        { path: '/manajemen-wilayah', label: 'Data Wilayah', icon: 'map' },
        { path: '/antrean-verifikasi', label: 'Antrean Validasi', icon: 'fact_check' },
        { path: '/detail-review', label: 'Verifikasi Berkas', icon: 'rate_review' },
        { path: '/riwayat-persetujuan', label: 'Riwayat Persetujuan', icon: 'task_alt' },
        { path: '/profil', label: 'Profil Akun', icon: 'person' },
      ];

  const handleItemClick = (path) => {
    navigate(path);
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
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 py-6 flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktopOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}`}
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
              <p className="text-xl font-extrabold text-blue-900 tracking-tight leading-none">
                BAKEUDA
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-green-700">
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


        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {menuItems.map((item) => {
            const isActive = activePath && activePath.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleItemClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto px-4 pt-6 border-t border-gray-200 space-y-1 pb-4">
          <button
            onClick={() => handleItemClick('/help')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all ${
              activePath === '/help' ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-600 hover:bg-gray-50 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Bantuan</span>
          </button>
          <button
            onClick={() => {
              if(handleLogout) handleLogout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
