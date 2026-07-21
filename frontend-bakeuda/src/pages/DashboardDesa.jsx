import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';

export default function DashboardDesa() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { title: 'Total SPOP Dikirim', value: '0', icon: 'description', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', trend: 'Lihat semua pengajuan →', trendColor: 'text-gray-500', trendIcon: 'trending_up', borderHover: 'hover:border-blue-500', link: '/monitoring-pajak' },
    { title: 'Menunggu Verifikasi', value: '0', icon: 'pending_actions', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', trend: 'Lihat yang menunggu →', trendColor: 'text-yellow-500', trendIcon: 'info', borderHover: 'hover:border-yellow-500', link: '/monitoring-pajak' },
    { title: 'SPOP Disetujui', value: '0', icon: 'domain', iconBg: 'bg-green-100', iconColor: 'text-green-600', trend: 'Lihat yang disetujui →', trendColor: 'text-green-500', trendIcon: 'check_circle', borderHover: 'hover:border-green-500', link: '/monitoring-pajak' },
    { title: 'SPOP Perlu Perbaikan', value: '0', icon: 'report', iconBg: 'bg-red-100', iconColor: 'text-red-600', trend: 'Segera tindak lanjuti →', trendColor: 'text-red-500', trendIcon: 'warning', borderHover: 'hover:border-red-500', link: '/monitoring-pajak' },
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
          { title: 'Total SPOP Dikirim', value: dataStats.totalDikirim.toString(), icon: 'description', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', trend: 'Lihat semua pengajuan →', trendColor: 'text-gray-500', trendIcon: 'trending_up', borderHover: 'hover:border-blue-500', link: '/monitoring-pajak' },
          { title: 'Menunggu Verifikasi', value: dataStats.menunggu.toString(), icon: 'pending_actions', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', trend: 'Lihat yang menunggu →', trendColor: 'text-yellow-500', trendIcon: 'info', borderHover: 'hover:border-yellow-500', link: '/monitoring-pajak' },
          { title: 'SPOP Disetujui', value: dataStats.disetujui.toString(), icon: 'domain', iconBg: 'bg-green-100', iconColor: 'text-green-600', trend: 'Lihat yang disetujui →', trendColor: 'text-green-500', trendIcon: 'check_circle', borderHover: 'hover:border-green-500', link: '/monitoring-pajak' },
          { title: 'SPOP Perlu Perbaikan', value: dataStats.perluPerbaikan.toString(), icon: 'report', iconBg: 'bg-red-100', iconColor: 'text-red-600', trend: 'Segera tindak lanjuti →', trendColor: 'text-red-500', trendIcon: 'warning', borderHover: 'hover:border-red-500', link: '/monitoring-pajak' },
        ]);

        const rawList = listRes.data.data;
        const formattedList = rawList.slice(0, 5).map(item => ({
          id: item.id_transaksi,
          nop: item.detail_tujuan[0]?.nop_generated || item.detail_tujuan[0]?.no_persil_baru || 'Menunggu NOP',
          name: item.nama_pengaju || 'Tanpa Nama',
          type: item.jenis_transaksi,
          date: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: item.status_ajuan === 'MENUNGGU' ? 'Menunggu Verifikasi' : item.status_ajuan === 'PROSES' ? 'Diproses' : item.status_ajuan === 'DISETUJUI' ? 'Disetujui' : item.status_ajuan === 'REVISI' ? 'Revisi' : item.status_ajuan === 'DRAFT' ? 'Draft' : 'Ditolak'
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


      {/* Stats Bento Grid */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Ringkasan status pengajuan SPOP Anda</p>
        </div>
        <button
          onClick={() => navigate('/formulir-spop')}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Buat SPOP Baru
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <button
            key={i}
            onClick={() => navigate(stat.link)}
            className={`bg-surface-container-lowest p-6 border border-outline-variant rounded-xl shadow-sm transition-all duration-200 group ${stat.borderHover} text-left w-full cursor-pointer hover:shadow-md active:scale-[0.98]`}
          >
            <div
              className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center ${stat.iconColor} mb-4 group-hover:scale-110 transition-transform`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {stat.icon}
              </span>
            </div>
            <p className="text-on-surface-variant font-label-md font-bold">{stat.title}</p>
            <p className="text-3xl font-black text-on-surface mt-1">{stat.value}</p>
            <div className={`mt-4 flex items-center gap-1 ${stat.trendColor}`}>
              <span className="material-symbols-outlined text-[16px]">{stat.trendIcon}</span>
              <span className="text-[12px] font-bold">{stat.trend}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <div>
            <h3 className="font-bold text-on-surface text-lg">
              Pengajuan SPOP Terbaru
            </h3>
            <p className="font-label-sm text-on-surface-variant mt-1">Daftar riwayat pengajuan Anda akhir-akhir ini</p>
          </div>
          <button
            onClick={() => navigate('/monitoring-pajak')}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md font-label-sm transition-colors"
          >
            <span>Lihat Semua</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left min-w-max">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                <th className="px-6 py-3 font-bold border-b border-outline-variant whitespace-nowrap">
                  NOP / Nama Subjek
                </th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant whitespace-nowrap">
                  Jenis Transaksi
                </th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant whitespace-nowrap text-center">
                  Tanggal
                </th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant whitespace-nowrap text-center">
                  Status
                </th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant whitespace-nowrap text-center pl-12">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-on-surface-variant flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
                    <span>Memuat data pengajuan...</span>
                  </td>
                </tr>
              ) : recentSubmissions.length > 0 ? (
                recentSubmissions.map((sub, i) => (
                  <tr key={i} className={`hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? 'bg-surface-container-lowest/50' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-data-mono font-bold text-primary text-sm whitespace-nowrap">{sub.nop}</p>
                      <p className="font-label-md font-bold text-on-surface whitespace-nowrap">{sub.name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-label-sm text-on-surface-variant">
                        {sub.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <p className="font-label-sm text-on-surface-variant">{sub.date}</p>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap pl-12">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => navigate(`/pelacakan-dokumen/${sub.id}`)}
                          title="Lacak Status Dokumen"
                          className="px-2 py-2 mr-2 bg-background text-primary border border-outline-variant hover:border-primary hover:bg-primary/10 rounded-lg transition-all shadow-sm focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">timeline</span>
                        </button>
                        <button
                          onClick={() => navigate((sub.status === 'Draft' || sub.status === 'Revisi') ? `/formulir-spop/${sub.id}` : `/detail-review/${sub.id}`)}
                          className="px-4 py-2 bg-background text-primary border border-outline-variant hover:border-primary hover:bg-surface-container-lowest active:bg-primary/10 rounded-lg transition-all font-label-sm font-bold text-xs shadow-sm flex items-center gap-1.5 focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {(sub.status === 'Draft' || sub.status === 'Revisi') ? 'edit' : 'visibility'}
                          </span>
                          {sub.status === 'Draft' ? 'Edit' : sub.status === 'Revisi' ? 'Perbaiki' : 'Detail'}
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
    </main>
  );
}
