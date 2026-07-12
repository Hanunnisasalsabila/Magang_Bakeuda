import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';

export default function DashboardDesa({ onNavigate }) {
  const [stats, setStats] = useState([
    { title: 'Total SPOP Dikirim', value: '0', icon: 'description', iconBg: 'bg-primary-fixed', iconColor: 'text-primary', trend: 'Memuat...', trendColor: 'text-secondary', trendIcon: 'trending_up', borderHover: 'hover:border-primary' },
    { title: 'Menunggu Verifikasi', value: '0', icon: 'pending_actions', iconBg: 'bg-secondary-container', iconColor: 'text-secondary', trend: 'Memuat...', trendColor: 'text-primary', trendIcon: 'info', borderHover: 'hover:border-secondary' },
    { title: 'SPOP Disetujui', value: '0', icon: 'domain', iconBg: 'bg-tertiary-fixed', iconColor: 'text-tertiary', trend: 'Memuat...', trendColor: 'text-outline', trendIcon: 'check_circle', borderHover: 'hover:border-tertiary' },
    { title: 'SPOP Perlu Perbaikan', value: '0', icon: 'report', iconBg: 'bg-error-container', iconColor: 'text-error', trend: 'Memuat...', trendColor: 'text-error', trendIcon: 'warning', borderHover: 'hover:border-error' },
  ]);

  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listRes] = await Promise.all([
          api.get('/transaksi-spop/stats'),
          api.get('/transaksi-spop')
        ]);
        
        const dataStats = statsRes.data.data;
        if (dataStats.totalDikirim === 0) {
          // Dummy data fallback jika database kosong
          setStats([
            { title: 'Total SPOP Dikirim', value: '142', icon: 'description', iconBg: 'bg-primary-fixed', iconColor: 'text-primary', trend: '+12 Bulan ini', trendColor: 'text-green-600', trendIcon: 'trending_up', borderHover: 'hover:border-primary' },
            { title: 'Menunggu Verifikasi', value: '18', icon: 'pending_actions', iconBg: 'bg-secondary-container', iconColor: 'text-secondary', trend: 'Perlu dicek admin', trendColor: 'text-orange-500', trendIcon: 'info', borderHover: 'hover:border-secondary' },
            { title: 'SPOP Disetujui', value: '120', icon: 'domain', iconBg: 'bg-tertiary-fixed', iconColor: 'text-tertiary', trend: 'Tervalidasi BKD', trendColor: 'text-green-600', trendIcon: 'check_circle', borderHover: 'hover:border-tertiary' },
            { title: 'SPOP Perlu Perbaikan', value: '4', icon: 'report', iconBg: 'bg-error-container', iconColor: 'text-error', trend: 'Dikembalikan ke Desa', trendColor: 'text-error', trendIcon: 'warning', borderHover: 'hover:border-error' },
          ]);
        } else {
          setStats([
            { title: 'Total SPOP Dikirim', value: dataStats.totalDikirim.toString(), icon: 'description', iconBg: 'bg-primary-fixed', iconColor: 'text-primary', trend: 'Keseluruhan', trendColor: 'text-secondary', trendIcon: 'trending_up', borderHover: 'hover:border-primary' },
            { title: 'Menunggu Verifikasi', value: dataStats.menunggu.toString(), icon: 'pending_actions', iconBg: 'bg-secondary-container', iconColor: 'text-secondary', trend: 'Perlu verifikasi', trendColor: 'text-primary', trendIcon: 'info', borderHover: 'hover:border-secondary' },
            { title: 'SPOP Disetujui', value: dataStats.disetujui.toString(), icon: 'domain', iconBg: 'bg-tertiary-fixed', iconColor: 'text-tertiary', trend: 'Tervalidasi', trendColor: 'text-outline', trendIcon: 'check_circle', borderHover: 'hover:border-tertiary' },
            { title: 'SPOP Perlu Perbaikan', value: dataStats.perluPerbaikan.toString(), icon: 'report', iconBg: 'bg-error-container', iconColor: 'text-error', trend: 'Butuh revisi', trendColor: 'text-error', trendIcon: 'warning', borderHover: 'hover:border-error' },
          ]);
        }

        const rawList = listRes.data.data;
        if (rawList.length === 0) {
           setRecentSubmissions([
             { nop: '33.03.010.001.015.0042.0', name: 'H. Ahmad Dahlan', type: 'Pendaftaran Baru', date: '12 Jul 2026', status: 'Menunggu Verifikasi' },
             { nop: '33.03.010.001.022.0112.0', name: 'Siti Aminah', type: 'Mutasi Penuh', date: '10 Jul 2026', status: 'Disetujui' },
             { nop: '33.03.010.002.005.0003.0', name: 'Budi Santoso', type: 'Pembetulan', date: '08 Jul 2026', status: 'Revisi' },
             { nop: '33.03.010.002.011.0021.0', name: 'KUD Makmur', type: 'Pendaftaran Baru', date: '05 Jul 2026', status: 'Disetujui' },
           ]);
        } else {
          const formattedList = rawList.slice(0, 5).map(item => ({
            nop: item.detail_tujuan[0]?.nop_generated || item.detail_tujuan[0]?.no_persil_baru || 'Menunggu NOP',
            name: item.nama_pengaju || 'Tanpa Nama',
            type: item.jenis_transaksi,
            date: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: item.status_ajuan === 'MENUNGGU' ? 'Menunggu Verifikasi' : item.status_ajuan === 'DISETUJUI' ? 'Disetujui' : item.status_ajuan === 'REVISI' ? 'Revisi' : item.status_ajuan === 'DRAFT' ? 'Draft' : 'Ditolak'
          }));
          setRecentSubmissions(formattedList);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


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
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Pengajuan SPOP Terbaru
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">Daftar riwayat pengajuan Anda akhir-akhir ini</p>
            </div>
            <button
              onClick={() => onNavigate('monitoring_pajak')}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg text-sm font-bold transition-colors"
            >
              <span>Lihat Semua</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                  <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap">
                    NOP / Nama Subjek
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap">
                    Jenis Transaksi
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap text-center">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap text-center pl-12">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-on-surface-variant flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
                      <span>Memuat data pengajuan...</span>
                    </td>
                  </tr>
                ) : recentSubmissions.length > 0 ? (
                  recentSubmissions.map((sub, i) => (
                    <tr key={i} className={`hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? 'bg-surface-container-low/20' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="font-data-mono font-bold text-primary text-sm whitespace-nowrap">{sub.nop}</p>
                        <p className="font-label-md text-on-background whitespace-nowrap">{sub.name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-on-surface-variant">
                          {sub.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <p className="text-xs font-semibold text-on-surface-variant">{sub.date}</p>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap pl-12">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => onNavigate(sub.status === 'Draft' ? 'formulir_spop' : 'monitoring_pajak')}
                            className="px-4 py-2 bg-white text-primary border border-outline-variant hover:border-primary hover:bg-primary/5 rounded-lg transition-all font-bold text-xs shadow-sm flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {sub.status === 'Draft' ? 'edit' : 'visibility'}
                            </span>
                            {sub.status === 'Draft' ? 'Edit' : 'Detail'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-on-surface-variant">
                      <div className="flex flex-col items-center gap-2 opacity-60">
                        <span className="material-symbols-outlined text-4xl">inbox</span>
                        <p>Belum ada pengajuan SPOP terbaru.</p>
                      </div>
                    </td>
                  </tr>
                )}
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
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
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
    </main>
  );
}
