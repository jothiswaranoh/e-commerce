import React, { useRef } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import AppText from './AppText';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import { Product } from '@/lib/mock-data';

interface ProductCardProps {
    product: Product;
    onPress?: () => void;
    variant?: 'default' | 'compact' | 'horizontal';
}

export default function ProductCard({ product, onPress, variant = 'default' }: ProductCardProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const formatReviewCount = (count: number) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
        return `${count}`;
    };

    if (variant === 'compact') {
        return (
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.compactTouchable}
            >
                <Animated.View style={[styles.compactCard, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.compactImageContainer}>
                        <Image source={{ uri: product.image_url }} style={styles.compactImage} resizeMode="contain" />
                    </View>
                    <View style={styles.compactInfo}>
                        <AppText variant="sm" numberOfLines={2} style={styles.compactTitle}>
                            {product.name}
                        </AppText>
                        <View style={styles.ratingRow}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={10}
                                        color={s <= Math.round(product.rating) ? COLORS.accent.DEFAULT : COLORS.neutral[300]}
                                        fill={s <= Math.round(product.rating) ? COLORS.accent.DEFAULT : 'transparent'}
                                    />
                                ))}
                            </View>
                            <AppText variant="xs" color={COLORS.info.DEFAULT}>
                                {formatReviewCount(product.reviewCount)}
                            </AppText>
                        </View>
                        <View style={styles.priceRow}>
                            <AppText variant="lg" weight="medium" color={COLORS.neutral[700]}>
                                ${product.price}
                            </AppText>
                            {product.originalPrice && (
                                <AppText variant="xs" color={COLORS.neutral[500]} style={styles.strikethrough}>
                                    ${product.originalPrice}
                                </AppText>
                            )}
                        </View>
                        {product.isPrime && (
                            <AppText variant="xs" weight="bold" color={COLORS.info.DEFAULT}>
                                prime
                            </AppText>
                        )}
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="contain" />
                    {product.discount && (
                        <View style={styles.discountBadge}>
                            <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                                {product.discount}% off
                            </AppText>
                        </View>
                    )}
                </View>
                <View style={styles.content}>
                    <AppText variant="md" numberOfLines={2} style={styles.title}>
                        {product.name}
                    </AppText>
                    <View style={styles.ratingContainer}>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    color={star <= Math.round(product.rating) ? COLORS.accent.DEFAULT : COLORS.neutral[300]}
                                    fill={star <= Math.round(product.rating) ? COLORS.accent.DEFAULT : 'transparent'}
                                />
                            ))}
                        </View>
                        <AppText variant="sm" color={COLORS.info.DEFAULT}>
                            {formatReviewCount(product.reviewCount)}
                        </AppText>
                    </View>
                    <View style={styles.priceContainer}>
                        <AppText variant="xl" weight="medium" color={COLORS.neutral[700]}>
                            ${product.price.toFixed(2)}
                        </AppText>
                        {product.originalPrice && (
                            <AppText variant="sm" color={COLORS.neutral[500]} style={styles.strikethrough}>
                                ${product.originalPrice.toFixed(2)}
                            </AppText>
                        )}
                    </View>
                    {product.isPrime && (
                        <AppText variant="xs" weight="bold" color={COLORS.info.DEFAULT}>
                            ✓prime
                        </AppText>
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.neutral[0],
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.neutral[200],
        marginBottom: SPACING.md,
    },
    imageContainer: {
        backgroundColor: COLORS.neutral[50],
        padding: SPACING.md,
    },
    image: {
        width: '100%',
        height: 180,
    },
    discountBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: COLORS.error.DEFAULT,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    content: {
        padding: SPACING.md,
    },
    title: {
        marginBottom: 4,
        lineHeight: 20,
        color: COLORS.neutral[700],
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 1,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
    },
    // Compact variant
    compactTouchable: {
        marginBottom: SPACING.md,
    },
    compactCard: {
        backgroundColor: COLORS.neutral[0],
        width: '100%',
    },
    compactImageContainer: {
        backgroundColor: COLORS.neutral[50],
        borderRadius: 4,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    compactImage: {
        width: '100%',
        height: '100%',
    },
    compactInfo: {
        paddingVertical: 8,
    },
    compactTitle: {
        fontSize: 13,
        lineHeight: 18,
        color: COLORS.neutral[700],
        marginBottom: 2,
        height: 36,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
});
