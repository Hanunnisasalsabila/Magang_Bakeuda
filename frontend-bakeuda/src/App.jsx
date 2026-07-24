import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';

// Import Pages
import DashboardDesa from './pages/DashboardDesa';
import DashboardAdmin from './pages/DashboardAdmin';
import FormulirSPOP from './pages/FormulirSPOP';
import SpopLayout from './pages/Spop/SpopLayout';
import SpopDetail from './pages/Spop/SpopDetail';
import Step1InformasiUmum from './pages/Spop/Step1InformasiUmum';
import Step2SubjekPajak from './pages/Spop/Step2SubjekPajak';
import Step3ObjekPajak from './pages/Spop/Step3ObjekPajak';
import Step4DataBangunan from './pages/Spop/Step4DataBangunan';
import Step4Konfirmasi from './pages/Spop/Step4Konfirmasi';
import Step5Status from './pages/Spop/Step5Status';
import { SpopProvider } from './context/SpopContext';
import AntreanVerifikasi from './pages/AntreanVerifikasi';
import DetailReviewSPOP from './pages/DetailReviewSPOP';
import DaftarObjekPajak from './pages/DaftarObjekPajak';
import DaftarSubjekPajak from './pages/DaftarSubjekPajak';
import DetailSubjekPajak from './pages/DetailSubjekPajak';
import MonitoringObjekPajak from './pages/MonitoringObjekPajak';
import ProfilPengguna from './pages/ProfilPengguna';
import ManajemenAkunDesa from './pages/ManajemenAkunDesa';
import ManajemenWilayah from './pages/ManajemenWilayah';
import PelacakanDokumen from './pages/PelacakanDokumen';
import FormulirLSPOP from './pages/FormulirLSPOP';
import RiwayatPersetujuan from './pages/RiwayatPersetujuan';
import DraftSPOP from './pages/DraftSPOP';

import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Page title mapping
const pageTitles = {
  '/dashboard-desa': 'Dashboard Perangkat Desa',
  '/dashboard-admin': 'Dashboard Admin BKD',
  '/manajemen-akun-desa': 'Manajemen Akun Desa',
  '/manajemen-wilayah': 'Manajemen Wilayah',
  '/formulir-spop': 'Formulir SPOP Digital',
  '/draft-spop': 'Draft SPOP',
  '/formulir-lspop': 'Formulir LSPOP - Data Bangunan',
  '/antrean-verifikasi': 'Antrean Verifikasi SPOP',
  '/detail-review': 'Review Verifikasi SPOP',
  '/daftar-objek': 'Daftar Objek Pajak',
  '/monitoring-pajak': 'Monitoring Objek Pajak',
  '/pelacakan-dokumen': 'Pelacakan Dokumen',
  '/profil': 'Profil Pengguna',
  '/riwayat-persetujuan': 'Riwayat Persetujuan',
  '/help': 'Pusat Bantuan'
};

