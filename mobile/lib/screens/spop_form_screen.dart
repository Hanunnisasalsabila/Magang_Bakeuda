import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';

class SpopFormScreen extends StatefulWidget {
  const SpopFormScreen({super.key});

  @override
  State<SpopFormScreen> createState() => _SpopFormScreenState();
}

class _SpopFormScreenState extends State<SpopFormScreen> {
  final _spopService = TransaksiSpopService(ApiService());
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  bool _isSavingDraft = false;

  // Step 1 - Data Transaksi
  String _jenisLayanan = 'BARU';
  final _nopUtamaController = TextEditingController();
  final _nopAsalController = TextEditingController();
  final _noSpptLamaController = TextEditingController();

  final List<Map<String, String>> _jenisOptions = [
    {'label': 'Pendaftaran Baru', 'value': 'BARU'},
    {'label': 'Mutasi', 'value': 'MUTASI'},
    {'label': 'Perubahan Data', 'value': 'PERUBAHAN_DATA'},
    {'label': 'Penghapusan', 'value': 'HAPUS'},
  ];

  // Step 2 - Data Subjek Pajak
  final _namaWpController = TextEditingController();
  final _nikController = TextEditingController();
  final _npwpController = TextEditingController();
  final _noHpController = TextEditingController();
  String _statusWp = 'PEMILIK';
  String _pekerjaan = 'PNS';
  final _alamatWpController = TextEditingController();
  final _rtController = TextEditingController();
  final _rwController = TextEditingController();
  final _kelurahanWpController = TextEditingController();
  final _kecamatanWpController = TextEditingController();
  final _kabupatenWpController = TextEditingController(text: 'Purbalingga');
  final _kodePosController = TextEditingController();

  final List<Map<String, String>> _statusWpOptions = [
    {'label': 'Pemilik', 'value': 'PEMILIK'},
    {'label': 'Penyewa', 'value': 'PENYEWA'},
    {'label': 'Pengelola', 'value': 'PENGELOLA'},
    {'label': 'Pemakai', 'value': 'PEMAKAI'},
    {'label': 'Sengketa', 'value': 'SENGKETA'},
  ];
  final List<Map<String, String>> _pekerjaanOptions = [
    {'label': 'PNS', 'value': 'PNS'},
    {'label': 'Pegawai Swasta', 'value': 'PEGAWAI_SWASTA'},
    {'label': 'Wiraswasta', 'value': 'WIRASWASTA'},
    {'label': 'Petani', 'value': 'PETANI'},
    {'label': 'Nelayan', 'value': 'NELAYAN'},
    {'label': 'Lainnya', 'value': 'LAINNYA'},
  ];

  // Step 3 - Data Objek Pajak
  String _jenisTanah = 'TANAH_DAN_BANGUNAN';
  final _luasTanahController = TextEditingController();
  final _jalanOpController = TextEditingController();
  final _blokKavController = TextEditingController();
  final _rtOpController = TextEditingController();
  final _rwOpController = TextEditingController();
  final _kelurahanOpController = TextEditingController();
  final _kecamatanOpController = TextEditingController();
  final _batasUtaraController = TextEditingController();
  final _batasSelatanController = TextEditingController();
  final _batasTimurController = TextEditingController();
  final _batasBaratController = TextEditingController();
  final _latController = TextEditingController(text: '-7.3934');
  final _lngController = TextEditingController(text: '109.3663');

  final List<Map<String, String>> _jenisTanahOptions = [
    {'label': 'Tanah + Bangunan', 'value': 'TANAH_DAN_BANGUNAN'},
    {'label': 'Kavling Siap Bangun', 'value': 'TANAH_KOSONG'},
    {'label': 'Tanah Kosong', 'value': 'TANAH_KOSONG'},
  ];

  // Step 4 - Lampiran
  List<Map<String, String>> _lampiran = [];

  @override
  void dispose() {
    _nopUtamaController.dispose();
    _nopAsalController.dispose();
    _noSpptLamaController.dispose();
    _namaWpController.dispose();
    _nikController.dispose();
    _npwpController.dispose();
    _noHpController.dispose();
    _alamatWpController.dispose();
    _rtController.dispose();
    _rwController.dispose();
    _kelurahanWpController.dispose();
    _kecamatanWpController.dispose();
    _kabupatenWpController.dispose();
    _kodePosController.dispose();
    _luasTanahController.dispose();
    _jalanOpController.dispose();
    _blokKavController.dispose();
    _rtOpController.dispose();
    _rwOpController.dispose();
    _kelurahanOpController.dispose();
    _kecamatanOpController.dispose();
    _batasUtaraController.dispose();
    _batasSelatanController.dispose();
    _batasTimurController.dispose();
    _batasBaratController.dispose();
    _latController.dispose();
    _lngController.dispose();
    super.dispose();
  }

