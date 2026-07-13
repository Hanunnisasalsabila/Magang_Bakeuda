import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import wilayahData from '../utils/wilayahData.json';
import ToastNotification from '../components/ToastNotification';
import ConfirmDialog from '../components/ConfirmDialog';
import CetakKredensialModal from '../components/CetakKredensialModal';

export default function ManajemenAkunDesa() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('');
  const [wilayahList, setWilayahList] = useState(wilayahData);
  
  // Pagination & Sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'nama_lengkap', direction: 'asc' });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    password: '',
    kode_wilayah: '',
    nip: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  
  // Custom Alerts & Confirms
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null, username: '' });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar pengguna');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({ nama_lengkap: '', username: '', password: '', kode_wilayah: '', nip: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({ 
      nama_lengkap: user.nama_lengkap, 
      username: user.username, 
      password: '', // Kosongkan password saat edit
      kode_wilayah: user.kode_wilayah || '',
      nip: user.nip || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const triggerDelete = (id, username) => {
    setConfirmDialog({ isOpen: true, id, username });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${confirmDialog.id}`);
      fetchUsers();
      setToast({ show: true, message: `Akun '${confirmDialog.username}' berhasil dihapus`, type: 'success' });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Gagal menghapus pengguna', type: 'error' });
    } finally {
      setConfirmDialog({ isOpen: false, id: null, username: '' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      if (!formData.nama_lengkap?.trim() || !formData.username?.trim() || !formData.kode_wilayah) {
        setFormError('Nama Lengkap, Username, dan Area / Wilayah Tugas wajib diisi');
        setIsSubmitting(false);
        return;
      }

      if (modalMode === 'add') {
        if (!formData.password) {
          setFormError('Password wajib diisi untuk akun baru');
          setIsSubmitting(false);
          return;
        }
        await api.post('/users', formData);
        setToast({ show: true, message: `Akun baru berhasil ditambahkan`, type: 'success' });
      } else {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/users/${selectedUser.id_user}`, updateData);
        setToast({ show: true, message: `Akun berhasil diperbarui`, type: 'success' });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtered and Sorted users for rendering
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = user.username.toLowerCase().includes(searchLower) || 
                        user.nama_lengkap.toLowerCase().includes(searchLower);
    const matchWilayah = filterWilayah ? user.kode_wilayah === filterWilayah : true;
    return matchSearch && matchWilayah;
  }).sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Manajemen Akun Desa
          </h1>
          <p className="text-on-surface-variant font-body-lg mt-1 opacity-80">
            Kelola akses dan data profil pengguna perangkat desa.
          </p>
        </div>
        <div className="shrink-0 flex gap-3">
          <button 
            onClick={() => setIsPrintModalOpen(true)}
            className="bg-white text-primary border border-primary hover:bg-primary/5 px-5 py-2.5 rounded shadow-sm font-semibold text-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Cetak Kredensial
          </button>
          <button 
            onClick={openAddModal}
            className="bg-primary text-white hover:bg-primary/90 px-5 py-2.5 rounded shadow-sm font-semibold text-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Akun
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full sm:w-96 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-[20px]">
              search
            </span>
            <input 
              type="text" 
              placeholder="Cari nama atau username..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">
              location_on
            </span>
            <select
              value={filterWilayah}
              onChange={(e) => {
                setFilterWilayah(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm shadow-sm cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">Semua Wilayah</option>
              {wilayahList.map((w) => (
                <option key={w.kode_wilayah} value={w.kode_wilayah}>
                  {w.kode_wilayah} - {w.nama_desa} ({w.kecamatan})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low/30 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                <th 
                  className="py-3 px-4 font-medium border-b border-outline-variant text-left w-1/3 cursor-pointer hover:bg-surface-container-low transition-colors"
                  onClick={() => handleSort('nama_lengkap')}
                >
                  <div className="flex items-center gap-2">
                    Pengguna
                    {sortConfig.key === 'nama_lengkap' && (
                      <span className="material-symbols-outlined text-[14px]">
                        {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-medium border-b border-outline-variant text-left w-1/4 cursor-pointer hover:bg-surface-container-low transition-colors"
                  onClick={() => handleSort('username')}
                >
                  <div className="flex items-center gap-2">
                    Username
                    {sortConfig.key === 'username' && (
                      <span className="material-symbols-outlined text-[14px]">
                        {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-medium border-b border-outline-variant text-left w-1/4 cursor-pointer hover:bg-surface-container-low transition-colors"
                  onClick={() => handleSort('kode_wilayah')}
                >
                  <div className="flex items-center gap-2">
                    Kode Wilayah
                    {sortConfig.key === 'kode_wilayah' && (
                      <span className="material-symbols-outlined text-[14px]">
                        {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium border-b border-outline-variant text-center w-auto">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
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
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-on-surface-variant/60">
                      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[40px] opacity-50">group</span>
                      </div>
                      <p className="font-bold text-lg text-on-surface">Belum Ada Pengguna</p>
                      <p className="text-sm mt-1">Data pengguna desa akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, i) => (
                  <tr key={user.id_user} className={`hover:bg-primary/5 transition-colors group ${i % 2 === 1 ? 'bg-surface-container-lowest/30' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-sm">
                          {user.nama_lengkap.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-on-surface text-[15px]">{user.nama_lengkap}</p>
                          {user.nip ? (
                            <p className="font-data-mono text-xs tracking-widest text-on-surface-variant mt-0.5">{user.nip}</p>
                          ) : (
                            <p className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider font-medium mt-0.5">- NIP BELUM DIATUR -</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="inline-flex items-center gap-1.5 bg-surface-container-high/50 px-2.5 py-1 rounded-lg border border-outline-variant/50">
                        <span className="material-symbols-outlined text-[15px] text-on-surface-variant">badge</span>
                        <span className="font-medium text-[13px] text-on-surface">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-left">
                      {user.kode_wilayah ? (
                        <span className="font-data-mono text-[13px] text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg border border-secondary/20 inline-block">
                          {user.kode_wilayah}
                        </span>
                      ) : (
                        <span className="text-outline italic text-xs">Tidak ada wilayah</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="flex items-center justify-center w-8 h-8 bg-white text-primary border border-outline-variant hover:border-primary hover:bg-primary/5 rounded-lg transition-all shadow-sm group/btn"
                          title="Edit Akun"
                        >
                          <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">edit</span>
                        </button>
                        <button 
                          onClick={() => triggerDelete(user.id_user, user.username)}
                          className="flex items-center justify-center w-8 h-8 bg-white text-error border border-outline-variant hover:border-error hover:bg-error/5 rounded-lg transition-all shadow-sm group/btn"
                          title="Hapus Akun"
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
        {!isLoading && !error && filteredUsers.length > 0 && (
          <div className="p-4 border-t border-outline-variant/60 bg-surface-container-lowest flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-on-surface-variant font-medium">
              <div className="flex items-center gap-2 border-r border-outline-variant/60 pr-4">
                <label className="font-semibold whitespace-nowrap">Tampilkan:</label>
                <div className="relative">
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ backgroundImage: 'none' }}
                    className="pl-3 pr-8 py-1.5 bg-white border border-outline-variant rounded-md focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-on-surface font-bold text-sm shadow-sm outline-none appearance-none cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
              <div>
                Menampilkan <span className="font-bold text-on-surface">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-on-surface">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> dari <span className="font-bold text-on-surface">{filteredUsers.length}</span> pengguna
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

      {/* Modal Redesign */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden animate-scale-in flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start bg-white">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {modalMode === 'add' ? 'Tambah Akun Baru' : 'Edit Akun Pengguna'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {modalMode === 'add' ? 'Lengkapi data untuk membuat akses login.' : 'Ubah informasi atau reset password pengguna.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6">
              {formError && (
                <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 border border-error/20">
                  <span className="material-symbols-outlined shrink-0">error</span>
                  <p className="text-sm font-bold">{formError}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="nama_lengkap" 
                      required 
                      value={formData.nama_lengkap} 
                      onChange={handleChange}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                    <input 
                      type="text" 
                      name="username" 
                      required 
                      value={formData.username} 
                      onChange={handleChange}
                      placeholder="Contoh: budi.santoso"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">NIP <span className="opacity-70 text-xs">(Opsional)</span></label>
                    <input 
                      type="text" 
                      name="nip" 
                      value={formData.nip} 
                      onChange={handleChange}
                      placeholder="Contoh: 198501012010011001"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Kata Sandi (Password)
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password" 
                        required={modalMode === 'add'} 
                        value={formData.password} 
                        onChange={handleChange}
                        placeholder="Masukkan password..."
                        className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all" 
                      />
                      {formData.password.length > 0 && (
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center rounded"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      )}
                    </div>
                    {modalMode === 'edit' && (
                      <p className="mt-1.5 text-xs text-gray-500">
                        Kosongkan jika tidak ingin mengubah password
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Area / Wilayah Tugas</label>
                  <div className="relative">
                    <select 
                      name="kode_wilayah" 
                      required 
                      value={formData.kode_wilayah} 
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all cursor-pointer" 
                    >
                      <option value="">Pilih Kode Wilayah</option>
                      {wilayahList.map((w) => (
                        <option key={w.kode_wilayah} value={w.kode_wilayah}>
                          {w.kode_wilayah} - {w.nama_desa} ({w.kecamatan})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-gray-50 -mx-6 px-6 -mb-6 pb-6 pt-5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={
                    isSubmitting || 
                    !formData.nama_lengkap || 
                    !formData.username || 
                    !formData.kode_wilayah || 
                    (modalMode === 'add' && !formData.password) ||
                    (modalMode === 'edit' && selectedUser && (
                      formData.nama_lengkap === selectedUser.nama_lengkap &&
                      formData.username === selectedUser.username &&
                      formData.nip === (selectedUser.nip || '') &&
                      formData.kode_wilayah === selectedUser.kode_wilayah &&
                      formData.password === ''
                    ))
                  }
                  className="px-4 py-2 text-sm font-medium border border-transparent rounded-md transition-colors shadow-sm bg-primary text-white hover:bg-primary/90 flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                  {modalMode === 'add' ? 'Simpan Pengguna' : 'Simpan Perubahan'}
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
        title="Hapus Akun"
        message={`Apakah Anda yakin ingin menghapus akun desa '${confirmDialog.username}'? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null, username: '' })}
        type="danger"
      />
      <CetakKredensialModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        users={users}
        wilayahList={wilayahList}
      />
    </div>
  );
}
