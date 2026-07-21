import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function DetailReviewSPOP() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk form Desa (Kades/Sekdes)
  const [nipPejabat, setNipPejabat] = useState('');
  const [pejabatDesa, setPejabatDesa] = useState([]);
  const [isUploadingDokumen, setIsUploadingDokumen] = useState(false);
  const [urlDokumenFisik, setUrlDokumenFisik] = useState('');
  const handleUploadDokumenFisik = (e) => { console.log('File selected'); };

  const [decisionNotes, setDecisionNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isBakeuda, setIsBakeuda] = useState(false);

  const [lockedByOther, setLockedByOther] = useState(false);
  const [lockErrorMsg, setLockErrorMsg] = useState('');

  useEffect(() => {
    let bakeudaFlag = false;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      bakeudaFlag = user.role === 'BAKEUDA';
      setIsBakeuda(bakeudaFlag);
    }
    
    const fetchDetail = async () => {
      try {
        let res;
        if (bakeudaFlag) {
          try {
            res = await api.patch(`/transaksi-spop/${id}/lock`);
          } catch (err) {
            res = await api.get(`/transaksi-spop/${id}`);
            if (res.data.data.status_ajuan === 'PROSES') {
              setLockedByOther(true);
              setLockErrorMsg(err.response?.data?.message || 'Berkas sedang dikunci oleh admin lain.');
            }
          }
        } else {
          res = await api.get(`/transaksi-spop/${id}`);
        }
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
    } else {
      setLoading(false);
    }

    // Polling untuk mengecek apakah kunci kita dilepas paksa oleh admin lain saat AFK
    const interval = setInterval(async () => {
      if (!bakeudaFlag) return;
      try {
        const checkRes = await api.get(`/transaksi-spop/${id}`);
        const currentData = checkRes.data.data;
        const myId = userStr ? JSON.parse(userStr).id : null;
        
        if (currentData.status_ajuan === 'MENUNGGU') {
          setLockedByOther(true);
          setLockErrorMsg('Kunci reviu telah dilepas secara paksa oleh admin lain.');
        } else if (currentData.status_ajuan === 'PROSES' && currentData.locked_by !== myId) {
          setLockedByOther(true);
          setLockErrorMsg('Berkas telah diambil alih oleh admin lain.');
        }
      } catch (e) {
        // Abaikan error polling
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  const handleCancelReview = async () => {
    try {
      await api.patch(`/transaksi-spop/${id}/unlock`);
      navigate(-1);
    } catch (error) {
      setToastMessage('Gagal melepas kunci');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const [kodeBlok, setKodeBlok] = useState('');
  const [kodeJenisOp, setKodeJenisOp] = useState('0');
  const [allWilayah, setAllWilayah] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState('');

  // Fetch Wilayah
  useEffect(() => {
    const fetchKecamatan = async () => {
      try {
        const res = await api.get('/wilayah');
        const wilayahData = res.data.data;
        setAllWilayah(wilayahData);
        const uniqueKec = [...new Set(wilayahData.map(w => w.kecamatan))].filter(Boolean).sort();
        setKecamatanList(uniqueKec);
      } catch (err) {
        console.error("Gagal mengambil data wilayah:", err);
      }
    };
    if (isBakeuda) {
      fetchKecamatan();
    }
  }, [isBakeuda]);

  // Update kelurahan list whenever kecamatan changes
  useEffect(() => {
    if (allWilayah.length === 0) return;
    if (selectedKecamatan) {
      const filteredKel = allWilayah
        .filter(w => w.kecamatan === selectedKecamatan)
        .map(w => w.nama_desa)
        .filter(Boolean)
        .sort();
      setKelurahanList(filteredKel);
    } else {
      setKelurahanList([]);
    }
  }, [selectedKecamatan, allWilayah]);

  // Set default wilayah from data
  useEffect(() => {
    if (data?.detail_tujuan?.[0] && allWilayah.length > 0) {
      const kec = data.detail_tujuan[0].kecamatan_op_baru;
      const kel = data.detail_tujuan[0].kelurahan_op_baru;
      if (kec && !selectedKecamatan) setSelectedKecamatan(kec);
      if (kel && !selectedKelurahan) setSelectedKelurahan(kel);
    }
  }, [data, allWilayah]);

  const handleDecision = async (status) => {
    try {
      if ((status === 'REVISI' || status === 'DITOLAK') && !decisionNotes.trim()) {
        setToastMessage('Catatan / Alasan Verifikasi wajib diisi!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      if (data.status_ajuan === 'PROSES') {
        // VERIFIKASI BAKEUDA
        if (status === 'DISETUJUI' && ['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi)) {
          if (!selectedKecamatan || !selectedKelurahan) {
            setToastMessage('Gagal: Kecamatan dan Kelurahan/Desa wajib dipilih!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
          }
          if (kodeBlok.length !== 3) {
            setToastMessage('Gagal: Kode Blok wajib diisi (3 digit angka)!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
          }
        }
        
        const wilayahObj = allWilayah.find(w => w.nama_desa === selectedKelurahan && w.kecamatan === selectedKecamatan);
        const kodeWilayah = wilayahObj ? wilayahObj.kode_wilayah : undefined;

        await api.patch(`/transaksi-spop/${id}/verifikasi-bakeuda`, {
          status_ajuan: status,
          catatan: decisionNotes,
          kode_wilayah: status === 'DISETUJUI' ? kodeWilayah : undefined,
          kode_blok: status === 'DISETUJUI' ? kodeBlok : undefined,
          kode_jenis_op: status === 'DISETUJUI' ? kodeJenisOp : undefined,
        });
        setToastMessage(`Verifikasi Bakeuda Berhasil! Status: ${status}`);
        
        setData(prev => ({
          ...prev,
          status_ajuan: status,
          catatan_bakeuda: decisionNotes,
          verified_at: new Date().toISOString()
        }));
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
        <p className="text-on-surface-variant font-medium text-lg">Memuat Detail SPOP...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm flex flex-col items-center animate-fadeIn">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px] text-red-500">
              find_in_page
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Data SPOP Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-8 leading-relaxed text-sm">
            Berkas SPOP tidak tersedia atau Anda tidak memiliki hak akses.
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Kembali Sebelumnya
          </button>
        </div>
      </div>
    );
  }

  const detailTujuan = data.detail_tujuan?.[0] || {};
  const calonSubjek = detailTujuan.calon_subjek_json || {};
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
            <p className="text-on-surface-variant uppercase tracking-wider text-xs font-semibold mb-1">
              Badan Keuangan Daerah (Bakeuda)
            </p>
            <h2 className="text-2xl text-on-surface leading-tight font-bold">
              Verifikasi Berkas SPOP PBB-P2
            </h2>
            <p className="text-on-surface-variant mt-1 text-sm">
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

      {/* Locked by Other Warning */}
      {lockedByOther && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px]">lock</span>
            <div>
              <p className="font-bold text-sm">Mode Read-Only</p>
              <p className="text-sm">{lockErrorMsg}</p>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="bg-white text-red-700 px-4 py-2 rounded-md font-semibold text-sm border border-red-200 hover:bg-red-100 transition-colors">
            Kembali ke Antrean
          </button>
        </div>
      )}

      {/* Button Cancel Review (Bakeuda Only) */}
      {!lockedByOther && isBakeuda && data.status_ajuan === 'PROSES' && (
        <div className="flex justify-end mb-4">
          <button onClick={handleCancelReview} className="text-sm flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold bg-white border border-gray-200 px-4 py-2 rounded-md shadow-sm transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
            Batal Reviu / Kembali
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Form Data */}
        <div className="lg:col-span-7 space-y-6">
          {/* NOP */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">pin</span>
              Nomor Objek Pajak (NOP)
            </h3>
            <div className="font-mono text-lg font-bold text-on-surface tracking-wider">
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
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                    Nama Subjek Pajak
                  </label>
                  <div className="font-semibold text-gray-900 text-base">{calonSubjek.nama_subjek || data.nama_pengaju || 'Tidak Diketahui'}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                    Status Subjek Pajak
                  </label>
                  <div className="font-semibold text-blue-700">{calonSubjek.status_subjek || 'Tergantung Berkas'}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                    NIK / NPWP
                  </label>
                  <div className="font-mono font-medium text-sm text-gray-800">
                    {calonSubjek.nik_npwp || detailTujuan.nik_calon_subjek || '-'}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                    Alamat Objek Pajak
                  </label>
                  <div className="font-semibold text-on-surface">{detailTujuan.jalan_op_baru || '-'} RT {detailTujuan.rt_op_baru || '-'} / RW {detailTujuan.rw_op_baru || '-'}</div>
                  <div className="text-on-surface-variant text-sm font-medium mt-0.5">
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
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-2">Luas Tanah (m²)</label>
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <span className="text-green-700 bg-green-50 px-2 py-1 rounded">{detailTujuan.luas_tanah_baru || 0} m²</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-2">Jenis Tanah</label>
                <div className="font-semibold text-on-surface text-lg">{detailTujuan.jenis_tanah_baru || '-'}</div>
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
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-2">Jumlah Bangunan</label>
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <span>{detailTujuan.jumlah_bangunan_baru || 0}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-2">Luas Bangunan (m²)</label>
                <div className="font-semibold text-on-surface text-lg">{detailTujuan.luas_bangunan_baru || 0} m²</div>
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
                <p className="text-sm text-on-surface-variant italic">Tidak ada lampiran dokumen.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Verification Action Card or Final Decision */}
      {['DISETUJUI', 'DITOLAK', 'REVISI'].includes(data.status_ajuan) ? (
        <div className="mt-8 mb-12">
          <div className={`border p-6 md:p-8 rounded-lg shadow-sm ${data.status_ajuan === 'DISETUJUI' ? 'bg-green-50 border-green-200' : (data.status_ajuan === 'REVISI' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200')}`}>
            <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
              <span className={`material-symbols-outlined text-[32px] ${data.status_ajuan === 'DISETUJUI' ? 'text-green-600' : (data.status_ajuan === 'REVISI' ? 'text-amber-600' : 'text-red-600')}`}>
                {data.status_ajuan === 'DISETUJUI' ? 'verified' : (data.status_ajuan === 'REVISI' ? 'assignment_return' : 'cancel')}
              </span>
              <div>
                <h3 className={`text-xl font-bold ${data.status_ajuan === 'DISETUJUI' ? 'text-green-800' : (data.status_ajuan === 'REVISI' ? 'text-amber-800' : 'text-red-800')}`}>
                  Berkas {data.status_ajuan === 'DISETUJUI' ? 'Telah Disetujui' : (data.status_ajuan === 'REVISI' ? 'Dikembalikan untuk Revisi' : 'Ditolak Permanen')}
                </h3>
                <p className={`text-sm mt-0.5 ${data.status_ajuan === 'DISETUJUI' ? 'text-green-700' : (data.status_ajuan === 'REVISI' ? 'text-amber-700' : 'text-red-700')}`}>Keputusan akhir sudah diberikan oleh pihak Bakeuda.</p>
              </div>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${data.status_ajuan === 'DISETUJUI' ? 'text-green-900' : (data.status_ajuan === 'REVISI' ? 'text-amber-900' : 'text-red-900')}`}>
              <div>
                <p className="text-[11px] font-bold uppercase mb-1 opacity-70 tracking-wider">Diverifikasi Oleh</p>
                <p className="font-semibold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] opacity-70">person</span>
                  {data.verifikator?.nama_lengkap || 'Admin Bakeuda'}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase mb-1 opacity-70 tracking-wider">Waktu Keputusan</p>
                <p className="font-semibold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] opacity-70">schedule</span>
                  {data.verified_at ? new Date(data.verified_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) + ' WIB' : '-'}
                </p>
              </div>
              <div className="md:col-span-2 mt-2">
                <p className="text-[11px] font-bold uppercase mb-2 opacity-70 tracking-wider">Catatan Tambahan</p>
                <div className="bg-white/60 p-4 rounded-md border border-black/5 shadow-inner">
                  <p className="text-sm whitespace-pre-wrap font-medium">{data.catatan_bakeuda || 'Tidak ada catatan dari verifikator.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 mb-12">
          <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-lg shadow-sm">
            <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg text-gray-900 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-blue-600">assignment_turned_in</span>
              Keputusan Verifikasi
            </h3>
            <p className="text-on-surface-variant text-sm mt-1">
              Periksa kembali kesesuaian data digital dengan lampiran yang diunggah. Keputusan yang Anda buat akan langsung diteruskan ke tingkat Kabupaten.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Render untuk Bakeuda */}
              {isBakeuda && data.status_ajuan === 'PROSES' && ['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi) && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mb-4">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">pin</span>
                    Penetapan NOP Baru
                  </h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Pastikan Kecamatan dan Desa sudah benar. Anda hanya perlu mengisi <b>Kode Blok</b>. Nomor Urut akan dihitung otomatis oleh sistem.
                  </p>
                  
                  {/* Wilayah Input (Dropdown) */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kecamatan *</label>
                      <select
                        value={selectedKecamatan}
                        onChange={(e) => {
                          setSelectedKecamatan(e.target.value);
                          setSelectedKelurahan(''); // Reset kelurahan when kecamatan changes
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium bg-white"
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        {kecamatanList.map(kec => <option key={kec} value={kec}>{kec}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Desa/Kel *</label>
                      <select
                        value={selectedKelurahan}
                        onChange={(e) => setSelectedKelurahan(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium bg-white"
                        disabled={!selectedKecamatan}
                      >
                        <option value="">-- Pilih Desa --</option>
                        {kelurahanList.map(kel => <option key={kel} value={kel}>{kel}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Input Manual: Blok + Kode Jenis */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kode Blok (3 digit) *</label>
                      <input
                        type="text" inputMode="numeric" maxLength={3}
                        value={kodeBlok}
                        onChange={(e) => setKodeBlok(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-center font-mono font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="001"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kode Jenis OP</label>
                      <select
                        value={kodeJenisOp}
                        onChange={(e) => setKodeJenisOp(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium bg-white"
                      >
                        <option value="0">0 — Bumi</option>
                        <option value="1">1 — Bangunan</option>
                      </select>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-3 bg-white border border-dashed border-blue-300 rounded-md px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="text-[11px] font-bold text-blue-500 uppercase">Preview NOP:</span>
                    <span className="font-mono font-bold text-blue-900 ml-0 sm:ml-2">
                      33.03.XXX.XXX.{kodeBlok || '___'}.AUTO.{kodeJenisOp}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-0 sm:ml-2">(No. Urut otomatis)</span>
                  </div>
                </div>
              )}

              {/* Render untuk Desa */}
              {!isBakeuda && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                      Pejabat Berwenang (Kades/Sekdes)
                    </label>
                    <select
                      value={nipPejabat}
                      onChange={(e) => setNipPejabat(e.target.value)}
                      className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white"
                    >
                      <option value="">-- Pilih Pejabat --</option>
                      {pejabatDesa.map(p => (
                        <option key={p.nip} value={p.nip}>{p.nama_pejabat} (NIP: {p.nip})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                      Dokumen Fisik SPOP (TTD Basah)
                    </label>
                    <div className="relative overflow-hidden w-full">
                      <button 
                        type="button"
                        disabled={isUploadingDokumen}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-dashed border-blue-400 text-blue-600 font-semibold hover:bg-blue-50 transition-colors ${isUploadingDokumen ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{isUploadingDokumen ? 'hourglass_empty' : (urlDokumenFisik ? 'check_circle' : 'upload_file')}</span>
                        {isUploadingDokumen ? 'Mengunggah...' : (urlDokumenFisik ? 'Dokumen Terlampir' : 'Upload PDF/JPG')}
                      </button>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleUploadDokumenFisik}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploadingDokumen}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-2">
                  Catatan / Alasan Verifikasi
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white"
                  placeholder={`Contoh:\nBagian Subjek: ...\nBagian Objek: ...\nBagian Lampiran: ...`}
                  rows={3}
                />
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-end">
              <button
                onClick={() => handleDecision('DISETUJUI')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                Setujui Pengajuan
              </button>
              <button
                onClick={() => handleDecision('REVISI')}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 px-4 rounded-md hover:bg-amber-600 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">assignment_return</span>
                Kembalikan untuk Revisi
              </button>
              <button
                onClick={() => handleDecision('DITOLAK')}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-600 font-semibold py-3 px-4 rounded-md hover:bg-red-50 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                Tolak Permanen
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
