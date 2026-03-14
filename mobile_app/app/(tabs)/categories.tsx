import { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Search,
  Smartphone,
  Shirt,
  Home,
  BookOpen,
  Dumbbell,
  Sparkles,
  Gamepad2,
  Settings,
  Heart,
  Globe,
  Package,
} from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING } from '@/lib/theme';
import { BackendCategory, categoryApi } from '@/lib/api';

type CategorySortOption = 'recent' | 'name' | 'products';
type CategoryFilterOption = 'all' | 'with_products';

const { width } = Dimensions.get('window');

const CATEGORY_ICONS = [
  Smartphone,
  Shirt,
  Home,
  BookOpen,
  Dumbbell,
  Sparkles,
  Gamepad2,
  Settings,
  Heart,
  Globe,
  Package,
] as const;

const CATEGORY_COLORS = [
  '#6366F1',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#FCD34D',
  '#6B7280',
  '#F472B6',
  '#4ADE80',
  '#0EA5E9',
] as const;

const CATEGORY_ICON_RULES = [
  { keywords: ['electronic', 'phone', 'mobile', 'laptop', 'tech'], icon: Smartphone },
  { keywords: ['fashion', 'cloth', 'apparel', 'wear'], icon: Shirt },
  { keywords: ['home', 'furniture', 'kitchen', 'decor'], icon: Home },
  { keywords: ['book', 'stationery'], icon: BookOpen },
  { keywords: ['sport', 'fitness', 'gym'], icon: Dumbbell },
  { keywords: ['beauty', 'cosmetic', 'skin', 'makeup'], icon: Sparkles },
  { keywords: ['toy', 'game', 'gaming'], icon: Gamepad2 },
  { keywords: ['auto', 'car', 'vehicle', 'automotive'], icon: Settings },
  { keywords: ['health', 'pet', 'care'], icon: Heart },
  { keywords: ['garden', 'outdoor', 'global'], icon: Globe },
  { keywords: ['grocery', 'food', 'daily'], icon: Package },
] as const;

function normalizeSearchValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function getCategoryPresentation(category: BackendCategory, index: number) {
  const normalizedName = category.name.toLowerCase();
  const matchedRule = CATEGORY_ICON_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedName.includes(keyword))
  );

  if (matchedRule) {
    return {
      icon: matchedRule.icon,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    };
  }

  const iconIndex =
    normalizedName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    CATEGORY_ICONS.length;

  return {
    icon: CATEGORY_ICONS[iconIndex],
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  };
}

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<CategorySortOption>('recent');
  const [filterBy, setFilterBy] = useState<CategoryFilterOption>('all');

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const response = await categoryApi.getCategories({ page: 1, per_page: 50 });
        if (!isMounted) return;
        setCategories(response.data);
        setError(null);
      } catch (fetchError) {
        if (!isMounted) return;
        setCategories([]);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load categories');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const query = normalizeSearchValue(searchQuery);
    const queryTokens = query.split(' ').filter(Boolean);

    return categories
      .filter((category) => {
        if (filterBy === 'with_products' && (category.products_count ?? 0) < 1) {
          return false;
        }

        if (!queryTokens.length) {
          return true;
        }

        const searchableText = normalizeSearchValue(
          `${category.name} ${category.slug ?? ''}`
        );

        return queryTokens.every(
          (token) =>
            searchableText.includes(token) ||
            searchableText.split(' ').some((word) => word.startsWith(token))
        );
      })
      .sort((left, right) => {
        switch (sortBy) {
          case 'name':
            return left.name.localeCompare(right.name);
          case 'products':
            return (right.products_count ?? 0) - (left.products_count ?? 0);
          case 'recent':
          default:
            return 0;
        }
      });
  }, [categories, filterBy, searchQuery, sortBy]);

  const renderListItem = (category: BackendCategory, index: number) => {
    const { icon: IconComponent, color } = getCategoryPresentation(category, index);

    return (
      <TouchableOpacity key={`list-${category.id}`} style={styles.listItem} activeOpacity={0.7}>
        <View style={styles.listContent}>
          <View style={styles.listIconContainer}>
            <IconComponent size={20} color={color} />
          </View>
          <View style={styles.listTextWrap}>
            <AppText variant="md" weight="medium" style={styles.listText}>
              {category.name}
            </AppText>
            <AppText variant="xs" color={COLORS.neutral[500]}>
              {category.products_count ?? 0} products
            </AppText>
          </View>
          <ChevronRight size={20} color={COLORS.neutral[400]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerSpacer} />
              <AppText variant="xl" weight="bold" color={COLORS.neutral[900]}>
                Shop by Categories
              </AppText>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color={COLORS.neutral[500]} />
                <TextInput
                  placeholder="Search Categories"
                  placeholderTextColor={COLORS.neutral[500]}
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                />
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.controlsRow}
            >
              {[
                { id: 'all', label: 'All' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.controlChipSecondary,
                    filterBy === option.id && styles.controlChipSecondaryActive,
                  ]}
                  onPress={() => setFilterBy(option.id as CategoryFilterOption)}
                >
                  <AppText
                    variant="sm"
                    color={filterBy === option.id ? COLORS.primary.DEFAULT : COLORS.neutral[600]}
                  >
                    {option.label}
                  </AppText>
                </TouchableOpacity>
              ))}
              {[
                { id: 'recent', label: 'Recent' },
                { id: 'name', label: 'Name' },
                { id: 'products', label: 'Most Products' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.controlChip,
                    sortBy === option.id && styles.controlChipActive,
                  ]}
                  onPress={() => setSortBy(option.id as CategorySortOption)}
                >
                  <AppText
                    variant="sm"
                    color={sortBy === option.id ? COLORS.neutral[0] : COLORS.neutral[600]}
                  >
                    {option.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.gridContainer}>
              {filteredCategories.slice(0, 8).map((category, index) => {
                const { icon: IconComponent, color } = getCategoryPresentation(category, index);

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.gridItem}
                    activeOpacity={0.7}
                  >
                    <View style={styles.gridIconContainer}>
                      <IconComponent size={28} color={color} />
                    </View>
                    <AppText
                      variant="xs"
                      weight="medium"
                      numberOfLines={2}
                      style={styles.gridText}
                    >
                      {category.name}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.directorySection}>
            <View style={styles.directoryHeader}>
              <AppText variant="lg" weight="bold">
                All Categories
              </AppText>
              {error ? (
                <AppText variant="xs" color={COLORS.error.DEFAULT}>
                  {error}
                </AppText>
              ) : null}
            </View>

            <View style={styles.listContainer}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(renderListItem)
              ) : (
                <View style={styles.emptyState}>
                  <AppText variant="md" weight="semibold" color={COLORS.neutral[900]}>
                    No categories found
                  </AppText>
                  <AppText variant="sm" color={COLORS.neutral[500]}>
                    Try a different search term.
                  </AppText>
                </View>
              )}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
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
  headerSpacer: {
    width: 40,
    height: 40,
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
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.neutral[900],
  },
  controlsRow: {
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
    paddingLeft:50,
  },
  controlChip: {
    backgroundColor: COLORS.neutral[200],
    borderRadius: 999,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  controlChipActive: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  controlChipSecondary: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: 999,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  controlChipSecondaryActive: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary.light,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.md,
  },
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
  directorySection: {
    backgroundColor: COLORS.neutral[0],
    paddingTop: SPACING.md,
  },
  directoryHeader: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    gap: 4,
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
  listTextWrap: {
    flex: 1,
  },
  listText: {
    color: COLORS.neutral[900],
  },
  emptyState: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
