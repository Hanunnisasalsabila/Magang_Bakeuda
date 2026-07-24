import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoPurbalingga from '../assets/logo-purbalingga.png';
import { useSpop } from '../context/SpopContext';

export default function Sidebar({ role, activePath, handleLogout, isOpen, onClose, isDesktopOpen = true }) {
  const isDesa = role === 'desa';
  const navigate = useNavigate();
  const { id_transaksi } = useParams();

  // Try to use Spop context, it might be null if not provided
  let completionStatus = { 1: false, 2: false, 3: false, 4: false };
  let spopData = null;
  let formData = null;
  let idTransaksiCtx = null;
  try {
    const spop = useSpop();
    if (spop) {
      completionStatus = spop.completionStatus;
      spopData = spop.spopData;
      formData = spop.formData;
      idTransaksiCtx = spop.idTransaksi;
    }
  } catch (e) {
    // context not available
  }

  const currentId = idTransaksiCtx || id_transaksi || '';
  const basePathSpop = currentId ? `/spop` : `/spop`;

  const isHapus = formData?.transaksi === 'HAPUS' || spopData?.jenis_transaksi === 'HAPUS';
  const isMutasi = formData?.transaksi === 'MUTASI' || spopData?.jenis_transaksi === 'MUTASI';
  const isPerubahanData = formData?.transaksi === 'PERUBAHAN_DATA' || spopData?.jenis_transaksi === 'PERUBAHAN_DATA';

  const spopSubItems = [
    { path: `/spop/detail${currentId ? `/${currentId}` : ''}`, label: 'Detail Pengajuan', step: 0, icon: 'info' },
    { path: `/spop/informasi-umum${currentId ? `/${currentId}` : ''}`, label: 'Informasi Umum', step: 1 },
  ];

  if (!isHapus && !isPerubahanData) {
    spopSubItems.push({ path: `/spop/subjek-pajak${currentId ? `/${currentId}` : ''}`, label: 'Subjek Pajak', step: 2 });
  }

  if (!isHapus && !isMutasi) {
    spopSubItems.push({ path: `/spop/objek-pajak${currentId ? `/${currentId}` : ''}`, label: 'Objek Pajak', step: 3 });
  }

  const jumlahBangunan = parseInt(formData?.jumlahBangunan || spopData?.detail_tujuan?.[0]?.jumlah_bangunan_baru || 0);
  const skipDataBangunan = isHapus || isMutasi || jumlahBangunan === 0;

  if (!skipDataBangunan) {
    spopSubItems.push({ path: `/spop/data-bangunan${currentId ? `/${currentId}` : ''}`, label: 'Data Bangunan', step: 4 });
  }

  spopSubItems.push(
    { path: `/spop/konfirmasi${currentId ? `/${currentId}` : ''}`, label: 'Konfirmasi', step: 5 }
  );

  if (completionStatus[5]) {
    spopSubItems.push({ path: `/spop/status${currentId ? `/${currentId}` : ''}`, label: 'Verifikasi', step: 6 });
  }

  const isSpopComplete = completionStatus[1] && completionStatus[2] && completionStatus[3] && completionStatus[4];
  const visibleSpopSubItems = isSpopComplete ? spopSubItems : spopSubItems.slice(0, skipDataBangunan ? 4 : 5);

  const menuItems = isDesa
    ? [
      { path: '/dashboard-desa', label: 'Beranda', icon: 'dashboard' },
      { path: '/monitoring-pajak', label: 'Pemantauan PBB-P2', icon: 'analytics' },
      {
        label: 'Pengajuan SPOP',
        icon: 'description',
        basePath: '/spop',
        subItems: visibleSpopSubItems
      },
      { path: '/draft-spop', label: 'Draft SPOP', icon: 'drafts' },
      { path: '/daftar-objek', label: 'Data Objek Pajak', icon: 'database' },
      { path: '/daftar-subjek', label: 'Daftar Subjek Pajak', icon: 'recent_actors' },
      { path: '/profil', label: 'Profil Pengguna', icon: 'person' },
    ]
    : [
      { path: '/dashboard-admin', label: 'Beranda', icon: 'dashboard' },
      { path: '/manajemen-akun-desa', label: 'Manajemen Pengguna', icon: 'manage_accounts' },
      { path: '/manajemen-wilayah', label: 'Manajemen Wilayah', icon: 'map' },
      { path: '/antrean-verifikasi', label: 'Antrean Verifikasi', icon: 'fact_check' },
      { path: '/detail-review', label: 'Pemeriksaan Berkas', icon: 'rate_review' },
      { path: '/riwayat-persetujuan', label: 'Riwayat Keputusan', icon: 'task_alt' },
      { path: '/profil', label: 'Profil Pengguna', icon: 'person' },
    ];

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label, defaultOpen = false) => {
    setOpenMenus(prev => {
      const currentState = prev[label] !== undefined ? prev[label] : defaultOpen;
      return { ...prev, [label]: !currentState };
    });
  };

  const handleItemClick = (path, isSubItem = false, basePath = '') => {
    // Check if we are already on the form page to preserve it when clicking parent
    const currentPath = window.location.pathname;

    if (!isSubItem && basePath === '/spop' && currentPath.startsWith('/spop')) {
      return;
    }

    navigate(path);
    if (onClose && !isSubItem) onClose();
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
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 py-6 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
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
            const hasSubItems = item.subItems && item.subItems.length > 0;
            // Check if any subitem is active
            const isSubActive = hasSubItems && window.location.pathname.startsWith('/spop');
            const isActive = (!hasSubItems && activePath && activePath.startsWith(item.path)) || isSubActive;
            const isOpen = openMenus[item.label] !== undefined ? openMenus[item.label] : isSubActive;

            return (
              <div key={item.label || item.path} className="mb-1">
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.label, isSubActive);
                      if (!isSubActive) handleItemClick(item.basePath || item.path);
                    } else {
                      handleItemClick(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {hasSubItems && (
                    <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  )}
                </button>

                {/* Sub Items */}
                {hasSubItems && isOpen && (
                  <div className="mt-1 ml-9 space-y-1 overflow-hidden animate-fadeIn">
                    {item.subItems.map((sub) => {
                      const isSubItemActive = window.location.pathname === sub.path || window.location.pathname.startsWith(sub.path);
                      const isComplete = sub.step && completionStatus[sub.step];

                      return (
                        <button
                          key={sub.path}
                          onClick={() => handleItemClick(sub.path, true)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 ${isSubItemActive
                              ? 'text-blue-700 font-semibold bg-blue-50/50'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center">
                            <span>{sub.label}</span>
                          </div>
                          {isComplete && (
                            <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto px-4 pt-6 border-t border-gray-200 space-y-1 pb-4">
          <button
            onClick={() => handleItemClick('/help')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all ${activePath === '/help' ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Bantuan</span>
          </button>
          <button
            onClick={() => {
              if (handleLogout) handleLogout();
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
