import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, Zap, ChevronRight, MapPin, ShoppingCart } from 'lucide-react-native';
import AppText from '@/components/AppText';
import ProductCard from '@/components/ProductCard';
import { COLORS, SPACING, SHADOWS } from '@/lib/theme';
import { CATEGORIES } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import { productApi } from '@/lib/api';
import { mapBackendProduct } from '@/lib/product-utils';
import { Product } from '@/types/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { itemCount } = useCart();
  const flashDealProducts = products.slice(0, 4);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await productApi.getProducts({ page: 1, per_page: 8 });

        if (!isMounted) return;

        setProducts(response.data.map(mapBackendProduct));
        setError(null);
      } catch (fetchError) {
        if (!isMounted) return;

        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load products');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const endsAt = new Date(Date.now() + 6 * 60 * 60 * 1000);
      const diff = endsAt.getTime() - Date.now();
      if (diff > 0) {
        setCountdown({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.info.DEFAULT} />
      </View>
    );
  }

  const renderDeal = (product: Product) => {
    const originalPrice = product.originalPrice ?? product.price;
    const savings = Math.max(
      0,
      Math.round(((originalPrice - product.price) / Math.max(originalPrice, 1)) * 100)
    );

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.dealCard}
        onPress={() => router.push(`/product/${product.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.dealImageWrapper}>
          <Image source={{ uri: product.image_url }} style={styles.dealImage} />
          {savings > 0 && (
            <View style={styles.dealBadgeAmazon}>
              <AppText variant="xs" weight="bold" color="#fff">
                -{savings}%
              </AppText>
            </View>
          )}
        </View>
        <View style={styles.dealInfo}>
          <AppText variant="sm" numberOfLines={2} weight="medium" style={styles.dealProductName}>
            {product.name}
          </AppText>

          <View style={styles.dealPriceRow}>
            <AppText variant="md" weight="bold" color={COLORS.neutral[900]}>
              ${product.price.toFixed(2)}
            </AppText>
            <AppText variant="xs" color={COLORS.neutral[500]} style={styles.originalPriceAmazon}>
              ${originalPrice.toFixed(2)}
            </AppText>
          </View>

          {savings > 0 && (
            <View style={styles.discountBadgeAmazon}>
              <AppText variant="xs" weight="bold" color={COLORS.error.DEFAULT}>
                Save {savings}%
              </AppText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/*transparent head*/}
      <View style={styles.headerTransparent}>
        <SafeAreaView edges={['top']}>
          {/*header area icons and section*/}
          <View style={styles.topRow}>
            <View style={styles.discoverContainer}>
              <AppText variant="2xl" weight="bold" color={COLORS.neutral[900]}>
                Discover
              </AppText>
            </View>
            <View style={styles.headerIcons}>
              {/*cart icon */}
              <TouchableOpacity
                style={styles.premiumIconBtn}
                onPress={() => router.push('/cart')}
              >
                <View style={styles.premiumIconBg}>
                  <ShoppingCart size={20} color={COLORS.neutral[900]} />
                </View>
                {itemCount > 0 && <View style={styles.badge} />}
              </TouchableOpacity>

              {/*notification icon*/}
              <TouchableOpacity style={styles.premiumIconBtn}>
                <View style={styles.premiumIconBg}>
                  <Bell size={20} color={COLORS.neutral[900]} />
                </View>
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>
          </View>

          {/*search bar*/}
          <TouchableOpacity
            style={styles.searchRow}
            activeOpacity={0.7}
            onPress={() => router.push('/search')}
          >
            <View style={styles.searchBar}>
              <Search size={22} color={COLORS.neutral[900]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search ShopHub"
                placeholderTextColor={COLORS.neutral[500]}
                value={searchQuery}
                editable={false}
                pointerEvents="none"
              />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <TouchableOpacity style={styles.locationBar}>
        <View style={styles.locationBarWhite}>
          <View style={styles.locationLeft}>
            <View style={styles.locationIconWhite}>
              <MapPin size={16} color={COLORS.primary.DEFAULT} />
            </View>
            <View style={styles.locationTextContainer}>
              <AppText variant="xs" color={COLORS.neutral[500]}>
                Deliver to
              </AppText>
              <View style={styles.locationAddressRow}>
                <AppText variant="sm" weight="bold" color={COLORS.neutral[900]}>
                  Stark - San Francisco 94105
                </AppText>
                <ChevronRight size={16} color={COLORS.primary.DEFAULT} />
              </View>
            </View>
          </View>
          <View style={styles.locationRight}>
            <AppText variant="xs" weight="medium" color={COLORS.primary.DEFAULT}>
              Change
            </AppText>
          </View>
        </View>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/*new banner*/}
        <TouchableOpacity style={styles.singleBannerWrapper} activeOpacity={0.95}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.singleBannerCard}
          >
            <View style={styles.singleBannerContent}>
              <View style={styles.singleBannerBadge}>
                <AppText variant="xs" weight="bold" color="#fff">
                  🔥 HOT DEALS
                </AppText>
              </View>
              <AppText variant="2xl" weight="bold" color="#fff" style={styles.singleBannerTitle}>
                New Arrivals
              </AppText>
              <AppText variant="md" color="rgba(255,255,255,0.85)" style={styles.singleBannerSubtitle}>
                Discover the latest trends in fashion
              </AppText>
              <View style={styles.singleBannerButton}>
                <AppText variant="sm" weight="bold" color="#1a1a2e">
                  Shop Now
                </AppText>
                <ChevronRight size={16} color="#1a1a2e" />
              </View>
            </View>
            <View style={styles.singleBannerDecoration}>
              <View style={styles.decorationCircle1} />
              <View style={styles.decorationCircle2} />
              <View style={styles.decorationCircle3} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/*catogory buttons*/}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesHeader}>
            <AppText variant="lg" weight="bold">
              Shop by Category
            </AppText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <AppText variant="sm" color={COLORS.primary.DEFAULT}>
                See all →
              </AppText>
            </TouchableOpacity>
          </View>

          {/*circle scroll cat*/}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContainer}
          >
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.circleCategoryItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.circleCategoryIconWrapper}>
                    <IconComponent size={24} color={COLORS.neutral[900]} />
                  </View>
                  <AppText variant="xs" weight="medium" numberOfLines={1} style={styles.circleCategoryName}>
                    {category.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.flashSection}>
          {/*flash deal head*/}
          <LinearGradient
            colors={['#7c3aed', '#ec4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.flashHeaderPremium}
          >
            {/*flashdeal icon+title*/}
            <View style={styles.flashHeaderLeft}>
              <View style={styles.flashIconContainer}>
                <Zap size={20} color="#fff" fill="#fff" />
              </View>
              <View>
                <AppText variant="lg" weight="bold" color="#fff">
                  Flash Deals
                </AppText>
                <AppText variant="xs" weight="semibold" color="rgba(255,255,255,0.85)">
                  UP TO 70% OFF
                </AppText>
              </View>
            </View>

            {/*flashdealcount*/}
            <View style={styles.countdownRow}>
              {[
                { value: countdown.hours, label: 'H' },
                { value: countdown.minutes, label: 'M' },
                { value: countdown.seconds, label: 'S' },
              ].map((item) => (
                <View key={item.label} style={styles.countdownPill}>
                  <AppText variant="xs" weight="bold" color="#7c3aed">
                    {String(item.value).padStart(2, '0')}
                  </AppText>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/*fd p_grid*/}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashDealsRow}
          >
            {flashDealProducts.map(renderDeal)}
          </ScrollView>

          {!flashDealProducts.length && (
            <View style={styles.emptyFlashDealsState}>
              <AppText variant="sm" color={COLORS.neutral[500]}>
                {error ?? 'No flash deals available right now.'}
              </AppText>
            </View>
          )}
        </View>
        <View style={styles.recommendedSection}>
          {/*recommend header*/}
          <View style={styles.recommendedHeader}>
            <AppText variant="xl" weight="bold">
              Recommended for you
            </AppText>

            <TouchableOpacity>
              <AppText variant="sm" color={COLORS.info.DEFAULT}>
                See all →
              </AppText>
            </TouchableOpacity>
          </View>

          {/*rec grid*/}
          <View style={styles.recommendedGrid}>
            {products.map((product) => (
              <View key={product.id} style={styles.recommendedItem}>
                <ProductCard
                  product={product}
                  variant="compact"
                  onPress={() => router.push(`/product/${product.id}`)}
                />
              </View>
            ))}
          </View>

          {!loading && !products.length && (
            <View style={styles.emptyProducts}>
              <AppText variant="sm" color={COLORS.neutral[500]}>
                {error ?? 'No products available right now.'}
              </AppText>
            </View>
          )}
        </View>
        <View style={{ height: SPACING['3xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[100],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
  },

  headerTransparent: {
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  discoverContainer: {
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  // header icon
  premiumIconBtn: {
    position: 'relative',
    padding: SPACING.xs,
  },
  premiumIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  // icon badge
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: COLORS.neutral[0],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[0],
    borderRadius: 30,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.neutral[900],
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error.DEFAULT,
    borderWidth: 2,
    borderColor: COLORS.neutral[0],
  },
  locationBar: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 0,
    backgroundColor: COLORS.neutral[100],
  },
  locationBarWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconWhite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary.DEFAULT + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  locationRight: {
    paddingLeft: SPACING.sm,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.neutral[300],
  },
  scrollView: {
    flex: 1,
  },
  categoriesSection: {
    backgroundColor: COLORS.neutral[100],
    paddingTop: SPACING.lg,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  // circle category
  categoriesScrollContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  circleCategoryItem: {
    alignItems: 'center',
    marginRight: SPACING.lg,
    width: 64,
  },
  circleCategoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  circleCategoryName: {
    textAlign: 'center',
    color: COLORS.neutral[900],
  },
  //cat style
  categoryItem: {
    alignItems: 'center',
    marginRight: SPACING.lg,
    width: 64,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  bannerSection: {
    paddingHorizontal: 20,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: SPACING.md,
  },
  // new arriv banner
  singleBannerWrapper: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  singleBannerCard: {
    borderRadius: 20,
    height: 180,
    overflow: 'hidden',
    position: 'relative',
  },
  singleBannerContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    zIndex: 2,
  },
  singleBannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  singleBannerTitle: {
    marginBottom: 4,
  },
  singleBannerSubtitle: {
    marginBottom: SPACING.md,
  },
  singleBannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  singleBannerDecoration: {
    position: 'absolute',
    right: -20,
    top: 0,
    bottom: 0,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorationCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    right: 20,
    top: 10,
  },
  decorationCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: 60,
    bottom: 30,
  },
  decorationCircle3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    right: 10,
    bottom: 10,
  },
  bannerScroll: {
    gap: 10,
  },
  bannerWrapper: {
    width: SCREEN_WIDTH - 40,
    paddingLeft: -39,
    paddingRight: -30,

  },
  bannerCard: {
    borderRadius: 20,
    height: 160,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerImage: {
    position: 'absolute',
    right: -15,
    bottom: -10,
    width: 160,
    height: 160,
  },
  shopNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neutral[300],
  },
  dotActive: {
    width: 16,
    backgroundColor: COLORS.accent.DEFAULT,
  },
  section: {
    paddingHorizontal: 15,
    marginTop: SPACING.md,
    backgroundColor: COLORS.neutral[50],
    paddingVertical: SPACING.lg,
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
  flashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  countdownBox: {
    backgroundColor: COLORS.neutral[900],
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  countdownSeparator: {
    marginHorizontal: 1,
  },
  dealCard: {
    backgroundColor: COLORS.neutral[0],
    width: 150,
    marginRight: SPACING.md,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    marginBottom: SPACING.sm,
  },
  dealImageWrapper: {
    backgroundColor: COLORS.neutral[50],
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  dealImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  dealBadgeAmazon: {
    position: 'absolute',
    top: 6,
    left: 0,
    backgroundColor: COLORS.error.DEFAULT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  dealInfo: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  dealProductName: {
    marginBottom: 4,
    height: 36,
  },
  dealPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  originalPriceAmazon: {
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  discountBadgeAmazon: {
    marginTop: 4,
    backgroundColor: '#FFE4C4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  recommendedSection: {
    marginTop: SPACING['sm'],
    backgroundColor: COLORS.neutral[0],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.lg,
    marginBottom: -SPACING['3xl'],

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.md,
    paddingLeft: -1,
    paddingRight: -1,
    backgroundColor: COLORS.neutral[0],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    marginBottom: 0,
    // android
    elevation: 6,
  },

  emptyProducts: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
  },

  emptyFlashDealsState: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  recommendedItem: {
    width: '50%',
    paddingHorizontal: 12,   
    marginBottom: 18,       
  },
  //flash deal
  flashSection: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
    paddingBottom: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.md,
  },

  flashHeaderPremium: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },

  flashIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },

  flashHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countdownRow: {
    flexDirection: 'row',
    gap: 4,
  },

  countdownPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },

  flashDealsRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
});
