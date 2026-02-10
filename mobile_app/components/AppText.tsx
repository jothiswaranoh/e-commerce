import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/lib/theme';

interface AppTextProps {
    variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    color?: string;
    style?: TextStyle;
    numberOfLines?: number;
}

export default function AppText({
    children,
    variant = 'md',
    weight = 'regular',
    color = COLORS.neutral[900],
    style,
    numberOfLines,
}: React.PropsWithChildren<AppTextProps>) {
    return (
        <Text
            style={[
                {
                    fontSize: TYPOGRAPHY.fontSize[variant],
                    fontWeight: TYPOGRAPHY.fontWeight[weight],
                    color,
                },
                style,
            ]}
            numberOfLines={numberOfLines}
        >
            {children}
        </Text>
    );
}
