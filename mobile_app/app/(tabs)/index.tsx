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
          <IconComponent size={24} color={COLORS.neutral[900]} />
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
      <LinearGradient
        colors={['rgb(0, 0, 0)', 'rgb(157, 5, 180)', 'rgb(0, 0, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerWrapper}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Search size={22} color={COLORS.neutral[900]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search ShopHub"
                placeholderTextColor={COLORS.neutral[500]}
                value={searchQuery}
                onFocus={() => { }}
              />
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Bell size={26} color={COLORS.neutral[0]} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.locationBar}>
        <MapPin size={18} color={COLORS.neutral[900]} />
        <AppText variant="sm" color={COLORS.neutral[900]}>
          Deliver to Stark - SF 94105
        </AppText>
        <ChevronRight size={18} color={COLORS.neutral[900]} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
       
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map(renderCategory)}
        </ScrollView>
         {/*HERO BANNER */}
<LinearGradient
  colors={['#000000', '#8628a2', '#000000']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.heroBanner}
>
  <View style={styles.heroBadge}>
    <AppText style={styles.heroBadgeText}>✨ NEW ARRIVALS EVERY WEEK</AppText>
  </View>

  <AppText style={styles.heroTitle}>Elevate Your Style</AppText>

  <AppText style={styles.heroSubtitle}>
    Latest trends! Unbeatable prices!
  </AppText>

  <View style={styles.heroButtonsRow}>
    <TouchableOpacity style={styles.primaryBtn}>
      <AppText style={styles.primaryBtnText}>Start Shopping →</AppText>
    </TouchableOpacity>

    <TouchableOpacity style={styles.secondaryBtn}>
      <AppText style={styles.secondaryBtnText}>Explore Collections →</AppText>
    </TouchableOpacity>
  </View>

  <View style={styles.customersRow}>
    <View style={styles.avatarGroup}>
      <View style={[styles.avatar, { backgroundColor: '#a5b4fc' }]} />
      <View style={[styles.avatar, { backgroundColor: '#c4b5fd' }]} />
      <View style={[styles.avatar, { backgroundColor: '#f472b6' }]} />
      <View style={[styles.avatar, { backgroundColor: '#facc15' }]} />
    </View>

    <AppText style={styles.customerText}>
      2,400+ happy customers
    </AppText>
  </View>
</LinearGradient>
{/* HERO BANNER END */}

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

        <View style={styles.flashSection}>
  {/* HEADER */}
  <LinearGradient
    colors={['#ff512f', '#dd2476']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.flashHeaderPremium}
  >
    <View style={styles.flashHeaderLeft}>
      <Zap size={20} color="#fff" />
      <AppText variant="lg" weight="bold" color="#fff">
        Flash Deals
      </AppText>
    </View>

    <View style={styles.countdownRow}>
      {['hours', 'minutes', 'seconds'].map((unit, i) => (
        <View key={unit} style={styles.countdownPill}>
          <AppText variant="xs" weight="bold" color="#fff">
            {String(countdown[unit as keyof typeof countdown]).padStart(2, '0')}
          </AppText>
        </View>
      ))}
    </View>
  </LinearGradient>

  {/* DEALS */}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.flashDealsRow}
  >
    {FLASH_DEALS.map(renderDeal)}
    
  </ScrollView>
</View>
<View style={styles.recommendedSection}>
  {/* HEADER */}
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

  {/* GRID */}
  <View style={styles.recommendedGrid}>
    {MOCK_PRODUCTS.map((product) => (
      <View key={product.id} style={styles.recommendedItem}>
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
    backgroundColor: COLORS.neutral[100],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[50],
  },
  headerWrapper: {

    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
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
    paddingLeft: 5,
    paddingRight:5,
    marginTop: SPACING.md,
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
  padding: SPACING.lg, // 👈 reduce from xl
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
  width: 140,
  marginRight: SPACING.md,
  borderRadius: 12,
  marginBottom: SPACING.sm,
  overflow: 'hidden',
  ...SHADOWS.lg,
},
dealImageWrapper: {
  backgroundColor: COLORS.neutral[50],
  borderRadius: 4,
  overflow: 'hidden',
},
  dealImage: {
    width: '100%',
    height: 95,
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
    paddingLeft: 5,
  },
  dealPriceRow: {
    marginTop: 3,
    paddingLeft: 4,
  },
  //RECOMMENDED SECTION
recommendedSection: {
  marginTop: SPACING['sm'],
  backgroundColor: COLORS.neutral[0],
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingTop: SPACING.lg,

  // shadow
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
  paddingRight:-1,
  backgroundColor: COLORS.neutral[50],
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  // Android shadow
  elevation: 6,
},

recommendedItem: {
  width: '50%',
  paddingHorizontal: 12,   // center gap
  marginBottom: 18,        // vertical gap
},
  //Hero banner
  heroBanner: {
  marginHorizontal: 2,
  marginTop: SPACING.md,
  borderRadius: 15,
  padding: 15,
},

heroBadge: {
  alignSelf: 'flex-start',
  backgroundColor: 'rgba(255,255,255,0.15)',
  paddingHorizontal: 14,
  paddingVertical: 5,
  borderRadius: 20,
  marginBottom: 12,
},

heroBadgeText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '600',
},

heroTitle: {
  color: '#fff',
  fontSize: 28,
  fontWeight: '800',
  marginBottom: 5,
},

heroSubtitle: {
  color: '#d1d5db',
  fontSize: 14,
  marginBottom: 20,
},

heroButtonsRow: {
  flexDirection: 'row',
  gap: 9,
  paddingLeft: -12,
  paddingRight: -3,
  marginBottom: 20,
},

primaryBtn: {
  backgroundColor: '#6366f1',
  paddingHorizontal: 15,
  paddingLeft: 12,
  paddingRight: 11,
  paddingVertical: 14,
  borderRadius: 28,
},

primaryBtnText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '700',
},

secondaryBtn: {
  backgroundColor: 'rgba(255,255,255,0.15)',
  paddingHorizontal: 15,
  paddingVertical: 14,
  paddingLeft: 12,
  paddingRight: 11,
  borderRadius: 28,
},

secondaryBtnText: {
  color: '#e5e7eb',
  fontSize: 15,
  fontWeight: '600',
},

customersRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

avatarGroup: {
  flexDirection: 'row',
},

avatar: {
  width: 31,
  height: 32,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: '#fff',
  marginLeft: -5,
},

customerText: {
  color: '#e5e7eb',
  fontSize: 13,
},
flashSection: {
  marginTop: SPACING.lg,
  backgroundColor: COLORS.neutral[0],
  paddingBottom: SPACING.lg,
},

flashHeaderPremium: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: SPACING.lg,
  paddingVertical: SPACING.md,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},

flashHeaderLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

countdownRow: {
  flexDirection: 'row',
  gap: 6,
},

countdownPill: {
  backgroundColor: 'rgba(255,255,255,0.25)',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
},

flashDealsRow: {
  paddingHorizontal: SPACING.lg,
  paddingTop: SPACING.md,
},
});