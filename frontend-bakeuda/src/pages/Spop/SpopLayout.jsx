import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';

export default function SpopLayout() {
  const { id_transaksi } = useParams();
  const { loadDraft, loading, idTransaksi, spopData } = useSpop();

  useEffect(() => {
    if (id_transaksi && id_transaksi !== idTransaksi) {
      // Load an existing draft by ID
      loadDraft(id_transaksi);
    }
  }, [id_transaksi]); // eslint-disable-line react-hooks/exhaustive-deps

  const location = window.location;
  const isKonfirmasi = location.pathname.includes('/konfirmasi') || location.pathname.includes('/status');

  const isRevisi = spopData?.status_ajuan === 'REVISI';
  const catatanRevisi = spopData?.catatan_bakeuda;

  return (
    <div className="w-full h-full animate-fadeIn pb-16 md:pb-0">
      {/* Context loader */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {isRevisi && catatanRevisi && !isKonfirmasi && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm w-full mb-2">
              <div className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-amber-600 mt-0.5">warning</span>
                <div>
                  <h4 className="font-bold text-amber-800 text-sm">Catatan Revisi dari Bakeuda</h4>
                  <p className="text-amber-700 mt-1 text-sm whitespace-pre-wrap">{catatanRevisi}</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-none shadow-sm border border-outline-variant overflow-hidden p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}
