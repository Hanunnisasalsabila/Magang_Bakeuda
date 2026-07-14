import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaperHeader from '../components/PaperHeader';

export default function FormulirLSPOP() {
  const navigate = useNavigate();
  const [nop, setNop] = useState('');
  const [nomorBangunan, setNomorBangunan] = useState(1);
  const [totalBangunan, setTotalBangunan] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    // Ambil NOP dan Jumlah Bangunan dari localStorage yang disimpan saat submit SPOP
    const savedNop = localStorage.getItem('lspop_nop');
    const savedTotal = localStorage.getItem('lspop_total_bangunan');
    if (savedNop) setNop(savedNop);
    if (savedTotal) setTotalBangunan(parseInt(savedTotal));
  }, []);

  const [formData, setFormData] = useState({
    // INDUK
    noFormulir: '',
    jenisTransaksi: 'Perekaman Data',
    jumlahBng: '1',
    bangunanM2: '',

    // A. RINCIAN DATA BANGUNAN
    jenisPenggunaan: '',
    luasBangunan: '',
    jumlahLantai: '',
    tahunDibangun: '',
    tahunDirenovasi: '',
    dayaListrik: '',
    kondisi: '',
    konstruksi: '',
    atap: '',
    dinding: '',
    lantai: '',
    langitLangit: '',
    
    // B. FASILITAS
    acSplit: '',
    acWindow: '',
    acSentral: '',
    kolamRenangLuas: '',
    kolamRenangFinishing: '',
    halamanRingan: '',
    halamanSedang: '',
    halamanBerat: '',
    halamanPenutupLantai: '',
    lapanganTenisLampuBeton: '',
    lapanganTenisLampuAspal: '',
    lapanganTenisLampuTanah: '',
    lapanganTenisTanpaLampuBeton: '',
    lapanganTenisTanpaLampuAspal: '',
    lapanganTenisTanpaLampuTanah: '',
    liftPenumpang: '',
    liftKapsul: '',
    liftBarang: '',
    tanggaBerjalanKecil: '', // Lbr < 0,80
    tanggaBerjalanBesar: '', // Lbr > 0,80
    panjangPagar: '',
    bahanPagar: '',
    pemadamHydrant: '',
    pemadamSprinkler: '',
    pemadamFireAl: '',
    saluranPabx: '',
    sumurArtesis: ''
  });

  const [errors, setErrors] = useState({});

  const handleTextChange = (field, event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jenisPenggunaan) newErrors.jenisPenggunaan = 'Pilih jenis penggunaan bangunan';
    if (!formData.luasBangunan || parseFloat(formData.luasBangunan) <= 0) newErrors.luasBangunan = 'Isi luas bangunan dengan benar';
    if (!formData.jumlahLantai || parseInt(formData.jumlahLantai) <= 0) newErrors.jumlahLantai = 'Isi jumlah lantai';
    if (!formData.tahunDibangun) newErrors.tahunDibangun = 'Isi tahun dibangun';
    if (!formData.kondisi) newErrors.kondisi = 'Pilih kondisi bangunan';
    if (!formData.konstruksi) newErrors.konstruksi = 'Pilih jenis konstruksi';
    if (!formData.atap) newErrors.atap = 'Pilih material atap';
    if (!formData.dinding) newErrors.dinding = 'Pilih material dinding';
    if (!formData.lantai) newErrors.lantai = 'Pilih material lantai';
    if (!formData.langitLangit) newErrors.langitLangit = 'Pilih material langit-langit';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({ show: true, message: 'Harap lengkapi semua isian wajib (tanda merah) di Bagian A.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    // Simulasi pengiriman data ke server
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (nomorBangunan < totalBangunan) {
        // Jika masih ada bangunan lain
        setToast({ show: true, message: `Data Bangunan Ke-${nomorBangunan} berhasil disimpan. Lanjut ke bangunan berikutnya.`, type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
        setNomorBangunan(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Kosongkan form kembali
        setFormData(prev => ({
          ...prev, luasBangunan: '', jumlahLantai: '', tahunDibangun: '', tahunDirenovasi: '', dayaListrik: ''
        }));
      } else {
        // Jika semua bangunan selesai
        setSubmitSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 1500);
  };

  const RadioGroup = ({ label, field, options, columns = 3 }) => (
    <div className="space-y-2">
      <label className="font-label-sm text-primary block">{label}</label>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
        {options.map((opt, idx) => (
          <label key={idx} className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${formData[field] === opt ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low'}`}>
            <input 
              type="radio" 
              name={field} 
              value={opt}
              checked={formData[field] === opt}
              onChange={(e) => handleTextChange(field, e)}
              className="mt-0.5 text-primary focus:ring-primary border-outline-variant"
            />
            <span className="text-sm font-semibold text-on-surface">{opt}</span>
          </label>
        ))}
      </div>
      {errors[field] && <p className="text-error text-[12px] mt-1">{errors[field]}</p>}
    </div>
  );

  if (submitSuccess) {
    return (
      <main className="p-gutter max-w-screen-2xl mx-auto w-full">
        <PaperHeader />
        <div className="bg-white border border-outline-variant rounded-xl p-10 shadow-sm text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[48px]">check_circle</span>
          </div>
          <h3 className="text-display-lg text-primary uppercase font-extrabold">LSPOP Selesai!</h3>
          <p className="text-body-md text-on-surface-variant max-w-lg mx-auto">
            Semua data bangunan (total {totalBangunan} unit) untuk NOP <b>{nop}</b> telah berhasil didaftarkan.
          </p>
          <div className="pt-8">
            <button
              onClick={() => navigate('/dashboard-desa')}
              className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-all"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto w-full relative">
      <PaperHeader />
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary uppercase">Formulir LSPOP</h2>
          <p className="text-on-surface-variant text-sm mt-1">Lampiran Surat Pemberitahuan Objek Pajak - Data Bangunan</p>
        </div>
        <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
          Bangunan Ke: {nomorBangunan} / {totalBangunan}
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant p-6 rounded-t-xl shadow-sm">
        <h4 className="font-bold text-on-surface text-lg border-b border-outline-variant/50 pb-3 mb-4">Informasi Induk (SPOP)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="font-label-sm text-primary block text-xs uppercase tracking-wider">No. Formulir</label>
            <input type="text" value={formData.noFormulir} onChange={(e) => handleTextChange('noFormulir', e)} className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono" placeholder="No. Formulir" />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-primary block text-xs uppercase tracking-wider">Jenis Transaksi</label>
            <select value={formData.jenisTransaksi} onChange={(e) => handleTextChange('jenisTransaksi', e)} className="w-full h-10 border border-outline-variant rounded px-3 text-sm">
              <option value="Perekaman Data">Perekaman Data</option>
              <option value="Pemutakhiran Data">Pemutakhiran Data</option>
              <option value="Penghapusan Data">Penghapusan Data</option>
              <option value="Penilaian Individual">Penilaian Individual</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-primary block text-xs uppercase tracking-wider">NOP</label>
            <input type="text" value={nop} readOnly className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-low text-on-surface-variant font-bold" />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="font-label-sm text-primary block text-[10px] uppercase tracking-widest whitespace-nowrap">Jml Bng</label>
              <input type="number" value={totalBangunan} readOnly className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-low text-on-surface-variant font-bold text-center" />
            </div>
            <div className="space-y-2 flex-1">
              <label className="font-label-sm text-primary block text-[10px] uppercase tracking-widest whitespace-nowrap">Bng M²</label>
              <input type="number" value={formData.bangunanM2} onChange={(e) => handleTextChange('bangunanM2', e)} className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono text-center" placeholder="M²" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-x border-b border-outline-variant rounded-b-xl p-6 md:p-10 shadow-sm">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-12">
          
          {/* BAGIAN A: RINCIAN DATA BANGUNAN */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <div className="w-1 bg-primary h-8 rounded-full"></div>
              <h4 className="font-headline-md text-headline-md font-bold text-on-surface">A. RINCIAN DATA BANGUNAN</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <RadioGroup 
                  label="1. Jenis Penggunaan Bangunan" 
                  field="jenisPenggunaan" 
                  columns={3}
                  options={[
                    'Perumahan', 'Perkantoran Swasta', 'Pabrik', 'Toko/Apotik/Pasar/Ruko',
                    'Rumah Sakit/Klinik', 'Olah Raga/Rekreasi', 'Hotel/Wisma', 'Bengkel/Gudang/Pertanian',
                    'Gedung Pemerintah', 'Lain-lain', 'Bng Tidak Kena Pajak', 'Bangunan Parkir',
                    'Apartemen', 'Pompa Bensin', 'Tangki Minyak', 'Gedung Sekolah'
                  ]} 
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">2. Luas Bangunan (M²)</label>
                <input type="number" value={formData.luasBangunan} onChange={(e) => handleTextChange('luasBangunan', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 45" />
                {errors.luasBangunan && <p className="text-error text-[12px]">{errors.luasBangunan}</p>}
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-primary block">3. Jumlah Lantai</label>
                <input type="number" value={formData.jumlahLantai} onChange={(e) => handleTextChange('jumlahLantai', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 1" />
                {errors.jumlahLantai && <p className="text-error text-[12px]">{errors.jumlahLantai}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">4. Tahun Dibangun</label>
                <input type="number" value={formData.tahunDibangun} onChange={(e) => handleTextChange('tahunDibangun', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 2010" />
                {errors.tahunDibangun && <p className="text-error text-[12px]">{errors.tahunDibangun}</p>}
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-primary block">5. Tahun Direnovasi (Opsional)</label>
                <input type="number" value={formData.tahunDirenovasi} onChange={(e) => handleTextChange('tahunDirenovasi', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Kosongkan jika tidak ada" />
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">6. Daya Listrik Terpasang (WATT)</label>
                <input type="number" value={formData.dayaListrik} onChange={(e) => handleTextChange('dayaListrik', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 1300" />
              </div>
              <div className="space-y-2"></div>

              <div className="md:col-span-2 grid grid-cols-1 gap-6">
                <RadioGroup label="7. Kondisi Pada Umumnya" field="kondisi" columns={4} options={['Sangat Baik', 'Baik', 'Sedang', 'Jelek']} />
                <RadioGroup label="8. Konstruksi" field="konstruksi" columns={4} options={['Baja', 'Beton', 'Batu Bata', 'Kayu']} />
                <RadioGroup label="9. Atap" field="atap" columns={3} options={['Decrabon/Beton/Genteng Glazur', 'Genteng Beton/Aluminium', 'Genteng Biasa/Sirap', 'Asbes', 'Seng']} />
                <RadioGroup label="10. Dinding" field="dinding" columns={3} options={['Kaca/Aluminium', 'Beton', 'Batu Bata/Conblok', 'Kayu', 'Seng', 'Tidak ada Dinding']} />
                <RadioGroup label="11. Lantai" field="lantai" columns={5} options={['Marmer', 'Keramik', 'Teraso', 'Ubin PC/Papan', 'Semen']} />
                <RadioGroup label="12. Langit-Langit" field="langitLangit" columns={3} options={['Akustik/Jati', 'Triplek/Asbes/Bambu', 'Tidak Ada']} />
              </div>
            </div>
          </section>

          {/* BAGIAN B: FASILITAS */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <div className="w-1 bg-secondary h-8 rounded-full"></div>
              <h4 className="font-headline-md text-headline-md font-bold text-on-surface">B. FASILITAS (Opsional)</h4>
            </div>
            
            <p className="text-sm text-on-surface-variant">Isi jumlah atau luas fasilitas di bawah ini jika tersedia di dalam bangunan. Kosongkan jika tidak ada.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AC & AC Sentral */}
              <div className="space-y-4 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
                <h6 className="font-bold text-sm">Air Conditioner (AC)</h6>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-on-surface-variant">Jumlah Split</label>
                    <input type="number" value={formData.acSplit} onChange={e => handleTextChange('acSplit', e)} className="w-full p-2 border rounded" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-on-surface-variant">Jumlah Window</label>
                    <input type="number" value={formData.acWindow} onChange={e => handleTextChange('acWindow', e)} className="w-full p-2 border rounded" />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="text-xs text-on-surface-variant mb-1 block">AC Sentral</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="radio" name="acSentral" value="Ada" checked={formData.acSentral === 'Ada'} onChange={e=>handleTextChange('acSentral', e)} /> Ada</label>
                    <label className="flex items-center gap-2 text-sm"><input type="radio" name="acSentral" value="Tidak Ada" checked={formData.acSentral === 'Tidak Ada'} onChange={e=>handleTextChange('acSentral', e)} /> Tidak Ada</label>
                  </div>
                </div>
              </div>

              {/* Kolam Renang */}
              <div className="space-y-4 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
                <h6 className="font-bold text-sm">Kolam Renang</h6>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant block">Luas Kolam Renang (M²)</label>
                    <input type="number" value={formData.kolamRenangLuas} onChange={e => handleTextChange('kolamRenangLuas', e)} className="w-full p-2 border rounded" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant block">Finishing</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="kolamRenangFinishing" value="Diplester" checked={formData.kolamRenangFinishing === 'Diplester'} onChange={e=>handleTextChange('kolamRenangFinishing', e)} /> Diplester</label>
                      <label className="flex items-center gap-2 text-sm"><input type="radio" name="kolamRenangFinishing" value="Dengan Pelapis" checked={formData.kolamRenangFinishing === 'Dengan Pelapis'} onChange={e=>handleTextChange('kolamRenangFinishing', e)} /> Dengan Pelapis</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perkerasan Halaman */}
              <div className="space-y-4 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest md:col-span-2">
                <h6 className="font-bold text-sm">Luas Perkerasan Halaman (M²)</h6>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1"><label className="text-xs text-on-surface-variant">Ringan</label><input type="number" value={formData.halamanRingan} onChange={e=>handleTextChange('halamanRingan',e)} className="w-full p-2 border rounded" /></div>
                  <div className="space-y-1"><label className="text-xs text-on-surface-variant">Sedang</label><input type="number" value={formData.halamanSedang} onChange={e=>handleTextChange('halamanSedang',e)} className="w-full p-2 border rounded" /></div>
                  <div className="space-y-1"><label className="text-xs text-on-surface-variant">Berat</label><input type="number" value={formData.halamanBerat} onChange={e=>handleTextChange('halamanBerat',e)} className="w-full p-2 border rounded" /></div>
                  <div className="space-y-1"><label className="text-xs text-on-surface-variant">Dengan Penutup Lantai</label><input type="number" value={formData.halamanPenutupLantai} onChange={e=>handleTextChange('halamanPenutupLantai',e)} className="w-full p-2 border rounded" /></div>
                </div>
              </div>

              {/* Lapangan Tenis */}
              <div className="space-y-4 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest md:col-span-2">
                <h6 className="font-bold text-sm">Jumlah Lapangan Tenis</h6>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-bold mb-2">Dengan Lampu</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><label className="text-xs">Beton</label><input type="number" className="w-20 p-1 border rounded" /></div>
                      <div className="flex justify-between items-center"><label className="text-xs">Aspal</label><input type="number" className="w-20 p-1 border rounded" /></div>
                      <div className="flex justify-between items-center"><label className="text-xs">Tanah Liat/Rumput</label><input type="number" className="w-20 p-1 border rounded" /></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-2">Tanpa Lampu</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><label className="text-xs">Beton</label><input type="number" className="w-20 p-1 border rounded" /></div>
                      <div className="flex justify-between items-center"><label className="text-xs">Aspal</label><input type="number" className="w-20 p-1 border rounded" /></div>
                      <div className="flex justify-between items-center"><label className="text-xs">Tanah Liat/Rumput</label><input type="number" className="w-20 p-1 border rounded" /></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lift & Eskalator */}
              <div className="space-y-4 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
                <h6 className="font-bold text-sm">Lift & Tangga Berjalan</h6>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 border-r pr-4">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Jumlah Lift</p>
                    <div className="flex justify-between items-center"><label className="text-xs">Penumpang</label><input type="number" className="w-16 p-1 border rounded" /></div>
                    <div className="flex justify-between items-center"><label className="text-xs">Kapsul</label><input type="number" className="w-16 p-1 border rounded" /></div>
                    <div className="flex justify-between items-center"><label className="text-xs">Barang</label><input type="number" className="w-16 p-1 border rounded" /></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Jumlah Tangga Berjalan (Eskalator)</p>
                    <div className="flex justify-between items-center"><label className="text-xs">Lebar &lt; 0.80M</label><input type="number" className="w-16 p-1 border rounded" /></div>
                    <div className="flex justify-between items-center"><label className="text-xs">Lebar &gt; 0.80M</label><input type="number" className="w-16 p-1 border rounded" /></div>
                  </div>
                </div>
              </div>

              {/* Lain-lain */}
              <div className="space-y-4 p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
                <h6 className="font-bold text-sm">Lain-lain</h6>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs w-1/2">Pagar (Panjang M)</label>
                    <input type="number" className="w-full p-1.5 border rounded" placeholder="Panjang (M)" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs w-1/2">Bahan Pagar</label>
                    <select className="w-full p-1.5 border rounded text-xs">
                      <option value="">- Pilih -</option>
                      <option value="baja">Baja/Besi</option>
                      <option value="bata">Bata/Batako</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <label className="text-xs w-1/2">Pemadam Kebakaran</label>
                    <select className="w-full p-1.5 border rounded text-xs">
                      <option value="">- Pilih -</option>
                      <option value="hydrant">Hydrant</option>
                      <option value="sprinkler">Sprinkler</option>
                      <option value="fireal">Fire Al.</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs w-1/2">Jumlah Saluran PABX</label>
                    <input type="number" className="w-full p-1.5 border rounded" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs w-1/2">Kedalaman Sumur Artesis (M)</label>
                    <input type="number" className="w-full p-1.5 border rounded" />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-outline-variant flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-12 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 group ${isSubmitting ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-70' : 'bg-primary text-on-primary hover:shadow-lg hover:brightness-110 active:scale-95'}`}
            >
              <span className="material-symbols-outlined">{isSubmitting ? 'hourglass_empty' : 'save'}</span>
              {isSubmitting ? 'Menyimpan...' : nomorBangunan < totalBangunan ? 'Simpan & Lanjut ke Bangunan Berikutnya' : 'Simpan Seluruh Data LSPOP'}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 ${toast.type === 'error' ? 'bg-error-container text-on-error-container border-error/35' : 'bg-secondary-container text-on-secondary-container border-secondary/35'} border px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-50 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0'}`}>
        <span className={`material-symbols-outlined ${toast.type === 'error' ? 'text-error' : 'text-secondary'} text-[24px]`}>
          {toast.type === 'error' ? 'error' : 'check_circle'}
        </span>
        <div>
          <p className="font-bold">{toast.type === 'error' ? 'Peringatan' : 'Berhasil!'}</p>
          <p className="text-sm opacity-90">{toast.message}</p>
        </div>
      </div>
    </main>
  );
}
