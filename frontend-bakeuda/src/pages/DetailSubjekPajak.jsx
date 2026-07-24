import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';

export default function DetailSubjekPajak() {
  const [searchParams] = useSearchParams();
  const nik = searchParams.get('nik');
  const navigate = useNavigate();

  const [subjek, setSubjek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        // We use the new robust backend endpoint and pass nik as a query parameter
        const res = await api.get(`/subjek-pajak/find/detail`, { params: { nik } });
        const data = res.data?.data || res.data;
        setSubjek(data);
      } catch (err) {
        console.error("Gagal memuat detail subjek pajak:", err);
        setError('Gagal memuat detail subjek pajak. Pastikan NIK benar dan Anda memiliki akses.');
      } finally {
        setLoading(false);
      }
    };
    if (nik) {
      fetchDetail();
    }
  }, [nik]);

  if (loading) {
    return (
      <main className="p-gutter max-w-screen-xl mx-auto w-full flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">autorenew</span>
        <p className="font-bold text-primary animate-pulse">Memuat Data Subjek Pajak...</p>
      </main>
    );
  }

  if (error || !subjek) {
    return (
      <main className="p-gutter max-w-screen-xl mx-auto w-full">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p className="font-bold text-lg mb-2">Terjadi Kesalahan</p>
          <p className="mb-4">{error || 'Data tidak ditemukan.'}</p>
          <button
            onClick={() => navigate('/daftar-subjek')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Kembali ke Daftar Subjek
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-gutter max-w-screen-xl mx-auto w-full animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/daftar-subjek')}
            className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-on-surface font-black text-2xl tracking-tight">Detail Subjek Pajak</h2>
            
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* Card: Detail Subjek Pajak */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
          <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <h3 className="font-bold text-on-surface tracking-wide">Informasi Subjek Pajak</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">Nama Wajib Pajak</p>
                <p className="font-bold text-on-surface text-sm">{subjek.nama_subjek || '-'}</p>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">NIK</p>
                <p className="font-data-mono font-medium text-on-surface text-sm">{subjek.nik || '-'}</p>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">Status WP</p>
                <p className="font-bold text-on-surface text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded inline-flex w-fit">{subjek.status_wp || '-'}</p>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">Pekerjaan</p>
                <p className="font-bold text-on-surface text-sm">{subjek.pekerjaan || '-'}</p>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">No. Telepon/HP</p>
                <p className="font-bold text-on-surface text-sm">{subjek.no_hp || '-'}</p>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">Email</p>
                <p className="font-bold text-on-surface text-sm">{subjek.email || '-'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">NPWP</p>
                <p className="font-data-mono font-medium text-on-surface text-sm">{subjek.npwp || '-'}</p>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">NPWPD</p>
                <p className="font-data-mono font-medium text-on-surface text-sm">{subjek.npwpd || '-'}</p>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">Alamat</p>
                <div>
                  <p className="font-bold text-on-surface text-sm mb-1">{subjek.alamat_jalan || '-'}</p>
                  {(subjek.rt || subjek.rw) && <p className="text-xs text-on-surface-variant">RT {subjek.rt || '-'} / RW {subjek.rw || '-'}</p>}
                  {subjek.blok_kav_no_subjek && <p className="text-xs text-on-surface-variant">Blok/Kav: {subjek.blok_kav_no_subjek}</p>}
                  {subjek.wilayah?.nama_desa && <p className="text-xs text-on-surface-variant mt-1 capitalize">Desa: {subjek.wilayah.nama_desa.toLowerCase()}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Objek Pajak Containers */}
        {subjek.objek_pajak && subjek.objek_pajak.length > 0 ? (
          <>
            <div className="mt-4 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">real_estate_agent</span>
              <h3 className="font-bold text-xl text-on-surface">Objek Pajak Dimiliki ({subjek.objek_pajak.length})</h3>
            </div>

            {subjek.objek_pajak.map((op, idx) => (
              <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md mb-4">
                <div>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">landscape</span>
                      </div>
                      <h3 className="text-gray-900 font-bold text-lg">Detail Objek Pajak {subjek.objek_pajak.length > 1 ? `#${idx + 1}` : ''}</h3>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${op.status_aktif !== false ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {op.status_aktif !== false ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                      <p className="text-gray-600 font-medium text-sm">NOP</p>
                      <p className="font-bold text-gray-900 text-sm">{op.nop}</p>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                      <p className="text-gray-600 font-medium text-sm">Alamat</p>
                      <p className="font-bold text-gray-900 text-sm">
                        {op.jalan_op}
                        {op.rt_op || op.rw_op ? ` RT ${op.rt_op || '-'} / RW ${op.rw_op || '-'}` : ''}
                        {op.wilayah?.nama_desa ? ` KEL. ${op.wilayah.nama_desa.toUpperCase()}` : ''}
                        {op.wilayah?.kecamatan ? `, KEC. ${op.wilayah.kecamatan.toUpperCase()}` : ''}
                      </p>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                      <p className="text-gray-600 font-medium text-sm">Jenis Tanah</p>
                      <p className="font-bold text-gray-900 text-sm capitalize">{op.jenis_tanah ? op.jenis_tanah.replace(/_/g, ' ').toLowerCase() : '-'}</p>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                      <p className="text-gray-600 font-medium text-sm">Luas Tanah</p>
                      <p className="font-bold text-gray-900 text-sm">{op.luas_tanah ? Number(op.luas_tanah).toLocaleString() : '0'} M²</p>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                      <p className="text-gray-600 font-medium text-sm">Luas Bangunan</p>
                      <p className="font-bold text-gray-900 text-sm">{op.luas_bangunan ? Number(op.luas_bangunan).toLocaleString() : '0'} M²</p>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                      <p className="text-gray-600 font-medium text-sm">Jumlah Bangunan</p>
                      <p className="font-bold text-gray-900 text-sm">{op.jumlah_bangunan || 0} Unit</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="mt-4 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">home_work</span>
            </div>
            <p className="font-bold text-lg mb-1 text-on-surface">Tidak Ada Objek Pajak</p>
            <p className="text-sm text-on-surface-variant">Subjek pajak ini belum memiliki objek pajak yang terdaftar di sistem.</p>
          </div>
        )}
      </div>
    </main>
  );
}
