import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';

export default function MonitoringObjekPajak() {
  const navigate = useNavigate();
  const [statusVerif, setStatusVerif] = useState('Semua Status');
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ totalDikirim: 0, disetujui: 0, perluPerbaikan: 0 });
  const [submissions, setSubmissions] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listRes] = await Promise.all([
          api.get('/transaksi-spop/stats'),
          api.get('/transaksi-spop')
        ]);
        
        setStats(statsRes.data.data);

        const rawList = listRes.data.data;
        const formattedList = rawList.map(item => {
          const detail = item.detail_tujuan?.[0];
          const calonSubjek = item.detail_tujuan?.[0]?.calon_subjek_json;
          
          let luasBangunan = Number(detail?.luas_bangunan_baru || 0);

          let status = 'Ditolak';
          if (item.status_ajuan === 'MENUNGGU') status = 'Menunggu Verifikasi';
          else if (item.status_ajuan === 'PROSES') status = 'Diproses';
          else if (item.status_ajuan === 'DISETUJUI') status = 'Disetujui';
          else if (item.status_ajuan === 'REVISI') status = 'Perlu Revisi';
          else if (item.status_ajuan === 'DRAFT') status = 'Draft';

          return {
            id: item.id_transaksi,
            nop: detail?.nop_generated || detail?.no_persil_baru || 'Menunggu NOP',
            name: (calonSubjek?.nama_subjek && calonSubjek?.nama_subjek.toUpperCase() !== 'TANPA NAMA') ? calonSubjek?.nama_subjek : (item.pengaju?.nama_lengkap || item.nama_pengaju || 'Tanpa Nama'),
            address: detail ? `${detail.jalan_op_baru || ''} ${detail.rt_op_baru ? 'RT ' + detail.rt_op_baru : ''} ${detail.rw_op_baru ? 'RW ' + detail.rw_op_baru : ''} ${detail.kelurahan_op_baru || ''}`.trim() : '-',
            land: detail?.luas_tanah_baru || 0,
            building: luasBangunan,
            status: status,
            date: new Date(item.tanggal_pengajuan).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
          };
        });

        setSubmissions(formattedList);
      } catch (err) {
        console.error("Gagal memuat data monitoring:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSubmissions = submissions.filter((obj) => {
    const matchesStatus =
      statusVerif === 'Semua Status' ||
      obj.status.toLowerCase() === statusVerif.toLowerCase() ||
      (statusVerif === 'Draft' && obj.status === 'Draft') ||
      (statusVerif === 'Disetujui' && obj.status === 'Disetujui') ||
      (statusVerif === 'Perlu Revisi' && obj.status === 'Perlu Revisi');
    
    const searchLower = search.toLowerCase();
    const matchesSearch =
      obj.name.toLowerCase().includes(searchLower) ||
      obj.nop.toLowerCase().includes(searchLower) ||
      obj.address.toLowerCase().includes(searchLower);
      
    return matchesStatus && matchesSearch;
  });

  // Pagination Logic
  const totalItems = filteredSubmissions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-blue-900 font-bold text-3xl">Pemantauan PBB-P2</h2>
          <p className="text-on-surface-variant max-w-2xl mt-1 text-sm md:text-base">
            Rekapitulasi dan pelacakan status pengajuan Pajak Bumi dan Bangunan Perdesaan dan Perkotaan (PBB-P2).
          </p>
        </div>
      </div>

      {/* Stats Overview (Clean Professional Design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Pengajuan</p>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                description
              </span>
            </div>
          </div>
          <p className="text-3xl text-on-surface font-black">
            {loading ? '...' : stats.totalDikirim.toLocaleString()}
          </p>
          <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Total SPOP yang pernah diajukan
          </p>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Disetujui</p>
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>
          <p className="text-3xl text-on-surface font-black">
            {loading ? '...' : stats.disetujui.toLocaleString()}
          </p>
          <p className="text-xs text-on-surface-variant mt-2">
            Telah diverifikasi Bakeuda
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Perlu Revisi</p>
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
            </div>
          </div>
          <p className="text-3xl text-on-surface font-black">
            {loading ? '...' : stats.perluPerbaikan.toLocaleString()}
          </p>
          <p className="text-xs text-error font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            Membutuhkan perbaikan segera
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
              Cari Nama/NOP/Alamat
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
              placeholder="Masukkan kata kunci..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
              Status Verifikasi
            </label>
            <select
              value={statusVerif}
              onChange={(e) => { setStatusVerif(e.target.value); setCurrentPage(1); }}
              className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Diproses">Diproses</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Perlu Revisi">Perlu Revisi</option>
              <option value="Draft">Draft</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              onClick={() => {
                setSearch('');
                setStatusVerif('Semua Status');
                setCurrentPage(1);
              }}
              className="w-full bg-background border border-outline-variant rounded-lg py-2 text-primary font-label-sm hover:bg-surface-container-lowest active:bg-blue-100 active:border-blue-200 transition-colors font-semibold focus:outline-none"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm flex flex-col w-full overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">NOP</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Subjek Pajak</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Alamat Objek</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center whitespace-nowrap">Tanah (m²)</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center whitespace-nowrap">Bgn (m²)</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center w-[1%] whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
                      <p className="font-medium text-sm">Memuat data monitoring...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedSubmissions.length > 0 ? (
                paginatedSubmissions.map((obj, i) => (
                  <tr key={obj.id} className="hover:bg-surface-container-low transition-colors border-b border-outline-variant/30">
                    <td className="px-4 py-3 font-data-mono font-bold text-primary text-xs whitespace-nowrap">{obj.nop}</td>
                    <td className="px-4 py-3 text-sm font-bold text-on-surface whitespace-nowrap">{obj.name}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant max-w-[200px] truncate" title={obj.address}>{obj.address}</td>
                    <td className="px-4 py-3 text-sm font-data-mono text-center">{obj.land}</td>
                    <td className="px-4 py-3 text-sm font-data-mono text-center">{obj.building}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={obj.status} />
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate((obj.status === 'Draft' || obj.status === 'Perlu Revisi') ? `/spop/informasi-umum/${obj.id}` : `/pelacakan-dokumen/${obj.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-outline-variant text-primary rounded-lg text-xs font-bold hover:bg-surface-container-lowest hover:border-primary transition-colors focus:outline-none"
                      >
                        <span className="material-symbols-outlined text-[14px]">{(obj.status === 'Draft' || obj.status === 'Perlu Revisi') ? 'edit' : 'visibility'}</span>
                        {(obj.status === 'Draft' || obj.status === 'Perlu Revisi') ? 'Edit' : 'Detail'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500">
                    Tidak ada data pengajuan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-4 text-sm text-gray-500 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Tampilkan</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-gray-900 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="hidden sm:inline">data per halaman</span>
            </div>
            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
            <div>
              Menampilkan <span className="font-bold text-gray-900">{totalItems === 0 ? 0 : startIndex + 1} - {endIndex}</span> dari{' '}
              <span className="font-bold text-gray-900">{totalItems}</span> data
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1 || totalItems === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            
            {Array.from({ length: Math.min(5, totalPages > 0 ? totalPages : 1) }, (_, i) => {
              let pageNum = safeCurrentPage;
              const safeTotalPages = totalPages > 0 ? totalPages : 1;
              if (safeTotalPages <= 5) pageNum = i + 1;
              else if (safeCurrentPage <= 3) pageNum = i + 1;
              else if (safeCurrentPage >= safeTotalPages - 2) pageNum = safeTotalPages - 4 + i;
              else pageNum = safeCurrentPage - 2 + i;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${
                    safeCurrentPage === pageNum 
                      ? 'bg-blue-900 text-white shadow-sm' 
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={safeCurrentPage === totalPages || totalItems === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Pop Up Modal (Premium & Custom Design) */}
      {selectedSubmission && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedSubmission(null)}></div>
          
          <div className="bg-surface border border-outline-variant/50 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header (Premium Gradient) */}
            <div className="p-6 border-b border-outline-variant bg-gradient-to-r from-surface-container-low to-surface flex justify-between items-start shrink-0">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    receipt_long
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-on-surface leading-tight">Detail Pengajuan SPOP</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-on-surface-variant">No. Referensi:</span>
                    <span className="text-sm font-data-mono text-primary font-bold tracking-tight bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                      {selectedSubmission.nop}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 bg-surface">
              
              {/* Status Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Status Verifikasi</p>
                    <p className="text-sm text-on-surface">Pembaruan terakhir: Hari ini, 09:41 WIB</p>
                  </div>
                </div>
                <StatusBadge status={selectedSubmission.status} />
              </div>
              
              {/* Catatan Verifikator (Muncul jika status Perlu Revisi) */}
              {selectedSubmission.status === 'Perlu Revisi' && (
                <div className="bg-error/5 border border-error/20 rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-error mb-1">Catatan dari Verifikator BKD</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      "Mohon lampirkan ulang pindai (scan) Sertifikat Tanah halaman 2, karena pada file sebelumnya terpotong dan nomor seri tidak terbaca dengan jelas. Data dimensi bangunan sudah sesuai."
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Data Utama */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                    Informasi Subjek Pajak
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Nama Lengkap</p>
                      <p className="text-base text-on-surface font-medium">{selectedSubmission.name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Alamat Objek</p>
                      <p className="text-sm text-on-surface leading-relaxed bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/50">
                        {selectedSubmission.address}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2 pt-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">real_estate_agent</span>
                    Dimensi Objek
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-[24px] mb-2 opacity-50">landscape</span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Luas Tanah</p>
                      <p className="text-lg text-primary font-bold font-data-mono mt-1">{selectedSubmission.land.toLocaleString()} <span className="text-xs text-on-surface-variant">m²</span></p>
                    </div>
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-[24px] mb-2 opacity-50">apartment</span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Luas Bgn</p>
                      <p className="text-lg text-primary font-bold font-data-mono mt-1">{selectedSubmission.building.toLocaleString()} <span className="text-xs text-on-surface-variant">m²</span></p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Riwayat (Dummy Timeline) */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                    Riwayat Pengajuan
                  </h3>
                  
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-outline-variant">
                    <div className="relative">
                      <div className="absolute -left-[30px] w-3 h-3 bg-primary rounded-full ring-4 ring-surface"></div>
                      <p className="text-xs font-bold text-on-surface-variant mb-1">Hari ini, 09:41 WIB</p>
                      <p className="text-sm font-bold text-on-surface">Pembaruan Status</p>
                      <p className="text-sm text-on-surface-variant mt-1">Status diubah menjadi <span className="font-bold text-on-surface">{selectedSubmission.status}</span> oleh Verifikator BKD.</p>
                    </div>
                    
                    <div className="relative opacity-60">
                      <div className="absolute -left-[30px] w-3 h-3 bg-outline rounded-full ring-4 ring-surface"></div>
                      <p className="text-xs font-bold text-on-surface-variant mb-1">Kemarin, 14:20 WIB</p>
                      <p className="text-sm font-bold text-on-surface">Dokumen Diverifikasi</p>
                      <p className="text-sm text-on-surface-variant mt-1">Dokumen lampiran telah divalidasi dan lengkap.</p>
                    </div>

                    <div className="relative opacity-60">
                      <div className="absolute -left-[30px] w-3 h-3 bg-outline rounded-full ring-4 ring-surface"></div>
                      <p className="text-xs font-bold text-on-surface-variant mb-1">3 Hari yang lalu</p>
                      <p className="text-sm font-bold text-on-surface">Pengajuan SPOP Dibuat</p>
                      <p className="text-sm text-on-surface-variant mt-1">Data SPOP baru dikirimkan oleh Perangkat Desa.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-outline-variant bg-surface-container-lowest flex justify-end items-center shrink-0">
              <button 
                onClick={() => setSelectedSubmission(null)} 
                className="px-6 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg shadow-sm hover:brightness-110 transition-all flex items-center gap-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
