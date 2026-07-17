import 'package:flutter/material.dart';

class MonitoringPajakTab extends StatefulWidget {
  const MonitoringPajakTab({super.key});

  @override
  State<MonitoringPajakTab> createState() => _MonitoringPajakTabState();
}

class _MonitoringPajakTabState extends State<MonitoringPajakTab> {
  String _searchQuery = '';
  String _selectedFilter = 'Semua';
  
  final List<String> _filters = ['Semua', 'Aktif', 'Menunggu Verifikasi', 'Ditolak'];

  // Dummy Data
  final List<Map<String, dynamic>> _dummyData = [
    {
      'nop': '33.03.010.001.001-0001.0',
      'nama': 'Budi Santoso',
      'alamat': 'Jl. Jend. Sudirman No. 12',
      'status': 'Aktif',
      'tanggal': '12 Jul 2026',
    },
    {
      'nop': '33.03.010.001.001-0002.0',
      'nama': 'Siti Aminah',
      'alamat': 'Jl. Ahmad Yani No. 45',
      'status': 'Menunggu Verifikasi',
      'tanggal': '15 Jul 2026',
    },
    {
      'nop': '33.03.010.001.001-0003.0',
      'nama': 'Agus Pratama',
      'alamat': 'Jl. MT Haryono No. 8',
      'status': 'Ditolak',
      'tanggal': '10 Jul 2026',
    },
    {
      'nop': '33.03.010.001.001-0004.0',
      'nama': 'Rina Wati',
      'alamat': 'Jl. Diponegoro No. 22',
      'status': 'Aktif',
      'tanggal': '01 Jul 2026',
    },
  ];

  List<Map<String, dynamic>> get _filteredData {
    return _dummyData.where((item) {
      final matchesSearch = item['nop'].toLowerCase().contains(_searchQuery.toLowerCase()) ||
                            item['nama'].toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesFilter = _selectedFilter == 'Semua' || item['status'] == _selectedFilter;
      return matchesSearch && matchesFilter;
    }).toList();
  }

  Color _getStatusColor(String status, ColorScheme colorScheme) {
    switch (status) {
      case 'Aktif':
        return Colors.green;
      case 'Menunggu Verifikasi':
        return Colors.orange;
      case 'Ditolak':
        return colorScheme.error;
      default:
        return colorScheme.onSurfaceVariant;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        // Header & Search
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Monitoring Objek Pajak',
                style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Cari NOP atau Nama Wajib Pajak...',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                  contentPadding: const EdgeInsets.symmetric(vertical: 0),
                ),
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
              ),
              const SizedBox(height: 16),
              // Filters
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _filters.map((filter) {
                    final isSelected = _selectedFilter == filter;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: ChoiceChip(
                        label: Text(filter),
                        selected: isSelected,
                        onSelected: (selected) {
                          if (selected) {
                            setState(() {
                              _selectedFilter = filter;
                            });
                          }
                        },
                        selectedColor: theme.colorScheme.primary,
                        labelStyle: TextStyle(
                          color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.onSurfaceVariant,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
        
        // List View
        Expanded(
          child: _filteredData.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.inbox_outlined, size: 64, color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.5)),
                      const SizedBox(height: 16),
                      Text('Tidak ada data ditemukan', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _filteredData.length,
                  itemBuilder: (context, index) {
                    final data = _filteredData[index];
                    final statusColor = _getStatusColor(data['status'], theme.colorScheme);

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                      color: theme.colorScheme.surface,
                      child: InkWell(
                        onTap: () {
                          
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: statusColor.withValues(alpha: 0.1),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      data['status'],
                                      style: TextStyle(
                                        color: statusColor,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    data['tanggal'],
                                    style: theme.textTheme.bodySmall?.copyWith(
                                      color: theme.colorScheme.onSurfaceVariant,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                data['nop'],
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: theme.colorScheme.primary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                data['nama'],
                                style: theme.textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Icon(Icons.location_on_outlined, size: 16, color: theme.colorScheme.onSurfaceVariant),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      data['alamat'],
                                      style: theme.textTheme.bodyMedium?.copyWith(
                                        color: theme.colorScheme.onSurfaceVariant,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
