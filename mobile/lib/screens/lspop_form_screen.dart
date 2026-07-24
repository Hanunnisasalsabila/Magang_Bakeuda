import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';

class LspopFormScreen extends StatefulWidget {
  /// Jika [idTransaksiSpop] diisi, LSPOP ini akan dikirim bersamaan sebagai bagian dari transaksi SPOP tersebut.
  final String? idTransaksiSpop;
  const LspopFormScreen({super.key, this.idTransaksiSpop});

  @override
  State<LspopFormScreen> createState() => _LspopFormScreenState();
}

class _LspopFormScreenState extends State<LspopFormScreen> {
  final _spopService = TransaksiSpopService(ApiService());
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  // Step 1 - Induk
  final _noFormulirController = TextEditingController();
  final _jumlahBngController = TextEditingController(text: '1');
  String _jenisTransaksi = 'PEREKAMAN';

  // Step 2 - Rincian Bangunan
  String _jenisPenggunaan = 'PERUMAHAN';
  final _luasBangunanController = TextEditingController();
  final _jumlahLantaiController = TextEditingController();
  final _tahunDibangunController = TextEditingController();
  final _tahunDirenovasiController = TextEditingController();
  final _dayaListrikController = TextEditingController();

  // Step 3 - Material
  String _kondisi = 'BAIK';
  String _konstruksi = 'BETON';
  String _atap = 'GENTING_BETON';
  String _dinding = 'BATA_BATAKO';
  String _lantai = 'MARMER_KERAMIK';
  String _langitLangit = 'GYPSUM_TRIPLEK';

  // Step 4 - Fasilitas
  final _acSplitController = TextEditingController();
  final _acWindowController = TextEditingController();
  final _kolamRenangController = TextEditingController();
  final _panjangPagarController = TextEditingController();

