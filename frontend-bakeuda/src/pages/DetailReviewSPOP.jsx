import React, { useState, useEffect } from 'react';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function DetailReviewSPOP({ onNavigate }) {
  const [decisionNotes, setDecisionNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Tahap 5: State untuk Verifikasi Desa
  const [nipPejabat, setNipPejabat] = useState('');
  const [urlDokumenFisik, setUrlDokumenFisik] = useState('');
  const [pejabatDesa, setPejabatDesa] = useState([]);
  const [isUploadingDokumen, setIsUploadingDokumen] = useState(false);

  useEffect(() => {
    // Simulasi Fetch Pejabat Desa
    setPejabatDesa([
      { nip: '198001012010011001', nama_pejabat: 'Bapak Kades Purbalingga' },
      { nip: '198502022015021002', nama_pejabat: 'Bapak Sekdes Purbalingga' }
    ]);
    // Show an initial auto-save toast to mimic static page behavior
    const timer1 = setTimeout(() => {
      setToastMessage('Draft verifikasi disimpan otomatis');
      setShowToast(true);
      const timer2 = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer2);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  const handleDecision = (approved) => {
    if (approved && (!nipPejabat || !urlDokumenFisik)) {
      setToastMessage('Gagal: Pilih NIP Pejabat dan Unggah Dokumen Fisik terlebih dahulu!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setToastMessage(
      approved
        ? 'Verifikasi Desa Berhasil! Dokumen diteruskan ke Antrean Bakeuda.'
        : 'Pengajuan SPOP ditolak dan dikembalikan untuk revisi.'
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onNavigate('dashboard_desa');
    }, 2000);
  };

  const handleUploadDokumenFisik = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingDokumen(true);
      setTimeout(() => {
        setIsUploadingDokumen(false);
        const dummyUrl = `https://dummyimage.com/600x400/004b3a/fff&text=SPOP_Fisik_${encodeURIComponent(file.name)}`;
        setUrlDokumenFisik(dummyUrl);
      }, 1500);
    }
  };

  const buildings = [
    { no: '01', type: 'Rumah Tinggal', year: '1998', area: 120, status: 'TIDAK BERUBAH' },
    { no: '02', type: 'Garasi / Gudang', year: '2022', area: 45, status: 'BARU' },
  ];

  return (
    <main className="p-6 max-w-screen-2xl mx-auto w-full relative">
      {/* Page Header with "Paper" Header Feel */}
      <div className="bg-white border border-gray-200 p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0">
            <img
              alt="Purbalingga Logo"
              className="h-full w-full object-contain"
              src={logoPurbalingga}
            />
          </div>
          <div>
            <p className="text-gray-500 uppercase tracking-wider text-xs font-semibold mb-1">
              Badan Keuangan Daerah (Bakeuda)
            </p>
            <h2 className="text-2xl text-gray-900 leading-tight font-bold">
              Verifikasi Berkas SPOP PBB-P2
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Formulir SPOP-A01-2024 • ID: #TRX-9821-PBG
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-xs mb-2 font-bold border border-blue-200">
            Mutakhirkan Data (Update)
          </div>
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
              Tgl Pengajuan
            </span>
            <span className="font-mono font-medium text-sm text-gray-800">
              14 Oct 2023, 10:45 WIB
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Form Data */}
        <div className="lg:col-span-7 space-y-6">
          {/* NOP */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[18px] text-gray-500">pin</span>
              Nomor Objek Pajak (NOP)
            </h3>
            <div className="font-mono text-lg font-bold text-gray-900 tracking-wider">
              33.03.050.012.005.0340.0
            </div>
            <p className="text-[11px] text-gray-400 mt-2 italic">
              *Prov - Kab - Kec - Kel - Blok - No.Urut - Kode
            </p>
          </section>

          {/* Subjek Pajak */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">person</span>
              DATA SUBJEK PAJAK
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Nama Subjek Pajak
                  </label>
                  <div className="font-semibold text-gray-900 text-base">BUDI SANTOSO, S.T.</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Status Subjek Pajak
                  </label>
                  <div className="font-semibold text-blue-700">Milik Sendiri</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    NPWP
                  </label>
                  <div className="font-mono font-medium text-sm text-gray-800">
                    09.234.567.8-522.000
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Alamat Subjek Pajak
                  </label>
                  <div className="font-semibold text-gray-900">JL. MERDEKA NO. 45, RT 003 / RW 001</div>
                  <div className="text-gray-500 text-sm font-medium mt-0.5">
                    DESA PENAMBONGAN, KEC. PURBALINGGA
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Pekerjaan
                  </label>
                  <div className="font-semibold text-gray-900">Pegawai Negeri Sipil</div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Tanah (Data Baru Comparison) */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">landscape</span>
              DATA TANAH (DATA BARU)
            </h3>
            {/* Alert / Highlight */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Terjadi Perubahan Luas Tanah</h4>
                <p className="text-sm text-blue-800 mt-1">
                  User melakukan pemutakhiran data berdasarkan Sertifikat Tanah terbaru (2023).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Luas Tanah (m²)</label>
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <span className="text-red-600 line-through">450 m²</span>
                  <span className="material-symbols-outlined text-gray-400">arrow_forward</span>
                  <span className="text-green-700 bg-green-50 px-2 py-1 rounded">525 m²</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Jenis Tanah</label>
                <div className="font-semibold text-gray-900 text-lg">Tanah Darat</div>
              </div>
            </div>
          </section>

          {/* Data Bangunan Table */}
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              DATA BANGUNAN
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">No. Bng</th>
                    <th className="p-3">Jenis Bng</th>
                    <th className="p-3">Thn Selesai</th>
                    <th className="p-3 text-right">Luas (m²)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-on-surface">
                  {buildings.map((bng, index) => (
                    <tr
                      key={index}
                      className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${
                        index % 2 === 1 ? 'bg-surface-container-low/40' : ''
                      }`}
                    >
                      <td className="p-3 font-data-mono font-bold">{bng.no}</td>
                      <td className="p-3 font-medium">{bng.type}</td>
                      <td className="p-3 font-medium">{bng.year}</td>
                      <td className="p-3 text-right font-data-mono font-bold">
                        {bng.status === 'BARU' ? (
                          <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded border border-secondary/20">
                            {bng.area}
                          </span>
                        ) : (
                          bng.area
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] rounded font-bold border ${
                            bng.status === 'BARU'
                              ? 'bg-primary-fixed text-on-primary-fixed-variant border-primary-fixed-dim'
                              : 'bg-surface-container-high text-on-surface-variant border-outline-variant'
                          }`}
                        >
                          {bng.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Attachments & Documents */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm lg:sticky lg:top-20">
            <h3 className="text-sm border-b border-gray-200 pb-3 mb-4 flex items-center gap-2 text-gray-800 font-bold uppercase">
              <span className="material-symbols-outlined text-[20px]">attachment</span>
              LAMPIRAN DOKUMEN
            </h3>
            <div className="space-y-6">
              {/* KTP */}
              <div className="group border border-outline-variant p-4 rounded-lg hover:border-primary transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px]">id_card</span>
                    <div>
                      <p className="font-bold text-sm text-on-surface">Kartu Tanda Penduduk (KTP)</p>
                      <p className="text-xs text-on-surface-variant">ktp_budi_santoso.jpg (1.2 MB)</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                    open_in_new
                  </span>
                </div>
                <div className="aspect-video bg-surface-variant rounded-lg overflow-hidden relative border border-outline-variant/60 shadow-inner">
                  <img
                    alt="Document Preview KTP"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4SDVhh2gwi7GnkeMcWqwCZxBcGiQFpUPobbVROpIPYoXoD1W6LxKRp8O3SULrwIeHgBzCiFiQj7K2XoofWoHgivXb7REaNXt7P43xPb4nEZj0EmFv7ua-HCQCjAgzjVP8dXvhgwW6AteaUMN6HTvmOYHV2l9prEiYzyh8DyyUZ-jKFuAjWAvm3r5P8tXKH4E1ZZor2Z-6bZE9XT8j3JyrAeyZHQUNFLgmTtQ29bAXz4Hb4UZzAC6Hu6Ey2gLQ9MjQUQx3pdX6jlmJ"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      Klik untuk perbesar
                    </span>
                  </div>
                </div>
              </div>

              {/* Sertifikat Tanah */}
              <div className="group border border-outline-variant p-4 rounded-lg hover:border-primary transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px]">description</span>
                    <div>
                      <p className="font-bold text-sm text-on-surface">Sertifikat Tanah / Hak Milik</p>
                      <p className="text-xs text-on-surface-variant">sertifikat_nop_005.pdf (4.5 MB)</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                    visibility
                  </span>
                </div>
                <div className="aspect-[4/3] bg-surface-container-low rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/80 p-4">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">picture_as_pdf</span>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
                    Preview Not Available
                  </p>
                  <button className="mt-3 text-xs bg-primary text-on-primary px-4 py-2 rounded-full font-bold shadow hover:opacity-90 active:scale-95 transition-all">
                    Unduh Dokumen
                  </button>
                </div>
              </div>

              {/* Foto Lokasi */}
              <div className="group border border-outline-variant p-4 rounded-lg hover:border-primary transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px]">photo_camera</span>
                    <div>
                      <p className="font-bold text-sm text-on-surface">Foto Lokasi Objek Pajak</p>
                      <p className="text-xs text-on-surface-variant">tampak_depan_2023.png (2.8 MB)</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                    open_in_new
                  </span>
                </div>
                <div className="aspect-video bg-surface-variant rounded-lg overflow-hidden relative border border-outline-variant/60 shadow-inner">
                  <img
                    alt="Location Photo Preview"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUEV5ZNcahjZmfMOeLac-nZeWFTrjt2EORocXGNFuyP2NXz3noq44STqP8yvLV4xzqUYUtRRll1X9YbI5Qy5Fdk8ThL4CSsFAbtzH2us-EfR1P-rEPNiZgL2CrLRuL7fYeslVHQK68BLABcjHtxYHagbxHs2W6VkuHBBI4qnQJZZu0Zpap7heS8T8227hAYBDKslb5PylEXNfC1H1Wicvdw8wax8gin3wOQR31O_y-_ga9VQXFd1-H2LkkGcQTtF40RWoItM-bYa5b"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Verification Action Card */}
      <div className="mt-8 mb-12">
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-lg shadow-sm">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg text-gray-900 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-blue-600">assignment_turned_in</span>
              Keputusan Verifikasi
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Periksa kembali kesesuaian data digital dengan lampiran yang diunggah. Keputusan yang Anda buat akan langsung memperbarui database Master Data PBB.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Pejabat Berwenang (Kades/Sekdes)
                  </label>
                  <select
                    value={nipPejabat}
                    onChange={(e) => setNipPejabat(e.target.value)}
                    className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white"
                  >
                    <option value="">-- Pilih Pejabat --</option>
                    {pejabatDesa.map(p => (
                      <option key={p.nip} value={p.nip}>{p.nama_pejabat} (NIP: {p.nip})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Dokumen Fisik SPOP (TTD Basah)
                  </label>
                  <div className="relative overflow-hidden w-full">
                    <button 
                      type="button"
                      disabled={isUploadingDokumen}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-dashed border-blue-400 text-blue-600 font-semibold hover:bg-blue-50 transition-colors ${isUploadingDokumen ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{isUploadingDokumen ? 'hourglass_empty' : (urlDokumenFisik ? 'check_circle' : 'upload_file')}</span>
                      {isUploadingDokumen ? 'Mengunggah...' : (urlDokumenFisik ? 'Dokumen Terlampir' : 'Upload PDF/JPG')}
                    </button>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleUploadDokumenFisik}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploadingDokumen}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Catatan / Alasan Verifikasi
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white"
                  placeholder="Contoh: Luas tanah telah dikonfirmasi sesuai dengan sertifikat nomor sert: 09283/2023..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-3">
              <button
                onClick={() => handleDecision(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                Setujui Pengajuan
              </button>
              <button
                onClick={() => handleDecision(false)}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-600 font-semibold py-3 px-4 rounded-md hover:bg-red-50 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                Tolak / Perlu Revisi
              </button>
              <p className="text-xs text-gray-400 text-center px-2 pt-2">
                Dengan menekan Setujui, Anda bertanggung jawab penuh atas validasi data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-high px-gutter py-8 text-on-surface-variant border-t border-outline-variant rounded-t-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-center md:text-left">
            © 2026 Badan Keuangan Daerah (BKD) Kabupaten Purbalingga. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-sm font-label-sm">
            <a className="hover:text-primary transition-colors" href="#">
              Panduan Verifikator
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Bantuan
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-transform duration-300 z-50 ${
          showToast ? 'translate-y-0' : 'translate-y-28'
        }`}
      >
        <span className="material-symbols-outlined text-secondary-fixed">info</span>
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </main>
  );
}
