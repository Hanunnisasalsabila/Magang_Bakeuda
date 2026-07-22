const fs = require('fs');
const file = 'frontend-bakeuda/src/pages/Spop/Step4Konfirmasi.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state and context
content = content.replace(
  'const { formData, setFormData, saveDraft, idTransaksi } = useSpop();',
  'const { formData, setFormData, saveDraft, idTransaksi, spopData } = useSpop();\n  const [showBangunanModal, setShowBangunanModal] = useState(false);'
);

// 2. Map ABRI to TNI/POLRI
content = content.replace(
  '<td className="py-1.5 text-on-surface">{formData.pekerjaan || \'-\'}</td>',
  '<td className="py-1.5 text-on-surface">{formData.pekerjaan === \'ABRI\' ? \'TNI/POLRI\' : (formData.pekerjaan || \'-\')}</td>'
);

// 3. Add extra fields to Subjek Pajak
content = content.replace(
  `                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Pekerjaan</td>`,
  `                  <tr>
                    <td className="py-1.5 text-on-surface-variant">NPWP</td>
                    <td className="py-1.5 font-data-mono text-on-surface">{formData.npwp || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">No. Telp / HP</td>
                    <td className="py-1.5 font-data-mono text-on-surface">{formData.noTelp || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Email</td>
                    <td className="py-1.5 text-on-surface">{formData.email || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Status WP</td>
                    <td className="py-1.5 text-on-surface">{formData.statusWp || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Pekerjaan</td>`
);

// 4. Add extra fields to Objek Pajak
content = content.replace(
  `                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Luas Tanah</td>`,
  `                  <tr>
                    <td className="py-1.5 text-on-surface-variant align-top">Detail Wilayah</td>
                    <td className="py-1.5 text-on-surface leading-snug">
                      RT {formData.rtObjek || '-'}/RW {formData.rwObjek || '-'}, {formData.kelurahanObjek || '-'}, {formData.kecamatanObjek || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">No. Persil</td>
                    <td className="py-1.5 font-data-mono text-on-surface">{formData.noPersil || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Luas Tanah</td>`
);

// 5. Add Bangunan and Batas to Objek Pajak
content = content.replace(
  `                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Titik Koordinat</td>`,
  `                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Bangunan</td>
                    <td className="py-1.5 text-on-surface flex items-center gap-2">
                      {formData.jumlahBangunan || '0'} Unit ({formData.luasBangunan || '0'} M²)
                      {parseInt(formData.jumlahBangunan || '0') > 0 && (
                        <button onClick={() => setShowBangunanModal(true)} className="text-xs text-primary underline hover:text-primary/80 font-bold ml-2">
                          Lihat Detail
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Batas Utara</td>
                    <td className="py-1.5 font-data-mono text-on-surface">{formData.batasUtara || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Batas Selatan</td>
                    <td className="py-1.5 font-data-mono text-on-surface">{formData.batasSelatan || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-on-surface-variant">Titik Koordinat</td>`
);

// 6. Add Modal before the last </div>
const modalHTML = `
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
                  const detailTujuan = spopData?.detail_tujuan?.[0];
                  if (detailTujuan?.data_bangunan_json) {
                    parsedList = JSON.parse(detailTujuan.data_bangunan_json);
                    if (typeof parsedList === 'string') parsedList = JSON.parse(parsedList);
                  }
                } catch (e) { console.error('Gagal parse bangunan', e); }

                if (!parsedList || parsedList.length === 0) {
                  return <p className="text-center italic text-on-surface-variant py-8">Tidak ada detail data bangunan yang diisi.</p>;
                }

                return parsedList.map((b, i) => (
                  <div key={i} className="border border-outline-variant rounded-xl p-4 bg-white shadow-sm">
                    <h4 className="font-bold text-on-surface mb-3 pb-2 border-b border-outline-variant">Bangunan Ke-{i + 1}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 text-sm gap-y-4 gap-x-4">
                      {Object.entries(b).filter(([k, v]) => v && v !== '' && v !== '0' && k !== 'nomorBangunan').map(([k, v]) => (
                        <div key={k} className="flex flex-col">
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">
                            {k.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium text-on-surface">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  '    </div>\n  );\n}',
  modalHTML + '    </div>\n  );\n}'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed successfully');
