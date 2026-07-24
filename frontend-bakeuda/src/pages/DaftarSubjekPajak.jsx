import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

export default function DaftarSubjekPajak() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/subjek-pajak');
        const dataList = res.data.data || res.data;
        const formattedList = Array.isArray(dataList) ? dataList.map(item => ({
          nik: item.nik,
          name: item.nama_subjek || 'Tanpa Nama',
          status_wp: item.status_wp || '-',
          address: item.alamat_jalan || '-',
          rt_rw: (item.rt || item.rw) ? `RT ${item.rt || '-'} / RW ${item.rw || '-'}` : '',
          desa: item.wilayah?.nama_desa || '',
        })) : [];


        setSubjects(formattedList);
      } catch (err) {
        console.error("Gagal memuat data subjek pajak:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSubjects = subjects.filter((obj) => {
    const matchesSearch =
      obj.name.toLowerCase().includes(search.toLowerCase()) ||
      obj.nik.includes(search) ||
      obj.address.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'ALL' || obj.status_wp?.toUpperCase() === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  filteredSubjects.sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  // Pagination Logic
  const totalItems = filteredSubjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);
  
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PEMILIK': return 'bg-green-50 text-green-700 border-green-200';
      case 'PENYEWA': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PENGELOLA': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PEMAKAI': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'SENGKETA': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <main className="p-gutter max-w-screen-xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl text-primary font-bold mb-1">Daftar Subjek Pajak</h1>
          <p className="text-on-surface-variant text-sm">
            Lihat seluruh daftar Subjek Pajak yang tercatat di Kabupaten Purbalingga.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row gap-4 justify-between items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Cari Nama/NIK/Alamat</label>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Ketik kata kunci..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="flex-1 sm:flex-none pl-3 pr-8 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="PEMILIK">Pemilik</option>
                  <option value="PENYEWA">Penyewa</option>
                  <option value="PENGELOLA">Pengelola</option>
                  <option value="PEMAKAI">Pemakai</option>
                  <option value="SENGKETA">Sengketa</option>
                </select>


                <button
                  onClick={() => { setSearch(''); setStatusFilter('ALL'); setSortOrder('asc'); setCurrentPage(1); }}
                  title="Reset Filter & Pencarian"
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border bg-surface-container-low border-outline-variant text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-primary">
              <span className="material-symbols-outlined animate-spin text-4xl mb-4">autorenew</span>
              <p className="font-bold animate-pulse">Memuat Data...</p>
            </div>
          ) : paginatedSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant text-center px-4">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <p className="font-bold text-lg mb-1 text-on-surface">Data Tidak Ditemukan</p>
              <p className="text-sm">Tidak ada subjek pajak yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider w-16 text-center">No</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIK</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Subjek Pajak</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status WP</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alamat</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {paginatedSubjects.map((obj, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? 'bg-surface-container-low/20' : ''
                      }`}
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {startIndex + i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-800">{obj.nik}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{obj.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 border rounded text-[11px] font-semibold tracking-wide uppercase ${getStatusColor(obj.status_wp)}`}>
                        {obj.status_wp}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-800 truncate max-w-[250px]">{obj.address}</p>
                      {obj.rt_rw && <p className="text-xs text-gray-500 mt-0.5">{obj.rt_rw} {obj.desa ? `- ${obj.desa}` : ''}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          if (!obj.nik || obj.nik.trim() === '') {
                            alert('Subjek pajak ini tidak memiliki NIK sehingga detail tidak dapat ditampilkan.');
                          } else {
                            // Use query parameter to safely pass ANY weird string from Oracle (like '.' or slashes)
                            navigate(`/detail-subjek?nik=${encodeURIComponent(obj.nik)}`);
                          }
                        }}
                        title={!obj.nik || obj.nik.trim() === '' ? 'NIK Kosong' : 'Detail Subjek'}
                        disabled={!obj.nik || obj.nik.trim() === ''}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none mx-auto ${
                          !obj.nik || obj.nik.trim() === ''
                            ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-background border border-outline-variant text-primary hover:bg-surface-container-lowest hover:border-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer / Pagination */}
        {!loading && filteredSubjects.length > 0 && (
          <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-on-surface-variant w-full sm:w-auto justify-between sm:justify-start">
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
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="hidden sm:inline">data</span>
              </div>
              <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
              <div>
                Total <span className="font-bold text-on-surface">{totalItems}</span> data
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || totalItems === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              {Array.from({ length: Math.min(5, totalPages > 0 ? totalPages : 1) }, (_, i) => {
                let pageNum = currentPage;
                const safeTotalPages = totalPages > 0 ? totalPages : 1;

                if (safeTotalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= safeTotalPages - 2) pageNum = safeTotalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${currentPage === pageNum
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
                disabled={currentPage === totalPages || totalItems === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
