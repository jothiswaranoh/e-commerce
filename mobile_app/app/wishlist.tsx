import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react-native';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import ProductCard from '@/components/ProductCard';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function WishlistScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    // Mock wishlist items
    const wishlistItems = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2], MOCK_PRODUCTS[5]];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color={COLORS.neutral[900]} />
                </TouchableOpacity>
                <AppText variant="lg" weight="bold">My Wishlist</AppText>
                <View style={{ width: 44 }} />
            </View>

            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.grid}>
                    {wishlistItems.map((product) => (
                        <View key={product.id} style={styles.gridItem}>
                            <ProductCard
                                product={product}
                                variant="compact"
                                onPress={() => router.push(`/product/${product.id}`)}
                            />
                            <TouchableOpacity style={styles.removeHeart} activeOpacity={0.7}>
                                <Heart size={20} color={COLORS.error.DEFAULT} fill={COLORS.error.DEFAULT} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {wishlistItems.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Heart size={80} color={COLORS.neutral[200]} />
                        <AppText variant="lg" weight="semibold" style={styles.emptyText}>Your wishlist is empty</AppText>
                        <AppButton
                            title="Browse Products"
                            onPress={() => router.replace('/(tabs)')}
                            variant="primary"
                            style={styles.browseButton}
                        />
                    </View>
                )}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[50],
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
        padding: SPACING.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -SPACING.xs,
    },
    gridItem: {
        width: '50%',
        paddingHorizontal: SPACING.xs,
        position: 'relative',
    },
    removeHeart: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.lg,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
        zIndex: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        marginTop: SPACING.xl,
        color: COLORS.neutral[400],
        marginBottom: SPACING.xl,
    },
    browseButton: {
        paddingHorizontal: SPACING['2xl'],
    },
});
