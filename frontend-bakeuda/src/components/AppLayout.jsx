import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ role, onRoleChange, activePage, onNavigate, activePageTitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDesa = role === 'desa';

  // Mobile Bottom Navigation config
  const mobileNavs = isDesa
    ? [
        { id: 'dashboard_desa', label: 'Dashboard', icon: 'dashboard' },
        { id: 'formulir_spop', label: 'Formulir', icon: 'description' },
        { id: 'daftar_objek', label: 'Daftar Objek', icon: 'database' },
        { id: 'profil', label: 'Profil', icon: 'person' },
      ]
    : [
        { id: 'dashboard_admin', label: 'Dashboard', icon: 'dashboard' },
        { id: 'manajemen_akun_desa', label: 'Akun Desa', icon: 'manage_accounts' },
        { id: 'antrean_verifikasi', label: 'Antrean', icon: 'fact_check' },
        { id: 'detail_review', label: 'Review', icon: 'rate_review' },
        { id: 'profil', label: 'Profil', icon: 'person' },
      ];

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md overflow-x-hidden flex">
      {/* Sidebar Navigation */}
      <Sidebar
        role={role}
        activePage={activePage}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-16 md:pb-0">
        {/* Top App Bar */}
        <Header
          role={role}
          onRoleChange={(newRole) => {
            onRoleChange(newRole);
            // Navigate to default page for that role
            if (newRole === 'desa') {
              onNavigate('dashboard_desa');
            } else {
              onNavigate('dashboard_admin');
            }
          }}
          activePageTitle={activePageTitle}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Content Wrapper */}
        <div className="flex-1 transition-all duration-300">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex justify-around py-3 px-2 z-40 shadow-lg">
        {mobileNavs.map((nav) => {
          const isActive = activePage === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => onNavigate(nav.id)}
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
