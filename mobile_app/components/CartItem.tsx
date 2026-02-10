import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Minus, Plus, Trash2, Star } from 'lucide-react-native';
import AppText from './AppText';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

interface CartItemProps {
    item: any;
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="contain" />
                </View>
                <View style={styles.info}>
                    <AppText variant="md" numberOfLines={2} style={styles.title}>
                        {item.name}
                    </AppText>
                    <View style={styles.priceRow}>
                        <AppText variant="lg" weight="bold" color={COLORS.neutral[700]}>
                            ${item.price.toFixed(2)}
                        </AppText>
                        {item.isPrime && (
                            <AppText variant="xs" weight="bold" color={COLORS.info.DEFAULT}> prime</AppText>
                        )}
                    </View>
                    <AppText variant="xs" color={COLORS.success.DEFAULT} weight="medium">
                        In Stock
                    </AppText>
                    <AppText variant="xs" color={COLORS.neutral[500]}>
                        Eligible for FREE Shipping
                    </AppText>

                    <View style={styles.actionsRow}>
                        <View style={styles.quantitySelector}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => onUpdateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus size={16} color={item.quantity <= 1 ? COLORS.neutral[400] : COLORS.neutral[900]} />
                            </TouchableOpacity>
                            <View style={styles.qtyValue}>
                                <AppText variant="md" weight="medium">{item.quantity}</AppText>
                            </View>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => onUpdateQuantity(item.id, 1)}
                            >
                                <Plus size={16} color={COLORS.neutral[900]} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => onRemove(item.id)}
                        >
                            <Trash2 size={18} color={COLORS.neutral[600]} />
                            <AppText variant="sm" color={COLORS.neutral[600]}>Delete</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.neutral[0],
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[200],
    },
    content: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    imageWrapper: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.neutral[50],
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    info: {
        flex: 1,
        gap: 2,
    },
    title: {
        lineHeight: 20,
        color: COLORS.neutral[700],
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.md,
        gap: SPACING.xl,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
        backgroundColor: COLORS.neutral[100],
        ...SHADOWS.sm,
    },
    qtyBtn: {
        padding: 8,
    },
    qtyValue: {
        paddingHorizontal: 12,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: COLORS.neutral[300],
        backgroundColor: COLORS.neutral[0],
        height: '100%',
        justifyContent: 'center',
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});
