import React, { useState } from 'react';

export default function ProfilPengguna({ role }) {
  const isDesa = role === 'desa';
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [tfaEnabled, setTfaEnabled] = useState(true);

  const [profileData, setProfileData] = useState(
    isDesa
      ? {
          name: 'Pratama Yusuf',
          nip: '19950812 202003 1 002',
          role: 'Perangkat Desa Kel. Onje',
          email: 'pratama.yusuf@purbalinggakab.go.id',
          phone: '821-4567-8901',
          dept: 'Pelayanan Publik Desa',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjIREGqkvGX_YmE8U5mkjHFNZWnJIWQ8XGtQp9ftG3uexj_bmSAi7PPYjTEYT4bE8XH8EsDyElmXpCGB7CnKIn_finH8_MLPaA305RwKx1T_2cOIMnIF61LIcoWYtP2RzJf1wblUfHU2ArXd8ov-QUdx856Uv_kMx44VuG4QVVHp7PoWbyPd80Pi2YFSED-QvUqIBDjksd19PGxOnFHNRRBcG9DN-Q8vSr_5B8kc4ryx1SSuhAJxI73tQx97edFITVKqVZQ7NYta9g'
        }
      : {
          name: 'Drs. H. Ahmad Sudirman',
          nip: '19820524 201001 1 008',
          role: 'Verifikator BKD',
          email: 'ahmad.sudirman@purbalinggakab.go.id',
          phone: '812-3456-7890',
          dept: 'Bidang PBB dan BPHTB',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxbF9pjIIiLDorpixCyJnsp0PPncjH8kAb3SjfdDF11I0-wMqD2Cc69xWuSz7UlGCYRu7G7Htm7YbfsLCJ8dK05Sf4WFUuVIlyeGJJXQdsv5qmc1y1JbFC0RTS5iUKjf5ABz_2WIc8siF6TtJQ3xobUEcqpb4Xn92Epf6kj8qnmDyHQxeeD3D-0IWLqXlCWLuokRnZN34wvJG6pczoJFsJsCIZOZi_ya4gU34pwdjSIiRCLILFbspj_a2t_aQDiIQf_NJCcu1oMx78'
        }
  );

  const handleInputChange = (field, e) => {
    setProfileData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 1200);
  };

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
            <button className="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-lg shadow-lg hover:bg-primary-container transition-colors focus:outline-none">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
          </div>
          <div className="flex-1 mb-2">
            <h2 className="font-display-lg text-primary font-bold text-2xl md:text-3xl">
              {profileData.name}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 mt-1">
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[20px] text-primary">badge</span>
                <span>NIP: {profileData.nip}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[20px] text-primary">work</span>
                <span>{profileData.role}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mb-2 w-full md:w-auto">
            <button
              onClick={() => alert('Fitur edit foto / info detail.')}
              className="flex-1 md:flex-none px-6 py-2 border border-outline text-primary font-bold text-sm rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 focus:outline-none"
            >
              Ubah Foto
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 md:flex-none px-6 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:shadow-lg transition-all active:scale-95 focus:outline-none flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  Menyimpan...
                </>
              ) : (
                'Simpan Profil'
              )}
            </button>
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
                  onChange={(e) => handleInputChange('name', e)}
                  className="w-full bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 font-body-md text-on-surface"
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
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs ml-1 block font-semibold">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e)}
                  className="w-full bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 font-body-md text-on-surface"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs ml-1 block font-semibold">
                  Nomor Telepon
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-outline-variant bg-surface-container text-on-surface-variant font-label-sm">
                    +62
                  </span>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e)}
                    className="w-full bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-r-lg px-4 py-3 font-body-md text-on-surface"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs ml-1 block font-semibold">
                  Departemen / Unit Kerja
                </label>
                <input
                  type="text"
                  value={profileData.dept}
                  onChange={(e) => handleInputChange('dept', e)}
                  className="w-full bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-3 font-body-md text-on-surface"
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

              <div className="p-4 bg-surface/50 rounded-xl border border-outline-variant">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 text-on-surface">
                    <span className="material-symbols-outlined text-outline">verified_user</span>
                    <span className="font-label-sm font-semibold">Autentikasi 2-Faktor</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={tfaEnabled}
                      onChange={() => setTfaEnabled(!tfaEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>
                <p className="text-[12px] text-on-surface-variant leading-tight font-medium">
                  Menambah lapisan keamanan ekstra pada akun Anda menggunakan email / authentikator.
                </p>
              </div>

              <div className="pt-4 border-t border-outline-variant">
                <h4 className="font-label-sm text-on-surface-variant text-xs mb-4 font-bold uppercase tracking-wider">
                  Sesi Aktif
                </h4>
                <div className="flex items-center gap-4 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[24px]">computer</span>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold">Windows Laptop</p>
                    <p className="text-[12px] text-on-surface-variant font-medium">Chrome • Sedang Aktif</p>
                  </div>
                  <button
                    onClick={() => alert('Sesi aktif berhasil dikeluarkan.')}
                    className="text-error font-label-sm font-bold text-xs hover:underline focus:outline-none"
                  >
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Language & Regional */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-[24px]">language</span>
              <h3 className="font-headline-md text-on-background font-bold">Bahasa &amp; Regional</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs block font-semibold ml-1">
                  Bahasa Utama
                </label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary">
                  <option>Bahasa Indonesia</option>
                  <option>English</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant text-xs block font-semibold ml-1">
                  Zona Waktu
                </label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary">
                  <option>(GMT+07:00) Jakarta</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Danger Zone */}
      <section className="bg-error-container border border-error rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h3 className="font-headline-md text-on-error-container font-bold text-lg">Zona Bahaya</h3>
          <p className="text-on-error-container opacity-85 font-body-md text-sm mt-1">
            Penghapusan akun akan menghilangkan semua akses ke sistem perpajakan. Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin menonaktifkan akun Anda secara permanen?')) {
              alert('Permohonan penonaktifan akun dikirim.');
            }
          }}
          className="px-6 py-2.5 bg-error text-on-error font-bold text-sm rounded-lg hover:shadow-lg transition-all active:scale-95 shrink-0 focus:outline-none"
        >
          Nonaktifkan Akun
        </button>
      </section>

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
