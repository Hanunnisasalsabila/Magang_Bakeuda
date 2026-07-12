import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';

export default function DashboardAdmin({ onNavigate }) {
  const [activeSelect, setActiveSelect] = useState('Minggu Ini');
  const [bentoCards, setBentoCards] = useState([
    { title: 'Pengajuan Masuk', value: '0', icon: 'inbox', badgeText: '', badgeColor: 'text-secondary', meta: 'Data SPOP periode berjalan', bgIcon: 'bg-surface-container text-primary' },
    { title: 'Menunggu Verifikasi', value: '0', icon: 'pending_actions', badgeText: 'Penting', badgeColor: 'text-error font-bold', meta: 'Butuh penanganan segera', bgIcon: 'bg-error-container text-error' },
    { title: 'Total Objek Pajak', value: '0', icon: 'location_city', badgeText: 'Total', badgeColor: 'text-on-surface-variant', meta: 'Terdaftar di database PBB', bgIcon: 'bg-surface-container text-primary' },
    { title: 'Tingkat Kepatuhan', value: '0%', icon: 'verified', progress: 0, meta: 'Verifikasi tepat waktu', bgIcon: 'bg-secondary-container text-on-secondary-container' },
  ]);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listRes] = await Promise.all([
          api.get('/transaksi-spop/stats'),
          api.get('/transaksi-spop')
        ]);
        
        const dataStats = statsRes.data.data;
        setBentoCards([
          { title: 'Pengajuan Masuk', value: dataStats.totalDikirim.toString(), icon: 'inbox', badgeText: 'Data Terbaru', badgeColor: 'text-secondary', meta: 'Data SPOP periode berjalan', bgIcon: 'bg-surface-container text-primary' },
          { title: 'Menunggu Verifikasi', value: dataStats.menunggu.toString(), icon: 'pending_actions', badgeText: 'Penting', badgeColor: 'text-error font-bold', meta: 'Butuh penanganan segera', bgIcon: 'bg-error-container text-error' },
          { title: 'Total Objek Pajak', value: dataStats.totalObjek.toString(), icon: 'location_city', badgeText: 'Total', badgeColor: 'text-on-surface-variant', meta: 'Terdaftar di database PBB', bgIcon: 'bg-surface-container text-primary' },
          { title: 'Tingkat Kepatuhan', value: `${dataStats.kepatuhan}%`, icon: 'verified', progress: dataStats.kepatuhan, meta: 'Verifikasi tepat waktu', bgIcon: 'bg-secondary-container text-on-secondary-container' },
        ]);

        const formattedList = listRes.data.data.slice(0, 5).map(item => ({
          nop: item.detail_tujuan[0]?.nop_generated || item.detail_tujuan[0]?.no_persil_baru || 'Menunggu NOP',
          name: item.nama_pengaju || 'Tanpa Nama',
          district: item.pengaju?.nama_lengkap || 'Admin Desa',
          status: item.status_ajuan === 'MENUNGGU' ? 'Verifikasi' : item.status_ajuan === 'DISETUJUI' ? 'Disetujui' : item.status_ajuan === 'REVISI' ? 'Revisi' : item.status_ajuan === 'DRAFT' ? 'Draft' : 'Ditolak',
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



  const barChartData = [
    { label: 'SEN', height: '60%', value: 120, title: 'Senin: 120' },
    { label: 'SEL', height: '80%', value: 156, title: 'Selasa: 156' },
    { label: 'RAB', height: '40%', value: 80, title: 'Rabu: 80' },
    { label: 'KAM', height: '90%', value: 190, title: 'Kamis: 190' },
    { label: 'JUM', height: '75%', value: 145, title: 'Jumat: 145' },
    { label: 'SAB', height: '20%', value: 40, title: 'Sabtu: 40' },
    { label: 'MIN', height: '10%', value: 12, title: 'Minggu: 12' },
  ];

  const verifiers = [
    {
      name: 'Budi Santoso',
      role: 'Seksi Pendaftaran - Online',
      status: 'active',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBePy93RsyxL3_uTBWrygIsQ2PxZHqQ4_7js_tq_lqhXUDRSYYwvwV6705XJim2kw0NzD1udJRX0PEYKMZ-OJQvddr-oF11CiKDCSBFUc4c-QX18tDAPfoBPNBBCExAwCuZ-sjjOJM7MhG2PLLPFg-Exz121SH04HTNJMLXS0SDZ89gLEtMLRqqYdnESFNGzMgc3wkvUQtc9xuzNU6FY1aBAVhod3hFfCDMB3p1O-xd8uwY19LmXEkQtRcK7tbtfPxQiN0dSx40xpnU'
    },
    {
      name: 'Dewi Lestari',
      role: 'Seksi Pendataan - Offline',
      status: 'offline',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYqOqbitNGL-Hkt5VKPxQwwHJG3SFiwxAKC8iifdXV9Ic_3TB4fEd-15kmqQzSsvYOoOra7kaZuolbJJLItsBPkLJJvpb_XiwIbDL_mlE28U6z76PdXbZukA4jYPV8o8-fcuay5dkJ0fGhQwhtl1_r_BFP2IqAib0_EquI6VlebEK_YcnA97OnSA5ki5Af600iuVg88hU6iHTHS_h1gVw49aTbG0Y6HuwuMyAfgEX2ebFa-_2UjIl-OgA2Znz8Znfa4IGf0kFRlwzh'
    }
  ];



  return (
    <div className="p-gutter max-w-screen-2xl mx-auto">
      {/* Paper Header banner */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-[120px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            description
          </span>
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <img
            alt="Kabupaten Purbalingga Logo"
            className="h-20 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4_biZ2Ifww0K0TImbFErSFiGKpzUwOmSFkyVTYntBZIMBAUfkSs80ZjWckjFE0ZMO64empxKuKosDHpWaQA8uT4qWXmwOmx9Eq1V7DPkKwpDrfy_nQA4wsdntyO9hhYDqg2GEIUReL3Ejdcq2DLj8BHAMZpkVZVMS33UegDg0178FP0JbVyH60ZGGxcQ_Er9gOMa3lZJasxgOjRChR3k43AbmAVnSCFqMB4Zdx3hjR-Xzx1x0k-i31VIz5eZ4Qd8Sx9jva6eQH4aj"
          />
          <div>
            <h1 className="font-display-lg text-display-lg text-primary uppercase font-extrabold">
              Badan Keuangan Daerah
            </h1>
            <p className="font-headline-md text-headline-md text-on-surface-variant -mt-1 font-semibold">
              Pemerintah Kabupaten Purbalingga
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold tracking-widest rounded">
                SISTEM INFORMASI PAJAK DAERAH
              </span>
              <span className="px-3 py-1 border border-primary text-primary text-[10px] font-bold tracking-widest rounded">
                SPOP DIGITAL V.2.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section-gap">
        {bentoCards.map((card, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.bgIcon}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              {card.badgeText && (
                <span className={`text-xs font-bold ${card.badgeColor}`}>
                  {card.badgeText}
                </span>
              )}
              {card.progress !== undefined && (
                <div className="h-2 w-16 bg-surface-container rounded-full overflow-hidden self-center">
                  <div className="h-full bg-secondary" style={{ width: `${card.progress}%` }}></div>
                </div>
              )}
            </div>
            <p className="text-on-surface-variant font-label-sm text-label-sm mb-1 uppercase tracking-wider">
              {card.title}
            </p>
            <h2 className="text-display-lg font-display-lg text-primary">{card.value}</h2>
            <p className="text-[10px] text-on-surface-variant mt-2 italic">{card.meta}</p>
          </div>
        ))}
      </div>

      {/* Main Layout: Chart and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Trend Chart Section */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Tren Pengajuan SPOP
              </h3>
              <p className="text-on-surface-variant text-sm">Statistik 7 hari terakhir</p>
            </div>
            <select
              value={activeSelect}
              onChange={(e) => setActiveSelect(e.target.value)}
              className="bg-surface text-sm border-outline-variant rounded px-3 py-1.5 focus:ring-primary focus:border-primary"
            >
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-3 px-2 relative border-b border-outline-variant pb-2">
            {/* Chart Gridlines (Visual Mock) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              <div className="border-t border-outline-variant border-dashed w-full h-0"></div>
              <div className="border-t border-outline-variant border-dashed w-full h-0"></div>
              <div className="border-t border-outline-variant border-dashed w-full h-0"></div>
              <div className="border-t border-outline-variant border-dashed w-full h-0"></div>
            </div>
            {/* Bars */}
            {barChartData.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                <div
                  className="w-full bg-primary/20 hover:bg-primary rounded-t transition-all duration-200 cursor-pointer origin-bottom"
                  style={{ height: bar.height }}
                  title={bar.title}
                />
                <span className="text-[10px] text-on-surface-variant font-bold">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verifiers active state list */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="p-gutter border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Petugas Verifikator
              </h3>
              <p className="text-on-surface-variant text-sm">Status aktif saat ini</p>
            </div>
            <div className="p-6 space-y-4">
              {verifiers.map((verifier, i) => (
                <div key={i} className={`flex items-center gap-3 ${verifier.status === 'offline' ? 'opacity-60' : ''}`}>
                  <img
                    alt={verifier.name}
                    className="w-10 h-10 rounded-full object-cover border border-outline-variant shadow-sm"
                    src={verifier.avatar}
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-primary">{verifier.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{verifier.role}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${verifier.status === 'active' ? 'bg-secondary' : 'bg-outline'}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-outline-variant bg-surface-container-low rounded-b-xl">
            <button className="w-full py-2.5 bg-primary text-on-primary rounded font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all">
              Lihat Seluruh Petugas
            </button>
          </div>
        </div>
      </div>

      {/* Activities Table Section */}
      <div className="mt-gutter bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-gutter py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-headline-md text-headline-md text-primary font-bold">
            Aktivitas Verifikasi Terakhir
          </h3>
          <button
            onClick={() => onNavigate('antrean_verifikasi')}
            className="text-primary hover:underline text-sm font-bold"
          >
            Buka Antrean
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary text-on-primary">
                <th className="px-gutter py-3 font-section-header text-section-header uppercase tracking-wider">
                  Nomor Objek Pajak (NOP)
                </th>
                <th className="px-gutter py-3 font-section-header text-section-header uppercase tracking-wider">
                  Nama Wajib Pajak
                </th>
                <th className="px-gutter py-3 font-section-header text-section-header uppercase tracking-wider">
                  Kecamatan
                </th>
                <th className="px-gutter py-3 font-section-header text-section-header uppercase tracking-wider">
                  Status
                </th>
                <th className="px-gutter py-3 font-section-header text-section-header uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-gutter py-3 font-section-header text-section-header uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-on-surface-variant">Memuat aktivitas...</td>
                </tr>
              ) : activities.length > 0 ? (
                activities.map((act, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-gutter py-4 font-data-mono text-data-mono font-bold text-on-surface">
                      {act.nop}
                    </td>
                    <td className="px-gutter py-4 text-sm text-on-surface">{act.name}</td>
                    <td className="px-gutter py-4 text-sm text-on-surface-variant">{act.district}</td>
                    <td className="px-gutter py-4">
                      <StatusBadge status={act.status} />
                    </td>
                    <td className="px-gutter py-4 text-[10px] text-on-surface-variant">{act.time}</td>
                    <td className="px-gutter py-4">
                      <button
                        onClick={() => onNavigate('detail_review')}
                        className="material-symbols-outlined text-primary hover:bg-primary/10 rounded p-1 transition-colors"
                      >
                        visibility
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-on-surface-variant">Belum ada aktivitas verifikasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => onNavigate('antrean_verifikasi')}
        className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined">fact_check</span>
      </button>
    </div>
  );
}
