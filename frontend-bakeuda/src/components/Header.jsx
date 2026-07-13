import React from 'react';

export default function Header({ role, onRoleChange, activePageTitle, onToggleSidebar }) {
  const isDesa = role === 'desa';

  const [userProfile, setUserProfile] = React.useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.nama_lengkap || user.username || 'Admin BKD',
          role: user.role === 'BAKEUDA' ? 'Verifikator BKD' : 'Perangkat Desa',
        };
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage in Header');
    }
    
    // Fallback if not found
    return isDesa
      ? {
          name: 'Pratama Yusuf',
          role: 'Perangkat Desa Kel. Onje',
        }
      : {
          name: 'Drs. H. Ahmad Sudirman',
          role: 'Verifikator BKD',
        };
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="h-16 w-full sticky top-0 z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-gutter shadow-sm transition-all duration-300">
      {/* Left items: Toggle and Title */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-surface-container-low rounded-full text-primary transition-colors"
          onClick={onToggleSidebar}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>



      {/* Right items: User Card */}
      <div className="flex items-center justify-end w-full">

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {userProfile.name}
            </p>
            <p className="text-[11px] text-gray-500 font-medium mt-1">
              {userProfile.role}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200 shadow-sm select-none">
            {getInitials(userProfile.name)}
          </div>
        </div>
      </div>
    </header>
  );
}
