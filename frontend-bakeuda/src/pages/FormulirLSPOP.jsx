import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaperHeader from '../components/PaperHeader';
import api from '../utils/axios';

export default function FormulirLSPOP() {
  const navigate = useNavigate();
  const [nop, setNop] = useState('');
  const [nomorBangunan, setNomorBangunan] = useState(1);
  const [totalBangunan, setTotalBangunan] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [idTransaksi, setIdTransaksi] = useState(null);
  const [bangunanList, setBangunanList] = useState([]);
  const [isDraft, setIsDraft] = useState(false);
  const [spopTransaksi, setSpopTransaksi] = useState('');

  // State untuk Progressive Disclosure UI
  const [hasAC, setHasAC] = useState(false);
  const [hasKolamRenang, setHasKolamRenang] = useState(false);
  const [hasHalaman, setHasHalaman] = useState(false);
  const [hasPagar, setHasPagar] = useState(false);
  const [hasLapanganTenis, setHasLapanganTenis] = useState(false);
  const [hasLiftEskalator, setHasLiftEskalator] = useState(false);
  const [hasPemadam, setHasPemadam] = useState(false);
  const [hasPabx, setHasPabx] = useState(false);
  const [hasSumur, setHasSumur] = useState(false);

  const handleToggle = (setter, clearFields) => {
    setter(prev => {
      const newVal = !prev;
      if (!newVal && clearFields) {
        const resetObj = {};
        clearFields.forEach(f => resetObj[f] = '');
        setFormData(d => ({ ...d, ...resetObj }));
      }
      return newVal;
    });
  };

  const ToggleSwitch = ({ label, checked, onChange, description }) => (
    <div className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-all ${checked ? 'bg-primary/5 border-primary/50' : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low'}`} onClick={onChange}>
      <div>
        <h6 className={`font-bold text-sm ${checked ? 'text-primary' : 'text-on-surface'}`}>{label}</h6>
        {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-outline-variant'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  );

  useEffect(() => {
    const savedNop = localStorage.getItem('lspop_nop');
    const savedTotal = localStorage.getItem('lspop_total_bangunan');
    const savedId = localStorage.getItem('lspop_id_transaksi');
    
    const spopPayloadStr = localStorage.getItem('lspop_spop_payload');
    if (spopPayloadStr) {
      const payload = JSON.parse(spopPayloadStr);
      if (payload.is_draft) setIsDraft(true);
    }
    
    const draftBangunanStr = localStorage.getItem('lspop_draft_bangunan');
    if (draftBangunanStr) {
      try {
        const parsedList = JSON.parse(draftBangunanStr);
        if (Array.isArray(parsedList) && parsedList.length > 0) {
          // Extract the last drafted building to be continued in formData
          const lastBangunan = parsedList.pop();
          
          // Convert any 0 values back to empty strings for better UX
          Object.keys(lastBangunan).forEach(key => {
            if (lastBangunan[key] === 0) {
              lastBangunan[key] = '';
            }
          });

          setBangunanList(parsedList);
          setNomorBangunan(parsedList.length + 1);
          setFormData(prev => ({ ...prev, ...lastBangunan }));
        }
      } catch (e) {
        console.error('Failed to parse draft bangunan', e);
      }
    }

    if (savedNop) setNop(savedNop);
    if (savedTotal) {
      setTotalBangunan(parseInt(savedTotal));
      setFormData(prev => ({ ...prev, jumlahBng: savedTotal }));
    }
    if (savedId) setIdTransaksi(savedId);

    const spopTx = localStorage.getItem('lspop_jenis_transaksi');
    if (spopTx) {
      setSpopTransaksi(spopTx);
      if (['BARU', 'PECAH', 'GABUNG'].includes(spopTx)) {
        setFormData(prev => ({ ...prev, jenisTransaksi: 'Perekaman Data' }));
      } else if (spopTx === 'PENGHAPUSAN') {
        setFormData(prev => ({ ...prev, jenisTransaksi: 'Penghapusan Data' }));
      }
    }
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
    let value = event.target.value;
    
    // Constraint khusus tahun (maksimal 4 digit)
    if (field === 'tahunDibangun' || field === 'tahunDirenovasi') {
      if (value.length > 4) value = value.slice(0, 4);
    }
    
    // Constraint khusus jumlah lantai (maksimal 2 digit / 99)
    if (field === 'jumlahLantai') {
      if (value.length > 2) value = value.slice(0, 2);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.jenisPenggunaan) newErrors.jenisPenggunaan = 'Pilih jenis penggunaan bangunan';
    if (!formData.luasBangunan || parseFloat(formData.luasBangunan) <= 0) newErrors.luasBangunan = 'Isi luas bangunan dengan benar';
    
    if (!formData.jumlahLantai || parseInt(formData.jumlahLantai) < 1) {
      newErrors.jumlahLantai = 'Jumlah lantai minimal 1';
    } else if (parseInt(formData.jumlahLantai) > 99) {
      newErrors.jumlahLantai = 'Jumlah lantai maksimal 99';
    }
    
    if (!formData.tahunDibangun) {
      newErrors.tahunDibangun = 'Isi tahun dibangun';
    } else if (!/^\d{4}$/.test(formData.tahunDibangun)) {
      newErrors.tahunDibangun = 'Tahun dibangun harus 4 digit angka';
    } else if (parseInt(formData.tahunDibangun) > currentYear) {
      newErrors.tahunDibangun = `Tahun dibangun tidak boleh lebih dari ${currentYear}`;
    }

    if (formData.tahunDirenovasi) {
      const thnRenov = parseInt(formData.tahunDirenovasi);
      const thnBangun = parseInt(formData.tahunDibangun || 0);
      
      if (!/^\d{4}$/.test(formData.tahunDirenovasi)) {
        newErrors.tahunDirenovasi = 'Tahun direnovasi harus 4 digit angka';
      } else if (thnRenov < thnBangun) {
        newErrors.tahunDirenovasi = 'Tahun direnovasi tidak boleh kurang dari tahun dibangun';
      } else if (thnRenov > currentYear) {
        newErrors.tahunDirenovasi = `Tahun direnovasi tidak boleh lebih dari ${currentYear}`;
      }
    }

    if (!formData.dayaListrik || parseInt(formData.dayaListrik) < 0) {
      newErrors.dayaListrik = 'Daya listrik wajib diisi (isi 0 jika tidak ada)';
    }

    if (!formData.kondisi) newErrors.kondisi = 'Pilih kondisi bangunan';
    if (!formData.konstruksi) newErrors.konstruksi = 'Pilih jenis konstruksi';
    if (!formData.atap) newErrors.atap = 'Pilih material atap';
    if (!formData.dinding) newErrors.dinding = 'Pilih material dinding';
    if (!formData.lantai) newErrors.lantai = 'Pilih material lantai';
    if (!formData.langitLangit) newErrors.langitLangit = 'Pilih material langit-langit';

    // Kondisional Fasilitas
    if (parseFloat(formData.kolamRenangLuas) > 0 && !formData.kolamRenangFinishing) {
      newErrors.kolamRenangFinishing = 'Pilih finishing kolam renang';
    }
    if (parseFloat(formData.panjangPagar) > 0 && !formData.bahanPagar) {
      newErrors.bahanPagar = 'Pilih bahan pagar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDraftForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (formData.tahunDibangun && !/^\d{4}$/.test(formData.tahunDibangun)) {
      newErrors.tahunDibangun = 'Tahun dibangun harus 4 digit angka';
    } else if (formData.tahunDibangun && parseInt(formData.tahunDibangun) > currentYear) {
      newErrors.tahunDibangun = `Tahun dibangun tidak boleh lebih dari ${currentYear}`;
    }

    if (formData.tahunDirenovasi) {
      const thnRenov = parseInt(formData.tahunDirenovasi);
      const thnBangun = parseInt(formData.tahunDibangun || 0);
      
      if (!/^\d{4}$/.test(formData.tahunDirenovasi)) {
        newErrors.tahunDirenovasi = 'Tahun direnovasi harus 4 digit angka';
      } else if (thnBangun && thnRenov < thnBangun) {
        newErrors.tahunDirenovasi = 'Tahun direnovasi tidak boleh kurang dari tahun dibangun';
      } else if (thnRenov > currentYear) {
        newErrors.tahunDirenovasi = `Tahun direnovasi tidak boleh lebih dari ${currentYear}`;
      }
    }

    // Kondisional Fasilitas
    if (parseFloat(formData.kolamRenangLuas) > 0 && !formData.kolamRenangFinishing) {
      newErrors.kolamRenangFinishing = 'Pilih finishing kolam renang';
    }
    if (parseFloat(formData.panjangPagar) > 0 && !formData.bahanPagar) {
      newErrors.bahanPagar = 'Pilih bahan pagar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSanitizedData = () => {
    const sanitizedData = { ...formData };
    const numericFasilitasFields = [
      'luasBangunan', 'jumlahLantai', 'dayaListrik',
      'acSplit', 'acWindow', 'kolamRenangLuas', 
      'halamanRingan', 'halamanSedang', 'halamanBerat', 'halamanPenutupLantai', 
      'lapanganTenisLampuBeton', 'lapanganTenisLampuAspal', 'lapanganTenisLampuTanah',
      'lapanganTenisTanpaLampuBeton', 'lapanganTenisTanpaLampuAspal', 'lapanganTenisTanpaLampuTanah',
      'liftPenumpang', 'liftKapsul', 'liftBarang', 
      'tanggaBerjalanKecil', 'tanggaBerjalanBesar', 
      'panjangPagar', 'pemadamHydrant', 'pemadamSprinkler', 'pemadamFireAl', 
      'saluranPabx', 'sumurArtesis'
    ];

    numericFasilitasFields.forEach(field => {
      if (!sanitizedData[field] || sanitizedData[field] === '') {
        sanitizedData[field] = 0;
      } else {
        sanitizedData[field] = parseFloat(sanitizedData[field]);
      }
    });

    Object.keys(sanitizedData).forEach(key => {
      if (sanitizedData[key] === '') {
        delete sanitizedData[key];
      }
    });
    
    // Add form structure attributes expected by backend
    sanitizedData.noFormulir = nop;
    sanitizedData.jenisTransaksi = localStorage.getItem('lspop_jenis_transaksi') || 'BARU';
    sanitizedData.jumlahBng = totalBangunan.toString();
    sanitizedData.bangunanM2 = sanitizedData.luasBangunan ? sanitizedData.luasBangunan.toString() : '0';

    return sanitizedData;
  };

  const handleSaveDraft = async () => {
    if (!validateDraftForm()) {
      setToast({ show: true, message: 'Harap perbaiki kesalahan format/relasi sebelum menyimpan draft.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
      return;
    }

    setIsSubmitting(true);
    const sanitizedData = getSanitizedData();
    
    // Cek apakah form bangunan saat ini ada isinya selain atribut metadata
    const hasData = Object.keys(sanitizedData).some(k => !['noFormulir', 'jenisTransaksi', 'jumlahBng', 'bangunanM2'].includes(k));
    
    // Jika ada isinya, ikut sertakan dalam draft
    const newBangunanList = hasData ? [...bangunanList, sanitizedData] : bangunanList;
    
    await submitToServer(newBangunanList, true);
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev, luasBangunan: '', jumlahLantai: '', tahunDibangun: '', tahunDirenovasi: '', dayaListrik: '',
      jenisPenggunaan: '', kondisi: '', konstruksi: '', atap: '', dinding: '', lantai: '', langitLangit: '',
      acSplit: '', acWindow: '', acSentral: '', kolamRenangLuas: '', kolamRenangFinishing: '',
      halamanRingan: '', halamanSedang: '', halamanBerat: '', halamanPenutupLantai: '',
      lapanganTenisLampuBeton: '', lapanganTenisLampuAspal: '', lapanganTenisLampuTanah: '',
      lapanganTenisTanpaLampuBeton: '', lapanganTenisTanpaLampuAspal: '', lapanganTenisTanpaLampuTanah: '',
      liftPenumpang: '', liftKapsul: '', liftBarang: '', tanggaBerjalanKecil: '', tanggaBerjalanBesar: '',
      panjangPagar: '', bahanPagar: '', pemadamHydrant: '', pemadamSprinkler: '', pemadamFireAl: '',
      saluranPabx: '', sumurArtesis: ''
    }));
    // Reset toggles as well
    setHasAC(false); setHasKolamRenang(false); setHasHalaman(false);
    setHasPagar(false); setHasLapanganTenis(false); setHasLiftEskalator(false);
    setHasPemadam(false); setHasPabx(false); setHasSumur(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({ show: true, message: 'Terdapat isian yang tidak valid atau wajib diisi.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
      return;
    }

    setIsSubmitting(true);
    const sanitizedData = getSanitizedData();
    const newBangunanList = [...bangunanList, sanitizedData];
    
    if (nomorBangunan < totalBangunan) {
      setBangunanList(newBangunanList);
      setIsSubmitting(false);
      setToast({ show: true, message: `Data Bangunan Ke-${nomorBangunan} berhasil disimpan secara lokal. Lanjut ke bangunan berikutnya.`, type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
      setNomorBangunan(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      resetForm();
    } else {
      await submitToServer(newBangunanList, false);
    }
  };

  const submitToServer = async (finalBangunanList, isSaveDraft) => {
    const spopPayloadStr = localStorage.getItem('lspop_spop_payload');
    const spopPayload = spopPayloadStr ? JSON.parse(spopPayloadStr) : null;
    
    if (spopPayload && spopPayload.objek_pajak_sementara) {
      const totalLuasBangunan = finalBangunanList.reduce((sum, b) => sum + (parseFloat(b.luasBangunan) || 0), 0);
      spopPayload.objek_pajak_sementara.luas_bangunan = totalLuasBangunan;
      spopPayload.objek_pajak_sementara.jumlah_bangunan = finalBangunanList.length;
    }

    const terpaduPayload = {
      ...spopPayload,
      bangunan: finalBangunanList,
      is_draft: isSaveDraft,
      id_transaksi: idTransaksi || spopPayload?.id_transaksi
    };

    console.log('PAYLOAD TERPADU (SPOP + LSPOP):', terpaduPayload);
    
    try {
      const endpoint = isSaveDraft ? '/transaksi-spop/draft' : '/transaksi-spop';
      await api.post(endpoint, terpaduPayload);
      
      localStorage.removeItem('lspop_spop_payload');
      localStorage.removeItem('lspop_jenis_transaksi');
      localStorage.removeItem('lspop_nop');
      localStorage.removeItem('lspop_total_bangunan');
      localStorage.removeItem('lspop_id_transaksi');
      localStorage.removeItem('lspop_draft_bangunan');
      
      if (isSaveDraft) {
        setToast({ show: true, message: 'Draft berhasil disimpan ke akun Anda.', type: 'success' });
        setTimeout(() => navigate('/dashboard-desa'), 2000);
      } else {
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting terpadu:', error);
      const errorMsg = error.response?.data?.message || 'Gagal mengirim formulir terpadu.';
      setToast({ show: true, message: errorMsg, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
      setIsSubmitting(false);
    }
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
            <select 
              value={formData.jenisTransaksi} 
              onChange={(e) => handleTextChange('jenisTransaksi', e)} 
              disabled={['BARU', 'PECAH', 'GABUNG', 'PENGHAPUSAN'].includes(spopTransaksi)}
              className={`w-full h-10 border border-outline-variant rounded px-3 text-sm ${['BARU', 'PECAH', 'GABUNG', 'PENGHAPUSAN'].includes(spopTransaksi) ? 'bg-surface-container-lowest cursor-not-allowed text-on-surface-variant font-bold' : ''}`}
            >
              {['BARU', 'PECAH', 'GABUNG'].includes(spopTransaksi) && (
                <option value="Perekaman Data">Perekaman Data</option>
              )}
              {['MUTASI', 'PERUBAHAN'].includes(spopTransaksi) && (
                <>
                  <option value="Perekaman Data">Perekaman Data</option>
                  <option value="Pemutakhiran Data">Pemutakhiran Data</option>
                  <option value="Penghapusan Data">Penghapusan Data</option>
                </>
              )}
              {spopTransaksi === 'PENGHAPUSAN' && (
                <option value="Penghapusan Data">Penghapusan Data</option>
              )}
              {!spopTransaksi && (
                <>
                  <option value="Perekaman Data">Perekaman Data</option>
                  <option value="Pemutakhiran Data">Pemutakhiran Data</option>
                  <option value="Penghapusan Data">Penghapusan Data</option>
                </>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-primary block text-xs uppercase tracking-wider">NOP</label>
            <input type="text" value={nop} readOnly className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-low text-on-surface-variant font-bold" />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="font-label-sm text-primary block text-[10px] uppercase tracking-widest whitespace-nowrap">Jml Bng</label>
              <input type="number" onWheel={(e) => e.target.blur()} value={totalBangunan} readOnly className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-low text-on-surface-variant font-bold text-center" />
            </div>
            <div className="space-y-2 flex-1">
              <label className="font-label-sm text-primary block text-[10px] uppercase tracking-widest whitespace-nowrap">Bng M²</label>
              <input type="number" onWheel={(e) => e.target.blur()} value={formData.luasBangunan} readOnly className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-low text-on-surface-variant font-bold text-center" placeholder="M²" />
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
                <input type="number" onWheel={(e) => e.target.blur()} value={formData.luasBangunan} onChange={(e) => handleTextChange('luasBangunan', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 45" />
                {errors.luasBangunan && <p className="text-error text-[12px]">{errors.luasBangunan}</p>}
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-primary block">3. Jumlah Lantai</label>
                <input type="number" onWheel={(e) => e.target.blur()} value={formData.jumlahLantai} onChange={(e) => handleTextChange('jumlahLantai', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 1" />
                {errors.jumlahLantai && <p className="text-error text-[12px]">{errors.jumlahLantai}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">4. Tahun Dibangun</label>
                <input type="number" onWheel={(e) => e.target.blur()} value={formData.tahunDibangun} onChange={(e) => handleTextChange('tahunDibangun', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 2010" />
                {errors.tahunDibangun && <p className="text-error text-[12px]">{errors.tahunDibangun}</p>}
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-primary block">5. Tahun Direnovasi (Opsional)</label>
                <input type="number" onWheel={(e) => e.target.blur()} value={formData.tahunDirenovasi} onChange={(e) => handleTextChange('tahunDirenovasi', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Kosongkan jika tidak ada" />
                {errors.tahunDirenovasi && <p className="text-error text-[12px]">{errors.tahunDirenovasi}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">6. Daya Listrik Terpasang (WATT)</label>
                <input type="number" onWheel={(e) => e.target.blur()} value={formData.dayaListrik} onChange={(e) => handleTextChange('dayaListrik', e)} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 1300" />
                {errors.dayaListrik && <p className="text-error text-[12px]">{errors.dayaListrik}</p>}
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
              {/* Kelompok Pendingin Ruangan */}
              <div className="space-y-4 md:col-span-2">
                <ToggleSwitch 
                  label="Pendingin Ruangan (AC)" 
                  description="Apakah terdapat AC Split, AC Window, atau AC Sentral?" 
                  checked={hasAC} 
                  onChange={() => handleToggle(setHasAC, ['acSplit', 'acWindow', 'acSentral'])} 
                />
                {hasAC && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Jumlah AC Split</label>
                      <input type="number" onWheel={(e) => e.target.blur()} value={formData.acSplit} onChange={e => handleTextChange('acSplit', e)} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Unit" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Jumlah AC Window</label>
                      <input type="number" onWheel={(e) => e.target.blur()} value={formData.acWindow} onChange={e => handleTextChange('acWindow', e)} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Unit" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">AC Sentral</label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="acSentral" value="Ada" checked={formData.acSentral === 'Ada'} onChange={e=>handleTextChange('acSentral', e)} className="text-primary focus:ring-primary" /> Ada</label>
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="acSentral" value="Tidak Ada" checked={formData.acSentral === 'Tidak Ada'} onChange={e=>handleTextChange('acSentral', e)} className="text-primary focus:ring-primary" /> Tidak Ada</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Kelompok Eksterior: Kolam Renang */}
              <div className="space-y-4">
                <ToggleSwitch 
                  label="Kolam Renang" 
                  checked={hasKolamRenang} 
                  onChange={() => handleToggle(setHasKolamRenang, ['kolamRenangLuas', 'kolamRenangFinishing'])} 
                />
                {hasKolamRenang && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Luas Kolam (M²)</label>
                      <input type="number" onWheel={(e) => e.target.blur()} value={formData.kolamRenangLuas} onChange={e => handleTextChange('kolamRenangLuas', e)} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Contoh: 50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Finishing / Pelapis</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="kolamRenangFinishing" value="Diplester" checked={formData.kolamRenangFinishing === 'Diplester'} onChange={e=>handleTextChange('kolamRenangFinishing', e)} /> Diplester</label>
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="kolamRenangFinishing" value="Dengan Pelapis" checked={formData.kolamRenangFinishing === 'Dengan Pelapis'} onChange={e=>handleTextChange('kolamRenangFinishing', e)} /> Dengan Pelapis</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Kelompok Eksterior: Pagar */}
              <div className="space-y-4">
                <ToggleSwitch 
                  label="Pagar Halaman" 
                  checked={hasPagar} 
                  onChange={() => handleToggle(setHasPagar, ['panjangPagar', 'bahanPagar'])} 
                />
                {hasPagar && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Panjang Pagar (M)</label>
                      <input type="number" onWheel={(e) => e.target.blur()} value={formData.panjangPagar} onChange={e => handleTextChange('panjangPagar', e)} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Contoh: 15" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Bahan Pagar</label>
                      <select value={formData.bahanPagar} onChange={e => handleTextChange('bahanPagar', e)} className="w-full p-2.5 border border-outline-variant rounded-lg text-sm bg-white">
                        <option value="">- Pilih Bahan -</option>
                        <option value="Baja/Besi">Baja/Besi</option>
                        <option value="Bata/Batako">Bata/Batako</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Kelompok Eksterior: Perkerasan Halaman */}
              <div className="space-y-4 md:col-span-2">
                <ToggleSwitch 
                  label="Perkerasan Halaman (Paving dll)" 
                  description="Apakah terdapat area halaman yang diperkeras permukaannya?" 
                  checked={hasHalaman} 
                  onChange={() => handleToggle(setHasHalaman, ['halamanRingan', 'halamanSedang', 'halamanBerat', 'halamanPenutupLantai'])} 
                />
                {hasHalaman && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn">
                    <h6 className="font-bold text-sm mb-4">Luas Perkerasan Berdasarkan Jenis (M²)</h6>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block">Ringan</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.halamanRingan} onChange={e=>handleTextChange('halamanRingan',e)} className="w-full p-2.5 border rounded-lg" /></div>
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block">Sedang</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.halamanSedang} onChange={e=>handleTextChange('halamanSedang',e)} className="w-full p-2.5 border rounded-lg" /></div>
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block">Berat</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.halamanBerat} onChange={e=>handleTextChange('halamanBerat',e)} className="w-full p-2.5 border rounded-lg" /></div>
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block">Penutup Lantai</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.halamanPenutupLantai} onChange={e=>handleTextChange('halamanPenutupLantai',e)} className="w-full p-2.5 border rounded-lg" /></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lapangan Tenis */}
              <div className="space-y-4 md:col-span-2">
                <ToggleSwitch 
                  label="Lapangan Tenis" 
                  description="Hanya diisi jika terdapat lapangan tenis pada properti." 
                  checked={hasLapanganTenis} 
                  onChange={() => handleToggle(setHasLapanganTenis, ['lapanganTenisLampuBeton', 'lapanganTenisLampuAspal', 'lapanganTenisLampuTanah', 'lapanganTenisTanpaLampuBeton', 'lapanganTenisTanpaLampuAspal', 'lapanganTenisTanpaLampuTanah'])} 
                />
                {hasLapanganTenis && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn">
                    <h6 className="font-bold text-sm mb-4">Matriks Jumlah Lapangan Tenis (Unit)</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-primary mb-3 uppercase tracking-widest border-b pb-2">Dengan Lampu</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center"><label className="text-sm">Beton</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.lapanganTenisLampuBeton} onChange={e=>handleTextChange('lapanganTenisLampuBeton', e)} className="w-24 p-2 border rounded-lg text-center" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Aspal</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.lapanganTenisLampuAspal} onChange={e=>handleTextChange('lapanganTenisLampuAspal', e)} className="w-24 p-2 border rounded-lg text-center" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Tanah Liat/Rumput</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.lapanganTenisLampuTanah} onChange={e=>handleTextChange('lapanganTenisLampuTanah', e)} className="w-24 p-2 border rounded-lg text-center" /></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-outline mb-3 uppercase tracking-widest border-b pb-2">Tanpa Lampu</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center"><label className="text-sm">Beton</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.lapanganTenisTanpaLampuBeton} onChange={e=>handleTextChange('lapanganTenisTanpaLampuBeton', e)} className="w-24 p-2 border rounded-lg text-center" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Aspal</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.lapanganTenisTanpaLampuAspal} onChange={e=>handleTextChange('lapanganTenisTanpaLampuAspal', e)} className="w-24 p-2 border rounded-lg text-center" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Tanah Liat/Rumput</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.lapanganTenisTanpaLampuTanah} onChange={e=>handleTextChange('lapanganTenisTanpaLampuTanah', e)} className="w-24 p-2 border rounded-lg text-center" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lift & Eskalator */}
              <div className="space-y-4 md:col-span-2">
                <ToggleSwitch 
                  label="Gedung Bertingkat (Lift & Eskalator)" 
                  checked={hasLiftEskalator} 
                  onChange={() => handleToggle(setHasLiftEskalator, ['liftPenumpang', 'liftKapsul', 'liftBarang', 'tanggaBerjalanKecil', 'tanggaBerjalanBesar'])} 
                />
                {hasLiftEskalator && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2 border-b pb-2">Jumlah Lift (Unit)</p>
                      <div className="flex justify-between items-center"><label className="text-sm">Penumpang</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.liftPenumpang} onChange={e=>handleTextChange('liftPenumpang', e)} className="w-20 p-2 border rounded-lg text-center" /></div>
                      <div className="flex justify-between items-center"><label className="text-sm">Kapsul</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.liftKapsul} onChange={e=>handleTextChange('liftKapsul', e)} className="w-20 p-2 border rounded-lg text-center" /></div>
                      <div className="flex justify-between items-center"><label className="text-sm">Barang</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.liftBarang} onChange={e=>handleTextChange('liftBarang', e)} className="w-20 p-2 border rounded-lg text-center" /></div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2 border-b pb-2">Jumlah Eskalator (Unit)</p>
                      <div className="flex justify-between items-center"><label className="text-sm">Lebar &lt; 0.80 M</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.tanggaBerjalanKecil} onChange={e=>handleTextChange('tanggaBerjalanKecil', e)} className="w-20 p-2 border rounded-lg text-center" /></div>
                      <div className="flex justify-between items-center"><label className="text-sm">Lebar &gt; 0.80 M</label><input type="number" onWheel={(e) => e.target.blur()} value={formData.tanggaBerjalanBesar} onChange={e=>handleTextChange('tanggaBerjalanBesar', e)} className="w-20 p-2 border rounded-lg text-center" /></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pemadam Kebakaran */}
              <div className="space-y-4 md:col-span-2">
                <ToggleSwitch 
                  label="Keamanan & Pemadam Kebakaran" 
                  checked={hasPemadam} 
                  onChange={() => handleToggle(setHasPemadam, ['pemadamHydrant', 'pemadamSprinkler', 'pemadamFireAl'])} 
                />
                {hasPemadam && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn">
                    <p className="text-xs font-bold text-outline uppercase tracking-wider mb-4">Centang Jika Ada</p>
                    <div className="flex flex-wrap gap-8">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.pemadamHydrant > 0} onChange={e => setFormData(d => ({...d, pemadamHydrant: e.target.checked ? 1 : 0}))} className="w-5 h-5 text-primary rounded" />
                        <span className="text-sm font-semibold">Hydrant</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.pemadamSprinkler > 0} onChange={e => setFormData(d => ({...d, pemadamSprinkler: e.target.checked ? 1 : 0}))} className="w-5 h-5 text-primary rounded" />
                        <span className="text-sm font-semibold">Sprinkler</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.pemadamFireAl > 0} onChange={e => setFormData(d => ({...d, pemadamFireAl: e.target.checked ? 1 : 0}))} className="w-5 h-5 text-primary rounded" />
                        <span className="text-sm font-semibold">Fire Alarm</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Utilitas Tambahan */}
              <div className="space-y-4">
                <ToggleSwitch 
                  label="Saluran PABX (Telepon)" 
                  checked={hasPabx} 
                  onChange={() => handleToggle(setHasPabx, ['saluranPabx'])} 
                />
                {hasPabx && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn">
                    <label className="text-xs font-bold text-on-surface-variant block mb-2 uppercase tracking-wider">Jumlah Saluran</label>
                    <input type="number" onWheel={(e) => e.target.blur()} value={formData.saluranPabx} onChange={e => handleTextChange('saluranPabx', e)} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Unit" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <ToggleSwitch 
                  label="Sumur Artesis" 
                  checked={hasSumur} 
                  onChange={() => handleToggle(setHasSumur, ['sumurArtesis'])} 
                />
                {hasSumur && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn">
                    <label className="text-xs font-bold text-on-surface-variant block mb-2 uppercase tracking-wider">Kedalaman (Meter)</label>
                    <input type="number" onWheel={(e) => e.target.blur()} value={formData.sumurArtesis} onChange={e => handleTextChange('sumurArtesis', e)} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Kedalaman" />
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-outline-variant flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-full font-bold transition-all border-2 border-outline-variant text-on-surface hover:bg-surface-container-low active:scale-95 flex items-center justify-center gap-2`}
            >
              Simpan Draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-12 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 group ${isSubmitting ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-70' : 'bg-primary text-on-primary hover:shadow-lg hover:brightness-110 active:scale-95'}`}
            >
              <span className="material-symbols-outlined">{isSubmitting ? 'hourglass_empty' : 'save'}</span>
              {isSubmitting ? 'Menyimpan...' : nomorBangunan < totalBangunan ? 'Simpan & Lanjut ke Bangunan Berikutnya' : 'Kirim Seluruh Data LSPOP'}
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
