import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';
import api from '../../utils/axios';


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

const RadioGroup = ({ label, field, options, columns = 3, formData, handleTextChange, errors }) => (
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
    {errors?.[field] && <p className="text-error text-[12px] mt-1">{errors[field]}</p>}
  </div>
);

export default function Step4DataBangunan() {

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

  const navigate = useNavigate();
  const { id_transaksi } = useParams();
  const { spopData, formData: ctxFormData, setFormData: setCtxFormData, saveDraft, idTransaksi: ctxId, completionStatus, updateCompletion } = useSpop();

  const parsedTotal = ctxFormData?.jumlahBangunan ? parseInt(ctxFormData.jumlahBangunan, 10) : 1;
  const currentId = ctxId || id_transaksi || '';

  const isPecah = ctxFormData?.transaksi === 'PECAH';
  const requiredBangunan = React.useMemo(() => {
    if (isPecah) {
      const list = [];
      ctxFormData?.pecahanList?.forEach((p, idx) => {
        const jum = parseInt(p.jumlahBangunan, 10) || 0;
        for (let i = 1; i <= jum; i++) {
          list.push({ pecahanIndex: idx, nomorBangunan: i });
        }
      });
      return list;
    } else {
      const list = [];
      const jum = parseInt(ctxFormData?.jumlahBangunan, 10) || 1;
      for (let i = 1; i <= jum; i++) {
        list.push({ pecahanIndex: null, nomorBangunan: i });
      }
      return list;
    }
  }, [ctxFormData, isPecah]);

  const [activeRequiredIndex, setActiveRequiredIndex] = useState(0);

  const formatNop = (n) => {
    if (typeof n === 'string') return n;
    if (!n) return '';
    if (!n.kec && !n.kel && !n.blok && !n.nourut && !n.kode) return 'Belum diisi';
    return `${n.prov || ''}.${n.kab || ''}.${n.kec || ''}.${n.kel || ''}.${n.blok || ''}.${n.nourut || ''}.${n.kode || ''}`;
  };

  const [nop, setNop] = useState(formatNop(ctxFormData?.nop));
  const [nomorBangunan, setNomorBangunan] = useState(1);
  const [totalBangunan, setTotalBangunan] = useState(parsedTotal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [bangunanList, setBangunanList] = useState([]);
  const [isRevisi, setIsRevisi] = useState(spopData?.status_ajuan === 'REVISI');
  const [catatanRevisi, setCatatanRevisi] = useState(spopData?.catatan_bakeuda || '');
  const [draftDataList, setDraftDataList] = useState([]);

  useEffect(() => {
    if (ctxFormData?.transaksi === 'HAPUS') {
      setFormData(prev => ({ ...prev, jenisTransaksi: 'Penghapusan Data' }));
    } else if (['BARU', 'PECAH', 'GABUNG'].includes(ctxFormData?.transaksi)) {
      setFormData(prev => ({ ...prev, jenisTransaksi: 'Perekaman Data' }));
    }
  }, [ctxFormData?.transaksi]);

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


  const applyDataToForm = (data) => {
    // Mapping from snake_case to camelCase for backwards compatibility
    const mappedData = { ...data };

    // Rincian Data Bangunan
    if (data.kode_jpb || data.jenis_penggunaan_bangunan || data.penggunaan) mappedData.jenisPenggunaan = data.kode_jpb || data.jenis_penggunaan_bangunan || data.penggunaan;
    if (data.luas_bangunan || data.luas) mappedData.luasBangunan = data.luas_bangunan || data.luas;
    if (data.jumlah_lantai !== undefined || data.jumlahLantai !== undefined) mappedData.jumlahLantai = data.jumlah_lantai || data.jumlahLantai;
    if (data.tahun_dibangun || data.tahun || data.tahunDibangun) mappedData.tahunDibangun = data.tahun_dibangun || data.tahun || data.tahunDibangun;
    if (data.tahun_direnovasi || data.tahunRenovasi || data.tahun_renovasi) mappedData.tahunDirenovasi = data.tahun_direnovasi || data.tahunRenovasi || data.tahun_renovasi;
    if (data.daya_listrik_watt !== undefined || data.daya_listrik !== undefined || data.listrik !== undefined) mappedData.dayaListrik = data.daya_listrik_watt || data.daya_listrik || data.listrik;
    if (data.kondisi_bangunan || data.kondisi) mappedData.kondisi = data.kondisi_bangunan || data.kondisi;
    if (data.jenis_konstruksi || data.konstruksi) mappedData.konstruksi = data.jenis_konstruksi || data.konstruksi;
    if (data.jenis_atap || data.atap) mappedData.atap = data.jenis_atap || data.atap;
    if (data.kode_dinding || data.dinding) mappedData.dinding = data.kode_dinding || data.dinding;
    if (data.kode_lantai || data.lantai) mappedData.lantai = data.kode_lantai || data.lantai;
    if (data.kode_langit_langit || data.langit_langit || data.langitLangit) mappedData.langitLangit = data.kode_langit_langit || data.langit_langit || data.langitLangit;

    // Mapping fasilitas
    if (data.fasilitas) {
      mappedData.acSplit = data.fasilitas.jumlah_ac_split || '';
      mappedData.acWindow = data.fasilitas.jumlah_ac_window || '';
      mappedData.acSentral = data.fasilitas.ac_sentral ? '1' : '';

      mappedData.kolamRenangLuas = data.fasilitas.luas_kolam_renang || '';
      mappedData.kolamRenangFinishing = data.fasilitas.kolam_dengan_pelapis ? 'Dengan Pelapis' : (data.fasilitas.kolam_diplester ? 'Diplester' : '');

      mappedData.halamanRingan = data.fasilitas.perkerasan_ringan || '';
      mappedData.halamanSedang = data.fasilitas.perkerasan_sedang || '';
      mappedData.halamanBerat = data.fasilitas.perkerasan_berat || '';
      mappedData.halamanPenutupLantai = data.fasilitas.perkerasan_dengan_penutup || '';

      mappedData.panjangPagar = data.fasilitas.panjang_pagar_m || '';
      mappedData.bahanPagar = data.fasilitas.bahan_pagar || '';

      mappedData.lapanganTenisLampuBeton = data.fasilitas.tenis_beton_dgn_lampu || '';
      mappedData.lapanganTenisLampuAspal = data.fasilitas.tenis_aspal_dgn_lampu || '';
      mappedData.lapanganTenisLampuTanah = data.fasilitas.tenis_tanah_rumput_dgn_lampu || '';
      mappedData.lapanganTenisTanpaLampuBeton = data.fasilitas.tenis_beton_tanpa_lampu || '';
      mappedData.lapanganTenisTanpaLampuAspal = data.fasilitas.tenis_aspal_tanpa_lampu || '';
      mappedData.lapanganTenisTanpaLampuTanah = data.fasilitas.tenis_tanah_rumput_tanpa_lampu || '';

      mappedData.liftPenumpang = data.fasilitas.lift_penumpang || '';
      mappedData.liftKapsul = data.fasilitas.lift_kapsul || '';
      mappedData.liftBarang = data.fasilitas.lift_barang || '';
      mappedData.tanggaBerjalanKecil = data.fasilitas.tangga_berjalan_lbr_kurang_080m || '';
      mappedData.tanggaBerjalanBesar = data.fasilitas.tangga_berjalan_lbr_lebih_080m || '';

      mappedData.pemadamHydrant = data.fasilitas.hydrant_ada ? '1' : '';
      mappedData.pemadamSprinkler = data.fasilitas.sprinkler_ada ? '1' : '';
      mappedData.pemadamFireAl = data.fasilitas.fire_alarm_ada ? '1' : '';

      mappedData.saluranPabx = data.fasilitas.jumlah_saluran_pabx || '';
      mappedData.sumurArtesis = data.fasilitas.kedalaman_sumur_artesis_m || '';
    }

    // Pastikan nilai dari DB benar-benar cocok dengan Option Radio
    const radioOptions = {
      jenisPenggunaan: ['Perumahan', 'Perkantoran Swasta', 'Pabrik', 'Toko/Apotik/Pasar/Ruko', 'Rumah Sakit/Klinik', 'Olah Raga/Rekreasi', 'Hotel/Wisma', 'Bengkel/Gudang/Pertanian', 'Gedung Pemerintah', 'Lain-lain', 'Bng Tidak Kena Pajak', 'Bangunan Parkir', 'Apartemen', 'Pompa Bensin', 'Tangki Minyak', 'Gedung Sekolah'],
      kondisi: ['Sangat Baik', 'Baik', 'Sedang', 'Jelek'],
      konstruksi: ['Baja', 'Beton', 'Batu Bata', 'Kayu'],
      atap: ['Decrabon/Beton/Genteng Glazur', 'Genteng Beton/Aluminium', 'Genteng Biasa/Sirap', 'Asbes', 'Seng'],
      dinding: ['Kaca/Aluminium', 'Beton', 'Batu Bata/Conblok', 'Kayu', 'Seng', 'Tidak ada Dinding'],
      lantai: ['Marmer', 'Keramik', 'Teraso', 'Ubin PC/Papan', 'Semen'],
      langitLangit: ['Akustik/Jati', 'Triplek/Asbes/Bambu', 'Tidak Ada']
    };

    const normalizeString = (str) => String(str).toLowerCase().replace(/_/g, ' ').replace(/[^a-z0-9]/g, '');

    Object.keys(radioOptions).forEach(field => {
      if (mappedData[field]) {
        if (field === 'jenisPenggunaan' && !isNaN(mappedData[field])) {
          const mapJpb = { '01': 'Perumahan', '02': 'Perkantoran Swasta', '03': 'Pabrik', '04': 'Toko/Apotik/Pasar/Ruko', '05': 'Rumah Sakit/Klinik', '06': 'Olah Raga/Rekreasi', '07': 'Hotel/Wisma', '08': 'Bengkel/Gudang/Pertanian', '09': 'Gedung Pemerintah', '10': 'Lain-lain', '11': 'Bng Tidak Kena Pajak', '12': 'Bangunan Parkir', '13': 'Apartemen', '14': 'Pompa Bensin', '15': 'Tangki Minyak', '16': 'Gedung Sekolah' };
          const strVal = String(mappedData[field]).padStart(2, '0');
          if (mapJpb[strVal]) mappedData[field] = mapJpb[strVal];
        }

        const dbValNorm = normalizeString(mappedData[field]);
        const match = radioOptions[field].find(opt => normalizeString(opt) === dbValNorm);
        if (match) {
          mappedData[field] = match;
        }
      }
    });

    setFormData(prev => ({ ...prev, ...mappedData }));
    setHasAC(parseFloat(mappedData.acSplit || 0) > 0 || parseFloat(mappedData.acWindow || 0) > 0 || parseFloat(mappedData.acSentral || 0) > 0);
    setHasKolamRenang(parseFloat(mappedData.kolamRenangLuas || 0) > 0);
    setHasHalaman(parseFloat(mappedData.halamanRingan || 0) > 0 || parseFloat(mappedData.halamanSedang || 0) > 0 || parseFloat(mappedData.halamanBerat || 0) > 0);
    setHasPagar(parseFloat(mappedData.panjangPagar || 0) > 0);
    setHasLapanganTenis(
      parseFloat(mappedData.lapanganTenisLampuBeton || 0) > 0 || parseFloat(mappedData.lapanganTenisLampuAspal || 0) > 0 || parseFloat(mappedData.lapanganTenisLampuTanah || 0) > 0 ||
      parseFloat(mappedData.lapanganTenisTanpaLampuBeton || 0) > 0 || parseFloat(mappedData.lapanganTenisTanpaLampuAspal || 0) > 0 || parseFloat(mappedData.lapanganTenisTanpaLampuTanah || 0) > 0
    );
    setHasLiftEskalator(parseFloat(mappedData.liftPenumpang || 0) > 0 || parseFloat(mappedData.liftKapsul || 0) > 0 || parseFloat(mappedData.liftBarang || 0) > 0 || parseFloat(mappedData.tanggaBerjalanKecil || 0) > 0 || parseFloat(mappedData.tanggaBerjalanBesar || 0) > 0);
    setHasPemadam(parseFloat(mappedData.pemadamHydrant || 0) > 0 || parseFloat(mappedData.pemadamSprinkler || 0) > 0 || parseFloat(mappedData.pemadamFireAl || 0) > 0);
    setHasPabx(parseFloat(mappedData.saluranPabx || 0) > 0);
    setHasSumur(parseFloat(mappedData.sumurArtesis || 0) > 0);
  };

  useEffect(() => {
    if (!spopData) return;

    let flatList = [];
    if (isPecah) {
      spopData.detail_tujuan?.forEach((t, idx) => {
        if (t.data_bangunan_json) {
          let parsed = typeof t.data_bangunan_json === 'string' ? JSON.parse(t.data_bangunan_json) : t.data_bangunan_json;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (Array.isArray(parsed)) {
            parsed.forEach(b => {
              b._pecahanIndex = idx;
              flatList.push(b);
            });
          }
        }
      });
    } else {
      const detailTujuan = spopData.detail_tujuan && spopData.detail_tujuan[0];
      if (detailTujuan?.data_bangunan_json) {
        let parsedList = typeof detailTujuan.data_bangunan_json === 'string'
          ? JSON.parse(detailTujuan.data_bangunan_json)
          : detailTujuan.data_bangunan_json;
        if (typeof parsedList === 'string') parsedList = JSON.parse(parsedList);
        if (Array.isArray(parsedList)) {
          flatList = parsedList;
        }
      }
    }

    if (flatList.length > 0) {
      flatList.forEach(bangunan => {
        Object.keys(bangunan).forEach(key => {
          if (bangunan[key] === 0) bangunan[key] = '';
        });
      });
      setDraftDataList(flatList);
      setBangunanList([]);
      setActiveRequiredIndex(0);
      setTimeout(() => applyDataToForm(flatList[0]), 0);
    }
  }, [spopData, isPecah]);

  // Auto-fill Luas Bangunan for GABUNG
  useEffect(() => {
    const fetchLuasGabung = async () => {
      if (ctxFormData.transaksi === 'GABUNG' && ctxFormData.nopAsalList?.length > 1 && activeRequiredIndex === 0) {
        if (!formData.luasBangunan || formData.luasBangunan === '0') {
          let totalLuas = 0;
          for (const rawNop of ctxFormData.nopAsalList) {
            const cleanNop = String(rawNop).replace(/\D/g, '');
            if (cleanNop.length === 18) {
              try {
                const res = await api.get(`/objek-pajak/${cleanNop}`);
                if (res.data?.data?.luas_bangunan) {
                  totalLuas += parseFloat(res.data.data.luas_bangunan);
                }
              } catch (e) {
                console.error('Gagal mengambil detail NOP', cleanNop);
              }
            }
          }
          if (totalLuas > 0) {
            setFormData(prev => ({ ...prev, luasBangunan: totalLuas.toString() }));
          }
        }
      }
    };
    fetchLuasGabung();
  }, [ctxFormData.transaksi, ctxFormData.nopAsalList, nomorBangunan]);

  const [errors, setErrors] = useState({});

  const handleTextChange = (field, event) => {
    let value = event.target.value;

    // Constraint khusus tahun (maksimal 4 digit, hanya angka, tidak boleh minus)
    if (field === 'tahunDibangun' || field === 'tahunDirenovasi') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
    }

    // Constraint khusus jumlah lantai (maksimal 2 digit / 99)
    if (field === 'jumlahLantai') {
      value = value.replace(/\D/g, '');
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
      if (sanitizedData[key] === '' || sanitizedData[key] === null || sanitizedData[key] === undefined) {
        delete sanitizedData[key];
      }
    });

    if (sanitizedData.fasilitas) {
      delete sanitizedData.fasilitas;
    }

    // Add form structure attributes expected by backend
    sanitizedData.noFormulir = nop;
    sanitizedData.jenisTransaksi = localStorage.getItem('lspop_jenis_transaksi') || 'BARU';
    sanitizedData.jumlahBng = totalBangunan.toString();
    sanitizedData.bangunanM2 = sanitizedData.luasBangunan ? sanitizedData.luasBangunan.toString() : '0';

    if (requiredBangunan[activeRequiredIndex]) {
      sanitizedData._pecahanIndex = requiredBangunan[activeRequiredIndex].pecahanIndex;
    }
    sanitizedData.jumlahBng = requiredBangunan.length.toString();

    return sanitizedData;
  };

  const handleSaveDraft = async () => {
    if (!validateDraftForm()) {
      setToast({ show: true, message: 'Harap perbaiki kesalahan format/relasi sebelum menyimpan draft.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedData = getSanitizedData();
      const hasData = Object.keys(sanitizedData).some(k => !['noFormulir', 'jenisTransaksi', 'jumlahBng', 'bangunanM2'].includes(k));
      const newBangunanList = hasData ? [...bangunanList, sanitizedData] : bangunanList;

      setCtxFormData(prev => ({ ...prev, data_bangunan_json: newBangunanList }));
      await saveDraft({ data_bangunan_json: newBangunanList });
      navigate('/draft-spop');
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Gagal menyimpan draft.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
      setIsSubmitting(false);
    }
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

    if (activeRequiredIndex < requiredBangunan.length - 1) {
      setBangunanList(newBangunanList);
      setIsSubmitting(false);
      setToast({ show: true, message: `Data Bangunan berhasil disimpan sementara. Lanjut ke bangunan berikutnya.`, type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);

      const nextIdx = activeRequiredIndex + 1;
      if (isRevisi && draftDataList[nextIdx]) {
        applyDataToForm(draftDataList[nextIdx]);
      } else {
        resetForm();
      }

      setActiveRequiredIndex(nextIdx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      try {
        setCtxFormData(prev => ({ ...prev, data_bangunan_json: newBangunanList }));
        updateCompletion(4, true);
        await saveDraft({ data_bangunan_json: newBangunanList });
        setIsSubmitting(false);
        setToast({ show: true, message: 'Seluruh Data Bangunan berhasil disimpan.', type: 'success' });
        setTimeout(() => navigate(`/spop/konfirmasi/${currentId}`), 1000);
      } catch (error) {
        setIsSubmitting(false);
        console.error('SAVE ERROR:', error);
        let errorMsg = 'Gagal menyimpan data bangunan.';
        if (error.response?.data?.message) {
          errorMsg = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        setToast({ show: true, message: errorMsg, type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 8000);
      }
    }
  };


  return (
    <div>
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
            <label className="font-label-sm text-primary block text-xs uppercase tracking-wider">No. Formulir (Opsional)</label>
            <input type="text" value={formData.noFormulir} onChange={(e) => handleTextChange('noFormulir', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono" placeholder="No. Formulir" />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-primary block text-xs uppercase tracking-wider">Jenis Transaksi</label>
            <select
              value={formData.jenisTransaksi}
              onChange={(e) => handleTextChange('jenisTransaksi', { target: { value: e.target.value } })}
              disabled={['BARU', 'PECAH', 'GABUNG', 'HAPUS'].includes(ctxFormData?.transaksi)}
              className={`w-full h-10 border border-outline-variant rounded px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none ${['BARU', 'PECAH', 'GABUNG', 'HAPUS'].includes(ctxFormData?.transaksi) ? 'bg-surface-container-lowest cursor-not-allowed text-on-surface-variant font-bold' : 'bg-white'}`}
            >
              {['BARU', 'PECAH', 'GABUNG'].includes(ctxFormData?.transaksi) && (
                <option value="Perekaman Data">1. Perekaman Data</option>
              )}
              {['MUTASI', 'PERUBAHAN_DATA'].includes(ctxFormData?.transaksi) && (
                <>
                  <option value="Perekaman Data">1. Perekaman Data</option>
                  <option value="Pemutakhiran Data">2. Pemutakhiran Data</option>
                  <option value="Penghapusan Data">3. Penghapusan Data</option>
                </>
              )}
              {ctxFormData?.transaksi === 'HAPUS' && (
                <option value="Penghapusan Data">3. Penghapusan Data</option>
              )}
              {!ctxFormData?.transaksi && (
                <>
                  <option value="Perekaman Data">1. Perekaman Data</option>
                  <option value="Pemutakhiran Data">2. Pemutakhiran Data</option>
                  <option value="Penghapusan Data">3. Penghapusan Data</option>
                </>
              )}
            </select>
          </div>
          {ctxFormData?.transaksi !== 'BARU' && (
            <div className="space-y-2">
              <label className="font-label-sm text-primary block text-xs uppercase tracking-wider">NOP</label>
              <input type="text" value={nop} disabled className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-lowest text-on-surface-variant font-bold cursor-not-allowed" />
            </div>
          )}
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="font-label-sm text-primary block text-[10px] uppercase tracking-widest whitespace-nowrap">Jml Bng</label>
              <input type="text" value={totalBangunan} disabled className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-lowest text-on-surface-variant font-bold text-center cursor-not-allowed" />
            </div>
            <div className="space-y-2 flex-1">
              <label className="font-label-sm text-primary block text-[10px] uppercase tracking-widest whitespace-nowrap">Bng M²</label>
              <input type="text" value={formData.luasBangunan || ''} disabled className="w-full h-10 border border-outline-variant rounded px-3 font-data-mono bg-surface-container-lowest text-on-surface-variant font-bold text-center cursor-not-allowed" placeholder="M²" />
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
                 formData={formData} handleTextChange={handleTextChange} errors={errors} />
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">2. Luas Bangunan (M²)</label>
                <input type="text" inputMode="decimal" value={formData.luasBangunan} onChange={(e) => handleTextChange('luasBangunan', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 45" />
                {errors.luasBangunan && <p className="text-error text-[12px]">{errors.luasBangunan}</p>}
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-primary block">3. Jumlah Lantai</label>
                <input type="text" value={formData.jumlahLantai} onChange={(e) => handleTextChange('jumlahLantai', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 1" />
                {errors.jumlahLantai && <p className="text-error text-[12px]">{errors.jumlahLantai}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">4. Tahun Dibangun</label>
                <input type="text" value={formData.tahunDibangun} onChange={(e) => handleTextChange('tahunDibangun', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className={`w-full h-12 border ${errors.tahunDibangun ? 'border-error' : 'border-outline-variant'} rounded px-4 font-data-mono`} placeholder="Contoh: 2010" />
                {errors.tahunDibangun && <p className="text-error text-[12px]">{errors.tahunDibangun}</p>}
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-primary block">5. Tahun Direnovasi (Opsional)</label>
                <input type="text" value={formData.tahunDirenovasi} onChange={(e) => handleTextChange('tahunDirenovasi', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Kosongkan jika tidak ada" />
                {errors.tahunDirenovasi && <p className="text-error text-[12px]">{errors.tahunDirenovasi}</p>}
              </div>

              <div className="space-y-2">
                <label className="font-label-sm text-primary block">6. Daya Listrik Terpasang (WATT)</label>
                <input type="text" inputMode="decimal" value={formData.dayaListrik} onChange={(e) => handleTextChange('dayaListrik', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono" placeholder="Contoh: 1300" />
                {errors.dayaListrik && <p className="text-error text-[12px]">{errors.dayaListrik}</p>}
              </div>
              <div className="space-y-2"></div>

              <div className="md:col-span-2 grid grid-cols-1 gap-6">
                <RadioGroup label="7. Kondisi Pada Umumnya" field="kondisi" columns={4} options={['Sangat Baik', 'Baik', 'Sedang', 'Jelek']}  formData={formData} handleTextChange={handleTextChange} errors={errors} />
                <RadioGroup label="8. Konstruksi" field="konstruksi" columns={4} options={['Baja', 'Beton', 'Batu Bata', 'Kayu']}  formData={formData} handleTextChange={handleTextChange} errors={errors} />
                <RadioGroup label="9. Atap" field="atap" columns={3} options={['Decrabon/Beton/Genteng Glazur', 'Genteng Beton/Aluminium', 'Genteng Biasa/Sirap', 'Asbes', 'Seng']}  formData={formData} handleTextChange={handleTextChange} errors={errors} />
                <RadioGroup label="10. Dinding" field="dinding" columns={3} options={['Kaca/Aluminium', 'Beton', 'Batu Bata/Conblok', 'Kayu', 'Seng', 'Tidak ada Dinding']}  formData={formData} handleTextChange={handleTextChange} errors={errors} />
                <RadioGroup label="11. Lantai" field="lantai" columns={5} options={['Marmer', 'Keramik', 'Teraso', 'Ubin PC/Papan', 'Semen']}  formData={formData} handleTextChange={handleTextChange} errors={errors} />
                <RadioGroup label="12. Langit-Langit" field="langitLangit" columns={3} options={['Akustik/Jati', 'Triplek/Asbes/Bambu', 'Tidak Ada']}  formData={formData} handleTextChange={handleTextChange} errors={errors} />
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
                      <input type="text" inputMode="decimal" value={formData.acSplit} onChange={(e) => handleTextChange('acSplit', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Unit" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Jumlah AC Window</label>
                      <input type="text" inputMode="decimal" value={formData.acWindow} onChange={(e) => handleTextChange('acWindow', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Unit" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">AC Sentral</label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="acSentral" value="Ada" checked={formData.acSentral === 'Ada'} onChange={(e) => handleTextChange('acSentral', { target: { value: e.target.value } })} className="text-primary focus:ring-primary" /> Ada</label>
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="acSentral" value="Tidak Ada" checked={formData.acSentral === 'Tidak Ada'} onChange={(e) => handleTextChange('acSentral', { target: { value: e.target.value } })} className="text-primary focus:ring-primary" /> Tidak Ada</label>
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
                      <input type="text" inputMode="decimal" value={formData.kolamRenangLuas} onChange={(e) => handleTextChange('kolamRenangLuas', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Contoh: 50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Finishing / Pelapis</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="kolamRenangFinishing" value="Diplester" checked={formData.kolamRenangFinishing === 'Diplester'} onChange={(e) => handleTextChange('kolamRenangFinishing', { target: { value: e.target.value } })} /> Diplester</label>
                        <label className="flex items-center gap-2 text-sm"><input type="radio" name="kolamRenangFinishing" value="Dengan Pelapis" checked={formData.kolamRenangFinishing === 'Dengan Pelapis'} onChange={(e) => handleTextChange('kolamRenangFinishing', { target: { value: e.target.value } })} /> Dengan Pelapis</label>
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
                      <input type="text" inputMode="decimal" value={formData.panjangPagar} onChange={(e) => handleTextChange('panjangPagar', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Contoh: 15" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant block uppercase tracking-wider">Bahan Pagar</label>
                      <select value={formData.bahanPagar} onChange={(e) => handleTextChange('bahanPagar', { target: { value: e.target.value } })} className="w-full p-2.5 border border-outline-variant rounded-lg text-sm bg-white">
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
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block font-bold">Ringan</label><span className="text-[10px] text-on-surface-variant block -mt-1 leading-tight">Aspal tipis / paving tanpa pondasi</span><input type="text" inputMode="decimal" value={formData.halamanRingan} onChange={(e) => handleTextChange('halamanRingan', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border rounded-lg" placeholder="Contoh: 100" /></div>
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block font-bold">Sedang</label><span className="text-[10px] text-on-surface-variant block -mt-1 leading-tight">Aspal tebal / paving berpondasi</span><input type="text" inputMode="decimal" value={formData.halamanSedang} onChange={(e) => handleTextChange('halamanSedang', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border rounded-lg" placeholder="Contoh: 50" /></div>
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block font-bold">Berat</label><span className="text-[10px] text-on-surface-variant block -mt-1 leading-tight">Beton / aspal kendaraan berat</span><input type="text" inputMode="decimal" value={formData.halamanBerat} onChange={(e) => handleTextChange('halamanBerat', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border rounded-lg" placeholder="Contoh: 150" /></div>
                      <div className="space-y-2"><label className="text-xs text-on-surface-variant block font-bold">Penutup Lantai</label><span className="text-[10px] text-on-surface-variant block -mt-1 leading-tight">Keramik / batu alam eksterior</span><input type="text" inputMode="decimal" value={formData.halamanPenutupLantai} onChange={(e) => handleTextChange('halamanPenutupLantai', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border rounded-lg" placeholder="Contoh: 20" /></div>
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
                    <h6 className="font-bold text-sm">Matriks Jumlah Lapangan Tenis (Unit)</h6>
                    <p className="text-[11px] text-on-surface-variant mb-4 leading-relaxed">Isi dengan jumlah unit lapangan tenis berdasarkan jenis permukaan dan fasilitas penerangannya.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-primary mb-3 uppercase tracking-widest border-b pb-2">Dengan Lampu</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center"><label className="text-sm">Beton</label><input type="text" inputMode="decimal" value={formData.lapanganTenisLampuBeton} onChange={(e) => handleTextChange('lapanganTenisLampuBeton', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Aspal</label><input type="text" inputMode="decimal" value={formData.lapanganTenisLampuAspal} onChange={(e) => handleTextChange('lapanganTenisLampuAspal', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Tanah Liat/Rumput</label><input type="text" inputMode="decimal" value={formData.lapanganTenisLampuTanah} onChange={(e) => handleTextChange('lapanganTenisLampuTanah', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-outline mb-3 uppercase tracking-widest border-b pb-2">Tanpa Lampu</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center"><label className="text-sm">Beton</label><input type="text" inputMode="decimal" value={formData.lapanganTenisTanpaLampuBeton} onChange={(e) => handleTextChange('lapanganTenisTanpaLampuBeton', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Aspal</label><input type="text" inputMode="decimal" value={formData.lapanganTenisTanpaLampuAspal} onChange={(e) => handleTextChange('lapanganTenisTanpaLampuAspal', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                          <div className="flex justify-between items-center"><label className="text-sm">Tanah Liat/Rumput</label><input type="text" inputMode="decimal" value={formData.lapanganTenisTanpaLampuTanah} onChange={(e) => handleTextChange('lapanganTenisTanpaLampuTanah', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
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
                      <div className="flex justify-between items-center"><div className="flex flex-col"><label className="text-sm font-bold">Penumpang</label><span className="text-[10px] text-on-surface-variant">Lift orang dalam gedung</span></div><input type="text" inputMode="decimal" value={formData.liftPenumpang} onChange={(e) => handleTextChange('liftPenumpang', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                      <div className="flex justify-between items-center"><div className="flex flex-col"><label className="text-sm font-bold">Kapsul</label><span className="text-[10px] text-on-surface-variant">Lift kaca tembus pandang</span></div><input type="text" inputMode="decimal" value={formData.liftKapsul} onChange={(e) => handleTextChange('liftKapsul', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                      <div className="flex justify-between items-center"><div className="flex flex-col"><label className="text-sm font-bold">Barang</label><span className="text-[10px] text-on-surface-variant">Lift khusus angkut kargo</span></div><input type="text" inputMode="decimal" value={formData.liftBarang} onChange={(e) => handleTextChange('liftBarang', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-outline uppercase tracking-wider mb-2 border-b pb-2">Jumlah Eskalator (Unit)</p>
                      <div className="flex justify-between items-center"><div className="flex flex-col"><label className="text-sm font-bold">Lebar &lt; 0.80 M</label><span className="text-[10px] text-on-surface-variant">Kapasitas 1 orang</span></div><input type="text" inputMode="decimal" value={formData.tanggaBerjalanKecil} onChange={(e) => handleTextChange('tanggaBerjalanKecil', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
                      <div className="flex justify-between items-center"><div className="flex flex-col"><label className="text-sm font-bold">Lebar &gt; 0.80 M</label><span className="text-[10px] text-on-surface-variant">Kapasitas 2 orang/lebih</span></div><input type="text" inputMode="decimal" value={formData.tanggaBerjalanBesar} onChange={(e) => handleTextChange('tanggaBerjalanBesar', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-24 p-2 border rounded-lg text-center text-sm" placeholder="Jml Unit" /></div>
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
                        <input type="checkbox" checked={formData.pemadamHydrant > 0} onChange={e => setFormData(d => ({ ...d, pemadamHydrant: e.target.checked ? 1 : 0 }))} className="w-5 h-5 text-primary rounded" />
                        <span className="text-sm font-semibold">Hydrant</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.pemadamSprinkler > 0} onChange={e => setFormData(d => ({ ...d, pemadamSprinkler: e.target.checked ? 1 : 0 }))} className="w-5 h-5 text-primary rounded" />
                        <span className="text-sm font-semibold">Sprinkler</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.pemadamFireAl > 0} onChange={e => setFormData(d => ({ ...d, pemadamFireAl: e.target.checked ? 1 : 0 }))} className="w-5 h-5 text-primary rounded" />
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
                  description="Saluran telepon internal antar ruangan dalam gedung / ekstensi."
                  checked={hasPabx}
                  onChange={() => handleToggle(setHasPabx, ['saluranPabx'])}
                />
                {hasPabx && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn">
                    <label className="text-xs font-bold text-on-surface-variant block mb-2 uppercase tracking-wider">Jumlah Saluran</label>
                    <input type="text" inputMode="decimal" value={formData.saluranPabx} onChange={(e) => handleTextChange('saluranPabx', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Unit" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <ToggleSwitch
                  label="Sumur Artesis"
                  description="Sumur bor dalam untuk sumber air tanah sekunder."
                  checked={hasSumur}
                  onChange={() => handleToggle(setHasSumur, ['sumurArtesis'])}
                />
                {hasSumur && (
                  <div className="p-5 border border-outline-variant rounded-xl bg-surface-container-lowest animate-fadeIn">
                    <label className="text-xs font-bold text-on-surface-variant block mb-2 uppercase tracking-wider">Kedalaman (Meter)</label>
                    <input type="text" inputMode="decimal" value={formData.sumurArtesis} onChange={(e) => handleTextChange('sumurArtesis', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })} className="w-full p-2.5 border border-outline-variant rounded-lg" placeholder="Kedalaman" />
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-outline-variant flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-white text-on-surface rounded-full font-bold hover:bg-surface-container-low border-2 border-outline-variant transition-all flex items-center gap-2"
            >
              Simpan Draft
            </button>
            <button
              type="button"
              onClick={() => navigate(`/spop/objek-pajak/${currentId}`)}
              className="px-6 py-2.5 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-12 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 group ${isSubmitting ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-70' : 'bg-primary text-on-primary hover:shadow-lg hover:brightness-110 active:scale-95'}`}
            >
              <span className="material-symbols-outlined">{isSubmitting ? 'hourglass_empty' : 'save'}</span>
              {isSubmitting ? 'Menyimpan...' : (activeRequiredIndex < requiredBangunan.length - 1 ? 'Simpan & Lanjut ke Bangunan Berikutnya' : (isRevisi ? 'Simpan & Ajukan Ulang ke Bakeuda' : 'Kirim Seluruh Data LSPOP'))}
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
    </div>
  );
}
