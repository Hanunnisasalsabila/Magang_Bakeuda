import React, { useState } from 'react';
import PaperHeader from '../components/PaperHeader';
import SegmentedNOPInput from '../components/SegmentedNOPInput';
import api from '../utils/axios';

export default function FormulirSPOP({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [formData, setFormData] = useState({
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
    statusWp: 'Pemilik',
    pekerjaan: 'PNS',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kabupaten: 'Purbalingga',
    kodePos: '',
    // Step 3 Objek Pajak
    luasTanah: '',
    jenisTanah: 'Darat',
    alamatObjek: '',
    estimasiNjop: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNopChange = (nopObj) => {
    setFormData(prev => ({ ...prev, nop: nopObj }));
  };

  const handleTextChange = (field, e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const formatNOPString = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 18);
    let res = '';
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4 || i === 7 || i === 10) res += '.';
      else if (i === 13) res += '-';
      else if (i === 17) res += '.';
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
      if (!formData.transaksi) newErrors.transaksi = 'Pilih jenis transaksi';
      const nopObj = formData.nop;
      const nopString = `${nopObj.prov}${nopObj.kab}${nopObj.kec}${nopObj.kel}${nopObj.blok}${nopObj.nourut}${nopObj.kode}`;
      if (nopString.length !== 18) newErrors.nop = 'NOP harus 18 digit angka yang lengkap';
    } else if (currentStep === 2) {
      if (!formData.nik || formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) newErrors.nik = 'NIK wajib 16 digit angka';
      if (!formData.nama.trim()) newErrors.nama = 'Nama Wajib Pajak wajib diisi';
      if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
      if (!formData.kelurahan.trim()) newErrors.kelurahan = 'Kelurahan wajib diisi';
      if (!formData.kabupaten.trim()) newErrors.kabupaten = 'Kabupaten wajib diisi';
      if (!formData.kodePos || formData.kodePos.length !== 5 || !/^\d+$/.test(formData.kodePos)) newErrors.kodePos = 'Kode Pos wajib 5 digit angka';
    } else if (currentStep === 3) {
      if (!formData.luasTanah || parseFloat(formData.luasTanah) <= 0) newErrors.luasTanah = 'Luas Tanah wajib diisi dengan angka > 0';
      if (!formData.alamatObjek.trim()) newErrors.alamatObjek = 'Alamat lengkap objek pajak wajib diisi';
      if (!formData.estimasiNjop || parseFloat(formData.estimasiNjop) <= 0) newErrors.estimasiNjop = 'Estimasi NJOP wajib diisi dengan angka > 0';
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
    try {
      const nopObj = formData.nop;
      const nopBersamaObj = formData.nopBersama;
      const nop = `${nopObj.prov}.${nopObj.kab}.${nopObj.kec || '000'}.${nopObj.kel || '000'}.${nopObj.blok || '000'}-${nopObj.nourut || '0000'}.${nopObj.kode || '0'}`;
      const nopBersama = `${nopBersamaObj.prov}.${nopBersamaObj.kab}.${nopBersamaObj.kec || '000'}.${nopBersamaObj.kel || '000'}.${nopBersamaObj.blok || '000'}-${nopBersamaObj.nourut || '0000'}.${nopBersamaObj.kode || '0'}`;

      let jenis_transaksi = 'BARU';
      if (formData.transaksi === 'update') jenis_transaksi = 'PERUBAHAN_DATA';
      if (formData.transaksi === 'hapus') jenis_transaksi = 'MUTASI';

      const payload = {
        jenis_transaksi,
        tahun_pajak: new Date().getFullYear(),
        nop_bersama: nopBersama,
        no_sppt_lama: formData.noSpptLama,
        nama_pengaju: formData.nama,
        detail_asal: formData.nopAsal ? [{ nop_asal: formData.nopAsal }] : [],
        detail_tujuan: [{
          nik_calon_subjek: formData.nik,
          luas_tanah_baru: parseFloat(formData.luasTanah) || 0,
          luas_bangunan_baru: 0,
          jumlah_bangunan_baru: 0,
          jenis_tanah_baru: formData.jenisTanah,
          nop_generated: nop,
        }]
      };

      await api.post('/transaksi-spop', payload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(5);
    } catch (error) {
      console.error('Gagal mengirim form:', error);
      setToast({ show: true, message: error.response?.data?.message || 'Gagal mengirim formulir. Pastikan koneksi dan data Anda valid.', type: 'error' });
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
                className={`flex flex-col items-center group cursor-pointer focus:outline-none ${
                  isActive ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-transform ${
                    isActive
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
                  className={`font-label-sm text-xs sm:text-sm ${
                    isActive ? 'text-primary font-bold' : isCompleted ? 'text-secondary font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  {s.name}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mb-6 mx-2 transition-colors duration-300 ${
                    step > s.num ? 'bg-secondary' : 'bg-outline-variant'
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
                  <div className="space-y-4 max-w-3xl">
                    <label className="font-label-sm text-primary block font-bold">Pilih Jenis Transaksi</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {[
                        { val: 'baru', label: '1. Perekaman Data/Objek Baru' },
                        { val: 'update', label: '2. Pemutakhiran Data/Update Data Lama' },
                        { val: 'hapus', label: '3. Penghapusan Data' }
                      ].map((t) => (
                        <label
                          key={t.val}
                          className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-colors flex-1 ${
                            formData.transaksi === t.val 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-outline-variant hover:bg-surface-container-low'
                          }`}
                        >
                          <input
                            type="radio"
                            name="transaksi"
                            value={t.val}
                            checked={formData.transaksi === t.val}
                            onChange={(e) => handleTextChange('transaksi', e)}
                            className="w-5 h-5 text-primary focus:ring-primary border-outline-variant"
                          />
                          <span className="font-body-md text-on-surface font-semibold">{t.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.transaksi && <p className="text-error text-sm mt-1">{errors.transaksi}</p>}
                  </div>

                  {/* NOP Section */}
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
                </div>
              </section>

              <hr className="border-outline-variant opacity-50" />

              <section className="bg-surface-container-low p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="font-section-header text-section-header font-bold text-on-surface-variant uppercase">
                    A. INFORMASI TAMBAHAN UNTUK DATA BARU
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-sm text-on-surface block font-bold">NOP ASAL</label>
                    <input
                      type="text"
                      value={formData.nopAsal}
                      onChange={(e) => setFormData(prev => ({ ...prev, nopAsal: formatNOPString(e.target.value) }))}
                      className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary tracking-widest"
                      placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-sm text-on-surface block font-bold">NO. SPPT LAMA</label>
                    <input
                      type="text"
                      value={formData.noSpptLama}
                      onChange={(e) => setFormData(prev => ({ ...prev, noSpptLama: formatSPPTString(e.target.value) }))}
                      className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary tracking-widest"
                      placeholder="XXX.XXX.XXX"
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
                  <div className="space-y-2">
                    <label className="font-label-sm text-primary block">NAMA SUBJEK PAJAK</label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleTextChange('nama', e)}
                      className={`w-full h-12 border ${errors.nama ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-body-md font-bold uppercase tracking-wide bg-white transition-all shadow-sm`}
                      placeholder="Sesuai Sertifikat / KTP"
                    />
                    {errors.nama && <p className="text-error text-[12px]">{errors.nama}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="font-label-sm text-primary block">STATUS WP (WAJIB PAJAK)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Pemilik', 'Penyewa', 'Pengelola', 'Pemakai'].map((status, idx) => (
                        <label
                          key={status}
                          className="flex items-center gap-2 p-3 border border-outline-variant rounded hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="statusWp"
                            value={status}
                            checked={formData.statusWp === status}
                            onChange={(e) => handleTextChange('statusWp', e)}
                            className="w-4 h-4 text-secondary focus:ring-secondary border-outline-variant"
                          />
                          <span className="font-label-sm text-on-surface">{idx + 1}. {status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="font-label-sm text-primary block">PEKERJAAN</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['PNS', 'ABRI', 'Pensiunan', 'Badan / Swasta'].map((job, idx) => (
                        <label
                          key={job}
                          className="flex items-center gap-2 p-3 border border-outline-variant rounded hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="pekerjaan"
                            value={job}
                            checked={formData.pekerjaan === job}
                            onChange={(e) => handleTextChange('pekerjaan', e)}
                            className="w-4 h-4 text-secondary focus:ring-secondary border-outline-variant"
                          />
                          <span className="font-label-sm text-on-surface">{idx + 1}. {job}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h5 className="font-section-header text-section-header text-outline border-b pb-2">
                    ALAMAT LENGKAP SUBJEK PAJAK
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 space-y-2">
                      <label className="font-label-sm text-on-surface-variant block">Jalan / Dusun / Nama Jalan</label>
                      <input
                        type="text"
                        value={formData.alamat}
                        onChange={(e) => handleTextChange('alamat', e)}
                        className={`w-full h-11 border ${errors.alamat ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-body-md bg-white`}
                        placeholder="Jl. Raya Utama No. 123"
                      />
                      {errors.alamat && <p className="text-error text-[12px]">{errors.alamat}</p>}
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
                    <div className="md:col-span-4 space-y-2">
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
                    <div className="md:col-span-4 space-y-2">
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
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 bg-primary h-8 rounded-full"></div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                    C. DATA OBJEK PAJAK
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
                    <label className="font-label-sm text-primary block">JENIS TANAH</label>
                    <select
                      value={formData.jenisTanah}
                      onChange={(e) => handleTextChange('jenisTanah', e)}
                      className="w-full h-12 border border-outline-variant rounded px-4 font-body-md bg-white focus:border-primary shadow-sm"
                    >
                      <option>Darat</option>
                      <option>Sawah</option>
                      <option>Rawa</option>
                      <option>Tambak/Kolam</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="font-label-sm text-primary block">ALAMAT LENGKAP OBJEK PAJAK</label>
                    <textarea
                      rows={3}
                      value={formData.alamatObjek}
                      onChange={(e) => handleTextChange('alamatObjek', e)}
                      className={`w-full border ${errors.alamatObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded p-4 font-body-md bg-white shadow-sm`}
                      placeholder="Masukkan alamat fisik detail objek pajak tanah/bangunan..."
                    />
                    {errors.alamatObjek && <p className="text-error text-[12px]">{errors.alamatObjek}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-sm text-primary block">ESTIMASI NJOP RP. (PER M²)</label>
                    <input
                      type="number"
                      value={formData.estimasiNjop}
                      onChange={(e) => handleTextChange('estimasiNjop', e)}
                      className={`w-full h-12 border ${errors.estimasiNjop ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm`}
                      placeholder="Contoh: 500000"
                    />
                    {errors.estimasiNjop && <p className="text-error text-[12px]">{errors.estimasiNjop}</p>}
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
                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-outline uppercase text-[10px] font-bold">Jenis Transaksi</p>
                      <p className="font-bold text-primary text-base uppercase mt-0.5">
                        {formData.transaksi === 'baru'
                          ? 'Perekaman Data Baru'
                          : formData.transaksi === 'update'
                          ? 'Pemutakhiran Data'
                          : 'Penghapusan Data'}
                      </p>
                    </div>
                    <div>
                      <p className="text-outline uppercase text-[10px] font-bold">NOP Objek Pajak</p>
                      <p className="font-data-mono font-bold text-primary text-base mt-0.5">
                        {`33.03.${formData.nop.kec || '___'}.${formData.nop.kel || '___'}.${formData.nop.blok || '___'}-${formData.nop.nourut || '____'}.${formData.nop.kode || '_'}`}
                      </p>
                    </div>
                    <div className="md:col-span-2 border-t border-outline-variant pt-4">
                      <p className="text-outline uppercase text-[10px] font-bold mb-1">Identitas Subjek Pajak</p>
                      <p className="font-bold text-on-surface text-base">{formData.nama || '-'}</p>
                      <p className="font-data-mono text-on-surface-variant mt-0.5">KTP NIK: {formData.nik || '-'}</p>
                      <p className="text-on-surface-variant mt-1">
                        Pekerjaan: {formData.pekerjaan} | Status: {formData.statusWp}
                      </p>
                      <p className="text-on-surface-variant mt-1">
                        Alamat WP: {formData.alamat || '-'}, RT {formData.rt || '-'}/RW {formData.rw || '-'}, {formData.kelurahan || '-'}, {formData.kabupaten}
                      </p>
                    </div>
                    <div className="md:col-span-2 border-t border-outline-variant pt-4">
                      <p className="text-outline uppercase text-[10px] font-bold mb-1">Spesifikasi Objek Pajak</p>
                      <p className="text-on-surface-variant">
                        Luas Tanah: <span className="font-bold text-on-surface">{formData.luasTanah || '-'} M²</span> | Jenis Tanah: <span className="font-bold text-on-surface">{formData.jenisTanah}</span>
                      </p>
                      <p className="text-on-surface-variant mt-1">Alamat Objek: {formData.alamatObjek || '-'}</p>
                      <p className="text-on-surface-variant mt-1">
                        Estimasi NJOP: <span className="font-bold text-on-surface">Rp. {Number(formData.estimasiNjop).toLocaleString() || '-'} / M²</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-secondary-container/20 rounded border border-secondary/20 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-secondary">verified_user</span>
                  <div>
                    <p className="font-label-sm text-secondary">Pernyataan Wajib Pajak</p>
                    <p className="text-[12px] text-on-surface-variant leading-tight">
                      Saya menyatakan bahwa data yang saya masukkan adalah benar sesuai dengan dokumen fisik sertifikat tanah dan KTP yang berlaku.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 5: VERIFIKASI / SELESAI */}
          {step === 5 && (
            <div className="space-y-6 text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="material-symbols-outlined text-[48px]">check_circle</span>
              </div>
              <h3 className="font-display-lg text-display-lg text-primary uppercase font-extrabold">
                SPOP Berhasil Dikirim
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-lg mx-auto">
                Formulir SPOP Digital untuk NOP <span className="font-bold text-primary font-data-mono">{`33.03.${formData.nop.kec}.${formData.nop.kel}.${formData.nop.blok}-${formData.nop.nourut}.${formData.nop.kode}`}</span> telah masuk ke sistem antrean validasi BKD Kabupaten Purbalingga.
              </p>
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl max-w-md mx-auto text-left space-y-2 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">ID Submisi</span>
                  <span className="font-bold text-on-surface font-data-mono">SPOP-2026-00382</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Estimasi Verifikasi</span>
                  <span className="font-bold text-secondary flex items-center gap-1">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                    ± 24 Jam Kerja
                  </span>
                </div>
              </div>
              <div className="pt-8 flex justify-center gap-4">
                <button
                  onClick={() => onNavigate('dashboard_desa')}
                  className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-all"
                >
                  Kembali ke Dashboard
                </button>
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
                  className={`w-full md:w-auto px-8 py-3 rounded-full border border-primary text-primary font-bold hover:bg-surface-container transition-all flex items-center justify-center gap-2 group ${
                    step === 1 ? 'opacity-50 cursor-not-allowed border-outline text-outline' : ''
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
                    onClick={() => {
                      setToast({ show: true, message: 'Draft formulir berhasil disimpan ke akun Anda.', type: 'success' });
                      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
                    }}
                    className="w-full md:w-auto px-10 py-3 rounded-full bg-surface-container-high text-on-surface-variant font-bold hover:bg-surface-container transition-colors"
                  >
                    Simpan Draft
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={step === 4 ? handleSubmit : nextStep}
                    className="w-full md:w-auto px-12 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                    ) : step === 4 ? (
                      'Submit SPOP'
                    ) : (
                      `Lanjutkan Ke Tahap ${step + 1}`
                    )}
                    {!isSubmitting && (
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Contextual Information (Bento Style) */}
      {step < 5 && (
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
      )}

      {/* Footer Small Print */}
      <footer className="mt-12 pb-12 text-center border-t border-outline-variant pt-8">
        <p className="text-[12px] text-outline">
          *) Khusus untuk PNS/ABRI/Pensiunan yang penghasilannya semata-mata berasal dari gaji atau uang pensiunan.
        </p>
        <p className="mt-4 font-label-sm text-outline">
          SIPD Purbalingga © 2026 - Digitalisasi Layanan Perpajakan Daerah
        </p>
      </footer>

      {/* Custom Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 ${
          toast.type === 'error' 
            ? 'bg-error-container text-on-error-container border-error/35' 
            : 'bg-secondary-container text-on-secondary-container border-secondary/35'
        } border px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-50 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0'
        }`}
      >
        <span className={`material-symbols-outlined ${toast.type === 'error' ? 'text-error' : 'text-secondary'} text-[24px]`}>
          {toast.type === 'error' ? 'error' : 'check_circle'}
        </span>
        <div>
          <p className="font-bold">{toast.type === 'error' ? 'Peringatan' : 'Berhasil!'}</p>
          <p className="text-sm opacity-90">{toast.message}</p>
        </div>
        <button className="ml-4 opacity-50 hover:opacity-100" onClick={() => setToast({ ...toast, show: false })}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </main>
  );
}
