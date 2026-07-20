import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpop } from '../../context/SpopContext';
import SegmentedNOPInput from '../../components/SegmentedNOPInput';
import ToastNotification from '../../components/ToastNotification';

export default function Step1InformasiUmum() {
  const { formData, setFormData, errors, setErrors, saveDraft, idTransaksi } = useSpop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const newId = await saveDraft();
      setToast({ show: true, message: 'Langkah 1 berhasil disimpan.', type: 'success' });
      setTimeout(() => {
        navigate(`/spop/detail/${idTransaksi || newId}`);
      }, 1000);
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
              <div className="p-4 bg-yellow-50 rounded border border-yellow-200 max-w-3xl">
                <div className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-yellow-600">info</span>
                  <div>
                    <p className="text-sm font-bold text-yellow-800">Peringatan</p>
                    <p className="text-xs text-yellow-700 leading-tight">
                      Pastikan NOP sesuai dengan SPPT tahun pajak berjalan untuk mempermudah proses verifikasi otomatis.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="border-outline-variant" />

      <section className="bg-surface-container-low p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <h4 className="text-on-surface font-bold uppercase">
            A. INFORMASI TAMBAHAN UNTUK DATA BARU
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Input NOP ASAL */}
          {['PECAH', 'GABUNG'].includes(formData.transaksi) && (
            <div className="flex flex-col gap-3 col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-on-surface-variant font-bold uppercase">NOP Asal {formData.transaksi === 'GABUNG' ? '(Minimal 2 NOP)' : ''}</label>
                {formData.transaksi === 'GABUNG' && (
                  <button type="button" onClick={() => setFormData(prev => ({...prev, nopAsalList: [...(prev.nopAsalList || ['']), '']}))} className="text-xs bg-blue-100 text-primary px-3 py-1 rounded-full font-bold hover:bg-blue-200">
                    + Tambah NOP Asal
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(formData.nopAsalList || ['']).map((nop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nop}
                      onChange={(e) => {
                        const newNopAsal = [...(formData.nopAsalList || [''])];
                        newNopAsal[idx] = e.target.value.replace(/[^0-9.]/g, '');
                        setFormData(prev => ({ ...prev, nopAsalList: newNopAsal }));
                      }}
                      placeholder="33.03.XXX.XXX.XXX-XXXX.X"
                      className="p-3 bg-white border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest"
                    />
                    {formData.transaksi === 'GABUNG' && (formData.nopAsalList || ['']).length > 2 && (
                      <button type="button" onClick={() => {
                        const newNopAsal = (formData.nopAsalList || ['']).filter((_, i) => i !== idx);
                        setFormData(prev => ({ ...prev, nopAsalList: newNopAsal }));
                      }} className="text-error bg-red-100 p-3 rounded-md hover:bg-red-200">
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
            <label className="text-xs text-on-surface-variant font-bold uppercase flex items-center gap-1">No. SPPT Lama <span className="font-normal text-[11px] ml-1 flex-none normal-case">(Opsional)</span></label>
            <input
              type="text"
              value={formData.spptLama}
              onChange={(e) => setFormData(prev => ({ ...prev, spptLama: e.target.value.replace(/[^0-9.]/g, '') }))}
              placeholder="XXX.XXX.XXX"
              className="p-3 bg-white border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-8 border-t border-outline-variant">
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
