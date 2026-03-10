import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Search, Menu } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING } from '@/lib/theme';
import { CATEGORIES } from '@/lib/constants';

const { width } = Dimensions.get('window');

export default function CategoriesScreen() {
    const router = useRouter();

    const renderCategoryCard = (category: any, index: number) => {
        const IconComponent = category.icon;
        return (
            <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                activeOpacity={0.7}
            >
                <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                        <IconComponent size={32} color={category.color} />
                    </View>
                    <AppText variant="sm" weight="medium" numberOfLines={2} style={styles.categoryName}>
                        {category.name}
                    </AppText>
                </View>
            </TouchableOpacity>
        );
    };

    const renderListItem = (category: any, index: number) => {
        const IconComponent = category.icon;
        return (
            <TouchableOpacity
                key={`list-${category.id}`}
                style={styles.listItem}
                activeOpacity={0.7}
            >
                <View style={styles.listContent}>
                    <View style={styles.listIconContainer}>
                        <IconComponent size={20} color={category.color} />
                    </View>
                    <AppText variant="md" weight="medium" style={styles.listText}>
                        {category.name}
                    </AppText>
                    <ChevronRight size={20} color={COLORS.neutral[400]} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/*headd*/}
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity style={styles.menuBtn}>
                                <Menu size={24} color={COLORS.neutral[0]} />
                            </TouchableOpacity>
                            <AppText variant="xl" weight="bold" color={COLORS.neutral[0]}>
                                Shop by Categories
                            </AppText>
                            <View style={{ width: 40 }} />
                        </View>

                        {/*search-bar*/}
                        <View style={styles.searchContainer}>
                            <View style={styles.searchBar}>
                                <Search size={20} color={COLORS.neutral[500]} />
                                <TextInput
                                    placeholder="Search Categories"
                                    placeholderTextColor={COLORS.neutral[500]}
                                    style={styles.searchInput}
                                />
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <View style={styles.gridContainer}>
                        {CATEGORIES.slice(0, 8).map((category, index) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.gridItem}
                                activeOpacity={0.7}
                            >
                                <View style={styles.gridIconContainer}>
                                    <category.icon size={28} color={category.color} />
                                </View>
                                <AppText variant="xs" weight="medium" numberOfLines={2} style={styles.gridText}>
                                    {category.name}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/*all category*/}
                <View style={styles.directorySection}>
                    <View style={styles.directoryHeader}>
                        <AppText variant="lg" weight="bold">All Categories</AppText>
                    </View>

                    <View style={styles.listContainer}>
                        {CATEGORIES.map(renderListItem)}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
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
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
    },
    menuBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        paddingTop: SPACING.xs,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.neutral[100],
        height: 44,
        borderRadius: 8,
        paddingHorizontal: SPACING.sm,
        gap: SPACING.sm,
        marginTop: -25,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.neutral[900],
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: SPACING.md,
    },

    // Grid 
    section: {
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1,
        backgroundColor: COLORS.neutral[0],
        borderRadius: 8,
        overflow: 'hidden',
    },
    gridItem: {
        width: (width - SPACING.md * 2 - 3) / 4,
        backgroundColor: COLORS.neutral[0],
        paddingVertical: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.neutral[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    gridText: {
        textAlign: 'center',
        color: COLORS.neutral[900],
        paddingHorizontal: SPACING.xs,
    },
    categoryCard: {
        width: (width - SPACING.md * 2 - SPACING.sm) / 2,
        backgroundColor: COLORS.neutral[0],
        borderRadius: 8,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    cardContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.neutral[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    categoryName: {
        textAlign: 'center',
        color: COLORS.neutral[900],
    },

    // all catog
    directorySection: {
        backgroundColor: COLORS.neutral[0],
        paddingTop: SPACING.md,
    },
    directoryHeader: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[100],
    },
    listContainer: {
        paddingHorizontal: SPACING.md,
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[100],
    },
    listContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        gap: SPACING.md,
    },
    listIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.neutral[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
    listText: {
        flex: 1,
        color: COLORS.neutral[900],
    },
});

