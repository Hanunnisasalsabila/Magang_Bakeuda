import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';

export default function Step5Status() {
  const { formData, idTransaksi, completionStatus, loadDraft } = useSpop();
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent direct access via URL/Sidebar if they haven't actually submitted
    if (idTransaksi && !completionStatus[5]) {
      navigate('/spop/konfirmasi', { replace: true });
    }
  }, [completionStatus, navigate, idTransaksi]);

  if (!idTransaksi || !completionStatus[5]) return null;

  return (
    <div className="space-y-8 text-center py-10 animate-fadeIn bg-surface-container-low rounded-2xl">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-green-100/50">
        <span className="material-symbols-outlined text-[56px]">check_circle</span>
      </div>
      <h3 className="text-3xl text-on-surface uppercase font-extrabold tracking-tight">
        SPOP Berhasil Disimpan / Dikirim
      </h3>
      <p className="text-lg text-on-surface-variant max-w-lg mx-auto">
        Formulir SPOP Digital untuk NOP <span className="font-bold text-primary font-data-mono">{`33.03.${formData.nop?.kec || '___'}.${formData.nop?.kel || '___'}.${formData.nop?.blok || '___'}.${formData.nop?.nourut || '____'}.${formData.nop?.kode || '_'}`}</span> telah tersimpan di sistem.
      </p>

      <div className="bg-white border border-outline-variant p-6 rounded-xl max-w-md mx-auto text-left space-y-3 mt-6 shadow-sm">
        <div className="flex justify-between items-center text-sm border-b border-outline-variant pb-3">
          <span className="text-on-surface-variant font-bold">ID Submisi</span>
          <span className="font-bold text-on-surface font-data-mono bg-surface-container px-2 py-1 rounded">{idTransaksi || '-'}</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-1">
          <span className="text-on-surface-variant font-bold">Estimasi Verifikasi</span>
          <span className="font-bold text-green-600 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            ± 24 Jam Kerja
          </span>
        </div>
      </div>



      <div className="mt-12 flex justify-center gap-4">
        <button
          onClick={() => {
            loadDraft(null);
            navigate('/spop');
          }}
          className="px-6 py-3 border border-outline-variant text-on-surface font-bold rounded-full hover:bg-surface-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Buat SPOP Baru
        </button>
        <button
          onClick={() => navigate('/beranda')}
          className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