function HelpPage({ role }) {
  const isAdmin = role === 'bakeuda' || role === 'BAKEUDA';

  return (
    <div className="p-gutter max-w-screen-2xl mx-auto w-full animate-fadeIn space-y-6">
      <h3 className="text-2xl font-bold text-primary">Pusat Bantuan &amp; Panduan</h3>
      <div className="bg-white border border-outline-variant p-6 rounded-xl space-y-4 shadow-sm">
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Pusat Bantuan SIPD Kabupaten Purbalingga menyediakan informasi terkait pedoman dan alur kerja aplikasi SPOP Digital berdasarkan hak akses masing-masing pengguna.
        </p>
        <div className="border-t border-outline-variant/60 pt-4 space-y-3">
          {isAdmin ? (
            <>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur memproses antrean verifikasi SPOP?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Proses verifikasi dokumen SPOP memerlukan ketelitian. Berikut adalah tahapan untuk memproses antrean:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Buka menu "Antrean Verifikasi" melalui menu navigasi di sebelah kiri.</li>
                    <li>Cari dokumen SPOP yang berstatus "Menunggu Verifikasi" pada tabel. Perhatikan juga kolom "Jenis Layanan" (Perekaman Data Baru, Mutasi, Perubahan Data, atau Hapus).</li>
                    <li>Klik tombol "Proses Verifikasi" pada dokumen tersebut agar berkas terkunci dan tidak diproses ganda oleh admin lain.</li>
                    <li>Lakukan pemeriksaan data secara saksama. Untuk layanan seperti Mutasi dan Perubahan Data, sistem akan menampilkan perbandingan antara "Data Asal" dan "Data Baru". Untuk layanan Hapus, pastikan kesesuaian antara profil asal yang akan dihapus dengan bukti pendukung.</li>
                    <li>Periksa juga kesesuaian dokumen lampiran pada tab lampiran untuk memastikan kelengkapan syarat pengajuan.</li>
                    <li>Jika ada ketidaksesuaian, tuliskan alasan penolakan secara jelas pada kolom catatan penolakan, lalu klik tombol "Tolak".</li>
                    <li>Jika seluruh data dan dokumen pendukung sudah benar dan sah, klik tombol "Setujui" untuk menyelesaikan proses verifikasi dokumen.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur pencarian dan pengecekan daftar seluruh objek pajak?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Menu Data Objek Pajak menampilkan seluruh data wajib pajak yang sudah terdaftar di sistem. Langkah-langkah pengecekannya adalah:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Buka menu "Data Objek Pajak" pada menu navigasi.</li>
                    <li>Gunakan kolom pencarian untuk mencari data spesifik berdasarkan Nomor Objek Pajak (NOP), nama wajib pajak, ataupun nama desa/kecamatan.</li>
                    <li>Klik baris data yang diinginkan untuk melihat informasi detail mengenai objek pajak tersebut.</li>
                    <li>Pada tampilan detail, tersedia informasi mengenai riwayat perubahan data dan riwayat pengajuan SPOP yang pernah diproses.</li>
                    <li>Sebagai catatan, menu ini hanya bersifat untuk melihat data (Read-Only) guna menjaga keamanan basis data. Semua perubahan wajib melalui pengajuan SPOP.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur pelacakan riwayat keputusan dokumen SPOP?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Setiap dokumen yang telah selesai diproses akan tercatat secara permanen di dalam sistem. Cara melihat riwayat tersebut adalah:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Buka menu "Riwayat Persetujuan" melalui menu navigasi.</li>
                    <li>Sistem akan menampilkan daftar seluruh pengajuan SPOP yang sudah selesai diproses (baik yang berstatus "Disetujui" maupun "Ditolak").</li>
                    <li>Pada tabel, perhatikan kolom "Verifikator" untuk mengetahui siapa admin Bakeuda yang memberikan keputusan atas dokumen tersebut.</li>
                    <li>Riwayat penyelesaian ini disimpan secara aman oleh sistem dan tidak dapat diubah setelah keputusan dibuat.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur pengelolaan data wilayah (Kecamatan dan Desa)?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Pengaturan data wilayah harus dipastikan sudah benar sebelum sistem digunakan oleh pihak desa. Tahapan pengelolaannya adalah:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Buka menu "Data Wilayah" yang dikhususkan bagi hak akses Admin Pusat.</li>
                    <li>Untuk menambah daerah baru, klik tombol penambahan wilayah, pilih tingkatannya (Kecamatan atau Kelurahan/Desa), dan masukkan kode wilayah yang sesuai standar.</li>
                    <li>Untuk memperbaiki kesalahan penulisan nama wilayah, gunakan tombol "Ubah" pada baris wilayah yang ingin diperbaiki.</li>
                    <li>Jika ada desa yang dinonaktifkan atau digabung, cukup ubah status wilayah tersebut menjadi tidak aktif. Sistem tidak akan menghapus riwayat dokumen SPOP dari wilayah tersebut pada masa lalu.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur pengelolaan, pendaftaran, dan penghapusan akun pengguna?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Admin Pusat memiliki kewenangan untuk mengatur akses login bagi pengguna sistem. Langkah pengelolaannya adalah:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Buka menu "Data Pengguna" melalui panel navigasi.</li>
                    <li>Untuk membuat akun perangkat desa atau admin baru, klik tombol "Tambah Pengguna". Isikan nama lengkap, wilayah tugas, dan buat kata sandi awal untuk pengguna tersebut.</li>
                    <li>Jika ada pengguna yang lupa kata sandinya, admin dapat mereset kata sandi melalui tombol "Ubah" pada akun pengguna tersebut dan memasukkan kata sandi yang baru.</li>
                    <li>Jika terdapat perangkat desa yang sudah tidak menjabat, admin wajib mencabut aksesnya dengan mengeklik tombol "Hapus Akun".</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur Login, Logout, dan mengubah profil akun?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Prosedur untuk mengakses sistem, keluar, dan mengatur profil akun adalah sebagai berikut:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li><strong>Login:</strong> Buka halaman utama aplikasi, masukkan Username dan Kata Sandi dengan benar, lalu klik tombol "Masuk".</li>
                    <li><strong>Ubah Profil:</strong> Buka menu "Profil Akun" yang terletak di pojok kiri bawah navigasi. Di halaman ini, data seperti Nomor Induk Pegawai (NIP) dapat diperbarui.</li>
                    <li><strong>Ubah Kata Sandi:</strong> Di menu yang sama, masukkan kata sandi baru untuk meningkatkan keamanan akun, lalu klik "Simpan Perubahan".</li>
                    <li><strong>Logout:</strong> Untuk keluar dari sistem secara aman, klik tombol "Keluar" pada bagian paling bawah panel navigasi.</li>
                  </ol>
                </div>
              </details>
            </>
          ) : (
            <>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur pengisian formulir SPOP oleh Perangkat Desa?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Pengajuan SPOP merupakan langkah awal untuk memperbarui data wajib pajak. Cara mengisi formulir tersebut adalah:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Buka menu "Formulir SPOP" melalui menu navigasi di sebelah kiri.</li>
                    <li>Pada Langkah 1, pilih salah satu dari 3 Kategori Transaksi utama: <strong>Perekaman Baru</strong>, <strong>Pemutakhiran Data</strong>, atau <strong>Penghapusan Data</strong>. Kemudian pilih rincian jenis transaksi (misalnya Murni, Mutasi, Perubahan Data, Hapus, dll).</li>
                    <li>Untuk layanan selain Perekaman Murni, Anda diwajibkan mencari data berdasarkan Nomor Objek Pajak (NOP) asal terlebih dahulu dengan menekan tombol <strong>Cari Data Objek Pajak</strong>.</li>
                    <li>Pada Langkah 2, isi atau mutakhirkan kelengkapan data Subjek Pajak, termasuk Nomor Induk Kependudukan (NIK), NPWPD, Email, Pekerjaan, dan alamat rinci wajib pajak. (Langkah ini dapat terlewati otomatis pada layanan tertentu seperti Perubahan Data).</li>
                    <li>Pada Langkah 3 & 4, lengkapi detail fisik Objek Pajak, seperti luas tanah, kondisi, beserta data rincian setiap bangunannya (jika ada). Khusus layanan Hapus, Anda akan langsung diarahkan ke halaman konfirmasi karena tidak ada penginputan data objek/subjek baru.</li>
                    <li>Langkah terakhir adalah mengunggah file dokumen pendukung (seperti foto KTP, Sertifikat Tanah, atau Surat Keterangan). Setelah dipastikan benar, centang kotak persetujuan dan klik tombol "Kirim dan Ajukan SPOP" agar masuk antrean pusat.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Di mana status pengajuan SPOP dapat dipantau?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Seluruh berkas yang telah dikirim dapat dipantau perkembangannya secara langsung. Cara memeriksanya adalah:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Buka halaman "Dashboard" (Beranda) untuk melihat ringkasan singkat jumlah berkas yang sedang "Menunggu Verifikasi", "Disetujui", dan "Ditolak/Perlu Perbaikan".</li>
                    <li>Untuk melihat informasi yang lebih lengkap, buka menu "Monitoring Pajak".</li>
                    <li>Cari Nomor Objek Pajak (NOP) atau nama wajib pajak dari berkas yang dicari melalui kolom pencarian.</li>
                    <li>Klik tombol "Pelacakan Dokumen" pada baris berkas tersebut. Sistem akan menampilkan rincian tahapan dokumen beserta tanggal dan jam pemrosesannya.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Apa tindakan yang harus dilakukan apabila pengajuan SPOP ditolak?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Jika berkas ditolak, biasanya disebabkan oleh data yang tidak sesuai atau lampiran yang kurang jelas. Langkah perbaikannya adalah:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Pada menu Monitoring Pajak atau Riwayat Pengajuan, periksa "Catatan Verifikator" untuk melihat alasan spesifik mengapa admin pusat menolak berkas tersebut.</li>
                    <li>Buka menu "Draft SPOP". Berkas yang telah ditolak akan dikembalikan ke dalam menu draf ini secara otomatis.</li>
                    <li>Klik tombol ubah pada berkas draf tersebut.</li>
                    <li>Lakukan perbaikan data sesuai dengan catatan dari admin pusat, atau unggah ulang lampiran dokumen jika foto sebelumnya kurang jelas.</li>
                    <li>Setelah diperbaiki, kirim ulang berkas tersebut agar dapat diperiksa kembali oleh admin pusat.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Apa perbedaan fungsi antara Formulir SPOP dan Draft SPOP?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Pemahaman akan kedua menu ini penting agar tidak terjadi pengisian data ganda:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Menu <strong>Formulir SPOP</strong> hanya digunakan untuk membuat pengajuan yang benar-benar baru dari awal (kertas kosong).</li>
                    <li>Menu <strong>Draft SPOP</strong> digunakan sebagai tempat penyimpanan sementara.</li>
                    <li>Apabila saat mengisi Formulir SPOP isian belum terkirim dan Anda menutup aplikasi, maka isian tersebut akan otomatis tersimpan di dalam menu Draft SPOP.</li>
                    <li>Menu Draft SPOP juga berisi berkas-berkas yang ditolak oleh pusat, sehingga perbaikan cukup dilakukan pada draf tersebut tanpa perlu membuat pengajuan baru dari awal di menu Formulir SPOP.</li>
                  </ol>
                </div>
              </details>
              <details className="group cursor-pointer">
                <summary className="font-bold text-primary flex items-center justify-between text-sm sm:text-base">
                  <span>Bagaimana prosedur Login, Logout, dan mengubah profil akun?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2 pl-3 border-l-2 border-primary/20 leading-relaxed space-y-2">
                  <span>Prosedur untuk mengakses sistem, keluar, dan mengatur profil akun adalah sebagai berikut:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li><strong>Login:</strong> Buka halaman aplikasi, masukkan Username dan Kata Sandi yang telah diberikan oleh pihak kecamatan/kabupaten, lalu klik tombol "Masuk".</li>
                    <li><strong>Ubah Profil:</strong> Buka menu "Profil Akun" di bagian paling bawah panel navigasi sebelah kiri. Anda dapat melengkapi informasi pendukung seperti Nomor Induk Pegawai (NIP).</li>
                    <li><strong>Ubah Kata Sandi:</strong> Sangat disarankan untuk segera mengubah kata sandi dari admin pusat dengan memasukkan kata sandi baru pada menu ini, lalu klik "Simpan Perubahan".</li>
                    <li><strong>Logout:</strong> Jangan lupa untuk selalu keluar dari sistem dengan aman melalui tombol "Keluar" (Log Out) yang terletak di ujung bawah layar.</li>
                  </ol>
                </div>
              </details>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('desa'); 
  const navigate = useNavigate();
  const location = useLocation();

  // Cek sesi saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setIsAuthenticated(true);
      setRole(user.role.toLowerCase());
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    navigate(userRole === 'bakeuda' ? '/dashboard-admin' : '/dashboard-desa');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setRole('desa');
    navigate('/');
  };

  // Get active page title based on current path
  const currentPath = location.pathname;
  let activePageTitle = 'SIPD Purbalingga';
  for (const [path, title] of Object.entries(pageTitles)) {
    if (currentPath.startsWith(path)) {
      activePageTitle = title;
      break;
    }
  }

  // Jika belum login, tampilkan halaman Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <SpopProvider>
      <AppLayout
        role={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          navigate(newRole === 'bakeuda' ? '/dashboard-admin' : '/dashboard-desa');
        }}
        handleLogout={handleLogout}
        activePageTitle={activePageTitle}
      >
        <Routes>
          <Route path="/dashboard-desa" element={<DashboardDesa />} />
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/manajemen-akun-desa" element={<ManajemenAkunDesa />} />
          <Route path="/manajemen-wilayah" element={<ManajemenWilayah />} />
          
          {/* NEW MODULAR SPOP ROUTES */}
          <Route path="/spop" element={<SpopLayout />}>
          <Route index element={<Navigate to="informasi-umum" />} />
          <Route path="detail/:id_transaksi?" element={<SpopDetail />} />
          <Route path="informasi-umum/:id_transaksi?" element={<Step1InformasiUmum />} />
          <Route path="subjek-pajak/:id_transaksi?" element={<Step2SubjekPajak />} />
          <Route path="objek-pajak/:id_transaksi?" element={<Step3ObjekPajak />} />
          <Route path="data-bangunan/:id_transaksi?" element={<Step4DataBangunan />} />
          <Route path="konfirmasi/:id_transaksi?" element={<Step4Konfirmasi />} />
          <Route path="status/:id_transaksi?" element={<Step5Status />} />
        </Route>
        
        <Route path="/draft-spop" element={<DraftSPOP />} />
        <Route path="/antrean-verifikasi" element={<AntreanVerifikasi />} />
        <Route path="/detail-review/:id?" element={<DetailReviewSPOP />} />
        <Route path="/riwayat-persetujuan" element={<RiwayatPersetujuan />} />
        <Route path="/daftar-objek" element={<DaftarObjekPajak />} />
        <Route path="/daftar-subjek" element={<DaftarSubjekPajak />} />
        <Route path="/detail-subjek" element={<DetailSubjekPajak />} />
        <Route path="/monitoring-pajak" element={<MonitoringObjekPajak />} />
        <Route path="/pelacakan-dokumen/:id" element={<PelacakanDokumen />} />
        <Route path="/profil" element={<ProfilPengguna role={role} />} />
        <Route path="/help" element={<HelpPage role={role} />} />
        <Route path="*" element={<Navigate to={role === 'bakeuda' ? '/dashboard-admin' : '/dashboard-desa'} />} />
      </Routes>
      </AppLayout>
    </SpopProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
