import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Clock, ArrowLeft } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING } from '@/lib/theme';
import { Animated } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { productApi } from '@/lib/api';
import { mapBackendProduct } from '@/lib/product-utils';
import { Product } from '@/types/product';

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'name';
type StockFilter = 'all' | 'in_stock';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => inputRef.current?.focus(), 100);

    const loadRecent = async () => {
      const stored = await AsyncStorage.getItem("recentSearches");
      if (stored) setRecentSearches(JSON.parse(stored));
    };
    loadRecent();
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const timeoutId = setTimeout(async () => {
      try {
        const response = await productApi.getProducts({
          page: 1,
          per_page: 20,
          search: trimmedQuery,
        });

        if (!isMounted) return;

        setResults(response.data.map(mapBackendProduct));
        setSearchError(null);
      } catch (error) {
        if (!isMounted) return;

        setResults([]);
        setSearchError(error instanceof Error ? error.message : 'Failed to search products');
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const saveRecentSearch = async (text: string) => {
    if (!text.trim()) return;
    const updated = [
      text,
      ...recentSearches.filter((item) => item !== text),
    ].slice(0, 6);
    setRecentSearches(updated);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const deleteRecentSearch = async (item: string) => {
    const updated = recentSearches.filter((search) => search !== item);
    setRecentSearches(updated);
    await AsyncStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleProductSelect = (product: Product) => {
    saveRecentSearch(product.name);
    router.push(`/product/${product.id}`);
  };

  const handleTrendingPress = (item: string) => {
    setSearchQuery(item);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const availableCategories = Array.from(
    new Set(results.map((product) => product.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const displayedResults = results
    .filter((product) => {
      if (stockFilter === 'in_stock' && !product.inStock) {
        return false;
      }

      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      return true;
    })
    .sort((left, right) => {
      switch (sortBy) {
        case 'price_low':
          return left.price - right.price;
        case 'price_high':
          return right.price - left.price;
        case 'name':
          return left.name.localeCompare(right.name);
        case 'relevance':
        default:
          return 0;
      }
    });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.searchHeader}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={COLORS.neutral[900]} />
            </TouchableOpacity>
            
            <View style={styles.searchBarContainer}>
              <Search size={20} color={COLORS.neutral[500]} />
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Search ShopHub"
                placeholderTextColor={COLORS.neutral[500]}
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={() => saveRecentSearch(searchQuery)}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <X size={20} color={COLORS.neutral[500]} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.content}>
            {searchQuery.length > 0 && !isSearching && results.length > 0 && (
              <View style={styles.controlsSection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.controlsRow}
                >
                  {[
                    { id: 'relevance', label: 'Relevance' },
                    { id: 'price_low', label: 'Price: Low' },
                    { id: 'price_high', label: 'Price: High' },
                    { id: 'name', label: 'Name' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.controlChip,
                        sortBy === option.id && styles.controlChipActive,
                      ]}
                      onPress={() => setSortBy(option.id as SortOption)}
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

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.controlsRow}
                >
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'in_stock', label: 'In Stock' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.controlChipSecondary,
                        stockFilter === option.id && styles.controlChipSecondaryActive,
                      ]}
                      onPress={() => setStockFilter(option.id as StockFilter)}
                    >
                      <AppText
                        variant="sm"
                        color={stockFilter === option.id ? COLORS.primary.DEFAULT : COLORS.neutral[600]}
                      >
                        {option.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    style={[
                      styles.controlChipSecondary,
                      categoryFilter === 'all' && styles.controlChipSecondaryActive,
                    ]}
                    onPress={() => setCategoryFilter('all')}
                  >
                    <AppText
                      variant="sm"
                      color={categoryFilter === 'all' ? COLORS.primary.DEFAULT : COLORS.neutral[600]}
                    >
                      All Categories
                    </AppText>
                  </TouchableOpacity>

                  {availableCategories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.controlChipSecondary,
                        categoryFilter === category && styles.controlChipSecondaryActive,
                      ]}
                      onPress={() => setCategoryFilter(category)}
                    >
                      <AppText
                        variant="sm"
                        color={categoryFilter === category ? COLORS.primary.DEFAULT : COLORS.neutral[600]}
                      >
                        {category}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/*search dropdown(typeing)*/}
            {searchQuery.length > 0 && isSearching && (
              <View style={styles.loadingResultsContainer}>
                <ActivityIndicator size="small" color={COLORS.info.DEFAULT} />
                <AppText variant="sm" color={COLORS.neutral[500]}>
                  Searching products...
                </AppText>
              </View>
            )}

            {searchQuery.length > 0 && !isSearching && displayedResults.length > 0 && (
              <View style={styles.searchDropdownOverlay}>
                <FlatList
                  data={displayedResults}
                  keyExtractor={(item) => item.id}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.resultsList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => handleProductSelect(item)}
                    >
                      <Image 
                        source={{ uri: item.image_url }} 
                        style={styles.resultImage}
                      />
                      <View style={styles.resultInfo}>
                        <AppText variant="md" numberOfLines={2} color={COLORS.neutral[900]}>
                          {item.name}
                        </AppText>
                        <AppText variant="sm" weight="bold" color={COLORS.error.DEFAULT}>
                          ${item.price}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {searchQuery.length > 0 && !isSearching && displayedResults.length === 0 && (
              <View style={styles.noResultsContainer}>
                <View style={styles.noResultsIcon}>
                  <Search size={48} color={COLORS.neutral[300]} />
                </View>
                <AppText variant="lg" weight="semibold" color={COLORS.neutral[900]} style={styles.noResultsTitle}>
                  {searchError ? 'Search unavailable' : 'No results found'}
                </AppText>
                <AppText variant="md" color={COLORS.neutral[500]} style={styles.noResultsText}>
                  {searchError ?? 'Try different keywords or check your spelling'}
                </AppText>
                <View style={styles.suggestionChips}>
                  {['Electronics', 'Clothing', 'Accessories', 'Home'].map((suggestion, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.suggestionChip}
                      onPress={() => handleSearch(suggestion)}
                    >
                      <AppText variant="sm" color={COLORS.info.DEFAULT}>{suggestion}</AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/*suggestion*/}
            {searchQuery.length === 0 && (
              <View style={styles.suggestionsContainer}>
                {recentSearches.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <AppText variant="md" weight="semibold" color={COLORS.neutral[900]}>
                        Recent Searches
                      </AppText>
                      <TouchableOpacity 
                        onPress={async () => {
                          setRecentSearches([]);
                          await AsyncStorage.removeItem("recentSearches");
                        }}
                      >
                        <AppText variant="sm" color={COLORS.info.DEFAULT}>
                          Clear all
                        </AppText>
                      </TouchableOpacity>
                    </View>
                    {recentSearches.map((item, index) => (
                      <View key={index} style={styles.recentItem}>
                        <TouchableOpacity
                          style={styles.recentItemContent}
                          onPress={() => handleSearch(item)}
                        >
                          <Clock size={18} color={COLORS.neutral[400]} />
                          <AppText variant="md" color={COLORS.neutral[500]}>{item}</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => deleteRecentSearch(item)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <X size={18} color={COLORS.neutral[400]} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.section}>
                  <AppText variant="md" weight="semibold" color={COLORS.neutral[900]} style={styles.sectionTitle}>
                    Trending Searches
                  </AppText>
                  <View style={styles.trendingGrid}>
                    {['Smartphones', 'Laptops', 'Headphones', 'Smart Watches', 'Cameras', 'Gaming'].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.trendingChip}
                        onPress={() => handleTrendingPress(item)}
                      >
                        <Search size={14} color={COLORS.neutral[500]} />
                        <AppText variant="sm" color={COLORS.neutral[500]}>{item}</AppText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[0],
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.neutral[300],
    backgroundColor: COLORS.neutral[0],
  },
  backButton: {
    padding: SPACING.xs,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.neutral[900],
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  controlsSection: {
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
  },
  controlsRow: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
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
  loadingResultsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  //search dd
  searchDropdownOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    maxHeight: 300,
    backgroundColor: COLORS.neutral[0],
    borderRadius: 12,
    marginHorizontal: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  suggestionsContainer: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[300],
  },
  recentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[0],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  resultsList: {
    paddingVertical: SPACING.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[300],
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[100],
  },
  resultInfo: {
    flex: 1,
    gap: 4,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  noResultsIcon: {
    marginBottom: SPACING.lg,
  },
  noResultsTitle: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  suggestionChip: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
});
