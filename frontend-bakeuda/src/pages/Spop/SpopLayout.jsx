import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';

export default function SpopLayout() {
  const { id_transaksi } = useParams();
  const { loadDraft, loading, idTransaksi } = useSpop();

  useEffect(() => {
    // Prevent reloading the same id if already loaded
    if (id_transaksi && id_transaksi !== idTransaksi) {
      loadDraft(id_transaksi);
    } else if (!id_transaksi) {
      // If we land on /spop/informasi-umum with no ID, clear draft
      loadDraft(null);
    }
  }, [id_transaksi, idTransaksi]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full h-full animate-fadeIn pb-16 md:pb-0">
      {/* Context loader */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-none shadow-sm border border-outline-variant overflow-hidden">
          <Outlet />
        </div>
      )}
    </div>
  );
}