  Map<String, dynamic> _buildPayload() {
    return {
      'jenis_layanan': _jenisLayanan,
      if (_nopUtamaController.text.isNotEmpty) 'nop_utama': _nopUtamaController.text,
      if (_nopAsalController.text.isNotEmpty) 'nop_asal': [_nopAsalController.text],
      if (_noSpptLamaController.text.isNotEmpty) 'no_sppt_lama': _noSpptLamaController.text,
      'subjek_pajak': {
        'nama': _namaWpController.text,
        'nik': _nikController.text,
        'status_wp': _statusWp,
        'pekerjaan': _pekerjaan,
        if (_npwpController.text.isNotEmpty) 'npwp': _npwpController.text,
        if (_noHpController.text.isNotEmpty) 'no_hp': _noHpController.text,
        'alamat': _alamatWpController.text,
        'rt': _rtController.text,
        'rw': _rwController.text,
        'kelurahan': _kelurahanWpController.text,
        if (_kecamatanWpController.text.isNotEmpty) 'kecamatan': _kecamatanWpController.text,
        'kabupaten': _kabupatenWpController.text,
        if (_kodePosController.text.isNotEmpty) 'kode_pos': _kodePosController.text,
      },
      'objek_pajak_sementara': {
        'jenis_tanah': _jenisTanah,
        'luas_tanah': double.tryParse(_luasTanahController.text) ?? 0.0,
        'jalan_op': _jalanOpController.text,
        if (_blokKavController.text.isNotEmpty) 'blok_kav_no': _blokKavController.text,
        if (_rtOpController.text.isNotEmpty) 'rt_op': _rtOpController.text,
        if (_rwOpController.text.isNotEmpty) 'rw_op': _rwOpController.text,
        'kelurahan_op': _kelurahanOpController.text,
        'kecamatan_op': _kecamatanOpController.text,
        if (_batasUtaraController.text.isNotEmpty) 'batas_utara': _batasUtaraController.text,
        if (_batasSelatanController.text.isNotEmpty) 'batas_selatan': _batasSelatanController.text,
        if (_batasTimurController.text.isNotEmpty) 'batas_timur': _batasTimurController.text,
        if (_batasBaratController.text.isNotEmpty) 'batas_barat': _batasBaratController.text,
        if (_latController.text.isNotEmpty) 'latitude': _latController.text,
        if (_lngController.text.isNotEmpty) 'longitude': _lngController.text,
      },
      if (_lampiran.isNotEmpty) 'lampiran': _lampiran,
    };
  }

