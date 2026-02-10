import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart, ShieldCheck, ChevronRight, Info } from 'lucide-react-native';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import CartItem from '@/components/CartItem';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const router = useRouter();

  const itemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const trendingProducts = MOCK_PRODUCTS.slice(0, 4);

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <AppText variant="lg" weight="bold">Shopping Cart</AppText>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <ShoppingCart size={64} color={COLORS.neutral[300]} />
            </View>
            <AppText variant="xl" weight="bold" style={styles.emptyTitle}>
              Your Shopping Cart is empty
            </AppText>
            <AppText variant="md" color={COLORS.neutral[500]} style={styles.emptySubtitle}>
              Check your Saved for later items or continue shopping.
            </AppText>
            <AppButton
              title="Shop Today's Deals"
              onPress={() => router.replace('/(tabs)')}
              variant="primary"
              style={styles.shopButton}
            />
          </View>

          {/* Trending Section on Empty Cart */}
          <View style={styles.trendingSection}>
            <AppText variant="lg" weight="bold" style={styles.sectionTitle}>
              Trending deals for you
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
              {trendingProducts.map((p) => (
                <TouchableOpacity key={p.id} style={styles.miniProductCard} onPress={() => router.push(`/product/${p.id}`)}>
                  <Image source={{ uri: p.image_url }} style={styles.miniImage} resizeMode="contain" />
                  <AppText variant="xs" numberOfLines={2} style={styles.miniName}>{p.name}</AppText>
                  <AppText variant="sm" weight="bold">${p.price.toFixed(2)}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AppText variant="lg" weight="bold">Shopping Cart</AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.subtotalRow}>
            <AppText variant="lg">Subtotal ({itemsCount} items): </AppText>
            <AppText variant="xl" weight="bold">${totalPrice.toFixed(2)}</AppText>
          </View>

          <View style={styles.freeShippingBanner}>
            <View style={styles.checkIcon}>
              <AppText variant="xs" weight="bold" color={COLORS.success.DEFAULT}>✓</AppText>
            </View>
            <AppText variant="sm" color={COLORS.success.DEFAULT}>
              Your order qualifies for <AppText weight="bold" color={COLORS.success.DEFAULT}>FREE Shipping</AppText>. Choose this option at checkout.
            </AppText>
          </View>

          <AppButton
            title={`Proceed to Buy (${itemsCount} items)`}
            onPress={() => router.push('/checkout')}
            variant="primary"
            style={styles.checkoutBtn}
            size="lg"
          />
        </View>

        <View style={styles.itemsSection}>
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </View>

        {/* Save for later section (Empty placeholder) */}
        <View style={styles.saveForLater}>
          <AppText variant="md" weight="bold" color={COLORS.neutral[500]}>
            Saved for later (0 items)
          </AppText>
          <View style={styles.emptyDivider} />
        </View>

        {/* Recommendations Section */}
        <View style={styles.recommendations}>
          <AppText variant="lg" weight="bold" style={styles.sectionTitle}>
            Customers who bought items in your cart also bought
          </AppText>
          <View style={styles.recommendationsGrid}>
            {MOCK_PRODUCTS.slice(4, 8).map((p) => (
              <View key={p.id} style={styles.recItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[200],
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  summaryCard: {
    backgroundColor: COLORS.neutral[0],
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  subtotalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  freeShippingBanner: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    paddingRight: SPACING.xl,
    alignItems: 'flex-start',
    gap: 4,
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: COLORS.accent.yellow,
    borderColor: '#F0C14B',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  itemsSection: {
    backgroundColor: COLORS.neutral[0],
    marginTop: SPACING.sm,
  },
  emptyContainer: {
    padding: SPACING['3xl'],
    backgroundColor: COLORS.neutral[0],
    alignItems: 'center',
  },
  emptyIconContainer: {
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
  },
  shopButton: {
    width: '100%',
    backgroundColor: COLORS.accent.yellow,
  },
  trendingSection: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.neutral[0],
    paddingVertical: SPACING.xl,
  },
  sectionTitle: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  trendingScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  miniProductCard: {
    width: 120,
    gap: 4,
  },
  miniImage: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 4,
    marginBottom: 4,
  },
  miniName: {
    fontSize: 11,
    lineHeight: 14,
  },
  saveForLater: {
    backgroundColor: COLORS.neutral[0],
    marginTop: SPACING.sm,
    padding: SPACING.lg,
  },
  emptyDivider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginTop: SPACING.md,
  },
  recommendations: {
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.neutral[0],
    marginTop: SPACING.sm,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
  },
  recItem: {
    width: '50%',
    padding: SPACING.sm,
  }
});
