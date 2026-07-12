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

  // Filtered users for rendering
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = user.username.toLowerCase().includes(searchLower) || 
                        user.nama_lengkap.toLowerCase().includes(searchLower);
    const matchWilayah = filterWilayah ? user.kode_wilayah === filterWilayah : true;
    return matchSearch && matchWilayah;
  });

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
      <div className="bg-white rounded-3xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-outline-variant/60 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest">
          <div className="relative w-full sm:w-96 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
              search
            </span>
            <input 
              type="text" 
              placeholder="Cari nama atau username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-body-md shadow-sm"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              location_on
            </span>
            <select
              value={filterWilayah}
              onChange={(e) => setFilterWilayah(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-body-md shadow-sm cursor-pointer"
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
                <th className="py-3 px-4 font-medium border-b border-outline-variant text-left w-1/3">Pengguna</th>
                <th className="py-3 px-4 font-medium border-b border-outline-variant text-center w-1/4">Username</th>
                <th className="py-3 px-4 font-medium border-b border-outline-variant text-center w-1/4">Kode Wilayah</th>
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
              ) : filteredUsers.length === 0 ? (
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
                filteredUsers.map((user, i) => (
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
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 bg-surface-container-high/50 px-2.5 py-1 rounded-lg border border-outline-variant/50">
                        <span className="material-symbols-outlined text-[15px] text-on-surface-variant">badge</span>
                        <span className="font-medium text-[13px] text-on-surface">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
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
      </div>

      {/* Modal Redesign */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[28px] shadow-2xl overflow-hidden animate-scale-in border border-white/20">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-outline-variant/50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">
                    {modalMode === 'add' ? 'person' : 'manage_accounts'}
                  </span>
                </div>
                <div>
                  <h2 className="font-display-sm text-xl font-bold text-on-surface">
                    {modalMode === 'add' ? 'Tambah Akun Baru' : 'Edit Akun Pengguna'}
                  </h2>
                  <p className="text-on-surface-variant text-sm mt-0.5">
                    {modalMode === 'add' ? 'Lengkapi data untuk membuat akses login.' : 'Ubah informasi atau reset password pengguna.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8">
              {formError && (
                <div className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 border border-error/20">
                  <span className="material-symbols-outlined shrink-0">error</span>
                  <p className="text-sm font-bold">{formError}</p>
                </div>
              )}
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="nama_lengkap" 
                      required 
                      value={formData.nama_lengkap} 
                      onChange={handleChange}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-5 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold shadow-sm outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Username</label>
                    <input 
                      type="text" 
                      name="username" 
                      required 
                      value={formData.username} 
                      onChange={handleChange}
                      placeholder="Contoh: budi.santoso"
                      className="w-full px-5 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold shadow-sm outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">NIP <span className="opacity-50 text-[10px]">(Opsional)</span></label>
                    <input 
                      type="text" 
                      name="nip" 
                      value={formData.nip} 
                      onChange={handleChange}
                      placeholder="Contoh: 198501012010011001"
                      className="w-full px-5 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-data-mono tracking-widest text-sm shadow-sm outline-none" 
                    />
                  </div>
                  <div>
                    <label className="flex flex-col mb-2">
                      <span className="font-label-sm font-medium text-on-surface-variant uppercase tracking-wider">Kata Sandi (Password)</span>
                      {modalMode === 'edit' && (
                        <span className="text-xs text-primary font-bold mt-1 bg-primary/10 w-fit px-2 py-0.5 rounded-md">
                          Kosongkan jika tidak ubah password
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password" 
                        required={modalMode === 'add'} 
                        value={formData.password} 
                        onChange={handleChange}
                        placeholder="Masukkan password..."
                        className="w-full pl-5 pr-12 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold shadow-sm outline-none" 
                      />
                      {formData.password.length > 0 && (
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-high"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block font-label-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Area / Wilayah Tugas</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                      map
                    </span>
                    <select 
                      name="kode_wilayah" 
                      required 
                      value={formData.kode_wilayah} 
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold shadow-sm outline-none cursor-pointer" 
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

              <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end gap-3">
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
                  {modalMode === 'add' ? 'Simpan Pengguna Baru' : 'Perbarui Data'}
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
