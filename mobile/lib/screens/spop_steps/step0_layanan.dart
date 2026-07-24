part of '../spop_form_screen.dart';

extension _Step0Extension on _SpopFormScreenState {
  Widget _buildStep0() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Pilih Jenis Transaksi', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 16),
        SelectableCard(
          title: 'Perekaman Baru',
          subtitle: 'Mendaftarkan objek pajak yang belum terdata',
          icon: Icons.add_circle_outline,
          isSelected: _selectedKategori == 'BARU',
          onTap: () => updateFormState(() {
            _selectedKategori = 'BARU';
            _jenisLayanan = 'BARU'; // default Murni
            _fetchedObjekPajak = null;
          }),
        ),
        const SizedBox(height: 12),
        SelectableCard(
          title: 'Pemutakhiran Data',
          subtitle: 'Memperbarui data objek pajak lama',
          icon: Icons.refresh,
          isSelected: _selectedKategori == 'PEMUTAKHIRAN',
          onTap: () => updateFormState(() {
            _selectedKategori = 'PEMUTAKHIRAN';
            _jenisLayanan = 'MUTASI'; // default Mutasi
            _fetchedObjekPajak = null;
          }),
        ),
        const SizedBox(height: 12),
        SelectableCard(
          title: 'Penghapusan Data',
          subtitle: 'Menghapus data objek dari sistem',
          icon: Icons.delete_outline,
          isSelected: _selectedKategori == 'PENGHAPUSAN',
          onTap: () => updateFormState(() {
            _selectedKategori = 'PENGHAPUSAN';
            _jenisLayanan = 'HAPUS';
            _fetchedObjekPajak = null;
          }),
        ),
        const SizedBox(height: 24),
        
