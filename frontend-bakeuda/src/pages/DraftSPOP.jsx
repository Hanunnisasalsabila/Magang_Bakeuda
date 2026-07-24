import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useSpop } from '../context/SpopContext';
import api from '../utils/axios';
import StatusBadge from '../components/StatusBadge';

export default function DraftSPOP() {
  const navigate = useNavigate();
  const { loadDraft } = useSpop();
  const [drafts, setDrafts] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/transaksi-spop?status_ajuan=DRAFT');
      setDrafts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      showToast('Gagal memuat data draft.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    if (!id) return;

    try {
      await api.delete(`/transaksi-spop/${id}`);
      showToast('Draft berhasil dihapus.', 'success');
      fetchDrafts();
    } catch (error) {
      console.error('Error deleting draft:', error);
      showToast('Gagal menghapus draft.', 'error');
    }
  };

  const handleEdit = (id) => {
    navigate(`/spop/informasi-umum/${id}`);
  };

  const sortedDrafts = [...drafts].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedDrafts.length / itemsPerPage);
  const paginatedDrafts = sortedDrafts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="p-gutter max-w-screen-xl mx-auto w-full relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn ${toast.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
          }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-1">Draft Pengajuan SPOP</h1>
        <p className="text-on-surface-variant text-sm">Kelola pengajuan SPOP Anda yang belum selesai diajukan (masih berstatus draft).</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Daftar Draft Saya</h2>
          <button
            onClick={() => {
              loadDraft(null);
              navigate('/spop');
            }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Buat Baru
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="material-symbols-outlined animate-spin text-[40px] text-primary">autorenew</span>
              <p className="text-primary font-bold">Memuat Data...</p>
            </div>
          ) : drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">draft</span>
              <h3 className="font-bold text-xl text-on-surface mb-2">Tidak ada Draft</h3>
              <p className="text-on-surface-variant text-sm max-w-sm">Anda belum memiliki pengajuan SPOP yang tersimpan sebagai draft.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider w-16 text-center">No</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jenis Layanan</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Identitas (Nama / NOP)</th>
                  <th
                    className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                    title={sortOrder === 'newest' ? 'Urutkan Terlama ke Terbaru' : 'Urutkan Terbaru ke Terlama'}
                  >
                    <div className="flex items-center gap-1">
                      Dibuat Pada
                      <span className="material-symbols-outlined text-[14px]">
                        {sortOrder === 'newest' ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {paginatedDrafts.map((draft, idx) => (
                  <tr 
                    key={draft.id_transaksi} 
                    className={`hover:bg-surface-container-low transition-colors ${idx % 2 === 1 ? 'bg-surface-container-low/20' : ''}`}
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{draft.jenis_transaksi?.replace('_', ' ')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {draft.nama_pengaju || 'Nama Belum Diisi'}
                        </span>
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit border border-gray-200">
                          {draft.jenis_transaksi === 'BARU'
                            ? (draft.detail_tujuan?.[0]?.nik_calon_subjek ? `NIK: ${draft.detail_tujuan[0].nik_calon_subjek}` : 'SPOP Baru (NOP dari Bakeuda)')
                            : (draft.detail_tujuan?.[0]?.nop_generated || draft.detail_asal?.[0]?.nop_asal || draft.nop_bersama || draft.no_sppt_lama || 'NOP Belum Diisi')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(draft.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={draft.status_ajuan} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(draft.id_transaksi)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                          title="Lanjutkan Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(draft.id_transaksi)}
                          className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                          title="Hapus Draft"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {drafts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 text-sm">
            <div className="flex items-center gap-4 text-on-surface-variant w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Tampilkan</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-on-surface cursor-pointer appearance-none"
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
                Menampilkan <span className="font-bold text-on-surface">{drafts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, drafts.length)}</span> dari{' '}
                <span className="font-bold text-on-surface">{drafts.length}</span> data
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman Sebelumnya"
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
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-all ${currentPage === pageNum
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman Berikutnya"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirm({ show: false, id: null })}></div>
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200 border border-outline-variant/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">delete_forever</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">Hapus Draft?</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Seluruh data form yang tersimpan akan dihapus permanen dan tidak dapat dikembalikan.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="flex-1 py-2.5 bg-surface-container-low text-on-surface hover:bg-surface-container-high font-bold rounded-lg transition-colors border border-outline-variant"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-error text-white hover:bg-error/90 font-bold rounded-lg transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
