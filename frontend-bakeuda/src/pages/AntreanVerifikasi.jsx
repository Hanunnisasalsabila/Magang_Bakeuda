import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import api from '../utils/axios';

export default function AntreanVerifikasi({ onNavigate }) {
  const [kecamatan, setKecamatan] = useState('Semua Kecamatan');
  const [kelurahan, setKelurahan] = useState('Semua Desa');
  const [search, setSearch] = useState('');

  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

          return {
            id: item.id_transaksi,
            nop: { prov, kab, kec, kel },
            name: item.nama_pengaju || 'Tanpa Nama',
            userId: item.pengaju?.nama_lengkap ? `Pengaju: ${item.pengaju.nama_lengkap}` : '-',
            address: item.detail_tujuan[0]?.jenis_tanah_baru || '-',
            rtRw: '',
            kelurahan: 'Purbalingga',
            kecamatan: 'Purbalingga',
            date: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(item.tanggal_pengajuan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            status: 'Verifikasi',
            urgent: false
          };
        });
        setQueueData(formatted);
      } catch (error) {
        console.error("Gagal mengambil antrean:", error);
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

  return (
    <main className="p-gutter overflow-y-auto max-w-screen-2xl mx-auto w-full">
      {/* Breadcrumbs & Header */}
      <div className="mb-section-gap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant/70">Admin</span>
              <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
              <span className="font-label-sm text-label-sm text-primary font-bold">Verification Queue</span>
            </nav>
            <h2 className="font-display-lg text-display-lg text-primary font-bold">Verification Queue</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Antrean validasi dokumen SPOP (Surat Pemberitahuan Objek Pajak)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-sm text-label-sm flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
              {filteredData.length} Menunggu Validasi
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bar (Quick Look) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-stack-md">
        <div className="bg-surface-container-lowest p-4 border border-outline-variant rounded-xl shadow-sm">
          <p className="text-on-surface-variant font-label-sm text-label-sm font-semibold">Goal Hari Ini</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-md text-headline-md text-primary font-black">24/40</span>
            <span className="text-secondary font-label-sm text-label-sm font-bold">60%</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-secondary h-full rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <section className="bg-surface-container-low p-gutter rounded-xl border border-outline-variant mb-gutter shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3">
            <label className="block font-section-header text-section-header text-on-surface-variant uppercase mb-2">
              Kecamatan
            </label>
            <select
              value={kecamatan}
              onChange={(e) => setKecamatan(e.target.value)}
              className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-primary focus:border-primary"
            >
              <option>Semua Kecamatan</option>
              <option>Purbalingga</option>
              <option>Kalimanah</option>
              <option>Kutasari</option>
              <option>Mrebet</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="block font-section-header text-section-header text-on-surface-variant uppercase mb-2">
              Kelurahan/Desa
            </label>
            <select
              value={kelurahan}
              onChange={(e) => setKelurahan(e.target.value)}
              className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-primary focus:border-primary"
            >
              <option>Semua Desa</option>
              <option>Purbalingga Lor</option>
              <option>Purbalingga Kidul</option>
              <option>Kandanggampang</option>
              <option>Kalimanah Wetan</option>
            </select>
          </div>
          <div className="lg:col-span-4">
            <label className="block font-section-header text-section-header text-on-surface-variant uppercase mb-2">
              Cari NOP/Subjek Pajak
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-primary focus:border-primary"
                placeholder="Masukkan NOP atau Nama..."
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
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
              className="w-full bg-primary text-on-primary py-3 px-6 rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Data Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-on-primary font-section-header text-section-header">
                <th className="px-6 py-4 uppercase tracking-wider">NOP</th>
                <th className="px-6 py-4 uppercase tracking-wider">Subjek Pajak</th>
                <th className="px-6 py-4 uppercase tracking-wider">Alamat Objek</th>
                <th className="px-6 py-4 uppercase tracking-wider">Desa/Kelurahan</th>
                <th className="px-6 py-4 uppercase tracking-wider">Tanggal Kirim</th>
                <th className="px-6 py-4 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-on-surface-variant">
                    Memuat antrean...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.urgent
                        ? 'bg-error-container/10 hover:bg-error-container/20'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-data-mono text-data-mono flex gap-1 items-center">
                        <span className={`px-1 py-0.5 rounded ${item.urgent ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{item.nop.prov}</span>
                        <span className={`px-1 py-0.5 rounded ${item.urgent ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{item.nop.kab}</span>
                        <span className={`px-1 py-0.5 rounded ${item.urgent ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{item.nop.kec}</span>
                        <span className={`px-1 py-0.5 rounded ${item.urgent ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{item.nop.kel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-label-sm text-label-sm text-primary font-bold">{item.name}</p>
                      <p className="text-[12px] text-on-surface-variant font-medium">{item.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body-md text-body-md text-on-surface">{item.address}</p>
                      <p className="text-[12px] text-on-surface-variant font-medium">{item.rtRw}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-body-md text-body-md text-on-surface">{item.kelurahan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-body-md text-body-md ${item.urgent ? 'text-error font-bold' : 'text-on-surface'}`}>{item.date}</p>
                      <p className={`text-[12px] ${item.urgent ? 'text-error font-medium' : 'text-on-surface-variant'}`}>{item.time}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onNavigate('detail_review', { id: item.id })}
                        className={`px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-2 mx-auto ${
                          item.urgent
                            ? 'bg-error text-on-error hover:opacity-95'
                            : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {item.urgent ? 'priority_high' : 'rate_review'}
                        </span>
                        {item.urgent ? 'Urgent Review' : 'Review'}
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
        <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-t border-outline-variant">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Menampilkan <span className="font-bold text-on-surface">1 - {filteredData.length}</span> dari{' '}
            <span className="font-bold text-on-surface">{filteredData.length}</span> entri
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm font-bold">1</button>
            <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