        AnimatedSize(
          duration: const Duration(milliseconds: 300),
          child: _buildDynamicFields(),
        ),
      ],
    );
  }

  Widget _buildDynamicFields() {
    if (_selectedKategori == 'BARU') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Kondisi Pendaftaran (Pilih salah satu):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Murni'),
                selected: _jenisLayanan == 'BARU',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'BARU' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) updateFormState(() => _jenisLayanan = 'BARU'); },
              ),
              ChoiceChip(
                label: const Text('Hasil Pemecahan'),
                selected: _jenisLayanan == 'PECAH',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'PECAH' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) updateFormState(() => _jenisLayanan = 'PECAH'); },
              ),
              ChoiceChip(
                label: const Text('Hasil Penggabungan'),
                selected: _jenisLayanan == 'GABUNG',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'GABUNG' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) updateFormState(() => _jenisLayanan = 'GABUNG'); },
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text('INFORMASI TAMBAHAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
          const Divider(),
          if (_jenisLayanan == 'PECAH' || _jenisLayanan == 'GABUNG') ...[
            const SizedBox(height: 12),
            const Text('NOP Asal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87)),
            const SizedBox(height: 8),
            ..._nopAsalControllers.asMap().entries.map((entry) {
              int idx = entry.key;
              TextEditingController ctrl = entry.value;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        controller: ctrl,
                        label: 'NOP Asal ${idx + 1}',
                        hintText: 'Misal: 33.03.010...',
                        keyboardType: TextInputType.number,
                        inputFormatters: [NopInputFormatter()],
                      ),
                    ),
                    if (_nopAsalControllers.length > 1)
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline, color: Colors.red),
                        onPressed: () {
                          updateFormState(() {
                            _nopAsalControllers.removeAt(idx);
                          });
                        },
                      ),
                  ],
                ),
              );
            }),
          // Tambah NOP Asal (untuk GABUNG bisa multiple)
          if (_jenisLayanan == 'GABUNG')
            TextButton.icon(
              onPressed: () {
                updateFormState(() {
                  _nopAsalControllers.add(TextEditingController());
                });
              },
              icon: const Icon(Icons.add_circle_outline),
              label: const Text('Tambah NOP Asal'),
            ),
          ],
          // Jumlah Pecahan (hanya untuk PECAH)
          if (_jenisLayanan == 'PECAH') ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF0F4FF),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF0F2C59).withValues(alpha: 0.25)),
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Row(children: [
                  Icon(Icons.call_split, size: 18, color: Color(0xFF0F2C59)),
                  SizedBox(width: 8),
                  Text('Jumlah Pecahan', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F2C59))),
                ]),
                const SizedBox(height: 4),
                const Text('Minimal 2 pecahan. Setiap pecahan akan mendapat NOP baru.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    IconButton(
                      onPressed: _jumlahPecahan > 2 ? () => updateFormState(() => _jumlahPecahan--) : null,
                      icon: const Icon(Icons.remove_circle),
                      color: const Color(0xFF0F2C59),
                    ),
                    Expanded(
                      child: Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Text(
                          '$_jumlahPecahan pecahan',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F2C59)),
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () => updateFormState(() => _jumlahPecahan++),
                      icon: const Icon(Icons.add_circle),
                      color: const Color(0xFF0F2C59),
                    ),
                  ],
                ),
              ]),
            ),
          ],
          const SizedBox(height: 12),
          CustomTextField(
            controller: _nopBersamaController,
            label: 'NOP BERSAMA (Opsional)',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
          ),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _noSpptLamaController,
            label: 'NO. SPPT LAMA (Opsional)',
          ),
        ],
      );

    } else if (_selectedKategori == 'PEMUTAKHIRAN') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Jenis Pemutakhiran (Pilih salah satu):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Balik Nama / Jual Beli (Mutasi)'),
                selected: _jenisLayanan == 'MUTASI',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'MUTASI' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) updateFormState(() { _jenisLayanan = 'MUTASI'; _fetchedObjekPajak = null; }); },
              ),
              ChoiceChip(
                label: const Text('Ralat Luas / Alamat (Perubahan Data)'),
                selected: _jenisLayanan == 'PERUBAHAN_DATA',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'PERUBAHAN_DATA' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) updateFormState(() { _jenisLayanan = 'PERUBAHAN_DATA'; _fetchedObjekPajak = null; }); },
              ),
            ],
          ),
          const SizedBox(height: 24),
          CustomTextField(
            controller: _nopUtamaController,
            label: 'NOP UTAMA',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
            validator: (v) => v!.isEmpty ? 'Wajib diisi' : null,
          ),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _nopBersamaController,
            label: 'NOP BERSAMA (Opsional)',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isLoading ? null : _fetchNopData,
              icon: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.search),
              label: Text(_isLoading ? 'Mencari...' : 'Cari Data Objek Pajak'),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F2C59), foregroundColor: Colors.white),
            ),
          ),
          if (_fetchedObjekPajak != null) ...[
            const SizedBox(height: 16),
            _buildDataPreviewCard(),
          ],
          const SizedBox(height: 24),
          const Text('INFORMASI TAMBAHAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
          const Divider(),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _noSpptLamaController,
            label: 'NO. SPPT LAMA (Opsional)',
          ),
        ],
      );
    } else if (_selectedKategori == 'PENGHAPUSAN') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomTextField(
            controller: _nopUtamaController,
            label: 'NOP UTAMA',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
            validator: (v) => v!.isEmpty ? 'Wajib diisi' : null,
          ),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _nopBersamaController,
            label: 'NOP BERSAMA (Opsional)',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isLoading ? null : _fetchNopData,
              icon: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.search),
              label: Text(_isLoading ? 'Mencari...' : 'Cari Data Objek Pajak'),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F2C59), foregroundColor: Colors.white),
            ),
          ),
          if (_fetchedObjekPajak != null) ...[
            const SizedBox(height: 16),
            _buildDataPreviewCard(),
          ],
          const SizedBox(height: 24),
          const Text('ALASAN PENGHAPUSAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
          const Divider(),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _alasanHapusController,
            label: 'Tuliskan alasan lengkap mengapa NOP ini diajukan untuk dihapus...',
            maxLines: 4,
          ),
        ],
      );
    }
    return const SizedBox();
  }

  Widget _buildDataPreviewCard() {
    final obj = _fetchedObjekPajak!;
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF1F8F1),
        border: Border.all(color: Colors.green.shade300),
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.check_circle_outline, color: Colors.green.shade700, size: 20),
              const SizedBox(width: 8),
              Text('Data Objek Pajak Ditemukan', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green.shade800)),
            ],
          ),
          const Divider(),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('NOP', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(_nopUtamaController.text, style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Alamat Objek Pajak', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(obj['jalan_op']?.toString() ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Status', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: Colors.green.shade100, borderRadius: BorderRadius.circular(4)),
                      child: Text('Aktif', style: TextStyle(fontSize: 12, color: Colors.green.shade800, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Subjek Pajak (NIK)', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(obj['subjek_pajak']?['nik']?.toString() ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Luas Tanah / Bangunan', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text('${obj['luas_tanah'] ?? '-'} m² / ${obj['total_luas_bangunan'] ?? obj['luas_bangunan'] ?? '-'} m²', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Jenis Tanah', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(obj['jenis_tanah']?.toString() ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
