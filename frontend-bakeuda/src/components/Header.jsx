import React from 'react';

export default function Header({ role, onRoleChange, activePageTitle, onToggleSidebar }) {
  const isDesa = role === 'desa';

  const userProfile = isDesa
    ? {
        name: 'Pratama Yusuf',
        role: 'Perangkat Desa Kel. Onje',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjIREGqkvGX_YmE8U5mkjHFNZWnJIWQ8XGtQp9ftG3uexj_bmSAi7PPYjTEYT4bE8XH8EsDyElmXpCGB7CnKIn_finH8_MLPaA305RwKx1T_2cOIMnIF61LIcoWYtP2RzJf1wblUfHU2ArXd8ov-QUdx856Uv_kMx44VuG4QVVHp7PoWbyPd80Pi2YFSED-QvUqIBDjksd19PGxOnFHNRRBcG9DN-Q8vSr_5B8kc4ryx1SSuhAJxI73tQx97edFITVKqVZQ7NYta9g'
      }
    : {
        name: 'Drs. H. Ahmad Sudirman',
        role: 'Verifikator BKD',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC37MScHAgAXbIwZd5RRgvZW3pZH4TkRaaehdEUX8dCNB6-nJVk5jbR-lVI-Np7U_6W9AMbFtMP6JXBIXw8VbYshURdEPbZpmqMqND6-YD3R3ocj2hURRUM84LddRq8W1q9AsXvAi0NDlsyW5ghHqrLmSXq9lUrKswWjK2TDKK1nQhBG-zOAgcm1qqV52jiVuxIBrumTNfgn7nE-ApqFuakKZvtRC0opvrsCJ-J3e0GgqKzRB0aSHe9DvDckpXBLV8fwWvPf4pIHJKx'
      };

  return (
    <header className="h-16 w-full sticky top-0 z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-gutter shadow-sm transition-all duration-300">
      {/* Left items: Toggle and Title */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 hover:bg-surface-container-low rounded-full text-primary transition-colors"
          onClick={onToggleSidebar}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="font-headline-md text-headline-md font-bold text-primary hidden sm:block">
          {activePageTitle}
        </h2>
      </div>

      {/* Center items: Search & Role Switcher */}
      <div className="flex items-center gap-6">
        {/* Search Box */}
        <div className="relative hidden lg:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
          <input
            className="bg-transparent border-none p-0 text-body-md font-body-md w-60 placeholder:text-on-surface-variant focus:ring-0 focus:border-none"
            placeholder="Cari NOP atau Subjek Pajak..."
            type="text"
          />
        </div>

        {/* Dynamic Role Switcher */}
        <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/80">
          <button
            onClick={() => onRoleChange('desa')}
            className={`px-3 py-1 rounded-full font-label-sm text-[12px] transition-all duration-200 flex items-center gap-1 ${
              isDesa
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">home_work</span>
            <span className="hidden xs:inline">Desa</span>
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-1 rounded-full font-label-sm text-[12px] transition-all duration-200 flex items-center gap-1 ${
              !isDesa
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            <span className="hidden xs:inline">Admin BKD</span>
          </button>
        </div>
      </div>

      {/* Right items: Notification & User Card */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95 text-primary">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
        </button>

        {/* Settings */}
        <button className="hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95 text-primary">
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-outline-variant hidden sm:block"></div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden xl:block">
            <p className="text-label-sm font-label-sm text-on-surface leading-none">
              {userProfile.name}
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
              {userProfile.role}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant shadow-sm select-none">
            <img
              alt="Foto Profil Pengguna"
              className="w-full h-full object-cover"
              src={userProfile.avatar}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
