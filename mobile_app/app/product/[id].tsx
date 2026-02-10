import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
} from 'lucide-react-native';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    router.push('/(tabs)/cart');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${product.name} on Shop!`,
        url: 'https://shop.example.com/product/' + product.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.info.DEFAULT} />
      </View>
    );
  }

  const images = product.images || [product.image_url];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.neutral[900]} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Share2 size={22} color={COLORS.neutral[900]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setIsFavorite(!isFavorite)}>
            <Heart size={22} color={isFavorite ? COLORS.error.DEFAULT : COLORS.neutral[900]} fill={isFavorite ? COLORS.error.DEFAULT : 'transparent'} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setCurrentImage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
            }}
          >
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.galleryImage} resizeMode="contain" />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {images.map((_, i) => (
              <View key={i} style={[styles.paginationDot, i === currentImage && styles.paginationDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.brandRow}>
            <AppText variant="sm" color={COLORS.info.DEFAULT} weight="medium">
              Visit the {product.category} store
            </AppText>
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} color={s <= Math.round(product.rating) ? COLORS.accent.DEFAULT : COLORS.neutral[300]} fill={s <= Math.round(product.rating) ? COLORS.accent.DEFAULT : 'transparent'} />
                ))}
              </View>
              <AppText variant="sm" color={COLORS.info.DEFAULT}>{product.rating}</AppText>
            </View>
          </View>

          <AppText variant="lg" style={styles.title}>{product.name}</AppText>

          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <AppText variant="sm" color={COLORS.error.DEFAULT} weight="medium">
                -{product.discount}%
              </AppText>
              <AppText variant="3xl" weight="medium">
                <AppText variant="xl" style={{ marginTop: 4 }}>$</AppText>
                {Math.floor(product.price)}
                <AppText variant="xl">{(product.price % 1).toFixed(2).substring(1)}</AppText>
              </AppText>
            </View>
            <AppText variant="sm" color={COLORS.neutral[500]}>
              Was: <AppText style={styles.strikethrough}>${product.originalPrice}</AppText>
            </AppText>
          </View>

          {product.isPrime && (
            <View style={styles.primeBadge}>
              <AppText variant="xs" weight="bold" color={COLORS.info.DEFAULT}>✓prime</AppText>
              <AppText variant="xs" color={COLORS.neutral[600]}> One-Day</AppText>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.stockInfo}>
            <AppText variant="lg" weight="bold" color={COLORS.success.DEFAULT}>In Stock</AppText>
            <AppText variant="sm" color={COLORS.neutral[700]}>
              FREE delivery <AppText weight="bold">Tomorrow</AppText>. Order within <AppText color={COLORS.success.DEFAULT}>6 hrs 12 mins</AppText>.
            </AppText>
          </View>

          <View style={styles.qtySection}>
            <AppText weight="bold">Quantity:</AppText>
            <View style={styles.qtySelector}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
                <Minus size={18} color={COLORS.neutral[700]} />
              </TouchableOpacity>
              <AppText variant="lg" weight="bold" style={styles.qtyText}>{quantity}</AppText>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                <Plus size={18} color={COLORS.neutral[700]} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <AppButton
              title="Add to Cart"
              onPress={handleAddToCart}
              style={[styles.buyBtn, { backgroundColor: COLORS.accent.yellow }]}
            />
            <AppButton
              title="Buy Now"
              onPress={() => router.push('/checkout')}
              style={[styles.buyBtn, { backgroundColor: COLORS.accent.DEFAULT }]}
            />
          </View>

          <View style={styles.securityRow}>
            <ShieldCheck size={18} color={COLORS.neutral[500]} />
            <AppText variant="xs" color={COLORS.info.DEFAULT}>Secure transaction</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.descriptionSection}>
            <AppText variant="lg" weight="bold" style={{ marginBottom: SPACING.sm }}>Description</AppText>
            <AppText variant="md" color={COLORS.neutral[700]} style={{ lineHeight: 22 }}>
              {product.description}
            </AppText>
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
    backgroundColor: COLORS.neutral[0],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryContainer: {
    height: 350,
    marginTop: 60,
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 350,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -20,
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neutral[300],
  },
  paginationDotActive: {
    backgroundColor: COLORS.info.DEFAULT,
    width: 14,
  },
  content: {
    padding: SPACING.lg,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  title: {
    lineHeight: 24,
    color: COLORS.neutral[700],
    marginBottom: SPACING.md,
  },
  priceSection: {
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  primeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: SPACING.lg,
  },
  stockInfo: {
    gap: 4,
  },
  qtySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.xl,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    ...SHADOWS.sm,
  },
  qtyBtn: {
    padding: 10,
  },
  qtyText: {
    paddingHorizontal: 15,
  },
  buttonGroup: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  buyBtn: {
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.lg,
  },
  descriptionSection: {
    marginTop: 4,
  },
});
