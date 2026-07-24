import re

path = '/home/afifhnrstwn/Coding/Magang/Magang_Bakeuda/frontend-bakeuda/src/pages/DaftarObjekPajak.jsx'
with open(path, 'r') as f:
    content = f.read()

# 1. Update mapping
mapping_old = """          land: Number(item.luas_tanah || 0),
          building: Number(item.luas_bangunan || 0),
          njop: Number(item.total_njop || 0),
          status: item.status_aktif ? 'Aktif' : 'Nonaktif'
        }));"""
mapping_new = """          land: Number(item.luas_tanah || 0),
          building: Number(item.luas_bangunan || 0),
          njop: Number(item.total_njop || 0),
          status: item.status_aktif ? 'Aktif' : 'Nonaktif',
          jenis_tanah: item.jenis_tanah || '-',
          jumlah_bangunan: item.jumlah_bangunan || 0
        }));"""
content = content.replace(mapping_old, mapping_new)

# 2. Update Modal Header and Body
# We need to replace from `            {/* Modal Header - Official Style */}` down to `            {/* Modal Footer (Aksi Lanjutan) */}`
modal_old_regex = r"\{/\* Modal Header - Official Style \*/\}.*?(?=\{/\* Modal Footer \(Aksi Lanjutan\) \*/\})"
modal_new = """{/* Modal Header */}
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

            """
content = re.sub(modal_old_regex, modal_new, content, flags=re.DOTALL)

with open(path, 'w') as f:
    f.write(content)
