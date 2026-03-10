import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';
import { ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function MyOrdersScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const orders = [
        {
            id: '405-1234567-1234567',
            date: 'Ordered on 12 Oct 2023',
            total: 149.99,
            status: 'Delivered',
            items: [MOCK_PRODUCTS[0]]
        },
        {
            id: '405-7654321-7654321',
            date: 'Ordered on 28 Sep 2023',
            total: 279.00,
            status: 'Delivered',
            items: [MOCK_PRODUCTS[1]]
        }
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color={COLORS.neutral[900]} />
                </TouchableOpacity>
                <AppText variant="lg" weight="bold">Your Orders</AppText>
                <View style={{ width: 44 }} />
            </View>

            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {orders.map((order) => (
                    <TouchableOpacity
                        key={order.id}
                        style={styles.orderCard}
                        activeOpacity={0.9}
                    >
                        <View style={styles.orderHeader}>
                            <AppText variant="sm" weight="bold">{order.date}</AppText>
                            <View style={styles.statusBadge}>
                                <AppText variant="xs" weight="bold" color={COLORS.success.DEFAULT}>
                                    {order.status}
                                </AppText>
                            </View>
                        </View>

                        <View style={styles.itemRow}>
                            <Image source={{ uri: order.items[0].image_url }} style={styles.itemImage} resizeMode="contain" />
                            <View style={styles.itemInfo}>
                                <AppText variant="sm" weight="medium" numberOfLines={2}>
                                    {order.items[0].name}
                                </AppText>
                                <AppText variant="xs" color={COLORS.neutral[500]}>
                                    Order #{order.id}
                                </AppText>
                            </View>
                            <ChevronRight size={20} color={COLORS.neutral[400]} />
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.trackButton}>
                            <AppText variant="sm" weight="bold" color={COLORS.neutral[700]}>
                                Track Package
                            </AppText>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 40 }} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[200],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        backgroundColor: COLORS.neutral[0],
        ...SHADOWS.sm,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: BORDERS.radius.full,
        backgroundColor: COLORS.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: SPACING.md,
    },
    orderCard: {
        backgroundColor: COLORS.neutral[0],
        padding: SPACING.lg,
        marginBottom: SPACING.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.neutral[300],
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    statusBadge: {
        backgroundColor: COLORS.success.light,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    itemImage: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.neutral[50],
    },
    itemInfo: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.neutral[200],
        marginVertical: SPACING.md,
    },
    trackButton: {
        backgroundColor: COLORS.neutral[100],
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
});
