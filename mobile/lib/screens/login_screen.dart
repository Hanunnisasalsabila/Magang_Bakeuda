import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/role_constants.dart';
import '../models/user.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_card.dart';
import 'change_password_screen.dart';
import 'home_desa_screen.dart';
import 'home_admin_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  String? _errorMessage;

  bool get _isFormValid => 
      _usernameController.text.trim().isNotEmpty && 
      _passwordController.text.isNotEmpty;

  void _onInputChanged() {
    setState(() {}); // Trigger rebuild to update button state
  }

  @override
  void initState() {
    super.initState();
    _usernameController.addListener(_onInputChanged);
    _passwordController.addListener(_onInputChanged);
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate() || !_isFormValid) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final result = await _authService.login(
      _usernameController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;

    setState(() {
      _isLoading = false;
    });

    if (result['success']) {
      final User user = result['user'];
      
      if (user.mustChangePassword) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const ChangePasswordScreen()),
        );
      } else {
        if (user.role == RoleConstants.perangkatDesa) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const HomeDesaScreen()),
          );
        } else if (user.role == RoleConstants.adminBkd) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const HomeAdminScreen()),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Role tidak dikenali')),
          );
        }
      }
    } else {
      setState(() {
        _errorMessage = result['message'];
      });
    }
  }

  @override
  void dispose() {
    _usernameController.removeListener(_onInputChanged);
    _passwordController.removeListener(_onInputChanged);
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: Stack(
        children: [
          // Modern Mesh Gradient Background
          Positioned.fill(
            child: Container(
              color: theme.colorScheme.background,
            ),
          ),
          Positioned(
            top: -150,
            left: -100,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: theme.colorScheme.primary.withOpacity(0.2),
              ),
            ),
          ),
          Positioned(
            bottom: -100,
            right: -100,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: theme.colorScheme.secondary.withOpacity(0.15),
              ),
            ),
          ),
          Positioned(
            top: 200,
            right: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF6E2C00).withOpacity(0.1), // tertiary container
              ),
            ),
          ),
          // Blur everything behind
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 60, sigmaY: 60),
              child: Container(color: Colors.transparent),
            ),
          ),
          
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: CustomCard(
                  isGlass: true,
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Logo & Title
                        Image.asset(
                          'assets/logo-purbalingga.png',
                          width: 80,
                          height: 80,
                          errorBuilder: (context, error, stackTrace) => 
                              const Icon(Icons.account_balance, size: 80, color: Colors.grey),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'SIPD Purbalingga',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            color: theme.colorScheme.onSurface,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Sistem Pajak Bumi Bangunan',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Error Message
                        if (_errorMessage != null)
                          Container(
                            padding: const EdgeInsets.all(12),
                            margin: const EdgeInsets.only(bottom: 24),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.errorContainer,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: theme.colorScheme.errorContainer.withOpacity(0.5),
                              ),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(
                                  Icons.error_outline,
                                  color: theme.colorScheme.onErrorContainer,
                                  size: 20,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _errorMessage!,
                                    style: TextStyle(
                                      color: theme.colorScheme.onErrorContainer,
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                        // Form Fields
                        CustomTextField(
                          label: 'Username',
                          hintText: 'Masukkan username',
                          controller: _usernameController,
                          prefixIcon: Icons.person_outline,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Username tidak boleh kosong';
                            }
                            if (value.length < 4) {
                              return 'Minimal 4 karakter';
                            }
                            if (value.contains(' ')) {
                              return 'Tidak boleh ada spasi';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        CustomTextField(
                          label: 'Password',
                          hintText: 'Masukkan password',
                          controller: _passwordController,
                          isPassword: true,
                          prefixIcon: Icons.lock_outline,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Password tidak boleh kosong';
                            }
                            if (value.length < 6) {
                              return 'Minimal 6 karakter';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 32),

                        // Submit Button
                        CustomButton(
                          text: 'Masuk ke Sistem',
                          isLoading: _isLoading,
                          onPressed: _isFormValid ? _login : null,
                        ),
                        
                        const SizedBox(height: 32),
                        const Divider(height: 1),
                        const SizedBox(height: 24),
                        
                        // Footer
                        Text(
                          '© ${DateTime.now().year} BAKEUDA Kab. Purbalingga\nVersi 2.0',
                          textAlign: TextAlign.center,
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: theme.colorScheme.outline,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