  Future<void> _saveDraft() async {
    setState(() => _isSavingDraft = true);
    try {
      final payload = _buildPayload();
      payload['is_draft'] = true;
      await _spopService.saveDraft(payload);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Draft berhasil disimpan!'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal simpan draft: $e'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      }
    } finally {
      setState(() => _isSavingDraft = false);
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await _spopService.submitSpop(_buildPayload());
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Formulir SPOP berhasil diajukan ke BKD!'), backgroundColor: Colors.green),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal kirim: $e'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      allowMultiple: false,
    );
    if (result != null && result.files.single.path != null) {
      final file = result.files.single;
      setState(() => _isLoading = true);
      try {
        final url = await _spopService.uploadFile(file.path!, file.name);
        setState(() {
          _lampiran.add({'jenis_dokumen': file.name, 'url_file': url});
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('✅ ${file.name} berhasil diunggah')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Gagal unggah: $e'), backgroundColor: Theme.of(context).colorScheme.error),
          );
        }
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  Widget _buildDropdown(String label, String value, List<Map<String, String>> options, Function(String?) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: DropdownButtonFormField<String>(
        value: value,
        isExpanded: true,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        items: options.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
        onChanged: onChanged,
      ),
    );
  }

  List<Step> _buildSteps(ThemeData theme) {
    return [
      Step(
        title: const Text('Data Transaksi'),
        isActive: _currentStep >= 0,
        state: _currentStep > 0 ? StepState.complete : StepState.indexed,
        content: Column(
          children: [
            _buildDropdown('Jenis Layanan', _jenisLayanan, _jenisOptions, (v) => setState(() => _jenisLayanan = v!)),
            CustomTextField(controller: _nopUtamaController, label: 'NOP Utama (18 digit)', hintText: 'Kosongkan jika pendaftaran baru', keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            CustomTextField(controller: _nopAsalController, label: 'NOP Asal (Pecah/Gabung)', hintText: 'Opsional', keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            CustomTextField(controller: _noSpptLamaController, label: 'No. SPPT Lama', hintText: 'Opsional'),
          ],
        ),
      ),
      Step(
        title: const Text('Data Wajib Pajak'),
        isActive: _currentStep >= 1,
        state: _currentStep > 1 ? StepState.complete : StepState.indexed,
        content: Column(
          children: [
            CustomTextField(controller: _namaWpController, label: 'Nama Wajib Pajak *', validator: (v) => v!.isEmpty ? 'Wajib diisi' : null),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _nikController, label: 'NIK (16 digit) *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _npwpController, label: 'NPWP', keyboardType: TextInputType.number)),
            ]),
            const SizedBox(height: 12),
            CustomTextField(controller: _noHpController, label: 'Nomor HP', keyboardType: TextInputType.phone),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: _buildDropdown('Status WP', _statusWp, _statusWpOptions, (v) => setState(() => _statusWp = v!))),
              const SizedBox(width: 12),
              Expanded(child: _buildDropdown('Pekerjaan', _pekerjaan, _pekerjaanOptions, (v) => setState(() => _pekerjaan = v!))),
            ]),
            CustomTextField(controller: _alamatWpController, label: 'Alamat (Jalan) *', maxLines: 2, validator: (v) => v!.isEmpty ? 'Wajib diisi' : null),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _rtController, label: 'RT *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
              const SizedBox(width: 8),
              Expanded(child: CustomTextField(controller: _rwController, label: 'RW *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
              const SizedBox(width: 8),
              Expanded(flex: 2, child: CustomTextField(controller: _kelurahanWpController, label: 'Kelurahan *', validator: (v) => v!.isEmpty ? '*' : null)),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _kecamatanWpController, label: 'Kecamatan')),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _kodePosController, label: 'Kode Pos', keyboardType: TextInputType.number)),
            ]),
          ],
        ),
      ),
      Step(
        title: const Text('Data Objek Pajak'),
        isActive: _currentStep >= 2,
        state: _currentStep > 2 ? StepState.complete : StepState.indexed,
        content: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Expanded(flex: 2, child: _buildDropdown('Jenis Tanah', _jenisTanah, _jenisTanahOptions, (v) => setState(() => _jenisTanah = v!))),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _luasTanahController, label: 'Luas (m²) *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
            ]),
            CustomTextField(controller: _jalanOpController, label: 'Alamat Objek (Jalan) *', maxLines: 2, validator: (v) => v!.isEmpty ? 'Wajib diisi' : null),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _blokKavController, label: 'Blok/Kav/No')),
              const SizedBox(width: 8),
              Expanded(child: CustomTextField(controller: _rtOpController, label: 'RT')),
              const SizedBox(width: 8),
              Expanded(child: CustomTextField(controller: _rwOpController, label: 'RW')),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _kelurahanOpController, label: 'Kelurahan Objek *', validator: (v) => v!.isEmpty ? '*' : null)),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _kecamatanOpController, label: 'Kecamatan Objek *', validator: (v) => v!.isEmpty ? '*' : null)),
            ]),
            const SizedBox(height: 12),
            const Text('Batas-batas Tanah:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            Row(children: [
              Expanded(child: CustomTextField(controller: _batasUtaraController, label: 'Utara')),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _batasSelatanController, label: 'Selatan')),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _batasTimurController, label: 'Timur')),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _batasBaratController, label: 'Barat')),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _latController, label: 'Latitude')),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _lngController, label: 'Longitude')),
            ]),
          ],
        ),
      ),
      Step(
        title: const Text('Lampiran Dokumen'),
        isActive: _currentStep >= 3,
        state: _currentStep == 3 ? StepState.indexed : StepState.indexed,
        content: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Unggah dokumen pendukung (KTP, Sertifikat Tanah, dll)', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
            const SizedBox(height: 12),
            // Uploaded files list
            ..._lampiran.map((l) => ListTile(
              dense: true,
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.file_present, color: Colors.green),
              title: Text(l['jenis_dokumen'] ?? '-', style: const TextStyle(fontSize: 13)),
              trailing: IconButton(
                icon: const Icon(Icons.delete_outline, color: Colors.red),
                onPressed: () => setState(() => _lampiran.remove(l)),
              ),
            )),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: _isLoading ? null : _pickFile,
              icon: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.upload_file),
              label: Text(_isLoading ? 'Mengunggah...' : 'Pilih & Unggah Berkas'),
            ),
          ],
        ),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final steps = _buildSteps(theme);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Formulir SPOP'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
        actions: [
          TextButton.icon(
            onPressed: _isSavingDraft ? null : _saveDraft,
            icon: _isSavingDraft ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.save_outlined, size: 18),
            label: const Text('Draft'),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: Stepper(
          type: StepperType.vertical,
          currentStep: _currentStep,
          onStepContinue: () {
            if (_currentStep < steps.length - 1) {
              setState(() => _currentStep += 1);
            } else {
              _submitForm();
            }
          },
          onStepCancel: () {
            if (_currentStep > 0) setState(() => _currentStep -= 1);
          },
          onStepTapped: (step) => setState(() => _currentStep = step),
          controlsBuilder: (context, details) {
            final isLastStep = _currentStep == steps.length - 1;
            return Container(
              margin: const EdgeInsets.only(top: 20),
              child: Row(
                children: [
                  Expanded(
                    child: CustomButton(
                      text: isLastStep ? 'Kirim SPOP' : 'Lanjut',
                      onPressed: details.onStepContinue,
                      isLoading: isLastStep && _isLoading,
                    ),
                  ),
                  if (_currentStep > 0) ...[
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: details.onStepCancel,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Kembali'),
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
          steps: steps,
        ),
      ),
    );
  }
}
