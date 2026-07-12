import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import StatusBadge from '../components/StatusBadge';

export default function DaftarObjekPajak({ onNavigate }) {
  const [kecamatan, setKecamatan] = useState('Semua Kecamatan');
  const [statusVerif, setStatusVerif] = useState('Semua Status');
  const [search, setSearch] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // States untuk Popup (Modal) & Notifikasi (Toast)
  const [selectedObject, setSelectedObject] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const [objects, setObjects] = useState([
    { nop: '33.03.010.001.015.0042.0', name: 'H. Ahmad Dahlan', address: 'Jl. Jend. Sudirman No. 45, Purbalingga Kidul', land: 450, building: 120, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.010.001.015.0043.1', name: 'Siti Aminah', address: 'Perum Griya Abdi Karya Blok C-12, Purbalingga', land: 112, building: 45, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.020.005.001.0089.0', name: 'PT. Makmur Sentosa', address: 'Kawasan Industri Kalimanah No. 8', land: 2500, building: 1850, status: 'Aktif', kecamatan: 'Kalimanah' },
    { nop: '33.03.010.001.015.0045.0', name: 'Bambang Wijaya', address: 'Jl. Letjen Parman No. 2, Bancar', land: 200, building: 180, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.010.001.015.0048.0', name: 'Sri Wahyuni', address: 'Perumahan Bojong Residance, Purbalingga Lor', land: 90, building: 36, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.010.001.015.0051.0', name: 'Budi Santoso', address: 'Jl. Ahmad Yani No. 10, Kandanggampang', land: 150, building: 80, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.010.001.015.0052.0', name: 'Sutarjo', address: 'Perum Griya Abdi Karya Blok A-1, Purbalingga', land: 105, building: 45, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.020.005.001.0090.0', name: 'CV. Bintang Terang', address: 'Kawasan Industri Kalimanah No. 12', land: 1200, building: 800, status: 'Aktif', kecamatan: 'Kalimanah' },
    { nop: '33.03.020.005.001.0091.0', name: 'Indah Pertiwi', address: 'Jl. Mayjen Sungkono No. 44, Kalimanah', land: 300, building: 150, status: 'Aktif', kecamatan: 'Kalimanah' },
    { nop: '33.03.010.001.015.0053.0', name: 'Agus Setiawan', address: 'Jl. Letjen Parman No. 8, Bancar', land: 250, building: 100, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.010.001.015.0054.0', name: 'Rina Herawati', address: 'Perumahan Bojong Residance Blok B-2', land: 90, building: 36, status: 'Aktif', kecamatan: 'Purbalingga' },
    { nop: '33.03.010.001.015.0055.0', name: 'PT. Maju Bersama', address: 'Jl. S. Parman No. 99, Kedungmenjangan', land: 5000, building: 3500, status: 'Aktif', kecamatan: 'Purbalingga' },
  ]);

  const filteredObjects = objects.filter((obj) => {
    const matchesKec = kecamatan === 'Semua Kecamatan' || obj.kecamatan === kecamatan;
    const matchesStatus =
      statusVerif === 'Semua Status' ||
      (statusVerif === 'Aktif' && obj.status === 'Aktif') ||
      (statusVerif === 'Nonaktif' && obj.status === 'Nonaktif');
    const matchesSearch =
      obj.name.toLowerCase().includes(search.toLowerCase()) ||
      obj.nop.includes(search) ||
      obj.address.toLowerCase().includes(search.toLowerCase());
    return matchesKec && matchesStatus && matchesSearch;
  });

  // Pagination Logic
  const totalItems = filteredObjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedObjects = filteredObjects.slice(startIndex, endIndex);

  const handleExportExcel = () => {
    showToast('Sedang memproses file Excel...', 'success');
    
    const dataToExport = objects.map((obj, index) => ({
      'No': index + 1,
      'NOP': obj.nop,
      'Subjek Pajak (Pemilik)': obj.name,
      'Alamat Objek Pajak': obj.address,
      'Kecamatan': obj.kecamatan,
      'Luas Tanah (m²)': obj.land,
      'Luas Bangunan (m²)': obj.building,
      'Status': obj.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    const wscols = [
      {wch: 5}, {wch: 28}, {wch: 25}, {wch: 40}, {wch: 15}, {wch: 18}, {wch: 20}, {wch: 12}
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Objek Pajak");

    XLSX.writeFile(workbook, 'Laporan_Daftar_Objek_Pajak.xlsx');
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    showToast('Sedang merender dokumen PDF...', 'success');
    
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(16);
    doc.text('Laporan Daftar Objek Pajak (PBB)', 14, 15);
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

    const tableColumn = ["No", "NOP", "Nama Pemilik", "Alamat Objek", "Luas Tanah", "Luas Bangunan", "Status"];
    const tableRows = [];

    objects.forEach((obj, index) => {
      tableRows.push([
        index + 1,
        obj.nop,
        obj.name,
        obj.address,
        `${obj.land.toLocaleString()} m²`,
        `${obj.building.toLocaleString()} m²`,
        obj.status
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      headStyles: { fillColor: [4, 99, 58] }, // SIPD Green color
      styles: { fontSize: 9 },
    });

    doc.save('Laporan_Daftar_Objek_Pajak.pdf');
    setShowExportMenu(false);
  };

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-primary font-bold text-3xl">Daftar Objek Pajak</h2>
          <p className="text-on-surface-variant max-w-2xl mt-1 text-sm md:text-base">
            Kelola dan monitor seluruh data objek pajak di wilayah Kabupaten Purbalingga secara real-time dan terintegrasi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-outline rounded-lg text-primary font-label-sm hover:bg-surface-container-low transition-colors shadow-sm focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Data
            </button>
            
            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl z-50 overflow-hidden">
                <button 
                  onClick={handleExportExcel}
                  className="w-full text-left px-4 py-3 hover:bg-surface-container-low flex items-center gap-3 text-sm font-bold text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-green-600 text-[18px]">table_chart</span>
                  Export Excel (.xlsx)
                </button>
                <div className="w-full h-px bg-outline-variant/50"></div>
                <button 
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-3 hover:bg-surface-container-low flex items-center gap-3 text-sm font-bold text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-red-500 text-[18px]">picture_as_pdf</span>
                  Export PDF (.pdf)
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={() => onNavigate && onNavigate('formulir_spop')}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-sm hover:shadow-lg transition-all active:scale-95 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Objek Pajak
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Objek Pajak</p>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                domain
              </span>
            </div>
          </div>
          <p className="text-3xl font-display-md text-on-surface font-black">45,920</p>
          <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Bertambah +123 dari bulan lalu
          </p>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Status Aktif</p>
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
          </div>
          <p className="text-3xl font-display-md text-on-surface font-black">45,105</p>
          <p className="text-xs text-on-surface-variant mt-2">
            Objek pajak tertagih
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Nonaktif</p>
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                visibility_off
              </span>
            </div>
          </div>
          <p className="text-3xl font-display-md text-on-surface font-black">815</p>
          <p className="text-xs text-on-surface-variant mt-2">
            Dalam proses pemecahan/penggabungan
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
              placeholder="Ketik kata kunci..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
              Kecamatan
            </label>
            <select
              value={kecamatan}
              onChange={(e) => setKecamatan(e.target.value)}
              className="w-full bg-background border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
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
              className="w-full bg-background border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
            >
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
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
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm flex flex-col w-full overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">NOP</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Subjek Pajak</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Alamat Objek</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap text-center">Tanah (m²)</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap text-center">Bgn (m²)</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {paginatedObjects.length > 0 ? (
                paginatedObjects.map((obj, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-surface-container-low transition-colors ${
                      i % 2 === 1 ? 'bg-surface-container-low/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-data-mono text-primary font-bold whitespace-nowrap text-sm">
                      {obj.nop}
                    </td>
                    <td className="px-4 py-3 font-label-md font-bold text-on-background whitespace-nowrap">{obj.name}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant leading-relaxed whitespace-nowrap">
                      {obj.address}
                    </td>
                    <td className="px-4 py-3 text-center font-data-mono font-medium text-sm">
                      {obj.land.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center font-data-mono font-medium text-sm">
                      {obj.building.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={obj.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedObject(obj)}
                        className="px-3 py-1.5 bg-primary/10 text-primary-dark border border-primary/20 hover:border-primary hover:bg-primary/20 rounded-lg transition-all font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-on-surface-variant font-medium">
                    Tidak ada objek pajak yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low/20">
          <div className="flex items-center gap-4 text-sm text-on-surface-variant w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Tampilkan</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-background border border-outline-variant rounded-md py-1 pl-3 pr-8 text-sm focus:ring-primary focus:border-primary font-bold text-on-surface cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="hidden sm:inline">data per halaman</span>
            </div>
            <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
            <div>
              Menampilkan <span className="font-bold text-on-surface">{totalItems === 0 ? 0 : startIndex + 1} - {endIndex}</span> dari{' '}
              <span className="font-bold text-on-surface">{totalItems}</span> data
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalItems === 0}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="px-4 font-bold text-sm text-on-surface">
              Halaman {currentPage} / {totalPages > 0 ? totalPages : 1}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalItems === 0}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-outline hover:bg-surface hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toast.show && createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in-up">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm ${
            toast.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
          }`}>
            <span className="material-symbols-outlined">
              {toast.type === 'error' ? 'picture_as_pdf' : 'check_circle'}
            </span>
            {toast.message}
          </div>
        </div>,
        document.body
      )}

      {/* Detail Modal Popup */}
      {selectedObject && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-scrim/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-outline-variant bg-surface-container-low/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">real_estate_agent</span>
                </div>
                <div>
                  <h3 className="font-display-sm text-on-surface font-black text-xl leading-tight">Detail Objek Pajak</h3>
                  <p className="text-sm font-data-mono text-primary font-bold mt-1">NOP: {selectedObject.nop}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedObject(null)}
                className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Subjek Pajak (Pemilik)</p>
                  <p className="text-base font-bold text-on-surface">{selectedObject.name}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Status Pajak</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedObject.status} />
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Alamat Objek Pajak</p>
                <p className="text-sm text-on-surface leading-relaxed">{selectedObject.address}</p>
                <p className="text-xs text-primary font-bold mt-2">Kec. {selectedObject.kecamatan}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-primary mb-2">landscape</span>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Luas Tanah</p>
                  <p className="text-lg font-data-mono font-bold text-on-surface mt-1">{selectedObject.land.toLocaleString()} m²</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-secondary mb-2">home_work</span>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Luas Bangunan</p>
                  <p className="text-lg font-data-mono font-bold text-on-surface mt-1">{selectedObject.building.toLocaleString()} m²</p>
                </div>
              </div>
            </div>

            {/* Modal Footer (Aksi Lanjutan) */}
            <div className="p-5 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    showToast('Sedang mencetak Salinan SPPT...');
                    setSelectedObject(null);
                  }}
                  disabled={selectedObject.status === 'Nonaktif'}
                  className="px-4 py-2 bg-surface-container-high border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title={selectedObject.status === 'Nonaktif' ? "Objek Nonaktif tidak bisa dicetak SPPT" : "Cetak Tagihan Pajak"}
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Cetak SPPT
                </button>
                <button 
                  onClick={() => {
                    onNavigate && onNavigate('formulir_spop');
                    setSelectedObject(null);
                  }}
                  disabled={selectedObject.status === 'Nonaktif'}
                  className="px-4 py-2 bg-primary/10 text-primary-dark font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_document</span>
                  Ajukan Perubahan
                </button>
              </div>
              
              <button 
                onClick={() => setSelectedObject(null)}
                className="px-6 py-2 bg-surface-container-highest text-on-surface font-bold rounded-lg hover:bg-outline-variant/30 transition-colors text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
