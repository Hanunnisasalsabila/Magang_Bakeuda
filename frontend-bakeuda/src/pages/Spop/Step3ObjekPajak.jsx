<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 935a441d2d352d2eec5fc15dd2878b8154500c15
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon, useMap, GeoJSON } from 'react-leaflet';
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

function MapUpdater({ center, referencePoint, searchBoundary }) {
  const map = useMap();
  useEffect(() => {
    if (searchBoundary) {
      try {
        const geojsonLayer = L.geoJSON(searchBoundary);
        map.fitBounds(geojsonLayer.getBounds(), { padding: [20, 20], maxZoom: 18 });
      } catch (err) {
        map.setView(center, 15);
      }
    } else if (referencePoint && referencePoint.length === 2) {
      map.setView(referencePoint, 18);
    } else if (center && center.length === 2) {
      map.setView(center, 15);
    }
  }, [center, referencePoint, searchBoundary, map]);
  return null;
}

const MemoizedMap = React.memo(({ center, koordinatPolygon, setFormData, referencePoint, searchBoundary }) => {
  return (
    <MapContainer center={center} zoom={15} maxZoom={22} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; Google Maps'
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        maxZoom={22}
      />
      <MapUpdater center={center} referencePoint={referencePoint} searchBoundary={searchBoundary} />
      <MapClickHandler koordinatPolygon={koordinatPolygon} setFormData={setFormData} />

      {searchBoundary && (
        <GeoJSON
          key={JSON.stringify(searchBoundary)}
          data={searchBoundary}
          style={{ color: 'blue', weight: 2, opacity: 0.3, fillOpacity: 0.1 }}
        />
      )}
      {referencePoint && !searchBoundary && (
        <Marker position={referencePoint} title="Lokasi Anda / Hasil Pencarian" />
      )}
      {koordinatPolygon && koordinatPolygon.length > 0 && (
        <Polygon positions={koordinatPolygon} color="blue" />
      )}
      {koordinatPolygon && koordinatPolygon.map((p, idx) => (
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
  );
}, (prevProps, nextProps) => {
  return prevProps.koordinatPolygon === nextProps.koordinatPolygon &&
    prevProps.center[0] === nextProps.center[0] &&
    prevProps.center[1] === nextProps.center[1] &&
    prevProps.referencePoint === nextProps.referencePoint &&
    prevProps.searchBoundary === nextProps.searchBoundary;
});

export default function Step3ObjekPajak() {
  const { formData, setFormData, errors, setErrors, saveDraft, idTransaksi, setCompletionStatus } = useSpop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.transaksi === 'MUTASI' || formData.transaksi === 'HAPUS') {
      if (idTransaksi) {
        navigate(`/spop/konfirmasi/${idTransaksi}`, { replace: true });
      } else {
        navigate('/spop/informasi-umum', { replace: true });
      }
    }
  }, [formData.transaksi, idTransaksi, navigate]);

  // Map state
  const initialLat = formData.latitude ? parseFloat(formData.latitude) : -7.38883;
  const initialLng = formData.longitude ? parseFloat(formData.longitude) : 109.36647;
  const [currentPosition, setCurrentPosition] = useState([initialLat, initialLng]);
  const [referencePoint, setReferencePoint] = useState(null);
  const [searchBoundary, setSearchBoundary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (val.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const queryText = val.toLowerCase().includes('purbalingga') ? val : `${val} Purbalingga`;
          const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(queryText)}&limit=5&lat=-7.3888&lon=109.3637`);
          const data = await res.json();
          if (data && data.features) {
            setSuggestions(data.features);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error('Autocomplete error', err);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchAndSetBoundary = async (osmType, osmId, queryText, lon, lat) => {
    try {
      let url = '';
      if (osmType && osmId) {
        const typeChar = String(osmType).charAt(0).toUpperCase();
        url = `https://nominatim.openstreetmap.org/lookup?osm_ids=${typeChar}${osmId}&format=json&polygon_geojson=1`;
      } else if (queryText) {
        url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryText)}&format=json&polygon_geojson=1&limit=1`;
      }

      if (url) {
        const res = await fetch(url);
        const data = await res.json();
        const result = Array.isArray(data) ? data[0] : (data && data[0] ? data[0] : null);

        if (result && result.geojson && (result.geojson.type === 'Polygon' || result.geojson.type === 'MultiPolygon')) {
          setSearchBoundary(result.geojson);
          setReferencePoint(null);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch boundary', err);
    }

    setSearchBoundary(null);
    setReferencePoint([parseFloat(lat), parseFloat(lon)]);
  };

  const handleSelectSuggestion = (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    const name = feature.properties.name || '';
    const city = feature.properties.city || feature.properties.county || '';

    setSearchQuery(`${name}${city ? ', ' + city : ''}`);
    setShowSuggestions(false);

    const coords = [parseFloat(lat), parseFloat(lon)];
    setCurrentPosition(coords);
    fetchAndSetBoundary(feature.properties.osm_type, feature.properties.osm_id, null, lon, lat);
  };

  const handleSearchLokasi = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const queryText = searchQuery.toLowerCase().includes('purbalingga') ? searchQuery : `${searchQuery} Purbalingga`;
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(queryText)}&limit=1&lat=-7.3888&lon=109.3637`);
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        const [lon, lat] = data.features[0].geometry.coordinates;
        const coords = [parseFloat(lat), parseFloat(lon)];
        setCurrentPosition(coords);
        fetchAndSetBoundary(data.features[0].properties.osm_type, data.features[0].properties.osm_id, queryText, lon, lat);
      } else {
        alert('Lokasi tidak ditemukan');
      }
    } catch (err) {
      alert('Gagal mencari lokasi');
    }
    setIsSearching(false);
  };

  const handleLokasiSaya = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setCurrentPosition(coords);
        setReferencePoint(coords);
        setSearchBoundary(null);
      }, (error) => {
        alert('Gagal mendapatkan lokasi Anda. Pastikan izin lokasi (GPS) aktif di browser Anda.');
      });
    } else {
      alert('Browser Anda tidak mendukung fitur lokasi');
    }
  };

  const handleTextChange = (field, e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    // Validasi Frontend
    const newErrors = {};
    if (!formData.rtObjek) newErrors.rtObjek = 'RT wajib diisi';
    if (!formData.rwObjek) newErrors.rwObjek = 'RW wajib diisi';
    if (!formData.kecamatanObjek) newErrors.kecamatanObjek = 'Kecamatan wajib dipilih';
    if (!formData.kelurahanObjek) newErrors.kelurahanObjek = 'Kelurahan wajib dipilih';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ show: true, message: 'Mohon lengkapi semua isian wajib (bergaris merah)', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      setErrors({});
      const newId = await saveDraft();
      setToast({ show: true, message: 'Langkah 3 berhasil disimpan.', type: 'success' });
      const savedId = idTransaksi || newId;
      if (savedId) {
        const jumBng = parseInt(formData.jumlahBangunan, 10);
        if (!isNaN(jumBng) && jumBng > 0) {
          navigate(`/spop/data-bangunan/${savedId}`);
        } else {
          setCompletionStatus(prev => ({ ...prev, 4: true }));
          navigate(`/spop/konfirmasi/${savedId}`);
        }
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
              className={`w-full h-11 border ${errors.rwObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 text-center font-data-mono bg-white shadow-sm outline-none`}
              placeholder="000"
            />
            {errors.rwObjek && <p className="text-error text-[12px]">{errors.rwObjek}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-bold">RT</label>
            <input
              type="text"
              maxLength={3}
              value={formData.rtObjek}
              onChange={(e) => handleTextChange('rtObjek', { target: { value: e.target.value.replace(/\D/g, '') } })}
              className={`w-full h-11 border ${errors.rtObjek ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'} rounded px-4 text-center font-data-mono bg-white shadow-sm outline-none`}
              placeholder="000"
            />
            {errors.rtObjek && <p className="text-error text-[12px]">{errors.rtObjek}</p>}
          </div>
        </div>

        {/* Baris 3: Kecamatan + Kelurahan — satu baris */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WilayahDropdown
            selectedKecamatan={formData.kecamatanObjek}
            selectedKelurahan={formData.kelurahanObjek}
            labelKecamatan="KECAMATAN"
            labelKelurahan="KELURAHAN/DESA"
            autoLockByRole={true}
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2 mb-2">
              <div className="flex-1 relative">
                <div className="flex bg-white border border-outline-variant rounded overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
                  <input
                    type="text"
                    placeholder="Cari nama jalan, desa, atau kecamatan..."
                    className="flex-1 h-10 px-3 outline-none text-sm"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLokasi())}
                  />
                  <button
                    type="button"
                    onClick={handleSearchLokasi}
                    disabled={isSearching}
                    className="h-10 px-4 bg-surface-variant text-on-surface hover:bg-surface-variant/80 flex items-center gap-1 font-bold text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    {isSearching ? 'Mencari...' : 'Cari'}
                  </button>
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-surface-variant cursor-pointer text-sm border-b border-outline-variant/30 last:border-0 flex flex-col"
                        onMouseDown={() => handleSelectSuggestion(item)}
                      >
                        <span className="font-bold text-on-surface">{item.properties.name}</span>
                        <span className="text-xs text-on-surface-variant">
                          {[item.properties.street, item.properties.city, item.properties.state, item.properties.country].filter(Boolean).join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={handleLokasiSaya}
                className="h-10 px-4 bg-primary text-white hover:bg-primary/90 flex items-center gap-2 font-bold text-sm rounded shadow-sm transition-colors whitespace-nowrap justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
                Lokasi Saya
              </button>
            </div>

            <div className="w-full h-[300px] border border-outline-variant rounded-xl overflow-hidden z-0 relative cursor-crosshair">
              <MemoizedMap
                center={currentPosition}
                koordinatPolygon={formData.koordinat_polygon}
                setFormData={setFormData}
                referencePoint={referencePoint}
                searchBoundary={searchBoundary}
              />
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

              {formData.koordinat_polygon && formData.koordinat_polygon.length > 0 && (
                <>
                  <a
                    href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors text-sm text-primary font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    Lihat di Google Maps
                  </a>
                  <button
                    type="button"
                    title="Salin koordinat ke clipboard lalu buka website BHUMI ATR/BPN untuk dicari secara manual"
                    onClick={() => {
                      const centerLat = formData.koordinat_polygon.reduce((sum, p) => sum + p.lat, 0) / formData.koordinat_polygon.length;
                      const centerLng = formData.koordinat_polygon.reduce((sum, p) => sum + p.lng, 0) / formData.koordinat_polygon.length;
                      const coordString = `${centerLat}, ${centerLng}`;
                      navigator.clipboard.writeText(coordString).then(() => {
                        setToast({ show: true, message: `Koordinat ${coordString} disalin! Silakan 'Paste' (Tempel) di kolom pencarian web BHUMI.`, type: 'success' });
                        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
                        window.open('https://bhumi.atrbpn.go.id/peta', '_blank');
                      }).catch(() => {
                        window.open('https://bhumi.atrbpn.go.id/peta', '_blank');
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors text-sm text-primary font-bold group"
                  >
                    <span className="material-symbols-outlined text-[18px]">public</span>
                    <div className="flex flex-col items-start leading-tight">
                      <span>Cari di BHUMI ATR/BPN</span>
                      <span className="text-[10px] text-on-surface-variant font-normal hidden sm:block">Salin koordinat & buka web</span>
                    </div>
                  </button>
                </>
              )}
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
        <button type="button" onClick={() => navigate(`/spop/informasi-umum/${idTransaksi || ''}`)} className="px-6 py-2.5 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
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
