import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

export default function DaftarSubjekPajak() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilter, setShowFilter] = useState(false);

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
    return matchesSearch;
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
            <div className="flex items-center gap-3 w-full">
              <div className="relative flex-1">
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
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border ${showFilter ? 'bg-primary text-white border-primary' : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
                {showFilter && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-outline-variant py-2 z-10">
                    <button
                      onClick={() => { setSortOrder('asc'); setShowFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${sortOrder === 'asc' ? 'text-primary font-bold' : 'text-gray-700'}`}
                    >
                      Urutkan (A-Z)
                      {sortOrder === 'asc' && <span className="material-symbols-outlined text-[18px]">check</span>}
                    </button>
                    <button
                      onClick={() => { setSortOrder('desc'); setShowFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${sortOrder === 'desc' ? 'text-primary font-bold' : 'text-gray-700'}`}
                    >
                      Urutkan (Z-A)
                      {sortOrder === 'desc' && <span className="material-symbols-outlined text-[18px]">check</span>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto min-h-[400px]">
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
                    <td className="px-4 py-3 text-center text-sm text-gray-500 font-medium">
                      {startIndex + i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-on-surface font-medium">{obj.nik}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-on-surface text-sm uppercase">{obj.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-bold tracking-wide">
                        {obj.status_wp}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-on-surface capitalize truncate max-w-[250px]">{obj.address.toLowerCase()}</p>
                      {obj.rt_rw && <p className="text-xs text-gray-500 mt-0.5">{obj.rt_rw} {obj.desa ? `- ${obj.desa}` : ''}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => navigate(`/detail-subjek/${obj.nik}`)}
                        title="Detail Subjek"
                        className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors mx-auto text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
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
