import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';
import ToastNotification from '../../components/ToastNotification';
import api from '../../utils/axios';

export default function SpopDetail() {
  const { spopData, completionStatus, idTransaksi, loading, formData } = useSpop();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  if (loading || !idTransaksi) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/transaksi-spop/${idTransaksi}`);
      setToast({ show: true, message: 'Pengajuan berhasil dihapus.', type: 'success' });
      setTimeout(() => navigate('/monitoring-pajak'), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal menghapus pengajuan.';
      setToast({ show: true, message: errorMsg, type: 'error' });
      setShowDeleteModal(false);
      setIsDeleting(false);
    }
  };

  const steps = [
    { name: 'Subjek Pajak', isComplete: completionStatus[2], path: `/spop/subjek-pajak/${idTransaksi}` },
    { name: 'Informasi Umum', isComplete: completionStatus[1], path: `/spop/informasi-umum/${idTransaksi}` },
    { name: 'Objek Pajak', isComplete: completionStatus[3], path: `/spop/objek-pajak/${idTransaksi}` },
  ];

  const isFull = completionStatus[1] && completionStatus[2] && completionStatus[3];
  const isDraft = spopData?.status_ajuan === 'DRAFT';

  // Build display data from spopData or formData
  const detailTujuan = spopData?.detail_tujuan?.[0] || {};
  const calonSubjek = detailTujuan?.calon_subjek_json || {};
  const namaSubjek = calonSubjek?.nama || formData?.nama || '-';
  const nikSubjek = calonSubjek?.nik || formData?.nik || '-';
  const nopDisplay = detailTujuan?.nop_generated || 'Menunggu NOP dari Bakeuda';
  const alamatObjek = [
    detailTujuan?.jalan_op_baru || formData?.alamatObjek,
    detailTujuan?.rt_op_baru ? `RT ${detailTujuan.rt_op_baru}` : (formData?.rtObjek ? `RT ${formData.rtObjek}` : ''),
    detailTujuan?.rw_op_baru ? `RW ${detailTujuan.rw_op_baru}` : (formData?.rwObjek ? `RW ${formData.rwObjek}` : ''),
    detailTujuan?.kelurahan_op_baru || formData?.kelurahanObjek,
  ].filter(Boolean).join(' ') || '-';
  const luasTanah = detailTujuan?.luas_tanah_baru || formData?.luasTanah || '-';
  const luasBangunan = detailTujuan?.luas_bangunan_baru || formData?.luasBangunan || '-';

  const statusLabel = {
    DRAFT: 'Draft',
    MENUNGGU: 'Menunggu Verifikasi',
    PROSES: 'Diproses',
    DISETUJUI: 'Disetujui',
    REVISI: 'Perlu Revisi',
    DITOLAK: 'Ditolak',
  }[spopData?.status_ajuan] || 'Draft';

  const statusColor = {
    Draft: 'bg-gray-100 text-gray-600',
    'Menunggu Verifikasi': 'bg-yellow-100 text-yellow-700',
    Diproses: 'bg-blue-100 text-blue-700',
    Disetujui: 'bg-green-100 text-green-700',
    'Perlu Revisi': 'bg-orange-100 text-orange-700',
    Ditolak: 'bg-red-100 text-red-700',
  }[statusLabel] || 'bg-gray-100 text-gray-600';

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast.show && (
        <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'success' })} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-blue-900 font-bold text-2xl">Detail Pengajuan SPOP</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            ID: <span className="font-mono font-bold">{idTransaksi}</span> &bull; Jenis: <span className="font-bold">{spopData?.jenis_transaksi || '-'}</span>
          </p>
        </div>
        <span className={`self-start px-4 py-1.5 rounded-full text-xs font-bold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Step Completion Status */}
      <div className="grid grid-cols-3 gap-3">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => navigate(step.path)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center hover:shadow-md ${
              step.isComplete
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary/30'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] mb-1 ${step.isComplete ? 'text-green-600' : 'text-on-surface-variant'}`}>
              {step.isComplete ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <span className="text-xs font-bold">{step.name}</span>
            <span className="text-[10px] mt-0.5">{step.isComplete ? 'Selesai' : 'Belum diisi'}</span>
          </button>
        ))}
      </div>

      {/* Data Table — mirip Pemantauan PBB-P2 */}
      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant font-bold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 border-b border-outline-variant whitespace-nowrap">NOP</th>
                <th className="px-4 py-3 border-b border-outline-variant whitespace-nowrap">Subjek Pajak</th>
                <th className="px-4 py-3 border-b border-outline-variant whitespace-nowrap">Alamat Objek</th>
                <th className="px-4 py-3 border-b border-outline-variant text-center whitespace-nowrap">Tanah (m²)</th>
                <th className="px-4 py-3 border-b border-outline-variant text-center whitespace-nowrap">Bgn (m²)</th>
                <th className="px-4 py-3 border-b border-outline-variant text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-3 border-b border-outline-variant text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(namaSubjek === '-' && alamatObjek === '-' && !isFull) ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-on-surface-variant text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-outline">edit_note</span>
                      <p className="font-medium">Belum ada data yang diisi.</p>
                      <p className="text-xs">Mulai dengan mengisi formulir Subjek Pajak atau Informasi Umum di atas.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-bold text-on-surface">{nopDisplay}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-sm text-on-surface">{namaSubjek}</p>
                    <p className="text-xs text-on-surface-variant">{nikSubjek !== '-' ? `NIK: ${nikSubjek}` : ''}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface max-w-xs">{alamatObjek}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{luasTanah !== '-' ? `${luasTanah}` : '-'}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{luasBangunan !== '-' ? `${luasBangunan}` : '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {isFull && isDraft && (
                        <button
                          onClick={() => navigate(`/spop/konfirmasi/${idTransaksi}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-bold hover:bg-primary/90 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[15px]">send</span>
                          Kirim
                        </button>
                      )}
                      {isDraft && (
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center gap-1 px-2 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-bold hover:bg-red-100 transition-colors"
                          title="Hapus pengajuan"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Konfirmasi locked or ready */}
      {isFull && isDraft && (
        <div className="border border-primary/20 bg-primary/5 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              <h4 className="font-bold text-on-surface">Semua Data Sudah Lengkap</h4>
            </div>
            <p className="text-sm text-on-surface-variant">Tinjau kembali data Anda lalu finalisasi pengajuan SPOP ke Bakeuda.</p>
          </div>
          <button
            onClick={() => navigate(`/spop/konfirmasi/${idTransaksi}`)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all whitespace-nowrap"
          >
            Lanjutkan ke Konfirmasi
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 text-error mb-4">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-lg font-bold">Hapus Pengajuan SPOP?</h3>
            </div>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Yakin ingin menghapus seluruh pengajuan ini? Semua data akan terhapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg font-bold bg-error text-white hover:bg-error/90 transition-colors flex items-center gap-2"
              >
                {isDeleting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : null}
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
