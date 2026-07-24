import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from '../components/StatusBadge';
import { useSpop } from '../context/SpopContext';
import api from '../utils/axios';
import logoPurbalingga from '../assets/logo-purbalingga.png';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function DaftarObjekPajak() {
  const navigate = useNavigate();
  const { loadDraft } = useSpop();
  const [statusVerif, setStatusVerif] = useState('');
  const [search, setSearch] = useState('');
  const [jenisTanah, setJenisTanah] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch stats sekali saja
  useEffect(() => {
    api.get('/objek-pajak/stats').then(res => setStats(res.data.data)).catch(() => { });
  }, []);

  // Fetch data setiap ada perubahan filter/page
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        params.set('page', String(currentPage));
        params.set('limit', String(itemsPerPage));
        if (statusVerif) params.set('status', statusVerif);
        if (jenisTanah) params.set('jenis_tanah', jenisTanah);

        const res = await api.get(`/objek-pajak?${params.toString()}`);
        const { data, total, totalPages: tp } = res.data;

        const formattedList = (data || []).map(item => ({
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
          jumlah_bangunan: item.jumlah_bangunan || 0,
          koordinat_polygon: item.koordinat_polygon || null,
          no_persil: item.no_persil || '-',
          kode_blok: item.kode_blok || '-',
        }));

        setObjects(formattedList);
        setTotalItems(total || 0);
        setTotalPages(tp || 0);
      } catch (err) {
        console.error("Gagal memuat data objek pajak:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, statusVerif, jenisTanah, currentPage, itemsPerPage]);

  const handleResetFilter = () => {
    setSearchInput('');
    setSearch('');
    setStatusVerif('');
    setJenisTanah('');
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedObjects = objects;

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
          <div className="flex flex-col sm:flex-row gap-4 w-full flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Cari Nama/NOP/Alamat
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-background border border-outline-variant rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-primary focus:border-primary"
                  placeholder="Ketik kata kunci..."
                />
              </div>
            </div>
            <div className="space-y-1.5 w-full sm:w-[165px] shrink-0">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Status
              </label>
              <select
                value={statusVerif}
                onChange={(e) => { setStatusVerif(e.target.value); setCurrentPage(1); }}
                className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
            <div className="space-y-1.5 w-full sm:w-[200px] shrink-0">
              <label className="font-label-sm text-on-surface-variant text-xs font-bold block ml-1">
                Jenis Tanah
              </label>
              <select
                value={jenisTanah}
                onChange={(e) => { setJenisTanah(e.target.value); setCurrentPage(1); }}
                className="w-full bg-background border border-outline-variant rounded-lg py-2 px-3 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Semua Jenis</option>
                <option value="TANAH_BANGUNAN">Tanah Bangunan</option>
                <option value="KAVLING_SIAP_BANGUN">Kavling Siap Bangun</option>
                <option value="TANAH_KOSONG">Tanah Kosong</option>
                <option value="FASILITAS_UMUM">Fasilitas Umum</option>
                <option value="TANAH_LAINNYA">Tanah Lainnya</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleResetFilter}
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
                <th className="px-4 py-3 font-bold border-b border-outline-variant whitespace-nowrap">Jenis Tanah</th>
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
                    <td className="px-4 py-3 text-sm text-on-surface-variant leading-relaxed whitespace-nowrap" title={obj.address}>
                      {obj.address.length > 25 ? obj.address.slice(0, 25) + '…' : obj.address}
                    </td>
                    <td className="px-4 py-3 text-center font-data-mono font-medium text-sm">
                      {obj.land.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center font-data-mono font-medium text-sm">
                      {obj.building.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                        {obj.jenis_tanah}
                      </span>
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
                  <td colSpan={9} className="text-center p-8 text-on-surface-variant font-medium">
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
              <span className="font-bold text-on-surface">{totalItems.toLocaleString('id-ID')}</span> data
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
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedObject(null); }}
        >
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-[20px]">landscape</span>
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-base">Detail Objek Pajak</h3>
                  <p className="text-gray-500 text-xs font-mono">{selectedObject.nop}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedObject(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                title="Tutup"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Peta */}
              {(() => {
                const poly = selectedObject.koordinat_polygon;
                const coords = Array.isArray(poly)
                  ? poly
                  : (poly?.coordinates?.[0] || null);
                const leafletCoords = coords
                  ? coords.map(c => Array.isArray(c[0]) ? c[0].map(p => [p[1], p[0]]) : [c[1], c[0]])
                  : null;
                const center = leafletCoords
                  ? [leafletCoords.reduce((s, p) => s + p[0], 0) / leafletCoords.length,
                     leafletCoords.reduce((s, p) => s + p[1], 0) / leafletCoords.length]
                  : [-7.3906, 109.3647]; // Default: Purbalingga

                return (
                  <div className="h-52 w-full relative">
                    <MapContainer
                      key={selectedObject.nop}
                      center={center}
                      zoom={leafletCoords ? 17 : 12}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                      />
                      {leafletCoords ? (
                        <Polygon positions={leafletCoords} pathOptions={{ color: '#16a34a', fillColor: '#16a34a', fillOpacity: 0.25, weight: 2 }} />
                      ) : (
                        <Marker position={center} />
                      )}
                    </MapContainer>
                    {!leafletCoords && (
                      <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">Koordinat polygon belum tersedia</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Info Grid */}
              <div className="p-6 space-y-0">
                {/* Section: Identitas */}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Identitas Objek</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">NOP</p>
                    <p className="font-bold text-gray-900 text-sm font-mono tracking-wider">{selectedObject.nop}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</p>
                    <StatusBadge status={selectedObject.status} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5 sm:col-span-2">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Alamat Lengkap</p>
                    <p className="font-semibold text-gray-800 text-sm leading-relaxed">
                      {selectedObject.address}
                      {selectedObject.rt_rw !== '-' && <span> ({selectedObject.rt_rw})</span>}
                      {selectedObject.kelurahan && selectedObject.kelurahan !== '-' && <span> Kel. {selectedObject.kelurahan}</span>}
                      {selectedObject.kecamatan && selectedObject.kecamatan !== '-' && <span>, Kec. {selectedObject.kecamatan}</span>}
                    </p>
                  </div>
                </div>

                {/* Section: Data Fisik */}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Data Fisik Objek</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  <div className="bg-blue-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Jenis Tanah</p>
                    <p className="font-bold text-blue-800 text-sm capitalize">
                      {selectedObject.jenis_tanah === '-' ? '-' : selectedObject.jenis_tanah.replace(/_/g, ' ').toLowerCase()}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Luas Tanah</p>
                    <p className="font-bold text-blue-800 text-sm">{selectedObject.land.toLocaleString('id-ID')} m²</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Luas Bangunan</p>
                    <p className="font-bold text-blue-800 text-sm">{selectedObject.building.toLocaleString('id-ID')} m²</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Jumlah Bangunan</p>
                    <p className="font-bold text-blue-800 text-sm">{selectedObject.jumlah_bangunan} Unit</p>
                  </div>
                  {selectedObject.njop > 0 && (
                    <div className="bg-green-50 rounded-xl p-3.5 sm:col-span-2">
                      <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider mb-1">NJOP</p>
                      <p className="font-bold text-green-800 text-sm">Rp {selectedObject.njop.toLocaleString('id-ID')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedObject(null)}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
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
