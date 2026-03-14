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
  Modal,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Check,
  MapPin,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react-native';
import AppText from '@/components/AppText';
import { useCart } from '@/context/CartContext';
import { COLORS, SPACING, SHADOWS } from '@/lib/theme';
import { useFavourite } from '@/context/FavouriteContext';
import { productApi } from '@/lib/api';
import { mapBackendProduct } from '@/lib/product-utils';
import { Product } from '@/types/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'John D.',
    rating: 5,
    date: '2 weeks ago',
    title: 'Amazing quality!',
    content: 'These are hands down the best product I have ever bought. The quality is outstanding.',
    helpful: 124,
    verified: true,
  },
  {
    id: '2',
    author: 'Sarah M.',
    rating: 4,
    date: '1 month ago',
    title: 'Great value for money',
    content: 'Very good product for the price. Some minor issues but overall satisfied.',
    helpful: 89,
    verified: true,
  },
  {
    id: '3',
    author: 'Mike R.',
    rating: 5,
    date: '3 weeks ago',
    title: 'Perfect!',
    content: 'Exactly as described. Fast shipping and great customer service.',
    helpful: 56,
    verified: false,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, percentage: 72 },
  { stars: 4, percentage: 18 },
  { stars: 3, percentage: 6 },
  { stars: 2, percentage: 3 },
  { stars: 1, percentage: 1 },
];

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourite();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const productId = Array.isArray(id) ? id[0] : id;
  const favourite = isFavourite(product?.id ?? '');
  const images = product?.images || (product ? [product.image_url] : []);
  const colors = ['Black', 'White', 'Blue'];

  useEffect(() => {
    if (!productId) {
      setError('Product not found.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProduct() {
      try {
        const [productResponse, productsResponse] = await Promise.all([
          productApi.getProduct(productId),
          productApi.getProducts({ page: 1, per_page: 6 }),
        ]);

        if (!isMounted) return;

        const mappedProduct = mapBackendProduct(productResponse);
        const mappedRelatedProducts = productsResponse.data
          .map(mapBackendProduct)
          .filter((item) => item.id !== mappedProduct.id);

        setProduct(mappedProduct);
        setRelatedProducts(mappedRelatedProducts);
        setError(null);
      } catch (fetchError) {
        if (!isMounted) return;

        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load product');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product, quantity);
      router.push('/(tabs)/cart');
    } catch (error) {
      Alert.alert(
        'Unable to add item',
        error instanceof Error ? error.message : 'Please try again.'
      );
    }
  };

  const handleShare = async () => {
    if (!product) return;

    try {
      await Share.share({
        message: `Check out this ${product.name} on Shop!`,
        url: 'https://shop.example.com/product/' + product.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderStars = (rating: number, size: number = 14) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            color={s <= Math.round(rating) ? '#FBBF24' : COLORS.neutral[300]}
            fill={s <= Math.round(rating) ? '#FBBF24' : 'transparent'}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <AppText variant="md" color={COLORS.neutral[500]}>
          {error ?? 'Product not found.'}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.neutral[900]} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Share2 size={22} color={COLORS.neutral[900]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => toggleFavourite(product)}>
            <Heart
              size={22}
              color={favourite ? COLORS.error.DEFAULT : COLORS.neutral[900]}
              fill={favourite ? COLORS.error.DEFAULT : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.heroSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setCurrentImage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
            }}
          >
            {images.map((img, index) => (
              <TouchableOpacity key={index} activeOpacity={0.95} onPress={() => setShowZoom(true)}>
                <Image source={{ uri: img }} style={styles.heroImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentImage && styles.dotActive]} />
            ))}
          </View>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <View style={styles.thumbnailStrip}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnails}>
                {images.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImage(index)}
                    style={[styles.thumbnail, currentImage === index && styles.thumbnailActive]}
                  >
                    <Image source={{ uri: img }} style={styles.thumbnailImg} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Product Info */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Category & Rating */}
          <View style={styles.metaRow}>
            <TouchableOpacity>
              <AppText variant="sm" color={COLORS.primary.DEFAULT} weight="medium">
                {product.category}
              </AppText>
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
              {renderStars(product.rating, 14)}
              <AppText variant="sm" color={COLORS.neutral[500]} style={{ marginLeft: 4 }}>
                {product.rating}
              </AppText>
              <AppText variant="sm" color={COLORS.neutral[400]} style={{ marginLeft: 4 }}>
                ({product.reviewCount.toLocaleString()})
              </AppText>
            </View>
          </View>

          {/* Product Title */}
          <AppText variant="xl" weight="bold" style={styles.title}>
            {product.name}
          </AppText>

          {/* Color Selection */}
          <View style={styles.colorRow}>
            <AppText variant="sm" color={COLORS.neutral[500]}>Color: </AppText>
            <AppText variant="sm" weight="bold">{colors[selectedColor]}</AppText>
            <View style={styles.colorSwatches}>
              {colors.map((color, idx) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(idx)}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color === 'Black' ? '#1a1a1a' : color === 'White' ? '#f5f5f5' : COLORS.primary.DEFAULT },
                    selectedColor === idx && styles.colorSwatchActive
                  ]}
                >
                  {selectedColor === idx && (
                    <Check size={12} color={color === 'White' ? '#000' : '#fff'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <View style={styles.discountTag}>
                <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                  -{product.discount}%
                </AppText>
              </View>
              <View style={styles.priceBlock}>
                <AppText variant="sm" color={COLORS.neutral[500]} style={styles.currency}>
                  $
                </AppText>
                <AppText variant="3xl" weight="bold" style={styles.mainPrice}>
                  {Math.floor(product.price)}
                </AppText>
                <AppText variant="lg" weight="medium" style={styles.decimal}>
                  {(product.price % 1).toFixed(2).substring(1)}
                </AppText>
              </View>
            </View>
            <AppText variant="sm" color={COLORS.neutral[400]}>
              Was ${product.originalPrice}
            </AppText>
          </View>

          {/* Prime Badge */}
          {product.isPrime && (
            <View style={styles.primeContainer}>
              <View style={styles.primeBadge}>
                <AppText variant="xs" weight="bold" color={COLORS.primary.DEFAULT}>prime</AppText>
              </View>
              <AppText variant="sm" color={COLORS.neutral[500]}>
                FREE Next-Day Delivery
              </AppText>
            </View>
          )}

          {/* Delivery Info Card */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <Truck size={18} color={COLORS.primary.DEFAULT} />
              <View style={styles.deliveryInfo}>
                <AppText variant="sm" weight="medium">Free Delivery</AppText>
                <AppText variant="xs" color={COLORS.neutral[500]}>
                  Tomorrow, before 10 PM
                </AppText>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <MapPin size={18} color={COLORS.primary.DEFAULT} />
              <TouchableOpacity style={styles.deliveryInfo}>
                <AppText variant="sm" color={COLORS.primary.DEFAULT}>
                  Deliver to Stark - San Francisco
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stock Status */}
          <View style={styles.stockRow}>
            <View style={styles.inStockBadge}>
              <Check size={14} color={COLORS.success.DEFAULT} />
              <AppText variant="sm" weight="bold" color={COLORS.success.DEFAULT}> In Stock</AppText>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresCard}>
            <AppText variant="md" weight="bold" style={styles.sectionTitle}>Key Features</AppText>
            {product.features?.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.featureDot} />
                <AppText variant="sm" color={COLORS.neutral[700]}>{feature}</AppText>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.descriptionCard}>
            <TouchableOpacity 
              style={styles.expandHeader}
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <AppText variant="md" weight="bold">Product Details</AppText>
              {isExpanded ? (
                <ChevronUp size={20} color={COLORS.neutral[500]} />
              ) : (
                <ChevronDown size={20} color={COLORS.neutral[500]} />
              )}
            </TouchableOpacity>
            {isExpanded && (
              <AppText variant="sm" color={COLORS.neutral[600]} style={styles.description}>
                {product.description}
              </AppText>
            )}
          </View>

          {/* Reviews Preview */}
          <View style={styles.reviewsCard}>
            <View style={styles.reviewsHeader}>
              <AppText variant="md" weight="bold">Customer Reviews</AppText>
              <TouchableOpacity 
                onPress={() => setShowAllReviews(true)}
                style={styles.seeAllBtn}
              >
                <AppText variant="sm" color={COLORS.primary.DEFAULT}>See All</AppText>
                <ArrowRight size={16} color={COLORS.primary.DEFAULT} />
              </TouchableOpacity>
            </View>

            {/* Rating Overview */}
            <View style={styles.ratingOverview}>
              <View style={styles.ratingLeft}>
                <AppText variant="4xl" weight="bold">{product.rating}</AppText>
                {renderStars(product.rating, 18)}
                <AppText variant="xs" color={COLORS.neutral[400]} style={{ marginTop: 4 }}>
                  {product.reviewCount.toLocaleString()} reviews
                </AppText>
              </View>
              <View style={styles.ratingRight}>
                {RATING_BREAKDOWN.map((item) => (
                  <View key={item.stars} style={styles.barRow}>
                    <AppText variant="xs" color={COLORS.neutral[500]}>{item.stars}</AppText>
                    <Star size={10} color={COLORS.neutral[400]} fill={COLORS.neutral[400]} />
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
                    </View>
                    <AppText variant="xs" color={COLORS.neutral[400]}>{item.percentage}%</AppText>
                  </View>
                ))}
              </View>
            </View>

            {/* Top Review */}
            <View style={styles.topReview}>
              <View style={styles.topReviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.avatar}>
                    <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                      {MOCK_REVIEWS[0].author.charAt(0)}
                    </AppText>
                  </View>
                  <View>
                    <View style={styles.nameRow}>
                      <AppText variant="sm" weight="medium">{MOCK_REVIEWS[0].author}</AppText>
                      {MOCK_REVIEWS[0].verified && (
                        <BadgeCheck size={14} color={COLORS.primary.DEFAULT} />
                      )}
                    </View>
                    <AppText variant="xs" color={COLORS.neutral[400]}>{MOCK_REVIEWS[0].date}</AppText>
                  </View>
                </View>
                <View style={styles.reviewStars}>
                  {renderStars(MOCK_REVIEWS[0].rating, 12)}
                </View>
              </View>
              <AppText variant="sm" weight="bold" style={{ marginTop: 8 }}>{MOCK_REVIEWS[0].title}</AppText>
              <AppText variant="sm" color={COLORS.neutral[600]} style={{ marginTop: 4, lineHeight: 20 }}>
                {MOCK_REVIEWS[0].content}
              </AppText>
              <AppText variant="xs" color={COLORS.neutral[400]} style={{ marginTop: 8 }}>
                {MOCK_REVIEWS[0].helpful} people found this helpful
              </AppText>
            </View>
          </View>

          {/* Trust Badges */}
          <View style={styles.trustSection}>
            <View style={styles.trustItem}>
              <ShieldCheck size={20} color={COLORS.success.DEFAULT} />
              <AppText variant="xs" weight="medium">Secure</AppText>
            </View>
            <View style={styles.trustItem}>
              <RotateCcw size={20} color={COLORS.primary.DEFAULT} />
              <AppText variant="xs" weight="medium">30-Day Returns</AppText>
            </View>
            <View style={styles.trustItem}>
              <Award size={20} color={COLORS.warning.DEFAULT} />
              <AppText variant="xs" weight="medium">1 Year Warranty</AppText>
            </View>
          </View>

          {/* Related Products */}
          <View style={styles.relatedSection}>
            <View style={styles.relatedHeader}>
              <AppText variant="md" weight="bold">You May Also Like</AppText>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScroll}
            >
              {relatedProducts.slice(0, 5).map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.relatedCard}
                  onPress={() => router.push(`/product/${item.id}`)}
                >
                  <Image source={{ uri: item.image_url }} style={styles.relatedImg} />
                  <AppText variant="xs" numberOfLines={2} style={styles.relatedName}>
                    {item.name}
                  </AppText>
                  <View style={styles.relatedPriceRow}>
                    {renderStars(item.rating, 10)}
                  </View>
                  <AppText variant="sm" weight="bold">${item.price}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={{ height: 140 }} />
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity 
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.qtyBtn}
          >
            <Minus size={18} color={COLORS.neutral[900]} />
          </TouchableOpacity>
          <AppText variant="md" weight="bold" style={styles.qtyText}>{quantity}</AppText>
          <TouchableOpacity 
            onPress={() => setQuantity(quantity + 1)}
            style={styles.qtyBtn}
          >
            <Plus size={18} color={COLORS.neutral[900]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <ShoppingCart size={22} color={COLORS.neutral[0]} />
          <AppText variant="md" weight="bold" color={COLORS.neutral[0]}>
            Add to Cart • ${(product.price * quantity).toFixed(2)}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Zoom Modal */}
      <Modal visible={showZoom} transparent animationType="fade">
        <View style={styles.zoomModal}>
          <SafeAreaView style={styles.zoomContainer}>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setShowZoom(false)}
            >
              <X size={24} color={COLORS.neutral[0]} />
            </TouchableOpacity>
            <ScrollView 
              maximumZoomScale={3}
              minimumZoomScale={1}
              centerContent
            >
              <Image 
                source={{ uri: images[currentImage] }} 
                style={styles.zoomImg}
                resizeMode="contain"
              />
            </ScrollView>
            <View style={styles.zoomNav}>
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setCurrentImage(idx)}
                  style={[styles.zoomThumb, currentImage === idx && styles.zoomThumbActive]}
                >
                  <Image source={{ uri: img }} style={styles.zoomThumbImg} />
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* All Reviews Modal */}
      <Modal visible={showAllReviews} transparent animationType="slide">
        <View style={styles.reviewsModal}>
          <SafeAreaView style={styles.reviewsModalContainer}>
            <View style={styles.reviewsModalHeader}>
              <AppText variant="lg" weight="bold">All Reviews</AppText>
              <TouchableOpacity onPress={() => setShowAllReviews(false)}>
                <X size={24} color={COLORS.neutral[900]} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MOCK_REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.topReviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.avatar}>
                        <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                          {review.author.charAt(0)}
                        </AppText>
                      </View>
                      <View>
                        <View style={styles.nameRow}>
                          <AppText variant="sm" weight="medium">{review.author}</AppText>
                          {review.verified && (
                            <BadgeCheck size={14} color={COLORS.primary.DEFAULT} />
                          )}
                        </View>
                        <AppText variant="xs" color={COLORS.neutral[400]}>{review.date}</AppText>
                      </View>
                    </View>
                    <View style={styles.reviewStars}>
                      {renderStars(review.rating, 12)}
                    </View>
                  </View>
                  <AppText variant="sm" weight="bold" style={{ marginTop: 10 }}>{review.title}</AppText>
                  <AppText variant="sm" color={COLORS.neutral[600]} style={{ marginTop: 6, lineHeight: 20 }}>
                    {review.content}
                  </AppText>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
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
    backgroundColor: COLORS.neutral[0],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  heroSection: {
    backgroundColor: COLORS.neutral[50],
    paddingTop: 100,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.neutral[300],
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary.DEFAULT,
  },
  thumbnailStrip: {
    paddingBottom: SPACING.md,
  },
  thumbnails: {
    paddingHorizontal: SPACING.lg,
    gap: 10,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: COLORS.primary.DEFAULT,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  title: {
    lineHeight: 30,
    color: COLORS.neutral[900],
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: 10,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  colorSwatchActive: {
    borderWidth: 2,
    borderColor: COLORS.primary.DEFAULT,
  },
  priceSection: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  discountTag: {
    backgroundColor: COLORS.error.DEFAULT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    marginTop: 6,
    marginRight: 2,
  },
  mainPrice: {
    color: COLORS.neutral[900],
  },
  decimal: {
    marginTop: 6,
    color: COLORS.neutral[900],
  },
  primeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  primeBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  deliveryCard: {
    backgroundColor: '#F8FAFC',
    padding: SPACING.lg,
    borderRadius: 16,
    gap: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  stockRow: {
    marginBottom: 20,
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuresCard: {
    backgroundColor: '#F8FAFC',
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  sectionTitle: {
    marginBottom: 12,
    color: COLORS.neutral[900],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary.DEFAULT,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  expandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  description: {
    marginTop: 12,
    lineHeight: 22,
  },
  reviewsCard: {
    marginBottom: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingOverview: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 24,
  },
  ratingLeft: {
    alignItems: 'center',
    gap: 6,
  },
  ratingRight: {
    flex: 1,
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 4,
  },
  topReview: {
    backgroundColor: '#F8FAFC',
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  topReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xl,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  trustItem: {
    alignItems: 'center',
    gap: 6,
  },
  relatedSection: {
    marginBottom: 20,
  },
  relatedHeader: {
    marginBottom: 16,
  },
  relatedScroll: {
    gap: 14,
    paddingRight: SPACING.lg,
  },
  relatedCard: {
    width: 140,
  },
  relatedImg: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: COLORS.neutral[50],
  },
  relatedName: {
    marginBottom: 6,
    height: 36,
  },
  relatedPriceRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.neutral[0],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    ...SHADOWS.lg,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    alignSelf: 'center',
    marginBottom: 12,
  },
  qtyBtn: {
    padding: 12,
  },
  qtyText: {
    paddingHorizontal: 24,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary.DEFAULT,
    paddingVertical: 16,
    borderRadius: 12,
    ...SHADOWS.md,
  },
  zoomModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImg: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
  },
  zoomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  zoomThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  zoomThumbActive: {
    borderColor: COLORS.neutral[0],
  },
  zoomThumbImg: {
    width: '100%',
    height: '100%',
  },
  reviewsModal: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  reviewsModalContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
  reviewsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
    marginBottom: SPACING.lg,
  },
  reviewItem: {
    backgroundColor: COLORS.neutral[0],
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
});
