import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSpop } from '../../context/SpopContext';
import ToastNotification from '../../components/ToastNotification';
import WilayahDropdown from '../../components/WilayahDropdown';

// Fix leaflet icon issues in React
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

function MapClickHandler({ koordinatPolygon, setFormData }) {
  useMapEvents({
    click(e) {
      setFormData(prev => {
        const newCoords = [...(prev.koordinat_polygon || []), { lat: e.latlng.lat, lng: e.latlng.lng }];
        return {
          ...prev,
          koordinat_polygon: newCoords,
          latitude: newCoords.length === 1 ? e.latlng.lat.toString() : prev.latitude,
          longitude: newCoords.length === 1 ? e.latlng.lng.toString() : prev.longitude
        };
      });
    },
  });
  return null;
}

export default function Step3ObjekPajak() {
  const { formData, setFormData, errors, saveDraft, idTransaksi } = useSpop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  // Purbalingga Default Coordinates
  const currentPosition = [formData.latitude || -7.38883, formData.longitude || 109.36647];

  const handleTextChange = (field, e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const newId = await saveDraft();
      setToast({ show: true, message: 'Langkah 3 berhasil disimpan.', type: 'success' });
      const savedId = idTransaksi || newId;
      if (savedId) {
        navigate(`/spop/detail/${savedId}`);
      }
    } catch (error) {
      console.error('Error saving step:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan langkah ini.';
      setToast({ show: true, message: errorMsg, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {toast.show && (
        <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'success' })} />
      )}
      
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 bg-primary h-8 rounded-full"></div>
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
            DATA LETAK OBJEK PAJAK
          </h4>
        </div>

        {/* Baris 1: No.Persil + Alamat */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="font-label-sm text-primary block">No. PERSIL</label>
            <input
              type="text"
              maxLength={50}
              value={formData.noPersil}
              onChange={(e) => handleTextChange('noPersil', e)}
              className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none"
              placeholder="No. persil"
            />
          </div>
          <div className="md:col-span-3 space-y-1">
            <label className="font-label-sm text-primary block">JALAN (ALAMAT OBJEK PAJAK)</label>
            <input
              type="text"
              maxLength={255}
              value={formData.alamatObjek}
              onChange={(e) => handleTextChange('alamatObjek', e)}
              className={`w-full h-11 border ${errors.alamatObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 bg-white shadow-sm outline-none`}
              placeholder="Nama jalan dan nomor objek pajak"
            />
            {errors.alamatObjek && <p className="text-error text-[12px]">{errors.alamatObjek}</p>}
          </div>
        </div>

        {/* Baris 2: Blok/Kav + RW + RT */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm text-on-surface-variant font-bold">BLOK/KAV/NOMOR <span className="text-gray-400 font-normal text-[11px]">(Opsional)</span></label>
            <input
              type="text"
              maxLength={50}
              value={formData.blokKavObjek}
              onChange={(e) => handleTextChange('blokKavObjek', e)}
              className="w-full h-11 border border-outline-variant rounded px-4 bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none"
              placeholder="Blok A / No. 1"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-bold">RW</label>
            <input
              type="text"
              maxLength={3}
              value={formData.rwObjek}
              onChange={(e) => handleTextChange('rwObjek', { target: { value: e.target.value.replace(/\D/g, '') } })}
              className="w-full h-11 border border-outline-variant rounded px-4 text-center font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none"
              placeholder="000"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-bold">RT</label>
            <input
              type="text"
              maxLength={3}
              value={formData.rtObjek}
              onChange={(e) => handleTextChange('rtObjek', { target: { value: e.target.value.replace(/\D/g, '') } })}
              className="w-full h-11 border border-outline-variant rounded px-4 text-center font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm outline-none"
              placeholder="000"
            />
          </div>
        </div>

        {/* Baris 3: Kecamatan + Kelurahan — satu baris */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WilayahDropdown
            selectedKecamatan={formData.kecamatanObjek}
            selectedKelurahan={formData.kelurahanObjek}
            labelKecamatan="KECAMATAN"
            labelKelurahan="KELURAHAN/DESA"
            onSelect={(namaKec, namaKel, kodeKec, kodeKel) => {
              setFormData(prev => {
                const kecKode = kodeKec ? kodeKec.substring(4, 7) : '';
                const kelKode = kodeKel ? kodeKel.substring(7, 10) : '';
                const isBaruJenis = ['BARU', 'PECAH', 'GABUNG'].includes(prev.transaksi);
                return {
                  ...prev,
                  kecamatanObjek: namaKec,
                  kelurahanObjek: namaKel,
                  kodeWilayahObjek: kodeKel || kodeKec || prev.kodeWilayahObjek,
                  nop: isBaruJenis ? { ...prev.nop, kec: kecKode, kel: kelKode } : prev.nop,
                };
              });
            }}
            errorKecamatan={errors.kecamatanObjek}
            errorKelurahan={errors.kelurahanObjek}
            required={true}
          />
        </div>
      </section>


      <section className="space-y-6 pt-8 border-t border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-1 bg-primary h-8 rounded-full"></div>
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
            DATA TANAH
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label-sm text-primary block">LUAS TANAH (M²)</label>
            <input
              type="number"
              value={formData.luasTanah}
              onChange={(e) => handleTextChange('luasTanah', e)}
              onWheel={(e) => e.target.blur()}
              className={`w-full h-12 border ${errors.luasTanah ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-data-mono bg-white shadow-sm outline-none`}
              placeholder="Contoh: 150"
            />
            {errors.luasTanah && <p className="text-error text-[12px]">{errors.luasTanah}</p>}
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-primary block">ZONA NILAI TANAH</label>
            <input
              type="text"
              value={formData.zonaNilaiTanah || ''}
              readOnly
              className="w-full h-12 border border-outline-variant rounded px-4 font-data-mono bg-surface-container-low shadow-sm cursor-not-allowed text-on-surface-variant outline-none"
              placeholder="Dilarang diisi (Diisi oleh Sistem/Petugas)"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="font-label-sm text-primary block">JENIS TANAH</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Tanah + Bangunan', val: 'TANAH_BANGUNAN' },
                { label: 'Kavling Siap Bangun', val: 'KAVLING_SIAP_BANGUN' },
                { label: 'Tanah Kosong', val: 'TANAH_KOSONG' },
                { label: 'Fasilitas Umum', val: 'FASILITAS_UMUM' },
              ].map(({ label, val }) => (
                <label
                  key={val}
                  className={`flex items-center gap-2 p-3 border rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer ${errors.jenisTanah ? 'border-error' : 'border-outline-variant'}`}
                >
                  <input
                    type="radio"
                    name="jenisTanah"
                    value={val}
                    checked={formData.jenisTanah === val}
                    onChange={(e) => handleTextChange('jenisTanah', e)}
                    className="w-4 h-4 text-primary focus:ring-primary border-outline-variant flex-shrink-0"
                  />
                  <span className="text-sm font-medium text-on-surface leading-snug">{label}</span>
                </label>
              ))}
            </div>
            {errors.jenisTanah && <p className="text-error text-[12px] mt-1">{errors.jenisTanah}</p>}
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant space-y-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-1 bg-primary h-8 rounded-full"></div>
            <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
              DATA BANGUNAN
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-sm text-primary block">JUMLAH BANGUNAN (UNIT)</label>
              <input
                type="text"
                value={formData.jenisTanah !== 'TANAH_BANGUNAN' ? '0' : formData.jumlahBangunan}
                onChange={(e) => handleTextChange('jumlahBangunan', { target: { value: e.target.value.replace(/\D/g, '') } })}
                disabled={formData.jenisTanah !== 'TANAH_BANGUNAN'}
                className={`w-full h-12 border ${errors.jumlahBangunan ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 font-data-mono bg-white shadow-sm outline-none ${formData.jenisTanah !== 'TANAH_BANGUNAN' ? 'bg-surface-container cursor-not-allowed opacity-70' : ''}`}
                placeholder="Contoh: 1"
              />
            </div>
          </div>
          {parseInt(formData.jumlahBangunan) > 0 && (
            <div className="mt-2 p-3 bg-primary/10 text-on-surface rounded-lg text-sm flex items-start gap-2 max-w-2xl border border-primary/20">
              <span className="material-symbols-outlined text-sm mt-0.5">info</span>
              <p>Terdapat bangunan pada objek pajak ini. Anda diwajibkan mengisi formulir <b>LSPOP</b> (Lampiran SPOP) untuk pendataan bangunan setelah SPOP disetujui.</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-outline-variant space-y-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-1 bg-primary h-8 rounded-full"></div>
            <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
              BATAS-BATAS OBJEK PAJAK (NOP TETANGGA)
            </h4>
          </div>
          <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant flex items-center gap-1 font-bold">BATAS UTARA (NOP) <span className="font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
              <input
                type="text"
                value={formData.batasUtara}
                onChange={(e) => handleTextChange('batasUtara', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })}
                className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest outline-none"
                placeholder="33.03.XXX.XXX.XXX-XXXX.X"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant flex items-center gap-1 font-bold">BATAS SELATAN (NOP) <span className="font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
              <input
                type="text"
                value={formData.batasSelatan}
                onChange={(e) => handleTextChange('batasSelatan', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })}
                className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest outline-none"
                placeholder="33.03.XXX.XXX.XXX-XXXX.X"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant flex items-center gap-1 font-bold">BATAS TIMUR (NOP) <span className="font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
              <input
                type="text"
                value={formData.batasTimur}
                onChange={(e) => handleTextChange('batasTimur', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })}
                className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest outline-none"
                placeholder="33.03.XXX.XXX.XXX-XXXX.X"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant flex items-center gap-1 font-bold">BATAS BARAT (NOP) <span className="font-normal text-[11px] ml-1 flex-none">(Opsional)</span></label>
              <input
                type="text"
                value={formData.batasBarat}
                onChange={(e) => handleTextChange('batasBarat', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })}
                className="w-full h-11 border border-outline-variant rounded px-4 font-data-mono bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm tracking-widest outline-none"
                placeholder="33.03.XXX.XXX.XXX-XXXX.X"
              />
            </div>
          </div>
        </div>

        <div className={`pt-6 border-t border-outline-variant space-y-4 mt-6 ${errors.denahLokasi ? 'p-4 border-error ring-1 ring-error bg-error/10 rounded-xl' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-1 bg-primary h-8 rounded-full"></div>
            <h4 className="font-headline-md text-headline-md font-bold text-on-surface uppercase">
              SKET / DENAH LOKASI (KOORDINAT MAPS)
            </h4>
          </div>
          {errors.denahLokasi && <p className="text-error font-bold text-sm">*{errors.denahLokasi}</p>}
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">Tentukan titik koordinat lokasi objek pajak. Geser peta dan <b>klik pada peta secara berurutan</b> untuk membuat garis batas bangunan (poligon). Jika salah, klik Hapus Poligon.</p>

            <div className="w-full h-[300px] border border-outline-variant rounded-xl overflow-hidden z-0 relative cursor-crosshair">
              <MapContainer center={currentPosition} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler koordinatPolygon={formData.koordinat_polygon} setFormData={setFormData} />
                
                {formData.koordinat_polygon && formData.koordinat_polygon.length > 0 && (
                  <Polygon positions={formData.koordinat_polygon} color="blue" />
                )}
                {formData.koordinat_polygon && formData.koordinat_polygon.map((p, idx) => (
                  <Marker 
                    key={idx} 
                    position={[p.lat, p.lng]} 
                    icon={dotIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        setFormData(prev => {
                          const newCoords = [...(prev.koordinat_polygon || [])];
                          newCoords[idx] = { lat: position.lat, lng: position.lng };
                          return { 
                            ...prev, 
                            koordinat_polygon: newCoords,
                            latitude: newCoords.length > 0 ? newCoords[0].lat.toString() : '',
                            longitude: newCoords.length > 0 ? newCoords[0].lng.toString() : ''
                          };
                        });
                      }
                    }}
                  />
                ))}
              </MapContainer>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              <button 
                type="button"
                onClick={() => setFormData(prev => {
                  const newCoords = [...(prev.koordinat_polygon || [])];
                  newCoords.pop();
                  return { 
                    ...prev, 
                    koordinat_polygon: newCoords, 
                    latitude: newCoords.length > 0 ? newCoords[0].lat.toString() : '', 
                    longitude: newCoords.length > 0 ? newCoords[0].lng.toString() : '' 
                  };
                })}
                disabled={!formData.koordinat_polygon || formData.koordinat_polygon.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">undo</span>
                Batal Titik Terakhir
              </button>

              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, koordinat_polygon: [], latitude: '', longitude: '' }))}
                className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.koordinat_polygon || formData.koordinat_polygon.length === 0}
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Hapus Semua
              </button>
            </div>

            {formData.koordinat_polygon && formData.koordinat_polygon.length > 0 ? (
              <div className="mt-4">
                <label className="text-sm font-bold text-primary mb-2 block">DAFTAR TITIK KOORDINAT POLIGON</label>
                <div className="border border-outline-variant rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface-container text-on-surface">
                      <tr>
                        <th className="px-4 py-2 w-16 text-center">Titik</th>
                        <th className="px-4 py-2 border-l border-outline-variant">Latitude</th>
                        <th className="px-4 py-2 border-l border-outline-variant">Longitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.koordinat_polygon.map((p, idx) => (
                        <tr key={idx} className="border-t border-outline-variant bg-white">
                          <td className="px-4 py-2 text-center font-bold text-primary">{idx + 1}</td>
                          <td className="px-4 py-2 border-l border-outline-variant font-data-mono text-on-surface-variant">{p.lat}</td>
                          <td className="px-4 py-2 border-l border-outline-variant font-data-mono text-on-surface-variant">{p.lng}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Belum ada titik koordinat yang ditambahkan.</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-8 border-t border-outline-variant gap-3">
        <button type="button" onClick={() => navigate(`/spop/subjek-pajak/${idTransaksi || ''}`)} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
          Kembali
        </button>
        <button type="button" onClick={handleSave} disabled={isSubmitting} className="px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-primary/90 shadow-md transition-all flex items-center gap-2">
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <><span className="material-symbols-outlined text-[20px]">save</span> Simpan Data</>
          )}
        </button>
      </div>
    </div>
  );
}
