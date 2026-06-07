import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';

export default function MonitoringObjekPajak() {
  const [kecamatan, setKecamatan] = useState('Semua Kecamatan');
  const [statusVerif, setStatusVerif] = useState('Semua Status');
  const [search, setSearch] = useState('');

  const [submissions, setSubmissions] = useState([
    {
      nop: '33.03.010.001.015.0042.0',
      name: 'H. Ahmad Dahlan',
      address: 'Jl. Jend. Sudirman No. 45, Purbalingga Kidul',
      land: 450,
      building: 120,
      status: 'Disetujui',
      kecamatan: 'Purbalingga',
    },
    {
      nop: '33.03.010.001.015.0043.1',
      name: 'Siti Aminah',
      address: 'Perum Griya Abdi Karya Blok C-12, Purbalingga',
      land: 112,
      building: 45,
      status: 'Draft',
      kecamatan: 'Purbalingga',
    },
    {
      nop: '33.03.020.005.001.0089.0',
      name: 'PT. Makmur Sentosa',
      address: 'Kawasan Industri Kalimanah No. 8',
      land: 2500,
      building: 1850,
      status: 'Perlu Revisi',
      kecamatan: 'Kalimanah',
    },
    {
      nop: '33.03.010.001.015.0045.0',
      name: 'Bambang Wijaya',
      address: 'Jl. Letjen Parman No. 2, Bancar',
      land: 200,
      building: 180,
      status: 'Menunggu Validasi',
      kecamatan: 'Purbalingga',
    },
    {
      nop: '33.03.010.001.015.0048.0',
      name: 'Sri Wahyuni',
      address: 'Perumahan Bojong Residance, Purbalingga Lor',
      land: 90,
      building: 36,
      status: 'Disetujui',
      kecamatan: 'Purbalingga',
    },
  ]);

  const filteredSubmissions = submissions.filter((obj) => {
    const matchesKec = kecamatan === 'Semua Kecamatan' || obj.kecamatan === kecamatan;
    const matchesStatus =
      statusVerif === 'Semua Status' ||
      obj.status.toLowerCase().includes(statusVerif.toLowerCase()) ||
      (statusVerif === 'Menunggu Validasi' && obj.status === 'Menunggu Validasi');
    const matchesSearch =
      obj.name.toLowerCase().includes(search.toLowerCase()) ||
      obj.nop.includes(search) ||
      obj.address.toLowerCase().includes(search.toLowerCase());
    return matchesKec && matchesStatus && matchesSearch;
  });

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display-lg text-primary font-bold text-3xl">Monitoring Objek Pajak Desa</h2>
          <p className="text-on-surface-variant max-w-2xl mt-1 text-sm md:text-base">
            Pantau status pengajuan dan validasi data objek pajak (SPOP/LSPOP) untuk wilayah desa Anda.
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
              Cari Nama/NOP/Alamat
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
              placeholder="Masukkan kata kunci..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
              Kecamatan
            </label>
            <select
              value={kecamatan}
              onChange={(e) => setKecamatan(e.target.value)}
              className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
            >
              <option>Semua Kecamatan</option>
              <option>Purbalingga</option>
              <option>Kalimanah</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
              Status Verifikasi
            </label>
            <select
              value={statusVerif}
              onChange={(e) => setStatusVerif(e.target.value)}
              className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
            >
              <option>Semua Status</option>
              <option>Menunggu Validasi</option>
              <option>Disetujui</option>
              <option>Perlu Revisi</option>
              <option>Draft</option>
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              onClick={() => {
                setSearch('');
                setKecamatan('Semua Kecamatan');
                setStatusVerif('Semua Status');
              }}
              className="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 text-primary font-label-sm hover:bg-surface-container-highest transition-colors font-semibold focus:outline-none"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-on-primary font-section-header">
                <th className="px-6 py-4 uppercase text-[12px] tracking-widest border-b border-primary/20">NOP</th>
                <th className="px-6 py-4 uppercase text-[12px] tracking-widest border-b border-primary/20">Subjek Pajak</th>
                <th className="px-6 py-4 uppercase text-[12px] tracking-widest border-b border-primary/20">Alamat Objek</th>
                <th className="px-6 py-4 uppercase text-[12px] tracking-widest border-b border-primary/20 text-center">Tanah (m²)</th>
                <th className="px-6 py-4 uppercase text-[12px] tracking-widest border-b border-primary/20 text-center">Bgn (m²)</th>
                <th className="px-6 py-4 uppercase text-[12px] tracking-widest border-b border-primary/20">Status</th>
                <th className="px-6 py-4 uppercase text-[12px] tracking-widest border-b border-primary/20 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((obj, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-surface-container-low transition-colors ${
                      i % 2 === 1 ? 'bg-surface-container-low/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-data-mono text-primary font-bold whitespace-nowrap">
                      {obj.nop}
                    </td>
                    <td className="px-6 py-4 font-label-sm text-on-background">{obj.name}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant leading-relaxed max-w-xs truncate md:max-w-none">
                      {obj.address}
                    </td>
                    <td className="px-6 py-4 text-center font-data-mono font-medium">
                      {obj.land.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-data-mono font-medium">
                      {obj.building.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={obj.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Review pengajuan NOP: ${obj.nop}`)}
                          className="p-1.5 text-outline hover:text-primary hover:bg-primary-fixed rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-on-surface-variant">
                    Tidak ada data pengajuan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low/20">
          <div className="text-sm text-on-surface-variant">
            Menampilkan <span className="font-bold text-on-surface">1 - {filteredSubmissions.length}</span> dari{' '}
            <span className="font-bold text-on-surface">{filteredSubmissions.length}</span> data pengajuan
          </div>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface hover:text-primary transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold shadow-sm">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface hover:text-primary transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              domain
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Total Pengajuan</p>
            <p className="text-2xl font-display-lg text-primary font-bold">45,920</p>
          </div>
        </div>
        <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Disetujui</p>
            <p className="text-2xl font-display-lg text-secondary font-bold">42,105</p>
          </div>
        </div>
        <div className="bg-error/5 border border-error/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error flex items-center justify-center text-on-error shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              assignment_late
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-error uppercase tracking-widest">Perlu Revisi</p>
            <p className="text-2xl font-display-lg text-error font-bold">3,815</p>
          </div>
        </div>
      </div>
    </main>
  );
}
