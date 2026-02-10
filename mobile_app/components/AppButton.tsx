import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDERS, SHADOWS, GRADIENTS } from '@/lib/theme';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
}: AppButtonProps) {
    const sizeStyles = {
        sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg },
        md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
        lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING['2xl'] },
    };

    const textSizes = {
        sm: TYPOGRAPHY.fontSize.sm,
        md: TYPOGRAPHY.fontSize.md,
        lg: TYPOGRAPHY.fontSize.lg,
    };

    const gradientMap = {
        primary: GRADIENTS.primary,
        secondary: GRADIENTS.secondary,
        accent: GRADIENTS.accent,
        outline: [COLORS.neutral[0], COLORS.neutral[0]] as [string, string],
        ghost: ['transparent', 'transparent'] as [string, string],
    };

    const shadowMap = {
        primary: SHADOWS.primaryGlow,
        secondary: SHADOWS.md,
        accent: SHADOWS.accentGlow,
        outline: SHADOWS.none,
        ghost: SHADOWS.none,
    };

    const textColorMap = {
        primary: COLORS.neutral[0],
        secondary: COLORS.neutral[0],
        accent: COLORS.neutral[0],
        outline: COLORS.primary.DEFAULT,
        ghost: COLORS.primary.DEFAULT,
    };

    const isGradient = variant === 'primary' || variant === 'secondary' || variant === 'accent';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.button,
                sizeStyles[size],
                shadowMap[variant],
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                variant === 'outline' && styles.outline,
                style,
            ]}
        >
            <LinearGradient
                colors={disabled ? [COLORS.neutral[300], COLORS.neutral[400]] : gradientMap[variant]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient, sizeStyles[size], { borderRadius: BORDERS.radius.lg }]}
            >
                {loading ? (
                    <ActivityIndicator color={textColorMap[variant]} size="small" />
                ) : (
                    <Text
                        style={[
                            styles.text,
                            { fontSize: textSizes[size], color: disabled ? COLORS.neutral[500] : textColorMap[variant] },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDERS.radius.lg,
        overflow: 'hidden',
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        textAlign: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    outline: {
        borderWidth: BORDERS.width.medium,
        borderColor: COLORS.primary.DEFAULT,
    },
});
