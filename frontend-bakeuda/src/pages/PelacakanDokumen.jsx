import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axios';

export default function PelacakanDokumen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataTransaksi, setDataTransaksi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/transaksi-spop/${id}`);
        let fetchedData = res.data.data;

        // Fetch existing NOP data if transaction is HAPUS
        if (fetchedData.jenis_transaksi === 'HAPUS' && fetchedData.detail_asal?.length > 0) {
          try {
            const nopAsal = fetchedData.detail_asal[0].nop_asal;
            const opRes = await api.get(`/objek-pajak/${nopAsal}`);
            const opData = opRes.data.data;
            if (opData) {
              const subjek = opData.subjek_pajak || {};
              const bumi = opData.bumi || {};

              // Populate detail_tujuan with existing data so UI can render it
              fetchedData.detail_tujuan = [{
                calon_subjek_json: {
                  no_hp: subjek.no_telp,
                  alamat_jalan: subjek.jalan_wp,
                },
                luas_tanah_baru: bumi.luas_bumi,
                jalan_op_baru: opData.jalan_op,
                rt_op_baru: opData.rt_op,
                rw_op_baru: opData.rw_op,
                kelurahan_op_baru: opData.wilayah?.nama_desa,
                kecamatan_op_baru: opData.wilayah?.kecamatan,
                luas_bangunan_baru: opData.bangunan?.reduce((acc, b) => acc + (b.luas_bangunan || 0), 0) || 0,
                jumlah_bangunan_baru: opData.bangunan?.length || 0,
                nop_generated: opData.nop
              }];
            }
          } catch (err) {
            console.log('Gagal ambil data objek_asal untuk HAPUS');
          }
        }
        setDataTransaksi(fetchedData);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data pelacakan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <main className="p-gutter max-w-screen-lg mx-auto w-full relative flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-[48px] text-primary">autorenew</span>
          <p className="font-bold text-primary font-label-sm">Memuat Data Riwayat...</p>
        </div>
      </main>
    );
  }

  if (error || !dataTransaksi) {
    return (
      <main className="p-gutter max-w-screen-lg mx-auto w-full">
        <div className="bg-error/10 text-error p-6 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px]">error</span>
          <span className="font-medium">{error || 'Data tidak ditemukan'}</span>
        </div>
      </main>
    );
  }

  const detailTujuan = dataTransaksi.detail_tujuan?.[0] || {};
  const nop = detailTujuan.nop_generated || detailTujuan.no_persil_baru || 'Menunggu NOP';

  const calonSubjek = detailTujuan.calon_subjek_json || {};



  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-surface-container text-on-surface-variant';
      case 'MENUNGGU': return 'bg-blue-100 text-blue-700';
      case 'PROSES': return 'bg-orange-100 text-orange-700';
      case 'REVISI': return 'bg-yellow-100 text-yellow-800';
      case 'DISETUJUI': return 'bg-green-100 text-green-700';
      case 'DITOLAK': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DRAFT': return 'edit_document';
      case 'MENUNGGU': return 'forward_to_inbox';
      case 'PROSES': return 'cycle';
      case 'REVISI': return 'assignment_return';
      case 'DISETUJUI': return 'check_circle';
      case 'DITOLAK': return 'cancel';
      default: return 'mark_email_read';
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }) + ' WIB';
  };

  const formatStatus = (status) => {
    if (status === 'DRAFT') return 'Draft Pengajuan';
    if (status === 'MENUNGGU') return 'Pengajuan Berkas';
    if (status === 'PROSES') return 'Persetujuan Desa/Kelurahan';
    if (status === 'REVISI') return 'Menunggu Revisi';
    if (status === 'DISETUJUI') return 'Disetujui Bakeuda';
    if (status === 'DITOLAK') return 'Ditolak';
    return status;
  };

  let estimatedDate = '-';
  if (['DISETUJUI', 'SELESAI', 'DITOLAK'].includes(dataTransaksi.status_ajuan)) {
    estimatedDate = dataTransaksi.updated_at ? `Selesai pada ${formatDate(dataTransaksi.updated_at)}` : '-';
  } else if (dataTransaksi.tanggal_pengajuan) {
    const d = new Date(dataTransaksi.tanggal_pengajuan);
    d.setDate(d.getDate() + 7); // Perkiraan 7 hari kerja
    estimatedDate = formatDate(d.toISOString());
  }

  return (
    <main className="p-gutter w-full relative">
      {/* Top Header & Back Button */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/monitoring-pajak')}
            className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-on-surface font-black text-2xl tracking-tight">Pelacakan Dokumen</h2>
            <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">tag</span>
              {dataTransaksi.id_transaksi}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 border shadow-sm font-bold text-sm tracking-wide ${dataTransaksi.status_ajuan === 'DISETUJUI' ? 'bg-green-50 border-green-200 text-green-700' :
          dataTransaksi.status_ajuan === 'DITOLAK' ? 'bg-red-50 border-red-200 text-red-700' :
            dataTransaksi.status_ajuan === 'REVISI' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
          <span className="material-symbols-outlined text-[18px]">
            {dataTransaksi.status_ajuan === 'DISETUJUI' ? 'verified' :
              dataTransaksi.status_ajuan === 'DITOLAK' ? 'cancel' :
                dataTransaksi.status_ajuan === 'REVISI' ? 'error' : 'pending'}
          </span>
          {dataTransaksi.status_ajuan}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Left Column (Details) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Card: Detail Pelayanan */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">description</span>
              </div>
              <h3 className="font-bold text-on-surface tracking-wide">Detail Pelayanan</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold mb-1 uppercase tracking-wider">Tanggal Permohonan</p>
                  <p className="font-bold text-on-surface text-base">{formatDate(dataTransaksi.tanggal_pengajuan)}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold mb-1 uppercase tracking-wider">No. Pelayanan</p>
                  <p className="font-data-mono font-medium text-on-surface text-sm bg-surface-container-low px-2 py-1 rounded inline-block">{dataTransaksi.id_transaksi}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <p className="text-on-surface-variant text-sm font-medium">Jenis Pajak</p>
                  <p className="font-bold text-on-surface text-sm">PBB-P2</p>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <p className="text-on-surface-variant text-sm font-medium">Jenis Pelayanan</p>
                  <p className="font-bold text-on-surface text-sm bg-primary/10 text-primary px-2 py-0.5 rounded inline-flex w-fit">{dataTransaksi.jenis_transaksi}</p>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <p className="text-on-surface-variant text-sm font-medium">Tgl Perkiraan <br /> Selesai</p>
                  <p className="font-bold text-on-surface text-sm">{estimatedDate}</p>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <p className="text-on-surface-variant text-sm font-medium">NOP</p>
                  <p className="font-data-mono font-bold text-on-surface text-sm">{nop}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Detail Pemohon */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <h3 className="font-bold text-on-surface tracking-wide">Detail Pemohon</h3>
            </div>
            <div className="p-6 grid grid-cols-[140px_1fr] gap-y-3 gap-x-4 text-sm">
              <p className="text-on-surface-variant font-medium">Nama Pemohon</p>
              <p className="font-bold text-on-surface">{dataTransaksi.nama_pengaju || dataTransaksi.pengaju?.nama_lengkap || '-'}</p>

              <p className="text-on-surface-variant font-medium">No. Telepon/HP</p>
              <p className="font-bold text-on-surface">{dataTransaksi.pengaju?.no_hp_pengaju || calonSubjek.no_hp || '-'}</p>

              <p className="text-on-surface-variant font-medium">Alamat</p>
              <p className="font-bold text-on-surface">{dataTransaksi.pengaju?.alamat_pengaju || calonSubjek.alamat_jalan || '-'}</p>

              <p className="text-on-surface-variant font-medium">Bertindak Selaku</p>
              <p className="font-bold text-on-surface">{dataTransaksi.menggunakan_kuasa ? 'Kuasa' : 'Wajib Pajak (Pemilik)'}</p>
            </div>
          </div>

          {/* Card: Detail Objek Pajak */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">landscape</span>
              </div>
              <h3 className="font-bold text-on-surface tracking-wide">Detail Objek Pajak</h3>
            </div>
            <div className="p-6 grid grid-cols-[140px_1fr] gap-y-3 gap-x-4 text-sm">
              <p className="text-on-surface-variant font-medium">Letak Objek</p>
              <p className="font-bold text-on-surface">
                {detailTujuan.jalan_op_baru || '-'} RT {detailTujuan.rt_op_baru || '-'}/RW {detailTujuan.rw_op_baru || '-'}<br />
                KEL. {detailTujuan.kelurahan_op_baru || '-'}, KEC. {detailTujuan.kecamatan_op_baru || '-'}
              </p>

              <p className="text-on-surface-variant font-medium">Luas Tanah</p>
              <p className="font-bold text-on-surface">{detailTujuan.luas_tanah_baru || 0} M&sup2;</p>

              <p className="text-on-surface-variant font-medium">Luas Bangunan</p>
              <p className="font-bold text-on-surface">{detailTujuan.luas_bangunan_baru || 0} M&sup2; ({detailTujuan.jumlah_bangunan_baru || 0} Unit)</p>
            </div>
          </div>

          {/* Card: Syarat Pengajuan */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
              </div>
              <h3 className="font-bold text-on-surface tracking-wide">Dokumen Persyaratan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/30 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                    <th className="px-6 py-3 border-b border-outline-variant/50 w-12 text-center">No</th>
                    <th className="px-6 py-3 border-b border-outline-variant/50">Jenis Persyaratan</th>
                    <th className="px-6 py-3 border-b border-outline-variant/50 text-center w-28">Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-sm">
                  {dataTransaksi.lampiran?.length > 0 ? (
                    dataTransaksi.lampiran.map((lampiran, index) => (
                      <tr key={lampiran.id_lampiran} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-3 text-center text-on-surface-variant font-medium">{index + 1}</td>
                        <td className="px-6 py-3 font-semibold text-on-surface capitalize">
                          {lampiran.jenis_dokumen.replace(/_/g, ' ').toLowerCase()}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <a
                            href={lampiran.url_file}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors rounded-lg font-bold text-xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">download</span>
                            Unduh
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-on-surface-variant italic">
                        Tidak ada lampiran dokumen.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (Timeline) */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center gap-3 bg-surface-container-low/30">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">history</span>
              </div>
              <h3 className="font-bold text-on-surface tracking-wide">Riwayat Pelacakan</h3>
            </div>

            <div className="p-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-outline-variant/40 rounded-full"></div>

              <div className="space-y-6">
                {dataTransaksi.riwayat?.map((item, index) => {
                  const statusRiwayat = item.status_baru || item.status_riwayat;
                  const waktuKejadian = item.created_at || item.waktu_kejadian;
                  const keterangan = item.catatan || item.keterangan;

                  return (
                    <div key={item.id_riwayat || index} className="relative flex items-start gap-4">
                      {/* Timeline Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 ring-4 ring-surface-container-lowest shadow-sm ${getStatusColor(statusRiwayat)}`}>
                        <span className="material-symbols-outlined text-[18px]">{getStatusIcon(statusRiwayat)}</span>
                      </div>

                      {/* Content */}
                      <div className="pt-1 pb-2">
                        <h4 className="font-bold text-on-surface text-sm mb-1">{formatStatus(statusRiwayat)}</h4>
                        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium mb-1.5 opacity-80">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {waktuKejadian ? formatDateTime(waktuKejadian) : '-'}
                        </div>
                        {keterangan && (
                          <div className="bg-surface-container-low/50 px-3 py-2 rounded-lg text-xs text-on-surface-variant border border-outline-variant/50 mt-1">
                            {keterangan}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
