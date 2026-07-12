import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function CetakKredensialModal({ isOpen, onClose, users, wilayahList }) {
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [namaBkd, setNamaBkd] = useState('Drs. SISWANTO, S.Pd., M.Si.');
  const [nipBkd, setNipBkd] = useState('19700101 199003 1 001');
  const [namaCamat, setNamaCamat] = useState('');
  const [nipCamat, setNipCamat] = useState('');

  const formatNIP = (value) => {
    let val = value.replace(/\D/g, '');
    val = val.substring(0, 18);
    let formatted = '';
    if (val.length > 0) formatted += val.substring(0, 8);
    if (val.length > 8) formatted += ' ' + val.substring(8, 14);
    if (val.length > 14) formatted += ' ' + val.substring(14, 15);
    if (val.length > 15) formatted += ' ' + val.substring(15, 18);
    return formatted;
  };
  
  if (!isOpen) return null;

  // Get unique kecamatan from wilayahList
  const kecamatanList = [...new Set(wilayahList.map(w => w.kecamatan))].sort();

  // Filter users based on selected kecamatan
  const filteredUsers = selectedKecamatan ? users.filter(user => {
    const userWilayah = wilayahList.find(w => w.kode_wilayah === user.kode_wilayah);
    return userWilayah && userWilayah.kecamatan === selectedKecamatan;
  }).map(user => {
    const userWilayah = wilayahList.find(w => w.kode_wilayah === user.kode_wilayah);
    return {
      ...user,
      nama_desa: userWilayah.nama_desa
    };
  }).sort((a, b) => a.nama_desa.localeCompare(b.nama_desa)) : [];

  const tanggalCetak = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const defaultPassword = `bakeuda${new Date().getFullYear()}`;

  // Build the print HTML content as a standalone document
  const buildPrintHTML = () => {
    const rows = filteredUsers.map((user, i) => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #000;text-align:center;">${i + 1}</td>
        <td style="padding:8px 12px;border:1px solid #000;font-weight:600;text-transform:uppercase;">${user.nama_desa}</td>
        <td style="padding:8px 12px;border:1px solid #000;text-align:center;font-family:monospace;">${user.username}</td>
        <td style="padding:8px 12px;border:1px solid #000;text-align:center;font-family:monospace;color:#555;">${defaultPassword}</td>
        <td style="padding:8px 12px;border:1px solid #000;text-align:center;width:100px;"></td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <title>Kredensial SIPD - Kec. ${selectedKecamatan}</title>
  <style>
    @page { size: A4 portrait; margin: 1.5cm; }
    body { font-family: 'Times New Roman', serif; color: #000; margin: 0; padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 8px 12px; border: 1px solid #000; font-weight: bold; background: #f3f3f3; }
  </style>
</head>
<body>
  <div style="text-align:center;margin-bottom:24px;border-bottom:3px double #000;padding-bottom:16px;">
    <h1 style="font-size:20px;margin:0;text-transform:uppercase;letter-spacing:2px;">Pemerintah Kabupaten Purbalingga</h1>
    <h2 style="font-size:17px;margin:4px 0 0;text-transform:uppercase;">Badan Keuangan Daerah (Bakeuda)</h2>
    <p style="margin:8px 0 0;font-size:13px;font-style:italic;">Berita Acara Penyerahan Kredensial Akun SIPD Purbalingga</p>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;">
    <div>
      <p style="margin:0;font-weight:bold;">Kecamatan: <span style="text-transform:uppercase;font-size:18px;">${selectedKecamatan}</span></p>
      <p style="margin:4px 0 0;font-size:13px;">Jumlah Desa: ${filteredUsers.length}</p>
    </div>
    <div style="text-align:right;font-size:13px;">
      <p style="margin:0;">Tanggal Cetak: ${tanggalCetak}</p>
    </div>
  </div>

  <table style="margin-bottom:40px;">
    <thead>
      <tr>
        <th style="text-align:center;width:40px;">No</th>
        <th style="text-align:left;">Desa / Kelurahan</th>
        <th style="text-align:center;">Username</th>
        <th style="text-align:center;">Password Sementara</th>
        <th style="text-align:center;width:100px;">Paraf</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div style="display:flex;justify-content:space-between;margin-top:60px;padding:0 40px;">
    <div style="text-align:center;">
      <p style="margin-bottom:80px;">Mengetahui,<br/>Kepala BKD Kab. Purbalingga</p>
      <p style="font-weight:bold;text-decoration:underline;margin:0;">${namaBkd || '___________________________'}</p>
      <p style="font-size:13px;margin:4px 0 0;">NIP. ${nipBkd || '..................................'}</p>
    </div>
    <div style="text-align:center;">
      <p style="margin-bottom:80px;">Menerima,<br/>Camat ${selectedKecamatan}</p>
      <p style="font-weight:bold;text-decoration:underline;margin:0;">${namaCamat || '___________________________'}</p>
      <p style="font-size:13px;margin:4px 0 0;">NIP. ${nipCamat || '..................................'}</p>
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(buildPrintHTML());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleShareWA = () => {
    if (!selectedKecamatan || filteredUsers.length === 0) return;
    
    let text = `REKAP KREDENSIAL AKUN SIPD PURBALINGGA\n`;
    text += `Kecamatan ${selectedKecamatan.toUpperCase()}\n`;
    text += `Tanggal: ${tanggalCetak}\n\n`;
    text += `Yth. Bapak/Ibu Camat ${selectedKecamatan},\n`;
    text += `Berikut kami sampaikan daftar kredensial akun SIPD untuk seluruh desa/kelurahan di wilayah Kecamatan ${selectedKecamatan}.\n\n`;
    text += `Link Akses : ${window.location.origin}\n`;
    text += `Password   : ${defaultPassword}\n\n`;
    text += `--- DAFTAR AKUN ---\n`;
    
    filteredUsers.forEach((user, i) => {
      text += `${i + 1}. ${user.nama_desa.toUpperCase()} - Username: ${user.username}\n`;
    });
    
    text += `---\n\n`;
    text += `Mohon agar informasi ini dapat diteruskan kepada masing-masing perangkat desa/kelurahan.\n`;
    text += `Perangkat desa diharapkan segera mengubah password setelah login pertama.\n\n`;
    text += `Terima kasih.\n`;
    text += `Admin BKD Kab. Purbalingga`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Cetak Kredensial</h2>
            <p className="text-on-surface-variant text-sm mt-1">Pilih kecamatan untuk mencetak rekap username & sandi bawaan.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
          <div className="space-y-3">
            <p className="font-bold text-sm text-primary uppercase tracking-wider mb-2">Penanda Tangan BKD</p>
            <div>
              <label className="text-xs text-on-surface-variant font-bold mb-1 block">Nama Kepala BKD</label>
              <input 
                type="text" 
                value={namaBkd} 
                onChange={(e) => setNamaBkd(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant font-bold mb-1 block">NIP Kepala BKD</label>
              <input 
                type="text" 
                value={nipBkd} 
                onChange={(e) => setNipBkd(formatNIP(e.target.value))}
                placeholder="Format: 18 Digit Angka"
                className="w-full px-3 py-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary font-mono tracking-wide" 
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-bold text-sm text-primary uppercase tracking-wider mb-2">Penanda Tangan Kecamatan</p>
            <div>
              <label className="text-xs text-on-surface-variant font-bold mb-1 block">Nama Camat</label>
              <input 
                type="text" 
                placeholder="Nama Camat..."
                value={namaCamat} 
                onChange={(e) => setNamaCamat(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant font-bold mb-1 block">NIP Camat</label>
              <input 
                type="text" 
                placeholder="Format: 18 Digit Angka"
                value={nipCamat} 
                onChange={(e) => setNipCamat(formatNIP(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary font-mono tracking-wide" 
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <select 
            className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary flex-1 w-full font-medium"
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
          >
            <option value="">-- Pilih Kecamatan untuk Pratinjau --</option>
            {kecamatanList.map(kec => (
              <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
          
          <button 
            onClick={handlePrint}
            disabled={!selectedKecamatan || filteredUsers.length === 0}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
            Cetak PDF
          </button>

          <button 
            onClick={handleShareWA}
            disabled={!selectedKecamatan || filteredUsers.length === 0}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1ebd5a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            Share WA
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 border border-outline-variant rounded-xl p-8 bg-white">
          {/* Preview Area */}
          <div className="w-full text-black bg-white">
            {selectedKecamatan ? (
              <>
                <div className="text-center mb-8 border-b-2 border-black pb-6">
                  <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Pemerintah Kabupaten Purbalingga</h1>
                  <h2 className="text-xl font-bold uppercase">Badan Keuangan Daerah (Bakeuda)</h2>
                  <p className="mt-2 text-sm italic">Berita Acara Penyerahan Kredensial Akun SIPD Purbalingga</p>
                </div>
                
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <p className="font-bold">Kecamatan: <span className="uppercase text-lg">{selectedKecamatan}</span></p>
                    <p className="text-sm mt-1">Jumlah Desa: {filteredUsers.length}</p>
                  </div>
                  <div className="text-sm text-right">
                    <p>Tanggal Cetak: {tanggalCetak}</p>
                  </div>
                </div>

                <table className="w-full text-left border-collapse border border-black mb-12">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border border-black font-bold w-12 text-center">No</th>
                      <th className="py-2 px-4 border border-black font-bold">Desa / Kelurahan</th>
                      <th className="py-2 px-4 border border-black font-bold text-center">Username</th>
                      <th className="py-2 px-4 border border-black font-bold text-center">Password Sementara</th>
                      <th className="py-2 px-4 border border-black font-bold text-center w-32">Paraf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, i) => (
                        <tr key={user.id_user}>
                          <td className="py-2 px-4 border border-black text-center">{i + 1}</td>
                          <td className="py-2 px-4 border border-black font-semibold uppercase">{user.nama_desa}</td>
                          <td className="py-2 px-4 border border-black text-center font-mono">{user.username}</td>
                          <td className="py-2 px-4 border border-black text-center font-mono text-gray-600">
                            {defaultPassword}
                          </td>
                          <td className="py-2 px-4 border border-black text-center"></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500 italic">Tidak ada pengguna desa yang terdaftar di kecamatan ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                <div className="flex justify-between mt-16 px-12">
                  <div className="text-center">
                    <p className="mb-24">Mengetahui,<br/>Kepala BKD Kab. Purbalingga</p>
                    <p className="font-bold underline">{namaBkd || '___________________________'}</p>
                    <p className="text-sm mt-1">NIP. {nipBkd || '..................................'}</p>
                  </div>
                  <div className="text-center">
                    <p className="mb-24">Menerima,<br/>Camat {selectedKecamatan}</p>
                    <p className="font-bold underline">{namaCamat || '___________________________'}</p>
                    <p className="text-sm mt-1">NIP. {nipCamat || '..................................'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 min-h-[300px]">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">print</span>
                <p className="text-lg">Silakan pilih kecamatan untuk melihat pratinjau cetak.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
