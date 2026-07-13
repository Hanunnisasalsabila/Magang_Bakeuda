import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function DashboardDesa({ onNavigate }) {
  const [stats, setStats] = useState([
    { title: 'Total SPOP Dikirim', value: '0', icon: 'description', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', trend: 'Memuat...', trendColor: 'text-gray-500', trendIcon: 'trending_up', borderHover: 'hover:border-blue-500' },
    { title: 'Menunggu Verifikasi', value: '0', icon: 'pending_actions', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', trend: 'Memuat...', trendColor: 'text-yellow-500', trendIcon: 'info', borderHover: 'hover:border-yellow-500' },
    { title: 'SPOP Disetujui', value: '0', icon: 'domain', iconBg: 'bg-green-100', iconColor: 'text-green-600', trend: 'Memuat...', trendColor: 'text-green-500', trendIcon: 'check_circle', borderHover: 'hover:border-green-500' },
    { title: 'SPOP Perlu Perbaikan', value: '0', icon: 'report', iconBg: 'bg-red-100', iconColor: 'text-red-600', trend: 'Memuat...', trendColor: 'text-red-500', trendIcon: 'warning', borderHover: 'hover:border-red-500' },
  ]);

  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listRes, userRes] = await Promise.all([
          api.get('/transaksi-spop/stats'),
          api.get('/transaksi-spop'),
          api.get('/auth/me').catch(() => ({ data: { data: null } }))
        ]);
        
        const dataStats = statsRes.data.data;
        setStats([
          { title: 'Total SPOP Dikirim', value: dataStats.totalDikirim.toString(), icon: 'description', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', trend: 'Keseluruhan', trendColor: 'text-gray-500', trendIcon: 'trending_up', borderHover: 'hover:border-blue-500' },
          { title: 'Menunggu Verifikasi', value: dataStats.menunggu.toString(), icon: 'pending_actions', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', trend: 'Perlu verifikasi', trendColor: 'text-yellow-500', trendIcon: 'info', borderHover: 'hover:border-yellow-500' },
          { title: 'SPOP Disetujui', value: dataStats.disetujui.toString(), icon: 'domain', iconBg: 'bg-green-100', iconColor: 'text-green-600', trend: 'Tervalidasi', trendColor: 'text-green-500', trendIcon: 'check_circle', borderHover: 'hover:border-green-500' },
          { title: 'SPOP Perlu Perbaikan', value: dataStats.perluPerbaikan.toString(), icon: 'report', iconBg: 'bg-red-100', iconColor: 'text-red-600', trend: 'Butuh revisi', trendColor: 'text-red-500', trendIcon: 'warning', borderHover: 'hover:border-red-500' },
        ]);

        const rawList = listRes.data.data;
        const formattedList = rawList.slice(0, 5).map(item => ({
          nop: item.detail_tujuan[0]?.nop_generated || item.detail_tujuan[0]?.no_persil_baru || 'Menunggu NOP',
          name: item.nama_pengaju || 'Tanpa Nama',
          type: item.jenis_transaksi,
          date: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: item.status_ajuan === 'MENUNGGU' ? 'Menunggu Verifikasi' : item.status_ajuan === 'DISETUJUI' ? 'Disetujui' : item.status_ajuan === 'REVISI' ? 'Revisi' : item.status_ajuan === 'DRAFT' ? 'Draft' : 'Ditolak'
        }));
        setRecentSubmissions(formattedList);
        
        if (userRes.data?.data) {
          setUserInfo(userRes.data.data);
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
    <main className="p-4 md:p-6 max-w-screen-2xl mx-auto font-sans space-y-6">
      {/* Paper Header banner */}
      <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-6">
            <img
              alt="Kabupaten Purbalingga Logo"
              className="h-16 w-16 object-contain"
              src={logoPurbalingga}
            />
            <div>
              <h1 className="text-2xl text-blue-900 uppercase font-extrabold tracking-wide">
                Portal Pelayanan Desa
              </h1>
              <p className="text-gray-500 font-medium">
                Pemerintah Kabupaten Purbalingga
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold tracking-widest rounded">
              SISTEM INFORMASI PAJAK DAERAH
            </span>
            <span className="px-3 py-1 border border-blue-200 text-blue-700 text-[10px] font-bold tracking-widest rounded">
              SPOP DIGITAL DESA
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onNavigate('formulir_spop')}
          className="bg-blue-900 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm hover:bg-blue-950 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Buat SPOP Baru
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white p-6 border border-gray-200 rounded-xl shadow-sm transition-colors duration-200 group ${stat.borderHover}`}
          >
            <div
              className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center ${stat.iconColor} mb-4 group-hover:scale-110 transition-transform`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {stat.icon}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-semibold">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <div className={`mt-4 flex items-center gap-1 ${stat.trendColor}`}>
              <span className="material-symbols-outlined text-[16px]">{stat.trendIcon}</span>
              <span className="text-[12px] font-bold">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Pengajuan SPOP Terbaru
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">Daftar riwayat pengajuan Anda akhir-akhir ini</p>
            </div>
            <button
              onClick={() => onNavigate('monitoring_pajak')}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-bold transition-colors"
            >
              <span>Lihat Semua</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                    NOP / Nama Subjek
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 whitespace-nowrap">
                    Jenis Transaksi
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 whitespace-nowrap text-center">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 whitespace-nowrap text-center">
                    Status
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 whitespace-nowrap text-center pl-12">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined animate-spin text-3xl text-blue-600">refresh</span>
                      <span>Memuat data pengajuan...</span>
                    </td>
                  </tr>
                ) : recentSubmissions.length > 0 ? (
                  recentSubmissions.map((sub, i) => (
                    <tr key={i} className={`hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <p className="font-mono font-bold text-blue-700 text-sm whitespace-nowrap">{sub.nop}</p>
                        <p className="font-semibold text-gray-900 whitespace-nowrap">{sub.name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-600">
                          {sub.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <p className="text-xs font-semibold text-gray-500">{sub.date}</p>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap pl-12">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => onNavigate(sub.status === 'Draft' ? 'formulir_spop' : 'monitoring_pajak')}
                            className="px-4 py-2 bg-white text-blue-600 border border-gray-200 hover:border-blue-600 hover:bg-blue-50 rounded-lg transition-all font-bold text-xs shadow-sm flex items-center gap-1.5"
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
                    <td colSpan="5" className="text-center py-12 text-gray-400">
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
        <div className="bg-slate-800 text-white rounded-xl overflow-hidden flex flex-col shadow-lg relative min-h-[400px]">
          <div className="p-6 relative z-10 bg-gradient-to-b from-slate-900 to-transparent">
            <h3 className="text-lg font-bold mb-1">
              {userInfo?.wilayah?.nama_desa ? `Desa ${userInfo.wilayah.nama_desa}` : 'Wilayah Tugas Anda'}
            </h3>
            <p className="text-slate-300 text-sm opacity-90">
              {userInfo?.wilayah?.kecamatan ? `Kecamatan ${userInfo.wilayah.kecamatan}` : 'Memuat data wilayah...'}
            </p>
          </div>
          <div className="flex-1 w-full relative bg-slate-900 overflow-hidden min-h-[220px]">
            <img
              alt="Peta Digital Wilayah"
              className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            {/* Animated Markers */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-400 rounded-full animate-ping shadow-[0_0_15px_#60a5fa]"></div>
          </div>
          <div className="p-6 bg-slate-900/50 backdrop-blur-md border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Wajib Pajak</span>
              <span className="text-white font-bold text-sm">-</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-xs text-slate-400">Data kepatuhan belum tersedia.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
