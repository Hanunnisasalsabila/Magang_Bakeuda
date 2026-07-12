import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import wilayahData from '../utils/wilayahData.json';
import ToastNotification from '../components/ToastNotification';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ManajemenWilayah() {
  const [wilayahList, setWilayahList] = useState(wilayahData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  
  const [formData, setFormData] = useState({
    kode_wilayah: '',
    nama_desa: '',
    kode_kel: '',
    kecamatan: '',
    kode_kec: '',
    kabupaten: 'Purbalingga',
    kode_kab: '3303',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Custom Alerts & Confirms
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, kode: null, nama: '' });

  const KECAMATAN_DATA = React.useMemo(() => {
    const map = new Map();
    wilayahList.forEach(w => {
      if (w.kecamatan && w.kode_kec && !map.has(w.kecamatan)) {
        map.set(w.kecamatan, w.kode_kec);
      }
    });
    return Array.from(map.entries()).map(([nama, kode]) => ({ nama, kode })).sort((a,b) => a.nama.localeCompare(b.nama));
  }, [wilayahList]);

  const fetchWilayah = async () => {
    // Diganti menggunakan data JSON lokal agar tidak membebani backend yang masih dummy
    setWilayahList(wilayahData);
  };

  useEffect(() => {
    fetchWilayah();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterKecamatan, itemsPerPage]);

  const openAddModal = () => {
    setModalMode('add');
    setSelectedWilayah(null);
    setFormData({ 
      kode_wilayah: '', nama_desa: '', kode_kel: '', 
      kecamatan: '', kode_kec: '', kabupaten: 'Purbalingga', kode_kab: '3303' 
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (wilayah) => {
    setModalMode('edit');
    setSelectedWilayah(wilayah);
    setFormData({ 
      kode_wilayah: wilayah.kode_wilayah, 
      nama_desa: wilayah.nama_desa, 
      kode_kel: wilayah.kode_kel, 
      kecamatan: wilayah.kecamatan, 
      kode_kec: wilayah.kode_kec, 
      kabupaten: wilayah.kabupaten, 
      kode_kab: wilayah.kode_kab 
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const triggerDelete = (kode, nama) => {
    setConfirmDialog({ isOpen: true, kode, nama });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/wilayah/${confirmDialog.kode}`);
      fetchWilayah();
      setToast({ show: true, message: `Desa '${confirmDialog.nama}' berhasil dihapus`, type: 'success' });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Gagal menghapus wilayah', type: 'error' });
    } finally {
      setConfirmDialog({ isOpen: false, kode: null, nama: '' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      if (modalMode === 'add') {
        await api.post('/wilayah', formData);
      } else {
        await api.put(`/wilayah/${selectedWilayah.kode_wilayah}`, formData);
      }
      setIsModalOpen(false);
      fetchWilayah();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'kode_kel' && value !== '' && !/^\d+$/.test(value)) {
      return; // Hanya izinkan input angka
    }

    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-update kode_wilayah based on kode_kab + kode_kec + kode_kel
      if (name === 'kode_kel' || name === 'kode_kec') {
        updated.kode_wilayah = `${updated.kode_kab}${updated.kode_kec}${updated.kode_kel}`;
      }
      
      return updated;
    });
  };

  const handleKecamatanChange = (e) => {
    const selectedNama = e.target.value;
    const selectedData = KECAMATAN_DATA.find(k => k.nama === selectedNama);
    
    setFormData(prev => {
      const newKodeKec = selectedData ? selectedData.kode : prev.kode_kec;
      const newKodeWilayah = `${prev.kode_kab}${newKodeKec}${prev.kode_kel}`;
      
      return {
        ...prev,
        kecamatan: selectedNama,
        kode_kec: newKodeKec,
        kode_wilayah: newKodeWilayah
      };
    });
  };

  const filteredWilayah = wilayahList.filter(w => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = w.nama_desa.toLowerCase().includes(searchLower) || 
                        w.kecamatan.toLowerCase().includes(searchLower) ||
                        w.kode_wilayah.toLowerCase().includes(searchLower);
    const matchKecamatan = filterKecamatan ? w.kecamatan === filterKecamatan : true;
    return matchSearch && matchKecamatan;
  });

  const totalPages = Math.ceil(filteredWilayah.length / itemsPerPage);
  const paginatedWilayah = filteredWilayah.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Manajemen Wilayah
          </h1>
          <p className="text-on-surface-variant font-body-lg mt-1 opacity-80 max-w-3xl">
            Kelola data referensi wilayah untuk seluruh Kecamatan dan Desa/Kelurahan.
          </p>
        </div>
        <div className="shrink-0">
          <button 
            onClick={openAddModal}
            className="bg-primary text-white hover:bg-primary/90 px-5 py-2.5 rounded shadow-sm font-semibold text-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Wilayah
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant/60 bg-surface-container-lowest flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-[400px] group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors">
              search
            </span>
            <input 
              type="text" 
              placeholder="Cari Kode Wilayah, Desa, atau Kecamatan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-on-surface text-sm shadow-sm"
            />
          </div>
          
          <div className="relative w-full sm:w-64 shrink-0">
            <select 
              value={filterKecamatan}
              onChange={(e) => setFilterKecamatan(e.target.value)}
              style={{ backgroundImage: 'none' }}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-outline-variant rounded-md focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-on-surface font-semibold text-sm shadow-sm outline-none appearance-none cursor-pointer"
            >
              <option value="">-- Semua Kecamatan --</option>
              {KECAMATAN_DATA.map((kec) => (
                <option key={kec.nama} value={kec.nama}>{kec.nama}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
              filter_list
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto relative scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 z-10 bg-white shadow-sm outline outline-1 outline-primary/10">
              <tr className="bg-primary/5 text-primary font-medium text-xs uppercase tracking-wider border-b border-primary/20">
                <th className="py-2.5 px-4 text-center w-[20%]">Kode Wilayah</th>
                <th className="py-2.5 px-4 text-left w-[35%]">Nama Desa / Kelurahan</th>
                <th className="py-2.5 px-4 text-center w-[30%]">Kecamatan</th>
                <th className="py-2.5 px-4 text-center w-[15%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-primary/60">
                      <span className="material-symbols-outlined animate-spin text-5xl mb-3">sync</span>
                      <p className="font-semibold tracking-wide">MENGAMBIL DATA...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center text-error">
                    <span className="material-symbols-outlined text-[48px] mb-2">error</span>
                    <p className="font-bold">{error}</p>
                  </td>
                </tr>
              ) : paginatedWilayah.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant/60">
                      <span className="material-symbols-outlined text-[64px] mb-3 opacity-50">wrong_location</span>
                      <p className="font-bold text-lg text-on-surface-variant">Wilayah Tidak Ditemukan</p>
                      <p className="text-sm">Tidak ditemukan data wilayah yang sesuai kriteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedWilayah.map((w, i) => (
                  <tr key={w.kode_wilayah} className="hover:bg-primary/5 transition-colors">
                    <td className="py-2.5 px-4 text-center">
                      <span className="font-mono text-on-surface">
                        {w.kode_wilayah}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-left">
                      <p className="font-medium text-on-surface uppercase">{w.nama_desa}</p>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="text-on-surface">{w.kecamatan}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(w)}
                          className="flex items-center justify-center w-8 h-8 bg-white text-primary border border-outline-variant hover:border-primary hover:bg-primary/5 rounded-lg transition-all shadow-sm group/btn"
                          title="Edit Wilayah"
                        >
                          <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">edit</span>
                        </button>
                        <button 
                          onClick={() => triggerDelete(w.kode_wilayah, w.nama_desa)}
                          className="flex items-center justify-center w-8 h-8 bg-white text-error border border-outline-variant hover:border-error hover:bg-error/5 rounded-lg transition-all shadow-sm group/btn"
                          title="Hapus Wilayah"
                        >
                          <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {filteredWilayah.length > 0 && (
          <div className="p-4 border-t border-outline-variant/60 bg-surface-container-lowest flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-on-surface-variant font-medium">
              <div className="flex items-center gap-2 border-r border-outline-variant/60 pr-4">
                <label className="font-semibold whitespace-nowrap">Tampilkan:</label>
                <div className="relative">
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{ backgroundImage: 'none' }}
                    className="pl-3 pr-8 py-1.5 bg-white border border-outline-variant rounded-md focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-on-surface font-bold text-sm shadow-sm outline-none appearance-none cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
              <div>
                Menampilkan <span className="font-bold text-on-surface">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-on-surface">{Math.min(currentPage * itemsPerPage, filteredWilayah.length)}</span> dari <span className="font-bold text-on-surface">{filteredWilayah.length}</span> wilayah
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-md border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman Sebelumnya"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = currentPage;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${
                      currentPage === pageNum 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'border border-outline-variant text-on-surface hover:bg-surface-container-high hover:border-on-surface/30'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center justify-center w-8 h-8 rounded-md border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Halaman Selanjutnya"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[28px] shadow-2xl overflow-hidden animate-scale-in border border-white/20 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-outline-variant/50 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">
                    {modalMode === 'add' ? 'add_location' : 'edit_location'}
                  </span>
                </div>
                <div>
                  <h2 className="font-display-sm text-xl font-bold text-on-surface">
                    {modalMode === 'add' ? 'Formulir Data Wilayah' : 'Edit Data Wilayah'}
                  </h2>
                  <p className="text-on-surface-variant text-sm mt-0.5">
                    {modalMode === 'add' ? 'Pendaftaran wilayah administrasi baru ke dalam sistem.' : 'Perbarui nama desa.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {formError && (
                <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 border border-error/20">
                  <span className="material-symbols-outlined shrink-0">error</span>
                  <p className="text-sm font-bold">{formError}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Bagian 1: Wilayah Induk */}
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/60">
                  <h3 className="font-bold text-primary mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    Data Wilayah Induk
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1.5 text-[10px]">Nama Kabupaten</label>
                      <input 
                        type="text" 
                        disabled
                        value="Purbalingga" 
                        className="w-full px-4 py-2.5 text-sm bg-surface-container/50 border border-outline-variant/50 rounded-lg text-on-surface font-semibold shadow-inner outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1.5 text-[10px]">Kode Kabupaten</label>
                      <input 
                        type="text" 
                        disabled
                        value="3303" 
                        className="w-full px-4 py-2.5 text-sm bg-surface-container/50 border border-outline-variant/50 rounded-lg text-on-surface-variant font-data-mono shadow-inner outline-none cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1.5 text-[10px]">Pilihan Kecamatan <span className="text-error">*</span></label>
                      <div className="relative">
                        <select 
                          name="kecamatan" 
                          required 
                          disabled={modalMode === 'edit'}
                          value={formData.kecamatan} 
                          onChange={handleKecamatanChange}
                          className={`w-full pl-4 pr-10 py-2.5 bg-white border border-outline-variant rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-on-surface font-semibold shadow-sm outline-none appearance-none ${modalMode === 'edit' ? 'bg-surface-container/50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <option value="">Pilih Kecamatan</option>
                          {KECAMATAN_DATA.map((kec) => (
                            <option key={kec.nama} value={kec.nama}>{kec.nama}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1.5 text-[10px]">Kode Kecamatan</label>
                      <input 
                        type="text" 
                        disabled
                        value={formData.kode_kec || ''} 
                        placeholder="Otomatis"
                        className="w-full px-4 py-2.5 text-sm bg-surface-container/50 border border-outline-variant/50 rounded-lg font-data-mono text-on-surface-variant shadow-inner outline-none cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 3: Desa/Kelurahan */}
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/60">
                  <h3 className="font-bold text-primary mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[16px]">holiday_village</span>
                    Data Desa / Kelurahan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1.5 text-[10px]">Nama Desa / Kelurahan <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        name="nama_desa" 
                        required 
                        value={formData.nama_desa} 
                        onChange={handleChange}
                        placeholder="Masukkan nama desa"
                        className="w-full px-4 py-2.5 text-sm bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface shadow-sm outline-none hover:border-primary/50" 
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-1.5 text-[10px]">Kode Desa (3 Digit Angka) <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        name="kode_kel" 
                        required 
                        disabled={modalMode === 'edit'}
                        value={formData.kode_kel} 
                        onChange={handleChange}
                        maxLength="3"
                        placeholder="Misal: 001"
                        className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-all font-data-mono shadow-sm outline-none text-on-surface ${
                          modalMode === 'edit' ? 'bg-surface-container/50 border-outline-variant/50 cursor-not-allowed text-on-surface-variant' : 'bg-white border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20 hover:border-primary/50'
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 4: Hasil Final */}
                <div className="pt-2">
                  <label className="flex items-center gap-1.5 font-label-sm font-medium text-primary uppercase tracking-widest mb-2 text-[10px]">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Kode Wilayah Final (Format 10 Digit)
                  </label>
                  <input 
                    type="text" 
                    name="kode_wilayah" 
                    disabled
                    value={formData.kode_wilayah || ''} 
                    placeholder="Menunggu data lengkap"
                    className="w-full px-5 py-3 text-base bg-primary/5 border border-primary/20 text-primary rounded-lg font-data-mono shadow-sm outline-none cursor-not-allowed font-bold tracking-widest text-center" 
                  />
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-outline-variant/40 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors text-center"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  )}
                  {modalMode === 'add' ? 'Simpan Wilayah' : 'Perbarui Wilayah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Toast & Confirm */}
      <ToastNotification 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Hapus Desa"
        message={`Apakah Anda yakin ingin menghapus data desa '${confirmDialog.nama}'? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, kode: null, nama: '' })}
        type="danger"
      />
    </div>
  );
}
