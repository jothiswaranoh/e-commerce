import { useState, useEffect, useRef } from 'react';
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
import { Search, Bell, Zap, ChevronRight, MapPin } from 'lucide-react-native';
import AppText from '@/components/AppText';
import ProductCard from '@/components/ProductCard';
import {
  MOCK_PRODUCTS,
  CATEGORIES as CATEGORY_DATA,
  BANNERS,
  FLASH_DEALS,
  Banner,
  Deal,
} from '@/lib/mock-data';
import { COLORS, SPACING, BORDERS, SHADOWS, GRADIENTS } from '@/lib/theme';
import { UI_TEXT, CATEGORIES } from '@/lib/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentBanner + 1) % BANNERS.length;
      setCurrentBanner(next);
      bannerScrollRef.current?.scrollTo({ x: next * (SCREEN_WIDTH - 40), animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentBanner]);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = FLASH_DEALS[0].endsAt.getTime() - Date.now();
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

  const renderCategory = (category: any) => {
    const IconComponent = category.icon;
    return (
      <TouchableOpacity key={category.id} style={styles.categoryItem} activeOpacity={0.7}>
        <View style={[styles.categoryIcon, { backgroundColor: COLORS.neutral[100] }]}>
          <IconComponent size={24} color={COLORS.neutral[700]} />
        </View>
        <AppText variant="xs" weight="medium" numberOfLines={1}>
          {category.name}
        </AppText>
      </TouchableOpacity>
    );
  };

  const renderBanner = (banner: Banner) => (
    <TouchableOpacity key={banner.id} style={styles.bannerWrapper} activeOpacity={0.95}>
      <LinearGradient
        colors={banner.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerCard}
      >
        <View style={styles.bannerContent}>
          <AppText variant="2xl" weight="bold" color={COLORS.neutral[0]}>
            {banner.title}
          </AppText>
          <AppText variant="sm" color="rgba(255,255,255,0.9)">
            {banner.subtitle}
          </AppText>
          <TouchableOpacity style={styles.shopNowButton}>
            <AppText variant="sm" weight="bold" color={COLORS.neutral[0]}>
              {UI_TEXT.SHOP_NOW}
            </AppText>
            <ChevronRight size={16} color={COLORS.neutral[0]} />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="contain" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderDeal = (deal: Deal) => (
    <TouchableOpacity
      key={deal.id}
      style={styles.dealCard}
      onPress={() => router.push(`/product/${deal.product.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.dealImageWrapper}>
        <Image source={{ uri: deal.product.image_url }} style={styles.dealImage} />
        {deal.product.discount && (
          <View style={styles.dealBadge}>
            <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
              -{deal.product.discount}%
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.dealInfo}>
        <AppText variant="sm" numberOfLines={1} weight="medium">
          {deal.product.name}
        </AppText>
        <View style={styles.dealPriceRow}>
          <AppText variant="md" weight="bold" color={COLORS.error.DEFAULT}>
            ${deal.product.price}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.headerWrapper} edges={['top']}>
        <LinearGradient
          colors={GRADIENTS.amazonHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Search size={22} color={COLORS.neutral[900]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Amazon"
                placeholderTextColor={COLORS.neutral[500]}
                value={searchQuery}
                onFocus={() => { }}
              />
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Bell size={26} color={COLORS.neutral[900]} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>

      <View style={styles.locationBar}>
        <MapPin size={18} color={COLORS.neutral[700]} />
        <AppText variant="sm" color={COLORS.neutral[700]}>
          Deliver to Stark - SF 94105
        </AppText>
        <ChevronRight size={18} color={COLORS.neutral[700]} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map(renderCategory)}
        </ScrollView>

        <View style={styles.bannerSection}>
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH - 40}
            contentContainerStyle={styles.bannerScroll}
          >
            {BANNERS.map(renderBanner)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.flashHeader}>
              <Zap size={22} color={COLORS.accent.DEFAULT} fill={COLORS.accent.DEFAULT} />
              <AppText variant="lg" weight="bold">{UI_TEXT.FLASH_DEALS}</AppText>
            </View>
            <View style={styles.countdownRow}>
              {['hours', 'minutes', 'seconds'].map((unit, i) => (
                <View key={unit} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.countdownBox}>
                    <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                      {String(countdown[unit as keyof typeof countdown]).padStart(2, '0')}
                    </AppText>
                  </View>
                  {i < 2 && <AppText variant="xs" weight="bold" style={styles.countdownSeparator}>:</AppText>}
                </View>
              ))}
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FLASH_DEALS.map(renderDeal)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <AppText variant="lg" weight="bold" style={styles.sectionTitle}>
            {UI_TEXT.RECOMMENDED}
          </AppText>
          <View style={styles.productGrid}>
            {MOCK_PRODUCTS.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard
                  product={product}
                  variant="compact"
                  onPress={() => router.push(`/product/${product.id}`)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: SPACING['3xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[200],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
  },
  headerWrapper: {
    backgroundColor: '#84fab0',
  },
  headerGradient: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[0],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8fd3f4',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  categoriesRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: COLORS.neutral[0],
  },
  categoryItem: {
    alignItems: 'center',
    width: 68,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  bannerSection: {
    paddingHorizontal: 20,
    marginTop: SPACING.md,
  },
  bannerScroll: {
    gap: 0,
  },
  bannerWrapper: {
    width: SCREEN_WIDTH - 40,
  },
  bannerCard: {
    borderRadius: BORDERS.radius.md,
    height: 160,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerImage: {
    position: 'absolute',
    right: -10,
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
    marginTop: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
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
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownBox: {
    backgroundColor: COLORS.neutral[800],
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
    width: 130,
    marginRight: SPACING.md,
  },
  dealImageWrapper: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 4,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  dealBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLORS.error.DEFAULT,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomRightRadius: 4,
  },
  dealInfo: {
    paddingVertical: SPACING.xs,
  },
  dealPriceRow: {
    marginTop: 2,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: SPACING.md,
  },
});
