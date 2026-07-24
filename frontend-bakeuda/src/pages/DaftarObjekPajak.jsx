import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import StatusBadge from '../components/StatusBadge';
import { useSpop } from '../context/SpopContext';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function DaftarObjekPajak() {
  const navigate = useNavigate();
  const { loadDraft } = useSpop();
  const [statusVerif, setStatusVerif] = useState('Semua Status');
  const [search, setSearch] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // States untuk Popup (Modal) & Notifikasi (Toast)
  const [selectedObject, setSelectedObject] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [printModal, setPrintModal] = useState({ show: false, obj: null });
  const [printConfig, setPrintConfig] = useState({ namaPejabat: '', jabatan: 'Kepala Badan Keuangan Daerah', nip: '', nomorSurat: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const [stats, setStats] = useState({ total: 0, aktif: 0, nonaktif: 0 });
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, listRes] = await Promise.all([
          api.get('/objek-pajak/stats'),
          api.get('/objek-pajak')
        ]);

        setStats(statsRes.data.data);

        const formattedList = listRes.data.data.map(item => ({
          nop: item.nop,
          name: item.subjek_pajak?.nama_subjek || 'Tanpa Nama',
          address: item.jalan_op || '-',
          rt_rw: (item.rt_op || item.rw_op) ? `RT ${item.rt_op || '-'} / RW ${item.rw_op || '-'}` : '-',
          kecamatan: item.wilayah?.kecamatan || '-',
          kelurahan: item.wilayah?.nama_desa || '-',
          land: Number(item.luas_tanah || 0),
          building: Number(item.luas_bangunan || 0),
          njop: Number(item.total_njop || 0),
          status: item.status_aktif ? 'Aktif' : 'Nonaktif',
          jenis_tanah: item.jenis_tanah || '-',
          jumlah_bangunan: item.jumlah_bangunan || 0
        }));

        setObjects(formattedList);
      } catch (err) {
        console.error("Gagal memuat data objek pajak:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredObjects = objects.filter((obj) => {
    const matchesStatus =
      statusVerif === 'Semua Status' ||
      (statusVerif === 'Aktif' && obj.status === 'Aktif') ||
      (statusVerif === 'Nonaktif' && obj.status === 'Nonaktif');
    const matchesSearch =
      obj.name.toLowerCase().includes(search.toLowerCase()) ||
      obj.nop.includes(search) ||
      obj.address.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
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
      'Luas Tanah (m²)': obj.land,
      'Luas Bangunan (m²)': obj.building,
      'Status': obj.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const wscols = [
      { wch: 5 }, { wch: 28 }, { wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 18 }, { wch: 20 }, { wch: 12 }
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

    doc.save('Daftar_Objek_Pajak_Bakeuda.pdf');
    showToast('Berhasil mengekspor PDF');
  };

  const handleCetakSPPT = (obj) => {
    if (!obj) return;
    setPrintModal({ show: true, obj });
    setPrintConfig({ namaPejabat: '', jabatan: 'Kepala Badan Keuangan Daerah', nip: '', nomorSurat: '' });
  };

  const generatePDF = () => {
    const obj = printModal.obj;
    if (!obj) return;
    const { namaPejabat, nip, nomorSurat } = printConfig;
    const jabatan = 'Kepala Badan Keuangan Daerah';
    showToast('Sedang menyiapkan dokumen...');

    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageW = 210;
    const mL = 25;  // margin kiri
    const mR = 185; // margin kanan
    const cW = mR - mL; // lebar konten

    // ── KOP SURAT ────────────────────────────────────────────────
    const logoImg = new Image();
    logoImg.src = logoPurbalingga;
    doc.addImage(logoImg, 'PNG', mL, 8, 25, 25);

    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text('PEMERINTAH KABUPATEN PURBALINGGA', pageW / 2 + 5, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.text('BADAN KEUANGAN DAERAH', pageW / 2 + 5, 23, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.text('Jl. Let. Jend. S. Parman No.1, Purbalingga, Jawa Tengah 53311', pageW / 2 + 5, 29, { align: 'center' });
    doc.text('Telp. (0281) 891012  |  Fax. (0281) 891042  |  bakeuda.purbalinggakab.go.id', pageW / 2 + 5, 34, { align: 'center' });

    // Garis kop ganda (tebal + tipis)
    doc.setLineWidth(1.5);
    doc.line(mL, 38, mR, 38);
    doc.setLineWidth(0.5);
    doc.line(mL, 40, mR, 40);

    // ── JUDUL SURAT ──────────────────────────────────────────────
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('SURAT KETERANGAN', pageW / 2, 50, { align: 'center' });
    // Garis bawah judul (underline manual)
    const jW = doc.getTextWidth('SURAT KETERANGAN');
    doc.setLineWidth(0.5);
    doc.line(pageW / 2 - jW / 2, 51.5, pageW / 2 + jW / 2, 51.5);

    // Nomor surat
    doc.setFont('times', 'normal');
    doc.setFontSize(10.5);
    const tahun = new Date().getFullYear();
    const bulanRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
    const nomorDisplay = nomorSurat
      ? `NOMOR : 900.1 / ${nomorSurat} / BKD-PBB / ${bulanRomawi} / ${tahun}`
      : `NOMOR : 900.1 / ......... / BKD-PBB / ${bulanRomawi} / ${tahun}`;
    doc.text(nomorDisplay, pageW / 2, 57, { align: 'center' });

    // ── PARAGRAF PEMBUKA ─────────────────────────────────────────
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    const paraJabatan = jabatan || 'Kepala Badan Keuangan Daerah';
    const paraOpening = `Yang bertanda tangan di bawah ini, ${paraJabatan} Kabupaten Purbalingga, dengan ini menerangkan bahwa data Objek Pajak Bumi dan Bangunan Perdesaan dan Perkotaan (PBB-P2) adalah sebagai berikut :`;
    const openingLines = doc.splitTextToSize(paraOpening, cW);
    doc.text(openingLines, mL, 65);
    let y = 65 + openingLines.length * 6 + 4;

    // ── DATA FIELDS ───────────────────────────────────────────────
    const LBL_X = mL + 8;   // indent label
    const COL_X = mL + 58;  // posisi titik dua
    const VAL_X = mL + 62;  // posisi nilai
    const fs = 11;

    const drawField = (label, value, yPos) => {
      doc.setFont('times', 'normal');
      doc.setFontSize(fs);
      doc.text(label, LBL_X, yPos);
      doc.text(':', COL_X, yPos);
      // wrap nilai jika panjang
      const valLines = doc.splitTextToSize(value || '-', mR - VAL_X);
      doc.text(valLines, VAL_X, yPos);
      return yPos + valLines.length * 6.5;
    };

    y = drawField('Nama Wajib Pajak', obj.name || '-', y);
    y = drawField('No. Objek Pajak (NOP)', obj.nop, y);
    y = drawField('Luas Tanah / Bumi', `${obj.land.toLocaleString('id-ID')} m²`, y);
    y = drawField('Luas Bangunan', `${obj.building.toLocaleString('id-ID')} m²`, y);

    // Alamat (multi-baris)
    const alamatFull = [
      obj.address,
      obj.rt_rw && obj.rt_rw !== '-' ? obj.rt_rw : null,
      obj.kelurahan ? `Desa ${obj.kelurahan}` : null,
      obj.kecamatan ? `Kecamatan ${obj.kecamatan}` : null,
      'Kabupaten Purbalingga',
    ].filter(Boolean).join(', ');
    y = drawField('Alamat Objek Pajak', alamatFull, y);
    y = drawField('Status', obj.status, y);

    y += 3;

    // ── PARAGRAF BADAN ────────────────────────────────────────────
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    const paraBody = `Adalah benar bahwa Objek Pajak tersebut terdaftar dalam administrasi Pajak Bumi dan Bangunan Perdesaan dan Perkotaan (PBB-P2) pada Badan Keuangan Daerah Kabupaten Purbalingga dengan Nomor Objek Pajak (NOP) ${obj.nop} atas nama ${obj.name || '...'}.`;
    const bodyLines = doc.splitTextToSize(paraBody, cW);
    doc.text(bodyLines, mL, y);
    y += bodyLines.length * 6 + 5;

    // ── PARAGRAF PENUTUP ──────────────────────────────────────────
    const paraClose = 'Demikian surat keterangan ini dibuat dengan sebenarnya, dan untuk dapat digunakan sebagaimana mestinya.';
    const closeLines = doc.splitTextToSize(paraClose, cW);
    doc.text(closeLines, mL, y);
    y += closeLines.length * 6 + 8;

    // ── TANDA TANGAN ──────────────────────────────────────────────
    const tglStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.text(`Purbalingga, ${tglStr}`, mR, y, { align: 'right' });
    y += 5;
    doc.setFont('times', 'bold');
    doc.text(paraJabatan, mR, y, { align: 'right' });
    doc.text('Kabupaten Purbalingga,', mR, y + 5.5, { align: 'right' });

    y += 38;
    if (namaPejabat) {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text(namaPejabat, mR, y, { align: 'right' });
      // tidak ada garis bawah
    }
    if (nip) {
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.text(`NIP. ${nip}`, mR, y + 6, { align: 'right' });
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.text('NIP.', mR, y + 6, { align: 'right' });
    }

    // ── FOOTER ────────────────────────────────────────────────────
    doc.setLineWidth(0.4);
    doc.line(mL, 277, mR, 277);
    doc.setFont('times', 'italic');
    doc.setFontSize(7.5);
    doc.text(
      `Dicetak: ${new Date().toLocaleString('id-ID')}  |  Dokumen ini diterbitkan oleh Badan Keuangan Daerah (BKD) Kabupaten Purbalingga`,
      pageW / 2, 281, { align: 'center' }
    );

    doc.save(`SuratKeterangan_${obj.nop}.pdf`);
    showToast('Surat Keterangan berhasil diunduh');
    setPrintModal({ show: false, obj: null });
    setSelectedObject(null);
  };


  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl text-primary font-bold">Data Objek Pajak</h1>
          <p className="text-sm font-body-md text-on-surface-variant mt-1 max-w-2xl">
            Lihat seluruh daftar Objek Pajak Bumi dan Bangunan (PBB) yang tercatat di Kabupaten Purbalingga.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Data
            </button>

            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={handleExportExcel}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-green-600 text-[18px]">table_chart</span>
                  Export Excel (.xlsx)
                </button>
                <div className="w-full h-px bg-gray-100 my-1"></div>
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-red-500 text-[18px]">picture_as_pdf</span>
                  Export PDF (.pdf)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              loadDraft(null);
              navigate('/spop');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Objek Pajak
          </button>
        </div>
      </div>

      {/* Stats Overview (Clean Professional Design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pr-2 leading-relaxed">Semua Objek Pajak</p>
            <div className="p-1.5 rounded-full bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200/50 shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[14px] block">domain</span>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 leading-none">
            {stats.total.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-gray-500 font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">info</span>
            Seluruh objek yang tercatat di sistem
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pr-2 leading-relaxed">Pajak Aktif</p>
            <div className="p-1.5 rounded-full bg-green-50 text-green-600 ring-1 ring-inset ring-green-200/50 shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[14px] block">verified</span>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 leading-none">
            {stats.aktif.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-gray-500 font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">check_circle</span>
            Objek pajak yang saat ini aktif tertagih
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pr-2 leading-relaxed">Pajak Nonaktif</p>
            <div className="p-1.5 rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-200/50 shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[14px] block">visibility_off</span>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 leading-none">
            {stats.nonaktif.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-gray-500 font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">cancel</span>
            Objek pajak yang statusnya dinonaktifkan
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="space-y-1.5 flex-1 w-full">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Cari Nama/NOP/Alamat
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-background border border-outline-variant rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-primary focus:border-primary"
                  placeholder="Ketik kata kunci..."
                />
              </div>
            </div>
            <div className="space-y-1.5 w-full sm:w-[250px] shrink-0">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Status Verifikasi
              </label>
              <select
                value={statusVerif}
                onChange={(e) => setStatusVerif(e.target.value)}
                className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
              >
                <option>Semua Status</option>
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setStatusVerif('Semua Status');
            }}
            className="bg-white border border-gray-300 rounded-lg px-5 py-2 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors focus:outline-none shadow-sm flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Reset Filter
          </button>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm flex flex-col w-full overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider w-16 text-center">No</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">NOP</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Subjek Pajak</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Alamat Objek</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center whitespace-nowrap">Tanah (m²)</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center whitespace-nowrap">Bgn (m²)</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-bold border-b border-outline-variant text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-on-surface-variant">
                    <div className="flex justify-center items-center gap-2">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : paginatedObjects.length > 0 ? (
                paginatedObjects.map((obj, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-surface-container-low transition-colors ${i % 2 === 1 ? 'bg-surface-container-low/20' : ''
                      }`}
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-500 font-medium">
                      {startIndex + i + 1}
                    </td>
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
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <StatusBadge status={obj.status} />
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedObject(obj)}
                          title="Lihat Detail"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-background border border-outline-variant text-primary rounded-lg text-xs font-bold hover:bg-surface-container-lowest hover:border-primary transition-colors focus:outline-none mx-auto"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          Detail
                        </button>
                      </div>
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
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-4 text-sm text-on-surface-variant w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Tampilkan</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-on-surface cursor-pointer appearance-none"
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
                <option value={100}>100</option>
              </select>
              <span className="hidden sm:inline">data per halaman</span>
            </div>
            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
            <div>
              Menampilkan <span className="font-bold text-on-surface">{totalItems === 0 ? 0 : startIndex + 1} - {endIndex}</span> dari{' '}
              <span className="font-bold text-on-surface">{totalItems}</span> data
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalItems === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(5, totalPages > 0 ? totalPages : 1) }, (_, i) => {
              let pageNum = currentPage;
              const safeTotalPages = totalPages > 0 ? totalPages : 1;
              if (safeTotalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= safeTotalPages - 2) pageNum = safeTotalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${currentPage === pageNum
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalItems === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toast.show && createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in-up">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm ${toast.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
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
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">landscape</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Detail Objek Pajak</h3>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-4">
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <p className="text-gray-600 font-medium text-sm">NOP</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedObject.nop}</p>
                </div>
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <p className="text-gray-600 font-medium text-sm">Alamat</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {selectedObject.address}
                    {selectedObject.rt_rw !== '-' && <span> ({selectedObject.rt_rw})</span>}
                    {selectedObject.kelurahan && selectedObject.kelurahan !== '-' && <span> KEL. {selectedObject.kelurahan.toUpperCase()}</span>}
                    {selectedObject.kecamatan && selectedObject.kecamatan !== '-' && <span>, KEC. {selectedObject.kecamatan.toUpperCase()}</span>}
                  </p>
                </div>
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <p className="text-gray-600 font-medium text-sm">Jenis Tanah</p>
                  <p className="font-bold text-gray-900 text-sm capitalize">{selectedObject.jenis_tanah.replace(/_/g, ' ').toLowerCase()}</p>
                </div>
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <p className="text-gray-600 font-medium text-sm">Luas Tanah</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedObject.land.toLocaleString()} M²</p>
                </div>
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <p className="text-gray-600 font-medium text-sm">Luas Bangunan</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedObject.building.toLocaleString()} M²</p>
                </div>
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <p className="text-gray-600 font-medium text-sm">Jumlah Bangunan</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedObject.jumlah_bangunan} Unit</p>
                </div>
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <p className="text-gray-600 font-medium text-sm">Status Objek Pajak</p>
                  <div>
                    <StatusBadge status={selectedObject.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer (Aksi Lanjutan) */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                <button
                  onClick={() => handleCetakSPPT(selectedObject)}
                  disabled={selectedObject.status === 'Nonaktif'}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                  title={selectedObject.status === 'Nonaktif' ? "Objek Nonaktif tidak bisa dicetak SPPT" : "Cetak Tagihan Pajak"}
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Cetak SPPT
                </button>
                <button
                  onClick={() => {
                    loadDraft(null);
                    navigate('/spop');
                    setSelectedObject(null);
                  }}
                  disabled={selectedObject.status === 'Nonaktif'}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_document</span>
                  Ajukan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========== Modal Pre-Cetak PDF ========== */}
      {printModal.show && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPrintModal({ show: false, obj: null })} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-50/80 border-b border-blue-100 px-6 py-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-500 text-[22px]">print</span>
              </div>
              <div>
                <h3 className="text-blue-900 font-bold text-base">Cetak Salinan Data</h3>
                <p className="text-blue-600/80 text-xs mt-0.5">Lengkapi form sebelum mengunduh PDF</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nomor Urut Surat <span className="text-gray-400 font-normal normal-case">(opsional)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap font-mono bg-gray-100 px-2 py-2.5 rounded-lg border border-gray-200">
                    900.1 /
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={printConfig.nomorSurat}
                    onChange={e => setPrintConfig(p => ({ ...p, nomorSurat: e.target.value.replace(/\D/g, '') }))}
                    placeholder="mis. 123"
                    className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-400 whitespace-nowrap font-mono bg-gray-100 px-2 py-2.5 rounded-lg border border-gray-200">
                    / BKD-PBB / {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()]} / {new Date().getFullYear()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Format nomor: <span className="font-mono">900.1 / {printConfig.nomorSurat || '...'} / BKD-PBB / {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()]} / {new Date().getFullYear()}</span></p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nama Pejabat Penandatangan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={printConfig.namaPejabat}
                  onChange={e => setPrintConfig(p => ({ ...p, namaPejabat: e.target.value }))}
                  placeholder="Contoh: Drs. Ahmad Fauzi, M.Si."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Jabatan</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg">
                  <span className="material-symbols-outlined text-[16px] text-gray-400">lock</span>
                  <span className="text-sm text-gray-600 font-medium">Kepala Badan Keuangan Daerah</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  NIP <span className="text-gray-400 font-normal normal-case">(opsional, maks. 18 digit)</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={printConfig.nip}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 18);
                    setPrintConfig(p => ({ ...p, nip: val }));
                  }}
                  placeholder="Contoh: 197001011999031001"
                  maxLength={18}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${printConfig.nip && printConfig.nip.length < 18 ? 'border-amber-400' : 'border-gray-300'
                    }`}
                />
                <div className="flex justify-between mt-1">
                  {printConfig.nip && printConfig.nip.length < 18 && printConfig.nip.length > 0 && (
                    <span className="text-xs text-amber-600">NIP biasanya 18 digit</span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{printConfig.nip.length}/18</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 italic">Kosongkan ruang tanda tangan fisik — cetak dokumen ini lalu tandatangani dengan tanda tangan basah.</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setPrintModal({ show: false, obj: null })}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={generatePDF}
                disabled={!printConfig.namaPejabat.trim()}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Unduh PDF
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
