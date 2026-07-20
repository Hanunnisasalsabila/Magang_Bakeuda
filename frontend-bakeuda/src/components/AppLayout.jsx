import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ role, onRoleChange, handleLogout, activePageTitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isDesa = role === 'desa';

  // Mobile Bottom Navigation config
  const mobileNavs = isDesa
    ? [
        { path: '/dashboard-desa', label: 'Dashboard', icon: 'dashboard' },
        { path: '/monitoring-pajak', label: 'Monitoring', icon: 'analytics' },
        { path: '/formulir-spop', label: 'Formulir', icon: 'description' },
        { path: '/profil', label: 'Profil', icon: 'person' },
      ]
    : [
        { path: '/dashboard-admin', label: 'Dashboard', icon: 'dashboard' },
        { path: '/manajemen-akun-desa', label: 'Akun Desa', icon: 'manage_accounts' },
        { path: '/antrean-verifikasi', label: 'Antrean', icon: 'fact_check' },
        { path: '/detail-review', label: 'Review', icon: 'rate_review' },
        { path: '/riwayat-persetujuan', label: 'Riwayat', icon: 'task_alt' },
        { path: '/profil', label: 'Profil', icon: 'person' },
      ];

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md overflow-x-hidden flex">
      {/* Sidebar Navigation */}
      <Sidebar
        role={role}
        activePath={currentPath}
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDesktopOpen={isDesktopSidebarOpen}
      />

      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 transition-all duration-300 flex flex-col min-h-screen pb-16 md:pb-0 ${isDesktopSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        {/* Top App Bar */}
        <Header
          role={role}
          onRoleChange={onRoleChange}
          activePageTitle={activePageTitle}
          onToggleSidebar={() => {
            if (window.innerWidth >= 768) {
              setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
            } else {
              setIsSidebarOpen(true);
            }
          }}
        />

        {/* Content Wrapper */}
        <div className="flex-1 transition-all duration-300">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex justify-around py-3 px-2 z-40 shadow-lg">
        {mobileNavs.map((nav) => {
          const isActive = currentPath.startsWith(nav.path);
          return (
            <button
              key={nav.path}
              onClick={() => navigate(nav.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {nav.icon}
              </span>
              <span className="text-[10px] font-bold">{nav.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
