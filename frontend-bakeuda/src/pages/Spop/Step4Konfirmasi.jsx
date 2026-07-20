import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';
import ToastNotification from '../../components/ToastNotification';
import api from '../../utils/axios';

export default function Step4Konfirmasi() {
  const { formData, setFormData, saveDraft, idTransaksi } = useSpop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [jenisDokumenUpload, setJenisDokumenUpload] = useState('Sertifikat/KTP/Lainnya');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
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
        // Find existing for this type unless it's general
        if (jenisDokumenUpload !== 'Sertifikat/KTP/Lainnya') {
            const exist = prev.lampiran.find(l => l.jenis_dokumen === jenisDokumenUpload);
            if (exist) {
                return { ...prev, lampiran: prev.lampiran.map(l => l.jenis_dokumen === jenisDokumenUpload ? { ...l, url_file: fileUrl } : l) };
            }
        }
        return { ...prev, lampiran: [...prev.lampiran, { jenis_dokumen: jenisDokumenUpload, url_file: fileUrl }] };
      });
      setToast({ show: true, message: 'Dokumen berhasil diunggah', type: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      setToast({ show: true, message: 'Gagal mengunggah file', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState({ show: false, id: null });

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const newId = await saveDraft();
      
      // Jika disetujui, ajukan
      if (formData.persetujuan) {
        await api.patch(`/transaksi-spop/${newId}/ajukan`);
      }

      setShowSuccessModal({ show: true, id: newId });
    } catch (error) {
      console.error('Error saving step:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan langkah ini.';
      setToast({ show: true, message: errorMsg, type: 'error' });
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

      {showSuccessModal.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-scaleIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil Disimpan!</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Data SPOP Anda telah berhasil disimpan dan diajukan. Silakan cek status pengajuan Anda.
            </p>
            <button
              onClick={() => navigate(`/spop/status/${showSuccessModal.id}`)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Lihat Status Pengajuan
            </button>
          </div>
        </div>
      )}
      
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 bg-primary h-8 rounded-full"></div>
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
            D. TINJAU KEMBALI DATA ANDA
          </h4>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="bg-surface-container-low border-b border-outline-variant px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">Jenis Transaksi</p>
              <p className="font-bold text-on-surface text-lg uppercase mt-0.5">
                {formData.kategoriTransaksi === 'baru' ? 'Perekaman Data Baru' : formData.kategoriTransaksi === 'update' ? 'Pemutakhiran Data' : 'Penghapusan Data'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">NOP Objek Pajak</p>
              <p className="font-data-mono font-bold text-on-surface text-lg mt-0.5">
                {['BARU', 'PECAH'].includes(formData.transaksi) ? (
                  <span className="text-on-surface-variant text-sm italic">Akan digenerate oleh Bakeuda</span>
                ) : (
                  `33.03.${formData.nop.kec || '___'}.${formData.nop.kel || '___'}.${formData.nop.blok || '___'}-${formData.nop.nourut || '____'}.${formData.nop.kode || '_'}`
                )}
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h6 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-outline-variant pb-2">Identitas Subjek Pajak</h6>
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
                      {formData.alamat || '-'}, RT {formData.rt || '-'}/RW {formData.rw || '-'}, {formData.kelurahan || '-'}, {formData.kabupaten || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-4">
              <h6 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-outline-variant pb-2">Spesifikasi Objek Pajak</h6>
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
                    <td className="py-1.5 font-data-mono text-on-surface">{formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* LAMPIRAN */}
        <div className="pt-6 border-t border-outline-variant space-y-4">
          <h4 className="text-lg font-bold text-on-surface uppercase mb-4">
            LAMPIRAN DOKUMEN PENDUKUNG
          </h4>
          <div className="space-y-4">
            {formData.lampiran.map((doc, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border border-outline-variant rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{doc.jenis_dokumen} #{idx + 1}</p>
                    <a href={doc.url_file} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Lihat Pratinjau Dokumen</a>
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
                <label className="text-sm text-on-surface-variant font-bold block">Jenis Dokumen</label>
                <select 
                  value={jenisDokumenUpload}
                  onChange={(e) => setJenisDokumenUpload(e.target.value)}
                  className="h-12 border border-outline-variant rounded-lg px-4 bg-white shadow-sm focus:border-primary focus:ring-1 focus:ring-primary font-bold text-sm w-full sm:w-auto outline-none"
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
                  className={`flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg border border-dashed border-primary text-primary font-bold hover:bg-primary/90/10 transition-colors ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
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

        {/* PERNYATAAN */}
        <div className="pt-6 border-t border-outline-variant space-y-4 mt-6">
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

            <label className="flex items-start gap-3 cursor-pointer mt-4 p-3 border border-outline-variant rounded-lg hover:bg-white transition-colors bg-white">
              <input
                type="checkbox"
                className="w-5 h-5 mt-0.5 text-primary focus:ring-primary border-outline-variant rounded"
                checked={formData.persetujuan || false}
                onChange={(e) => setFormData(prev => ({ ...prev, persetujuan: e.target.checked }))}
              />
              <span className="font-bold text-on-surface text-sm">
                Ya, saya menyetujui pernyataan di atas.
              </span>
            </label>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-8 border-t border-outline-variant gap-3">
        <button type="button" onClick={() => navigate(`/spop/objek-pajak/${idTransaksi || ''}`)} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
          Kembali
        </button>
        <button type="button" onClick={handleSave} disabled={isSubmitting || !formData.persetujuan} className={`px-6 py-2.5 rounded-full font-bold shadow-md transition-all flex items-center gap-2 ${!formData.persetujuan ? 'bg-gray-300 text-on-surface-variant cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}>
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          Simpan & Ajukan
        </button>
      </div>
    </div>
  );
}
