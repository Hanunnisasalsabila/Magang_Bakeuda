import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axios';
import { MapContainer, TileLayer, Polygon, Marker, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import logoPurbalingga from '../assets/logo-purbalingga.png';

const dotIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#EF4444;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const createNumberedIcon = (number) => L.divIcon({
  className: 'custom-numbered-icon',
  html: `<div style='background-color:#EF4444;color:white;width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;line-height:1;'>${number}</div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

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
        let res = await api.get(`/transaksi-spop/${id}`);
        let fetchedData = res.data.data;

        if (bakeudaFlag && (fetchedData.status_ajuan === 'MENUNGGU' || fetchedData.status_ajuan === 'PROSES')) {
          try {
            res = await api.post(`/transaksi-spop/${id}/lock`);
            fetchedData = res.data.data;
          } catch (err) {
            res = await api.get(`/transaksi-spop/${id}`);
            fetchedData = res.data.data;
            if (fetchedData.status_ajuan === 'PROSES') {
              setLockedByOther(true);
              setLockErrorMsg(err.response?.data?.message || 'Berkas sedang dikunci oleh admin lain.');
            }
          }
        }

        // Fetch existing NOP data if transaction is HAPUS to show the data being deleted
        if (fetchedData.jenis_transaksi === 'HAPUS' && fetchedData.detail_asal?.length > 0) {
          try {
            const nopAsal = fetchedData.detail_asal[0].nop_asal;
            const opRes = await api.get(`/objek-pajak/${nopAsal}`);
            const opData = opRes.data.data;
            if (opData) {
              const subjek = opData.subjek_pajak || {};
              const bumi = opData.bumi?.[0] || {};

              // Mocking detail_tujuan structure so the UI can render it
              fetchedData.detail_tujuan = [{
                nik_calon_subjek: subjek.nik,
                calon_subjek_json: {
                  nama_subjek: subjek.nama_subjek,
                  nik: subjek.nik,
                  npwp: subjek.npwp,
                  npwpd: subjek.npwpd,
                  email: subjek.email,
                  no_hp: subjek.no_hp,
                  status_wp: subjek.status_wp,
                  pekerjaan: subjek.pekerjaan,
                  alamat: subjek.alamat_jalan,
                  rt: subjek.rt,
                  rw: subjek.rw,
                  kelurahan: opData.wilayah?.nama_desa,
                  kecamatan: opData.wilayah?.kecamatan,
                  kabupaten: opData.wilayah?.kabupaten || 'Purbalingga',
                  kode_pos: subjek.kode_pos,
                },
                luas_tanah_baru: opData.luas_tanah || 0,
                jenis_tanah_baru: opData.jenis_tanah,
                jalan_op_baru: opData.jalan_op,
                blok_kav_no_baru: opData.blok_kav_no_op,
                rt_op_baru: opData.rt_op,
                rw_op_baru: opData.rw_op,
                kelurahan_op_baru: opData.wilayah?.nama_desa,
                kecamatan_op_baru: opData.wilayah?.kecamatan,
                batas_utara: opData.batas_utara,
                batas_selatan: opData.batas_selatan,
                batas_timur: opData.batas_timur,
                batas_barat: opData.batas_barat,
                luas_bangunan_baru: opData.luas_bangunan || 0,
                jumlah_bangunan_baru: opData.jumlah_bangunan || opData.bangunan?.length || 0,
                latitude: opData.latitude,
                longitude: opData.longitude,
                koordinat_polygon: opData.koordinat_polygon,
                data_bangunan_json: (opData.bangunan || []).map(b => ({
                  penggunaan: b.jenis_penggunaan_bangunan,
                  luas_bangunan: b.luas_bangunan,
                  jumlah_lantai: b.jumlah_lantai,
                  tahun_dibangun: b.tahun_dibangun,
                  tahun_direnovasi: b.tahun_direnovasi,
                  kondisi: b.kondisi_bangunan,
                  konstruksi: b.jenis_konstruksi,
                  atap: b.jenis_atap,
                  dinding: b.dinding,
                  lantai: b.lantai,
                  langit_langit: b.langit_langit,
                  daya_listrik: (b.fasilitas || []).reduce((acc, f) => f.jenis_fasilitas === 'LISTRIK' ? acc + (f.jumlah_satuan || 0) : acc, 0)
                }))
              }];
            }
          } catch (e) {
            console.error('Failed to fetch existing NOP data for HAPUS:', e);
          }
        }

        setData(fetchedData);
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
      await api.post(`/transaksi-spop/${id}/unlock`);
      navigate(-1);
    } catch (error) {
      setToastMessage('Gagal melepas kunci');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const [openPecahan, setOpenPecahan] = useState([0]);
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
    if (data && allWilayah.length > 0) {
      let targetKode = data.pengaju?.kode_wilayah;
      if (data.detail_tujuan?.[0]?.kode_wilayah_baru) {
        targetKode = data.detail_tujuan[0].kode_wilayah_baru;
      }

      if (targetKode) {
        const matched = allWilayah.find(w => w.kode_wilayah === targetKode);
        if (matched) {
          if (!selectedKecamatan) setSelectedKecamatan(matched.kecamatan);
          if (!selectedKelurahan) setSelectedKelurahan(matched.nama_desa);
        }
      }
    }
  }, [data, allWilayah]);


  // Auto-fill kodeBlok for PECAH from NOP Induk
  useEffect(() => {
    if (isBakeuda && data?.status_ajuan === 'PROSES' && data?.jenis_transaksi === 'PECAH') {
      const nopAsal = data?.detail_asal?.[0]?.nop_asal;
      if (nopAsal && nopAsal.length >= 13 && !kodeBlok) {
        setKodeBlok(nopAsal.substring(10, 13));
      }
    }
  }, [data, isBakeuda, kodeBlok]);

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

        let endpoint = '';
        const payload = { catatan: decisionNotes, status_ajuan: status };

        if (status === 'DISETUJUI') {
          endpoint = `/transaksi-spop/${id}/approve`;
          if (['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi)) {
            Object.assign(payload, {
              kode_wilayah: kodeWilayah,
              kode_blok: kodeBlok,
              kode_jenis_op: kodeJenisOp,
            });
          }
        } else if (status === 'DITOLAK') {
          endpoint = `/transaksi-spop/${id}/tolak`;
        } else if (status === 'REVISI') {
          endpoint = `/transaksi-spop/${id}/revisi`;
        }

        await api.post(endpoint, payload);
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

  const detailTujuanList = data.detail_tujuan || [];
  const isTetap = ['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(data.jenis_transaksi);
  const nopAsalList = data.detail_asal?.map(a => a.nop_asal).filter(Boolean) || [];
  const nopAsal = nopAsalList.join(', ') || 'Menunggu NOP';
  const sumLuas = data.detail_asal?.reduce((acc, a) => acc + (parseFloat(a.objek_asal?.luas_tanah) || 0), 0);
  const luasInduk = sumLuas > 0 ? sumLuas : (data.detail_asal?.[0]?.objek_asal?.luas_tanah || '-');

  const renderList = data.jenis_transaksi === 'HAPUS' ? (data.detail_asal || []).map(asal => {
    const ob = asal.objek_asal || {};
    const sp = ob.subjek_pajak || {};
    return {
      id_detail_tujuan: asal.id_detail_asal,
      nop_generated: asal.nop_asal,
      calon_subjek_json: {
        nama_subjek: sp.nama_subjek,
        no_hp: sp.no_hp,
        status_wp: sp.status_wp,
        email: sp.email,
        nik: sp.nik,
        npwp: sp.npwp,
        npwpd: sp.npwpd,
        pekerjaan: sp.pekerjaan,
        alamat_jalan: sp.alamat_jalan,
        rt: sp.rt,
        rw: sp.rw,
        kelurahan: sp.wilayah?.nama_desa || sp.kelurahan,
        kecamatan: sp.wilayah?.kecamatan || sp.kecamatan,
        kabupaten: sp.wilayah?.kabupaten || sp.kabupaten,
        kode_pos: sp.kode_pos
      },
      luas_tanah_baru: ob.luas_tanah,
      jalan_op_baru: ob.jalan_op,
      blok_kav_no_baru: ob.blok_kav_no,
      rt_op_baru: ob.rt_op,
      rw_op_baru: ob.rw_op,
      kelurahan_op_baru: ob.wilayah?.nama_desa || ob.kelurahan_op,
      kecamatan_op_baru: ob.wilayah?.kecamatan || ob.kecamatan_op,
      jenis_tanah_baru: ob.jenis_tanah,
      koordinat_polygon: ob.koordinat_polygon,
      latitude: ob.latitude,
      longitude: ob.longitude,
      batas_utara: ob.batas_utara,
      batas_selatan: ob.batas_selatan,
      batas_timur: ob.batas_timur,
      batas_barat: ob.batas_barat,
      data_bangunan_json: ob.bangunan || [],
      jumlah_bangunan_baru: ob.jumlah_bangunan
    };
  }) : detailTujuanList;

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
              Formulir {data.no_formulir || 'SPOP-A01-2024'} &bull; ID: #{data.id_transaksi.split('-')[0].toUpperCase()}
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


      <div className="space-y-6">
        {/* Blok A Dinamis */}
        <section className="border border-gray-300">
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
            <h3 className="text-base font-bold text-blue-900 uppercase m-0">
              {data.jenis_transaksi === 'BARU'
                ? 'A. NOMOR OBJEK PAJAK (NOP BARU)'
                : (['PECAH', 'GABUNG'].includes(data.jenis_transaksi)
                  ? 'A. DATA NOP ASAL (INDUK)'
                  : 'A. NOMOR OBJEK PAJAK (NOP)')}
            </h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr>
                  <td className="p-3 w-1/4 bg-gray-50 font-semibold text-gray-700">
                    {['PECAH', 'GABUNG'].includes(data.jenis_transaksi) ? 'Nomor Objek Pajak Induk' : 'Nomor Objek Pajak'}
                  </td>
                  <td className={`p-3 font-mono font-bold text-black tracking-widest ${['PECAH', 'GABUNG'].includes(data.jenis_transaksi) ? 'border-r border-gray-200' : ''}`} colSpan={['PECAH', 'GABUNG'].includes(data.jenis_transaksi) ? 1 : 3}>
                    {(() => {
                      if (data.jenis_transaksi === 'BARU') {
                        const generated = detailTujuanList[0]?.nop_generated || detailTujuanList[0]?.no_persil_baru;
                        return generated || <span className="text-gray-400 font-mono tracking-widest">............-.......</span>;
                      }
                      return nopAsal !== 'Menunggu NOP' && nopAsal ? nopAsal : <span className="text-gray-400 font-mono tracking-widest">............-.......</span>;
                    })()}
                  </td>
                  {['PECAH', 'GABUNG'].includes(data.jenis_transaksi) && (
                    <>
                      <td className="p-3 w-1/4 bg-gray-50 font-semibold text-gray-700 border-l border-gray-200">Luas Induk (Tanah)</td>
                      <td className="p-3 font-bold text-black">{luasInduk} M&sup2;</td>
                    </>
                  )}
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-3 bg-gray-50 font-semibold text-gray-700">Format NOP</td>
                  <td className="p-3 text-gray-500 text-xs italic" colSpan="3">Prov - Kab - Kec - Kel - Blok - No.Urut - Kode</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Rincian Tujuan (Looping) */}
        {renderList.map((detailTujuan, idx) => {
          const calonSubjek = detailTujuan.calon_subjek_json || {};
          const isOpen = openPecahan.includes(idx);

          const toggleAccordion = () => {
            if (isOpen) {
              setOpenPecahan(openPecahan.filter(i => i !== idx));
            } else {
              setOpenPecahan([...openPecahan, idx]);
            }
          };

          return (
            <div key={detailTujuan.id_detail_tujuan || idx} className="border border-gray-300 bg-white overflow-hidden shadow-sm">
              {/* Accordion Header */}
              <div
                className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${isOpen ? 'bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-b border-gray-300'}`}
                onClick={toggleAccordion}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                  <h3 className="text-base font-bold uppercase m-0 flex items-center gap-2">
                    B. RINCIAN {data.jenis_transaksi === 'HAPUS' ? 'DATA YANG DIHAPUS' : (data.jenis_transaksi === 'PECAH' ? `PECAHAN ${idx + 1}` : 'TUJUAN')}
                    {data.jenis_transaksi === 'PECAH' && <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full font-normal">Luas: {detailTujuan.luas_tanah_baru || 0} M&sup2;</span>}
                  </h3>
                </div>
                {detailTujuan.nop_generated && (
                  <div className="font-mono text-sm tracking-widest opacity-90">
                    NOP: {detailTujuan.nop_generated}
                  </div>
                )}
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div className="animate-fadeIn">
                  {/* Subjek Pajak */}
                  <div className="p-0 border-b-4 border-gray-100">
                    <div className="bg-blue-50/50 border-y border-gray-200 px-4 py-1.5">
                      <h4 className="text-sm font-bold text-blue-900 m-0">1. Data Subjek Pajak</h4>
                    </div>
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 w-1/4 bg-gray-50/50 font-semibold text-gray-700">Nama Subjek Pajak</td>
                          <td className="p-3 w-1/4 font-bold text-black border-r border-gray-100">{calonSubjek.nama_subjek || data.nama_pengaju || '-'}</td>
                          <td className="p-3 w-1/4 bg-gray-50/50 font-semibold text-gray-700">No. Telepon/HP</td>
                          <td className="p-3 w-1/4 font-mono text-black">{calonSubjek.no_hp || '-'}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Status Subjek</td>
                          <td className="p-3 font-bold text-black border-r border-gray-100">{calonSubjek.status_wp || calonSubjek.status_subjek || '-'}</td>
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Email</td>
                          <td className="p-3 text-black">{calonSubjek.email || '-'}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">NIK / NPWP</td>
                          <td className="p-3 font-mono text-black border-r border-gray-100">{calonSubjek.nik || calonSubjek.npwp || detailTujuan.nik_calon_subjek || '-'}</td>
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">NPWPD</td>
                          <td className="p-3 font-mono text-black">{calonSubjek.npwpd || '-'}</td>
                        </tr>
                        <tr>
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700 align-middle">Pekerjaan</td>
                          <td className="p-3 text-black border-r border-gray-100 align-middle">{calonSubjek.pekerjaan || '-'}</td>
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700 align-top">Alamat WP</td>
                          <td className="p-3 text-black align-top">
                            {calonSubjek.alamat_jalan || calonSubjek.alamat || '-'}, RT {calonSubjek.rt || '-'}/RW {calonSubjek.rw || '-'}<br />
                            KEL. {calonSubjek.kelurahan || '-'}, KEC. {calonSubjek.kecamatan || '-'}<br />
                            KAB. {calonSubjek.kabupaten || 'Purbalingga'} {calonSubjek.kode_pos ? `- ${calonSubjek.kode_pos}` : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Data Tanah */}
                  <div className="p-0 border-b-4 border-gray-100">
                    <div className="bg-blue-50/50 border-y border-gray-200 px-4 py-1.5">
                      <h4 className="text-sm font-bold text-blue-900 m-0">2. Data Objek Pajak (Tanah)</h4>
                    </div>
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 w-1/4 bg-gray-50/50 font-semibold text-gray-700">Luas Tanah</td>
                          <td className="p-3 w-1/4 font-bold text-black border-r border-gray-100">{detailTujuan.luas_tanah_baru || 0} M&sup2;</td>
                          <td className="p-3 w-1/4 bg-gray-50/50 font-semibold text-gray-700 align-top" rowSpan="2">Letak Objek</td>
                          <td className="p-3 w-1/4 text-black align-top" rowSpan="2">
                            {detailTujuan.jalan_op_baru || '-'} {detailTujuan.blok_kav_no_baru ? `(Blok/Kav: ${detailTujuan.blok_kav_no_baru})` : ''}<br />
                            RT {detailTujuan.rt_op_baru || '-'}/RW {detailTujuan.rw_op_baru || '-'}<br />
                            DESA {detailTujuan.kelurahan_op_baru || '-'}, KEC. {detailTujuan.kecamatan_op_baru || '-'}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Jenis Tanah</td>
                          <td className="p-3 font-bold text-black border-r border-gray-100">{detailTujuan.jenis_tanah_baru || '-'}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700 align-top">Titik Koordinat</td>
                          <td className="p-3 border-r border-gray-100 align-top" colSpan="3">
                            {Array.isArray(detailTujuan.koordinat_polygon) && detailTujuan.koordinat_polygon.length > 0 ? (
                              <div>
                                <div className="flex flex-col gap-2 mb-2">
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs bg-blue-100 border border-blue-300 px-2 py-1 rounded font-bold text-blue-900">
                                      {detailTujuan.koordinat_polygon.length} Titik Polygon
                                    </span>
                                    <div className="flex gap-4 border-l border-gray-300 pl-3">
                                      <a
                                        href={`https://www.google.com/maps?q=${detailTujuan.koordinat_polygon[0].lat},${detailTujuan.koordinat_polygon[0].lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-semibold"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">map</span>
                                        Google Maps
                                      </a>
                                      <a
                                        href="https://bhumi.atrbpn.go.id/peta"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-semibold"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">public</span>
                                        Portal BHUMI ATR/BPN
                                      </a>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded text-[11px] font-mono">
                                    {detailTujuan.koordinat_polygon.map((p, pIdx) => (
                                      <span key={pIdx} className="bg-white border border-gray-300 px-1.5 py-0.5 rounded shadow-sm text-gray-700">
                                        <span className="font-bold text-gray-400 mr-1">P{pIdx + 1}:</span>
                                        {p.lat}, {p.lng}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="border border-gray-300 rounded overflow-hidden h-[260px]">
                                  <MapContainer
                                    center={[detailTujuan.koordinat_polygon[0].lat, detailTujuan.koordinat_polygon[0].lng]}
                                    zoom={17}
                                    style={{ height: "100%", width: "100%" }}
                                    scrollWheelZoom={false}
                                  >
                                    <LayersControl position="topright">
                                      <LayersControl.BaseLayer name="Google Satellite" checked>
                                        <TileLayer
                                          url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                                          maxZoom={20}
                                          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                          attribution="&copy; Google Maps"
                                        />
                                      </LayersControl.BaseLayer>
                                      <LayersControl.BaseLayer name="Google Streets">
                                        <TileLayer
                                          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                          maxZoom={20}
                                          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                          attribution="&copy; Google Maps"
                                        />
                                      </LayersControl.BaseLayer>
                                    </LayersControl>
                                    <Polygon
                                      positions={detailTujuan.koordinat_polygon.map(p => [p.lat, p.lng])}
                                      pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.4, weight: 3 }}
                                    />
                                    {detailTujuan.koordinat_polygon.map((p, pIdx) => (
                                      <Marker
                                        key={`marker-${pIdx}`}
                                        position={[p.lat, p.lng]}
                                        icon={createNumberedIcon(pIdx + 1)}
                                      />
                                    ))}
                                  </MapContainer>
                                </div>
                              </div>
                            ) : detailTujuan.latitude && detailTujuan.longitude ? (
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-2 py-1 rounded font-semibold text-gray-800">
                                    {detailTujuan.latitude}, {detailTujuan.longitude}
                                  </span>
                                  <div className="flex gap-4 border-l border-gray-300 pl-3">
                                    <a
                                      href={`https://www.google.com/maps?q=${detailTujuan.latitude},${detailTujuan.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-semibold"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">map</span>
                                      Google Maps
                                    </a>
                                    <a
                                      href="https://bhumi.atrbpn.go.id/peta"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-semibold"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">public</span>
                                      Portal BHUMI ATR/BPN
                                    </a>
                                  </div>
                                </div>
                                <div className="border border-gray-300 rounded overflow-hidden h-[260px]">
                                  <MapContainer
                                    center={[parseFloat(detailTujuan.latitude), parseFloat(detailTujuan.longitude)]}
                                    zoom={17}
                                    style={{ height: "100%", width: "100%" }}
                                    scrollWheelZoom={false}
                                  >
                                    <LayersControl position="topright">
                                      <LayersControl.BaseLayer name="Google Satellite" checked>
                                        <TileLayer
                                          url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                                          maxZoom={20}
                                          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                          attribution="&copy; Google Maps"
                                        />
                                      </LayersControl.BaseLayer>
                                      <LayersControl.BaseLayer name="Google Streets">
                                        <TileLayer
                                          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                          maxZoom={20}
                                          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                          attribution="&copy; Google Maps"
                                        />
                                      </LayersControl.BaseLayer>
                                    </LayersControl>
                                    <Marker
                                      position={[parseFloat(detailTujuan.latitude), parseFloat(detailTujuan.longitude)]}
                                      icon={dotIcon}
                                    />
                                  </MapContainer>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic text-xs">Koordinat tidak tersedia</span>
                            )}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Batas Utara</td>
                          <td className="p-3 text-black">{detailTujuan.batas_utara || detailTujuan.batas_utara_nop || '-'}</td>
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700 border-l border-gray-100">Batas Selatan</td>
                          <td className="p-3 text-black">{detailTujuan.batas_selatan || detailTujuan.batas_selatan_nop || '-'}</td>
                        </tr>
                        <tr>
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Batas Timur</td>
                          <td className="p-3 text-black">{detailTujuan.batas_timur || detailTujuan.batas_timur_nop || '-'}</td>
                          <td className="p-3 bg-gray-50/50 font-semibold text-gray-700 border-l border-gray-100">Batas Barat</td>
                          <td className="p-3 text-black">{detailTujuan.batas_barat || detailTujuan.batas_barat_nop || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Data Bangunan */}
                  <div className="p-0">
                    <div className="bg-blue-50/50 border-y border-gray-200 px-4 py-2 flex justify-between items-center">
                      <h4 className="text-sm font-bold text-blue-900 m-0">3. Data Bangunan</h4>
                      <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        {detailTujuan.jumlah_bangunan_baru || 0} UNIT ({detailTujuan.luas_bangunan_baru || 0} M&sup2;)
                      </div>
                    </div>

                    <div className="p-0">
                      {Array.isArray(detailTujuan.data_bangunan_json) && detailTujuan.data_bangunan_json.length > 0 ? (
                        <div>
                          {detailTujuan.data_bangunan_json.map((bgn, idx2) => (
                            <div key={idx2} className={idx2 > 0 ? "border-t-2 border-dashed border-gray-200" : ""}>
                              <div className="bg-gray-50/30 border-b border-gray-100 px-4 py-1.5">
                                <h5 className="font-bold text-gray-800 text-xs uppercase">Bangunan Ke-{idx2 + 1}</h5>
                              </div>
                              <table className="w-full text-sm border-collapse">
                                <tbody>
                                  <tr className="border-b border-gray-100">
                                    <td className="p-2 w-1/4 bg-gray-50/50 font-semibold text-gray-700">Penggunaan</td>
                                    <td className="p-2 w-1/4 text-black border-r border-gray-100">{bgn.penggunaan || bgn.jenisPenggunaanBangunan || '-'}</td>
                                    <td className="p-2 w-1/4 bg-gray-50/50 font-semibold text-gray-700">Konstruksi</td>
                                    <td className="p-2 w-1/4 text-black">{bgn.konstruksi || '-'}</td>
                                  </tr>
                                  <tr className="border-b border-gray-100">
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Luas Bangunan</td>
                                    <td className="p-2 text-black border-r border-gray-100">{bgn.luas_bangunan || bgn.luasBangunan || 0} M&sup2;</td>
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Atap</td>
                                    <td className="p-2 text-black">{bgn.atap || '-'}</td>
                                  </tr>
                                  <tr className="border-b border-gray-100">
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Jumlah Lantai</td>
                                    <td className="p-2 text-black border-r border-gray-100">{bgn.jumlah_lantai || bgn.jumlahLantai || 1}</td>
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Dinding</td>
                                    <td className="p-2 text-black">{bgn.dinding || '-'}</td>
                                  </tr>
                                  <tr className="border-b border-gray-100">
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Tahun Dibangun</td>
                                    <td className="p-2 text-black border-r border-gray-100">{bgn.tahun_dibangun || bgn.tahunDibangun || '-'}</td>
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Lantai</td>
                                    <td className="p-2 text-black">{bgn.lantai || '-'}</td>
                                  </tr>
                                  <tr className="border-b border-gray-100">
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Tahun Renovasi</td>
                                    <td className="p-2 text-black border-r border-gray-100">{bgn.tahun_direnovasi || bgn.tahunDirenovasi || '-'}</td>
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Langit-Langit</td>
                                    <td className="p-2 text-black">{bgn.langit_langit || bgn.langitLangit || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Kondisi</td>
                                    <td className="p-2 text-black border-r border-gray-100">{bgn.kondisi || '-'}</td>
                                    <td className="p-2 bg-gray-50/50 font-semibold text-gray-700">Daya Listrik</td>
                                    <td className="p-2 text-black">{bgn.daya_listrik || bgn.dayaListrik || 0} Watt</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      ) : (
                        detailTujuan.jumlah_bangunan_baru > 0 && (
                          <div className="p-4 text-gray-600 text-sm italic">
                            Catatan: Jumlah bangunan diisi {detailTujuan.jumlah_bangunan_baru} unit, namun rincian formulir LSPOP (Data Bangunan) tidak dilampirkan secara digital.
                          </div>
                        )
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {/* Lampiran Dokumen */}
        <section className="border border-gray-300">
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-blue-900 uppercase m-0">E. LAMPIRAN DOKUMEN</h3>
          </div>
          <div className="p-0">
            {data.lampiran && data.lampiran.length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-left font-semibold text-gray-700 w-12 border-r border-gray-200">No.</th>
                    <th className="p-3 text-left font-semibold text-gray-700 border-r border-gray-200">Jenis Dokumen</th>
                    <th className="p-3 text-center font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lampiran.map((lamp, idx) => (
                    <React.Fragment key={lamp.id_dokumen || idx}>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-center border-r border-gray-200">{idx + 1}</td>
                        <td className="p-3 font-bold text-gray-800 border-r border-gray-200">{lamp.jenis_dokumen}</td>
                        <td className="p-3 text-center">
                          <a href={lamp.url_file} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
                            {lamp.url_file?.toLowerCase().endsWith('.pdf') ? 'LIHAT PDF' : 'LIHAT GAMBAR'}
                          </a>
                        </td>
                      </tr>
                      {lamp.url_file && lamp.url_file.match(/\.(jpeg|jpg|gif|png)$/i) && (
                        <tr className="border-b border-gray-200">
                          <td colSpan="3" className="p-4 bg-gray-100 text-center">
                            <img src={lamp.url_file} alt={lamp.jenis_dokumen} className="max-h-96 mx-auto border border-gray-300 shadow-sm" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-sm text-gray-500 italic text-center">Tidak ada lampiran dokumen.</div>
            )}
          </div>
        </section>

        {/* Verification Action Card */}
        {['DISETUJUI', 'DITOLAK', 'REVISI'].includes(data.status_ajuan) ? (
          <section className="border-2 border-black p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-black pb-4">
              <span className={`material-symbols-outlined text-[32px]`}>verified</span>
              <div>
                <h3 className="text-xl font-bold uppercase text-black">
                  Berkas {data.status_ajuan === 'DISETUJUI' ? 'Telah Disetujui' : (data.status_ajuan === 'REVISI' ? 'Dikembalikan untuk Revisi' : 'Ditolak Permanen')}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-black">
              <div>
                <p className="text-[11px] font-bold uppercase mb-1 underline">Diverifikasi Oleh</p>
                <p className="font-semibold text-sm">{data.verifikator?.nama_lengkap || 'Admin Bakeuda'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase mb-1 underline">Waktu Keputusan</p>
                <p className="font-semibold text-sm">{data.verified_at ? new Date(data.verified_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) + ' WIB' : '-'}</p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-[11px] font-bold uppercase mb-2 underline">Catatan Tambahan</p>
                <div className="bg-gray-100 p-4 border border-gray-300">
                  <p className="text-sm">{data.catatan_bakeuda || 'Tidak ada catatan dari verifikator.'}</p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="border border-gray-300 bg-white">
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
              <h3 className="text-base font-bold text-blue-900 uppercase m-0">G. Keputusan Verifikasi Bakeuda</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">Periksa kembali kesesuaian data digital dengan lampiran yang diunggah sebelum mengambil keputusan. Keputusan bersifat final dan akan diteruskan kepada pemohon.</p>

              <div className="space-y-6">
                {isBakeuda && data.status_ajuan === 'PROSES' && ['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi) && (
                  <div className="p-4 border border-blue-200 bg-blue-50 mb-4">
                    <h4 className="font-bold text-blue-900 mb-2 uppercase">
                      Penetapan NOP Baru
                    </h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Pastikan Kecamatan dan Desa sudah benar. Anda hanya perlu mengisi <b>Kode Blok</b>. Nomor Urut akan dihitung otomatis oleh sistem.
                    </p>

                    {/* Wilayah Input (Auto) */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Kecamatan</label>
                        <input
                          type="text"
                          value={selectedKecamatan || 'Mendeteksi...'}
                          disabled
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Desa/Kel</label>
                        <input
                          type="text"
                          value={selectedKelurahan || 'Mendeteksi...'}
                          disabled
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium bg-gray-50 text-gray-600"
                        />
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
                        <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200 mt-0.5">
                          <button
                            type="button"
                            onClick={() => setKodeJenisOp('0')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${kodeJenisOp === '0' ? 'bg-white shadow-sm text-blue-700 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            0 - Bumi
                          </button>
                          <button
                            type="button"
                            onClick={() => setKodeJenisOp('1')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${kodeJenisOp === '1' ? 'bg-white shadow-sm text-blue-700 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            1 - Bangunan
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-3 bg-white border border-dashed border-blue-300 rounded-md px-3 py-2 flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="text-[11px] font-bold text-blue-500 uppercase">Preview NOP:</span>
                      <span className="font-mono font-bold text-blue-900 ml-0 sm:ml-2">
                        {(() => {
                          const matched = allWilayah.find(w => w.nama_desa === selectedKelurahan && w.kecamatan === selectedKecamatan);
                          const kw = matched?.kode_wilayah || '3303XXXXXX';
                          const fw = `${kw.substring(0, 2)}.${kw.substring(2, 4)}.${kw.substring(4, 7)}.${kw.substring(7, 10)}`;
                          return `${fw}.${kodeBlok || '___'}.AUTO.${kodeJenisOp}`;
                        })()}
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

              {/* Action Buttons */}
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDecision('DISETUJUI')}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-semibold text-sm py-2.5 px-5 hover:bg-blue-100 transition-colors border border-blue-300 rounded"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Setujui Pengajuan
                  </button>
                  <button
                    onClick={() => handleDecision('REVISI')}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-50 text-amber-700 font-semibold text-sm py-2.5 px-5 hover:bg-amber-100 transition-colors border border-amber-300 rounded"
                  >
                    <span className="material-symbols-outlined text-[18px]">undo</span>
                    Kembalikan untuk Revisi
                  </button>
                  <button
                    onClick={() => handleDecision('DITOLAK')}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 font-semibold text-sm py-2.5 px-5 hover:bg-red-100 transition-colors border border-red-300 rounded"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Tolak Permanen
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  * Keputusan yang diambil bersifat permanen dan tidak dapat dibatalkan.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-300 text-center pb-8">
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
          &copy; 2026 Badan Keuangan Daerah (BKD) Kabupaten Purbalingga. Hak Cipta Dilindungi.
        </p>
      </footer>

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-transform duration-300 z-50 ${showToast ? 'translate-y-0' : 'translate-y-28'
          }`}
      >
        <span className="material-symbols-outlined text-secondary-fixed">info</span>
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </main>
  );
}

