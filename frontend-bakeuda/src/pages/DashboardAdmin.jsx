import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeSelect, setActiveSelect] = useState('Minggu Ini');
  const [bentoCards, setBentoCards] = useState([
    { title: 'Pengajuan Masuk', value: '0', icon: 'inbox', badgeText: '', badgeColor: 'text-secondary', meta: 'Data SPOP periode berjalan', bgIcon: 'bg-surface-container text-primary', link: '/antrean-verifikasi' },
    { title: 'Menunggu Verifikasi', value: '0', icon: 'pending_actions', badgeText: 'Penting', badgeColor: 'text-error font-bold', meta: 'Butuh penanganan segera', bgIcon: 'bg-error-container text-error', link: '/antrean-verifikasi' },
    { title: 'Total Objek Pajak', value: '0', icon: 'location_city', badgeText: 'Total', badgeColor: 'text-on-surface-variant', meta: 'Terdaftar di database PBB', bgIcon: 'bg-surface-container text-primary', link: '/daftar-objek-pajak' }
  ]);

  const [verifiers, setVerifiers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listRes, usersRes] = await Promise.all([
          api.get('/transaksi-spop/stats'),
          api.get('/transaksi-spop'),
          api.get('/users')
        ]);
        
        const dataStats = statsRes.data.data;
        setBentoCards([
          { title: 'Pengajuan Masuk', value: (dataStats.totalDikirim || 0).toString(), icon: 'inbox', badgeText: 'Data Terbaru', badgeColor: 'text-secondary', meta: 'Data SPOP periode berjalan', bgIcon: 'bg-surface-container text-primary', link: '/antrean-verifikasi' },
          { title: 'Menunggu Verifikasi', value: (dataStats.menunggu || 0).toString(), icon: 'pending_actions', badgeText: 'Penting', badgeColor: 'text-error font-bold', meta: 'Butuh penanganan segera', bgIcon: 'bg-error-container text-error', link: '/antrean-verifikasi' },
          { title: 'Total Objek Pajak', value: (dataStats.totalObjek || 0).toString(), icon: 'location_city', badgeText: 'Total', badgeColor: 'text-on-surface-variant', meta: 'Terdaftar di database PBB', bgIcon: 'bg-surface-container text-primary', link: '/daftar-objek-pajak' }
        ]);

        if (usersRes.data && usersRes.data.success) {
          const bakeudaUsers = usersRes.data.data.filter(u => u.role === 'BAKEUDA').slice(0, 5);
          setVerifiers(bakeudaUsers.map(u => ({
            name: u.nama_lengkap || u.username,
            role: 'Verifikator BKD',
            status: 'active'
          })));
        }

        const formattedList = listRes.data.data.slice(0, 5).map(item => ({
          id: item.id_transaksi,
          nop: item.detail_tujuan[0]?.nop_generated || item.detail_tujuan[0]?.no_persil_baru || 'Menunggu NOP',
          name: (item.detail_tujuan?.[0]?.calon_subjek_json?.nama_subjek && item.detail_tujuan?.[0]?.calon_subjek_json?.nama_subjek.toUpperCase() !== 'TANPA NAMA') ? item.detail_tujuan?.[0]?.calon_subjek_json?.nama_subjek : (item.nama_pengaju || item.pengaju?.nama_lengkap || 'Tanpa Nama'),
          district: item.pengaju?.nama_lengkap || 'Admin Desa',
          status: item.status_ajuan === 'MENUNGGU' ? 'Menunggu Verifikasi' : item.status_ajuan === 'DISETUJUI' ? 'Disetujui' : item.status_ajuan === 'REVISI' ? 'Revisi' : item.status_ajuan === 'DRAFT' ? 'Draft' : 'Ditolak',
          time: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        setActivities(formattedList);
      } catch (error) {
        console.error("Gagal mengambil data dashboard admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const barChartData = activeSelect === 'Minggu Ini' ? [
    { label: 'SEN', height: '60%', value: 120, title: 'Senin: 120' },
    { label: 'SEL', height: '80%', value: 156, title: 'Selasa: 156' },
    { label: 'RAB', height: '40%', value: 80, title: 'Rabu: 80' },
    { label: 'KAM', height: '90%', value: 190, title: 'Kamis: 190' },
    { label: 'JUM', height: '75%', value: 145, title: 'Jumat: 145' },
    { label: 'SAB', height: '20%', value: 40, title: 'Sabtu: 40' },
    { label: 'MIN', height: '10%', value: 12, title: 'Minggu: 12' },
  ] : [
    { label: 'MG 1', height: '50%', value: 320, title: 'Minggu 1: 320' },
    { label: 'MG 2', height: '85%', value: 500, title: 'Minggu 2: 500' },
    { label: 'MG 3', height: '40%', value: 250, title: 'Minggu 3: 250' },
    { label: 'MG 4', height: '70%', value: 410, title: 'Minggu 4: 410' },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };




  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Paper Header banner */}
      <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-lg shadow-sm">
        <div className="flex items-center gap-6">
          <img
            alt="Kabupaten Purbalingga Logo"
            className="h-16 w-16 object-contain"
            src={logoPurbalingga}
          />
          <div>
            <h1 className="text-2xl text-on-surface uppercase font-extrabold tracking-wide">
              Badan Keuangan Daerah
            </h1>
            <p className="text-on-surface-variant font-medium">
              Pemerintah Kabupaten Purbalingga
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold tracking-widest rounded">
            SISTEM INFORMASI PAJAK DAERAH
          </span>
          <span className="px-3 py-1 border border-blue-200 text-blue-700 text-[10px] font-bold tracking-widest rounded">
            SPOP DIGITAL V.2.0
          </span>
        </div>
      </div>

      {/* Bento Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {bentoCards.map((card, i) => (
          <div key={i} onClick={() => navigate(card.link)} className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.bgIcon.replace('bg-surface-container text-primary', 'bg-primary-container text-on-primary-container').replace('bg-error-container text-error', 'bg-error-container text-error').replace('bg-secondary-container text-on-secondary-container', 'bg-secondary-container text-on-secondary-container')}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              {card.badgeText && (
                <span className={`text-xs font-bold ${card.badgeColor.replace('text-secondary', 'text-blue-600').replace('text-error font-bold', 'text-red-600').replace('text-on-surface-variant', 'text-on-surface-variant')}`}>
                  {card.badgeText}
                </span>
              )}
              {card.progress !== undefined && (
                <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden self-center">
                  <div className="h-full bg-green-500" style={{ width: `${card.progress}%` }}></div>
                </div>
              )}
            </div>
            <p className="text-on-surface-variant font-label-md font-bold mb-1">
              {card.title}
            </p>
            <h2 className="text-3xl font-bold text-on-surface">{card.value}</h2>
            <p className="text-[10px] text-gray-400 mt-2 italic">{card.meta}</p>
          </div>
        ))}
      </div>

      {/* Main Layout: Chart */}
      <div className="grid grid-cols-1 gap-gutter">
        {/* Trend Chart Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg text-on-surface font-bold">
                Tren Pengajuan SPOP
              </h3>
              <p className="text-on-surface-variant text-sm">Statistik pengajuan berdasarkan periode</p>
            </div>
            <select
              value={activeSelect}
              onChange={(e) => setActiveSelect(e.target.value)}
              className="bg-white text-sm text-gray-700 border border-gray-300 rounded px-3 py-1.5 pr-8 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
            </select>
          </div>
          <div className="h-72 flex items-end justify-between gap-4 px-4 relative border-b border-gray-200 pb-2 mt-4">
            {/* Chart Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              <div className="border-t border-gray-200 border-dashed w-full h-0"></div>
              <div className="border-t border-gray-200 border-dashed w-full h-0"></div>
              <div className="border-t border-gray-200 border-dashed w-full h-0"></div>
              <div className="border-t border-gray-200 border-dashed w-full h-0"></div>
              <div className="border-t border-gray-200 border-dashed w-full h-0"></div>
            </div>
            {/* Bars */}
            {barChartData.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative z-10">
                <div
                  className="w-full max-w-[80px] bg-blue-100 hover:bg-blue-500 rounded-t-md transition-all duration-300 cursor-pointer shadow-sm"
                  style={{ height: bar.height }}
                  title={bar.title}
                />
                <span className="text-[11px] text-on-surface-variant font-bold">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Table Section */}
      <div className="mt-gutter bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary font-bold">
              Pengajuan SPOP Terbaru
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">Daftar antrean SPOP yang masuk ke sistem pusat</p>
          </div>
          <button
            onClick={() => navigate('/antrean-verifikasi')}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg text-sm font-bold transition-colors"
          >
            <span>Buka Antrean</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-max">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap">
                  Nomor Objek Pajak (NOP)
                </th>
                <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap">
                  Nama Wajib Pajak
                </th>
                <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap">
                  Asal Pengaju
                </th>
                <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap text-center">
                  Status
                </th>
                <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap text-center">
                  Tanggal
                </th>
                <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap text-center pl-12">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-on-surface-variant flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
                    <span>Memuat data pengajuan...</span>
                  </td>
                </tr>
              ) : activities.length > 0 ? (
                activities.map((act, i) => (
                  <tr key={i} className={`hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? 'bg-surface-container-low/20' : ''}`}>
                    <td className="px-6 py-4 font-data-mono text-primary font-bold whitespace-nowrap text-sm">
                      {act.nop}
                    </td>
                    <td className="px-6 py-4 font-label-md font-bold text-on-background whitespace-nowrap">
                      {act.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                      {act.district}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <StatusBadge status={act.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface-variant text-center whitespace-nowrap">
                      {act.time}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap pl-12">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => navigate('/detail-review/' + act.id )}
                          className="px-4 py-2 bg-white text-primary border border-outline-variant hover:border-primary hover:bg-primary/5 rounded-lg transition-all font-bold text-xs shadow-sm flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">plagiarism</span>
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-on-surface-variant">
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

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/antrean-verifikasi')}
        className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined">fact_check</span>
      </button>
    </div>
  );
}
