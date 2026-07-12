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

        {/* Removed Role Switcher */}
      </div>

      {/* Right items: User Card */}
      <div className="flex items-center gap-4">
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
