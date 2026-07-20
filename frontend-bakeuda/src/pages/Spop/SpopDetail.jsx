import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';
import ToastNotification from '../../components/ToastNotification';
import api from '../../utils/axios';

export default function SpopDetail() {
  const { spopData, completionStatus, idTransaksi, loading } = useSpop();
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
      // Endpoint yang digunakan harus menghapus beserta data berelasi
      await api.delete(`/transaksi-spop/${idTransaksi}`);
      setToast({ show: true, message: 'Pengajuan berhasil dihapus.', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard-desa');
      }, 1500);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus pengajuan.';
      setToast({ show: true, message: errorMsg, type: 'error' });
      setShowDeleteModal(false);
      setIsDeleting(false);
    }
  };

  const steps = [
    {
      num: 1,
      name: 'Informasi Umum',
      isComplete: completionStatus[1],
      path: `/spop/informasi-umum/${idTransaksi}`,
      desc: 'Jenis transaksi dan informasi NOP.',
    },
    {
      num: 2,
      name: 'Subjek Pajak',
      isComplete: completionStatus[2],
      path: `/spop/subjek-pajak/${idTransaksi}`,
      desc: 'Identitas Wajib Pajak / Kuasa.',
    },
    {
      num: 3,
      name: 'Objek Pajak',
      isComplete: completionStatus[3],
      path: `/spop/objek-pajak/${idTransaksi}`,
      desc: 'Spesifikasi tanah dan lokasi geografis.',
    },
  ];

  const isFull = completionStatus[1] && completionStatus[2] && completionStatus[3];
  const isDraft = spopData?.status_ajuan === 'DRAFT';

  return (
    <div className="space-y-6 animate-fadeIn">
      {toast.show && (
        <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'success' })} />
      )}

      {/* Header Info */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Detail Pengajuan SPOP</h2>
          <p className="font-data-mono text-on-surface-variant text-sm mt-1">
            ID: {idTransaksi} | Jenis: {spopData?.jenis_transaksi || '-'}
          </p>
        </div>
        <div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
            spopData?.status_ajuan === 'DRAFT' ? 'bg-outline-variant text-on-surface-variant' :
            spopData?.status_ajuan === 'MENUNGGU' ? 'bg-secondary/20 text-secondary' :
            'bg-primary/20 text-primary'
          }`}>
            {spopData?.status_ajuan || 'DRAFT'}
          </span>
        </div>
      </div>

      {/* Step Cards */}
      <div className="grid grid-cols-1 gap-4">
        {steps.map((step) => (
          <div key={step.num} className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step.isComplete ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                {step.isComplete ? <span className="material-symbols-outlined text-[20px]">check</span> : step.num}
              </div>
              <div>
                <h3 className="font-bold text-on-surface">{step.name}</h3>
                <p className="text-sm text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate(step.path)}
              className="w-full sm:w-auto px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-bold text-primary hover:bg-surface-container transition-colors"
            >
              {step.isComplete ? 'Edit Data' : 'Lengkapi Data'}
            </button>
          </div>
        ))}
      </div>

      {/* Konfirmasi & Verifikasi - Locked or Ready */}
      <div className={`mt-8 border-t border-outline-variant pt-6 flex flex-col items-center justify-center text-center p-8 rounded-xl ${isFull ? 'bg-primary/5 border-primary/20' : 'bg-surface-container border-dashed'}`}>
        {!isFull ? (
          <>
            <span className="material-symbols-outlined text-4xl text-outline mb-2">lock</span>
            <h4 className="font-bold text-on-surface mb-1">Langkah 4 (Konfirmasi) Terkunci</h4>
            <p className="text-sm text-on-surface-variant max-w-md">Harap lengkapi Informasi Umum, Subjek Pajak, dan Objek Pajak terlebih dahulu agar dapat melanjutkan ke tahap Konfirmasi dan Pengajuan.</p>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-primary mb-2">check_circle</span>
            <h4 className="font-bold text-on-surface mb-1">Data Sudah Lengkap</h4>
            <p className="text-sm text-on-surface-variant max-w-md mb-4">Anda dapat meninjau kembali seluruh data yang telah Anda isikan dan memfinalisasi pengajuan.</p>
            <button 
              onClick={() => navigate(`/spop/konfirmasi/${idTransaksi}`)}
              className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Lanjutkan ke Konfirmasi
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </>
        )}
      </div>

      {/* Delete Section */}
      {isDraft && (
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 text-error hover:text-error/80 font-bold px-4 py-2 rounded-lg hover:bg-error/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            Hapus Seluruh Pengajuan
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
              Yakin ingin menghapus seluruh pengajuan ini? Semua data (Informasi Umum, Subjek Pajak, Objek Pajak) akan terhapus permanen dan tidak bisa dikembalikan.
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
