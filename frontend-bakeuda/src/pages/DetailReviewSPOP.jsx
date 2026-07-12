import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

export default function DetailReviewSPOP({ onNavigate, transaksiId }) {
  const [decisionNotes, setDecisionNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!transaksiId) {
          setLoading(false);
          return;
        }
        const res = await api.get('/transaksi-spop');
        const found = res.data.data.find(item => item.id_transaksi === transaksiId);
        if (found) {
          setData(found);
        }
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [transaksiId]);

  const handleDecision = async (approved) => {
    if (!data) return;
    try {
      await api.patch(`/transaksi-spop/${data.id_transaksi}/verifikasi`, {
        status_ajuan: approved ? 'DISETUJUI' : 'REVISI',
        catatan_bakeuda: decisionNotes || (approved ? 'Sesuai' : 'Perlu perbaikan')
      });
      setToastMessage(
        approved
          ? 'Pengajuan SPOP berhasil disetujui!'
          : 'Pengajuan SPOP ditolak dan dikembalikan untuk revisi.'
      );
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onNavigate('antrean_verifikasi');
      }, 2000);
    } catch (error) {
      console.error("Gagal verifikasi:", error);
      alert('Gagal memproses verifikasi');
    }
  };

  const buildings = [
    { no: '01', type: 'Rumah Tinggal', year: '1998', area: data?.detail_tujuan?.[0]?.luas_bangunan_baru || 0, status: 'BARU' }
  ];

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Memuat data review...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-error">Data transaksi tidak ditemukan. Silakan kembali ke antrean.</div>;
  }

  const nopRaw = data.detail_tujuan[0]?.nop_generated || data.detail_tujuan[0]?.no_persil_baru || '..................';
  const nopParts = [
    nopRaw.substring(0, 2) || '33',
    nopRaw.substring(2, 4) || '03',
    nopRaw.substring(4, 7) || '000',
    nopRaw.substring(7, 10) || '000',
    nopRaw.substring(10, 13) || '000',
    nopRaw.substring(13, 17) || '0000',
    nopRaw.substring(17, 18) || '0'
  ];

  return (
    <main className="p-gutter max-w-screen-2xl mx-auto w-full relative">
      {/* Page Header with "Paper" Header Feel */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 grayscale opacity-80 select-none">
            <img
              alt="Purbalingga Logo"
              className="h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH55CWmxhrh5KBjJTVdqkT_9mD0vLNP8YDM2Fw_wOH8qk10BjyQ-qWIwqdE1nnhgxdGMx4iUoLzJ7Ap9WWlxZNWRth2820zWEroeiZFqrQdSXXKtNnRydVeKAfWNogqc_J-qahguSDm9zXGSAm2qyMFhO7ToSjYtFfh2jeS8QSES0_0JIHalw04O0wkA_KS6PmBkKQy-jIbnTVhBYh8I3ofTfuZHMUjQeG3kFsj9K3RZNQL12FmrrLdux4pLGNHiziYrw0HKdMWHO7"
            />
          </div>
          <div>
            <p className="font-section-header text-section-header text-primary uppercase tracking-[0.2em] mb-1">
              Dinas Pendapatan Daerah
            </p>
            <h2 className="font-display-lg text-display-lg text-on-surface leading-tight font-bold">
              Review Verifikasi SPOP
            </h2>
            <p className="text-on-surface-variant mt-1 text-sm uppercase">
              Jenis: {data.jenis_transaksi} • TRX: {data.id_transaksi.split('-')[0]}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="bg-secondary-container px-4 py-1.5 rounded-full text-on-secondary-container font-label-sm text-[12px] mb-2 font-bold shadow-sm">
            Mutakhirkan Data (Update)
          </div>
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">
              Tgl Pengajuan
            </span>
            <span className="font-data-mono text-data-mono font-medium text-sm text-primary">
              {new Date(data.tanggal_pengajuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Digital Form Data */}
        <div className="lg:col-span-7 space-y-8">
          {/* NOP */}
          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="font-section-header text-section-header border-b border-outline-variant pb-3 mb-6 flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">pin</span>
              NOMOR OBJEK PAJAK (NOP)
            </h3>
            <div className="flex flex-wrap gap-2">
              {nopParts.map((seg, i) => (
                <span
                  key={i}
                  className="border border-outline-variant px-3 py-1.5 rounded font-data-mono font-bold text-primary bg-surface-container-low shadow-sm"
                >
                  {seg}
                </span>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-3 italic">
              *Prov - Kab - Kec - Kel - Blok - No.Urut - Kode
            </p>
          </section>

          {/* Subjek Pajak */}
          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="font-section-header text-section-header border-b border-outline-variant pb-3 mb-6 flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">person</span>
              DATA SUBJEK PAJAK
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Nama Subjek Pajak
                  </label>
                  <div className="font-bold text-on-surface text-lg">{data.nama_pengaju || 'TIDAK DIKETAHUI'}</div>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Status Subjek Pajak
                  </label>
                  <div className="font-bold text-primary">Milik Sendiri</div>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    NPWP/NIK
                  </label>
                  <div className="font-data-mono text-data-mono font-medium text-sm">
                    {data.detail_tujuan[0]?.nik_calon_subjek || '................'}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Alamat Subjek Pajak
                  </label>
                  <div className="font-bold text-on-surface">JL. MERDEKA NO. 45, RT 003 / RW 001</div>
                  <div className="text-on-surface-variant text-sm font-medium mt-0.5">
                    DESA PENAMBONGAN, KEC. PURBALINGGA
                  </div>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Pekerjaan
                  </label>
                  <div className="font-bold text-on-surface">Pegawai Negeri Sipil</div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Tanah (Data Baru Comparison) */}
          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="font-section-header text-section-header border-b border-outline-variant pb-3 mb-6 flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">landscape</span>
              DATA TANAH (DATA BARU)
            </h3>
            <div className="bg-surface-container-low p-4 rounded-lg mb-6 border border-outline-variant/50">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary text-on-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-primary">Terjadi Perubahan Luas Tanah</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    User melakukan pemutakhiran data berdasarkan Sertifikat Tanah terbaru (2023).
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 font-semibold">
                  Luas Tanah (m²)
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-secondary-container text-on-secondary-container border-l-4 border-secondary px-3 py-1 font-bold text-lg rounded shadow-sm">
                    {data.detail_tujuan[0]?.luas_tanah_baru || 0} m²
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 font-semibold">
                  Jenis Tanah
                </label>
                <div className="font-bold text-on-surface text-lg uppercase">{data.detail_tujuan[0]?.jenis_tanah_baru || 'Tanah Darat'}</div>
              </div>
            </div>
          </section>

          {/* Data Bangunan Table */}
          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="font-section-header text-section-header border-b border-outline-variant pb-3 mb-6 flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              DATA BANGUNAN
            </h3>
            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-left border-collapse">
                <thead className="bg-primary text-on-primary text-xs uppercase tracking-wider font-section-header">
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
          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm lg:sticky lg:top-20">
            <h3 className="font-section-header text-section-header border-b border-outline-variant pb-3 mb-6 flex items-center gap-2 text-primary font-bold">
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
      <div className="mt-section-gap mb-12">
        <div className="bg-surface-container border-2 border-primary/20 p-6 md:p-8 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
            <span className="material-symbols-outlined text-[120px]">fact_check</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md text-primary mb-2 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
              Keputusan Verifikasi
            </h3>
            <p className="text-on-surface-variant mb-6 max-w-2xl text-sm md:text-base">
              Periksa kembali kesesuaian data digital dengan lampiran yang diunggah. Keputusan yang Anda buat akan langsung memperbarui database Master Data PBB.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-1">
                <label className="block font-label-sm text-label-sm text-primary mb-2">
                  Catatan / Alasan Verifikasi
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary text-sm p-4 bg-white"
                  placeholder="Contoh: Luas tanah telah dikonfirmasi sesuai dengan sertifikat nomor sert: 09283/2023..."
                  rows={4}
                />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <button
                  onClick={() => handleDecision(true)}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-on-secondary font-bold py-4 px-6 rounded-lg hover:brightness-110 transition-all shadow-md active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Setujui Pengajuan
                </button>
                <button
                  onClick={() => handleDecision(false)}
                  className="w-full flex items-center justify-center gap-2 bg-error text-on-error font-bold py-4 px-6 rounded-lg hover:brightness-110 transition-all shadow-md active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Tolak / Perlu Revisi
                </button>
                <p className="text-[11px] text-on-surface-variant text-center px-4 leading-tight">
                  Dengan menekan Setujui, Anda bertanggung jawab penuh atas validasi data ini sesuai peraturan yang berlaku.
                </p>
              </div>
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
