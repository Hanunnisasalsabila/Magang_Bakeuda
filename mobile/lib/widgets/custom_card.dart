import 'dart:ui';
import 'package:flutter/material.dart';

class CustomCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final double borderRadius;
  final Color? color;
  final bool isGlass;

  const CustomCard({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.all(24.0),
    this.margin = EdgeInsets.zero,
    this.borderRadius = 16.0,
    this.color,
    this.isGlass = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    Widget card = Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: isGlass 
            ? (color ?? Colors.white).withOpacity(0.4) 
            : (color ?? theme.colorScheme.surface),
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: isGlass ? null : [
          BoxShadow(
            color: theme.colorScheme.onSurface.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
          BoxShadow(
            color: theme.colorScheme.onSurface.withOpacity(0.01),
            blurRadius: 2,
            offset: const Offset(0, 1),
            spreadRadius: 0,
          ),
        ],
        border: Border.all(
          color: isGlass 
              ? Colors.white.withOpacity(0.4) 
              : theme.colorScheme.outlineVariant.withOpacity(0.5),
          width: isGlass ? 1.5 : 1,
        ),
      ),
      child: child,
    );

    if (isGlass) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: card,
        ),
      );
    }

    return card;
  }
}
