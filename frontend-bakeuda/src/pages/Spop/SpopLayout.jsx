import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';

export default function SpopLayout() {
  const { id_transaksi } = useParams();
  const { loadDraft, loading, idTransaksi } = useSpop();

  useEffect(() => {
    if (id_transaksi && id_transaksi !== idTransaksi) {
      // Load an existing draft by ID
      loadDraft(id_transaksi);
    } else if (!id_transaksi && idTransaksi !== null) {
      // Navigating to a new entry (no ID), always clear
      loadDraft(null);
    }
  }, [id_transaksi]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full h-full animate-fadeIn pb-16 md:pb-0">
      {/* Context loader */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-none shadow-sm border border-outline-variant overflow-hidden p-4 md:p-8">
          <Outlet />
        </div>
      )}
    </div>
  );
}
