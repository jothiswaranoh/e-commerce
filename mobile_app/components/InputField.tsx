import React, { useState, ReactNode } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDERS } from '@/lib/theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function InputField({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  ...props
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.neutral[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
    borderWidth: BORDERS.width.thin,
    borderColor: COLORS.neutral[100],
    borderRadius: BORDERS.radius.md,
    paddingHorizontal: SPACING.md,
  },

  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.neutral[900],
  },

  icon: {
    marginHorizontal: SPACING.xs,
  },

 inputFocused: {
  borderColor: COLORS.primary.DEFAULT,
  borderWidth: BORDERS.width.medium,
},

  inputError: {
    borderColor: COLORS.error.DEFAULT,
  },

  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error.DEFAULT,
    marginTop: SPACING.xs,
  },
});