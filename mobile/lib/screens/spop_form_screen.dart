import 'package:flutter/material.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';

class SpopFormScreen extends StatefulWidget {
  const SpopFormScreen({super.key});

  @override
  State<SpopFormScreen> createState() => _SpopFormScreenState();
}

class _SpopFormScreenState extends State<SpopFormScreen> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  // Controllers - Step 1 (Data Transaksi)
  String _kategoriTransaksi = 'Pendaftaran Data Baru';
  String _jenisTransaksi = 'Pendaftaran Baru';
  final _nopController = TextEditingController();
  final _nopAsalController = TextEditingController();
  final _noSpptLamaController = TextEditingController();

  final List<String> _kategoriOptions = ['Pendaftaran Data Baru', 'Pemutakhiran Data'];
  final List<String> _jenisTransaksiOptions = ['Pendaftaran Baru', 'Mutasi Penuh', 'Mutasi Pecah', 'Mutasi Gabung'];

  // Controllers - Step 2 (Data Subjek Pajak)
  final _namaWpController = TextEditingController();
  final _nikController = TextEditingController();
  final _npwpController = TextEditingController();
  final _noTelpController = TextEditingController();
  String _statusWp = 'Pemilik';
  String _pekerjaan = 'PNS';
  final _alamatWpController = TextEditingController();
  final _rtRwWpController = TextEditingController();
  final _kelurahanWpController = TextEditingController();
  final _kecamatanWpController = TextEditingController();
  final _kabupatenWpController = TextEditingController(text: 'Purbalingga');
  final _kodePosWpController = TextEditingController();

  final List<String> _statusWpOptions = ['Pemilik', 'Penyewa', 'Pengelola', 'Pemakai', 'Sengketa'];
  final List<String> _pekerjaanOptions = ['PNS', 'TNI/Polri', 'Pegawai Swasta', 'Wiraswasta', 'Lainnya'];

  // Controllers - Step 3 (Data Letak Objek)
  final _alamatOpController = TextEditingController();
  final _blokKavOpController = TextEditingController();
  final _rtRwOpController = TextEditingController();
  final _kelurahanOpController = TextEditingController();
  
  // Controllers - Step 4 (Data Tanah & Peta)
  final _luasTanahController = TextEditingController();
  String _jenisTanah = 'Tanah + Bangunan';
  final List<String> _jenisTanahOptions = ['Tanah + Bangunan', 'Kavling Siap Bangun', 'Tanah Kosong'];
  
  final _batasUtaraController = TextEditingController();
  final _batasSelatanController = TextEditingController();
  final _batasTimurController = TextEditingController();
  final _batasBaratController = TextEditingController();
  
  final _latController = TextEditingController(text: '-7.3934');
  final _lngController = TextEditingController(text: '109.3663');

  // State - Step 5 (Lampiran)
  bool _fileUploaded = false;

  @override
  void dispose() {
    _nopController.dispose();
    _nopAsalController.dispose();
    _noSpptLamaController.dispose();
    _namaWpController.dispose();
    _nikController.dispose();
    _npwpController.dispose();
    _noTelpController.dispose();
    _alamatWpController.dispose();
    _rtRwWpController.dispose();
    _kelurahanWpController.dispose();
    _kecamatanWpController.dispose();
    _kabupatenWpController.dispose();
    _kodePosWpController.dispose();
    _alamatOpController.dispose();
    _blokKavOpController.dispose();
    _rtRwOpController.dispose();
    _kelurahanOpController.dispose();
    _luasTanahController.dispose();
    _batasUtaraController.dispose();
    _batasSelatanController.dispose();
    _batasTimurController.dispose();
    _batasBaratController.dispose();
    _latController.dispose();
    _lngController.dispose();
    super.dispose();
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(seconds: 2));
      setState(() => _isLoading = false);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Formulir SPOP berhasil dikirim!')),
        );
        Navigator.pop(context);
      }
    }
  }

  Widget _buildDropdown(String label, String value, List<String> options, Function(String?) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: DropdownButtonFormField<String>(
        initialValue: value,
        isExpanded: true,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        items: options.map((v) => DropdownMenuItem(value: v, child: Text(v, style: const TextStyle(fontSize: 14)))).toList(),
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
            _buildDropdown('Kategori Pendaftaran', _kategoriTransaksi, _kategoriOptions, (v) => setState(() => _kategoriTransaksi = v!)),
            _buildDropdown('Jenis Transaksi', _jenisTransaksi, _jenisTransaksiOptions, (v) => setState(() => _jenisTransaksi = v!)),
            CustomTextField(
              controller: _nopController,
              label: 'NOP Induk / Utama',
              hintText: '18 digit NOP',
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 12),
            CustomTextField(
              controller: _nopAsalController,
              label: 'NOP Asal (Jika Pecah/Gabung)',
              hintText: 'Opsional',
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 12),
            CustomTextField(
              controller: _noSpptLamaController,
              label: 'No. SPPT Lama',
              hintText: 'Opsional',
              keyboardType: TextInputType.number,
            ),
          ],
        ),
      ),
      Step(
        title: const Text('Data Wajib Pajak'),
        isActive: _currentStep >= 1,
        state: _currentStep > 1 ? StepState.complete : StepState.indexed,
        content: Column(
          children: [
            CustomTextField(controller: _namaWpController, label: 'Nama Wajib Pajak', validator: (v) => v!.isEmpty ? '*' : null),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _nikController, label: 'NIK (16 digit)', keyboardType: TextInputType.number)),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _npwpController, label: 'NPWP', keyboardType: TextInputType.number)),
              ],
            ),
            const SizedBox(height: 12),
            CustomTextField(controller: _noTelpController, label: 'Nomor HP/Telepon', keyboardType: TextInputType.phone),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildDropdown('Status WP', _statusWp, _statusWpOptions, (v) => setState(() => _statusWp = v!))),
                const SizedBox(width: 12),
                Expanded(child: _buildDropdown('Pekerjaan', _pekerjaan, _pekerjaanOptions, (v) => setState(() => _pekerjaan = v!))),
              ],
            ),
            CustomTextField(controller: _alamatWpController, label: 'Alamat (Jalan)', maxLines: 2),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _rtRwWpController, label: 'RT/RW (misal 01/02)')),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _kelurahanWpController, label: 'Kelurahan/Desa')),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _kecamatanWpController, label: 'Kecamatan')),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _kodePosWpController, label: 'Kode Pos', keyboardType: TextInputType.number)),
              ],
            ),
          ],
        ),
      ),
      Step(
        title: const Text('Data Letak Objek'),
        isActive: _currentStep >= 2,
        state: _currentStep > 2 ? StepState.complete : StepState.indexed,
        content: Column(
          children: [
            CustomTextField(controller: _alamatOpController, label: 'Alamat Objek (Jalan/Persil)', maxLines: 2, validator: (v) => v!.isEmpty ? '*' : null),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _blokKavOpController, label: 'Blok/Kav/No')),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _rtRwOpController, label: 'RT/RW (01/02)')),
              ],
            ),
            const SizedBox(height: 12),
            CustomTextField(controller: _kelurahanOpController, label: 'Kelurahan/Desa Objek'),
          ],
        ),
      ),
      Step(
        title: const Text('Data Tanah & Batas'),
        isActive: _currentStep >= 3,
        state: _currentStep > 3 ? StepState.complete : StepState.indexed,
        content: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(flex: 2, child: _buildDropdown('Jenis Tanah', _jenisTanah, _jenisTanahOptions, (v) => setState(() => _jenisTanah = v!))),
                const SizedBox(width: 12),
                Expanded(flex: 1, child: CustomTextField(controller: _luasTanahController, label: 'Luas (m²)', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
              ],
            ),
            const Text('Batas-batas Tanah:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _batasUtaraController, label: 'Utara', hintText: 'NOP / Jalan')),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _batasSelatanController, label: 'Selatan', hintText: 'NOP / Jalan')),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _batasTimurController, label: 'Timur')),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _batasBaratController, label: 'Barat')),
              ],
            ),
            const SizedBox(height: 16),
            const Text('Titik Koordinat (Peta Simulasi):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _latController, label: 'Latitude')),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _lngController, label: 'Longitude')),
              ],
            ),
          ],
        ),
      ),
      Step(
        title: const Text('Lampiran'),
        isActive: _currentStep >= 4,
        state: _currentStep == 4 ? StepState.complete : StepState.indexed,
        content: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Dokumen Pendukung (KTP, Sertifikat Tanah, Bukti Lainnya)'),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.3),
                border: Border.all(color: theme.colorScheme.outline),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Icon(
                    _fileUploaded ? Icons.file_present : Icons.upload_file,
                    size: 40,
                    color: _fileUploaded ? Colors.green : theme.colorScheme.primary,
                  ),
                  const SizedBox(height: 8),
                  Text(_fileUploaded ? 'Lampiran berhasil ditambahkan (Mock)' : 'Pilih file PDF/JPG'),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () {
                      setState(() => _fileUploaded = true);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('File simulasi berhasil dilampirkan.')),
                      );
                    },
                    child: const Text('Pilih Berkas'),
                  ),
                ],
              ),
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
            if (_currentStep > 0) {
              setState(() => _currentStep -= 1);
            }
          },
          onStepTapped: (step) {
            setState(() => _currentStep = step);
          },
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
                  ]
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