  // Options mapped to backend enum values
  final List<Map<String, String>> _jenisTransaksiOptions = [
    {'label': 'Perekaman Data', 'value': 'PEREKAMAN'},
    {'label': 'Pemutakhiran Data', 'value': 'PEMUTAKHIRAN'},
    {'label': 'Penghapusan Data', 'value': 'PENGHAPUSAN'},
  ];
  final List<Map<String, String>> _penggunaanOptions = [
    {'label': 'Perumahan', 'value': 'PERUMAHAN'},
    {'label': 'Perkantoran', 'value': 'PERKANTORAN'},
    {'label': 'Pabrik', 'value': 'PABRIK'},
    {'label': 'Toko/Apotek', 'value': 'TOKO_APOTEK'},
    {'label': 'Rumah Sakit', 'value': 'RUMAH_SAKIT'},
    {'label': 'Hotel/Wisma', 'value': 'HOTEL_WISMA'},
    {'label': 'Olahraga', 'value': 'OLAHRAGA'},
  ];
  final List<Map<String, String>> _kondisiOptions = [
    {'label': 'Sangat Baik', 'value': 'SANGAT_BAIK'},
    {'label': 'Baik', 'value': 'BAIK'},
    {'label': 'Sedang', 'value': 'SEDANG'},
    {'label': 'Jelek', 'value': 'JELEK'},
  ];
  final List<Map<String, String>> _konstruksiOptions = [
    {'label': 'Baja', 'value': 'BAJA'},
    {'label': 'Beton', 'value': 'BETON'},
    {'label': 'Batu Bata', 'value': 'BATU_BATA'},
    {'label': 'Kayu', 'value': 'KAYU'},
  ];
  final List<Map<String, String>> _atapOptions = [
    {'label': 'Decra/Beton', 'value': 'DECRA_BETON'},
    {'label': 'Genting/Beton', 'value': 'GENTING_BETON'},
    {'label': 'Seng/Asbes', 'value': 'SENG_ASBES'},
    {'label': 'Kayu/Sirap', 'value': 'KAYU_SIRAP'},
  ];
  final List<Map<String, String>> _dindingOptions = [
    {'label': 'Kaca', 'value': 'KACA'},
    {'label': 'Bata/Batako', 'value': 'BATA_BATAKO'},
    {'label': 'Kayu', 'value': 'KAYU'},
    {'label': 'Seng', 'value': 'SENG'},
  ];
  final List<Map<String, String>> _lantaiOptions = [
    {'label': 'Marmer/Keramik', 'value': 'MARMER_KERAMIK'},
    {'label': 'Ubin/Semen', 'value': 'UBIN_SEMEN'},
    {'label': 'Kayu', 'value': 'KAYU'},
  ];
  final List<Map<String, String>> _langitOptions = [
    {'label': 'Gypsum/Triplek', 'value': 'GYPSUM_TRIPLEK'},
    {'label': 'Asbes', 'value': 'ASBES'},
    {'label': 'Tidak Ada', 'value': 'TIDAK_ADA'},
  ];

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
    _kolamRenangController.dispose();
    _panjangPagarController.dispose();
    super.dispose();
  }

  Map<String, dynamic> _buildBangunanPayload() {
    return {
      if (_noFormulirController.text.isNotEmpty) 'noFormulir': _noFormulirController.text,
      'jenisTransaksi': _jenisTransaksi,
      if (_jumlahBngController.text.isNotEmpty) 'jumlahBng': _jumlahBngController.text,
      'jenisPenggunaan': _jenisPenggunaan,
      'luasBangunan': double.tryParse(_luasBangunanController.text) ?? 0.0,
      if (_jumlahLantaiController.text.isNotEmpty) 'jumlahLantai': int.tryParse(_jumlahLantaiController.text),
      if (_tahunDibangunController.text.isNotEmpty) 'tahunDibangun': _tahunDibangunController.text,
      if (_tahunDirenovasiController.text.isNotEmpty) 'tahunDirenovasi': _tahunDirenovasiController.text,
      if (_dayaListrikController.text.isNotEmpty) 'dayaListrik': double.tryParse(_dayaListrikController.text),
      'kondisi': _kondisi,
      'konstruksi': _konstruksi,
      'atap': _atap,
      'dinding': _dinding,
      'lantai': _lantai,
      'langitLangit': _langitLangit,
      if (_acSplitController.text.isNotEmpty) 'acSplit': int.tryParse(_acSplitController.text),
      if (_acWindowController.text.isNotEmpty) 'acWindow': int.tryParse(_acWindowController.text),
      if (_kolamRenangController.text.isNotEmpty) 'kolamRenangLuas': double.tryParse(_kolamRenangController.text),
      if (_panjangPagarController.text.isNotEmpty) 'panjangPagar': double.tryParse(_panjangPagarController.text),
    };
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      // LSPOP dikirim sebagai bagian dari transaksi SPOP (field 'bangunan')
      // Jika idTransaksiSpop tersedia, update transaksi tersebut
      // Jika tidak, buat transaksi baru dengan bangunan embedded
      final bangunanPayload = _buildBangunanPayload();

      if (widget.idTransaksiSpop != null) {
        // TODO: patch existing transaksi dengan data bangunan
        // Untuk sementara submit sebagai transaksi baru dengan bangunan
      }

      // Submit sebagai transaksi baru dengan bangunan embedded
      await _spopService.submitSpop({
        'jenis_layanan': 'PERUBAHAN_DATA',
        'is_draft': false,
        'subjek_pajak': {
          'nama': 'Data dari LSPOP',
          'nik': '0000000000000000',
          'status_wp': 'PEMILIK',
          'pekerjaan': 'LAINNYA',
          'alamat': '-',
          'rt': '00',
          'rw': '00',
          'kelurahan': '-',
          'kabupaten': 'Purbalingga',
        },
        'objek_pajak_sementara': {
          'jenis_tanah': 'TANAH_DAN_BANGUNAN',
          'luas_tanah': 0,
          'jalan_op': '-',
          'kelurahan_op': '-',
          'kecamatan_op': '-',
        },
        'bangunan': [bangunanPayload],
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Data LSPOP berhasil disimpan!'), backgroundColor: Colors.green),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal kirim LSPOP: $e'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildDropdown(String label, String value, List<Map<String, String>> options, Function(String?) onChanged) {
    final sortedOptions = List<Map<String, String>>.from(options)
      ..sort((a, b) => a['label']!.compareTo(b['label']!));
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
        items: sortedOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
        onChanged: onChanged,
      ),
    );
  }

  List<Step> _buildSteps(ThemeData theme) {
    BoxDecoration cardDecoration = BoxDecoration(
      color: theme.colorScheme.surface,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(color: theme.colorScheme.shadow.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4)),
      ],
      border: Border.all(color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5)),
    );

    return [
      Step(
        title: const Text('Induk'),
        isActive: _currentStep >= 0,
        state: _currentStep > 0 ? StepState.complete : StepState.indexed,
        content: Container(
          padding: const EdgeInsets.all(20),
          decoration: cardDecoration,
          child: Column(
          children: [
            CustomTextField(controller: _noFormulirController, label: 'No. Formulir SPOP', hintText: 'Nomor Formulir', keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            _buildDropdown('Jenis Transaksi', _jenisTransaksi, _jenisTransaksiOptions, (v) => setState(() => _jenisTransaksi = v!)),
            CustomTextField(controller: _jumlahBngController, label: 'Jumlah Bangunan', hintText: 'Total bangunan di objek ini', keyboardType: TextInputType.number),
          ],
         ),
        ),
      ),
      Step(
        title: const Text('Rincian'),
        isActive: _currentStep >= 1,
        state: _currentStep > 1 ? StepState.complete : StepState.indexed,
        content: Container(
          padding: const EdgeInsets.all(20),
          decoration: cardDecoration,
          child: Column(
          children: [
            _buildDropdown('Jenis Penggunaan', _jenisPenggunaan, _penggunaanOptions, (v) => setState(() => _jenisPenggunaan = v!)),
            Row(children: [
              Expanded(child: CustomTextField(controller: _luasBangunanController, label: 'Luas (m²) *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _jumlahLantaiController, label: 'Jml Lantai', keyboardType: TextInputType.number)),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(controller: _tahunDibangunController, label: 'Thn Bangun *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _tahunDirenovasiController, label: 'Thn Renov', keyboardType: TextInputType.number)),
            ]),
            const SizedBox(height: 12),
            CustomTextField(controller: _dayaListrikController, label: 'Daya Listrik (Watt)', keyboardType: TextInputType.number),
          ],
         ),
        ),
      ),
      Step(
        title: const Text('Material'),
        isActive: _currentStep >= 2,
        state: _currentStep > 2 ? StepState.complete : StepState.indexed,
        content: Container(
          padding: const EdgeInsets.all(20),
          decoration: cardDecoration,
          child: Column(
          children: [
            _buildDropdown('Kondisi Bangunan', _kondisi, _kondisiOptions, (v) => setState(() => _kondisi = v!)),
            _buildDropdown('Jenis Konstruksi', _konstruksi, _konstruksiOptions, (v) => setState(() => _konstruksi = v!)),
            _buildDropdown('Material Atap', _atap, _atapOptions, (v) => setState(() => _atap = v!)),
            _buildDropdown('Material Dinding', _dinding, _dindingOptions, (v) => setState(() => _dinding = v!)),
            _buildDropdown('Material Lantai', _lantai, _lantaiOptions, (v) => setState(() => _lantai = v!)),
            _buildDropdown('Langit-Langit', _langitLangit, _langitOptions, (v) => setState(() => _langitLangit = v!)),
          ],
         ),
        ),
      ),
      Step(
        title: const Text('Fasilitas'),
        isActive: _currentStep >= 3,
        state: _currentStep == 3 ? StepState.indexed : StepState.indexed,
        content: Container(
          padding: const EdgeInsets.all(20),
          decoration: cardDecoration,
          child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Isi fasilitas yang tersedia (kosongkan jika tidak ada):', style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant)),
            const SizedBox(height: 16),
            Row(children: [
              Expanded(child: CustomTextField(controller: _acSplitController, label: 'AC Split (Unit)', keyboardType: TextInputType.number)),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(controller: _acWindowController, label: 'AC Window (Unit)', keyboardType: TextInputType.number)),
            ]),
            const SizedBox(height: 12),
            CustomTextField(controller: _kolamRenangController, label: 'Luas Kolam Renang (m²)', keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            CustomTextField(controller: _panjangPagarController, label: 'Panjang Pagar (m)', keyboardType: TextInputType.number),
          ],
         ),
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
        title: const Text('Formulir LSPOP'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
      ),
      body: Container(
        color: theme.colorScheme.surfaceContainerLowest,
        child: Theme(
          data: Theme.of(context).copyWith(
            canvasColor: Colors.transparent,
          ),
          child: Form(
            key: _formKey,
            child: Stepper(
              type: StepperType.horizontal,
              elevation: 0,
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
                      ],
                    ],
                  ),
                );
              },
              steps: steps,
            ).animate().fadeIn(duration: 400.ms),
          ),
        ),
      ),
    );
  }
}
