import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, Animated, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingCart, ShieldCheck, ChevronRight, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/AppText';
import { useCart } from '@/context/CartContext';
import { COLORS, SPACING, SHADOWS } from '@/lib/theme';
import { productApi } from '@/lib/api';
import { mapBackendProduct } from '@/lib/product-utils';
import { Product } from '@/types/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, totalPrice, isLoading, error } = useCart();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const itemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const shipping = totalPrice >= 500 ? 0 : 49;
  const finalTotal = totalPrice + shipping;

  useEffect(() => {
    let isMounted = true;

    async function loadRecommendations() {
      try {
        const response = await productApi.getProducts({ page: 1, per_page: 8 });
        if (!isMounted) return;
        setRecommendations(response.data.map(mapBackendProduct));
      } catch {
        if (!isMounted) return;
        setRecommendations([]);
      }
    }

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, itemId: string) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await removeFromCart(itemId);
        }}
      >
        <Animated.View style={[styles.deleteActionContent, { transform: [{ scale }] }]}>
          <Trash2 size={24} color={COLORS.neutral[0]} />
          <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>Delete</AppText>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const AnimatedQuantityControl = ({ quantity, onIncrement, onDecrement }: { quantity: number; onIncrement: () => Promise<void>; onDecrement: () => Promise<void> }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animatePress = async (callback: () => Promise<void>) => {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await callback();
    };

    return (
      <Animated.View style={[styles.quantityContainer, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[styles.quantityBtn, quantity === 1 && styles.quantityBtnDanger]}
          onPress={() => animatePress(onDecrement)}
        >
          {quantity === 1 ? (
            <Trash2 size={14} color={COLORS.error.DEFAULT} />
          ) : (
            <Minus size={14} color={COLORS.neutral[900]} />
          )}
        </TouchableOpacity>
        <View style={styles.quantityValue}>
          <AppText variant="sm" weight="semibold">{quantity}</AppText>
        </View>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => animatePress(onIncrement)}
        >
          <Plus size={14} color={COLORS.neutral[900]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const CartItem = ({ item }: { item: typeof cart[0] }) => {
    const swipeableRef = useRef<Swipeable>(null);

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
        rightThreshold={40}
        overshootRight={false}
      >
        <View style={styles.cartItem}>
          <Image source={{ uri: item.image_url }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <AppText variant="sm" numberOfLines={2} weight="medium" style={styles.itemName}>
              {item.name}
            </AppText>
            <AppText variant="md" weight="bold" style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </AppText>
            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <AppText variant="xs" color={COLORS.success.DEFAULT}>In Stock</AppText>
            </View>

            <View style={styles.itemActions}>
              <AnimatedQuantityControl
                quantity={item.quantity}
                onIncrement={() => updateQuantity(item.id, 1)}
                onDecrement={async () => {
                  if (item.quantity > 1) {
                    await updateQuantity(item.id, -1);
                  } else {
                    swipeableRef.current?.openRight();
                  }
                }}
              />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  await removeFromCart(item.id);
                }}
              >
                <Trash2 size={16} color={COLORS.error.DEFAULT} />
                <AppText variant="xs" color={COLORS.error.DEFAULT}>Remove</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  if (isLoading && cart.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <AppText variant="xl" weight="bold">Cart</AppText>
            </View>
          </SafeAreaView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.emptyScroll}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyImageContainer}>
              <LinearGradient
                colors={[COLORS.primary.DEFAULT + '20', COLORS.accent.DEFAULT + '20']}
                style={styles.emptyImageBg}
              >
                <ShoppingCart size={64} color={COLORS.neutral[400]} />
              </LinearGradient>
            </View>
            <AppText variant="2xl" weight="bold" style={styles.emptyTitle}>
              Your cart is empty
            </AppText>
            <AppText variant="sm" color={COLORS.neutral[500]} style={styles.emptySubtitle}>
              Looks like you haven't added anything yet
            </AppText>
            <TouchableOpacity
              style={styles.startShoppingButton}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primary.DEFAULT, COLORS.accent.DEFAULT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startShoppingGradient}
              >
                <AppText variant="md" weight="bold" color={COLORS.neutral[0]}>
                  Start Shopping
                </AppText>
                <ChevronRight size={20} color={COLORS.neutral[0]} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.recommendationsSection}>
            <View style={styles.recSectionHeader}>
              <AppText variant="md" weight="bold" style={styles.recTitle}>
                Recommended for you
              </AppText>
              <TouchableOpacity>
                <AppText variant="sm" color={COLORS.primary.DEFAULT}>See all →</AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.recGrid}>
              {recommendations.slice(0, 4).map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.recItem}
                  onPress={() => router.push(`/product/${p.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.recImageContainer}>
                    <Image source={{ uri: p.image_url }} style={styles.recImage} />
                    {p.discount && (
                      <View style={styles.recDiscountBadgeSmall}>
                        <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>-{p.discount}%</AppText>
                      </View>
                    )}
                  </View>
                  <AppText variant="xs" numberOfLines={2} style={styles.recName}>
                    {p.name}
                  </AppText>
                  <View style={styles.recItemPriceRow}>
                    <AppText variant="sm" weight="bold" style={styles.recPrice}>
                      ${p.price.toFixed(2)}
                    </AppText>
                    {p.discount && (
                      <AppText variant="xs" style={styles.recOriginalPriceSmall}>
                        ${(p.price * (1 + p.discount / 100)).toFixed(2)}
                      </AppText>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <AppText variant="xl" weight="bold">My Cart</AppText>
              <View style={styles.itemCountBadge}>
                <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>{itemsCount}</AppText>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.freeShippingCard}>
            <LinearGradient
              colors={[COLORS.primary.DEFAULT, COLORS.accent.DEFAULT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.freeShippingGradient}
            >
              <View style={styles.freeShippingContent}>
                <ShoppingBag size={20} color={COLORS.neutral[0]} />
                <AppText variant="sm" weight="medium" color={COLORS.neutral[0]} style={styles.freeShippingText}>
                  {shipping === 0
                    ? '🎉 You qualify for FREE shipping!'
                    : `Add $${(500 - totalPrice).toFixed(2)} more for FREE shipping`}
                </AppText>
              </View>
            </LinearGradient>
          </View>
        }
        ListFooterComponent={
          <View style={styles.recommendationsSection}>
            <View style={styles.recSectionHeader}>
              <AppText variant="md" weight="bold" style={styles.recSectionTitle}>
                You might also like
              </AppText>
              <TouchableOpacity>
                <AppText variant="sm" color={COLORS.primary.DEFAULT}>See all →</AppText>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recScrollContent}>
              {recommendations.slice(4, 8).map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.recCard}
                  onPress={() => router.push(`/product/${p.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.recCardImageContainer}>
                    <Image source={{ uri: p.image_url }} style={styles.recCardImage} />
                    {p.discount && (
                      <View style={styles.recDiscountBadge}>
                        <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>-{p.discount}%</AppText>
                      </View>
                    )}
                  </View>
                  <View style={styles.recCardContent}>
                    <AppText variant="xs" numberOfLines={2} style={styles.recCardName}>
                      {p.name}
                    </AppText>
                    <View style={styles.recRatingRow}>
                      <View style={styles.recStarRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <View key={star} style={styles.recStar}>
                            <AppText variant="xs">⭐</AppText>
                          </View>
                        ))}
                      </View>
                      <AppText variant="xs" color={COLORS.neutral[400]}>(124)</AppText>
                    </View>
                    <View style={styles.recPriceRow}>
                      <AppText variant="md" weight="bold" style={styles.recCardPrice}>
                        ${p.price.toFixed(2)}
                      </AppText>
                      {p.discount && (
                        <AppText variant="xs" style={styles.recOriginalPrice}>
                          ${(p.price * (1 + p.discount / 100)).toFixed(2)}
                        </AppText>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
      />

      {error ? (
        <View style={styles.errorBanner}>
          <AppText variant="xs" color={COLORS.error.DEFAULT}>
            {error}
          </AppText>
        </View>
      ) : null}

      {/*checkout Button */}
      <View style={styles.stickyCheckout}>
        <SafeAreaView edges={['bottom']}>
          <LinearGradient
            colors={[COLORS.neutral[0], COLORS.neutral[50]]}
            style={styles.checkoutGradient}
          >
            <View style={styles.checkoutContent}>
              <View style={styles.priceInfo}>
                <AppText variant="xs" color={COLORS.neutral[500]}>Total ({itemsCount} items)</AppText>
                <AppText variant="xl" weight="bold">${finalTotal.toFixed(2)}</AppText>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => router.push('/checkout')}
              >
                <LinearGradient
                  colors={[COLORS.primary.DEFAULT, COLORS.accent.DEFAULT]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkoutButtonGradient}
                >
                  <AppText variant="md" weight="bold" color={COLORS.neutral[0]}>
                    Checkout
                  </AppText>
                  <ChevronRight size={20} color={COLORS.neutral[0]} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[50],
  },
  errorBanner: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    bottom: Platform.OS === 'ios' ? 170 : 120,
    backgroundColor: COLORS.error.light,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  header: {
    backgroundColor: COLORS.neutral[0],
    ...SHADOWS.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  itemCountBadge: {
    backgroundColor: COLORS.primary.DEFAULT,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  clearCartBtn: {
    padding: SPACING.xs,
  },

  listContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },

  freeShippingCard: {
    marginBottom: SPACING.md,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  freeShippingGradient: {
    padding: SPACING.md,
  },
  freeShippingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  freeShippingText: {
    flex: 1,
  },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[0],
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[50],
  },
  itemDetails: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemName: {
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    marginBottom: SPACING.xs,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success.DEFAULT,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 20,
    overflow: 'hidden',
  },
  quantityBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnDanger: {
    backgroundColor: COLORS.error.light,
  },
  quantityValue: {
    paddingHorizontal: SPACING.md,
    minWidth: 36,
    alignItems: 'center',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },

  deleteAction: {
    backgroundColor: COLORS.error.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: SPACING.md,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteActionContent: {
    alignItems: 'center',
    gap: 4,
  },

  stickyCheckout: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 85 : 0,
    marginBottom: -13,
    left: 0,
    right: 0,
    ...SHADOWS.lg,
  },
  checkoutGradient: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  priceInfo: {
    flex: 1,
  },
  checkoutButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  checkoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },

  emptyScroll: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    backgroundColor: COLORS.neutral[0],
    padding: SPACING.xl,
    alignItems: 'center',
    margin: SPACING.md,
    borderRadius: 24,
    ...SHADOWS.md,
  },
  emptyImageContainer: {
    marginBottom: SPACING.lg,
  },
  emptyImageBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  signInButton: {
    borderRadius: 24,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  startShoppingButton: {
    borderRadius: 28,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  startShoppingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },

  recommendationsSection: {
    backgroundColor: COLORS.neutral[0],
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: 16,
    ...SHADOWS.sm,
  },
  recTitle: {
    marginBottom: SPACING.md,
  },
  recSectionTitle: {
    marginBottom: SPACING.md,
  },
  recSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  recGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recItem: {
    width: '48%',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  recImageContainer: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
    position: 'relative',
  },
  recImage: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  recDiscountBadgeSmall: {
    position: 'absolute',
    top: 4,
    left: 0,
    backgroundColor: COLORS.error.DEFAULT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  recName: {
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs,
    height: 32,
  },
  recItemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recPrice: {
    color: COLORS.neutral[900],
  },
  recOriginalPriceSmall: {
    color: COLORS.neutral[400],
    textDecorationLine: 'line-through',
    fontSize: 10,
  },

  recCard: {
    width: 160,
    marginRight: SPACING.md,
    backgroundColor: COLORS.neutral[0],
    borderRadius: 16,
    padding: SPACING.sm,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  recCardImageContainer: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  recCardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  recDiscountBadge: {
    position: 'absolute',
    top: 6,
    left: 0,
    backgroundColor: COLORS.error.DEFAULT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  recCardContent: {
    paddingHorizontal: 2,
  },
  recCardName: {
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs,
    height: 32,
  },
  recRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  recStarRow: {
    flexDirection: 'row',
    marginRight: 4,
  },
  recStar: {
    marginRight: 1,
  },
  recPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recCardPrice: {
    color: COLORS.neutral[900],
  },
  recOriginalPrice: {
    color: COLORS.neutral[400],
    textDecorationLine: 'line-through',
    fontSize: 11,
  },
  recScrollContent: {
    paddingRight: SPACING.md,
  },
});
