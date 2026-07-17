import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { id } = useParams();
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
    kecamatanObjek: '',
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
  const [jenisDokumenUpload, setJenisDokumenUpload] = useState('Sertifikat/KTP/Lainnya');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleFileUpload = async (e, explicitJenis = null) => {
    const file = e.target.files[0];
    const jenis = explicitJenis || jenisDokumenUpload;
    if (file) {
      setIsUploading(true);

      try {
        const uploadData = new FormData();
        uploadData.append('file', file);
        
        const res = await api.post('/transaksi-spop/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const fileUrl = res.data.url_file;

        setFormData(prev => ({
          ...prev,
          lampiran: [...prev.lampiran, { jenis_dokumen: jenis, url_file: fileUrl }]
        }));
      } catch (err) {
        console.error('Upload error:', err);
        setToast({ show: true, message: 'Gagal mengunggah file. Pastikan ukuran di bawah 5MB.', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
      } finally {
        setIsUploading(false);
      }
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
    let val = e.target.value;

    // Filter angka saja
    if (['nik', 'npwp', 'noTelp', 'rt', 'rw', 'kodePos', 'rtObjek', 'rwObjek'].includes(field)) {
      val = val.replace(/\D/g, '');
    }

    // Uppercase untuk nama
    if (field === 'nama') {
      val = val.toUpperCase();
    }

    setFormData(prev => {
      const nextState = { ...prev, [field]: val };
      
      // Jika ubah jenis tanah bukan TANAH_BANGUNAN, kunci jumlah & luas bangunan jadi 0
      if (field === 'jenisTanah' && val !== 'TANAH_BANGUNAN') {
        nextState.luasBangunan = '0';
        nextState.jumlahBangunan = '0';
      }
      
      return nextState;
    });
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
  
  useEffect(() => {
    if (id) {
      // Fetch draft data
      api.get(`/transaksi-spop/${id}`)
        .then(res => {
          const data = res.data.data;
          if (data && data.status_ajuan === 'DRAFT') {
            const mapWpRev = { 'PEMILIK': 'PEMILIK', 'PENYEWA': 'PENYEWA', 'PENGELOLA': 'PENGELOLA', 'PEMAKAI': 'PEMAKAI', 'SENGKETA': 'SENGKETA' };
            const mapPekerjaanRev = { 'PNS': 'PNS', 'ABRI': 'ABRI', 'PENSIUNAN': 'PENSIUNAN', 'BADAN': 'BADAN', 'LAINNYA': 'LAINNYA' };
            
            const detailTujuan = data.detail_tujuan && data.detail_tujuan[0];
            const subjekPajak = data.calon_subjek_temp;

            let nopObj = { prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' };
            let nopBersamaObj = { prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' };
            let spptLamaVal = data.no_sppt_lama ? formatSPPTString(data.no_sppt_lama) : '';
            let nopsAsal = ['33.03.'];

            if (data.detail_asal && data.detail_asal.length > 0) {
              const nopString = data.detail_asal[0].nop_asal;
              if (nopString && nopString.length === 18) {
                 nopObj = {
                   prov: nopString.substring(0, 2),
                   kab: nopString.substring(2, 4),
                   kec: nopString.substring(4, 7),
                   kel: nopString.substring(7, 10),
                   blok: nopString.substring(10, 13),
                   nourut: nopString.substring(13, 17),
                   kode: nopString.substring(17, 18),
                 };
              }
              if (data.detail_asal.length > 1) {
                 nopsAsal = data.detail_asal.slice(1).map(d => formatNOPString(d.nop_asal));
              } else if (data.jenis_transaksi === 'PECAH' || data.jenis_transaksi === 'GABUNG') {
                 nopsAsal = data.detail_asal.map(d => formatNOPString(d.nop_asal));
              }
            }

            if (data.nop_bersama && data.nop_bersama.length === 18) {
               nopBersamaObj = {
                   prov: data.nop_bersama.substring(0, 2),
                   kab: data.nop_bersama.substring(2, 4),
                   kec: data.nop_bersama.substring(4, 7),
                   kel: data.nop_bersama.substring(7, 10),
                   blok: data.nop_bersama.substring(10, 13),
                   nourut: data.nop_bersama.substring(13, 17),
                   kode: data.nop_bersama.substring(17, 18),
               };
            }

            setSpptLama(spptLamaVal);
            if (nopsAsal.length > 0) setNopAsalList(nopsAsal);

            // 1. Sanitize dummy values
            const sanitize = (val, dummyVals) => (!val || dummyVals.includes(val)) ? '' : val;

            const cleanNik = sanitize(detailTujuan?.nik_calon_subjek, ['0000000000000000', '']);
            const cleanNama = sanitize(data.nama_pengaju, ['DRAFT', '']);
            const cleanAlamat = sanitize(subjekPajak?.alamat, ['DRAFT', '']);
            const cleanKel = sanitize(subjekPajak?.kelurahan, ['DRAFT', '']);
            const cleanKec = sanitize(subjekPajak?.kecamatan, ['DRAFT', '']);
            const cleanKab = sanitize(subjekPajak?.kabupaten, ['DRAFT', '']);
            const cleanRt = sanitize(subjekPajak?.rt, ['000', '']);
            const cleanRw = sanitize(subjekPajak?.rw, ['000', '']);
            const cleanJenisTanah = sanitize(detailTujuan?.jenis_tanah_baru, ['TANAH_KOSONG', '']);
            const cleanPekerjaan = sanitize(subjekPajak?.pekerjaan, ['LAINNYA', '']);
            
            // 2. Extract and store data_bangunan_json for LSPOP
            if (detailTujuan?.data_bangunan_json) {
              localStorage.setItem('lspop_draft_bangunan', JSON.stringify(detailTujuan.data_bangunan_json));
            }

            // 3. Smart Step Jump
            const isStep2Complete = cleanNik?.length === 16 && cleanNama && subjekPajak?.status_wp && subjekPajak?.pekerjaan && cleanAlamat && cleanRt && cleanRw && cleanKel && cleanKec && cleanKab;
            const isStep3Complete = detailTujuan?.jalan_op_baru && detailTujuan?.rt_op_baru && detailTujuan?.rw_op_baru && detailTujuan?.kelurahan_op_baru && detailTujuan?.kecamatan_op_baru && detailTujuan?.luas_tanah_baru > 0 && cleanJenisTanah;
            
            let calculatedStep = 2;
            if (isStep2Complete && isStep3Complete) {
              calculatedStep = 4;
            } else if (isStep2Complete) {
              calculatedStep = 3;
            }
            setStep(calculatedStep);

            setFormData(prev => ({
              ...prev,
              transaksi: data.jenis_transaksi,
              kategoriTransaksi: ['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi) 
                ? 'baru' 
                : ['MUTASI', 'PERUBAHAN_DATA'].includes(data.jenis_transaksi) 
                  ? 'update' 
                  : 'hapus',
              isKuasa: data.menggunakan_kuasa,
              nop: nopObj,
              nopBersama: nopBersamaObj,
              nik: cleanNik,
              nama: cleanNama,
              statusWp: subjekPajak?.status_wp ? mapWpRev[subjekPajak.status_wp] : '',
              pekerjaan: cleanPekerjaan ? mapPekerjaanRev[cleanPekerjaan] : '',
              alamat: cleanAlamat,
              rt: cleanRt,
              rw: cleanRw,
              kelurahan: cleanKel,
              kecamatan: cleanKec,
              kabupaten: cleanKab,
              kodePos: subjekPajak?.kode_pos || '',
              npwp: subjekPajak?.npwp || '',
              noTelp: subjekPajak?.no_hp || '',
              blokKav: subjekPajak?.blok_kav_no_subjek || '',
              luasTanah: detailTujuan?.luas_tanah_baru || '',
              jenisTanah: cleanJenisTanah,
              luasBangunan: detailTujuan?.luas_bangunan_baru || '',
              jumlahBangunan: detailTujuan?.jumlah_bangunan_baru || '0',
              alamatObjek: detailTujuan?.jalan_op_baru || '',
              rtObjek: detailTujuan?.rt_op_baru || '',
              rwObjek: detailTujuan?.rw_op_baru || '',
              kelurahanObjek: detailTujuan?.kelurahan_op_baru || '',
              kecamatanObjek: detailTujuan?.kecamatan_op_baru || '',
              noPersil: detailTujuan?.no_persil_baru || '',
              blokKavObjek: detailTujuan?.blok_kav_no_baru || '',
              latitude: detailTujuan?.latitude || '',
              longitude: detailTujuan?.longitude || '',
              batasUtara: detailTujuan?.batas_utara || '',
              batasSelatan: detailTujuan?.batas_selatan || '',
              batasTimur: detailTujuan?.batas_timur || '',
              batasBarat: detailTujuan?.batas_barat || '',
              lampiran: data.lampiran || [],
            }));
          }
        })
        .catch(err => {
          console.error("Gagal memuat draf:", err);
          setToast({ show: true, message: 'Gagal memuat draf', type: 'error' });
        });
    }
  }, [id]);
  useEffect(() => {
    if (formData.jenisTanah === 'TANAH_KOSONG') {
      setFormData(prev => ({ ...prev, jumlahBangunan: '0', luasBangunan: '' }));
    }
  }, [formData.jenisTanah]);

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

      // Validasi NOP Bersama jika ada isinya selain prefix default 3303
      const nb = formData.nopBersama;
      const nbString = `${nb.prov}${nb.kab}${nb.kec}${nb.kel}${nb.blok}${nb.nourut}${nb.kode}`.trim();
      if (nbString !== '3303' && nbString.length > 0 && nbString.length !== 18) {
        newErrors.nop = newErrors.nop ? newErrors.nop + ' | NOP Bersama harus 18 digit' : 'NOP Bersama harus 18 digit angka';
      }
    } else if (currentStep === 2) {
      if (!formData.nik || !/^\d{16}$/.test(formData.nik)) newErrors.nik = 'NIK wajib 16 digit angka';
      
      const namaVal = (formData.nama || '').trim();
      if (!namaVal || namaVal.length < 3 || namaVal.length > 100 || !/^[a-zA-Z\s.,']+$/.test(namaVal)) {
        newErrors.nama = 'Nama Wajib Pajak 3-100 karakter, hanya huruf, spasi, titik, koma, petik';
      }
      
      if (!formData.statusWp) newErrors.statusWp = 'Pilih Status WP';
      if (!formData.pekerjaan) newErrors.pekerjaan = 'Pilih Pekerjaan';
      
      if (formData.npwp && !/^(\d{15}|\d{16})$/.test(formData.npwp)) {
        newErrors.npwp = 'NPWP harus 15 atau 16 digit angka';
      }
      
      if (formData.noTelp && !/^(08|62)\d{8,13}$/.test(formData.noTelp)) {
        newErrors.noTelp = 'No. HP harus diawali 08/62, total 10-15 digit angka';
      }

      const alamatVal = (formData.alamat || '').trim();
      if (!alamatVal || alamatVal.length < 5 || alamatVal.length > 255 || !/^[a-zA-Z0-9\s.,\-/]+$/.test(alamatVal)) {
        newErrors.alamat = 'Alamat 5-255 karakter, hanya huruf, angka, spasi, . , - /';
      }

      if (!formData.rt || !/^\d{1,3}$/.test(formData.rt)) newErrors.rt = 'RT wajib 1-3 digit angka';
      if (!formData.rw || !/^\d{1,3}$/.test(formData.rw)) newErrors.rw = 'RW wajib 1-3 digit angka';

      const kelVal = (formData.kelurahan || '').trim();
      if (!kelVal || kelVal.length > 100 || !/^[a-zA-Z0-9\s]+$/.test(kelVal)) {
        newErrors.kelurahan = 'Kelurahan maksimal 100 karakter, hanya huruf, angka, spasi';
      }

      const kecVal = (formData.kecamatan || '').trim();
      if (!kecVal || kecVal.length > 100 || !/^[a-zA-Z0-9\s]+$/.test(kecVal)) {
        newErrors.kecamatan = 'Kecamatan maksimal 100 karakter, hanya huruf, angka, spasi';
      }
      
      const kabVal = (formData.kabupaten || '').trim();
      if (!kabVal || kabVal.length > 100 || !/^[a-zA-Z0-9\s]+$/.test(kabVal)) {
        newErrors.kabupaten = 'Kabupaten maksimal 100 karakter, hanya huruf, angka, spasi';
      }

      if (formData.isKuasa) {
        const hasKuasa = formData.lampiran.some(l => l.jenis_dokumen === 'SURAT_KUASA');
        if (!hasKuasa) {
          newErrors.suratKuasa = 'Dokumen Surat Kuasa belum diunggah';
        }
      }

      if (formData.kodePos && !/^\d{5}$/.test(formData.kodePos)) newErrors.kodePos = 'Kode Pos harus 5 digit angka';
      
    } else if (currentStep === 3) {
      const jalanOpVal = (formData.alamatObjek || '').trim();
      if (!jalanOpVal || jalanOpVal.length < 5 || jalanOpVal.length > 255 || !/^[a-zA-Z0-9\s.,\-/]+$/.test(jalanOpVal)) {
        newErrors.alamatObjek = 'Jalan OP 5-255 karakter, hanya huruf, angka, spasi, . , - /';
      }

      if (!formData.rtObjek || !/^\d{1,3}$/.test(formData.rtObjek)) newErrors.rtObjek = 'RT wajib 1-3 digit angka';
      if (!formData.rwObjek || !/^\d{1,3}$/.test(formData.rwObjek)) newErrors.rwObjek = 'RW wajib 1-3 digit angka';

      const kelOpVal = (formData.kelurahanObjek || '').trim();
      if (!kelOpVal || kelOpVal.length > 100 || !/^[a-zA-Z0-9\s]+$/.test(kelOpVal)) {
        newErrors.kelurahanObjek = 'Kelurahan / Desa maksimal 100 karakter, huruf/angka/spasi';
      }

      const kecOpVal = (formData.kecamatanObjek || '').trim();
      if (!kecOpVal || kecOpVal.length > 100 || !/^[a-zA-Z0-9\s]+$/.test(kecOpVal)) {
        newErrors.kecamatanObjek = 'Kecamatan maksimal 100 karakter, huruf/angka/spasi';
      }

      if (formData.blokKavObjek && (formData.blokKavObjek.length > 50 || !/^[a-zA-Z0-9\s.\-]+$/.test(formData.blokKavObjek))) {
        newErrors.blokKavObjek = 'Maks 50 karakter, hanya huruf, angka, spasi, strip, titik';
      }
      
      if (formData.noPersil && (formData.noPersil.length > 50 || !/^[a-zA-Z0-9\s.\-/]+$/.test(formData.noPersil))) {
        newErrors.noPersil = 'Maks 50 karakter, hanya huruf, angka, spasi, strip, titik, /';
      }

      if (!formData.luasTanah || parseFloat(formData.luasTanah) <= 0) newErrors.luasTanah = 'Luas Tanah wajib diisi dengan angka > 0';
      if (!formData.jenisTanah) newErrors.jenisTanah = 'Pilih Jenis Tanah';
      
      const jb = parseInt(formData.jumlahBangunan || '0');
      if (isNaN(jb) || jb < 0 || jb > 99) {
        newErrors.jumlahBangunan = 'Jumlah Bangunan harus 0 - 99';
      }
      if (formData.jenisTanah === 'TANAH_KOSONG' && jb !== 0) {
        newErrors.jumlahBangunan = 'Jumlah Bangunan wajib 0 untuk TANAH KOSONG';
      }


      // Geospatial validation
      if (['BARU', 'PECAH'].includes(formData.transaksi)) {
        if (!formData.latitude) newErrors.latitude = 'Wajib pin koordinat untuk transaksi Baru/Pecah';
        if (!formData.longitude) newErrors.longitude = 'Wajib pin koordinat untuk transaksi Baru/Pecah';
        
        const hasDenah = formData.lampiran.some(l => l.jenis_dokumen === 'DENAH_LOKASI');
        if (!hasDenah) {
          newErrors.denahLokasi = 'Dokumen Denah Lokasi wajib diunggah (Lihat bagian Lampiran Dokumen)';
        }
      }

      if (formData.latitude) {
        const lat = parseFloat(formData.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = 'Latitude harus -90 s/d 90';
      }
      if (formData.longitude) {
        const lng = parseFloat(formData.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = 'Longitude harus -180 s/d 180';
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

  const buildPayload = (is_draft = false) => {
    const nopObj = formData.nop;
    const nopBersamaObj = formData.nopBersama;

    const nop = `${nopObj.prov}${nopObj.kab}${nopObj.kec || '000'}${nopObj.kel || '000'}${nopObj.blok || '000'}${nopObj.nourut || '0000'}${nopObj.kode || '0'}`;
    const rawNop = nop.replace(/\D/g, '');
    
    const nopBersama = `${nopBersamaObj.prov || ''}${nopBersamaObj.kab || ''}${nopBersamaObj.kec || ''}${nopBersamaObj.kel || ''}${nopBersamaObj.blok || ''}${nopBersamaObj.nourut || ''}${nopBersamaObj.kode || ''}`;
    const rawNopBersama = nopBersama.replace(/\D/g, '');
    
    const rawNopAsalList = nopAsalList.map(n => n.replace(/\D/g, '')).filter(n => n.length >= 18);

    const jenis_layanan = formData.transaksi || 'BARU';

    const mapStatusWp = { 'PEMILIK': 'PEMILIK', 'PENYEWA': 'PENYEWA', 'PENGELOLA': 'PENGELOLA', 'PEMAKAI': 'PEMAKAI', 'SENGKETA': 'SENGKETA' };
    const mapPekerjaan = { 'PNS': 'PNS', 'ABRI': 'ABRI', 'PENSIUNAN': 'PENSIUNAN', 'BADAN': 'BADAN', 'LAINNYA': 'LAINNYA' };

    return {
      id_transaksi: id || undefined,
      jenis_layanan,
      nop_utama: rawNop.length >= 18 ? rawNop : '',
      nop_bersama: rawNopBersama.length >= 18 ? rawNopBersama : undefined,
      nop_asal: rawNopAsalList.length > 0 ? rawNopAsalList : undefined,
      no_sppt_lama: spptLama || undefined,
      is_draft,
      is_kuasa: formData.isKuasa,
      subjek_pajak: {
        nik: formData.nik || undefined,
        nama: formData.nama || undefined,
        npwp: formData.npwp || undefined,
        no_hp: formData.noTelp || undefined,
        status_wp: mapStatusWp[formData.statusWp] || undefined,
        pekerjaan: mapPekerjaan[formData.pekerjaan] || undefined,
        alamat: formData.alamat || '',
        blok_kav_no: formData.blokKav || undefined,
        rt: formData.rt || '',
        rw: formData.rw || '',
        kode_pos: formData.kodePos || undefined,
        kelurahan: formData.kelurahan || '',
        kecamatan: formData.kecamatan || undefined,
        kabupaten: formData.kabupaten || 'Purbalingga'
      },
      objek_pajak_sementara: {
        jalan_op: formData.alamatObjek || '',
        blok_kav_no_op: formData.blokKavObjek || undefined,
        rt_op: formData.rtObjek || undefined,
        rw_op: formData.rwObjek || undefined,
        kelurahan_op: formData.kelurahanObjek || formData.kelurahan || '',
        kecamatan_op: formData.kecamatanObjek || formData.kecamatan || '',
        luas_tanah: formData.luasTanah ? Number(formData.luasTanah) : undefined,
        luas_bangunan: 0,
        jumlah_bangunan: formData.jenisTanah === 'TANAH_BANGUNAN' ? (parseInt(formData.jumlahBangunan) || undefined) : undefined,
        jenis_tanah: formData.jenisTanah || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        batas_utara_nop: formData.batasUtara || undefined,
        batas_selatan_nop: formData.batasSelatan || undefined,
        batas_timur_nop: formData.batasTimur || undefined,
        batas_barat_nop: formData.batasBarat || undefined
      },
      lampiran: formData.lampiran.length > 0 ? formData.lampiran.map(l => ({
        jenis_dokumen: l.jenis_dokumen,
        url_file: l.url_file
      })) : undefined,
    };
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload(true);
      await api.post('/transaksi-spop/draft', payload);
      setToast({ show: true, message: 'Draft berhasil disimpan ke akun Anda.', type: 'success' });
      setTimeout(() => navigate('/dashboard-desa'), 2000);
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan draft';
      setToast({ show: true, message: errorMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      setToast({ show: true, message: 'Pastikan semua data sudah benar sebelum disubmit.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
      return;
    }
    
    if (formData.isKuasa) {
      const hasSuratKuasa = formData.lampiran.some(l => l.jenis_dokumen === 'SURAT_KUASA');
      if (!hasSuratKuasa) {
        setToast({ show: true, message: 'Surat Kuasa wajib diunggah karena Anda bertindak selaku kuasa.', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
        return;
      }
    }

    // Validasi NOP Asal untuk Pecah/Gabung
    if (['PECAH', 'GABUNG'].includes(formData.transaksi)) {
      if (nopAsalList.length === 0) {
        setToast({ show: true, message: 'Wajib menambahkan minimal 1 NOP Asal.', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
        return;
      }
    }

    // Validasi Geospatial Baru/Pecah
    if (['BARU', 'PECAH'].includes(formData.transaksi)) {
      const hasDenahLokasi = formData.lampiran.some(l => l.jenis_dokumen === 'DENAH_LOKASI');
      if (!hasDenahLokasi) {
        setToast({ show: true, message: `Denah Lokasi wajib diunggah untuk pendaftaran ${formData.transaksi === 'BARU' ? 'Baru' : 'Pecah'}.`, type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
        return;
      }
    }

    const payload = buildPayload(false);
    
    // Jika ada bangunan, tunda submit SPOP dan lanjutkan ke form LSPOP
    if (parseInt(formData.jumlahBangunan || '0') > 0) {
      localStorage.setItem('lspop_spop_payload', JSON.stringify(payload));
      localStorage.setItem('lspop_jenis_transaksi', formData.transaksi);
      
      const nopObj = formData.nop;
      const isNew = ['BARU', 'PECAH', 'GABUNG'].includes(formData.transaksi);
      const finalNop = isNew 
        ? 'Akan digenerate oleh Bakeuda' 
        : `${nopObj.prov}.${nopObj.kab}.${nopObj.kec || '000'}.${nopObj.kel || '000'}.${nopObj.blok || '000'}-${nopObj.nourut || '0000'}.${nopObj.kode || '0'}`;
      
      localStorage.setItem('lspop_nop', finalNop);
      localStorage.setItem('lspop_total_bangunan', formData.jumlahBangunan || '0');
      
      navigate('/formulir-lspop');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.post('/transaksi-spop', payload);
      const result = response.data;
      setSubmitResult(result);
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
    <main className="p-gutter max-w-screen-2xl mx-auto w-full">
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
                  <div className="space-y-4">
                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                      <div className="bg-surface-container-low p-4 sm:p-6 rounded-xl border border-outline-variant min-w-max">
                        <div className="space-y-4">
                          {['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(formData.transaksi) && (
                            <SegmentedNOPInput
                              value={formData.nop}
                              onChange={(val) => setFormData(prev => ({ ...prev, nop: val }))}
                              label="NOP"
                              showHeaders={true}
                            />
                          )}
                          <SegmentedNOPInput
                            value={formData.nopBersama}
                            onChange={(val) => setFormData(prev => ({ ...prev, nopBersama: val }))}
                            label="NOP BERSAMA"
                            showHeaders={!['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(formData.transaksi)}
                            optional={true}
                          />
                        </div>
                        {errors.nop && <p className="text-error text-sm font-bold mt-3 text-center">{errors.nop}</p>}
                      </div>
                    </div>

                    {['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(formData.transaksi) && (
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
                    )}
                  </div>
                </div>
              </section>

              <hr className="border-outline-variant opacity-50" />

              <section className="bg-surface-container-low p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-primary font-bold uppercase">
                    A. INFORMASI TAMBAHAN UNTUK DATA BARU
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Input NOP ASAL */}
                  {['PECAH', 'GABUNG'].includes(formData.transaksi) && (
                    <div className="flex flex-col gap-3 col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="font-label-sm text-on-surface-variant font-bold uppercase">NOP Asal {formData.transaksi === 'GABUNG' ? '(Minimal 2 NOP)' : ''}</label>
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
                              className="p-3 bg-background border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest"
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
                    <label className="font-label-sm text-on-surface-variant font-bold uppercase flex items-center gap-1">No. SPPT Lama <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none normal-case">(Opsional)</span></label>
                    <input
                      type="text"
                      value={spptLama}
                      onChange={handleSpptLamaChange}
                      placeholder="XXX.XXX.XXX"
                      className="p-3 bg-background border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest"
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
                        { label: 'Pengelola', val: 'PENGELOLA' },
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
                        { label: 'TNI/POLRI (ABRI)', val: 'ABRI' },
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
                      maxLength={100}
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
                    {formData.isKuasa && (
                      <div className={`mt-3 p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn ${errors.suratKuasa ? 'border-error bg-error/5 ring-1 ring-error' : 'border-primary/30 bg-primary/5'}`}>
                        <div className="text-sm text-on-surface-variant">
                          <span className={`font-bold block mb-1 ${errors.suratKuasa ? 'text-error' : 'text-primary'}`}>Wajib Lampirkan Surat Kuasa</span>
                          Karena Anda bertindak selaku kuasa, silakan unggah dokumen surat kuasa di sini.
                          {errors.suratKuasa && <span className="block text-error font-bold mt-1">*{errors.suratKuasa}</span>}
                        </div>
                        <div className="relative overflow-hidden inline-block w-full sm:w-auto">
                          <button
                            type="button"
                            disabled={isUploading}
                            className={`flex justify-center items-center w-full sm:w-auto gap-2 px-4 py-2 text-sm rounded-lg text-on-primary font-bold transition-colors ${errors.suratKuasa ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary/90'} ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            <span className="material-symbols-outlined text-sm">{isUploading ? 'hourglass_empty' : 'upload_file'}</span>
                            {isUploading ? 'Mengunggah...' : 'Unggah File'}
                          </button>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              handleFileUpload(e, 'SURAT_KUASA');
                              setErrors(prev => {
                                const next = {...prev};
                                delete next.suratKuasa;
                                return next;
                              });
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-sm text-primary flex items-center">NPWP <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                    <input
                      type="text"
                      maxLength={16}
                      value={formData.npwp}
                      onChange={(e) => handleTextChange('npwp', e)}
                      className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono text-lg tracking-widest bg-white transition-all shadow-sm focus:border-primary"
                      placeholder="Masukkan NPWP"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-label-sm text-primary flex items-center gap-1">No. TELP/HP. <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                    <div className="flex h-12 border border-outline-variant rounded bg-white transition-all shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                      <div className="flex items-center justify-center px-4 border-r border-outline-variant bg-surface-container-lowest font-data-mono text-lg font-bold text-on-surface-variant select-none">
                        08
                      </div>
                      <input
                        type="text"
                        maxLength={13} // Total 15 (08 + 13)
                        value={formData.noTelp.startsWith('08') ? formData.noTelp.substring(2) : formData.noTelp.startsWith('62') ? formData.noTelp.substring(2) : formData.noTelp}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length === 0) {
                            handleTextChange('noTelp', { target: { value: '' } });
                          } else {
                            handleTextChange('noTelp', { target: { value: '08' + val } });
                          }
                        }}
                        className="w-full h-full px-3 font-data-mono text-lg tracking-widest bg-transparent focus:outline-none"
                        placeholder="123456789"
                      />
                    </div>
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
                        maxLength={255}
                        value={formData.alamat}
                        onChange={(e) => handleTextChange('alamat', e)}
                        className={`w-full h-11 border ${errors.alamat ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-body-md bg-white`}
                        placeholder="Jl. Raya Utama No. 123"
                      />
                      {errors.alamat && <p className="text-error text-[12px]">{errors.alamat}</p>}
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">Blok/Kav/Nomor <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                      <input
                        type="text"
                        maxLength={50}
                        value={formData.blokKav}
                        onChange={(e) => handleTextChange('blokKav', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-body-md bg-white focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Contoh: Blok A No. 1"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">RW</label>
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
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">RT</label>
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
                        maxLength={100}
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
                        maxLength={100}
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
                        maxLength={100}
                        value={formData.kabupaten}
                        onChange={(e) => handleTextChange('kabupaten', e)}
                        className={`w-full h-11 border ${errors.kabupaten ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-body-md bg-white`}
                      />
                      {errors.kabupaten && <p className="text-error text-[12px]">{errors.kabupaten}</p>}
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">Kode Pos <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
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
                      maxLength={50}
                      value={formData.noPersil}
                      onChange={(e) => handleTextChange('noPersil', e)}
                      className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-8 space-y-2">
                    <label className="font-label-sm text-primary block">JALAN (ALAMAT OBJEK PAJAK)</label>
                    <input
                      type="text"
                      maxLength={255}
                      value={formData.alamatObjek}
                      onChange={(e) => handleTextChange('alamatObjek', e)}
                      className={`w-full h-11 border ${errors.alamatObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-body-md bg-white shadow-sm`}
                      placeholder="Contoh: Jl. Merdeka No. 45"
                    />
                    {errors.alamatObjek && <p className="text-error text-[12px]">{errors.alamatObjek}</p>}
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="font-label-sm text-on-surface-variant flex items-center gap-1">BLOK/KAV/NOMOR <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                    <input
                      type="text"
                      maxLength={50}
                      value={formData.blokKavObjek}
                      onChange={(e) => handleTextChange('blokKavObjek', e)}
                      className="w-full h-11 border border-outline-variant rounded px-4 font-body-md bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="font-label-sm text-on-surface-variant flex items-center gap-1">RW</label>
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
                    <label className="font-label-sm text-on-surface-variant flex items-center gap-1">RT</label>
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
                      maxLength={100}
                      value={formData.kelurahanObjek}
                      onChange={(e) => handleTextChange('kelurahanObjek', e)}
                      className={`w-full h-11 border ${errors.kelurahanObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-body-md bg-white shadow-sm`}
                      placeholder="Contoh: Purbalingga Lor"
                    />
                    {errors.kelurahanObjek && <p className="text-error text-[12px]">{errors.kelurahanObjek}</p>}
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="font-label-sm text-on-surface-variant block">KECAMATAN</label>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.kecamatanObjek}
                      onChange={(e) => handleTextChange('kecamatanObjek', e)}
                      className={`w-full h-11 border ${errors.kecamatanObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-body-md bg-white shadow-sm`}
                      placeholder="Contoh: Purbalingga"
                    />
                    {errors.kecamatanObjek && <p className="text-error text-[12px]">{errors.kecamatanObjek}</p>}
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
                      onWheel={(e) => e.target.blur()}
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
                      readOnly
                      className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono bg-surface-container-lowest focus:border-primary shadow-sm cursor-not-allowed text-on-surface-variant"
                      placeholder="Dilarang diisi (Diisi oleh Sistem/Petugas)"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="font-label-sm text-primary block">JENIS TANAH</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Tanah + Bangunan', val: 'TANAH_BANGUNAN' },
                        { label: 'Kavling Siap Bangun', val: 'KAVLING_SIAP_BANGUN' },
                        { label: 'Tanah Kosong', val: 'TANAH_KOSONG' },
                        { label: 'Fasilitas Umum', val: 'FASILITAS_UMUM' },
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

                    <div className="space-y-2">
                      <label className="font-label-sm text-primary block">JUMLAH BANGUNAN (UNIT)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.jenisTanah !== 'TANAH_BANGUNAN' ? '0' : formData.jumlahBangunan}
                        onChange={(e) => handleTextChange('jumlahBangunan', e)}
                        onWheel={(e) => e.target.blur()}
                        disabled={formData.jenisTanah !== 'TANAH_BANGUNAN'}
                        className={`w-full h-12 border ${errors.jumlahBangunan ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm ${formData.jenisTanah !== 'TANAH_BANGUNAN' ? 'bg-surface-container-lowest cursor-not-allowed opacity-70' : ''}`}
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
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">BATAS UTARA (NOP) <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                      <input
                        type="text"
                        value={formData.batasUtara}
                        onChange={(e) => handleTextChange('batasUtara', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">BATAS SELATAN (NOP) <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                      <input
                        type="text"
                        value={formData.batasSelatan}
                        onChange={(e) => handleTextChange('batasSelatan', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">BATAS TIMUR (NOP) <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                      <input
                        type="text"
                        value={formData.batasTimur}
                        onChange={(e) => handleTextChange('batasTimur', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-sm text-on-surface-variant flex items-center gap-1">BATAS BARAT (NOP) <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
                      <input
                        type="text"
                        value={formData.batasBarat}
                        onChange={(e) => handleTextChange('batasBarat', e)}
                        className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest"
                        placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      />
                    </div>



                    {parseInt(formData.jumlahBangunan) > 0 && (
                      <div className="md:col-span-2 mt-2 p-3 bg-secondary-container text-on-secondary-container rounded text-sm flex items-start gap-2">
                        <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                        <p>Terdapat bangunan pada objek pajak ini. Anda diwajibkan mengisi formulir <b>LSPOP</b> (Lampiran SPOP) untuk pendataan bangunan setelah SPOP disetujui.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SKET / DENAH LOKASI OBJEK PAJAK */}
                <div className={`pt-6 border-t border-outline-variant space-y-4 mt-6 ${errors.denahLokasi ? 'p-4 border-error ring-1 ring-error bg-error/5 rounded' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-1 bg-primary h-8 rounded-full"></div>
                    <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
                      SKET / DENAH LOKASI (KOORDINAT MAPS)
                    </h4>
                  </div>
                  {errors.denahLokasi && <p className="text-error font-bold text-sm">*{errors.denahLokasi}</p>}
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
                        <label className="font-label-sm text-primary flex items-center">LATITUDE <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">{['BARU', 'PECAH'].includes(formData.transaksi) ? '(Wajib)' : '(Opsional)'}</span></label>
                        <input
                          type="text"
                          value={formData.latitude}
                          onChange={(e) => handleTextChange('latitude', e)}
                          className={`w-full h-12 border ${errors.latitude ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm`}
                          placeholder="-7.3878"
                        />
                        {errors.latitude && <p className="text-error text-[12px]">{errors.latitude}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-sm text-primary flex items-center">LONGITUDE <span className="text-on-surface-variant font-normal text-[11px] ml-1 flex-none">{['BARU', 'PECAH'].includes(formData.transaksi) ? '(Wajib)' : '(Opsional)'}</span></label>
                        <input
                          type="text"
                          value={formData.longitude}
                          onChange={(e) => handleTextChange('longitude', e)}
                          className={`w-full h-12 border ${errors.longitude ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'} rounded px-4 font-data-mono bg-white shadow-sm`}
                          placeholder="109.3639"
                        />
                        {errors.longitude && <p className="text-error text-[12px]">{errors.longitude}</p>}
                      </div>
                    </div>

                    {['BARU', 'PECAH'].includes(formData.transaksi) && (
                      <div className="mt-4 p-4 border border-outline-variant bg-surface-container-lowest rounded flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div>
                          <p className="font-bold text-on-surface text-sm">Unggah Denah Lokasi</p>
                          <p className="text-xs text-on-surface-variant">Lampirkan foto/gambar sketsa denah lokasi (Wajib untuk transaksi ini).</p>
                        </div>
                        <div className="relative overflow-hidden inline-block w-full md:w-auto">
                          <button
                            type="button"
                            disabled={isUploading}
                            className={`flex items-center justify-center w-full md:w-auto gap-2 px-4 py-2 rounded bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            <span className="material-symbols-outlined text-sm">{isUploading ? 'hourglass_empty' : 'upload_file'}</span>
                            {isUploading ? 'Mengunggah...' : 'Unggah Denah Lokasi'}
                          </button>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'DENAH_LOKASI')}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    )}

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
                            <a href={doc.url_file} target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline">Lihat Pratinjau Dokumen</a>
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

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="space-y-1 w-full sm:w-auto">
                        <label className="font-label-sm text-on-surface-variant block">Jenis Dokumen</label>
                        <select 
                          value={jenisDokumenUpload}
                          onChange={(e) => setJenisDokumenUpload(e.target.value)}
                          className="h-12 border border-outline-variant rounded px-4 bg-white shadow-sm focus:border-primary focus:ring-1 focus:ring-primary font-bold text-sm w-full sm:w-auto"
                        >
                          <option value="Sertifikat/KTP/Lainnya">Dokumen Umum (KTP/Sertifikat)</option>
                          <option value="SURAT_KUASA">Surat Kuasa</option>
                          <option value="DENAH_LOKASI">Denah Lokasi</option>
                        </select>
                      </div>

                      {/* Upload Button */}
                      <div className="relative overflow-hidden w-full sm:w-auto inline-block sm:mt-6">
                        <button
                          type="button"
                          disabled={isUploading}
                          className={`flex items-center justify-center w-full gap-2 px-6 py-3 rounded border border-dashed border-primary text-primary font-bold hover:bg-primary/10 transition-colors ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <span className="material-symbols-outlined">{isUploading ? 'hourglass_empty' : 'upload_file'}</span>
                          {isUploading ? 'Mengunggah...' : '+ Tambah Dokumen'}
                        </button>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
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
                      <p className="font-label-lg text-on-surface font-bold text-lg uppercase mt-0.5">
                        {formData.kategoriTransaksi === 'baru' ? 'Perekaman Data Baru' : formData.kategoriTransaksi === 'update' ? 'Pemutakhiran Data' : 'Penghapusan Data'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-outline uppercase text-[10px] font-bold tracking-widest">NOP Objek Pajak</p>
                      <p className="font-data-mono font-bold text-on-surface text-lg mt-0.5">
                        {['BARU', 'PECAH'].includes(formData.transaksi) ? (
                          <span className="text-on-surface-variant text-sm font-body-md italic">Akan digenerate oleh Bakeuda</span>
                        ) : (
                          `33.03.${formData.nop.kec || '___'}.${formData.nop.kel || '___'}.${formData.nop.blok || '___'}-${formData.nop.nourut || '____'}.${formData.nop.kode || '_'}`
                        )}
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
              <h3 className="text-display-lg text-primary uppercase font-extrabold tracking-tight">
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
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
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

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </main >
  );
}
