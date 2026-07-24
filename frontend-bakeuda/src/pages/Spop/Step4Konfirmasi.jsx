import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSpop } from '../../context/SpopContext';
import ToastNotification from '../../components/ToastNotification';
import api from '../../utils/axios';

// Fix leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const dotIcon = L.divIcon({
  className: 'custom-dot-icon',
  html: '<div style="width: 12px; height: 12px; background-color: white; border: 2px solid blue; border-radius: 50%; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});
export default function Step4Konfirmasi() {
  const { formData, setFormData, saveDraft, idTransaksi, spopData, updateCompletion } = useSpop();
  const [showBangunanModal, setShowBangunanModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [jenisDokumenUpload, setJenisDokumenUpload] = useState('KTP');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [previewDocUid, setPreviewDocUid] = useState(null); // to track which document uid is being cropped
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [cropHistory, setCropHistory] = useState({});
  const [hapusNopData, setHapusNopData] = useState(null);

  React.useEffect(() => {
    if (formData.transaksi === 'HAPUS' && formData.nopAsalList?.[0]) {
      const fetchHapusNopData = async () => {
        try {
          const rawNop = formData.nopAsalList[0].replace(/\D/g, '');
          if (rawNop.length === 18) {
            const res = await api.get(`/objek-pajak/${rawNop}`);
            if (res.data?.success) {
              const data = res.data.data;
              setHapusNopData({
                nama: data.subjek_pajak?.nama_subjek,
                nik: data.subjek_pajak?.nik,
                npwp: data.subjek_pajak?.npwp,
                noTelp: data.subjek_pajak?.no_hp,
                email: data.subjek_pajak?.email,
                statusWp: data.subjek_pajak?.status_wp,
                pekerjaan: data.subjek_pajak?.pekerjaan,
                alamat: data.subjek_pajak?.alamat_jalan,
                rt: data.subjek_pajak?.rt,
                rw: data.subjek_pajak?.rw,
                kabupaten: data.subjek_pajak?.kabupaten,
                kelurahan: data.subjek_pajak?.kelurahan,
                kecamatan: data.subjek_pajak?.kecamatan,
                alamatObjek: data.jalan_op,
                luasTanah: data.luas_tanah,
                rtObjek: data.rt_op,
                rwObjek: data.rw_op,
                kelurahanObjek: data.kelurahan_op,
                kecamatanObjek: data.kecamatan_op,
                noPersil: data.no_persil,
                jenisTanah: data.jenis_tanah,
                jumlahBangunan: data.bangunan?.length || 0,
                luasBangunan: data.luas_bangunan || 0,
                batasUtara: data.batas_utara,
                batasSelatan: data.batas_selatan,
                batasTimur: data.batas_timur,
                batasBarat: data.batas_barat,
                koordinat_polygon: data.koordinat_polygon
              });
            }
          }
        } catch (e) {
          console.error('Failed to fetch NOP data', e);
        }
      };
      fetchHapusNopData();
    }
  }, [formData.transaksi, formData.nopAsalList]);

  const handleUndo = () => {
    const docHist = cropHistory[previewDocUid];
    if (!docHist || docHist.currentIndex <= 0) return;
    const newIndex = docHist.currentIndex - 1;
    const oldUrl = docHist.history[newIndex];
    setCropHistory(prev => ({ ...prev, [previewDocUid]: { ...docHist, currentIndex: newIndex } }));
    setFormData(prev => ({
      ...prev,
      lampiran: prev.lampiran.map(l => l.uid === previewDocUid ? { ...l, url_file: oldUrl } : l)
    }));
    setPreviewImage(oldUrl);
  };

  const handleRedo = () => {
    const docHist = cropHistory[previewDocUid];
    if (!docHist || docHist.currentIndex >= docHist.history.length - 1) return;
    const newIndex = docHist.currentIndex + 1;
    const newUrl = docHist.history[newIndex];
    setCropHistory(prev => ({ ...prev, [previewDocUid]: { ...docHist, currentIndex: newIndex } }));
    setFormData(prev => ({
      ...prev,
      lampiran: prev.lampiran.map(l => l.uid === previewDocUid ? { ...l, url_file: newUrl } : l)
    }));
    setPreviewImage(newUrl);
  };

  const getCroppedImg = async (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleSaveCrop = async () => {
    if (!completedCrop || !imgRef.current || previewDocUid === null) return;
    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop, 'cropped_image.jpg');
      
      const formUpload = new FormData();
      formUpload.append('file', croppedBlob, 'cropped_image.jpg');
      
      const uploadRes = await api.post('/transaksi-spop/upload', formUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = uploadRes.data.url_file || uploadRes.data.url;
      
      setFormData(prev => ({
        ...prev,
        lampiran: prev.lampiran.map(l => l.uid === previewDocUid ? { ...l, url_file: fileUrl } : l)
      }));
      setCropHistory(prev => {
        const docHist = prev[previewDocUid] || { history: [previewImage], currentIndex: 0 };
        const newHistory = docHist.history.slice(0, docHist.currentIndex + 1);
        newHistory.push(fileUrl);
        return {
          ...prev,
          [previewDocUid]: { history: newHistory, currentIndex: newHistory.length - 1 }
        };
      });
      setPreviewImage(fileUrl);
      setIsCropping(false);
      setToast({ show: true, message: 'Gambar berhasil dipotong dan diperbarui', type: 'success' });
    } catch (e) {
      console.error(e);
      setToast({ show: true, message: 'Gagal memotong gambar', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const renderDataBlock = (data, idx = null) => {
    let calcLuasBangunan = data.luasBangunan || '0';
    if (parseFloat(calcLuasBangunan) === 0 && Array.isArray(formData.data_bangunan_json)) {
      const bgnList = idx !== null 
        ? formData.data_bangunan_json.filter(b => b._pecahanIndex === idx)
        : formData.data_bangunan_json;
      const sum = bgnList.reduce((acc, b) => acc + (parseFloat(b.luasBangunan || b.luas_bangunan) || 0), 0);
      if (sum > 0) calcLuasBangunan = sum.toString();
    }

    return (
    <div key={idx ?? 'single'} className={idx !== null ? 'p-6 border-b border-outline-variant last:border-b-0' : 'p-6'}>
      {idx !== null && (
        <h5 className="font-bold text-lg text-primary mb-6 bg-primary/10 inline-block px-4 py-2 rounded-lg">
          PECAHAN {idx + 1}
        </h5>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h6 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-outline-variant pb-2">Identitas Subjek Pajak</h6>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1.5 text-on-surface-variant w-1/3">Nama Lengkap</td>
                <td className="py-1.5 font-bold text-on-surface">{data.nama || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">NIK (No. KTP)</td>
                <td className="py-1.5 font-data-mono text-on-surface">{data.nik || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">NPWP</td>
                <td className="py-1.5 font-data-mono text-on-surface">{data.npwp || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">NPWPD</td>
                <td className="py-1.5 font-data-mono text-on-surface">{data.npwpd || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">No. Telp / HP</td>
                <td className="py-1.5 font-data-mono text-on-surface">{data.noTelp || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">Email</td>
                <td className="py-1.5 text-on-surface">{data.email || '-'}</td>
              </tr>

              <tr>
                <td className="py-1.5 text-on-surface-variant">Status WP</td>
                <td className="py-1.5 text-on-surface">{data.statusWp || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">Pekerjaan</td>
                <td className="py-1.5 text-on-surface">{data.pekerjaan === 'ABRI' ? 'TNI/POLRI' : (data.pekerjaan || '-')}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant align-top">Alamat WP</td>
                <td className="py-1.5 text-on-surface leading-snug">
                  {data.alamat || '-'}, RT {data.rt || '-'}/RW {data.rw || '-'}, {data.kelurahan || '-'}, {data.kabupaten || '-'}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="pt-4 space-y-4">
            <h6 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-outline-variant pb-2">Titik Koordinat</h6>
            <div className="font-data-mono text-on-surface">
              {data.koordinat_polygon && data.koordinat_polygon.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {data.koordinat_polygon.map((pos, i) => (
                    <div key={i} className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/50 text-xs flex flex-col gap-1.5 shadow-sm">
                      <span className="font-bold text-primary border-b border-outline-variant/30 pb-1 mb-0.5">Titik Koordinat Ke-{i + 1}</span>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-on-surface-variant font-medium">Latitude (Garis Lintang)</span>
                        <span className="font-data-mono">{pos.lat}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-on-surface-variant font-medium">Longitude (Garis Bujur)</span>
                        <span className="font-data-mono">{pos.lng}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : data.latitude && data.longitude ? (
                <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/50 text-xs flex flex-col gap-1.5 shadow-sm">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-on-surface-variant font-medium">Latitude (Garis Lintang)</span>
                    <span className="font-data-mono">{data.latitude}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-on-surface-variant font-medium">Longitude (Garis Bujur)</span>
                    <span className="font-data-mono">{data.longitude}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-on-surface-variant font-sans">Belum ditentukan</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h6 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-outline-variant pb-2">Spesifikasi Objek Pajak</h6>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1.5 text-on-surface-variant w-1/3">Alamat Objek</td>
                <td className="py-1.5 font-bold text-on-surface">{data.alamatObjek || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">Luas Tanah</td>
                <td className="py-1.5 font-bold text-on-surface">{data.luasTanah || '-'} M²</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant align-top">Detail Wilayah</td>
                <td className="py-1.5 text-on-surface leading-snug">
                  RT {data.rtObjek || '-'}/RW {data.rwObjek || '-'}, {data.kelurahanObjek || '-'}, {data.kecamatanObjek || '-'}
                </td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">No. Persil</td>
                <td className="py-1.5 font-data-mono text-on-surface">{formData.noPersil || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">Jenis Tanah</td>
                <td className="py-1.5 text-on-surface">{data.jenisTanah || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">Bangunan</td>
                <td className="py-1.5 text-on-surface flex items-center gap-2">
                  {data.jumlahBangunan || '0'} Unit ({calcLuasBangunan} M²)
                  {parseInt(data.jumlahBangunan || '0') > 0 && (
                    <button onClick={() => setShowBangunanModal(true)} className="text-xs text-primary underline hover:text-primary/80 font-bold ml-2">
                      Lihat Detail
                    </button>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">Batas Utara</td>
                <td className="py-1.5 font-data-mono text-on-surface">{data.batasUtara || '-'}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-on-surface-variant">Batas Selatan</td>
                <td className="py-1.5 font-data-mono text-on-surface">{data.batasSelatan || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-end border-b border-outline-variant pb-2">
              <h6 className="font-bold text-primary uppercase text-xs tracking-wider">Peta Lokasi Objek</h6>
              <button onClick={() => navigate(`/spop/objek-pajak/${idTransaksi || ''}`)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline transition-all">
                <span className="material-symbols-outlined text-[14px]">edit_location_alt</span>
                Ubah Peta / Titik
              </button>
            </div>
            <div className="h-[280px] w-full rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm z-0 relative">
              {(data.koordinat_polygon && data.koordinat_polygon.length > 0) || (data.latitude && data.longitude) ? (
                <MapContainer 
                  key={`map-konfirmasi-${idx ?? 'single'}`}
                  center={data.koordinat_polygon?.length > 0 ? [data.koordinat_polygon[0].lat, data.koordinat_polygon[0].lng] : [parseFloat(data.latitude), parseFloat(data.longitude)]} 
                  zoom={17} 
                  style={{ height: '100%', width: '100%', zIndex: 0 }}
                  zoomControl={true}
                  scrollWheelZoom={true}
                  dragging={true}
                  doubleClickZoom={true}
                >
                  <TileLayer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} maxZoom={20} />
                  {data.koordinat_polygon && data.koordinat_polygon.length > 0 ? (
                    <>
                      <Polygon positions={data.koordinat_polygon} color="blue" />
                      {data.koordinat_polygon.map((pos, i) => (
                        <Marker key={i} position={[pos.lat, pos.lng]} icon={dotIcon} />
                      ))}
                    </>
                  ) : (
                    <Marker position={[parseFloat(data.latitude), parseFloat(data.longitude)]} icon={dotIcon} />
                  )}
                </MapContainer>
              ) : (
                <div className="w-full h-full bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant gap-2">
                  <span className="material-symbols-outlined text-4xl opacity-50">location_off</span>
                  <p className="text-sm italic font-sans">Peta belum ditentukan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setToast({ show: true, message: 'Ukuran file maksimal 2MB', type: 'error' });
      return;
    }

    setIsUploading(true);
    const formUpload = new FormData();
    formUpload.append('file', file);
    
    try {
      const uploadRes = await api.post('/transaksi-spop/upload', formUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = uploadRes.data.url_file || uploadRes.data.url;
      
      setFormData(prev => ({
        ...prev, 
        lampiran: [...prev.lampiran, { jenis_dokumen: jenisDokumenUpload, url_file: fileUrl }] 
      }));
      setToast({ show: true, message: 'Dokumen berhasil diunggah', type: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      setToast({ show: true, message: 'Gagal mengunggah file', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState({ show: false, id: null });

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const newId = await saveDraft();
      
      // Jika disetujui, ajukan
      if (formData.persetujuan) {
        await api.post(`/transaksi-spop/${newId}/submit`);
        updateCompletion(5, true);
      }

      setShowSuccessModal({ show: true, id: newId });
    } catch (error) {
      console.error('SAVE DRAFT/SUBMIT ERROR:', error.response?.data?.message || error.message);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan langkah ini.';
      let displayMsg = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
      setToast({ show: true, message: displayMsg, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {toast.show && (
        <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'success' })} />
      )}

      {showSuccessModal.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-scaleIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {formData.transaksi === 'HAPUS' ? 'Berhasil Diajukan!' : 'Berhasil Disimpan!'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {formData.transaksi === 'HAPUS' 
                ? 'Pengajuan penghapusan objek pajak Anda telah berhasil dikirim. Silakan cek status pengajuan Anda.' 
                : 'Data SPOP Anda telah berhasil disimpan dan diajukan. Silakan cek status pengajuan Anda.'}
            </p>
            <button
              onClick={() => navigate(`/spop/status/${showSuccessModal.id}`)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Lihat Status Pengajuan
            </button>
          </div>
        </div>
      )}
      
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 bg-primary h-8 rounded-full"></div>
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
            D. TINJAU KEMBALI DATA ANDA
          </h4>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="bg-surface-container-low border-b border-outline-variant px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">Jenis Transaksi</p>
              <p className="font-bold text-on-surface text-lg uppercase mt-0.5">
                {formData.kategoriTransaksi === 'baru' ? 'Perekaman Data Baru' : formData.kategoriTransaksi === 'update' ? 'Pemutakhiran Data' : 'Penghapusan Data'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">NOP Objek Pajak</p>
              <p className="font-data-mono font-bold text-on-surface text-lg mt-0.5">
                {['BARU', 'PECAH'].includes(formData.transaksi) ? (
                  <span className="text-on-surface-variant text-sm italic">Akan digenerate oleh Bakeuda</span>
                ) : ['HAPUS', 'GABUNG'].includes(formData.transaksi) ? (
                  formData.nopAsalList?.filter(Boolean).join(', ') || '-'
                ) : (
                  `33.03.${formData.nop.kec || '___'}.${formData.nop.kel || '___'}.${formData.nop.blok || '___'}.${formData.nop.nourut || '____'}.${formData.nop.kode || '_'}`
                )}
              </p>
            </div>
          </div>

          {formData.transaksi === 'PECAH' && formData.pecahanList?.length > 0 ? (
            <div className="divide-y divide-outline-variant">
              {formData.pecahanList.map((p, idx) => renderDataBlock(p, idx))}
            </div>
          ) : formData.transaksi === 'HAPUS' ? (
            <div className="divide-y divide-outline-variant">
               <div className="p-6 bg-red-50/50">
                 <h5 className="font-bold text-error uppercase text-xs tracking-wider mb-2">Alasan Penghapusan:</h5>
                 <p className="text-on-surface text-sm italic">"{formData.catatanPengaju || '-'}"</p>
               </div>
               {hapusNopData ? renderDataBlock(hapusNopData) : <div className="p-6 text-center text-on-surface-variant text-sm font-bold">Memuat data NOP...</div>}
            </div>
          ) : (
            renderDataBlock(formData)
          )}
        </div>

        {/* LAMPIRAN */}
        <div className="pt-6 border-t border-outline-variant space-y-4">
          <h4 className="text-lg font-bold text-on-surface uppercase mb-4">
            LAMPIRAN DOKUMEN PENDUKUNG
          </h4>
          <div className="space-y-4">
            {formData.lampiran.map((doc, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border border-outline-variant rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{doc.jenis_dokumen} #{idx + 1}</p>
                    <button type="button" onClick={() => { 
                      setPreviewImage(doc.url_file);
                      let docUid = doc.uid;
                      if (!docUid) {
                        docUid = Math.random().toString(36).substring(2, 9);
                        setFormData(prev => ({
                          ...prev,
                          lampiran: prev.lampiran.map((l, i) => i === idx ? { ...l, uid: docUid } : l)
                        }));
                      }
                      setPreviewDocUid(docUid); 
                      setZoomLevel(1); 
                      setIsCropping(false);
                      setCropHistory(prev => prev[docUid] ? prev : { ...prev, [docUid]: { history: [doc.url_file], currentIndex: 0 } });
                    }} className="text-xs text-primary hover:underline font-semibold cursor-pointer">Lihat Pratinjau Dokumen</button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    lampiran: prev.lampiran.filter((_, i) => i !== idx)
                  }))}
                  className="material-symbols-outlined text-error hover:scale-110 transition-transform"
                >
                  delete
                </button>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="space-y-1 w-full sm:w-auto">
                <label className="text-sm text-on-surface-variant font-bold block">Jenis Dokumen</label>
                <select 
                  value={jenisDokumenUpload}
                  onChange={(e) => setJenisDokumenUpload(e.target.value)}
                  className="h-12 border border-outline-variant rounded-lg pl-4 pr-10 bg-white shadow-sm focus:border-primary focus:ring-1 focus:ring-primary font-bold text-sm w-full sm:w-auto outline-none"
                >
                  <option value="KTP">KTP</option>
                  <option value="Sertifikat Hak Milik">Sertifikat Hak Milik</option>
                  <option value="Akte Jual Beli">Akte Jual Beli</option>
                  <option value="Izin Mendirikan Bangunan">Izin Mendirikan Bangunan</option>
                  <option value="Dokumen Pendukung Lokasi">Dokumen Pendukung Lokasi</option>
                </select>
              </div>

              {/* Upload Button */}
              <div className="relative overflow-hidden w-full sm:w-auto inline-block sm:mt-6">
                <button
                  type="button"
                  disabled={isUploading}
                  className={`flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg border border-dashed border-primary text-primary font-bold hover:bg-primary/90/10 transition-colors ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <span className="material-symbols-outlined">{isUploading ? 'hourglass_empty' : 'upload_file'}</span>
                  {isUploading ? 'Mengunggah...' : '+ Tambah Dokumen'}
                </button>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PERNYATAAN */}
        <div className="pt-6 border-t border-outline-variant space-y-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-1 bg-primary h-8 rounded-full"></div>
            <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
              {formData.transaksi === 'HAPUS' ? 'F. PERNYATAAN PENGAJUAN PENGHAPUSAN' : 'F. PERNYATAAN SUBJEK PAJAK'}
            </h4>
          </div>
          <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl space-y-4">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {formData.transaksi === 'HAPUS' 
                ? 'Saya menyatakan bahwa pengajuan penghapusan NOP ini dilakukan secara sadar, dapat dipertanggungjawabkan, dan alasan yang diberikan adalah benar sesuai keadaan yang sebenarnya.'
                : <span>Saya menyatakan bahwa informasi yang telah saya berikan dalam formulir ini termasuk lampirannya adalah <b>benar, jelas, dan lengkap</b> menurut keadaan yang sebenarnya, sesuai dengan Pasal 10 ayat (2) Peraturan Daerah Kabupaten Purbalingga No.15 Tahun 2012.</span>}
            </p>

            <label className="flex items-start gap-3 cursor-pointer mt-4 p-3 border border-outline-variant rounded-lg hover:bg-white transition-colors bg-white">
              <input
                type="checkbox"
                className="w-5 h-5 mt-0.5 text-primary focus:ring-primary border-outline-variant rounded"
                checked={formData.persetujuan || false}
                onChange={(e) => setFormData(prev => ({ ...prev, persetujuan: e.target.checked }))}
              />
              <span className="font-bold text-on-surface text-sm">
                Ya, saya menyetujui pernyataan di atas.
              </span>
            </label>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-8 border-t border-outline-variant gap-3">
        <button type="button" onClick={() => {
          const isHapus = formData?.transaksi === 'HAPUS' || spopData?.jenis_transaksi === 'HAPUS';
          const isMutasi = formData?.transaksi === 'MUTASI' || spopData?.jenis_transaksi === 'MUTASI';
          const isPerubahanData = formData?.transaksi === 'PERUBAHAN_DATA' || spopData?.jenis_transaksi === 'PERUBAHAN_DATA';
          const jumlahBangunan = parseInt(formData?.jumlahBangunan || spopData?.detail_tujuan?.[0]?.jumlah_bangunan_baru || 0);
          
          if (isHapus) {
            navigate(`/spop/informasi-umum/${idTransaksi || ''}`);
          } else if (isMutasi) {
            navigate(`/spop/subjek-pajak/${idTransaksi || ''}`);
          } else if (jumlahBangunan > 0) {
            navigate(`/spop/data-bangunan/${idTransaksi || ''}`);
          } else {
            navigate(`/spop/objek-pajak/${idTransaksi || ''}`);
          }
        }} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
          Kembali
        </button>
        <button type="button" onClick={handleSave} disabled={isSubmitting || !formData.persetujuan} className={`px-6 py-2.5 rounded-full font-bold shadow-md transition-all flex items-center gap-2 ${!formData.persetujuan ? 'bg-gray-300 text-on-surface-variant cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}>
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          Simpan & Ajukan
        </button>
      </div>

      {/* BANGUNAN MODAL */}
      {showBangunanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-primary uppercase tracking-wider">Detail Data Bangunan</h3>
              <button onClick={() => setShowBangunanModal(false)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">close</button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4 bg-surface-container-lowest custom-scrollbar">
              {(() => {
                let parsedList = [];
                try {
                  if (formData?.transaksi === 'PECAH') {
                    if (formData?.data_bangunan_json && formData.data_bangunan_json.length > 0) {
                       parsedList = formData.data_bangunan_json;
                    } else if (spopData?.detail_tujuan) {
                       spopData.detail_tujuan.forEach(t => {
                          if (t.data_bangunan_json) {
                             let parsed = typeof t.data_bangunan_json === 'string' ? JSON.parse(t.data_bangunan_json) : t.data_bangunan_json;
                             if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                             if (Array.isArray(parsed)) parsedList.push(...parsed);
                          }
                       });
                    }
                  } else {
                    if (formData?.data_bangunan_json) {
                      parsedList = formData.data_bangunan_json;
                      if (typeof parsedList === 'string') parsedList = JSON.parse(parsedList);
                    } else {
                      const detailTujuan = spopData?.detail_tujuan?.[0];
                      if (detailTujuan?.data_bangunan_json) {
                        parsedList = detailTujuan.data_bangunan_json;
                        if (typeof parsedList === 'string') parsedList = JSON.parse(parsedList);
                      }
                    }
                  }
                } catch (e) { console.error('Gagal parse bangunan', e); }

                if (!parsedList || parsedList.length === 0) {
                  return <p className="text-center italic text-on-surface-variant py-8">Tidak ada detail data bangunan yang diisi.</p>;
                }

                return parsedList.map((b, i) => (
                  <div key={i} className="border border-outline-variant rounded-xl bg-white shadow-sm mb-6 overflow-hidden">
                    <div className="bg-primary/5 px-5 py-3 border-b border-outline-variant flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
                      <h4 className="font-bold text-primary uppercase tracking-wider text-sm">Bangunan Ke-{i + 1}</h4>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {Object.entries(b)
                          .filter(([k, v]) => v && v !== '' && v !== '0' && k !== 'nomorBangunan' && k !== '_pecahanIndex' && typeof v !== 'object')
                          .map(([k, v]) => (
                            <div key={k} className="flex flex-col border-b border-outline-variant/40 pb-2">
                               <span className="text-on-surface-variant uppercase text-[10px] tracking-widest font-bold mb-1">
                                 {k.replace(/([A-Z])/g, ' $1').trim()}
                               </span>
                               <span className="font-semibold text-on-surface text-sm">
                                {(() => {
                                  const keyLower = k.toLowerCase();
                                  if (isNaN(v) || v === 'Ada' || v === 'Tidak Ada') return v;
                                  if (keyLower.includes('luas') || keyLower.includes('halaman') || keyLower.includes('m2') || keyLower.includes('bangunanm2')) return `${v} m²`;
                                  if (keyLower.includes('listrik')) return `${v} Watt`;
                                  if (keyLower.includes('panjang') || keyLower.includes('sumur')) return `${v} meter`;
                                  if (keyLower.includes('ac') && keyLower !== 'acsentral' || 
                                      keyLower.includes('lapangan') || 
                                      keyLower.includes('lift') || 
                                      keyLower.includes('tangga') || 
                                      keyLower.includes('pabx')) return `${v} Unit`;
                                  return v;
                                })()}
                               </span>
                            </div>
                          ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end">
              <button 
                onClick={() => {
                  setShowBangunanModal(false);
                  navigate(`/spop/data-bangunan/${idTransaksi || ''}`);
                }}
                className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Ubah Data Bangunan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PREVIEW IMAGE MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-white z-10">
              <h3 className="font-bold text-lg text-primary uppercase tracking-wider">{isCropping ? 'Potong Dokumen' : 'Pratinjau Dokumen'}</h3>
              <div className="flex items-center gap-2">
                {!isCropping && (
                  <>
                    <button 
                      onClick={handleUndo} 
                      disabled={!cropHistory[previewDocUid] || cropHistory[previewDocUid].currentIndex <= 0} 
                      className="p-2 rounded-full transition-colors material-symbols-outlined disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant hover:bg-surface-container-low" 
                      title="Undo Crop"
                    >undo</button>
                    <button 
                      onClick={handleRedo} 
                      disabled={!cropHistory[previewDocUid] || cropHistory[previewDocUid].currentIndex >= cropHistory[previewDocUid].history.length - 1} 
                      className="p-2 rounded-full transition-colors material-symbols-outlined disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant hover:bg-surface-container-low" 
                      title="Redo Crop"
                    >redo</button>
                    <div className="w-px h-6 bg-outline-variant mx-1"></div>
                    <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))} className="p-2 hover:bg-surface-container-low rounded-full transition-colors material-symbols-outlined text-on-surface-variant" title="Zoom Out">zoom_out</button>
                    <span className="text-xs font-bold text-on-surface-variant w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))} className="p-2 hover:bg-surface-container-low rounded-full transition-colors material-symbols-outlined text-on-surface-variant" title="Zoom In">zoom_in</button>
                    <div className="w-px h-6 bg-outline-variant mx-2"></div>
                    <button onClick={() => setIsCropping(true)} className="px-4 py-1.5 text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">crop</span> Crop
                    </button>
                    <div className="w-px h-6 bg-outline-variant mx-2"></div>
                  </>
                )}

                <button onClick={() => { setPreviewImage(null); setIsCropping(false); }} className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-colors material-symbols-outlined text-on-surface-variant" disabled={isUploading}>close</button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-surface-container flex items-center justify-center p-4 relative custom-scrollbar">
              {isCropping ? (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  className="shadow-md mx-auto"
                  style={{ maxHeight: '70vh', maxWidth: '100%' }}
                >
                  <img
                    ref={imgRef}
                    src={previewImage}
                    alt="Crop Dokumen"
                    crossOrigin="anonymous"
                    style={{ maxHeight: '70vh', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </ReactCrop>
              ) : (
                <img 
                  src={previewImage} 
                  alt="Preview Dokumen" 
                  crossOrigin="anonymous"
                  className="max-h-[70vh] max-w-full object-contain transition-transform duration-200 shadow-md"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                />
              )}
            </div>
            {isCropping && (
              <div className="p-4 border-t border-outline-variant bg-white flex justify-end gap-3 z-10">
                <button onClick={() => setIsCropping(false)} disabled={isUploading} className="px-6 py-2 text-sm font-bold text-on-surface hover:bg-surface-container-low rounded-full transition-colors border border-outline-variant">Batal</button>
                <button onClick={handleSaveCrop} disabled={isUploading || !completedCrop} className="px-6 py-2 text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-full transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                  {isUploading ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">check</span>} 
                  Simpan Potongan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
