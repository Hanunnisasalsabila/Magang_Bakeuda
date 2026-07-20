import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import StatusBadge from '../components/StatusBadge';

export default function RiwayatSPOP() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/transaksi-spop');
      // Filter out DRAFT, we only want submitted applications
      const submitted = (response.data.data || []).filter(item => item.status_ajuan !== 'DRAFT');
      setHistory(submitted);
    } catch (error) {
      console.error('Error fetching history:', error);
      showToast('Gagal memuat data riwayat.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleTrack = (id) => {
    // For now we map to the dummy tracking page
    navigate(`/pelacakan-dokumen`);
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
        <h1 className="text-display-sm font-bold text-primary mb-2">Riwayat Pengajuan SPOP</h1>
        <p className="text-on-surface-variant font-label-md">Pantau status pengajuan SPOP yang telah Anda kirimkan ke Bakeuda.</p>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
          <h2 className="font-bold text-on-surface">Daftar Riwayat</h2>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="material-symbols-outlined animate-spin text-[40px] text-primary">autorenew</span>
              <p className="text-primary font-bold">Memuat Data...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">history</span>
              <h3 className="font-bold text-xl text-on-surface mb-2">Tidak ada Riwayat</h3>
              <p className="text-on-surface-variant text-sm max-w-sm">Anda belum memiliki pengajuan SPOP yang dikirim ke Bakeuda.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface text-sm uppercase tracking-wide border-b border-outline-variant">
                  <th className="p-4 font-bold">No</th>
                  <th className="p-4 font-bold">Jenis Layanan</th>
                  <th className="p-4 font-bold">Subjek Pajak</th>
                  <th className="p-4 font-bold">Diajukan Pada</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {history.map((item, idx) => (
                  <tr key={item.id_transaksi} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 text-sm font-medium">{idx + 1}</td>
                    <td className="p-4 text-sm font-semibold">{item.jenis_transaksi?.replace('_', ' ')}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-on-surface">{item.nama_pengaju || 'Belum Diisi'}</p>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status_ajuan} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleTrack(item.id_transaksi)}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          Lacak
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
