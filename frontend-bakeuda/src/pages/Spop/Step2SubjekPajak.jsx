import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';
import ToastNotification from '../../components/ToastNotification';
import WilayahDropdown from '../../components/WilayahDropdown';
import api from '../../utils/axios';

export default function Step2SubjekPajak() {
  const { formData, setFormData, errors, setErrors, saveDraft, idTransaksi } = useSpop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const handleTextChange = (field, e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileUpload = async (e, jenis_dokumen) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setToast({ show: true, message: 'Ukuran file maksimal 2MB', type: 'error' });
      return;
    }

    setIsUploading(true);
    const formUpload = new FormData();
    formUpload.append('file', file);
    
    try {
      const uploadRes = await api.post('/transaksi-spop/upload', formUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = uploadRes.data.url;
      
      setFormData(prev => {
        const exist = prev.lampiran.find(l => l.jenis_dokumen === jenis_dokumen);
        if (exist) {
          return { ...prev, lampiran: prev.lampiran.map(l => l.jenis_dokumen === jenis_dokumen ? { ...l, url_file: fileUrl } : l) };
        } else {
          return { ...prev, lampiran: [...prev.lampiran, { jenis_dokumen, url_file: fileUrl }] };
        }
      });
      setToast({ show: true, message: 'Surat kuasa berhasil diunggah', type: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      setToast({ show: true, message: 'Gagal mengunggah file', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    // Validasi Frontend
    const newErrors = {};
    if (!formData.nik || formData.nik.length < 16) newErrors.nik = 'NIK harus 16 digit';
    if (!formData.nama) newErrors.nama = 'Nama Wajib Pajak wajib diisi';
    if (!formData.alamat) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.rt) newErrors.rt = 'RT wajib diisi';
    if (!formData.rw) newErrors.rw = 'RW wajib diisi';
    if (!formData.kecamatan) newErrors.kecamatan = 'Kecamatan wajib dipilih';
    if (!formData.kelurahan) newErrors.kelurahan = 'Kelurahan wajib dipilih';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ show: true, message: 'Mohon lengkapi semua isian wajib (bergaris merah)', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      setErrors({});
      const newId = await saveDraft();
      setToast({ show: true, message: 'Langkah 2 berhasil disimpan.', type: 'success' });
      const savedId = idTransaksi || newId;
      if (savedId) {
        if (formData.transaksi === 'MUTASI') {
          navigate(`/spop/konfirmasi/${savedId}`);
        } else {
          navigate(`/spop/objek-pajak/${savedId}`);
        }
      }
    } catch (error) {
      console.error('Error saving step:', error);
      const errorMsg = error.response?.data?.message || error.response?.data || error.message;
      alert("VALIDATION ERROR: " + JSON.stringify(errorMsg, null, 2));
      setToast({ show: true, message: "Gagal menyimpan", type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
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
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
            DATA SUBJEK PAJAK
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label-sm text-primary block">NOMOR KTP (NIK)</label>
            <input
              type="text"
              maxLength={16}
              value={formData.nik}
              onChange={(e) => handleTextChange('nik', { target: { value: e.target.value.replace(/\D/g, '') } })}
              className={`w-full h-12 border ${errors.nik ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-data-mono text-lg tracking-widest bg-white transition-all shadow-sm outline-none`}
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
                  className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer ${errors.statusWp ? 'border-error' : 'border-outline-variant'}`}
                >
                  <input
                    type="radio"
                    name="statusWp"
                    value={val}
                    checked={formData.statusWp === val}
                    onChange={(e) => handleTextChange('statusWp', e)}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                  />
                  <span className="text-sm font-medium text-on-surface">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-label-sm text-primary block">PEKERJAAN</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: 'PNS', val: 'PNS' },
                { label: 'TNI/POLRI', val: 'ABRI' },
                { label: 'Pensiunan', val: 'PENSIUNAN' },
                { label: 'Badan', val: 'BADAN' },
                { label: 'Lainnya', val: 'LAINNYA' },
              ].map(({ label, val }) => (
                <label
                  key={val}
                  className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer ${errors.pekerjaan ? 'border-error' : 'border-outline-variant'}`}
                >
                  <input
                    type="radio"
                    name="pekerjaan"
                    value={val}
                    checked={formData.pekerjaan === val}
                    onChange={(e) => handleTextChange('pekerjaan', e)}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                  />
                  <span className="text-sm font-medium text-on-surface">{label}</span>
                </label>
              ))}
            </div>
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
              className={`w-full h-12 border ${errors.nama ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 text-on-surface bg-white transition-all shadow-sm outline-none`}
              placeholder="Masukkan nama sesuai KTP / Sertifikat"
            />
            {errors.nama && <p className="text-error text-[12px]">{errors.nama}</p>}
            
            <label className="flex items-center gap-3 cursor-pointer mt-3 p-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-primary focus:ring-primary border-outline-variant rounded"
                checked={formData.isKuasa}
                onChange={(e) => setFormData(prev => ({ ...prev, isKuasa: e.target.checked }))}
              />
              <span className="text-sm font-medium text-on-surface">Bertindak Selaku Kuasa (Bukan Pemilik Langsung)</span>
            </label>
            
            {formData.isKuasa && (
              <div className="flex flex-col gap-2">
                <div className={`mt-3 p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn ${errors.suratKuasa ? 'border-error bg-error/10 ring-1 ring-error' : 'border-primary/20 bg-surface-container'}`}>
                  <div className="text-sm text-on-surface-variant w-full">
                    <span className={`font-bold block mb-1 ${errors.suratKuasa ? 'text-error' : 'text-on-surface'}`}>Wajib Lampirkan Surat Kuasa</span>
                    Karena Anda bertindak selaku kuasa, silakan unggah dokumen surat kuasa di sini (Maks 2MB).
                    {errors.suratKuasa && <span className="block text-error font-bold mt-1">*{errors.suratKuasa}</span>}
                  </div>
                
                <div className="relative border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center mt-3 cursor-pointer hover:border-primary transition-colors">
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
                  <span className="material-symbols-outlined text-4xl text-primary/60 mb-2">upload_file</span>
                  <p className="text-sm font-medium text-on-surface">Klik untuk unggah Surat Kuasa</p>
                  <p className="text-xs text-on-surface-variant mt-1">Format: JPG, PNG, PDF (Max 2MB)</p>
                </div>

                </div>

                {(() => {
                  const suratKuasa = formData.lampiran.find(l => l.jenis_dokumen === 'SURAT_KUASA');
                  if (suratKuasa) {
                    return (
                      <div className="flex justify-between items-center p-4 border border-outline-variant rounded-lg bg-surface-container-low mt-4 animate-fadeIn">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">description</span>
                          <div>
                            <p className="font-bold text-sm text-on-surface">Surat Kuasa</p>
                            <a href={suratKuasa.url_file} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">visibility</span>
                              Lihat Pratinjau Dokumen
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormData(prev => ({
                              ...prev,
                              lampiran: prev.lampiran.filter(l => l.jenis_dokumen !== 'SURAT_KUASA')
                            }));
                          }}
                          className="material-symbols-outlined text-error hover:bg-error/10 rounded-full p-2 transition-colors cursor-pointer"
                          title="Hapus Surat Kuasa"
                        >
                          delete
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>


          <div className="space-y-2">
            <label className="text-sm text-primary flex items-center font-bold">NPWP <span className="text-gray-400 font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
            <input
              type="text"
              maxLength={16}
              value={formData.npwp}
              onChange={(e) => handleTextChange('npwp', { target: { value: e.target.value.replace(/\D/g, '') } })}
              className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono text-lg tracking-widest bg-white transition-all shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Masukkan NPWP"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-primary flex items-center gap-1 font-bold">No. TELP/HP. <span className="text-gray-400 font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
            <div className="flex h-12 border border-outline-variant rounded bg-white transition-all shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <div className="flex items-center justify-center px-4 border-r border-outline-variant bg-surface-container-low font-data-mono text-lg font-bold text-on-surface-variant select-none">
                08
              </div>
              <input
                type="text"
                maxLength={11}
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

        <div className="space-y-4 pt-6 border-t border-outline-variant">
          <h5 className="text-lg font-bold text-on-surface pb-2 border-b border-outline-variant">
            ALAMAT LENGKAP SUBJEK PAJAK
          </h5>

          {/* Baris 1: Alamat + Blok/Kav */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm text-on-surface-variant font-bold block">Alamat (Jalan)</label>
              <input
                type="text"
                maxLength={255}
                value={formData.alamat}
                onChange={(e) => handleTextChange('alamat', e)}
                className={`w-full h-11 border ${errors.alamat ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded-md px-4 outline-none`}
                placeholder="Nama jalan dan nomor rumah"
              />
              {errors.alamat && <p className="text-error text-[12px]">{errors.alamat}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm text-on-surface-variant font-bold flex items-center gap-1">Blok/Kav/No <span className="text-gray-400 font-normal text-[11px]">(Opsional)</span></label>
              <input
                type="text"
                maxLength={50}
                value={formData.blokKav}
                onChange={(e) => handleTextChange('blokKav', e)}
                className="w-full h-11 border border-outline-variant rounded-md px-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Blok A / No. 1"
              />
            </div>
          </div>

          {/* Baris 2: RW + RT + Kecamatan + Kelurahan (satu baris) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-on-surface-variant font-bold">RW</label>
              <input
                type="text"
                maxLength={3}
                value={formData.rw}
                onChange={(e) => handleTextChange('rw', { target: { value: e.target.value.replace(/\D/g, '') } })}
                className={`w-full h-11 border ${errors.rw ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded-md px-4 text-center font-data-mono outline-none`}
                placeholder="000"
              />
              {errors.rw && <p className="text-error text-[12px]">{errors.rw}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm text-on-surface-variant font-bold">RT</label>
              <input
                type="text"
                maxLength={3}
                value={formData.rt}
                onChange={(e) => handleTextChange('rt', { target: { value: e.target.value.replace(/\D/g, '') } })}
                className={`w-full h-11 border ${errors.rt ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded-md px-4 text-center font-data-mono outline-none`}
                placeholder="000"
              />
              {errors.rt && <p className="text-error text-[12px]">{errors.rt}</p>}
            </div>
            <WilayahDropdown
              selectedKecamatan={formData.kecamatan}
              selectedKelurahan={formData.kelurahan}
              onSelect={(namaKec, namaKel, kodeKec, kodeKel) => {
                setFormData(prev => ({
                  ...prev,
                  kecamatan: namaKec,
                  kelurahan: namaKel,
                  kabupaten: namaKel ? 'Purbalingga' : prev.kabupaten,
                  kodeWilayah: kodeKel || kodeKec || prev.kodeWilayah,
                }));
              }}
              errorKecamatan={errors.kecamatan}
              errorKelurahan={errors.kelurahan}
              required={true}
            />
          </div>

          {/* Baris 3: Kabupaten (readonly) + Kode Pos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="text-sm text-on-surface-variant font-bold block">Kabupaten / Kota</label>
              <input
                type="text"
                readOnly
                value="Purbalingga"
                className="w-full h-11 border border-outline-variant rounded-md px-4 outline-none bg-surface-container-low text-on-surface-variant cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-on-surface-variant font-bold flex items-center gap-1">Kode Pos <span className="text-gray-400 font-normal text-[11px]">(Opsional)</span></label>
              <input
                type="text"
                maxLength={5}
                value={formData.kodePos}
                onChange={(e) => handleTextChange('kodePos', { target: { value: e.target.value.replace(/\D/g, '') } })}
                className="w-full h-11 border border-outline-variant rounded-md px-4 font-data-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="53311"
              />
            </div>
          </div>
        </div>

      </section>

      <div className="flex justify-end pt-8 border-t border-outline-variant gap-3">
        <button type="button" onClick={() => navigate(`/spop/informasi-umum/${idTransaksi || ''}`)} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
          Kembali
        </button>
        <button type="button" onClick={handleSave} disabled={isSubmitting} className="px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-primary/90 shadow-md transition-all flex items-center gap-2">
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          Simpan Data
        </button>
      </div>
    </div>
  );
}
