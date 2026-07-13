import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PaperHeader from '../components/PaperHeader';
import SegmentedNOPInput from '../components/SegmentedNOPInput';
import api from '../utils/axios';
import ToastNotification from '../components/ToastNotification';

// Fix leaflet icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function FormulirSPOP() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [nopAsalList, setNopAsalList] = useState(['33.03.']);
  const [spptLama, setSpptLama] = useState('');

  const [formData, setFormData] = useState({
    kategoriTransaksi: '',
    transaksi: '',
    nop: {
      prov: '33',
      kab: '03',
      kec: '',
      kel: '',
      blok: '',
      nourut: '',
      kode: ''
    },
    nopBersama: {
      prov: '33',
      kab: '03',
      kec: '',
      kel: '',
      blok: '',
      nourut: '',
      kode: ''
    },
    nopAsal: '',
    noSpptLama: '',
    nik: '',
    nama: '',
    npwp: '',
    noTelp: '',
    statusWp: '',
    pekerjaan: '',
    isKuasa: false,
    alamat: '',
    blokKav: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: 'Purbalingga',
    kodePos: '',
    luasTanah: '',
    jenisTanah: '',
    alamatObjek: '',
    noPersil: '',
    blokKavObjek: '',
    rwObjek: '',
    rtObjek: '',
    kelurahanObjek: '',
    zonaNilaiTanah: '',
    jalan_op: '',
    rt_op: '',
    rw_op: '',
    estimasiNjop: '',
    luasBangunan: '',
    jumlahBangunan: '0',
    latitude: '',
    longitude: '',
    batasUtara: '',
    batasSelatan: '',
    batasTimur: '',
    batasBarat: '',
    persetujuan: false,
    lampiran: []
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);

      setTimeout(() => {
        setIsUploading(false);
        const dummyUrl = `https://dummyimage.com/600x400/004b3a/fff&text=${encodeURIComponent(file.name)}`;

        setFormData(prev => ({
          ...prev,
          lampiran: [...prev.lampiran, { jenis_dokumen: "Sertifikat/KTP/Lainnya", url_file: dummyUrl }]
        }));
      }, 1500);
    }
  };

  const defaultPosition = [-7.3878, 109.3639]; // Purbalingga
  const currentPosition = formData.latitude && formData.longitude 
    ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
    : defaultPosition;

  const handleMapClick = (pos) => {
    setFormData(prev => ({ ...prev, latitude: pos[0].toString(), longitude: pos[1].toString() }));
  };

  const handleNopChange = (nopObj) => {
    setFormData(prev => ({ ...prev, nop: nopObj }));
  };

  const handleTextChange = (field, e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleNopAsalChange = (index, val) => {
    if (!val.startsWith('33.03.')) {
      if (val.length < 6) {
        setNopAsalList(prev => prev.map((item, i) => i === index ? '33.03.' : item));
        return;
      }
    }

    let raw = val.replace(/\D/g, '');
    if (raw.startsWith('3303')) raw = raw.substring(4);
    raw = '3303' + raw;
    raw = raw.substring(0, 18);

    let formatted = '';
    if (raw.length > 0) formatted += raw.substring(0, 2);
    if (raw.length > 2) formatted += '.' + raw.substring(2, 4);
    if (raw.length > 4) formatted += '.' + raw.substring(4, 7);
    if (raw.length > 7) formatted += '.' + raw.substring(7, 10);
    if (raw.length > 10) formatted += '.' + raw.substring(10, 13);
    if (raw.length > 13) formatted += '.' + raw.substring(13, 17);
    if (raw.length > 17) formatted += '.' + raw.substring(17, 18);

    setNopAsalList(prev => prev.map((item, i) => i === index ? formatted : item));
  };
  
  const addNopAsal = () => setNopAsalList(prev => [...prev, '33.03.']);
  const removeNopAsal = (index) => setNopAsalList(prev => prev.filter((_, i) => i !== index));

  const handleSpptLamaChange = (e) => {
    // Ambil angka saja, batasi maksimal 9 digit
    let raw = e.target.value.replace(/\D/g, '').substring(0, 9);

    // Rakit kembali format XXX.XXX.XXX
    let formatted = '';
    if (raw.length > 0) formatted += raw.substring(0, 3);
    if (raw.length > 3) formatted += '.' + raw.substring(3, 6);
    if (raw.length > 6) formatted += '.' + raw.substring(6, 9);

    setSpptLama(formatted);
  };

  const formatNOPString = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 18);
    let res = '';
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4 || i === 7 || i === 10 || i === 13 || i === 17) res += '.';
      res += digits[i];
    }
    return res;
  };

  const formatSPPTString = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 9);
    let res = '';
    for (let i = 0; i < digits.length; i++) {
      if (i === 3 || i === 6) res += '.';
      res += digits[i];
    }
    return res;
  };
  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.kategoriTransaksi) newErrors.transaksi = 'Pilih kategori pendaftaran';
      if (!formData.transaksi) newErrors.transaksi = 'Pilih jenis transaksi secara spesifik';
      
      if (['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(formData.transaksi)) {
        const nopObj = formData.nop;
        const nopString = `${nopObj.prov}${nopObj.kab}${nopObj.kec}${nopObj.kel}${nopObj.blok}${nopObj.nourut}${nopObj.kode}`;
        if (nopString.length !== 18) newErrors.nop = 'NOP Utama harus 18 digit angka yang lengkap';
      }

      if (['PECAH', 'GABUNG'].includes(formData.transaksi)) {
        const isEmpty = nopAsalList.some(nop => nop.replace(/\D/g, '').length !== 18);
        if (isEmpty) newErrors.nopAsal = 'Semua NOP Asal wajib 18 digit angka';
      }
    } else if (currentStep === 2) {
      if (!formData.nik || formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) newErrors.nik = 'NIK wajib 16 digit angka';
      if (!formData.nama.trim()) newErrors.nama = 'Nama Wajib Pajak wajib diisi';
      if (!formData.statusWp) newErrors.statusWp = 'Pilih Status WP';
      if (!formData.pekerjaan) newErrors.pekerjaan = 'Pilih Pekerjaan';
      if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
      if (!formData.kelurahan.trim()) newErrors.kelurahan = 'Kelurahan wajib diisi';
      if (!formData.kabupaten.trim()) newErrors.kabupaten = 'Kabupaten wajib diisi';
      if (!formData.kodePos || formData.kodePos.length !== 5 || !/^\d+$/.test(formData.kodePos)) newErrors.kodePos = 'Kode Pos wajib 5 digit angka';
    } else if (currentStep === 3) {
      if (!formData.alamatObjek.trim()) newErrors.alamatObjek = 'Jalan (Alamat Objek Pajak) wajib diisi';
      if (!formData.kelurahanObjek.trim()) newErrors.kelurahanObjek = 'Kelurahan / Desa wajib diisi';
      if (!formData.luasTanah || parseFloat(formData.luasTanah) <= 0) newErrors.luasTanah = 'Luas Tanah wajib diisi dengan angka > 0';
      if (!formData.jenisTanah) newErrors.jenisTanah = 'Pilih Jenis Tanah';
      if (formData.jenisTanah === 'TANAH_BANGUNAN' && (!formData.luasBangunan || parseFloat(formData.luasBangunan) <= 0)) {
        newErrors.luasBangunan = 'Luas Bangunan wajib diisi jika Jenis Tanah adalah Tanah + Bangunan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (step < 5) setStep(step + 1);
    } else {
      setToast({ show: true, message: 'Mohon lengkapi dan perbaiki isian form yang diberi tanda merah.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    }
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      setToast({ show: true, message: 'Pastikan semua data sudah benar sebelum disubmit.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const nopObj = formData.nop;
      const nopBersamaObj = formData.nopBersama;

      const nop = `${nopObj.prov}${nopObj.kab}${nopObj.kec || '000'}${nopObj.kel || '000'}${nopObj.blok || '000'}${nopObj.nourut || '0000'}${nopObj.kode || '0'}`;
      const rawNop = nop.replace(/\D/g, '');
      
      const nopBersama = `${nopBersamaObj.prov || ''}${nopBersamaObj.kab || ''}${nopBersamaObj.kec || ''}${nopBersamaObj.kel || ''}${nopBersamaObj.blok || ''}${nopBersamaObj.nourut || ''}${nopBersamaObj.kode || ''}`;
      const rawNopBersama = nopBersama.replace(/\D/g, '');
      
      const rawNopAsalList = nopAsalList.map(n => n.replace(/\D/g, '')).filter(n => n.length >= 18);

      const jenis_layanan = formData.transaksi || 'BARU';

      const mapStatusWp = { 'Pemilik': 'PEMILIK', 'Penyewa': 'PENYEWA', 'Pengelola': 'PENGELOLA', 'Pemakai': 'PEMAKAI', 'Sengketa': 'SENGKETA' };
      const mapPekerjaan = { 'PNS': 'PNS', 'ABRI': 'ABRI', 'Pensiunan': 'PENSIUNAN', 'Badan': 'BADAN', 'Lainnya': 'LAINNYA' };
      const mapJenisTanah = { 'Tanah + Bangunan': 'TANAH_BANGUNAN', 'Kavling Siap Bangun': 'KAVLING_SIAP_BANGUN', 'Tanah Kosong': 'TANAH_KOSONG', 'Fasilitas Umum': 'FASILITAS_UMUM' };

      const payload = {
        jenis_layanan,
        nop_utama: rawNop,
        nop_bersama: rawNopBersama.length >= 18 ? rawNopBersama : undefined,
        nop_asal: rawNopAsalList.length > 0 ? rawNopAsalList : undefined,
        no_sppt_lama: spptLama || undefined,
        is_draft: false,
        is_kuasa: formData.isKuasa,
        subjek_pajak: {
          nik: formData.nik,
          nama: formData.nama,
          npwp: formData.npwp || undefined,
          no_hp: formData.noTelp || undefined,
          status_wp: mapStatusWp[formData.statusWp] || 'PEMILIK',
          pekerjaan: mapPekerjaan[formData.pekerjaan] || 'LAINNYA',
          alamat: formData.alamat,
          blok_kav_no: formData.blokKav || undefined,
          rt: formData.rt || '000',
          rw: formData.rw || '000',
          kode_pos: formData.kodePos || undefined,
          kelurahan: formData.kelurahan,
          kecamatan: formData.kecamatan || 'Purbalingga',
          kabupaten: formData.kabupaten
        },
        objek_pajak_sementara: {
          jalan_op: formData.alamatObjek,
          blok_kav_no_op: formData.blokKavObjek || undefined,
          rt_op: formData.rtObjek || '000',
          rw_op: formData.rwObjek || '000',
          kelurahan_op: formData.kelurahanObjek || formData.kelurahan,
          kecamatan_op: formData.kecamatanObjek || 'Purbalingga',
          luas_tanah: Number(formData.luasTanah),
          luas_bangunan: mapJenisTanah[formData.jenisTanah] === 'TANAH_BANGUNAN' ? (parseFloat(formData.luasBangunan) || 0) : 0,
          jumlah_bangunan: mapJenisTanah[formData.jenisTanah] === 'TANAH_BANGUNAN' ? (parseInt(formData.jumlahBangunan) || 0) : 0,
          jenis_tanah: mapJenisTanah[formData.jenisTanah] || 'TANAH_KOSONG',
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined,
          batas_utara_nop: formData.batasUtara || undefined,
          batas_selatan_nop: formData.batasSelatan || undefined,
          batas_timur_nop: formData.batasTimur || undefined,
          batas_barat_nop: formData.batasBarat || undefined
        },
        lampiran: formData.lampiran.length > 0 ? formData.lampiran : undefined,
      };

      const response = await api.post('/transaksi-spop', payload);
      const result = response.data;
      setSubmitResult(result);

      // Simpan data ke localStorage agar FormulirLSPOP bisa mengaksesnya
      const finalNop = `${nopObj.prov}.${nopObj.kab}.${nopObj.kec || '000'}.${nopObj.kel || '000'}.${nopObj.blok || '000'}-${nopObj.nourut || '0000'}.${nopObj.kode || '0'}`;
      localStorage.setItem('lspop_nop', finalNop);
      localStorage.setItem('lspop_total_bangunan', formData.jumlahBangunan || '0');

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(5);
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Gagal mengirim SPOP';
      setSubmitError(errorMsg);
      setToast({ show: true, message: typeof errorMsg === 'string' ? errorMsg : 'Gagal mengirim SPOP', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, name: 'Informasi Umum' },
    { num: 2, name: 'Subjek Pajak' },
    { num: 3, name: 'Objek Pajak' },
    { num: 4, name: 'Konfirmasi' },
    { num: 5, name: 'Verifikasi' }
  ];

  return (
    <main className="p-gutter max-w-5xl mx-auto w-full">
      {/* Paper Header Mockup */}
      <PaperHeader />

      {/* Stepper Progress */}
      <div className="flex items-center justify-between mb-12 px-4">
        {steps.map((s, index) => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <React.Fragment key={s.num}>
              <button
                onClick={() => isCompleted && setStep(s.num)}
                disabled={step === 5}
                className={`flex flex-col items-center group cursor-pointer focus:outline-none ${isActive ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-40'
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-transform ${isActive
                    ? 'bg-primary text-on-primary scale-110 shadow-md'
                    : isCompleted
                      ? 'bg-secondary text-on-secondary hover:scale-105'
                      : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={`font-label-sm text-xs sm:text-sm ${isActive ? 'text-primary font-bold' : isCompleted ? 'text-secondary font-semibold' : 'text-on-surface-variant'
                    }`}
                >
                  {s.name}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mb-6 mx-2 transition-colors duration-300 ${step > s.num ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Content Canvas */}
      <div className="bg-white border border-outline-variant rounded-xl p-6 md:p-10 shadow-sm">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-section-gap">
          {/* STEP 1: INFORMASI UMUM */}
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 bg-primary h-8 rounded-full"></div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
                    1. JENIS TRANSAKSI &amp; NOP
                  </h4>
                </div>
                <div className="space-y-8">
                  {/* Jenis Transaksi */}
                  <div className="space-y-4">
                    <label className="font-label-sm text-primary block font-bold">Pilih Jenis Transaksi</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { val: 'baru', title: 'Perekaman Baru', desc: 'Mendaftarkan objek pajak yang belum terdata', icon: 'add_box' },
                        { val: 'update', title: 'Pemutakhiran Data', desc: 'Memperbarui data objek pajak lama', icon: 'update' },
                        { val: 'hapus', title: 'Penghapusan Data', desc: 'Menghapus data objek dari sistem', icon: 'delete' }
                      ].map((t) => (
                        <label
                          key={t.val}
                          className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.kategoriTransaksi === t.val
                            ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary'
                            : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low hover:shadow-sm'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.kategoriTransaksi === t.val ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                              <span className="material-symbols-outlined">{t.icon}</span>
                            </div>
                            <input
                              type="radio"
                              name="kategoriTransaksi"
                              value={t.val}
                              checked={formData.kategoriTransaksi === t.val}
                              onChange={(e) => {
                                handleTextChange('kategoriTransaksi', e);
                                if (e.target.value === 'hapus') {
                                  handleTextChange('transaksi', { target: { value: 'HAPUS' } });
                                } else {
                                  handleTextChange('transaksi', { target: { value: '' } });
                                }
                              }}
                              className="w-5 h-5 text-primary focus:ring-primary border-outline-variant"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-on-surface block text-base">{t.title}</span>
                            <span className="text-sm text-on-surface-variant mt-1 block leading-relaxed">{t.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.transaksi && <p className="text-error text-sm mt-1">{errors.transaksi}</p>}

                    {formData.kategoriTransaksi === 'baru' && (
                      <div className="mt-4 p-4 border rounded-xl bg-surface-container-low border-primary/20">
                        <label className="font-bold text-sm block mb-3 text-primary">Kondisi Pendaftaran (Pilih salah satu):</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {[
                            { val: 'BARU', label: 'Murni (Belum Pernah Terdaftar)' },
                            { val: 'PECAH', label: 'Hasil Pemecahan (Split)' },
                            { val: 'GABUNG', label: 'Hasil Penggabungan' }
                          ].map(opt => (
                            <label key={opt.val} className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-surface-container-high">
                              <input 
                                type="radio" name="transaksi" value={opt.val} 
                                checked={formData.transaksi === opt.val} 
                                onChange={(e) => handleTextChange('transaksi', e)}
                                className="text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-medium">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.kategoriTransaksi === 'update' && (
                      <div className="mt-4 p-4 border rounded-xl bg-surface-container-low border-primary/20">
                        <label className="font-bold text-sm block mb-3 text-primary">Jenis Pemutakhiran (Pilih salah satu):</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {[
                            { val: 'MUTASI', label: 'Balik Nama / Jual Beli (Mutasi)' },
                            { val: 'PERUBAHAN_DATA', label: 'Ralat Luas / Alamat (Perubahan Data)' }
                          ].map(opt => (
                            <label key={opt.val} className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-surface-container-high">
                              <input 
                                type="radio" name="transaksi" value={opt.val} 
                                checked={formData.transaksi === opt.val} 
                                onChange={(e) => handleTextChange('transaksi', e)}
                                className="text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-medium">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NOP Section */}
                  {['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(formData.transaksi) && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto pb-4 custom-scrollbar">
                        <div className="bg-surface-container-low p-4 sm:p-6 rounded-xl border border-outline-variant min-w-max">
                          <div className="space-y-4">
                            <SegmentedNOPInput
                              value={formData.nop}
                              onChange={(val) => setFormData(prev => ({ ...prev, nop: val }))}
                              label="NOP"
                              showHeaders={true}
                            />
                            <SegmentedNOPInput
                              value={formData.nopBersama}
                              onChange={(val) => setFormData(prev => ({ ...prev, nopBersama: val }))}
                              label="NOP BERSAMA"
                              showHeaders={false}
                            />
                          </div>
                          {errors.nop && <p className="text-error text-sm font-bold mt-3 text-center">{errors.nop}</p>}
                        </div>
                      </div>

                      <div className="p-4 bg-tertiary-fixed rounded border border-tertiary/20 max-w-3xl">
                        <div className="flex gap-2 items-start">
                          <span className="material-symbols-outlined text-tertiary">info</span>
                          <div>
                            <p className="font-label-sm text-tertiary">Peringatan</p>
                            <p className="text-[12px] text-tertiary leading-tight">
                              Pastikan NOP sesuai dengan SPPT tahun pajak berjalan untuk mempermudah proses verifikasi otomatis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <hr className="border-outline-variant opacity-50" />

              <section className="bg-surface-container-low p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="font-section-header text-section-header font-bold text-on-surface-variant uppercase">
                    A. INFORMASI TAMBAHAN UNTUK DATA BARU
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Input NOP ASAL */}
                  {['PECAH', 'GABUNG'].includes(formData.transaksi) && (
                    <div className="flex flex-col gap-3 col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-primary uppercase">NOP Asal {formData.transaksi === 'GABUNG' ? '(Minimal 2 NOP)' : ''}</label>
                        {formData.transaksi === 'GABUNG' && (
                          <button type="button" onClick={addNopAsal} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary/20">
                            + Tambah NOP Asal
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {nopAsalList.map((nop, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={nop}
                              onChange={(e) => handleNopAsalChange(idx, e.target.value)}
                              placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                              className="p-3 border border-outline-variant rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest"
                            />
                            {formData.transaksi === 'GABUNG' && nopAsalList.length > 1 && (
                              <button type="button" onClick={() => removeNopAsal(idx)} className="text-error bg-error/10 p-3 rounded-md hover:bg-error/20">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {errors.nopAsal && <p className="text-error text-sm mt-1">{errors.nopAsal}</p>}
                    </div>
                  )}

                  {/* Input NO SPPT LAMA */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-primary uppercase">No. SPPT Lama</label>
                    <input
                      type="text"
                      value={spptLama}
                      onChange={handleSpptLamaChange}
                      placeholder="XXX.XXX.XXX"
                      className="p-3 border border-outline-variant rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 2: SUBJEK PAJAK */}
          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 bg-primary h-8 rounded-full"></div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    B. DATA SUBJEK PAJAK
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-sm text-primary block">NOMOR KTP (NIK)</label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => handleTextChange('nik', e)}
                      className={`w-full h-12 border ${errors.nik ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono text-lg tracking-widest bg-white transition-all shadow-sm`}
                      placeholder="Masukkan 16 digit NIK"
                    />
                    {errors.nik && <p className="text-error text-[12px]">{errors.nik}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-6">
                  <div className="space-y-4">
                    <label className="font-label-sm text-primary block">STATUS WP</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {[
                        { label: 'Pemilik', val: 'PEMILIK' },
                        { label: 'Penyewa', val: 'PENYEWA' },
                        { label: 'Penggarap', val: 'PENGGARAP' },
                        { label: 'Pemakai', val: 'PEMAKAI' },
                        { label: 'Sengketa', val: 'SENGKETA' },
                      ].map(({ label, val }) => (
                        <label
                          key={val}
                          className={`flex items-center gap-2 p-3 border rounded hover:bg-surface-container-low transition-colors cursor-pointer ${errors.statusWp ? 'border-error' : 'border-outline-variant'}`}
                        >
                          <input
                            type="radio"
                            name="statusWp"
                            value={val}
                            checked={formData.statusWp === val}
                            onChange={(e) => handleTextChange('statusWp', e)}
                            className="w-4 h-4 text-secondary focus:ring-secondary border-outline-variant"
                          />
                          <span className="font-label-sm text-on-surface">{label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.statusWp && <p className="text-error text-[12px] mt-1">{errors.statusWp}</p>}
                  </div>

                  <div className="space-y-4">
                    <label className="font-label-sm text-primary block">PEKERJAAN</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {[
                        { label: 'PNS', val: 'PNS' },
                        { label: 'TNI/POLRI', val: 'TNI_POLRI' },
                        { label: 'Pegawai Swasta', val: 'PEGAWAI_SWASTA' },
                        { label: 'Wiraswasta', val: 'WIRASWASTA' },
                        { label: 'Petani', val: 'PETANI' },
                        { label: 'Nelayan', val: 'NELAYAN' },
                        { label: 'Pensiunan', val: 'PENSIUNAN' },
                        { label: 'Badan', val: 'BADAN' },
                        { label: 'Lainnya', val: 'LAINNYA' },
                      ].map(({ label, val }) => (
                        <label
                          key={val}
                          className={`flex items-center gap-2 p-3 border rounded hover:bg-surface-container-low transition-colors cursor-pointer ${errors.pekerjaan ? 'border-error' : 'border-outline-variant'}`}
                        >
                          <input
                            type="radio"
                            name="pekerjaan"
                            value={val}
                            checked={formData.pekerjaan === val}
                            onChange={(e) => handleTextChange('pekerjaan', e)}
                            className="w-4 h-4 text-secondary focus:ring-secondary border-outline-variant"
                          />
                          <span className="font-label-sm text-on-surface">{label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.pekerjaan && <p className="text-error text-[12px] mt-1">{errors.pekerjaan}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-sm text-primary block">NAMA SUBJEK PAJAK</label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleTextChange('nama', e)}
                      className={`w-full h-12 border ${errors.nama ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-body-md font-bold uppercase tracking-wide bg-white transition-all shadow-sm`}
                      placeholder="Sesuai Sertifikat / KTP"
                    />
                    {errors.nama && <p className="text-error text-[12px]">{errors.nama}</p>}
                    <label className="flex items-center gap-3 cursor-pointer mt-3 p-3 border border-outline-variant rounded hover:bg-surface-container-low transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-primary focus:ring-primary border-outline-variant rounded"
                        checked={formData.isKuasa}
                        onChange={(e) => setFormData(prev => ({ ...prev, isKuasa: e.target.checked }))}
                      />
                      <span className="font-label-sm text-on-surface">Bertindak Selaku Kuasa (Bukan Pemilik Langsung)</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-sm text-primary block">NPWP</label>
                    <input
                      type="text"
                      value={formData.npwp}
                      onChange={(e) => handleTextChange('npwp', e)}
                      className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono text-lg tracking-widest bg-white transition-all shadow-sm focus:border-primary"
                      placeholder="Masukkan NPWP"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-sm text-primary block">No. TELP/HP.</label>
                    <input
                      type="text"
                      value={formData.noTelp}
                      onChange={(e) => handleTextChange('noTelp', e)}
                      className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono text-lg tracking-widest bg-white transition-all shadow-sm focus:border-primary"
                      placeholder="Masukkan No. Telp/HP"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 mt-6">
                  <h5 className="font-section-header text-section-header text-outline border-b pb-2">
                    ALAMAT LENGKAP SUBJEK PAJAK
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">Alamat Subjek Pajak (Jalan)</label>
                      <input
                        type="text"
                        value={formData.alamat}
                        onChange={(e) => handleTextChange('alamat', e)}
                        className={`w-full h-11 border ${errors.alamat ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-body-md bg-white`}
                        placeholder="Jl. Raya Utama No. 123"
                      />
                      {errors.alamat && <p className="text-error text-[12px]">{errors.alamat}</p>}
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">Blok/Kav/Nomor</label>
                      <input
                        type="text"
                        value={formData.blokKav}
                        onChange={(e) => handleTextChange('blokKav', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-body-md bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Contoh: Blok A No. 1"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">RW</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={formData.rw}
                        onChange={(e) => handleTextChange('rw', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 text-center font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="002"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">RT</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={formData.rt}
                        onChange={(e) => handleTextChange('rt', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 text-center font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="001"
                      />
                    </div>
                    <div className="md:col-span-8 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">Kelurahan / Desa</label>
                      <input
                        type="text"
                        value={formData.kelurahan}
                        onChange={(e) => handleTextChange('kelurahan', e)}
                        className={`w-full h-11 border ${errors.kelurahan ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-body-md bg-white`}
                        placeholder="Contoh: Purbalingga Lor"
                      />
                      {errors.kelurahan && <p className="text-error text-[12px]">{errors.kelurahan}</p>}
                    </div>
                    <div className="md:col-span-8 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">Kecamatan</label>
                      <input
                        type="text"
                        value={formData.kecamatan}
                        onChange={(e) => handleTextChange('kecamatan', e)}
                        className={`w-full h-11 border ${errors.kecamatan ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-body-md bg-white`}
                        placeholder="Contoh: Purbalingga"
                      />
                      {errors.kecamatan && <p className="text-error text-[12px]">{errors.kecamatan}</p>}
                    </div>
                    <div className="md:col-span-8 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">Kabupaten / Kota</label>
                      <input
                        type="text"
                        value={formData.kabupaten}
                        onChange={(e) => handleTextChange('kabupaten', e)}
                        className={`w-full h-11 border ${errors.kabupaten ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-body-md bg-white`}
                      />
                      {errors.kabupaten && <p className="text-error text-[12px]">{errors.kabupaten}</p>}
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">Kode Pos</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={formData.kodePos}
                        onChange={(e) => handleTextChange('kodePos', e)}
                        className={`w-full h-11 border ${errors.kodePos ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-data-mono bg-white`}
                        placeholder="53311"
                      />
                      {errors.kodePos && <p className="text-error text-[12px]">{errors.kodePos}</p>}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 3: OBJEK PAJAK */}
          {step === 3 && (
            <div className="space-y-8 animate-fadeIn">
              {/* BAGIAN C */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 bg-primary h-8 rounded-full"></div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    C. DATA LETAK OBJEK PAJAK
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-2">
                    <label className="font-label-sm text-primary block">No. PERSIL</label>
                    <input
                      type="text"
                      value={formData.noPersil}
                      onChange={(e) => handleTextChange('noPersil', e)}
                      className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-8 space-y-2">
                    <label className="font-label-sm text-primary block">JALAN (ALAMAT OBJEK PAJAK)</label>
                    <input
                      type="text"
                      value={formData.alamatObjek}
                      onChange={(e) => handleTextChange('alamatObjek', e)}
                      className={`w-full h-11 border ${errors.alamatObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-body-md bg-white shadow-sm`}
                      placeholder="Contoh: Jl. Merdeka No. 45"
                    />
                    {errors.alamatObjek && <p className="text-error text-[12px]">{errors.alamatObjek}</p>}
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="font-label-sm text-on-surface-variant block">BLOK/KAV/NOMOR</label>
                    <input
                      type="text"
                      value={formData.blokKavObjek}
                      onChange={(e) => handleTextChange('blokKavObjek', e)}
                      className="w-full h-11 border border-outline-variant rounded px-4 font-body-md bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="font-label-sm text-on-surface-variant block">RW</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={formData.rwObjek}
                      onChange={(e) => handleTextChange('rwObjek', e)}
                      className="w-full h-11 border border-outline-variant rounded px-4 text-center font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                      placeholder="002"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="font-label-sm text-on-surface-variant block">RT</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={formData.rtObjek}
                      onChange={(e) => handleTextChange('rtObjek', e)}
                      className="w-full h-11 border border-outline-variant rounded px-4 text-center font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                      placeholder="001"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="font-label-sm text-on-surface-variant block">KELURAHAN/DESA</label>
                    <input
                      type="text"
                      value={formData.kelurahanObjek}
                      onChange={(e) => handleTextChange('kelurahanObjek', e)}
                      className={`w-full h-11 border ${errors.kelurahanObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-body-md bg-white shadow-sm`}
                      placeholder="Contoh: Purbalingga Lor"
                    />
                    {errors.kelurahanObjek && <p className="text-error text-[12px]">{errors.kelurahanObjek}</p>}
                  </div>
                </div>
              </section>

              {/* BAGIAN D */}
              <section className="space-y-6 pt-8 border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-1 bg-primary h-8 rounded-full"></div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    D. DATA TANAH
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-sm text-primary block">LUAS TANAH (M²)</label>
                    <input
                      type="number"
                      value={formData.luasTanah}
                      onChange={(e) => handleTextChange('luasTanah', e)}
                      className={`w-full h-12 border ${errors.luasTanah ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm`}
                      placeholder="Contoh: 150"
                    />
                    {errors.luasTanah && <p className="text-error text-[12px]">{errors.luasTanah}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-sm text-primary block">ZONA NILAI TANAH</label>
                    <input
                      type="text"
                      value={formData.zonaNilaiTanah}
                      onChange={(e) => handleTextChange('zonaNilaiTanah', e)}
                      className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono bg-surface-container-lowest focus:border-primary shadow-sm"
                      placeholder="Diisi oleh Petugas"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="font-label-sm text-primary block">JENIS TANAH</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Tanah + Bangunan', val: 'TANAH_BANGUNAN' },
                        { label: 'Tanah Pertanian', val: 'TANAH_PERTANIAN' },
                        { label: 'Tanah Perkebunan', val: 'TANAH_PERKEBUNAN' },
                        { label: 'Tanah Kehutanan', val: 'TANAH_KEHUTANAN' },
                        { label: 'Lainnya', val: 'TANAH_LAINNYA' },
                      ].map(({ label, val }) => (
                        <label
                          key={val}
                          className={`flex items-center gap-2 p-3 border rounded hover:bg-surface-container-low transition-colors cursor-pointer ${errors.jenisTanah ? 'border-error' : 'border-outline-variant'}`}
                        >
                          <input
                            type="radio"
                            name="jenisTanah"
                            value={val}
                            checked={formData.jenisTanah === val}
                            onChange={(e) => handleTextChange('jenisTanah', e)}
                            className="w-4 h-4 text-secondary focus:ring-secondary border-outline-variant flex-shrink-0"
                          />
                          <span className="font-label-sm text-on-surface leading-snug">{label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.jenisTanah && <p className="text-error text-[12px] mt-1">{errors.jenisTanah}</p>}
                  </div>
                </div>

                {/* BAGIAN E: DATA BANGUNAN */}
                <div className="pt-6 border-t border-outline-variant space-y-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 bg-primary h-8 rounded-full"></div>
                    <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                      E. DATA BANGUNAN
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.jenisTanah === 'Tanah + Bangunan' && (
                      <div className="space-y-2">
                        <label className="font-label-sm text-primary block">LUAS BANGUNAN (M²)</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.luasBangunan}
                          onChange={(e) => handleTextChange('luasBangunan', e)}
                          className={`w-full h-12 border ${errors.luasBangunan ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm`}
                          placeholder="Contoh: 100"
                        />
                        {errors.luasBangunan && <p className="text-error text-[12px]">{errors.luasBangunan}</p>}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="font-label-sm text-primary block">JUMLAH BANGUNAN (UNIT)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.jumlahBangunan}
                        onChange={(e) => handleTextChange('jumlahBangunan', e)}
                        className={`w-full h-12 border ${errors.jumlahBangunan ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm`}
                        placeholder="Contoh: 1"
                      />
                    </div>
                  </div>
                  {parseInt(formData.jumlahBangunan) > 0 && (
                    <div className="mt-2 p-3 bg-secondary-container text-on-secondary-container rounded text-sm flex items-start gap-2 max-w-2xl">
                      <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                      <p>Terdapat bangunan pada objek pajak ini. Anda diwajibkan mengisi formulir <b>LSPOP</b> (Lampiran SPOP) untuk pendataan bangunan setelah SPOP disetujui.</p>
                    </div>
                  )}
                </div>

                {/* BATAS-BATAS NOP */}
                <div className="pt-6 border-t border-outline-variant space-y-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 bg-primary h-8 rounded-full"></div>
                    <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                      BATAS-BATAS OBJEK PAJAK (NOP TETANGGA)
                    </h4>
                  </div>
                  <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">BATAS UTARA (NOP)</label>
                      <input
                        type="text"
                        value={formData.batasUtara}
                        onChange={(e) => handleTextChange('batasUtara', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">BATAS SELATAN (NOP)</label>
                      <input
                        type="text"
                        value={formData.batasSelatan}
                        onChange={(e) => handleTextChange('batasSelatan', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">BATAS TIMUR (NOP)</label>
                      <input
                        type="text"
                        value={formData.batasTimur}
                        onChange={(e) => handleTextChange('batasTimur', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">BATAS BARAT (NOP)</label>
                      <input
                        type="text"
                        value={formData.batasBarat}
                        onChange={(e) => handleTextChange('batasBarat', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>

                    {(formData.jenisTanah === 'TANAH_BANGUNAN' || parseInt(formData.jumlahBangunan) > 0) && (
                      <div className="space-y-2">
                        <label className="font-label-sm text-primary block">LUAS BANGUNAN (M²)</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.luasBangunan}
                          onChange={(e) => handleTextChange('luasBangunan', e)}
                          className={`w-full h-12 border ${errors.luasBangunan ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm`}
                          placeholder="Contoh: 45"
                        />
                        {errors.luasBangunan && <p className="text-error text-[12px] mt-1">{errors.luasBangunan}</p>}
                        <p className="text-xs text-on-surface-variant">Total luas seluruh lantai bangunan di atas tanah ini.</p>
                      </div>
                    )}

                    {parseInt(formData.jumlahBangunan) > 0 && (
                      <div className="md:col-span-2 mt-2 p-3 bg-secondary-container text-on-secondary-container rounded text-sm flex items-start gap-2">
                        <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                        <p>Terdapat bangunan pada objek pajak ini. Anda diwajibkan mengisi formulir <b>LSPOP</b> (Lampiran SPOP) untuk pendataan bangunan setelah SPOP disetujui.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SKET / DENAH LOKASI OBJEK PAJAK */}
                <div className="pt-6 border-t border-outline-variant space-y-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 bg-primary h-8 rounded-full"></div>
                    <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                      SKET / DENAH LOKASI (KOORDINAT MAPS)
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-on-surface-variant">Tentukan titik koordinat lokasi objek pajak. Anda dapat menggeser peta di bawah ini lalu klik pada lokasi yang tepat, atau salin koordinat dari Google Maps.</p>

                    <div className="w-full h-[300px] border border-outline-variant rounded overflow-hidden z-0 relative">
                      <MapContainer center={currentPosition} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker position={currentPosition} setPosition={handleMapClick} />
                      </MapContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:w-1/2">
                      <div className="space-y-2">
                        <label className="font-label-sm text-primary block">LATITUDE</label>
                        <input
                          type="text"
                          value={formData.latitude}
                          onChange={(e) => handleTextChange('latitude', e)}
                          className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono bg-white shadow-sm focus:border-primary"
                          placeholder="-7.3878"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-primary block">LONGITUDE</label>
                        <input
                          type="text"
                          value={formData.longitude}
                          onChange={(e) => handleTextChange('longitude', e)}
                          className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono bg-white shadow-sm focus:border-primary"
                          placeholder="109.3639"
                        />
                      </div>
                    </div>

                    {/* Google Street View Placeholder */}
                    <div className="mt-4 p-4 border border-outline-variant border-dashed rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center text-center">
                      <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">streetview</span>
                      <h5 className="font-bold text-on-surface">Pratinjau Foto Jalan (Street View)</h5>
                      <p className="text-sm text-on-surface-variant mt-1 max-w-md">
                        Fitur Street View Google Maps dapat diintegrasikan di sini untuk melihat kondisi jalan dan bangunan secara real-time. (Memerlukan Google Maps API Key khusus).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant space-y-4">
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase mb-4">
                    LAMPIRAN DOKUMEN PENDUKUNG
                  </h4>
                  <div className="space-y-4">
                    {formData.lampiran.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 border border-outline-variant rounded bg-surface-container-low">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">description</span>
                          <div>
                            <p className="font-bold text-sm text-on-surface">{doc.jenis_dokumen} #{idx + 1}</p>
                            <a href={doc.url_file} target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline">Lihat Pratinjau Dummy</a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            lampiran: prev.lampiran.filter((_, i) => i !== idx)
                          }))}
                          className="material-symbols-outlined text-error hover:scale-110 transition-transform"
                        >
                          delete
                        </button>
                      </div>
                    ))}

                    {/* Upload Button */}
                    <div className="relative overflow-hidden w-full sm:w-auto inline-block">
                      <button
                        type="button"
                        disabled={isUploading}
                        className={`flex items-center gap-2 px-6 py-3 rounded border border-dashed border-primary text-primary font-bold hover:bg-primary/10 transition-colors ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <span className="material-symbols-outlined">{isUploading ? 'hourglass_empty' : 'upload_file'}</span>
                        {isUploading ? 'Mengunggah Dokumen...' : '+ Tambah Dokumen Pendukung'}
                      </button>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                    </div>
                    <p className="text-[12px] text-on-surface-variant italic mt-2">
                      *Klik tombol di atas untuk menyimulasikan unggahan file (akan menghasilkan dummy URL image).
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 4: KONFIRMASI */}
          {step === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 bg-primary h-8 rounded-full"></div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    D. TINJAU KEMBALI DATA ANDA
                  </h4>
                </div>
                <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-surface-container border-b border-outline-variant px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="text-outline uppercase text-[10px] font-bold tracking-widest">Jenis Transaksi</p>
                      <p className="font-bold text-primary text-lg uppercase mt-0.5">
                        {formData.transaksi === 'baru' ? 'Perekaman Data Baru' : formData.transaksi === 'update' ? 'Pemutakhiran Data' : 'Penghapusan Data'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-outline uppercase text-[10px] font-bold tracking-widest">NOP Objek Pajak</p>
                      <p className="font-data-mono font-bold text-on-surface text-lg mt-0.5">
                        33.03.{formData.nop.kec || '___'}.{formData.nop.kel || '___'}.{formData.nop.blok || '___'}.{formData.nop.nourut || '____'}.{formData.nop.kode || '_'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h6 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-outline-variant/50 pb-2">Identitas Subjek Pajak</h6>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant w-1/3">Nama Lengkap</td>
                            <td className="py-1.5 font-bold text-on-surface">{formData.nama || '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant">NIK (No. KTP)</td>
                            <td className="py-1.5 font-data-mono text-on-surface">{formData.nik || '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant">Pekerjaan</td>
                            <td className="py-1.5 text-on-surface">{formData.pekerjaan || '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant align-top">Alamat WP</td>
                            <td className="py-1.5 text-on-surface leading-snug">
                              {formData.alamat || '-'}, RT {formData.rt || '-'}/RW {formData.rw || '-'}, {formData.kelurahan || '-'}, {formData.kabupaten}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-4">
                      <h6 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-outline-variant/50 pb-2">Spesifikasi Objek Pajak</h6>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant w-1/3">Alamat Objek</td>
                            <td className="py-1.5 font-bold text-on-surface">{formData.alamatObjek || '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant">Luas Tanah</td>
                            <td className="py-1.5 font-bold text-on-surface">{formData.luasTanah || '-'} M²</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant">Jenis Tanah</td>
                            <td className="py-1.5 text-on-surface">{formData.jenisTanah || '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-on-surface-variant">Titik Koordinat</td>
                            <td className="py-1.5 font-data-mono text-on-surface">{formData.titikKoordinat || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* BAGIAN F: PERNYATAAN SUBJEK PAJAK */}
                <div className="pt-6 border-t border-outline-variant space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 bg-primary h-8 rounded-full"></div>
                    <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                      F. PERNYATAAN SUBJEK PAJAK
                    </h4>
                  </div>
                  <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl space-y-4">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Saya menyatakan bahwa informasi yang telah saya berikan dalam formulir ini termasuk lampirannya adalah <b>benar, jelas, dan lengkap</b> menurut keadaan yang sebenarnya, sesuai dengan Pasal 10 ayat (2) Peraturan Daerah Kabupaten Purbalingga No.15 Tahun 2012.
                    </p>

                    <label className="flex items-start gap-3 cursor-pointer mt-4 p-3 border border-outline-variant rounded hover:bg-surface-container transition-colors">
                      <input
                        type="checkbox"
                        className="w-5 h-5 mt-0.5 text-primary focus:ring-primary border-outline-variant rounded"
                        checked={formData.persetujuan}
                        onChange={(e) => setFormData(prev => ({ ...prev, persetujuan: e.target.checked }))}
                      />
                      <span className="font-bold text-on-surface text-sm">
                        Ya, saya menyetujui pernyataan di atas.
                      </span>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 5: VERIFIKASI / SELESAI */}
          {step === 5 && (
            <div className="space-y-8 text-center py-10 animate-fadeIn bg-surface-container-lowest rounded-2xl">
              <div className="w-24 h-24 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-secondary/20">
                <span className="material-symbols-outlined text-[56px]">check_circle</span>
              </div>
              <h3 className="font-display-lg text-display-lg text-primary uppercase font-extrabold tracking-tight">
                SPOP Berhasil Dikirim
              </h3>
              <p className="text-body-lg font-body-lg text-on-surface-variant max-w-lg mx-auto">
                Formulir SPOP Digital untuk NOP <span className="font-bold text-primary font-data-mono">{`33.03.${formData.nop.kec}.${formData.nop.kel}.${formData.nop.blok}.${formData.nop.nourut}.${formData.nop.kode}`}</span> telah masuk ke sistem antrean validasi BKD Kabupaten Purbalingga.
              </p>

              <div className="bg-surface border border-outline-variant p-6 rounded-xl max-w-md mx-auto text-left space-y-3 mt-6 shadow-sm">
                <div className="flex justify-between items-center text-sm border-b border-outline-variant/50 pb-3">
                  <span className="text-on-surface-variant font-medium">ID Submisi</span>
                  <span className="font-bold text-on-surface font-data-mono bg-surface-container px-2 py-1 rounded">{submitResult?.id_transaksi || 'SPOP-2026-00382'}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-on-surface-variant font-medium">Estimasi Verifikasi</span>
                  <span className="font-bold text-secondary flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                    ± 24 Jam Kerja
                  </span>
                </div>
              </div>

              {parseInt(formData.jumlahBangunan) > 0 && (
                <div className="max-w-lg mx-auto mt-8 p-5 bg-tertiary-container/30 border border-tertiary/20 rounded-xl text-left flex gap-4 items-start shadow-sm">
                  <span className="material-symbols-outlined text-tertiary text-3xl mt-1">info</span>
                  <div>
                    <h4 className="font-bold text-tertiary-dark text-lg mb-1">Tindakan Lanjutan Diperlukan</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Karena objek pajak ini memiliki <strong>{formData.jumlahBangunan} bangunan</strong>, Anda <strong>wajib</strong> mengisi Formulir Lampiran SPOP (LSPOP) untuk mendata spesifikasi bangunan tersebut. Klik tombol di bawah ini untuk melanjutkan.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-10 flex justify-center gap-4 flex-col sm:flex-row">
                <button
                  onClick={() => navigate('/dashboard-desa')}
                  className="px-8 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container hover:text-on-surface hover:border-outline transition-all"
                >
                  Kembali ke Dashboard
                </button>
                {parseInt(formData.jumlahBangunan) > 0 && (
                  <button
                    onClick={() => navigate('/formulir-lspop')}
                    className="px-10 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 animate-bounce hover:animate-none"
                  >
                    <span className="material-symbols-outlined">assignment_add</span>
                    Lanjut Isi LSPOP Sekarang
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {step < 5 && (
            <div className="space-y-6">
              <div className="p-4 bg-surface-container-low rounded-lg border-l-4 border-primary flex gap-4 items-center">
                <span className="material-symbols-outlined text-primary">verified</span>
                <div>
                  <p className="font-label-sm text-primary">Catatan Validasi</p>
                  <p className="text-[13px] text-on-surface-variant">
                    Data yang Anda kirimkan akan melalui proses validasi oleh Admin BKD (Badan Keuangan Daerah) Kabupaten Purbalingga sebelum diterbitkan SPPT resmi.
                  </p>
                </div>
              </div>

              <div className="pt-10 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`w-full md:w-auto px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-surface-container transition-all flex items-center justify-center gap-2 group ${step === 1 ? 'opacity-50 cursor-not-allowed border-outline text-outline' : ''
                    }`}
                >
                  <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                    arrow_back
                  </span>
                  {step === 1 ? 'Batal' : 'Kembali'}
                </button>
                <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
                  <button
                    type="button"
                    onClick={() => alert('Draft formulir berhasil disimpan ke akun Anda.')}
                    className="w-full md:w-auto px-10 py-3 rounded-full bg-surface-container-high text-on-surface-variant font-bold hover:bg-surface-container transition-colors"
                  >
                    Simpan Draft
                  </button>
                  <button
                    type="button"
                    onClick={step === 4 ? handleSubmit : nextStep}
                    disabled={isSubmitting || (step === 4 && !formData.persetujuan)}
                    className={`w-full md:w-auto px-12 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 group ${isSubmitting || (step === 4 && !formData.persetujuan)
                        ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-70'
                        : 'bg-primary text-on-primary hover:shadow-lg hover:brightness-110 active:scale-95'
                      }`}
                  >
                    {isSubmitting ? 'Memproses...' : step === 4 ? 'Submit SPOP' : `Lanjutkan Ke Tahap ${step + 1}`}
                    {!isSubmitting && (
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    )}
                  </button>
                </div>
              </div>
              {submitError && (
                <div className="p-4 bg-error-container text-error rounded mt-4">
                  <strong>Terjadi Kesalahan:</strong> {submitError}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Contextual Information (Bento Style) */}
      {
        step < 5 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-secondary-container p-6 rounded-xl flex items-start gap-4 shadow-sm">
              <div className="bg-white/40 p-3 rounded-lg text-secondary">
                <span className="material-symbols-outlined text-[32px]">verified_user</span>
              </div>
              <div>
                <h5 className="font-headline-md text-headline-md font-bold text-on-secondary-container mb-2">
                  Keamanan Data Terjamin
                </h5>
                <p className="font-body-md text-on-secondary-container opacity-85 leading-snug">
                  Seluruh data yang Anda masukkan dilindungi oleh enkripsi standar pemerintah dan hanya digunakan untuk keperluan perpajakan daerah Kabupaten Purbalingga sesuai regulasi yang berlaku.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-high p-6 rounded-xl flex flex-col justify-between shadow-sm">
              <h6 className="font-section-header text-section-header text-primary mb-4 uppercase">
                Butuh Bantuan?
              </h6>
              <div className="space-y-4">
                <a
                  className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors"
                  href="tel:0281891098"
                >
                  <span className="material-symbols-outlined text-primary">call</span>
                  <span className="font-label-sm">Hotline: (0281) 891098</span>
                </a>
                <a
                  className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors"
                  href="mailto:bakeuda@purbalinggakab.go.id"
                >
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <span className="font-label-sm">bakeuda@purbalinggakab.go.id</span>
                </a>
              </div>
            </div>
          </div>
        )
      }

      {/* Footer Small Print */}
      <footer className="mt-12 pb-12 text-center border-t border-outline-variant pt-8">
        <p className="text-[12px] text-outline">
          *) Khusus untuk PNS/ABRI/Pensiunan yang penghasilannya semata-mata berasal dari gaji atau uang pensiunan.
        </p>
        <p className="mt-4 font-label-sm text-outline">
          SIPD Purbalingga © 2026 - Digitalisasi Layanan Perpajakan Daerah
        </p>
      </footer>

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </main >
  );
}
