import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDERS } from '@/lib/theme';

interface InputFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export default function InputField({
    label,
    error,
    containerStyle,
    ...props
}: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
                placeholderTextColor={COLORS.neutral[400]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
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
        color: COLORS.neutral[700],
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.neutral[50],
        borderWidth: BORDERS.width.thin,
        borderColor: COLORS.neutral[200],
        borderRadius: BORDERS.radius.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.neutral[900],
    },
    inputFocused: {
        borderColor: COLORS.primary[500],
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
