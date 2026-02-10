import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Search, Menu } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING, BORDERS, SHADOWS, GRADIENTS } from '@/lib/theme';
import { CATEGORIES } from '@/lib/constants';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - SPACING.lg * 2 - SPACING.md * 2) / 3;

export default function CategoriesScreen() {
    const router = useRouter();

    const renderCategoryItem = (category: any) => {
        const IconComponent = category.icon;
        return (
            <TouchableOpacity
                key={category.id}
                style={styles.gridItem}
                activeOpacity={0.7}
                onPress={() => { }}
            >
                <View style={[styles.iconWrapper, { backgroundColor: category.color + '15' }]}>
                    <IconComponent size={28} color={category.color} />
                </View>
                <AppText variant="xs" weight="medium" style={styles.categoryName} numberOfLines={1}>
                    {category.name}
                </AppText>
            </TouchableOpacity>
        );
    };

    const renderListCategory = (category: any) => {
        const IconComponent = category.icon;
        return (
            <TouchableOpacity
                key={`list-${category.id}`}
                style={styles.listItem}
                activeOpacity={0.7}
                onPress={() => { }}
            >
                <View style={styles.listContent}>
                    <IconComponent size={20} color={COLORS.neutral[500]} />
                    <AppText variant="md" style={styles.listText}>{category.name}</AppText>
                    <ChevronRight size={16} color={COLORS.neutral[300]} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Amazon Search Header */}
            <LinearGradient
                colors={GRADIENTS.amazonHeader}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.searchBarWrapper}>
                        <View style={styles.searchBar}>
                            <Search size={20} color={COLORS.neutral[900]} style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search Shop.com"
                                style={styles.searchInput}
                                placeholderTextColor={COLORS.neutral[500]}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                stickyHeaderIndices={[1]}
                showsVerticalScrollIndicator={false}
            >
                {/* Popular Departments Title */}
                <View style={[styles.sectionHeader, { paddingTop: SPACING.lg }]}>
                    <AppText variant="lg" weight="bold">Popular Departments</AppText>
                </View>

                {/* Popular Tiled Grid */}
                <View style={styles.gridContainer}>
                    {CATEGORIES.slice(0, 9).map(renderCategoryItem)}
                </View>

                {/* Full Directory Section */}
                <View style={styles.directorySection}>
                    <View style={styles.sectionHeader}>
                        <AppText variant="lg" weight="bold">Shop by Department</AppText>
                    </View>
                    <View style={styles.listContainer}>
                        {CATEGORIES.map(renderListCategory)}
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[100],
    },
    headerGradient: {
        paddingBottom: SPACING.md,
    },
    searchBarWrapper: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.neutral[0],
        height: 44,
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        ...SHADOWS.sm,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.neutral[900],
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        gap: SPACING.md,
    },
    sectionHeader: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    gridItem: {
        width: COLUMN_WIDTH,
        backgroundColor: COLORS.neutral[0],
        borderRadius: 12,
        padding: SPACING.md,
        alignItems: 'center',
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.neutral[200],
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    categoryName: {
        textAlign: 'center',
    },
    directorySection: {
        marginTop: SPACING.lg,
        backgroundColor: COLORS.neutral[0],
        borderTopWidth: 1,
        borderTopColor: COLORS.neutral[200],
    },
    listContainer: {
        paddingHorizontal: SPACING.xl,
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[100],
    },
    listContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.lg,
        gap: SPACING.md,
    },
    listText: {
        flex: 1,
        color: COLORS.neutral[700],
    },
});
