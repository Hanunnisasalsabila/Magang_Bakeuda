class User {
  final String id;
  final String namaLengkap;
  final String username;
  final String role;
  final String kodeWilayah;
  final bool mustChangePassword;

  User({
    required this.id,
    required this.namaLengkap,
    required this.username,
    required this.role,
    required this.kodeWilayah,
    required this.mustChangePassword,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      namaLengkap: json['nama_lengkap'] ?? '',
      username: json['username'] ?? '',
      role: json['role'] ?? '',
      kodeWilayah: json['kode_wilayah'] ?? '',
      mustChangePassword: json['must_change_password'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nama_lengkap': namaLengkap,
      'username': username,
      'role': role,
      'kode_wilayah': kodeWilayah,
      'must_change_password': mustChangePassword,
    };
  }
}
