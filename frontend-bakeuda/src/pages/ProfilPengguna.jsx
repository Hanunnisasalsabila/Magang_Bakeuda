import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import ToastNotification from '../components/ToastNotification';

export default function ProfilPengguna({ role }) {
  const isDesa = role === 'desa';
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activities, setActivities] = useState([]);

  // Password change states (admin only)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    username: '',
    nip: '',
    role: '',
    dept: '',
    kode_wilayah: '',
  });

  const [editForm, setEditForm] = useState({ name: '', nip: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          const data = response.data.data;
          setProfileData({
            id: data.id_user || data.id || '',
            name: data.nama_lengkap,
            username: data.username,
            nip: data.nip || '-',
            role: data.role === 'DESA' ? `Perangkat Desa ${data.wilayah?.nama_desa || ''}` : 'Verifikator BKD',
            dept: data.wilayah ? `Kecamatan ${data.wilayah.kecamatan}` : 'Badan Keuangan Daerah',
            kode_wilayah: data.kode_wilayah || '',
          });
          setEditForm({
            name: data.nama_lengkap,
            nip: data.nip || '',
          });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        // fallback: try reading from localStorage
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            setProfileData({
              id: user.id_user || user.id || '',
              name: user.nama_lengkap || user.username || 'Admin BKD',
              username: user.username || '',
              nip: user.nip || '-',
              role: user.role === 'BAKEUDA' ? 'Verifikator BKD' : `Perangkat Desa`,
              dept: 'Badan Keuangan Daerah',
              kode_wilayah: user.kode_wilayah || '',
            });
            setEditForm({
              name: user.nama_lengkap || '',
              nip: user.nip || '',
            });
          } else {
            setError('Gagal memuat profil');
          }
        } catch {
          setError('Gagal memuat profil');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await api.get('/activities');
        setActivities(response.data);
      } catch (err) {
        console.error('Activities fetch error:', err);
      }
    };

    fetchProfile();
    fetchActivities();
    
  }, []);

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      setToast({ show: true, message: 'Nama lengkap tidak boleh kosong', type: 'error' });
      return;
    }
    
    if (!profileData.id) {
      setToast({ show: true, message: 'ID pengguna tidak ditemukan. Coba muat ulang halaman.', type: 'error' });
      return;
    }
    
    setIsSaving(true);
    try {
      await api.put('/auth/me', {
        nama_lengkap: editForm.name,
        nip: editForm.nip || '',
      });
      setProfileData(prev => ({
        ...prev,
        name: editForm.name,
        nip: editForm.nip || '-'
      }));
      setIsEditing(false);
      setToast({ show: true, message: 'Profil berhasil diperbarui', type: 'success' });
      
      // Update localStorage and notify Header
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userObj.nama_lengkap = editForm.name;
          userObj.nip = editForm.nip || '';
          localStorage.setItem('user', JSON.stringify(userObj));
          window.dispatchEvent(new Event('profileUpdated'));
        }
      } catch (e) {
        console.error('Failed to update localStorage', e);
      }

      api.post('/activities', { type: 'edit', title: 'Memperbarui informasi profil akun' }).catch(() => {});
      // Refresh activities
      const res = await api.get('/activities').catch(() => null);
      if (res) setActivities(res.data);
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Gagal memperbarui profil', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setToast({ show: true, message: 'Konfirmasi kata sandi tidak cocok', type: 'error' });
      return;
    }
    if (passwordForm.new.length < 8) {
      setToast({ show: true, message: 'Kata sandi baru minimal 8 karakter', type: 'error' });
      return;
    }
    setIsChangingPwd(true);
    try {
      await api.patch('/auth/change-password', {
        old_password: passwordForm.old,
        new_password: passwordForm.new,
      });
      setShowPasswordModal(false);
      setPasswordForm({ old: '', new: '', confirm: '' });
      setToast({ show: true, message: 'Kata sandi berhasil diubah. Mengeluarkan sesi Anda demi keamanan...', type: 'success' });
      api.post('/activities', { type: 'edit', title: 'Berhasil mengubah kata sandi akun' }).catch(() => {});
      
      // Force logout for security
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }, 2500);
      // Refresh activities
      const res = await api.get('/activities').catch(() => null);
      if (res) setActivities(res.data);
    } catch (err) {
      const msg = err.response?.data?.message;
      let errorMsg = 'Gagal mengubah kata sandi';
      if (typeof msg === 'string') {
        errorMsg = msg;
      } else if (Array.isArray(msg) && msg.length > 0) {
        if (typeof msg[0] === 'string') errorMsg = msg.join(', ');
        else if (msg[0].constraints) errorMsg = Object.values(msg[0].constraints)[0];
      }
      setToast({ show: true, message: errorMsg, type: 'error' });
    } finally {
      setIsChangingPwd(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 mt-10">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-primary/15"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="text-on-surface-variant text-sm tracking-wide">Memuat profil…</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 mt-10 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl text-error">error</span>
      </div>
      <p className="text-error font-medium">{error}</p>
      <p className="text-on-surface-variant text-sm">Coba muat ulang halaman ini.</p>
    </div>
  );

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    if (isToday) return `Hari ini, ${timeString}`;
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
    if (isYesterday) return `Kemarin, ${timeString}`;

    return `${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${timeString}`;
  };

  const formatNIPInput = (value) => {
    const clean = value.replace(/\D/g, '');
    let formatted = '';
    if (clean.length > 0) {
      formatted = clean.substring(0, 8);
    }
    if (clean.length > 8) {
      formatted += ' ' + clean.substring(8, 14);
    }
    if (clean.length > 14) {
      formatted += ' ' + clean.substring(14, 15);
    }
    if (clean.length > 15) {
      formatted += ' ' + clean.substring(15, 18);
    }
    return formatted;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return { icon: 'login', color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'view': return { icon: 'visibility', color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'submit': return { icon: 'description', color: 'text-green-600', bg: 'bg-green-100' };
      case 'verify': return { icon: 'fact_check', color: 'text-green-600', bg: 'bg-green-100' };
      case 'edit': 
      case 'update': return { icon: 'edit', color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'create': return { icon: 'add_circle', color: 'text-emerald-600', bg: 'bg-emerald-100' };
      case 'delete': return { icon: 'delete', color: 'text-red-600', bg: 'bg-red-100' };
      default: return { icon: 'info', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto w-full pb-16 animate-fadeIn">

      {/* Hero header banner */}
      <section className="relative overflow-hidden rounded-b-[28px] md:rounded-3xl bg-primary px-6 pt-10 pb-16 md:pb-20 md:mt-6">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
        />
      </section>

      <div className="px-4 md:px-0 -mt-12 md:-mt-14 space-y-5 relative">

        {/* Profile Header - identity card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 text-on-primary flex items-center justify-center text-3xl font-bold shadow-md ring-4 ring-surface-container-lowest">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-surface-container-lowest" title="Aktif" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-on-surface truncate">
                  {profileData.name || 'Pengguna SIPD'}
                </h1>
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[11px] font-semibold rounded-full uppercase tracking-wider border border-primary/20 shrink-0">
                  {isDesa ? 'Perangkat Desa' : 'Admin BKD'}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">work</span>
                {profileData.dept}
              </p>
              {profileData.username && (
                <p className="text-on-surface-variant/70 text-xs mt-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px]">alternate_email</span>
                  {profileData.username}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main grid: Informasi Pribadi (wide) + Keamanan Akun (narrow) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">

          {/* Informasi Pribadi */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 shadow-sm lg:col-span-2 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                </div>
                <h3 className="text-base font-semibold text-on-surface">Informasi Pribadi</h3>
              </div>
              {!isDesa && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-primary text-sm font-medium hover:bg-primary/5 active:scale-95 rounded-lg transition-all border border-primary/20"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant ml-0.5 block tracking-wide uppercase font-medium">Nama Lengkap</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                ) : (
                  <div className="w-full bg-surface-container/50 border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm text-on-surface">
                    {profileData.name || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant ml-0.5 block tracking-wide uppercase font-medium">NIP</label>
                {isEditing ? (
                  <input
                    type="text"
                    maxLength={21}
                    value={editForm.nip}
                    onChange={(e) => setEditForm({ ...editForm, nip: formatNIPInput(e.target.value) })}
                    placeholder="Contoh: 19850315 201012 1 002"
                    className="w-full bg-white border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                ) : (
                  <div className="w-full bg-surface-container/50 border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm font-mono text-on-surface tracking-wide">
                    {profileData.nip && profileData.nip !== '-' ? formatNIPInput(profileData.nip) : '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant ml-0.5 block tracking-wide uppercase font-medium">Username</label>
                <div className="w-full bg-surface-container/50 border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] opacity-60">lock</span>
                  {profileData.username || '-'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-on-surface-variant ml-0.5 block tracking-wide uppercase font-medium">Jabatan / Role</label>
                <div className="w-full bg-surface-container/50 border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] opacity-60">lock</span>
                  {profileData.role || '-'}
                </div>
              </div>
              <div className={`${isDesa ? 'sm:col-span-1' : 'sm:col-span-2'} space-y-1`}>
                <label className="text-[11px] text-on-surface-variant ml-0.5 block tracking-wide uppercase font-medium">Unit Kerja / Departemen</label>
                <div className="w-full bg-surface-container/50 border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] opacity-60">work</span>
                  {profileData.dept || '-'}
                </div>
              </div>
              {isDesa && (
                <div className="space-y-1">
                  <label className="text-[11px] text-on-surface-variant ml-0.5 block tracking-wide uppercase font-medium">Kode Wilayah</label>
                  <div className="w-full bg-surface-container/50 border border-outline-variant/40 rounded-lg px-3.5 py-2.5 text-sm text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] opacity-60">tag</span>
                    {profileData.kode_wilayah || '-'}
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-outline-variant/40">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: profileData.name, nip: profileData.nip === '-' ? '' : profileData.nip });
                  }}
                  className="px-4 py-2 text-on-surface-variant text-sm font-medium rounded-lg hover:bg-surface-container transition-colors border border-outline-variant"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || !editForm.name || (editForm.name === profileData.name && editForm.nip === (!profileData.nip || profileData.nip === '-' ? '' : profileData.nip))}
                  className="px-5 py-2 font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSaving && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                  Simpan
                </button>
              </div>
            )}
          </section>

          {/* Right Column: Keamanan Akun */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Keamanan Akun - Available for both roles */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 shadow-sm flex flex-col h-full flex-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                </div>
                <h3 className="text-base font-semibold text-on-surface">Keamanan Akun</h3>
              </div>
              <button
                onClick={() => {
                  setPasswordForm({ old: '', new: '', confirm: '' });
                  setShowPasswordModal(true);
                }}
                className="w-full flex items-center gap-3 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface p-4 rounded-xl transition-all duration-300 group border border-outline-variant hover:border-primary text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-on-primary/20 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined">key</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold block text-sm">Ganti Kata Sandi</span>
                  <span className="text-[11px] opacity-70 group-hover:opacity-90">Direkomendasikan diubah secara berkala</span>
                </div>
                <span className="material-symbols-outlined opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0">
                  arrow_forward
                </span>
              </button>

              <div className="mt-auto pt-5 flex items-center gap-2 text-[11px] text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Status akun aktif
              </div>
            </section>
          </div>
        </div>

          {/* Aktivitas Terakhir dihapus sesuai permintaan */}

          {isDesa && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 md:p-6 shadow-sm mt-0">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  <span className="font-medium text-on-surface">Profil dikelola oleh Admin BKD.</span> Jika terdapat kesalahan data atau perlu perubahan, silakan hubungi Admin BKD Kabupaten Purbalingga.
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Password Modal - Admin only */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-fadeIn">
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-3xl text-primary">lock_reset</span>
              </div>
              <h2 className="text-xl font-bold text-on-surface">Ganti Kata Sandi</h2>
              <p className="text-sm text-on-surface-variant mt-1">Buat kata sandi baru yang kuat.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 ml-0.5 tracking-wide font-medium">Kata Sandi Lama</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/60">lock</span>
                  <input
                    type={showOldPwd ? "text" : "password"}
                    required
                    value={passwordForm.old}
                    onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl pl-10 pr-12 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Masukkan kata sandi saat ini"
                  />
                  {passwordForm.old.length > 0 && (
                    <button type="button" onClick={() => setShowOldPwd(!showOldPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary rounded-full">
                      <span className="material-symbols-outlined text-[20px]">{showOldPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 ml-0.5 tracking-wide font-medium">Kata Sandi Baru</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/60">vpn_key</span>
                  <input
                    type={showNewPwd ? "text" : "password"}
                    required
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl pl-10 pr-12 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Minimal 8 karakter"
                  />
                  {passwordForm.new.length > 0 && (
                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary rounded-full">
                      <span className="material-symbols-outlined text-[20px]">{showNewPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 ml-0.5 tracking-wide font-medium">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/60">check_circle</span>
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    required
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl pl-10 pr-12 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Ulangi kata sandi baru"
                  />
                  {passwordForm.confirm.length > 0 && (
                    <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary rounded-full">
                      <span className="material-symbols-outlined text-[20px]">{showConfirmPwd ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPwd || !passwordForm.old || !passwordForm.new || !passwordForm.confirm || passwordForm.new.length < 8 || passwordForm.new !== passwordForm.confirm}
                className="w-full py-2.5 font-bold bg-primary text-on-primary rounded-xl mt-4 hover:bg-primary/90 transition-all flex justify-center items-center gap-2 shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isChangingPwd && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                Simpan Kata Sandi
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </main>
  );
}
