import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';
import wilayahData from '../utils/wilayahData.json';

export default function AntreanVerifikasi({ onNavigate }) {
  const [kecamatan, setKecamatan] = useState('Semua Kecamatan');
  const [kelurahan, setKelurahan] = useState('Semua Desa');
  const [search, setSearch] = useState('');

  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (kecamatan === 'Semua Kecamatan') {
      const uniqueKel = [...new Set(wilayahData.map(w => w.nama_desa))].filter(Boolean).sort();
      setKelurahanList(uniqueKel);
    } else {
      const filteredKel = wilayahData
        .filter(w => w.kecamatan === kecamatan)
        .map(w => w.nama_desa)
        .filter(Boolean)
        .sort();
      setKelurahanList(filteredKel);
    }
    setKelurahan('Semua Desa');
  }, [kecamatan]);

  useEffect(() => {
    const fetchKecamatan = async () => {
      const uniqueKec = [...new Set(wilayahData.map(w => w.kecamatan))].filter(Boolean).sort();
      setKecamatanList(uniqueKec);
    };
    fetchKecamatan();

    const fetchQueue = async () => {
      try {
        const res = await api.get('/transaksi-spop?status=MENUNGGU');
        const formatted = res.data.data.map(item => {
          const nopRaw = item.detail_tujuan[0]?.nop_generated || item.detail_tujuan[0]?.no_persil_baru || '..................';
          const parts = nopRaw.replace(/\D/g, '');
          const prov = parts.substring(0,2) || '33';
          const kab = parts.substring(2,4) || '03';
          const kec = parts.substring(4,7) || '000';
          const kel = parts.substring(7,10) || '000';

          const nopFormatted = `${prov}.${kab}.${kec}.${kel}.000-0000.0`;

          return {
            id: item.id_transaksi,
            nop: nopFormatted,
            name: item.nama_pengaju || 'Tanpa Nama',
            userId: item.pengaju?.nama_lengkap ? `Pengaju: ${item.pengaju.nama_lengkap}` : '-',
            address: item.detail_tujuan[0]?.jenis_tanah_baru || '-',
            rtRw: '',
            kelurahan: 'Purbalingga',
            kecamatan: 'Purbalingga',
            date: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(item.tanggal_pengajuan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            status: 'Menunggu Verifikasi',
            urgent: false
          };
        });
        
        // --- ADD DUMMY DATA FOR UI TESTING IF EMPTY ---
        if (formatted.length === 0) {
          formatted.push(
            {
              id: 'dummy-1',
              nop: '33.03.010.001.000-0000.0',
              name: 'Budi Santoso',
              userId: 'Pengaju: Budi Santoso',
              address: 'Tanah Darat',
              rtRw: 'RT 01 / RW 02',
              kelurahan: 'Kemangkon',
              kecamatan: 'Kemangkon',
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '10:30 WIB',
              status: 'Menunggu Verifikasi',
              urgent: true
            },
            {
              id: 'dummy-2',
              nop: '33.03.020.010.000-0000.0',
              name: 'Siti Aminah',
              userId: 'Pengaju: Siti Aminah',
              address: 'Tanah Sawah',
              rtRw: 'RT 03 / RW 01',
              kelurahan: 'Penaruban',
              kecamatan: 'Bukateja',
              date: new Date(Date.now() - 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '14:15 WIB',
              status: 'Menunggu Verifikasi',
              urgent: false
            },
            {
              id: 'dummy-3',
              nop: '33.03.080.010.000-0000.0',
              name: 'CV. Maju Jaya',
              userId: 'Pengaju: Ahmad Dahlan',
              address: 'Tanah Bangunan Usaha',
              rtRw: 'RT 05 / RW 04',
              kelurahan: 'Mrebet',
              kecamatan: 'Mrebet',
              date: new Date(Date.now() - 172800000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '09:00 WIB',
              status: 'Menunggu Verifikasi',
              urgent: false
            },
            {
              id: 'dummy-4',
              nop: '33.03.070.005.000-0000.0',
              name: 'Agus Setiawan',
              userId: 'Pengaju: Agus Setiawan',
              address: 'Tanah Darat',
              rtRw: 'RT 02 / RW 01',
              kelurahan: 'Kutasari',
              kecamatan: 'Kutasari',
              date: new Date(Date.now() - 259200000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '11:20 WIB',
              status: 'Menunggu Verifikasi',
              urgent: false
            }
          );
        }
        // ----------------------------------------------

        setQueueData(formatted);
      } catch (error) {
        console.error("Gagal mengambil antrean:", error);
        
        // --- FALLBACK TO DUMMY DATA ON ERROR ---
        setQueueData([
            {
              id: 'dummy-1',
              nop: '33.03.010.001.000-0000.0',
              name: 'Budi Santoso',
              userId: 'Pengaju: Budi Santoso',
              address: 'Tanah Darat',
              rtRw: 'RT 01 / RW 02',
              kelurahan: 'Kemangkon',
              kecamatan: 'Kemangkon',
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '10:30 WIB',
              status: 'Menunggu Verifikasi',
              urgent: true
            },
            {
              id: 'dummy-2',
              nop: '33.03.020.010.000-0000.0',
              name: 'Siti Aminah',
              userId: 'Pengaju: Siti Aminah',
              address: 'Tanah Sawah',
              rtRw: 'RT 03 / RW 01',
              kelurahan: 'Penaruban',
              kecamatan: 'Bukateja',
              date: new Date(Date.now() - 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '14:15 WIB',
              status: 'Menunggu Verifikasi',
              urgent: false
            },
            {
              id: 'dummy-3',
              nop: '33.03.080.010.000-0000.0',
              name: 'CV. Maju Jaya',
              userId: 'Pengaju: Ahmad Dahlan',
              address: 'Tanah Bangunan Usaha',
              rtRw: 'RT 05 / RW 04',
              kelurahan: 'Mrebet',
              kecamatan: 'Mrebet',
              date: new Date(Date.now() - 172800000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '09:00 WIB',
              status: 'Menunggu Verifikasi',
              urgent: false
            },
            {
              id: 'dummy-4',
              nop: '33.03.070.005.000-0000.0',
              name: 'Agus Setiawan',
              userId: 'Pengaju: Agus Setiawan',
              address: 'Tanah Darat',
              rtRw: 'RT 02 / RW 01',
              kelurahan: 'Kutasari',
              kecamatan: 'Kutasari',
              date: new Date(Date.now() - 259200000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: '11:20 WIB',
              status: 'Menunggu Verifikasi',
              urgent: false
            }
        ]);
        // ----------------------------------------------
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const filteredData = queueData.filter((item) => {
    const matchesKec = kecamatan === 'Semua Kecamatan' || item.kecamatan === kecamatan;
    const matchesKel = kelurahan === 'Semua Desa' || item.kelurahan === kelurahan;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.address.toLowerCase().includes(search.toLowerCase());
    return matchesKec && matchesKel && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="p-gutter overflow-y-auto max-w-screen-2xl mx-auto w-full">
      {/* Breadcrumbs & Header */}
      <div className="mb-section-gap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl text-primary font-bold">Daftar Antrean Validasi SPOP</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Daftar tunggu verifikasi dan validasi dokumen SPOP PBB-P2
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-sm text-label-sm flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
              {filteredData.length} Menunggu Verifikasi
            </span>
          </div>
        </div>
      </div>


      {/* Filters & Search */}
      <section className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Kecamatan
            </label>
            <select
              value={kecamatan}
              onChange={(e) => setKecamatan(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
            >
              <option value="Semua Kecamatan">Semua Kecamatan</option>
              {kecamatanList.map(kec => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Kelurahan/Desa
            </label>
            <select
              value={kelurahan}
              onChange={(e) => setKelurahan(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
            >
              <option value="Semua Desa">Semua Desa</option>
              {kelurahanList.map(kel => (
                <option key={kel} value={kel}>{kel}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Cari NOP/Subjek Pajak
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                placeholder="Masukkan NOP atau Nama..."
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
            </div>
          </div>
          <div className="lg:col-span-2 flex items-end">
            <button
              onClick={() => {
                setKecamatan('Semua Kecamatan');
                setKelurahan('Semua Desa');
                setSearch('');
              }}
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Data Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">NOP</th>
                <th className="px-6 py-3 font-semibold">Subjek Pajak</th>
                <th className="px-6 py-3 font-semibold">Alamat Objek</th>
                <th className="px-6 py-3 font-semibold">Desa/Kelurahan</th>
                <th className="px-6 py-3 font-semibold">Tanggal Kirim</th>
                <th className="px-6 py-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    Memuat antrean...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.urgent
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-bold text-gray-800">
                        {item.nop}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-[12px] text-gray-500">{item.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{item.address}</p>
                      <p className="text-[12px] text-gray-500">{item.rtRw}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{item.kelurahan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-gray-900 ${item.urgent ? 'font-bold' : ''}`}>{item.date}</p>
                      <p className={`text-[12px] ${item.urgent ? 'text-red-600' : 'text-gray-500'}`}>{item.time}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onNavigate('detail_review', { id: item.id })}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all mx-auto shadow-sm ${
                          item.urgent
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-on-surface-variant">
                    Tidak ada antrean verifikasi yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="font-semibold whitespace-nowrap">Tampilkan:</label>
                <div className="relative">
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ backgroundImage: 'none' }}
                    className="pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-gray-700 font-bold text-sm shadow-sm outline-none appearance-none cursor-pointer"
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
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <div>
                Menampilkan <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari <span className="font-bold text-gray-900">{filteredData.length}</span> entri
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
