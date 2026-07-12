import React from 'react';
import StatusBadge from '../components/StatusBadge';

export default function DashboardDesa({ onNavigate }) {
  const stats = [
    {
      title: 'Total SPOP Dikirim',
      value: '156',
      icon: 'description',
      iconBg: 'bg-primary-fixed',
      iconColor: 'text-primary',
      trend: '+12% Bulan Ini',
      trendColor: 'text-secondary',
      trendIcon: 'trending_up',
      borderHover: 'hover:border-primary',
    },
    {
      title: 'Menunggu Validasi',
      value: '12',
      icon: 'pending_actions',
      iconBg: 'bg-secondary-container',
      iconColor: 'text-secondary',
      trend: 'Butuh Peninjauan Segera',
      trendColor: 'text-primary',
      trendIcon: 'info',
      borderHover: 'hover:border-secondary',
    },
    {
      title: 'SPOP Disetujui',
      value: '142',
      icon: 'domain',
      iconBg: 'bg-tertiary-fixed',
      iconColor: 'text-tertiary',
      trend: 'Terdaftar di Sistem',
      trendColor: 'text-outline',
      trendIcon: 'check_circle',
      borderHover: 'hover:border-tertiary',
    },
    {
      title: 'SPOP Perlu Perbaikan',
      value: '2',
      icon: 'report',
      iconBg: 'bg-error-container',
      iconColor: 'text-error',
      trend: 'Perlu Revisi Ulang',
      trendColor: 'text-error',
      trendIcon: 'warning',
      borderHover: 'hover:border-error',
    },
  ];

  const recentSubmissions = [
    {
      nop: '33.03.010.001.001.001',
      name: 'Budi Santoso',
      type: 'Perekaman Data Baru',
      date: '24 Okt 2023',
      status: 'Verifikasi',
    },
    {
      nop: '33.03.010.005.012.000',
      name: 'Siti Aminah',
      type: 'Mutakhirkan Data',
      date: '23 Okt 2023',
      status: 'Draft',
    },
    {
      nop: '33.03.040.002.009.004',
      name: 'PT. Maju Bersama',
      type: 'Penghapusan Data',
      date: '22 Okt 2023',
      status: 'Ditolak',
    },
  ];

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-section-gap flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-section-header font-section-header text-secondary mb-2 uppercase">
            SUBMISI DATA DESA
          </p>
          <h2 className="font-display-lg text-display-lg text-primary tracking-tight">
            Panel Pengajuan SPOP Desa
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Kelola dan pantau pengiriman data pajak dari wilayah desa Anda.
          </p>
        </div>
        <button
          onClick={() => onNavigate('formulir_spop')}
          className="bg-primary text-on-primary px-6 py-3 rounded-full flex items-center gap-2 font-label-sm text-label-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined">add</span>
          Buat SPOP Baru
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-section-gap">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm transition-colors duration-200 group ${stat.borderHover}`}
          >
            <div
              className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center ${stat.iconColor} mb-4 group-hover:scale-110 transition-transform`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {stat.icon}
              </span>
            </div>
            <p className="text-on-surface-variant text-label-sm font-label-sm">{stat.title}</p>
            <p className="font-display-lg text-display-lg text-primary mt-1">{stat.value}</p>
            <div className={`mt-4 flex items-center gap-1 ${stat.trendColor}`}>
              <span className="material-symbols-outlined text-[16px]">{stat.trendIcon}</span>
              <span className="text-[12px] font-bold">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-primary font-bold">
              Pengajuan SPOP Terbaru
            </h3>
            <button
              onClick={() => onNavigate('daftar_objek')}
              className="text-primary font-label-sm text-label-sm hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-section-header text-section-header text-primary uppercase">
                    NOP / Nama Subjek
                  </th>
                  <th className="px-6 py-4 font-section-header text-section-header text-primary uppercase">
                    Jenis Transaksi
                  </th>
                  <th className="px-6 py-4 font-section-header text-section-header text-primary uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 font-section-header text-section-header text-primary uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {recentSubmissions.map((sub, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-label-sm text-label-sm text-on-surface">{sub.nop}</p>
                      <p className="text-[12px] text-on-surface-variant">{sub.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body-md font-body-md text-on-surface">
                        {sub.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-body-md font-body-md text-on-surface">{sub.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button
                        onClick={() => onNavigate('pelacakan_dokumen')}
                        className="material-symbols-outlined text-outline hover:text-secondary transition-colors"
                        title="Lacak Dokumen"
                      >
                        route
                      </button>
                      <button
                        onClick={() => onNavigate('detail_review')}
                        className="material-symbols-outlined text-outline hover:text-primary transition-colors"
                        title={sub.status === 'Draft' ? 'Edit/Verifikasi' : 'Lihat Detail'}
                      >
                        {sub.status === 'Draft' ? 'edit' : 'visibility'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sebaran Map Card */}
        <div className="bg-primary text-on-primary rounded-xl overflow-hidden flex flex-col shadow-lg relative min-h-[400px]">
          <div className="p-6 relative z-10 bg-gradient-to-b from-primary/90 to-transparent">
            <h3 className="font-headline-md text-headline-md font-bold mb-1">
              Sebaran Objek Pajak
            </h3>
            <p className="text-on-primary-container text-body-md opacity-80">
              Kecamatan Purbalingga Kota
            </p>
          </div>
          <div className="flex-1 w-full relative bg-[#091a3a] overflow-hidden min-h-[220px]">
            <img
              alt="Peta Digital Wilayah"
              className="w-full h-full object-cover opacity-40 grayscale contrast-125"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYhrBcuk844x9pdSFw7Zjr98AI1pPp7lk6oIsgBmhiWaQ675HX0qfeaF3k3v-V-6ju4gyEtJffJU6Nl5gLNmseWs9SH3yKgdVJ5I5uAccK_gbS6pxWBGaLk8KJ3K2q2xhm8vid2toBatyzr7F2iWER3RZJSTFS2WCdIaYxvu0JPb_DC53e0UF-jcbPFZ4WLBYMVbPGSy6lIt4mQ7Czax-NNuPxm9Jo37KVSlGamCgC8kWIeHtwWrH6R-sz2630TDADYA6p9wKD2ASi"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
            {/* Animated Markers */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_#1b6b51]"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_#1b6b51]"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-tertiary-fixed-dim rounded-full animate-ping shadow-[0_0_15px_#ffb691]"></div>
          </div>
          <div className="p-6 bg-primary-container/30 backdrop-blur-md border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label-sm font-label-sm">Kepatuhan Terendah</span>
              <span className="text-error font-bold text-label-sm">Kec. Karangreja</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div className="bg-error h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
            <p className="text-[12px] opacity-70">Membutuhkan intervensi petugas lapangan segera.</p>
          </div>
        </div>
      </div>

      {/* Paper Form Mimic Demo Section */}
      <div className="mt-section-gap bg-surface-container-lowest border border-outline-variant p-gutter rounded-xl shadow-sm">
        <div className="flex items-start gap-gutter mb-6 border-b-2 border-primary pb-6">
          <img
            alt="Logo Kabupaten Purbalingga"
            className="w-16 h-16 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVheQzbBwjopVwLSxhQICq2qfX1nY3FESRQtNuHtfckd2llQYBokE-s-YxSRYQMmjXibOYJmuAdv_vzfI7c1jHybb1ni0znZ-Xah5xJN68DNDsHnbradNGR_6I17I1OqGAkHK5vw6BEbkcJaJ8EfxvYCsZc-qOtXQW2tS7lJcOocYy0m6jIkZ24q_v71ZwUkFmQr2sslBpHQ8lwYBK-A-9tTLW6AOhtzdT2AidzKQ3tPy5kf9KWLVkVUEMCJ6x83C8JWtYFjgcshmM"
          />
          <div className="flex-1">
            <p className="font-section-header text-section-header tracking-[0.2em] text-on-surface-variant uppercase">
              PEMERINTAH KABUPATEN PURBALINGGA
            </p>
            <h4 className="font-headline-md text-headline-md text-primary font-extrabold uppercase">
              BADAN KEUANGAN DAERAH
            </h4>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Jl. Onje No. 4 Purbalingga Telp. (0281) 891098
            </p>
          </div>
          <div className="border-2 border-primary p-4 text-center min-w-[120px]">
            <h2 className="font-display-lg text-display-lg text-primary font-black leading-none">
              SPOP
            </h2>
            <p className="text-[9px] font-bold uppercase tracking-tighter mt-1">
              Surat Pemberitahuan<br />Objek Pajak
            </p>
          </div>
        </div>

        {/* NOP Segmented Display Demo */}
        <div className="mt-6">
          <p className="font-section-header text-section-header text-primary mb-3 uppercase">
            Struktur NOP (Nomor Objek Pajak)
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-px bg-outline-variant border border-outline-variant rounded overflow-hidden">
              <div className="segmented-input-box flex items-center justify-center font-bold text-primary">3</div>
              <div className="segmented-input-box flex items-center justify-center font-bold text-primary">3</div>
            </div>
            <span className="text-primary font-bold text-xl">.</span>
            <div className="flex gap-px bg-outline-variant border border-outline-variant rounded overflow-hidden">
              <div className="segmented-input-box flex items-center justify-center font-bold text-primary">0</div>
              <div className="segmented-input-box flex items-center justify-center font-bold text-primary">3</div>
            </div>
            <span className="text-primary font-bold text-xl">.</span>
            <div className="flex gap-px bg-outline-variant border border-outline-variant rounded overflow-hidden">
              <div className="segmented-input-box flex items-center justify-center font-bold text-primary">0</div>
              <div className="segmented-input-box flex items-center justify-center font-bold text-primary">1</div>
              <div className="segmented-input-box flex items-center justify-center font-bold text-primary">0</div>
            </div>
            <span className="text-outline font-medium text-sm hidden sm:inline-block ml-4">
              (Provinsi.Kabupaten.Kecamatan...)
            </span>
          </div>
          <p className="text-[12px] text-on-surface-variant mt-3 italic">
            * NOP terdiri dari 18 digit kode unik yang mewakili data geospasial objek pajak di daerah.
          </p>
        </div>
      </div>
    </main>
  );
}
