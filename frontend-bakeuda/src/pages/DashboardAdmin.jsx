import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeSelect, setActiveSelect] = useState('Minggu Ini');
  const [bentoCards, setBentoCards] = useState([
    { title: 'Total Pengajuan', value: '0', icon: 'description', badgeText: '', badgeColor: 'text-secondary', meta: 'Jumlah keseluruhan berkas', bgIcon: 'bg-surface-container text-primary', link: '/riwayat-persetujuan' },
    { title: 'Antrean Verifikasi', value: '0', icon: 'fact_check', badgeText: '', badgeColor: 'text-error', meta: 'Menunggu proses persetujuan', bgIcon: 'bg-error-container text-error', link: '/antrean-verifikasi' },
    { title: 'Total Objek Pajak', value: '0', icon: 'maps_home_work', badgeText: '', badgeColor: 'text-on-surface-variant', meta: 'Terdaftar di basis data PBB', bgIcon: 'bg-surface-container text-primary' }
  ]);

  const [verifiers, setVerifiers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listRes, usersRes, objekStatsRes] = await Promise.all([
          api.get('/transaksi-spop/stats'),
          api.get('/transaksi-spop'),
          api.get('/users'),
          api.get('/objek-pajak/stats')
        ]);
        
        const dataStats = statsRes.data.data;
        const totalObj = (objekStatsRes && objekStatsRes.data && objekStatsRes.data.data) ? objekStatsRes.data.data.total : 0;
        setBentoCards([
          { title: 'Total Pengajuan', value: (dataStats.totalDikirim || 0).toString(), icon: 'description', badgeText: 'Semua Data', badgeColor: 'text-secondary', meta: 'Jumlah keseluruhan berkas', bgIcon: 'bg-surface-container text-primary', link: '/riwayat-persetujuan' },
          { title: 'Antrean Verifikasi', value: (dataStats.menunggu || 0).toString(), icon: 'fact_check', badgeText: 'Prioritas', badgeColor: 'text-error font-bold', meta: 'Menunggu proses persetujuan', bgIcon: 'bg-error-container text-error', link: '/antrean-verifikasi' },
          { title: 'Total Objek Pajak', value: totalObj.toString(), icon: 'maps_home_work', badgeText: 'Keseluruhan', badgeColor: 'text-on-surface-variant', meta: 'Terdaftar di basis data PBB', bgIcon: 'bg-surface-container text-primary' }
        ]);

        if (usersRes.data && usersRes.data.success) {
          const bakeudaUsers = usersRes.data.data.filter(u => u.role === 'BAKEUDA').slice(0, 5);
          setVerifiers(bakeudaUsers.map(u => ({
            name: u.nama_lengkap || u.username,
            role: 'Verifikator BKD',
            status: 'active'
          })));
        }

        const rawList = listRes.data.data || [];
        setAllTransactions(rawList);

        const formattedList = rawList.slice(0, 5).map(item => {
          let nopToDisplay = item.detail_tujuan?.[0]?.nop_generated || '............-.......';
          let nameToDisplay = item.detail_tujuan?.[0]?.calon_subjek_json?.nama_subjek || '';

          if (item.jenis_transaksi === 'HAPUS' && item.detail_asal?.[0]) {
            nopToDisplay = item.detail_asal[0].nop_asal || nopToDisplay;
            nameToDisplay = item.detail_asal[0].objek_asal?.subjek_pajak?.nama_subjek || nameToDisplay;
          }

          nameToDisplay = (nameToDisplay && nameToDisplay.toUpperCase() !== 'TANPA NAMA') 
            ? nameToDisplay 
            : (item.nama_pengaju || item.pengaju?.nama_lengkap || 'Tanpa Nama');

          return {
            id: item.id_transaksi,
            nop: nopToDisplay,
            name: nameToDisplay,
            district: item.pengaju?.nama_lengkap || 'Admin Desa',
            jenis_layanan: item.jenis_transaksi ? item.jenis_transaksi.replace(/_/g, ' ') : '-',
            status: (item.status_ajuan === 'MENUNGGU' || item.status_ajuan === 'PROSES') ? 'Menunggu Verifikasi' : item.status_ajuan === 'DISETUJUI' ? 'Disetujui' : item.status_ajuan === 'REVISI' ? 'Revisi' : item.status_ajuan === 'DRAFT' ? 'Draft' : item.status_ajuan === 'DITOLAK' ? 'Ditolak' : item.status_ajuan,
            time: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        };
      });
        setActivities(formattedList);
      } catch (error) {
        console.error("Gagal mengambil data dashboard admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const generateChartData = (transactions, period) => {
    const today = new Date();
    if (period === 'Minggu Ini') {
      const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      startOfWeek.setHours(0,0,0,0);
      
      const counts = [0, 0, 0, 0, 0, 0, 0];
      const labels = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
      const fullLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
      
      transactions.forEach(t => {
        const d = new Date(t.tanggal_pengajuan);
        if (d >= startOfWeek) {
          const diffDays = Math.floor((d - startOfWeek) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 7) {
            counts[diffDays]++;
          }
        }
      });
      
      const maxCount = Math.max(...counts, 5); // Minimum scale of 5
      return counts.map((count, i) => ({
        label: labels[i],
        height: `${(count / maxCount) * 100}%`,
        value: count,
        title: `${fullLabels[i]}: ${count}`
      }));
    } else {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const counts = [0, 0, 0, 0];
      
      transactions.forEach(t => {
        const d = new Date(t.tanggal_pengajuan);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          const date = d.getDate();
          let week = Math.floor((date - 1) / 7);
          if (week > 3) week = 3;
          counts[week]++;
        }
      });
      
      const maxCount = Math.max(...counts, 5);
      return counts.map((count, i) => ({
        label: `MG ${i + 1}`,
        height: `${(count / maxCount) * 100}%`,
        value: count,
        title: `Minggu ${i + 1}: ${count}`
      }));
    }
  };

  const barChartData = generateChartData(allTransactions, activeSelect);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };




  const formatNOP = (nopStr) => {
    if (!nopStr || nopStr.includes('...')) {
      return <span className="italic text-gray-500 font-normal text-xs bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Menunggu penetapan</span>;
    }
    const clean = nopStr.replace(/\D/g, '');
    if (clean.length === 18) {
      return `${clean.substring(0,2)}.${clean.substring(2,4)}.${clean.substring(4,7)}.${clean.substring(7,10)}.${clean.substring(10,13)}.${clean.substring(13,17)}.${clean.substring(17,18)}`;
    }
    return nopStr;
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
          <div 
            key={i} 
            {...(card.link ? { onClick: () => navigate(card.link), title: `Lihat Detail ${card.title}` } : {})}
            className={`bg-white border border-gray-200 p-6 rounded-lg relative overflow-hidden shadow-sm flex flex-col justify-between ${card.link ? 'hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group' : ''}`}
          >
            {/* Background shape */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -z-10 ${card.link ? 'group-hover:scale-110 transition-transform' : ''} ${card.badgeColor.includes('error') ? 'bg-red-50' : card.badgeColor.includes('secondary') ? 'bg-blue-50' : 'bg-gray-50'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg shadow-sm ${card.bgIcon.replace('bg-surface-container text-primary', 'bg-blue-100 text-blue-700').replace('bg-error-container text-error', 'bg-red-100 text-red-700')}`}>
                <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
              </div>
              {card.badgeText && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${card.badgeColor.includes('error') ? 'text-red-700 bg-red-50 border-red-200' : card.badgeColor.includes('secondary') ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-gray-700 bg-gray-100 border-gray-200'}`}>
                  {card.badgeText}
                </span>
              )}
              {card.progress !== undefined && (
                <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden self-center">
                  <div className="h-full bg-green-500" style={{ width: `${card.progress}%` }}></div>
                </div>
              )}
            </div>
            <p className="text-on-surface-variant font-label-md font-bold mb-1 uppercase tracking-wide text-xs mt-2">
              {card.title}
            </p>
            <h2 className="text-4xl font-extrabold text-on-surface">{card.value}</h2>
            <div className="flex justify-between items-end mt-2">
              <p className="text-[11px] text-gray-500 italic">{card.meta}</p>
              {card.link && (
                <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  <span className="text-[10px] font-bold mr-1">Lihat Detail</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              )}
            </div>
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
                Statistik Pengajuan SPOP
              </h3>
              <p className="text-on-surface-variant text-sm">Ringkasan jumlah pengajuan yang masuk</p>
            </div>
            <select
              value={activeSelect}
              onChange={(e) => setActiveSelect(e.target.value)}
              className="bg-white text-sm text-gray-700 border border-gray-300 rounded px-3 py-1.5 pr-8 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option>Minggu</option>
              <option>Bulan</option>
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
              Riwayat Pengajuan Terkini
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">Daftar pengajuan SPOP terbaru yang masuk ke sistem</p>
          </div>
          <button
            onClick={() => navigate('/riwayat-persetujuan')}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            <span>Lihat Semua</span>
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
                <th className="px-6 py-4 font-bold border-b border-outline-variant whitespace-nowrap">
                  Jenis Layanan
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
                  <td colSpan="7" className="text-center py-12 text-on-surface-variant flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
                    <span>Memuat data pengajuan...</span>
                  </td>
                </tr>
              ) : activities.length > 0 ? (
                activities.map((act, i) => (
                  <tr key={i} className={`hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? 'bg-surface-container-low/20' : ''}`}>
                    <td className="px-6 py-4 font-data-mono text-primary font-bold whitespace-nowrap text-sm">
                      {formatNOP(act.nop)}
                    </td>
                    <td className="px-6 py-4 font-label-md font-bold text-on-background whitespace-nowrap">
                      {act.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                      {act.district}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-on-surface-variant whitespace-nowrap">
                      {act.jenis_layanan}
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
                  <td colSpan="7" className="text-center py-12 text-on-surface-variant">
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
