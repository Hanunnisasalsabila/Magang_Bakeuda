import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PelacakanDokumen() {
  const navigate = useNavigate();
  const [dataTransaksi, setDataTransaksi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi Fetch API GET /transaksi-spop/:id
    // Untuk demo ini, kita beri delay 1 detik agar animasi loading terlihat
    const fetchDummyData = () => {
      setTimeout(() => {
        setDataTransaksi({
          id_transaksi: 'TRX-9821-PBG',
          no_formulir: 'SPOP-A01-2024',
          nama_pengaju: 'BUDI SANTOSO, S.T.',
          tanggal_pengajuan: '2023-10-14T10:45:00Z',
          status_ajuan: 'PROSES', // atau MENUNGGU_VERIFIKASI_DESA
          riwayat: [
            {
              id_riwayat: 1,
              status_lama: null,
              status_baru: 'DRAFT',
              keterangan: 'Pengajuan Berkas Berhasil Dibuat',
              waktu_kejadian: '2023-10-14T10:45:00Z',
              nama_pelaku: 'Sistem',
            },
            {
              id_riwayat: 2,
              status_lama: 'DRAFT',
              status_baru: 'MENUNGGU_VERIFIKASI_DESA',
              keterangan: 'Menunggu Persetujuan Kelurahan',
              waktu_kejadian: '2023-10-14T11:00:00Z',
              nama_pelaku: 'Operator Desa',
            },
            {
              id_riwayat: 3,
              status_lama: 'MENUNGGU_VERIFIKASI_DESA',
              status_baru: 'PROSES',
              keterangan: 'Telah Disetujui Desa, Dikirim ke Bakeuda (NIP Kades: 198001012010011001)',
              waktu_kejadian: '2023-10-14T15:30:00Z',
              nama_pelaku: 'Kades Purbalingga',
            }
          ]
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchDummyData();
  }, []);

  if (isLoading) {
    return (
      <main className="p-gutter max-w-screen-md mx-auto w-full relative flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-[48px] text-primary">autorenew</span>
          <p className="font-bold text-primary font-label-sm">Memuat Data Riwayat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-gutter max-w-screen-md mx-auto w-full relative">
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard-desa')}
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="font-display-sm text-display-sm text-primary font-bold">Pelacakan Dokumen</h2>
          <p className="text-on-surface-variant font-label-sm">ID: {dataTransaksi.id_transaksi} | {dataTransaksi.no_formulir}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm mb-section-gap">
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-outline-variant">
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{dataTransaksi.nama_pengaju}</h3>
            <p className="text-on-surface-variant text-sm mt-1">Diajukan: {new Date(dataTransaksi.tanggal_pengajuan).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })} WIB</p>
          </div>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded font-bold text-xs uppercase shadow-sm">
            STATUS: {dataTransaksi.status_ajuan}
          </div>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-outline-variant/60"></div>
          
          <div className="space-y-8">
            {dataTransaksi.riwayat.map((item, index) => {
              const isLast = index === dataTransaksi.riwayat.length - 1;
              return (
                <div key={item.id_riwayat} className="relative flex gap-6">
                  {/* Circle Marker */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${isLast ? 'bg-primary text-white shadow-md' : 'bg-surface-container-high border-2 border-surface-container text-outline'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {item.status_baru === 'DRAFT' ? 'draft' : item.status_baru === 'MENUNGGU_VERIFIKASI_DESA' ? 'pending_actions' : 'check_circle'}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="pt-2 pb-1">
                    <p className="text-xs text-on-surface-variant font-data-mono mb-1">
                      {new Date(item.waktu_kejadian).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'medium' })}
                    </p>
                    <h4 className={`font-bold text-base ${isLast ? 'text-primary' : 'text-on-surface'}`}>
                      {item.keterangan}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-1 italic">Oleh: {item.nama_pelaku}</p>
                    
                    {/* Status Badge Tag */}
                    <div className="mt-3 inline-flex items-center gap-2 text-xs border border-outline-variant px-2 py-1 rounded bg-surface-container-low">
                      <span className="font-semibold text-outline line-through">{item.status_lama || 'NONE'}</span>
                      <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                      <span className="font-bold text-secondary">{item.status_baru}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
