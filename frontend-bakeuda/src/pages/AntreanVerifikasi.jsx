import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';

export default function AntreanVerifikasi() {
  const navigate = useNavigate();
  const [kecamatan, setKecamatan] = useState('Semua Kecamatan');
  const [kelurahan, setKelurahan] = useState('Semua Desa');
  const [search, setSearch] = useState('');

  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [allWilayah, setAllWilayah] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (allWilayah.length === 0) return;
    if (kecamatan === 'Semua Kecamatan') {
      const uniqueKel = [...new Set(allWilayah.map(w => w.nama_desa))].filter(Boolean).sort();
      setKelurahanList(uniqueKel);
    } else {
      const filteredKel = allWilayah
        .filter(w => w.kecamatan === kecamatan)
        .map(w => w.nama_desa)
        .filter(Boolean)
        .sort();
      setKelurahanList(filteredKel);
    }
    setKelurahan('Semua Desa');
  }, [kecamatan, allWilayah]);

  useEffect(() => {
    const fetchKecamatan = async () => {
      try {
        const res = await api.get('/wilayah');
        const data = res.data.data;
        setAllWilayah(data);
        const uniqueKec = [...new Set(data.map(w => w.kecamatan))].filter(Boolean).sort();
        setKecamatanList(uniqueKec);
      } catch (err) {
        console.error("Gagal mengambil data wilayah:", err);
      }
    };
    fetchKecamatan();

    const fetchQueue = async () => {
      try {
        const [resMenunggu, resProses] = await Promise.all([
          api.get('/transaksi-spop?status_ajuan=MENUNGGU'),
          api.get('/transaksi-spop?status_ajuan=PROSES')
        ]);
        const allData = [...resMenunggu.data.data, ...resProses.data.data];

        const userStr = localStorage.getItem('user');
        let myId = null;
        if (userStr) {
          try { myId = JSON.parse(userStr).id; } catch (e) {}
        }

        const formatted = allData.map(item => {
          let details = [];
          if (item.jenis_transaksi === 'HAPUS' && item.detail_asal?.length > 0) {
            details = item.detail_asal.map(d => ({
              nop: d.nop_asal || '..................',
              name: d.objek_asal?.subjek_pajak?.nama_subjek || item.pengaju?.nama_lengkap || item.nama_pengaju || 'Tanpa Nama',
              address: d.objek_asal?.subjek_pajak?.alamat_jalan || d.objek_asal?.jalan_op || '-',
              kelurahan: d.objek_asal?.wilayah?.nama_desa || '-',
              kecamatan: d.objek_asal?.wilayah?.kecamatan || '-'
            }));
          } else if (item.detail_tujuan?.length > 0) {
            details = item.detail_tujuan.map(d => ({
              nop: d.nop_generated || '..................',
              name: d.calon_subjek_json?.nama_subjek && d.calon_subjek_json?.nama_subjek.toUpperCase() !== 'TANPA NAMA' ? d.calon_subjek_json?.nama_subjek : (item.pengaju?.nama_lengkap || item.nama_pengaju || 'Tanpa Nama'),
              address: d.jalan_op_baru || d.jenis_tanah_baru?.replace('_', ' ') || '-',
              kelurahan: d.kelurahan_op_baru || '-',
              kecamatan: d.kecamatan_op_baru || '-'
            }));
          } else {
            details = [{
              nop: '..................',
              name: item.pengaju?.nama_lengkap || item.nama_pengaju || 'Tanpa Nama',
              address: '-', kelurahan: '-', kecamatan: '-'
            }];
          }

          let jenisLayanan = item.jenis_transaksi ? item.jenis_transaksi.replace(/_/g, ' ') : '-';

          // Tentukan status badge dan aksi
          let badgeStatus = 'Menunggu Verifikasi';
          let isLockedByMe = false;
          let isLockedByOther = false;
          let lockedByName = '';

          if (item.status_ajuan === 'PROSES') {
            if (item.locked_by === myId) {
              badgeStatus = 'Sedang Anda Verifikasi';
              isLockedByMe = true;
            } else {
              lockedByName = item.reviewer?.nama_lengkap || 'Admin Lain';
              badgeStatus = `Sedang diverifikasi oleh ${lockedByName}`;
              isLockedByOther = true;
            }
          }

          return {
            id: item.id_transaksi,
            details: details,
            nopList: details.map(d => d.nop).join(', '),
            name: details.map(d => d.name).join(', '),
            userId: item.pengaju?.nama_lengkap ? `Pengaju: ${item.pengaju.nama_lengkap}` : '-',
            jenisLayanan: jenisLayanan,
            address: details.map(d => d.address).join(', '),
            rtRw: '',
            kelurahan: details[0]?.kelurahan || '-',
            kecamatan: details[0]?.kecamatan || '-',
            date: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(item.tanggal_pengajuan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            status: badgeStatus,
            isLockedByMe,
            isLockedByOther,
            lockedByName,
            rawStatus: item.status_ajuan,
            urgent: false
          };
        });

        formatted.sort((a, b) => new Date(b.date) - new Date(a.date));
        setQueueData(formatted);
      } catch (error) {
        console.error("Gagal mengambil antrean:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueue();
    const intervalId = setInterval(fetchQueue, 15000); // Polling tiap 15 detik
    return () => clearInterval(intervalId);
  }, []);

  const handleUnlock = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin melepas kunci verifikasi admin lain?")) return;
    try {
      await api.patch(`/transaksi-spop/${id}/unlock`);
      // Force refresh data
      setQueueData(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, status: 'Menunggu Verifikasi', isLockedByOther: false, isLockedByMe: false, rawStatus: 'MENUNGGU' };
        }
        return item;
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal melepas kunci.');
    }
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredData = queueData.filter((item) => {
    const matchesKec = kecamatan === 'Semua Kecamatan' || (item.kecamatan || '').trim().toLowerCase() === kecamatan.trim().toLowerCase();
    const matchesKel = kelurahan === 'Semua Desa' || (item.kelurahan || '').trim().toLowerCase() === kelurahan.trim().toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.address.toLowerCase().includes(search.toLowerCase()) ||
      item.nopList.toLowerCase().includes(search.toLowerCase());
    return matchesKec && matchesKel && matchesSearch;
  });

  const formatNOP = (nopRaw, type, status) => {
    if ((!nopRaw || nopRaw.includes('...') || type === 'BARU' || type === 'PECAH' || type === 'GABUNG') && status !== 'DISETUJUI') {
      return <span className="italic text-gray-500 font-normal text-xs bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">Menunggu penetapan</span>;
    }
    const clean = nopRaw.replace(/\D/g, '');
    if (clean.length === 18) {
      return `${clean.substring(0,2)}.${clean.substring(2,4)}.${clean.substring(4,7)}.${clean.substring(7,10)}.${clean.substring(10,13)}.${clean.substring(13,17)}.${clean.substring(17,18)}`;
    }
    return nopRaw;
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="p-gutter overflow-y-auto max-w-screen-2xl mx-auto w-full">
      {/* Breadcrumbs & Header */}
      <div className="mb-section-gap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl text-primary font-bold">Antrean Berkas Masuk</h1>
            <p className="text-sm font-body-md text-on-surface-variant mt-1">
              Daftar berkas SPOP yang baru dikirimkan oleh desa dan menunggu untuk Anda periksa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-sm text-label-sm flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
              {filteredData.length} Menunggu Verifikasi
            </span>
          </div>
        </div>
      </div>


      {/* Filters & Search */}
      <section className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="space-y-1.5 flex-1 w-full">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Cari NOP/Subjek Pajak
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full bg-background border border-outline-variant rounded-lg h-10 px-3 pl-10 text-sm focus:ring-primary focus:border-primary text-on-surface"
                  placeholder="Masukkan NOP atau Nama..."
                />
              </div>
            </div>
            <div className="space-y-1.5 w-full sm:w-[220px] shrink-0">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Kecamatan
              </label>
              <select
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                className="w-full bg-background border border-outline-variant rounded-lg h-10 px-3 text-sm focus:ring-primary focus:border-primary text-on-surface"
              >
                <option value="Semua Kecamatan">Semua Kecamatan</option>
                {kecamatanList.map(kec => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 w-full sm:w-[220px] shrink-0">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Kelurahan/Desa
              </label>
              <select
                value={kelurahan}
                onChange={(e) => setKelurahan(e.target.value)}
                className="w-full bg-background border border-outline-variant rounded-lg h-10 px-3 text-sm focus:ring-primary focus:border-primary text-on-surface"
              >
                <option value="Semua Desa">Semua Desa</option>
                {kelurahanList.map(kel => (
                  <option key={kel} value={kel}>{kel}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => {
              setKecamatan('Semua Kecamatan');
              setKelurahan('Semua Desa');
              setSearch('');
            }}
            className="bg-white border border-gray-300 rounded-lg px-5 h-10 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors focus:outline-none shadow-sm flex items-center justify-center gap-2 shrink-0 w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Reset Filter
          </button>
        </div>
      </section>

      {/* Data Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                <th className="px-6 py-3 font-bold border-b border-outline-variant">No</th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant w-[15%]">NOP</th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant w-[20%]">Subjek Pajak</th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant w-[15%]">Jenis Layanan</th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant w-[20%]">Alamat Objek</th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant w-[15%]">Desa/Kelurahan</th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant w-[15%]">Tanggal Kirim</th>
                <th className="px-6 py-3 font-bold border-b border-outline-variant text-center w-[10%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-on-surface-variant">
                    Memuat antrean...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.urgent
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-on-surface">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-3">
                        {item.details.map((d, dIdx) => (
                          <div key={dIdx} className="h-10 flex items-center relative">
                            {dIdx > 0 && <div className="absolute -top-1.5 left-0 right-0 h-px bg-outline-variant/40" />}
                            <div className="font-mono text-sm font-bold text-primary whitespace-nowrap">
                              {formatNOP(d.nop, item.jenisLayanan, item.rawStatus)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-3">
                        {item.details.map((d, dIdx) => (
                          <div key={dIdx} className="h-10 flex flex-col justify-center relative">
                            {dIdx > 0 && <div className="absolute -top-1.5 left-0 right-0 h-px bg-outline-variant/40" />}
                            <p className="font-bold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]" title={d.name}>{d.name}</p>
                            {dIdx === 0 && <p className="text-[11px] leading-tight text-on-surface-variant truncate w-full max-w-[200px]" title={item.userId}>{item.userId}</p>}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="font-bold text-on-surface-variant text-sm whitespace-nowrap mt-1 inline-block">{item.jenisLayanan}</span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-3">
                        {item.details.map((d, dIdx) => (
                          <div key={dIdx} className="h-10 flex items-center relative">
                            {dIdx > 0 && <div className="absolute -top-1.5 left-0 right-0 h-px bg-outline-variant/40" />}
                            <p className="text-on-surface text-sm overflow-hidden text-ellipsis max-w-[180px]" title={d.address}>{d.address}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="text-on-surface uppercase font-semibold text-xs mt-1.5 inline-block">{item.kecamatan} / {item.kelurahan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-on-surface ${item.urgent ? 'font-bold' : ''}`}>{item.date}</p>
                      <p className={`text-[12px] ${item.urgent ? 'text-red-600' : 'text-on-surface-variant'}`}>{item.time}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        {item.isLockedByOther ? (
                          <>
                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 whitespace-nowrap">
                              🔒 {item.status}
                            </span>
                            <button
                              onClick={() => handleUnlock(item.id)}
                              className="text-[10px] text-red-600 hover:text-red-800 underline font-semibold flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">lock_open</span>
                              Lepas Kunci
                            </button>
                          </>
                        ) : (
                          <>
                            {item.isLockedByMe && (
                              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 whitespace-nowrap">
                                🔵 Sedang Anda Verifikasi
                              </span>
                            )}
                            <button
                              onClick={() => navigate('/detail-review/' + item.id)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm w-full whitespace-nowrap ${
                                item.isLockedByMe 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {item.isLockedByMe ? 'Lanjut Verifikasi' : 'Periksa Berkas'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-on-surface-variant">
                    Tidak ada antrean verifikasi yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-on-surface-variant w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="font-semibold whitespace-nowrap">Tampilkan:</label>
                <div className="relative">
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ backgroundImage: 'none' }}
                    className="pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-gray-700 font-bold text-sm shadow-sm outline-none appearance-none cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <div>
                Menampilkan <span className="font-bold text-on-surface">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-on-surface">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari <span className="font-bold text-on-surface">{filteredData.length}</span> entri
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = currentPage;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${
                      currentPage === pageNum 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
