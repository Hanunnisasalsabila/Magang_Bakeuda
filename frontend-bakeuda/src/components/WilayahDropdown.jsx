import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axios';

/**
 * WilayahDropdown
 * Dropdown berjenjang Kecamatan → Kelurahan/Desa dari endpoint GET /wilayah
 * 
 * Schema Wilayah dari backend:
 *   kode_wilayah (10 digit: 2+2+3+3), kecamatan (nama), nama_desa (nama desa/kelurahan),
 *   kode_kecamatan, kode_kelurahan
 */
export default function WilayahDropdown({
  selectedKecamatan = '',   // nama kecamatan yang dipilih
  selectedKelurahan = '',   // nama desa yang dipilih
  onSelect,                 // (namaKec, namaDesa, kodeWilayahKec, kodeWilayahFull) => void
  errorKecamatan = '',
  errorKelurahan = '',
  labelKecamatan = 'Kecamatan',
  labelKelurahan = 'Kelurahan / Desa',
  required = false,
}) {
  const [allWilayah, setAllWilayah] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    api.get('/wilayah')
      .then(res => {
        const data = res.data?.data || [];
        setAllWilayah(data);

        // Ambil daftar kecamatan unik berdasarkan nama kecamatan
        const kecMap = {};
        data.forEach(w => {
          if (w.kecamatan && !kecMap[w.kecamatan]) {
            kecMap[w.kecamatan] = {
              nama: w.kecamatan,
              // Kode kec = 7 digit pertama dari salah satu kode_wilayah
              kodePrefix: w.kode_wilayah?.substring(0, 7) || '',
              kode_kecamatan: w.kode_kecamatan,
            };
          }
        });
        setKecamatanList(Object.values(kecMap).sort((a, b) => a.nama.localeCompare(b.nama)));
      })
      .catch(err => console.error('Gagal memuat data wilayah:', err))
      .finally(() => setLoading(false));
  }, []);

  // Update daftar kelurahan saat kecamatan berubah
  useEffect(() => {
    if (!selectedKecamatan || allWilayah.length === 0) {
      setKelurahanList([]);
      return;
    }
    const filtered = allWilayah
      .filter(w => w.kecamatan === selectedKecamatan)
      .sort((a, b) => (a.nama_desa || '').localeCompare(b.nama_desa || ''));
    setKelurahanList(filtered);
  }, [selectedKecamatan, allWilayah]);

  const handleKecamatanChange = (e) => {
    const namaKec = e.target.value;
    const kecData = kecamatanList.find(k => k.nama === namaKec);
    onSelect(namaKec, '', kecData?.kodePrefix || '', '');
  };

  const handleKelurahanChange = (e) => {
    const kodeWilayah = e.target.value;
    const found = allWilayah.find(w => w.kode_wilayah === kodeWilayah);
    if (!found) return;
    const kodeKec = found.kode_wilayah.substring(0, 7);
    onSelect(found.kecamatan, found.nama_desa, kodeKec, found.kode_wilayah);
  };

  const baseSelect = (hasError) =>
    `w-full h-11 border ${
      hasError
        ? 'border-error ring-1 ring-error'
        : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'
    } rounded-md px-3 outline-none bg-white text-sm transition-colors`;

  if (loading) {
    return (
      <div className="col-span-2 flex items-center gap-2 text-sm text-on-surface-variant py-3">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
        <span>Memuat 18 kecamatan & 239 desa...</span>
      </div>
    );
  }

  return (
    <>
      {/* Kecamatan */}
      <div className="space-y-1">
        <label className="text-sm text-on-surface-variant font-bold block">
          {labelKecamatan}{required && <span className="text-error ml-1">*</span>}
        </label>
        <select
          value={selectedKecamatan}
          onChange={handleKecamatanChange}
          className={baseSelect(!!errorKecamatan)}
        >
          <option value="">-- Pilih Kecamatan --</option>
          {kecamatanList.map(k => (
            <option key={k.kodePrefix} value={k.nama}>{k.nama}</option>
          ))}
        </select>
        {errorKecamatan && <p className="text-error text-[12px]">{errorKecamatan}</p>}
      </div>

      {/* Kelurahan / Desa */}
      <div className="space-y-1">
        <label className="text-sm text-on-surface-variant font-bold block">
          {labelKelurahan}{required && <span className="text-error ml-1">*</span>}
        </label>
        <select
          value={
            // Cari kode_wilayah berdasarkan nama_desa yang dipilih di kecamatan ini
            allWilayah.find(w => w.kecamatan === selectedKecamatan && w.nama_desa === selectedKelurahan)?.kode_wilayah || ''
          }
          onChange={handleKelurahanChange}
          disabled={!selectedKecamatan || kelurahanList.length === 0}
          className={baseSelect(!!errorKelurahan)}
        >
          <option value="">-- Pilih Desa/Kelurahan --</option>
          {kelurahanList.map(k => (
            <option key={k.kode_wilayah} value={k.kode_wilayah}>{k.nama_desa}</option>
          ))}
        </select>
        {!selectedKecamatan && (
          <p className="text-xs text-on-surface-variant mt-0.5">Pilih kecamatan terlebih dahulu</p>
        )}
        {errorKelurahan && <p className="text-error text-[12px]">{errorKelurahan}</p>}
      </div>
    </>
  );
}
