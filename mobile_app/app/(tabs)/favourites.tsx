import { useRouter } from 'expo-router';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavourite } from '@/context/FavouriteContext';
import ProductCard from '@/components/ProductCard';
import AppText from '@/components/AppText';
import { COLORS, SPACING } from '@/lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Heart, SlidersHorizontal, ChevronRight } from 'lucide-react-native';

export default function FavouritesScreen() {
    const router = useRouter();
    const { favourites } = useFavourite();
    const [filter, setFilter] = useState<'all' | 'low' | 'high' | 'rating'>('all');

    let filteredProducts = [...favourites];

    if (filter === 'low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (filter === 'high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (filter === 'rating') {
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const renderFilterChip = (filterType: typeof filter, label: string) => {
        const isActive = filter === filterType;
        return (
            <TouchableOpacity
                key={filterType}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilter(filterType)}
            >
                <AppText 
                    variant="sm" 
                    weight={isActive ? 'semibold' : 'regular'}
                    color={isActive ? COLORS.neutral[0] : COLORS.neutral[500]}
                >
                    {label}
                </AppText>
            </TouchableOpacity>
        );
    };

    if (favourites.length === 0) {
        return (
            <View style={styles.container}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.emptyHeader}>
                        <AppText variant="xl" weight="bold">Wishlist</AppText>
                    </View>
                </SafeAreaView>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Heart size={48} color={COLORS.neutral[300]} />
                    </View>
                    <AppText variant="lg" weight="bold" style={styles.emptyTitle}>
                        Your wishlist is empty
                    </AppText>
                    <AppText variant="sm" color={COLORS.neutral[500]} style={styles.emptyText}>
                        Save items you love by tapping the heart icon
                    </AppText>
                    <TouchableOpacity 
                        style={styles.shopNowBtn}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <AppText variant="sm" weight="semibold" color={COLORS.neutral[0]}>
                            Start Shopping
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/*header*/}
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <AppText variant="xl" weight="bold">
                            Wishlist
                        </AppText>
                        <AppText variant="sm" color={COLORS.neutral[500]}>
                            {favourites.length} {favourites.length === 1 ? 'item' : 'items'}
                        </AppText>
                    </View>
                </SafeAreaView>
            </View>

            {/*filter*/}
            <View style={styles.filterSection}>
                <View style={styles.filterRow}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {renderFilterChip('all', 'All')}
                        {renderFilterChip('rating', 'Top Rated')}
                        {renderFilterChip('high', 'Price: High to Low')}
                        {renderFilterChip('low', 'Price: Low to High')}
                    </ScrollView>
                </View>
            </View>

            {/* prodgrid*/}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item, index }) => (
                    <View style={[styles.cardWrapper, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
                        <ProductCard
                            product={item}
                            variant="compact"
                            onPress={() => router.push(`/product/${item.id}`)}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[50],
    },
    header: {
        backgroundColor: COLORS.neutral[0],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[300],
    },
    headerContent: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    filterSection: {
        backgroundColor: COLORS.neutral[0],
        paddingBottom: SPACING.sm,
    },
    filterRow: {
        paddingVertical: SPACING.sm,
    },
    filterScroll: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    filterChip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        backgroundColor: COLORS.neutral[100],
    },
    filterChipActive: {
        backgroundColor: COLORS.primary.DEFAULT,
    },
    list: {
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.md,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48%',
        marginBottom: SPACING.md,
    },
    cardLeft: {
        marginRight: SPACING.xs,
    },
    cardRight: {
        marginLeft: SPACING.xs,
    },
    
    emptyHeader: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        marginBottom: SPACING.sm,
    },
    emptyText: {
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    shopNowBtn: {
        backgroundColor: COLORS.primary.DEFAULT,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: 25,
    },
});

