import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const STATUS_FILTER = [
  { value: 'SEMUA', label: 'Semua', icon: 'list_alt', color: 'text-primary bg-primary/10 border-primary/20' },
  { value: 'DISETUJUI', label: 'Disetujui', icon: 'check_circle', color: 'text-green-700 bg-green-50 border-green-200' },
  { value: 'DITOLAK', label: 'Ditolak', icon: 'cancel', color: 'text-red-700 bg-red-50 border-red-200' },
];

function formatNOP(nopRaw) {
  if (!nopRaw) return '-';
  const parts = nopRaw.replace(/\D/g, '');
  const prov = parts.substring(0, 2) || '33';
  const kab = parts.substring(2, 4) || '03';
  const kec = parts.substring(4, 7) || '000';
  const kel = parts.substring(7, 10) || '000';
  return `${prov}.${kab}.${kec}.${kel}.000-0000.0`;
}

export default function RiwayatPersetujuan() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kecamatanList, setKecamatanList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('SEMUA');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDisetujui, resDitolak, resWilayah] = await Promise.all([
          api.get('/transaksi-spop?status_ajuan=DISETUJUI'),
          api.get('/transaksi-spop?status_ajuan=DITOLAK'),
          api.get('/wilayah'),
        ]);

        const mapItem = (item, status) => {
          const detail = item.detail_tujuan?.[0] || {};
          const nopRaw = detail.nop_generated || detail.no_persil_baru || '';
          return {
            id: item.id_transaksi,
            nop: formatNOP(nopRaw),
            namaPengaju: item.pengaju?.nama_lengkap || item.nama_pengaju || '-',
            namaDesa: detail.kelurahan_op_baru || '-',
            kecamatan: detail.kecamatan_op_baru || '-',
            reviewer: item.verifikator?.nama_lengkap || item.reviewer?.nama_lengkap || '-',
            tanggalDiajukan: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            tanggalSelesai: new Date(item.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            tanggalSelesaiRaw: new Date(item.updated_at),
            status,
          };
        };

        const combined = [
          ...(resDisetujui.data.data || []).map(i => mapItem(i, 'DISETUJUI')),
          ...(resDitolak.data.data || []).map(i => mapItem(i, 'DITOLAK')),
        ].sort((a, b) => b.tanggalSelesaiRaw - a.tanggalSelesaiRaw);

        setAllData(combined);

        const wilayahData = resWilayah.data.data || [];
        const uniqueKec = [...new Set(wilayahData.map(w => w.kecamatan))].filter(Boolean).sort();
        setKecamatanList(uniqueKec);
      } catch (err) {
        console.error('Gagal mengambil riwayat:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = allData.filter(item => {
    const matchStatus = statusFilter === 'SEMUA' || item.status === statusFilter;
    const matchSearch =
      item.namaPengaju.toLowerCase().includes(search.toLowerCase()) ||
      item.nop.toLowerCase().includes(search.toLowerCase()) ||
      item.namaDesa.toLowerCase().includes(search.toLowerCase());
    const matchKec = kecamatan ? item.kecamatan === kecamatan : true;
    return matchStatus && matchSearch && matchKec;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const countDisetujui = allData.filter(d => d.status === 'DISETUJUI').length;
  const countDitolak = allData.filter(d => d.status === 'DITOLAK').length;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-display-lg text-primary tracking-tight">Riwayat Keputusan</h1>
        <p className="text-on-surface-variant font-body-lg mt-1 opacity-80">
          Berkas SPOP yang telah mendapat keputusan akhir (disetujui atau ditolak) oleh Bakeuda.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-primary">list_alt</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Keputusan</p>
            <p className="text-xl font-bold text-gray-900">{loading ? '...' : allData.length}</p>
          </div>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-green-600">check_circle</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Disetujui</p>
            <p className="text-xl font-bold text-green-700">{loading ? '...' : countDisetujui}</p>
          </div>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm col-span-2 sm:col-span-1">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-red-500">cancel</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ditolak</p>
            <p className="text-xl font-bold text-red-600">{loading ? '...' : countDitolak}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3">
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTER.map(f => (
              <button
                key={f.value}
                onClick={() => { setStatusFilter(f.value); setCurrentPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  statusFilter === f.value ? f.color + ' shadow-sm' : 'text-gray-500 bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{f.icon}</span>
                {f.label}
                {f.value === 'DISETUJUI' && !loading && <span className="ml-0.5 font-bold">({countDisetujui})</span>}
                {f.value === 'DITOLAK' && !loading && <span className="ml-0.5 font-bold">({countDitolak})</span>}
              </button>
            ))}
          </div>

          {/* Search + Filter Kecamatan */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] group-focus-within:text-primary transition-colors">search</span>
              <input
                type="text"
                placeholder="Cari NOP, nama pengaju, atau desa..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-sm"
              />
            </div>
            <div className="relative w-full sm:w-48 shrink-0">
              <select
                value={kecamatan}
                onChange={(e) => { setKecamatan(e.target.value); setCurrentPage(1); }}
                style={{ backgroundImage: 'none' }}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary text-sm shadow-sm outline-none appearance-none cursor-pointer"
              >
                <option value="">Semua Kecamatan</option>
                {kecamatanList.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[55vh] overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-white shadow-sm outline outline-1 outline-primary/10">
              <tr className="bg-primary/5 text-primary font-medium text-xs uppercase tracking-wider border-b border-primary/20">
                <th className="py-2.5 px-3 text-center whitespace-nowrap w-8">No</th>
                <th className="py-2.5 px-3 text-left whitespace-nowrap">NOP</th>
                <th className="py-2.5 px-3 text-left whitespace-nowrap">Nama Pengaju</th>
                <th className="py-2.5 px-3 text-left whitespace-nowrap">Kecamatan</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Diproses Oleh</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Tgl Diajukan</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Tgl Selesai</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap w-10">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
                      <p className="text-gray-500 font-medium">Memuat data riwayat...</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px] text-gray-400">inbox</span>
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada data riwayat</p>
                      <p className="text-gray-400 text-xs">Keputusan Bakeuda akan muncul di sini</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/detail-review/${item.id}`)}
                  >
                    <td className="py-2.5 px-3 text-center text-gray-400 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-xs text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">{item.nop}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-medium text-gray-900 text-sm">{item.namaPengaju}</p>
                      <p className="text-xs text-gray-400">{item.namaDesa}</p>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs whitespace-nowrap">{item.kecamatan}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-xs text-gray-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">{item.reviewer}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs text-gray-400 whitespace-nowrap">{item.tanggalDiajukan}</td>
                    <td className="py-2.5 px-3 text-center text-xs text-gray-600 whitespace-nowrap">{item.tanggalSelesai}</td>
                    <td className="py-2.5 px-3 text-center">
                      {item.status === 'DISETUJUI' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          Disetujui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                          <span className="material-symbols-outlined text-[13px]">cancel</span>
                          Ditolak
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/detail-review/${item.id}`); }}
                        className="p-1 rounded text-primary hover:bg-primary/10 transition-all"
                        title="Lihat Detail"
                      >
                        <span className="material-symbols-outlined text-[17px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - always visible */}
        {!loading && (
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Tampilkan:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ backgroundImage: 'none' }}
                  className="pl-3 pr-7 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 focus:outline-none focus:border-primary appearance-none cursor-pointer shadow-sm"
                >
                  {[5, 10, 25, 50, 100].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-gray-500 pointer-events-none">expand_more</span>
              </div>
              <span className="text-gray-400">
                Menampilkan <span className="font-semibold text-gray-700">{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span>–<span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> dari <span className="font-semibold text-gray-700">{filtered.length}</span> data
              </span>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => { if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...'); acc.push(p); return acc; }, [])
                  .map((p, i) =>
                    p === '...' ? <span key={`e-${i}`} className="px-1 text-gray-400 text-xs">…</span> : (
                      <button key={p} onClick={() => handlePageChange(p)} className={`w-7 h-7 text-xs rounded font-medium transition-colors ${currentPage === p ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'}`}>{p}</button>
                    )
                  )}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
