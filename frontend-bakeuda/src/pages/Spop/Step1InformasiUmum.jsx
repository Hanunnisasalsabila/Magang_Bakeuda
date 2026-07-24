import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { useSpop } from '../../context/SpopContext';
import SegmentedNOPInput from '../../components/SegmentedNOPInput';
import ToastNotification from '../../components/ToastNotification';
import WilayahDropdown from '../../components/WilayahDropdown';
import api from '../../utils/axios';

export default function Step1InformasiUmum() {
  const { formData, setFormData, errors, setErrors, saveDraft, idTransaksi } = useSpop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [nopData, setNopData] = useState(null);
  const [nopLoading, setNopLoading] = useState(false);
  const [nopError, setNopError] = useState('');
  const [nopAsalErrors, setNopAsalErrors] = useState({});
  const navigate = useNavigate();

  // Build full NOP string from segmented input
  const buildNopString = (nopObj) => {
    const raw = `${nopObj.prov || ''}${nopObj.kab || ''}${nopObj.kec || ''}${nopObj.kel || ''}${nopObj.blok || ''}${nopObj.nourut || ''}${nopObj.kode || ''}`;
    return raw.replace(/\D/g, '');
  };

  // Look up NOP from backend
  const handleCariNOP = async () => {
    const rawNop = buildNopString(formData.nop);
    if (rawNop.length < 18) {
      setNopError('NOP harus 18 digit. Pastikan semua kolom terisi.');
      return;
    }
    setNopLoading(true);
    setNopError('');
    setNopData(null);
    try {
      const res = await api.get(`/objek-pajak/${rawNop}`);
      const obj = res.data?.data;
      if (obj) {
        setNopData(obj);
        // Pre-fill form data for PERUBAHAN_DATA so Step 3 is populated
        if (formData.transaksi === 'PERUBAHAN_DATA' || formData.transaksi === 'MUTASI') {
          setFormData(prev => ({
            ...prev,
            // Objek Pajak
            luasTanah: (obj.luas_tanah !== undefined && obj.luas_tanah !== null) ? obj.luas_tanah.toString() : (obj.luas_bumi ? obj.luas_bumi.toString() : prev.luasTanah),
            jumlahBangunan: (obj.jumlah_bangunan !== undefined && obj.jumlah_bangunan !== null) ? obj.jumlah_bangunan.toString() : prev.jumlahBangunan,
            luasBangunan: (obj.luas_bangunan !== undefined && obj.luas_bangunan !== null) ? obj.luas_bangunan.toString() : prev.luasBangunan,
            alamatObjek: obj.jalan_op || prev.alamatObjek,
            kelurahanObjek: obj.wilayah?.nama_kelurahan || prev.kelurahanObjek,
            kecamatanObjek: obj.wilayah?.nama_kecamatan || prev.kecamatanObjek,
            rtObjek: obj.rt_op || prev.rtObjek,
            rwObjek: obj.rw_op || prev.rwObjek,
            batasUtara: obj.batas_utara || prev.batasUtara,
            batasSelatan: obj.batas_selatan || prev.batasSelatan,
            batasTimur: obj.batas_timur || prev.batasTimur,
            batasBarat: obj.batas_barat || prev.batasBarat,
            jenisTanah: obj.jenis_tanah || prev.jenisTanah,
            noPersil: obj.no_persil || prev.noPersil,
            kodeWilayahObjek: obj.kode_wilayah || prev.kodeWilayahObjek,
            koordinat_polygon: (Array.isArray(obj.koordinat_polygon) && obj.koordinat_polygon.length > 0) ? obj.koordinat_polygon : prev.koordinat_polygon,
            latitude: (Array.isArray(obj.koordinat_polygon) && obj.koordinat_polygon.length > 0) ? obj.koordinat_polygon[0].lat : prev.latitude,
            longitude: (Array.isArray(obj.koordinat_polygon) && obj.koordinat_polygon.length > 0) ? obj.koordinat_polygon[0].lng : prev.longitude,
            blokKavObjek: obj.blok_kav_no || prev.blokKavObjek,
            data_bangunan_json: (obj.bangunan && obj.bangunan.length > 0) ? obj.bangunan : prev.data_bangunan_json,
            // Subjek Pajak
            nik: obj.subjek_pajak?.nik || prev.nik,
            nama: obj.subjek_pajak?.nama_subjek || prev.nama,
            npwp: obj.subjek_pajak?.npwp || prev.npwp,
            noTelp: obj.subjek_pajak?.no_hp || prev.noTelp,
            email: obj.subjek_pajak?.email || prev.email,
            statusWp: obj.subjek_pajak?.status_wp || prev.statusWp,
            pekerjaan: obj.subjek_pajak?.pekerjaan || prev.pekerjaan,
            alamat: obj.subjek_pajak?.alamat_jalan || prev.alamat,
            blokKav: obj.subjek_pajak?.blok_kav_no_subjek || prev.blokKav,
            rt: obj.subjek_pajak?.rt ? obj.subjek_pajak.rt.padStart(3, '0') : prev.rt,
            rw: obj.subjek_pajak?.rw ? obj.subjek_pajak.rw.padStart(3, '0') : prev.rw,
            kelurahan: obj.subjek_pajak?.wilayah?.nama_kelurahan || prev.kelurahan,
            kecamatan: obj.subjek_pajak?.wilayah?.nama_kecamatan || prev.kecamatan,
            kodePos: obj.subjek_pajak?.kode_pos || prev.kodePos
          }));
        }
      } else {
        setNopError('Data objek pajak tidak ditemukan untuk NOP ini.');
      }
    } catch (e) {
      setNopError('Data objek pajak tidak ditemukan untuk NOP ini.');
    } finally {
      setNopLoading(false);
    }
  };

  const verifyNopAsal = async (nop, idx) => {
    const raw = (nop || '').replace(/\D/g, '');
    if (!raw || raw === '3303') {
      setNopAsalErrors(prev => ({ ...prev, [idx]: 'NOP Asal harus diisi' }));
      return;
    }
    if (raw.length < 18) {
      setNopAsalErrors(prev => ({ ...prev, [idx]: 'NOP Asal harus 18 digit' }));
      return;
    }
    try {
      const res = await api.get(`/objek-pajak/${raw}`);
      const data = res.data?.data || res.data;
      if (data && data.status_aktif === false) {
        setNopAsalErrors(prev => ({ ...prev, [idx]: 'NOP Asal sudah tidak aktif (nonaktif)' }));
      } else {
        setNopAsalErrors(prev => ({ ...prev, [idx]: null }));
      }
    } catch (e) {
      setNopAsalErrors(prev => ({ ...prev, [idx]: 'NOP Asal tidak terdaftar di database' }));
    }
  };

  const formatNopString = (val) => {
    let digits = (val || '').replace(/\D/g, '');
    if (!digits) return '33.03.';
    if (!digits.startsWith('3303')) {
      digits = '3303' + digits.replace(/^3303?|^33?|^3?/, '');
    }
    digits = digits.slice(0, 18);
    let formatted = '';
    if (digits.length > 0) formatted += digits.substring(0, 2);
    if (digits.length > 2) formatted += '.' + digits.substring(2, 4);
    if (digits.length > 4) formatted += '.' + digits.substring(4, 7);
    if (digits.length > 7) formatted += '.' + digits.substring(7, 10);
    if (digits.length > 10) formatted += '.' + digits.substring(10, 13);
    if (digits.length > 13) formatted += '.' + digits.substring(13, 17);
    if (digits.length > 17) formatted += '.' + digits.substring(17, 18);
    return formatted;
  };

  const formatSpptString = (val) => {
    let digits = (val || '').replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < digits.length; i += 3) {
      if (i > 0) formatted += '.';
      formatted += digits.substring(i, i + 3);
    }
    return formatted.slice(0, 23); // limit just in case
  };

  const handleTextChange = (field, e) => {
    const val = e.target.value;
    setFormData(prev => {
      const updates = { [field]: val };
      if (field === 'transaksi') {
        let currentList = prev.nopAsalList || [''];
        if (val === 'GABUNG') {
          if (currentList.length < 2) {
            updates.nopAsalList = [...currentList, ''];
          }
        } else if (val === 'PECAH') {
          updates.nopAsalList = [currentList[0] || ''];
        }
      }
      return { ...prev, ...updates };
    });
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      await saveDraft();
      navigate('/draft-spop');
    } catch (err) {
      console.error("Failed to save draft:", err);
      setToast({ show: true, message: 'Gagal menyimpan draft SPOP', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    // Validasi Frontend
    if (!formData.transaksi) {
      setErrors({ transaksi: 'Anda wajib memilih detail kondisi pendaftaran/pemutakhiran' });
      setToast({ show: true, message: 'Mohon pilih detail kondisi pendaftaran/pemutakhiran terlebih dahulu.', type: 'error' });
      return;
    }

    if (formData.transaksi === 'HAPUS' && !formData.catatanPengaju?.trim()) {
      setErrors({ catatanPengaju: 'Alasan penghapusan wajib diisi' });
      setToast({ show: true, message: 'Mohon isi alasan penghapusan.', type: 'error' });
      return;
    }

    if (['PECAH', 'GABUNG'].includes(formData.transaksi)) {
      const validNops = (formData.nopAsalList || []).filter(nop => nop && nop.replace(/\D/g, '').length === 18);
      if (formData.transaksi === 'PECAH' && validNops.length < 1) {
        setErrors({ nopAsal: 'NOP Asal wajib diisi dengan lengkap (18 digit)' });
        setToast({ show: true, message: 'Mohon isi NOP Asal dengan lengkap.', type: 'error' });
        return;
      }
      if (formData.transaksi === 'GABUNG' && validNops.length < 2) {
        setErrors({ nopAsal: 'Minimal 2 NOP Asal wajib diisi dengan lengkap untuk penggabungan' });
        setToast({ show: true, message: 'Minimal 2 NOP Asal wajib diisi untuk penggabungan.', type: 'error' });
        return;
      }
      
      const hasNopError = Object.values(nopAsalErrors).some(err => err !== null);
      if (hasNopError) {
        setErrors({ nopAsal: 'Terdapat NOP Asal yang tidak valid atau tidak aktif' });
        setToast({ show: true, message: 'Periksa kembali NOP Asal yang Anda masukkan.', type: 'error' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const newId = await saveDraft();
      setToast({ show: true, message: 'Langkah 1 berhasil disimpan.', type: 'success' });
      const savedId = idTransaksi || newId;
      if (savedId) {
        if (formData.transaksi === 'HAPUS') {
          navigate(`/spop/konfirmasi/${savedId}`);
        } else if (formData.transaksi === 'PERUBAHAN_DATA') {
          navigate(`/spop/objek-pajak/${savedId}`);
        } else {
          navigate(`/spop/subjek-pajak/${savedId}`);
        }
      }
    } catch (error) {
      console.error('Error saving step:', error);
      let errorMsg = 'Gagal menyimpan langkah ini.';
      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        errorMsg = Array.isArray(msg) ? msg.join(', ') : typeof msg === 'object' ? JSON.stringify(msg) : msg;
      }
      setToast({ show: true, message: errorMsg, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {toast.show && (
        <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'success' })} />
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 bg-primary h-8 rounded-full"></div>
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
            JENIS TRANSAKSI &amp; NOP
          </h4>
        </div>

        <div className="space-y-8">
          {/* Jenis Transaksi */}
          <div className="space-y-4">
            <label className="font-label-sm text-primary block">Pilih Jenis Transaksi</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { val: 'baru', title: 'Perekaman Baru', desc: 'Mendaftarkan objek pajak yang belum terdata', icon: 'add_box' },
                { val: 'update', title: 'Pemutakhiran Data', desc: 'Memperbarui data objek pajak lama', icon: 'update' },
                { val: 'hapus', title: 'Penghapusan Data', desc: 'Menghapus data objek dari sistem', icon: 'delete' }
              ].map((t) => (
                <label
                  key={t.val}
                  className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.kategoriTransaksi === t.val
                    ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary'
                    : 'border-outline-variant hover:border-primary/30 hover:bg-surface-container-low hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.kategoriTransaksi === t.val ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined">{t.icon}</span>
                    </div>
                    <input
                      type="radio"
                      name="kategoriTransaksi"
                      value={t.val}
                      checked={formData.kategoriTransaksi === t.val}
                      onChange={(e) => {
                        handleTextChange('kategoriTransaksi', e);

                        // Clear prefilled data to prevent lingering data when switching categories
                        setFormData(prev => ({
                          ...prev,
                          luasTanah: '', jumlahBangunan: '', alamatObjek: '',
                          blokKavObjek: '', noPersil: '', rtObjek: '', rwObjek: '',
                          jenisTanah: '', latitude: '', longitude: '', koordinat_polygon: [],
                          batasUtara: '', batasSelatan: '', batasTimur: '', batasBarat: '',
                          data_bangunan_json: [],
                          nik: '', nama: '', npwp: '', noTelp: '', statusWp: '', pekerjaan: '',
                          email: '', alamat: '', blokKav: '', rt: '', rw: '', kelurahan: '',
                          kecamatan: '', kabupaten: '', kodePos: ''
                        }));

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
              <div className="mt-4 p-4 border rounded-xl bg-surface-container border-primary/20">
                <label className="font-bold text-sm block mb-3 text-on-surface">Kondisi Pendaftaran (Pilih salah satu):</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {[
                    { val: 'BARU', label: 'Murni (Belum Pernah Terdaftar)' },
                    { val: 'PECAH', label: 'Hasil Pemecahan (Split)' },
                    { val: 'GABUNG', label: 'Hasil Penggabungan' }
                  ].map(opt => (
                    <label key={opt.val} className="flex items-center gap-2 cursor-pointer p-2 border border-outline-variant bg-white rounded-lg hover:bg-surface-container-low">
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
              <div className="mt-4 p-4 border rounded-xl bg-surface-container border-primary/20">
                <label className="font-bold text-sm block mb-3 text-on-surface">Jenis Pemutakhiran (Pilih salah satu):</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {[
                    { val: 'MUTASI', label: 'Balik Nama / Jual Beli (Mutasi)' },
                    { val: 'PERUBAHAN_DATA', label: 'Ralat Luas / Alamat (Perubahan Data)' }
                  ].map(opt => (
                    <label key={opt.val} className="flex items-center gap-2 cursor-pointer p-2 border border-outline-variant bg-white rounded-lg hover:bg-surface-container-low">
                      <input
                        type="radio" name="transaksi" value={opt.val}
                        checked={formData.transaksi === opt.val}
                        onChange={(e) => { handleTextChange('transaksi', e); setNopData(null); setNopError(''); }}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* NOP Section - hanya tampil jika kategori memerlukan NOP */}
          {(formData.kategoriTransaksi === 'update' || formData.kategoriTransaksi === 'hapus') && (
            <div className="space-y-4">
              <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="bg-surface-container-low p-4 sm:p-6 rounded-xl border border-outline-variant min-w-max">
                  <div className="space-y-4">
                    {['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(formData.transaksi) && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <WilayahDropdown
                            selectedKecamatan={formData.kecamatanObjek}
                            selectedKelurahan={formData.kelurahanObjek}
                            autoLockByRole={true}
                            onSelect={(namaKec, namaKel, kodeKec, kodeKel) => {
                              setFormData(prev => ({
                                ...prev,
                                kecamatanObjek: namaKec,
                                kelurahanObjek: namaKel,
                                kodeWilayahObjek: kodeKel || kodeKec || prev.kodeWilayahObjek,
                                nop: {
                                  ...prev.nop,
                                  kec: kodeKec ? kodeKec.substring(4, 7) : '',
                                  kel: kodeKel ? kodeKel.substring(7, 10) : ''
                                }
                              }));
                              setNopData(null);
                              setNopError('');
                            }}
                          />
                        </div>
                        <SegmentedNOPInput
                          value={formData.nop}
                          onChange={(val) => { setFormData(prev => ({ ...prev, nop: val })); setNopData(null); setNopError(''); }}
                          label="NOP"
                          showHeaders={true}
                          readOnlyKecKel={true}
                        />
                      </>
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

              {/* Tombol Cari Data NOP */}
              {['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(formData.transaksi) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCariNOP}
                      disabled={nopLoading}
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {nopLoading
                        ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /><span>Mencari...</span></>
                        : <><span className="material-symbols-outlined text-[18px]">search</span><span>Cari Data Objek Pajak</span></>
                      }
                    </button>
                    {nopError && <p className="text-error text-sm font-medium">{nopError}</p>}
                  </div>

                  {/* Hasil Pencarian NOP */}
                  {nopData && (
                    <div className="border border-green-200 bg-green-50 rounded-xl p-5 space-y-3">
                      <div className="flex items-center gap-2 text-green-800 font-bold">
                        <span className="material-symbols-outlined text-[20px] text-green-600">check_circle</span>
                        Data Objek Pajak Ditemukan
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-on-surface-variant text-xs">NOP</p>
                          <p className="font-bold text-on-surface font-mono">{nopData.nop}</p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs">Subjek Pajak (NIK)</p>
                          <p className="font-bold text-on-surface">{nopData.nik_subjek || '-'}</p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs">Alamat Objek Pajak</p>
                          <p className="font-bold text-on-surface">{nopData.jalan_op || '-'}</p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs">Luas Tanah / Bangunan</p>
                          <p className="font-bold text-on-surface">{nopData.luas_tanah} m² / {nopData.luas_bangunan || 0} m²</p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs">Status</p>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${nopData.status_aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>{nopData.status_aktif ? 'Aktif' : 'Nonaktif'}</span>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs">Jenis Tanah</p>
                          <p className="font-bold text-on-surface">{nopData.jenis_tanah || '-'}</p>
                        </div>
                      </div>

                      {/* Aksi berdasarkan jenis transaksi */}
                      {formData.kategoriTransaksi === 'update' && (
                        <div className="border-t border-green-200 pt-3 flex flex-wrap gap-2">
                          <p className="w-full text-xs text-green-700 font-bold mb-1">Lanjutkan ke formulir:</p>
                          <button
                            type="button"
                            onClick={async () => { await handleSave(); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            Isi Formulir Pemutakhiran
                          </button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* NOP Section untuk BARU/PECAH/GABUNG (NOP Bersama) */}
          {formData.kategoriTransaksi === 'baru' && (
            <div className="space-y-4">
              <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="bg-surface-container-low p-4 sm:p-6 rounded-xl border border-outline-variant min-w-max">
                  <div className="space-y-4">
                    <SegmentedNOPInput
                      value={formData.nopBersama}
                      onChange={(val) => setFormData(prev => ({ ...prev, nopBersama: val }))}
                      label="NOP BERSAMA"
                      showHeaders={true}
                      optional={true}
                    />
                  </div>
                  {errors.nop && <p className="text-error text-sm font-bold mt-3 text-center">{errors.nop}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="border-outline-variant" />

      {formData.transaksi !== 'HAPUS' && (
        <section className="bg-surface-container-low p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <h4 className="text-on-surface font-bold uppercase">
              {['BARU', 'PECAH', 'GABUNG'].includes(formData.transaksi) ? 'INFORMASI TAMBAHAN UNTUK DATA BARU' : 'INFORMASI TAMBAHAN'}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Input NOP ASAL */}
            {['PECAH', 'GABUNG'].includes(formData.transaksi) && (
              <div className="flex flex-col gap-3 col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-on-surface-variant font-bold uppercase">NOP Asal {formData.transaksi === 'GABUNG' ? '(Minimal 2 NOP)' : ''}</label>
                  {formData.transaksi === 'GABUNG' && (
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, nopAsalList: [...(prev.nopAsalList || ['']), ''] }))} className="text-xs bg-blue-100 text-primary px-3 py-1 rounded-full font-bold hover:bg-blue-200">
                      + Tambah NOP Asal
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(formData.nopAsalList || ['']).map((nop, idx) => (
                    <div key={idx} className="flex flex-col gap-1 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <IMaskInput
                          mask="00.00.000.000.000.0000.0"
                          value={nop || '33.03.'}
                          unmask={false}
                          onAccept={(value) => {
                            const newNopAsal = [...(formData.nopAsalList || [''])];
                            newNopAsal[idx] = value;
                            setFormData(prev => ({ ...prev, nopAsalList: newNopAsal }));
                            if ((value.replace(/\D/g, '').length) === 18) {
                              verifyNopAsal(value, idx);
                            } else {
                              setNopAsalErrors(prev => ({ ...prev, [idx]: null }));
                            }
                          }}
                          onBlur={(e) => verifyNopAsal(e.target.value, idx)}
                          placeholder="33.03.XXX.XXX.XXX.XXXX.X"
                          className={`p-3 bg-white border ${nopAsalErrors[idx] ? 'border-error focus:ring-error' : 'border-outline-variant focus:ring-primary'} text-on-surface rounded-md focus:outline-none focus:ring-1 w-full tracking-widest`}
                        />
                        {formData.transaksi === 'GABUNG' && (formData.nopAsalList || ['']).length > 2 && (
                          <button type="button" onClick={() => {
                            const newNopAsal = (formData.nopAsalList || ['']).filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, nopAsalList: newNopAsal }));
                            setNopAsalErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[idx];
                              return newErrors;
                            });
                          }} className="text-error bg-red-100 p-3 rounded-md hover:bg-red-200">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                      </div>
                      {nopAsalErrors[idx] && <p className="text-error text-xs font-medium">{nopAsalErrors[idx]}</p>}
                    </div>
                  ))}
                </div>
                {errors.nopAsal && <p className="text-error text-sm mt-1">{errors.nopAsal}</p>}
              </div>
            )}

            {/* Input NO SPPT LAMA */}
            {formData.transaksi !== 'HAPUS' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant font-bold uppercase flex items-center gap-1">No. SPPT Lama <span className="font-normal text-[11px] ml-1 flex-none normal-case">(Opsional)</span></label>
                <IMaskInput
                  mask="000.000.000.000.000.000"
                  value={formData.spptLama}
                  unmask={false}
                  onAccept={(value) => setFormData(prev => ({ ...prev, spptLama: value }))}
                  placeholder="XXX.XXX.XXX"
                  className="p-3 bg-white border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {formData.transaksi === 'HAPUS' && (
        <section className="bg-surface-container-low p-6 rounded-lg mt-6">
          <div className="flex items-center gap-3 mb-6">
            <h4 className="text-on-surface font-bold uppercase">ALASAN PENGHAPUSAN</h4>
          </div>
          <div className="flex flex-col gap-2">
            <textarea
              value={formData.catatanPengaju || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, catatanPengaju: e.target.value }))}
              placeholder="Tuliskan alasan lengkap mengapa NOP ini diajukan untuk dihapus..."
              className="p-3 bg-white border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full min-h-[100px]"
              required
            />
            {errors.catatanPengaju && <p className="text-error text-sm mt-1">{errors.catatanPengaju}</p>}
          </div>
        </section>
      )}

      <div className="flex justify-end pt-8 border-t border-outline-variant gap-3">
        <button type="button" onClick={handleSaveDraft} disabled={isSubmitting} className="px-6 py-2.5 bg-white text-on-surface rounded-full font-bold hover:bg-surface-container-low border-2 border-outline-variant transition-all flex items-center gap-2">
          Simpan Draft
        </button>
        <button type="button" onClick={() => navigate('/dashboard-desa')} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
          Kembali
        </button>
        <button type="button" onClick={handleSave} disabled={isSubmitting} className={`px-6 py-2.5 ${formData.transaksi === 'HAPUS' ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary/90'} text-white rounded-full font-bold shadow-md transition-all flex items-center gap-2`}>
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">
              {formData.transaksi === 'HAPUS' ? 'delete_forever' : 'save'}
            </span>
          )}
          {formData.transaksi === 'HAPUS' ? 'Lanjut Konfirmasi Penghapusan' : 'Simpan Data'}
        </button>
      </div>
    </div>
  );
}
