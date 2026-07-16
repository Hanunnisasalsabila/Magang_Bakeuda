import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';
import SegmentedNOPInput from '../components/SegmentedNOPInput';

export default function DetailReviewSPOP() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [decisionNotes, setDecisionNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isBakeuda, setIsBakeuda] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsBakeuda(user.role_user === 'ADMIN_BAKEUDA');
    }
    
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/transaksi-spop/${id}`);
        setData(res.data.data);
      } catch (error) {
        console.error('Gagal mengambil detail SPOP:', error);
        setToastMessage('Gagal mengambil data SPOP');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const [nopBaru, setNopBaru] = useState({ prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' });

  const handleDecision = async (approved) => {
    try {
      if (data.status_ajuan === 'MENUNGGU') {
        // VERIFIKASI BAKEUDA
        let finalNopStr = undefined;
        if (approved && ['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi)) {
          finalNopStr = `${nopBaru.prov}${nopBaru.kab}${nopBaru.kec}${nopBaru.kel}${nopBaru.blok}${nopBaru.nourut}${nopBaru.kode}`;
          if (finalNopStr.length !== 18) {
            setToastMessage('Gagal: Harap lengkapi 18 digit NOP Baru sebelum menyetujui!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
          }
        }
        
        await api.patch(`/transaksi-spop/${id}/verifikasi-bakeuda`, {
          status_ajuan: approved ? 'DISETUJUI' : 'DITOLAK',
          catatan: decisionNotes,
          nop_baru: finalNopStr
        });
        setToastMessage(`Verifikasi Bakeuda Berhasil! Status: ${approved ? 'DISETUJUI' : 'DITOLAK'}`);
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(-1);
      }, 2000);
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Terjadi kesalahan saat memproses data');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-medium text-lg">Memuat Detail SPOP...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500 font-medium text-lg">Data SPOP Tidak Ditemukan</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 underline">Kembali</button>
      </div>
    );
  }

  const detailTujuan = data.detail_tujuan?.[0] || {};
  const nopDisplay = detailTujuan.nop_generated || detailTujuan.no_persil_baru || 'Menunggu NOP';
  
  // Format Tanggal
  const tglPengajuan = new Date(data.tanggal_pengajuan).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <main className="p-6 max-w-screen-2xl mx-auto w-full relative">
      {/* Page Header with "Paper" Header Feel */}
      <div className="bg-white border border-gray-200 p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0">
            <img
              alt="Purbalingga Logo"
              className="h-full w-full object-contain"
              src={logoPurbalingga}
            />
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-wider text-xs font-semibold mb-1">
              Badan Keuangan Daerah (Bakeuda)
            </p>
            <h2 className="text-2xl text-gray-900 leading-tight font-bold">
              Verifikasi Berkas SPOP PBB-P2
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Formulir {data.no_formulir || 'SPOP-A01-2024'} • ID: #{data.id_transaksi.split('-')[0].toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs mb-2 font-bold border border-blue-200">
            {data.jenis_transaksi}
          </div>
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
              Tgl Pengajuan
            </span>
            <span className="font-mono font-medium text-sm text-gray-800">
              {tglPengajuan} WIB
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Form Data */}
        <div className="lg:col-span-7 space-y-6">
          {/* NOP */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[18px] text-gray-500">pin</span>
              Nomor Objek Pajak (NOP)
            </h3>
            <div className="font-mono text-lg font-bold text-gray-900 tracking-wider">
              {nopDisplay}
            </div>
            <p className="text-[11px] text-gray-400 mt-2 italic">
              *Prov - Kab - Kec - Kel - Blok - No.Urut - Kode
            </p>
          </section>

          {/* Subjek Pajak */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">person</span>
              DATA SUBJEK PAJAK
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Nama Subjek Pajak
                  </label>
                  <div className="font-semibold text-gray-900 text-base">{data.nama_pengaju || 'Tidak Diketahui'}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Status Subjek Pajak
                  </label>
                  <div className="font-semibold text-blue-700">Tergantung Berkas</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    NIK / NPWP
                  </label>
                  <div className="font-mono font-medium text-sm text-gray-800">
                    {detailTujuan.nik_calon_subjek || '-'}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Alamat Objek Pajak
                  </label>
                  <div className="font-semibold text-gray-900">{detailTujuan.jalan_op_baru || '-'} RT {detailTujuan.rt_op_baru || '-'} / RW {detailTujuan.rw_op_baru || '-'}</div>
                  <div className="text-gray-500 text-sm font-medium mt-0.5">
                    DESA {detailTujuan.kelurahan_op_baru || '-'}, KEC. {detailTujuan.kecamatan_op_baru || '-'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Tanah (Data Baru Comparison) */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">landscape</span>
              DATA TANAH (DATA BARU)
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Luas Tanah (m²)</label>
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <span className="text-green-700 bg-green-50 px-2 py-1 rounded">{detailTujuan.luas_tanah_baru || 0} m²</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Jenis Tanah</label>
                <div className="font-semibold text-gray-900 text-lg">{detailTujuan.jenis_tanah_baru || '-'}</div>
              </div>
            </div>
          </section>

          {/* Data Bangunan Table */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              DATA BANGUNAN
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Jumlah Bangunan</label>
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <span>{detailTujuan.jumlah_bangunan_baru || 0}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Luas Bangunan (m²)</label>
                <div className="font-semibold text-gray-900 text-lg">{detailTujuan.luas_bangunan_baru || 0} m²</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Attachments & Documents */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm lg:sticky lg:top-20">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">attachment</span>
              LAMPIRAN DOKUMEN
            </h3>
            <div className="space-y-6">
              {data.lampiran && data.lampiran.length > 0 ? (
                data.lampiran.map((lamp, idx) => (
                  <div key={lamp.id_lampiran || idx} className="group border border-outline-variant p-4 rounded-lg hover:border-primary transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-[24px]">description</span>
                        <div>
                          <p className="font-bold text-sm text-on-surface">{lamp.jenis_dokumen}</p>
                        </div>
                      </div>
                      <a href={lamp.url_dokumen} target="_blank" rel="noopener noreferrer" className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                        open_in_new
                      </a>
                    </div>
                    <div className="aspect-video bg-surface-variant rounded-lg overflow-hidden relative border border-outline-variant/60 shadow-inner">
                       <img
                          alt="Document Preview"
                          className="w-full h-full object-cover"
                          src={lamp.url_dokumen}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Dokumen+PDF/File'; }}
                        />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Tidak ada lampiran dokumen.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Verification Action Card - HANYA UNTUK BAKEUDA */}
      {isBakeuda && (
        <div className="mt-8 mb-12">
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-lg shadow-sm">
            <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg text-gray-900 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-blue-600">assignment_turned_in</span>
              Keputusan Verifikasi
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Periksa kembali kesesuaian data digital dengan lampiran yang diunggah. Keputusan yang Anda buat akan langsung diteruskan ke tingkat Kabupaten.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">

              {data.status_ajuan === 'MENUNGGU' && ['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi) && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">Penetapan NOP Baru</h4>
                  <p className="text-sm text-blue-700 mb-4">Silakan masukkan Kode Blok dan Nomor Urut sesuai Peta Blok Bakeuda untuk menginjeksi NOP Baru.</p>
                  <SegmentedNOPInput value={nopBaru} onChange={setNopBaru} />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Catatan / Alasan Verifikasi
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white"
                  placeholder="Contoh: Luas tanah telah dikonfirmasi sesuai dengan sertifikat..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-3">
              <button
                onClick={() => handleDecision(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                Setujui Pengajuan
              </button>
              <button
                onClick={() => handleDecision(false)}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-600 font-semibold py-3 px-4 rounded-md hover:bg-red-50 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                Tolak / Perlu Revisi
              </button>
              <p className="text-xs text-gray-400 text-center px-2 pt-2">
                Dengan menekan Setujui, Anda bertanggung jawab penuh atas validasi data.
              </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-surface-container-high px-gutter py-8 text-on-surface-variant border-t border-outline-variant rounded-t-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-center md:text-left">
            © 2026 Badan Keuangan Daerah (BKD) Kabupaten Purbalingga. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-sm font-label-sm">
            <a className="hover:text-primary transition-colors" href="#">
              Panduan Verifikator
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Bantuan
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-transform duration-300 z-50 ${
          showToast ? 'translate-y-0' : 'translate-y-28'
        }`}
      >
        <span className="material-symbols-outlined text-secondary-fixed">info</span>
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </main>
  );
}
