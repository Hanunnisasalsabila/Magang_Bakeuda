import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

export default function ProfilPengguna({ role }) {
  const isDesa = role === 'desa';
  const [showToast, setShowToast] = useState(false);
  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    nip: '',
    role: '',
    dept: '',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjIREGqkvGX_YmE8U5mkjHFNZWnJIWQ8XGtQp9ftG3uexj_bmSAi7PPYjTEYT4bE8XH8EsDyElmXpCGB7CnKIn_finH8_MLPaA305RwKx1T_2cOIMnIF61LIcoWYtP2RzJf1wblUfHU2ArXd8ov-QUdx856Uv_kMx44VuG4QVVHp7PoWbyPd80Pi2YFSED-QvUqIBDjksd19PGxOnFHNRRBcG9DN-Q8vSr_5B8kc4ryx1SSuhAJxI73tQx97edFITVKqVZQ7NYta9g'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          const data = response.data.data;
          setProfileData({
            name: data.nama_lengkap,
            nip: data.nip || '-',
            role: data.role === 'DESA' ? `Perangkat Desa ${data.wilayah?.nama_desa || ''}` : 'Verifikator BKD',
            dept: data.wilayah ? `Kecamatan ${data.wilayah.kecamatan}` : 'Badan Keuangan Daerah',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjIREGqkvGX_YmE8U5mkjHFNZWnJIWQ8XGtQp9ftG3uexj_bmSAi7PPYjTEYT4bE8XH8EsDyElmXpCGB7CnKIn_finH8_MLPaA305RwKx1T_2cOIMnIF61LIcoWYtP2RzJf1wblUfHU2ArXd8ov-QUdx856Uv_kMx44VuG4QVVHp7PoWbyPd80Pi2YFSED-QvUqIBDjksd19PGxOnFHNRRBcG9DN-Q8vSr_5B8kc4ryx1SSuhAJxI73tQx97edFITVKqVZQ7NYta9g'
          });
        }
      } catch (err) {
        setError('Gagal memuat profil');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const activities = isDesa
    ? [
        {
          desc: 'Mengajukan Formulir SPOP Baru NOP: 33.03.010.001.001.001',
          time: '3 jam yang lalu • Menunggu Validasi',
          icon: 'description',
          iconBg: 'bg-primary-container text-on-primary-container',
        },
        {
          desc: 'Menyimpan draf pemutakhiran NOP: 33.03.010.005.012.000',
          time: 'Kemarin • Draft',
          icon: 'edit_note',
          iconBg: 'bg-surface-container-highest text-on-surface-variant',
        },
      ]
    : [
        {
          desc: 'Memverifikasi SPOP NOP: 33.03.110.001.002-0054.0',
          time: '2 jam yang lalu • Selesai',
          icon: 'description',
          iconBg: 'bg-secondary-container text-on-secondary-container',
        },
        {
          desc: 'Mengirim Catatan Perbaikan Objek Pajak Kelurahan Purbalingga Lor',
          time: '5 jam yang lalu • Menunggu Persetujuan',
          icon: 'edit_note',
          iconBg: 'bg-primary-container text-on-primary-container',
        },
      ];

  if (isLoading) return <div className="p-8 text-center mt-20"><span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span><p className="mt-4">Memuat Profil...</p></div>;
  if (error) return <div className="p-8 text-center text-error mt-20">{error}</div>;

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto space-y-8 w-full">
      {/* Profile Header Card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="h-32 bg-primary relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        </div>
        <div className="px-6 md:px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 text-center md:text-left">
          <div className="relative group select-none">
            <img
              alt={`${profileData.name} Profile`}
              className="w-32 h-32 rounded-xl border-4 border-surface-container-lowest shadow-md object-cover bg-surface"
              src={profileData.avatar}
            />
          </div>
        </div>
      </section>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Information */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-[24px]">person_outline</span>
              <h3 className="font-headline-md text-on-background font-bold">Informasi Pribadi</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs ml-1 block font-semibold">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  readOnly
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface-variant cursor-not-allowed select-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs ml-1 block font-semibold">
                  NIP
                </label>
                <input
                  type="text"
                  value={profileData.nip}
                  readOnly
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface-variant cursor-not-allowed select-none"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs ml-1 block font-semibold">
                  Departemen / Unit Kerja
                </label>
                <input
                  type="text"
                  value={profileData.dept}
                  readOnly
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface-variant cursor-not-allowed select-none"
                />
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 md:px-8 py-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">history</span>
                <h3 className="font-headline-md text-on-background font-bold">Aktivitas Terakhir</h3>
              </div>
              <button
                onClick={() => alert('Membuka riwayat aktivitas lengkap...')}
                className="text-primary font-label-sm font-semibold hover:underline"
              >
                Lihat Semua
              </button>
            </div>
            <div className="divide-y divide-outline-variant">
              {activities.map((act, i) => (
                <div key={i} className="p-6 flex gap-4 hover:bg-surface-container-low/40 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${act.iconBg}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {act.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md text-on-surface text-sm sm:text-base leading-normal">
                      {act.desc}
                    </p>
                    <p className="text-on-surface-variant text-[12px] mt-1 font-medium">{act.time}</p>
                  </div>
                </div>
              ))}
              <div className="p-6 flex gap-4 hover:bg-surface-container-low/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 text-on-surface-variant shadow-sm">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    login
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md text-on-surface text-sm sm:text-base">
                    Login sistem via Google Chrome (Windows 10)
                  </p>
                  <p className="text-on-surface-variant text-[12px] mt-1 font-medium">
                    Kemarin, 08:30 WIB • IP: 182.253.92.12
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Security & Settings */}
        <div className="space-y-8">
          {/* Account Security */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-[24px]">security</span>
              <h3 className="font-headline-md text-on-background font-bold">Keamanan Akun</h3>
            </div>
            <div className="space-y-6">
              <div
                onClick={() => alert('Membuka dialog ganti kata sandi...')}
                className="group border border-outline-variant p-4 rounded-xl hover:border-primary transition-all cursor-pointer bg-surface/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-outline">lock_reset</span>
                    <span className="font-label-sm font-semibold">Ganti Kata Sandi</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant mt-2 font-medium">
                  Terakhir diubah: 4 bulan yang lalu
                </p>
              </div>

            </div>
          </section>
        </div>
      </div>

      {/* Success Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 bg-secondary-container text-on-secondary-container border border-secondary/35 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-50 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0'
        }`}
      >
        <span className="material-symbols-outlined text-secondary text-[24px]">check_circle</span>
        <div>
          <p className="font-bold">Berhasil!</p>
          <p className="text-sm opacity-90">Perubahan profil telah disimpan.</p>
        </div>
        <button className="ml-4 opacity-50 hover:opacity-100" onClick={() => setShowToast(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </main>
  );
}
