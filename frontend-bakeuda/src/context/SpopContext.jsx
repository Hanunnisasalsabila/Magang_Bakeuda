import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const SpopContext = createContext();

export const useSpop = () => useContext(SpopContext);

export const SpopProvider = ({ children }) => {
  const [idTransaksi, setIdTransaksi] = useState(null);
  const [spopData, setSpopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completionStatus, setCompletionStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false
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
    noPersil: '', luasTanah: '', luasBangunan: '', jumlahBangunan: '0', jenisTanah: 'TANAH_BANGUNAN',
    lampiran: [],
    latitude: '', longitude: '', koordinat_polygon: [],
    batasUtara: '', batasSelatan: '', batasTimur: '', batasBarat: '',
    nopAsalList: [''], spptLama: ''
  });
  
  const [errors, setErrors] = useState({});

  const loadDraft = async (id) => {
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
        noPersil: '', luasTanah: '', luasBangunan: '', jumlahBangunan: '0', jenisTanah: 'TANAH_BANGUNAN',
        lampiran: [],
        latitude: '', longitude: '', koordinat_polygon: [],
        batasUtara: '', batasSelatan: '', batasTimur: '', batasBarat: '',
        nopAsalList: [''], spptLama: ''
      });
      return;
    }
    
    setLoading(true);
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
          
          nik: subjek.nik || '',
          nama: subjek.nama || '',
          npwp: subjek.npwp || '',
          noTelp: subjek.no_hp || '',
          statusWp: subjek.status_wp || '',
          pekerjaan: subjek.pekerjaan || '',
          email: subjek.email || '',
          alamat: subjek.alamat || '',
          blokKav: subjek.blok_kav_no || '',
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
          luasTanah: detailTujuan.luas_tanah_baru || '',
          luasBangunan: detailTujuan.luas_bangunan_baru || '',
          jumlahBangunan: detailTujuan.jumlah_bangunan_baru || '0',
          jenisTanah: detailTujuan.jenis_tanah_baru || 'TANAH_BANGUNAN',
          
          latitude: detailTujuan.latitude || '',
          longitude: detailTujuan.longitude || '',
          koordinat_polygon: detailTujuan.koordinat_polygon || [],
          batasUtara: detailTujuan.batas_utara || '',
          batasSelatan: detailTujuan.batas_selatan || '',
          batasTimur: detailTujuan.batas_timur || '',
          batasBarat: detailTujuan.batas_barat || '',
          
          lampiran: data.lampiran || []
        }));

        // Basic check for completion
        const isStep1Complete = !!(data.jenis_transaksi);
        const isStep2Complete = !!(subjek.nama && subjek.nik && subjek.alamat);
        const isStep3Complete = !!(detailTujuan.luas_tanah_baru > 0 && detailTujuan.jenis_tanah_baru);
        const isStep4Complete = data.status_ajuan !== 'DRAFT';

        setCompletionStatus({
          1: isStep1Complete,
          2: isStep2Complete,
          3: isStep3Complete,
          4: isStep4Complete
        });
      }
    } catch (error) {
      console.error("Gagal memuat draf:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompletion = (step, isComplete) => {
    setCompletionStatus(prev => ({ ...prev, [step]: isComplete }));
  };

  const buildPayload = () => {
    const nopObj = formData.nop;
    const nopBersamaObj = formData.nopBersama;

    const nop = `${nopObj.prov}${nopObj.kab}${nopObj.kec || '000'}${nopObj.kel || '000'}${nopObj.blok || '000'}${nopObj.nourut || '0000'}${nopObj.kode || '0'}`;
    const rawNop = nop.replace(/\D/g, '');
    
    const nopBersama = `${nopBersamaObj.prov || ''}${nopBersamaObj.kab || ''}${nopBersamaObj.kec || ''}${nopBersamaObj.kel || ''}${nopBersamaObj.blok || ''}${nopBersamaObj.nourut || ''}${nopBersamaObj.kode || ''}`;
    const rawNopBersama = nopBersama.replace(/\D/g, '');
    const rawNopAsalList = formData.nopAsalList.map(n => n.replace(/\D/g, '')).filter(n => n.length >= 18);

    const mapStatusWp = { 'PEMILIK': 'PEMILIK', 'PENYEWA': 'PENYEWA', 'PENGELOLA': 'PENGELOLA', 'PEMAKAI': 'PEMAKAI', 'SENGKETA': 'SENGKETA' };
    const mapPekerjaan = { 'PNS': 'PNS', 'ABRI': 'ABRI', 'PENSIUNAN': 'PENSIUNAN', 'BADAN': 'BADAN', 'LAINNYA': 'LAINNYA' };

    return {
      id_transaksi: idTransaksi || undefined,
      jenis_layanan: formData.transaksi || 'BARU',
      nop_utama: rawNop.length >= 18 ? rawNop : '',
      nop_asal: rawNopAsalList,
      nop_bersama: rawNopBersama.length >= 18 ? rawNopBersama : undefined,
      is_draft: true,
      is_kuasa: formData.isKuasa,
      subjek_pajak: {
        nik: formData.nik || undefined,
        nama: formData.nama || undefined,
        npwp: formData.npwp || undefined,
        no_hp: formData.noTelp || undefined,
        status_wp: mapStatusWp[formData.statusWp] || undefined,
        pekerjaan: mapPekerjaan[formData.pekerjaan] || undefined,
        email: formData.email || undefined,
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
        luas_bangunan: formData.luasBangunan ? Number(formData.luasBangunan) : 0,
        jumlah_bangunan: formData.jenisTanah === 'TANAH_BANGUNAN' ? (parseInt(formData.jumlahBangunan) || undefined) : undefined,
        jenis_tanah: formData.jenisTanah || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        koordinat_polygon: formData.koordinat_polygon?.length > 0 ? formData.koordinat_polygon : undefined,
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

  const saveDraft = async () => {
    const payload = buildPayload();
    if (idTransaksi) {
      await api.put(`/transaksi-spop/${idTransaksi}`, payload);
      await loadDraft(idTransaksi);
      return idTransaksi;
    } else {
      const res = await api.post('/transaksi-spop/draft', payload);
      const newId = res.data?.data?.id_transaksi || res.data?.id_transaksi;
      if (newId) {
        await loadDraft(newId);
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
