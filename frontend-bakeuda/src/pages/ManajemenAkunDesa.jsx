import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

export default function ManajemenAkunDesa() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [wilayahList, setWilayahList] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    password: '',
    kode_wilayah: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchUsers = async (query = '') => {
    setIsLoading(true);
    try {
      const response = await api.get(`/users?username=${query}`);
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
    fetchWilayah();
  }, []);

  const fetchWilayah = async () => {
    try {
      const response = await api.get('/wilayah');
      if (response.data.success) {
        setWilayahList(response.data.data);
      }
    } catch (err) {
      console.error('Gagal memuat data wilayah:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({ nama_lengkap: '', username: '', password: '', kode_wilayah: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({ 
      nama_lengkap: user.nama_lengkap, 
      username: user.username, 
      password: '', // Kosongkan password saat edit (hanya diisi jika ingin diganti)
      kode_wilayah: user.kode_wilayah || '' 
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun desa '${username}'?`)) {
      return;
    }
    try {
      await api.delete(`/users/${id}`);
      fetchUsers(searchQuery); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus pengguna');
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
      } else {
        // Edit mode (only send password if it's filled)
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/users/${selectedUser.id_user}`, updateData);
      }
      setIsModalOpen(false);
      fetchUsers(searchQuery);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-display-sm font-bold text-on-background tracking-tight">Manajemen Akun Desa</h1>
          <p className="text-on-surface-variant font-body-lg mt-1">Kelola data login perangkat desa di Kabupaten Purbalingga</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-on-primary hover:bg-primary/90 px-6 py-3 rounded-full font-label-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Tambah Akun
        </button>
      </div>

      <div className="bg-surface rounded-2xl md:rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest">
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Cari berdasarkan username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface font-body-md"
            />
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-md uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Nama Lengkap</th>
                <th className="py-4 px-6 font-bold">Username</th>
                <th className="py-4 px-6 font-bold">Kode Wilayah</th>
                <th className="py-4 px-6 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-body-md text-on-surface">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
                    <p className="mt-2">Memuat data akun...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-error">
                    <span className="material-symbols-outlined text-[32px]">error</span>
                    <p className="mt-2">{error}</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] opacity-50">group_off</span>
                    <p className="mt-3 font-medium">Tidak ada data ditemukan</p>
                    <p className="text-sm mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id_user} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                          {user.nama_lengkap.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.nama_lengkap}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-surface-container-high px-3 py-1 rounded-md text-sm font-medium border border-outline-variant">
                        {user.username}
                      </span>
                    </td>
                    <td className="py-4 px-6">{user.kode_wilayah || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 text-primary hover:bg-primary-container rounded-lg transition-colors"
                          title="Edit Akun"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id_user, user.username)}
                          className="p-2 text-error hover:bg-error-container rounded-lg transition-colors"
                          title="Hapus Akun"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
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

      {/* Modal / Pop-up */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-title-lg font-bold text-on-surface">
                {modalMode === 'add' ? 'Tambah Akun Desa' : 'Edit Akun Desa'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6">
              {formError && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl flex items-start gap-3 border border-error/20">
                  <span className="material-symbols-outlined text-error shrink-0">warning</span>
                  <p className="text-sm font-medium">{formError}</p>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-1.5">Nama Lengkap (Desa)</label>
                  <input 
                    type="text" 
                    name="nama_lengkap" 
                    required 
                    value={formData.nama_lengkap} 
                    onChange={handleChange}
                    placeholder="Contoh: Perangkat Desa Mrebet"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-1.5">Username Login</label>
                  <input 
                    type="text" 
                    name="username" 
                    required 
                    value={formData.username} 
                    onChange={handleChange}
                    placeholder="Contoh: desa02"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-1.5">
                    Password {modalMode === 'edit' && <span className="text-on-surface-variant font-normal text-xs ml-1">(Kosongkan jika tidak ingin diubah)</span>}
                  </label>
                  <input 
                    type="password" 
                    name="password" 
                    required={modalMode === 'add'} 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-1.5">Kode Wilayah</label>
                  <select 
                    name="kode_wilayah" 
                    required 
                    value={formData.kode_wilayah} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none" 
                  >
                    <option value="">-- Pilih Wilayah --</option>
                    {wilayahList.map((w) => (
                      <option key={w.kode_wilayah} value={w.kode_wilayah}>
                        {w.kode_wilayah} - Desa {w.nama_desa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-full font-label-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full font-label-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">save</span>
                  )}
                  {modalMode === 'add' ? 'Simpan Akun' : 'Update Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
