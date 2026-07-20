import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import StatusBadge from '../components/StatusBadge';

export default function DraftSPOP() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus Draft ini? Seluruh data form yang tersimpan akan dihapus permanen dan tidak dapat dikembalikan.')) return;
    
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
    navigate(`/formulir-spop/${id}`);
  };

  return (
    <main className="p-gutter max-w-screen-xl mx-auto w-full relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn ${
          toast.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-primary mb-2">Draft Pengajuan SPOP</h1>
        <p className="text-on-surface-variant font-label-md">Kelola pengajuan SPOP Anda yang belum selesai diajukan (masih berstatus draft).</p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <h2 className="font-bold text-on-surface">Daftar Draft Saya</h2>
          <button 
            onClick={() => navigate('/formulir-spop')}
            className="bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Buat Baru
          </button>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface text-sm uppercase tracking-wide border-b border-outline-variant">
                  <th className="p-4 font-bold">No</th>
                  <th className="p-4 font-bold">Jenis Layanan</th>
                  <th className="p-4 font-bold">Subjek Pajak</th>
                  <th className="p-4 font-bold">Dibuat Pada</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {drafts.map((draft, idx) => (
                  <tr key={draft.id_transaksi} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 text-sm font-medium">{idx + 1}</td>
                    <td className="p-4 text-sm font-semibold">{draft.jenis_transaksi?.replace('_', ' ')}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-on-surface">{draft.nama_pengaju || 'Belum Diisi'}</p>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {new Date(draft.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={draft.status_ajuan} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(draft.id_transaksi)}
                          className="w-8 h-8 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-colors"
                          title="Lanjutkan Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(draft.id_transaksi)}
                          className="w-8 h-8 rounded-full bg-error/10 text-error hover:bg-error hover:text-white flex items-center justify-center transition-colors"
                          title="Hapus Draft"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
