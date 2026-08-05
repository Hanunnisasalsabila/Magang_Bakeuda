import 'package:flutter/material.dart';
import '../services/notifikasi_service.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';
import 'pelacakan_dokumen_detail_screen.dart';
const Color _kNavy = Color(0xFF0F2C59);
const Color _kGold = Color(0xFFE8B831);

class NotifikasiScreen extends StatefulWidget {
  const NotifikasiScreen({super.key});

  @override
  State<NotifikasiScreen> createState() => _NotifikasiScreenState();
}

class _NotifikasiScreenState extends State<NotifikasiScreen> {
  final _notifikasiService = NotifikasiService(ApiService());
  List<dynamic> _notifikasi = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNotifikasi();
  }

  Future<void> _fetchNotifikasi() async {
    setState(() => _isLoading = true);
    try {
      final res = await _notifikasiService.getNotifikasi();
      if (res['success']) {
        setState(() {
          _notifikasi = res['data']['items'];
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _markAsRead(String id, int index) async {
    if (_notifikasi[index]['is_read']) return;
    try {
      await _notifikasiService.markAsRead(id);
      setState(() {
        _notifikasi[index]['is_read'] = true;
      });
    } catch (e) {
      // Ignore
    }
  }

  Future<void> _markAllAsRead() async {
    try {
      await _notifikasiService.markAllAsRead();
      setState(() {
        for (var n in _notifikasi) {
          n['is_read'] = true;
        }
      });
    } catch (e) {
      // Ignore
    }
  }

  String _formatDate(String isoString) {
    final date = DateTime.parse(isoString).toLocal();
    return DateFormat('dd MMM yyyy, HH:mm').format(date);
  }

  IconData _getIcon(String type) {
    switch (type) {
      case 'SPOP_SUBMITTED':
        return Icons.assignment_add;
      case 'SPOP_APPROVED':
        return Icons.check_circle;
      case 'SPOP_REJECTED':
        return Icons.error;
      default:
        return Icons.notifications;
    }
  }

  Color _getIconColor(String type) {
    switch (type) {
      case 'SPOP_SUBMITTED':
        return Colors.blue;
      case 'SPOP_APPROVED':
        return Colors.green;
      case 'SPOP_REJECTED':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Notifikasi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: _kNavy,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(3),
          child: Container(height: 3, color: _kGold),
        ),
        actions: [
          if (_notifikasi.any((n) => !n['is_read']))
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text('Tandai Semua Dibaca', style: TextStyle(color: Colors.white70, fontSize: 12)),
            )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _notifikasi.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.notifications_off, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('Belum ada notifikasi', style: TextStyle(color: Colors.grey)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _fetchNotifikasi,
                  child: ListView.separated(
                    itemCount: _notifikasi.length,
                    separatorBuilder: (context, index) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final notif = _notifikasi[index];
                      final isRead = notif['is_read'];
                      return ListTile(
                        tileColor: isRead ? null : Colors.blue.withOpacity(0.05),
                        leading: CircleAvatar(
                          backgroundColor: _getIconColor(notif['type']).withOpacity(0.1),
                          child: Icon(_getIcon(notif['type']), color: _getIconColor(notif['type'])),
                        ),
                        title: Text(
                          notif['title'],
                          style: TextStyle(
                            fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text(
                              notif['message'],
                              style: TextStyle(
                                color: isRead ? Colors.grey.shade700 : Colors.black87,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _formatDate(notif['created_at']),
                              style: const TextStyle(color: Colors.grey, fontSize: 11),
                            ),
                          ],
                        ),
                        onTap: () {
                          _markAsRead(notif['id'], index);
                          if (notif['reference_id'] != null && notif['reference_id'].toString().isNotEmpty) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => PelacakanDokumenDetailScreen(
                                  idTransaksi: notif['reference_id'],
                                ),
                              ),
                            );
                          }
                        },
                      );
                    },
                  ),
                ),
    );
  }
}
