import 'package:flutter/material.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';

class LspopFormScreen extends StatefulWidget {
  const LspopFormScreen({super.key});

  @override
  State<LspopFormScreen> createState() => _LspopFormScreenState();
}

class _LspopFormScreenState extends State<LspopFormScreen> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  // Controllers - Induk
  final _noFormulirController = TextEditingController();
  final _jumlahBngController = TextEditingController(text: '1');
  String _jenisTransaksi = 'Perekaman Data';
  
  // Controllers - Rincian Bangunan
  String _jenisPenggunaan = 'Perumahan';
  final _luasBangunanController = TextEditingController();
  final _jumlahLantaiController = TextEditingController();
  final _tahunDibangunController = TextEditingController();
  final _tahunDirenovasiController = TextEditingController();
  final _dayaListrikController = TextEditingController();
  
  String _kondisi = 'Sangat Baik';
  String _konstruksi = 'Baja';
  String _atap = 'Genting/Beton';
  String _dinding = 'Bata/Batako';
  String _lantai = 'Marmer/Keramik';
  String _langitLangit = 'Gypsum/Triplek';

  // Controllers - Fasilitas
  final _acSplitController = TextEditingController();
  final _acWindowController = TextEditingController();
  final _acSentralController = TextEditingController();
  final _kolamRenangLuasController = TextEditingController();
  final _panjangPagarController = TextEditingController();

  // Opsi Dropdown
  final List<String> _jenisTransaksiOptions = ['Perekaman Data', 'Pemutakhiran Data', 'Penghapusan Data'];
  final List<String> _penggunaanOptions = ['Perumahan', 'Perkantoran', 'Pabrik', 'Toko/Apotek', 'Rumah Sakit', 'Olahraga', 'Hotel/Wisma'];
  final List<String> _kondisiOptions = ['Sangat Baik', 'Baik', 'Sedang', 'Jelek'];
  final List<String> _konstruksiOptions = ['Baja', 'Beton', 'Batu Bata', 'Kayu'];
  final List<String> _atapOptions = ['Decra/Beton', 'Genting/Beton', 'Seng/Asbes', 'Kayu/Sirap'];
  final List<String> _dindingOptions = ['Kaca', 'Bata/Batako', 'Kayu', 'Seng'];
  final List<String> _lantaiOptions = ['Marmer/Keramik', 'Ubin/Semen', 'Kayu'];
  final List<String> _langitOptions = ['Gypsum/Triplek', 'Asbes', 'Tidak Ada'];

  @override
  void dispose() {
    _noFormulirController.dispose();
    _jumlahBngController.dispose();
    _luasBangunanController.dispose();
    _jumlahLantaiController.dispose();
    _tahunDibangunController.dispose();
    _tahunDirenovasiController.dispose();
    _dayaListrikController.dispose();
    _acSplitController.dispose();
    _acWindowController.dispose();
    _acSentralController.dispose();
    _kolamRenangLuasController.dispose();
    _panjangPagarController.dispose();
    super.dispose();
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      await Future.delayed(const Duration(seconds: 2));
      setState(() => _isLoading = false);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Data LSPOP berhasil disimpan!')),
        );
        Navigator.pop(context);
      }
    }
  }

  Widget _buildDropdown(String label, String value, List<String> options, Function(String?) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: DropdownButtonFormField<String>(
        value: value,
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

  List<Step> _buildSteps() {
    return [
      Step(
        title: const Text('Induk (SPOP)'),
        isActive: _currentStep >= 0,
        state: _currentStep > 0 ? StepState.complete : StepState.indexed,
        content: Column(
          children: [
            CustomTextField(
              controller: _noFormulirController,
              label: 'No. Formulir',
              hintText: 'Nomor Formulir SPOP',
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 12),
            _buildDropdown('Jenis Transaksi', _jenisTransaksi, _jenisTransaksiOptions, (v) => setState(() => _jenisTransaksi = v!)),
            CustomTextField(
              controller: _jumlahBngController,
              label: 'Jumlah Bangunan',
              hintText: 'Total bangunan di objek ini',
              keyboardType: TextInputType.number,
            ),
          ],
        ),
      ),
      Step(
        title: const Text('Rincian Bangunan'),
        isActive: _currentStep >= 1,
        state: _currentStep > 1 ? StepState.complete : StepState.indexed,
        content: Column(
          children: [
            _buildDropdown('Jenis Penggunaan', _jenisPenggunaan, _penggunaanOptions, (v) => setState(() => _jenisPenggunaan = v!)),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _luasBangunanController, label: 'Luas (m²)', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _jumlahLantaiController, label: 'Jml Lantai', keyboardType: TextInputType.number)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _tahunDibangunController, label: 'Thn Bangun', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _tahunDirenovasiController, label: 'Thn Renov', keyboardType: TextInputType.number)),
              ],
            ),
            const SizedBox(height: 12),
            CustomTextField(
              controller: _dayaListrikController,
              label: 'Daya Listrik (Watt)',
              keyboardType: TextInputType.number,
            ),
          ],
        ),
      ),
      Step(
        title: const Text('Material Bangunan'),
        isActive: _currentStep >= 2,
        state: _currentStep > 2 ? StepState.complete : StepState.indexed,
        content: Column(
          children: [
            _buildDropdown('Kondisi Bangunan', _kondisi, _kondisiOptions, (v) => setState(() => _kondisi = v!)),
            _buildDropdown('Jenis Konstruksi', _konstruksi, _konstruksiOptions, (v) => setState(() => _konstruksi = v!)),
            _buildDropdown('Material Atap', _atap, _atapOptions, (v) => setState(() => _atap = v!)),
            _buildDropdown('Material Dinding', _dinding, _dindingOptions, (v) => setState(() => _dinding = v!)),
            _buildDropdown('Material Lantai', _lantai, _lantaiOptions, (v) => setState(() => _lantai = v!)),
            _buildDropdown('Langit-langit', _langitLangit, _langitOptions, (v) => setState(() => _langitLangit = v!)),
          ],
        ),
      ),
      Step(
        title: const Text('Fasilitas'),
        isActive: _currentStep >= 3,
        state: _currentStep == 3 ? StepState.complete : StepState.indexed,
        content: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Isi fasilitas yang tersedia (kosongkan jika tidak ada):', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: CustomTextField(controller: _acSplitController, label: 'AC Split (Unit)', keyboardType: TextInputType.number)),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(controller: _acWindowController, label: 'AC Window', keyboardType: TextInputType.number)),
              ],
            ),
            const SizedBox(height: 12),
            CustomTextField(controller: _acSentralController, label: 'AC Sentral (Ada/Tidak)', hintText: '0 = Tidak, 1 = Ada', keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            CustomTextField(controller: _kolamRenangLuasController, label: 'Luas Kolam Renang (m²)', keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            CustomTextField(controller: _panjangPagarController, label: 'Panjang Pagar (m)', keyboardType: TextInputType.number),
          ],
        ),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final steps = _buildSteps();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Formulir LSPOP'),
        backgroundColor: theme.colorScheme.background,
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
                      text: isLastStep ? 'Simpan LSPOP' : 'Lanjut',
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
