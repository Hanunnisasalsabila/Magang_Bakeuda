import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/axios';

const SpopContext = createContext();

export const useSpop = () => useContext(SpopContext);

export const SpopProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [idTransaksi, setIdTransaksi] = useState(null);
  const [spopData, setSpopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completionStatus, setCompletionStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });

  const [formData, setFormData] = useState({
    kategoriTransaksi: '',
    transaksi: '',
    nop: { prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' },
    nopBersama: { prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' },
    isKuasa: false,
    nik: '', nama: '', npwp: '', noTelp: '', statusWp: '', pekerjaan: '', email: '',
    alamat: '', blokKav: '', rt: '', rw: '', kelurahan: '', kecamatan: '', kabupaten: 'Purbalingga', kodePos: '',
    alamatObjek: '', blokKavObjek: '', rtObjek: '', rwObjek: '', kelurahanObjek: '', kecamatanObjek: '',
    noPersil: '', luasTanah: '', luasBangunan: '', jumlahBangunan: '', jenisTanah: '',
    lampiran: [],
    latitude: '', longitude: '', koordinat_polygon: [],
    batasUtara: '', batasSelatan: '', batasTimur: '', batasBarat: '',
    nopAsalList: [''], spptLama: '',
    kodeWilayah: '', kodeWilayahObjek: '', catatanPengaju: '',
    pecahanList: [] // Khusus PECAH: array of objects containing subjek & objek data
  });
  
  const [errors, setErrors] = useState({});

  // Reset context automatically if user leaves the /spop path entirely
  useEffect(() => {
    if (!location.pathname.startsWith('/spop') && idTransaksi) {
      setIdTransaksi(null);
      setSpopData(null);
      setCompletionStatus({ 1: false, 2: false, 3: false, 4: false });
    }
  }, [location.pathname, idTransaksi]);

  const loadDraft = async (id, isBackground = false) => {
    if (!id) {
      setIdTransaksi(null);
      setSpopData(null);
      setCompletionStatus({ 1: false, 2: false, 3: false, 4: false });
      // Reset formData for new entry (keep defaults)
      setFormData({
        kategoriTransaksi: '',
        transaksi: '',
        nop: { prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' },
        nopBersama: { prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' },
        isKuasa: false,
        nik: '', nama: '', npwp: '', noTelp: '', statusWp: '', pekerjaan: '', email: '',
        alamat: '', blokKav: '', rt: '', rw: '', kelurahan: '', kecamatan: '', kabupaten: 'Purbalingga', kodePos: '',
        alamatObjek: '', blokKavObjek: '', rtObjek: '', rwObjek: '', kelurahanObjek: '', kecamatanObjek: '',
        noPersil: '', luasTanah: '', luasBangunan: '', jumlahBangunan: '', jenisTanah: '',
        lampiran: [],
        latitude: '', longitude: '', koordinat_polygon: [],
        batasUtara: '', batasSelatan: '', batasTimur: '', batasBarat: '',
        nopAsalList: [''], spptLama: '',
        kodeWilayah: '', kodeWilayahObjek: '', catatanPengaju: '',
        pecahanList: []
      });
      return;
    }
    
    if (!isBackground) setLoading(true);
    try {
      const res = await api.get(`/transaksi-spop/${id}`);
      const data = res.data?.data;
      if (data) {
        setIdTransaksi(id);
        setSpopData(data);
        
        // Parse NOP
        const detailTujuan = data.detail_tujuan?.[0] || {};
        const detailAsalList = data.detail_asal || [];
        const detailAsal = detailAsalList[0]?.nop_asal || '';
        const nopAsalArray = detailAsalList.map(a => a.nop_asal);
        if (nopAsalArray.length === 0) nopAsalArray.push('');
        
        const parseNop = (nopStr) => {
          if (!nopStr || nopStr.length < 18) return { prov: '33', kab: '03', kec: '', kel: '', blok: '', nourut: '', kode: '' };
          return {
            prov: nopStr.substring(0, 2),
            kab: nopStr.substring(2, 4),
            kec: nopStr.substring(4, 7),
            kel: nopStr.substring(7, 10),
            blok: nopStr.substring(10, 13),
            nourut: nopStr.substring(13, 17),
            kode: nopStr.substring(17, 18)
          };
        };

        const subjek = detailTujuan.calon_subjek_json || {};
        
        setFormData(prev => ({
          ...prev,
          kategoriTransaksi: ['BARU', 'PECAH', 'GABUNG'].includes(data.jenis_transaksi) ? 'baru' : 
                             ['MUTASI', 'PERUBAHAN_DATA'].includes(data.jenis_transaksi) ? 'update' : 'hapus',
          transaksi: data.jenis_transaksi || 'BARU',
          nop: parseNop(detailAsal || detailTujuan.nop_generated), // NOP Utama
          nopBersama: parseNop(data.nop_bersama),
          isKuasa: data.menggunakan_kuasa || false,
          nopAsalList: nopAsalArray,
          
          nik: (subjek.nik && subjek.nik !== '0000000000000000') ? subjek.nik : '',
          nama: (subjek.nama_subjek && subjek.nama_subjek !== 'TANPA NAMA') ? subjek.nama_subjek : '',
          npwp: subjek.npwp || '',
          noTelp: subjek.no_hp || '',
          statusWp: subjek.status_wp || '',
          pekerjaan: subjek.pekerjaan || '',
          email: subjek.email || '',
          alamat: (subjek.alamat_jalan && subjek.alamat_jalan !== 'TANPA ALAMAT') ? subjek.alamat_jalan : '',
          blokKav: subjek.blok_kav_no_subjek || '',
          rt: subjek.rt || '',
          rw: subjek.rw || '',
          kelurahan: subjek.kelurahan || '',
          kecamatan: subjek.kecamatan || '',
          kabupaten: subjek.kabupaten || 'Purbalingga',
          kodePos: subjek.kode_pos || '',
          
          alamatObjek: detailTujuan.jalan_op_baru || '',
          blokKavObjek: detailTujuan.blok_kav_no_baru || '',
          rtObjek: detailTujuan.rt_op_baru || '',
          rwObjek: detailTujuan.rw_op_baru || '',
          kelurahanObjek: detailTujuan.kelurahan_op_baru || '',
          kecamatanObjek: detailTujuan.kecamatan_op_baru || '',
          noPersil: detailTujuan.no_persil_baru || '',
          luasTanah: (detailTujuan.luas_tanah_baru !== null && detailTujuan.luas_tanah_baru !== undefined) ? detailTujuan.luas_tanah_baru.toString() : '',
          luasBangunan: (detailTujuan.luas_bangunan_baru !== null && detailTujuan.luas_bangunan_baru !== undefined) ? detailTujuan.luas_bangunan_baru.toString() : '',
          jumlahBangunan: detailTujuan.jumlah_bangunan_baru || '0',
          jenisTanah: detailTujuan.jenis_tanah_baru || '',
          
          latitude: detailTujuan.latitude || '',
          longitude: detailTujuan.longitude || '',
          koordinat_polygon: detailTujuan.koordinat_polygon || [],
          batasUtara: detailTujuan.batas_utara || '',
          batasSelatan: detailTujuan.batas_selatan || '',
          batasTimur: detailTujuan.batas_timur || '',
          batasBarat: detailTujuan.batas_barat || '',
          spptLama: '',
          kodeWilayah: data.kode_wilayah || '',
          kodeWilayahObjek: data.kode_wilayah || '',
          catatanPengaju: data.catatan_pengaju || '',
          
          pecahanList: data.jenis_transaksi === 'PECAH' ? data.detail_tujuan?.map((t, idx) => ({
             id: idx,
             nik: t.calon_subjek_json?.nik || '',
             nama: t.calon_subjek_json?.nama || '',
             npwp: t.calon_subjek_json?.npwp || '',
             noTelp: t.calon_subjek_json?.no_telp || '',
             statusWp: t.calon_subjek_json?.status_wp || '',
             pekerjaan: t.calon_subjek_json?.pekerjaan || '',
             email: t.calon_subjek_json?.email || '',
             alamat: t.calon_subjek_json?.alamat || '',
             blokKav: t.calon_subjek_json?.blok_kav || '',
             rt: t.calon_subjek_json?.rt || '',
             rw: t.calon_subjek_json?.rw || '',
             kelurahan: t.calon_subjek_json?.kelurahan || '',
             kecamatan: t.calon_subjek_json?.kecamatan || '',
             kabupaten: t.calon_subjek_json?.kabupaten || 'Purbalingga',
             kodePos: t.calon_subjek_json?.kode_pos || '',
             luasTanah: t.luas_tanah_baru ? t.luas_tanah_baru.toString() : '',
             luasBangunan: t.luas_bangunan_baru ? t.luas_bangunan_baru.toString() : '',
             jumlahBangunan: t.jumlah_bangunan_baru ? t.jumlah_bangunan_baru.toString() : '',
             jenisTanah: t.jenis_tanah_baru || '',
             alamatObjek: t.jalan_op_baru || '',
             blokKavObjek: t.blok_kav_op_baru || '',
             rtObjek: t.rt_op_baru || '',
             rwObjek: t.rw_op_baru || '',
             kelurahanObjek: t.kelurahan_op_baru || '',
             kecamatanObjek: t.kecamatan_op_baru || '',
             batasUtara: t.batas_utara || '',
             batasSelatan: t.batas_selatan || '',
             batasTimur: t.batas_timur || '',
             batasBarat: t.batas_barat || '',
             koordinat_polygon: t.koordinat_polygon ? (typeof t.koordinat_polygon === 'string' ? JSON.parse(t.koordinat_polygon) : t.koordinat_polygon) : [],
             latitude: t.koordinat_polygon ? (t.koordinat_polygon[0]?.lat?.toString() || '') : '',
             longitude: t.koordinat_polygon ? (t.koordinat_polygon[0]?.lng?.toString() || '') : '',
             lampiran: (data.lampiran || [])
                .filter(l => l.jenis_dokumen.endsWith(`_PECAHAN_${idx + 1}`))
                .map(l => ({ ...l, jenis_dokumen: l.jenis_dokumen.replace(`_PECAHAN_${idx + 1}`, '') }))
          })) : [],
          lampiran: (data.lampiran || []).filter(l => !l.jenis_dokumen.includes('_PECAHAN_'))
        }));

        const isStep1Complete = !!(data.jenis_transaksi);
        const isStep2Complete = !!(subjek.nama_subjek && subjek.nama_subjek !== 'TANPA NAMA' && subjek.nik && subjek.nik !== '0000000000000000' && subjek.alamat_jalan && subjek.alamat_jalan !== 'TANPA ALAMAT');
        const isStep3Complete = !!(detailTujuan.luas_tanah_baru > 0 && detailTujuan.jenis_tanah_baru);
        
        let isStep4Complete = false;
        if (isStep3Complete) {
          const numBng = detailTujuan.jumlah_bangunan_baru || 0;
          if (numBng === 0) {
            isStep4Complete = true; 
          } else if (detailTujuan.data_bangunan_json) {
            try {
              const parsed = typeof detailTujuan.data_bangunan_json === 'string' ? JSON.parse(detailTujuan.data_bangunan_json) : detailTujuan.data_bangunan_json;
              if (Array.isArray(parsed) && parsed.length >= numBng) {
                isStep4Complete = true;
              }
            } catch(e) {}
          }
        }
        
        const isStep5Complete = data.status_ajuan !== 'DRAFT';

        setCompletionStatus({
          1: isStep1Complete,
          2: isStep2Complete,
          3: isStep3Complete,
          4: isStep4Complete,
          5: isStep5Complete,
          6: false
        });
      }
    } catch (error) {
      console.error('Error saving step:', error);
      let errorMsg = error.response?.data?.message || 'Gagal menyimpan langkah ini.';
      if (Array.isArray(errorMsg)) {
        errorMsg = errorMsg.join(', ');
      } else if (typeof errorMsg === 'object') {
        errorMsg = JSON.stringify(errorMsg);
      }
      setToast({ show: true, message: errorMsg, type: 'error' });
      return false;
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const updateCompletion = (step, isComplete) => {
    setCompletionStatus(prev => ({ ...prev, [step]: isComplete }));
  };

  const buildPayload = (overrideData = {}) => {
    const mergedData = { ...formData, ...overrideData };
    const nopObj = mergedData.nop;
    const nopBersamaObj = mergedData.nopBersama;

    const nop = `${nopObj.prov}${nopObj.kab}${nopObj.kec || '000'}${nopObj.kel || '000'}${nopObj.blok || '000'}${nopObj.nourut || '0000'}${nopObj.kode || '0'}`;
    const rawNop = nop.replace(/\D/g, '');
    const nopBersama = `${nopBersamaObj?.prov || ''}${nopBersamaObj?.kab || ''}${nopBersamaObj?.kec || ''}${nopBersamaObj?.kel || ''}${nopBersamaObj?.blok || ''}${nopBersamaObj?.nourut || ''}${nopBersamaObj?.kode || ''}`;
    const rawNopBersama = nopBersama.replace(/\D/g, '').substring(0, 18);
    const rawNopAsalList = (mergedData.nopAsalList || [])
      .map(n => n.replace(/\D/g, '').substring(0, 18))
      .filter(n => n.length === 18);

    const mapStatusWp = { 'PEMILIK': 'PEMILIK', 'PENYEWA': 'PENYEWA', 'PENGELOLA': 'PENGELOLA', 'PEMAKAI': 'PEMAKAI', 'SENGKETA': 'SENGKETA' };
    const mapPekerjaan = { 'PNS': 'PNS', 'ABRI': 'ABRI', 'PENSIUNAN': 'PENSIUNAN', 'BADAN': 'BADAN', 'LAINNYA': 'LAINNYA' };

    const jenis = mergedData.transaksi;
    const isMutasi = jenis === 'MUTASI';
    const isHapus = jenis === 'HAPUS';
    const isPerubahanData = jenis === 'PERUBAHAN_DATA';

    const detail_asal = rawNopAsalList.map(n => ({ nop_asal: n, nonaktifkan_saat_disetujui: true }));
    if (['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(jenis) && rawNop.length >= 18 && detail_asal.length === 0) {
      const shouldDeactivate = ['PECAH', 'GABUNG', 'HAPUS'].includes(jenis);
      detail_asal.push({ nop_asal: rawNop, nonaktifkan_saat_disetujui: shouldDeactivate });
    }

    const calon_subjek_json = {
      nik: mergedData.nik || '0000000000000000',
      nama_subjek: mergedData.nama || 'TANPA NAMA',
      npwp: mergedData.npwp || undefined,
      no_hp: mergedData.noTelp || undefined,
      status_wp: mapStatusWp[mergedData.statusWp] || undefined,
      pekerjaan: mapPekerjaan[mergedData.pekerjaan] || undefined,
      email: mergedData.email || undefined,
      alamat_jalan: mergedData.alamat || 'TANPA ALAMAT',
      blok_kav_no_subjek: mergedData.blokKav || undefined,
      rt: mergedData.rt || '',
      rw: mergedData.rw || '',
      kode_pos: mergedData.kodePos || undefined,
      kelurahan: mergedData.kelurahan || '',
      kecamatan: mergedData.kecamatan || undefined,
      kabupaten: mergedData.kabupaten || 'Purbalingga',
      kode_wilayah: mergedData.kodeWilayah || undefined
    };

    let detail_tujuan;
    if (isHapus) {
      detail_tujuan = undefined;
    } else if (isMutasi) {
      detail_tujuan = [{
        nik_calon_subjek: formData.nik || undefined,
        calon_subjek_json,
        luas_tanah_baru: 0,
        jenis_tanah_baru: undefined
      }];
    } else {
      detail_tujuan = [{
        nik_calon_subjek: mergedData.nik || undefined,
        calon_subjek_json: isPerubahanData ? undefined : calon_subjek_json,
        luas_tanah_baru: mergedData.luasTanah ? Number(mergedData.luasTanah) : 0,
        luas_bangunan_baru: mergedData.luasBangunan ? Number(mergedData.luasBangunan) : 0,
        jumlah_bangunan_baru: mergedData.jumlahBangunan ? Number(mergedData.jumlahBangunan) : 0,
        jenis_tanah_baru: mergedData.jenisTanah || 'TANAH_BANGUNAN',
        jalan_op_baru: mergedData.alamatObjek || '',
        kode_wilayah_baru: mergedData.kodeWilayahObjek || undefined,
        blok_kav_no_baru: mergedData.blokKavObjek || undefined,
        no_persil_baru: mergedData.noPersil || undefined,
        rt_op_baru: mergedData.rtObjek || undefined,
        rw_op_baru: mergedData.rwObjek || undefined,
        kelurahan_op_baru: mergedData.kelurahanObjek || mergedData.kelurahan || '',
        kecamatan_op_baru: mergedData.kecamatanObjek || mergedData.kecamatan || '',
        latitude: mergedData.latitude ? String(mergedData.latitude) : undefined,
        longitude: mergedData.longitude ? String(mergedData.longitude) : undefined,
        koordinat_polygon: mergedData.koordinat_polygon || [],
        batas_utara: mergedData.batasUtara || undefined,
        batas_selatan: mergedData.batasSelatan || undefined,
        batas_timur: mergedData.batasTimur || undefined,
        batas_barat: mergedData.batasBarat || undefined,
        data_bangunan_json: mergedData.data_bangunan_json || undefined
      }];
      
      if (mergedData.transaksi === 'PECAH' && mergedData.pecahanList && mergedData.pecahanList.length > 0) {
        detail_tujuan = mergedData.pecahanList.map((p, index) => ({
          nik_calon_subjek: p.nik || undefined,
          calon_subjek_json: {
            nik: p.nik || '0000000000000000',
            nama_subjek: p.nama || 'TANPA NAMA',
            npwp: p.npwp || undefined,
            no_hp: p.noTelp || undefined,
            status_wp: mapStatusWp[p.statusWp] || undefined,
            pekerjaan: mapPekerjaan[p.pekerjaan] || undefined,
            email: p.email || undefined,
            alamat_jalan: p.alamat || 'TANPA ALAMAT',
            blok_kav_no_subjek: p.blokKav || undefined,
            rt: p.rt || '',
            rw: p.rw || '',
            kode_pos: p.kodePos || undefined,
            kelurahan: p.kelurahan || '',
            kecamatan: p.kecamatan || undefined,
            kabupaten: p.kabupaten || 'Purbalingga',
            kode_wilayah: p.kodeWilayah || undefined
          },
          luas_tanah_baru: p.luasTanah ? parseFloat(p.luasTanah) : 0,
          luas_bangunan_baru: p.luasBangunan ? parseFloat(p.luasBangunan) : 0,
          jumlah_bangunan_baru: p.jumlahBangunan ? parseInt(p.jumlahBangunan, 10) : 0,
          jalan_op_baru: p.alamatObjek || undefined,
          blok_kav_no_baru: p.blokKavObjek || undefined,
          no_persil_baru: p.noPersil || undefined,
          rt_op_baru: p.rtObjek || undefined,
          rw_op_baru: p.rwObjek || undefined,
          kelurahan_op_baru: p.kelurahanObjek || mergedData.kelurahanObjek || '',
          kecamatan_op_baru: p.kecamatanObjek || mergedData.kecamatanObjek || '',
          kode_wilayah_baru: p.kodeWilayahObjek || mergedData.kodeWilayahObjek || undefined,
          jenis_tanah_baru: p.jenisTanah || 'TANAH_BANGUNAN',
          latitude: p.latitude ? String(p.latitude) : undefined,
          longitude: p.longitude ? String(p.longitude) : undefined,
          koordinat_polygon: p.koordinat_polygon || [],
          batas_utara: p.batasUtara || undefined,
          batas_selatan: p.batasSelatan || undefined,
          batas_timur: p.batasTimur || undefined,
          batas_barat: p.batasBarat || undefined,
          data_bangunan_json: (mergedData.data_bangunan_json || []).filter(b => b._pecahanIndex === index).length > 0
            ? (mergedData.data_bangunan_json || []).filter(b => b._pecahanIndex === index)
            : undefined,
        }));
      }
    }

    const payload = {
      jenis_transaksi: formData.transaksi || 'BARU',
      tahun_pajak: new Date().getFullYear(),
      tanggal_pengajuan: new Date().toISOString(),
      catatan_pengaju: mergedData.catatanPengaju || undefined,
      menggunakan_kuasa: mergedData.isKuasa,
      nop_bersama: rawNopBersama.length >= 18 ? rawNopBersama : undefined,
      detail_asal: detail_asal.length > 0 ? detail_asal : undefined,
      detail_tujuan: detail_tujuan,
    };

    let finalLampiran = [...(mergedData.lampiran || [])];
    if (mergedData.transaksi === 'PECAH' && mergedData.pecahanList) {
      mergedData.pecahanList.forEach((p, idx) => {
        if (p.lampiran && p.lampiran.length > 0) {
          p.lampiran.forEach(l => {
            finalLampiran.push({
              jenis_dokumen: `${l.jenis_dokumen}_PECAHAN_${idx + 1}`,
              url_file: l.url_file
            });
          });
        }
      });
    }

    if (finalLampiran.length > 0) {
      payload.lampiran = finalLampiran.map(l => ({
        jenis_dokumen: l.jenis_dokumen,
        url_file: l.url_file
      }));
    }

    return payload;
  };

  const saveDraft = async (overrideData = {}) => {
    const payload = buildPayload(overrideData);
    if (idTransaksi) {
      await api.post(`/transaksi-spop/draft/${idTransaksi}`, payload);
      await loadDraft(idTransaksi, true); // background load to avoid unmounting
      return idTransaksi;
    } else {
      const res = await api.post('/transaksi-spop', payload);
      const newId = res.data?.data?.id_transaksi || res.data?.id_transaksi;
      if (newId) {
        if (!location.pathname.includes(newId)) {
          const basePath = location.pathname.split('/').filter(Boolean);
          // if it ends with an empty id, or no id, replace it
          navigate(`/${basePath.join('/')}/${newId}`, { replace: true });
        }
        await loadDraft(newId, true); // background load
        return newId;
      }
    }
  };

  return (
    <SpopContext.Provider value={{
      idTransaksi,
      setIdTransaksi,
      spopData,
      setSpopData,
      formData,
      setFormData,
      errors,
      setErrors,
      loading,
      loadDraft,
      completionStatus,
      updateCompletion,
      saveDraft
    }}>
      {children}
    </SpopContext.Provider>
  );
};
