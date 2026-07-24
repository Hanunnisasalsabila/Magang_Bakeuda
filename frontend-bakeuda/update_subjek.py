import re

path = '/home/afifhnrstwn/Coding/Magang/Magang_Bakeuda/frontend-bakeuda/src/pages/DetailSubjekPajak.jsx'
with open(path, 'r') as f:
    content = f.read()

# 1. Remove NIK from Header
content = re.sub(
    r'<p className="text-on-surface-variant text-sm mt-1 flex items-center gap-1.5 font-data-mono">\s*<span className="material-symbols-outlined text-\[16px\]">tag</span>\s*NIK: \{subjek\.nik\}\s*</p>',
    '',
    content
)

# 2. Add NIK below Nama Wajib Pajak in Subjek card
nik_html = """              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">NIK</p>
                <p className="font-data-mono font-medium text-on-surface text-sm">{subjek.nik || '-'}</p>
              </div>"""

nama_html = """              <div className="grid grid-cols-[140px_1fr] items-start">
                <p className="text-on-surface-variant text-sm font-medium">Nama Wajib Pajak</p>
                <p className="font-bold text-on-surface text-sm">{subjek.nama_subjek || '-'}</p>
              </div>"""

content = content.replace(nama_html, nama_html + '\n' + nik_html)

# 3. Update Objek Pajak header to use justify-between
header_old = """                  <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3 ">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">landscape</span>
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg">Detail Objek Pajak {subjek.objek_pajak.length > 1 ? `#${idx + 1}` : ''}</h3>
                    <div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${op.status_aktif !== false ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {op.status_aktif !== false ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                  </div>"""

header_new = """                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">landscape</span>
                      </div>
                      <h3 className="text-gray-900 font-bold text-lg">Detail Objek Pajak {subjek.objek_pajak.length > 1 ? `#${idx + 1}` : ''}</h3>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${op.status_aktif !== false ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {op.status_aktif !== false ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                  </div>"""

content = content.replace(header_old, header_new)

with open(path, 'w') as f:
    f.write(content)
