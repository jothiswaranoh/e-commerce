import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, MapPin, CreditCard, ShieldCheck } from 'lucide-react-native';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import { useCart } from '@/context/CartContext';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);

  const subtotal = totalPrice;
  const shipping = 0;
  const tax = totalPrice * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    clearCart();
    router.replace(`/order-confirmation/${orderId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.neutral[900]} />
        </TouchableOpacity>
        <AppText variant="lg" weight="bold">Checkout</AppText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Steps */}
        <View style={styles.stepsRow}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.stepContainer}>
              <View style={[styles.stepCircle, step >= i && styles.stepCircleActive]}>
                <AppText variant="sm" weight="bold" color={step >= i ? COLORS.neutral[0] : COLORS.neutral[500]}>
                  {i}
                </AppText>
              </View>
              {i < 3 && <View style={[styles.stepLine, step > i && styles.stepLineActive]} />}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.cardIcon}>
              <MapPin size={22} color={COLORS.neutral[600]} />
            </View>
            <View style={styles.cardContent}>
              <AppText variant="sm" weight="bold">Shipping Address</AppText>
              <AppText variant="sm" color={COLORS.neutral[600]}>
                Stark, 123 Maple Avenue, San Francisco, CA 94105
              </AppText>
            </View>
            <ChevronRight size={20} color={COLORS.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.cardIcon}>
              <CreditCard size={22} color={COLORS.neutral[600]} />
            </View>
            <View style={styles.cardContent}>
              <AppText variant="sm" weight="bold">Payment Method</AppText>
              <AppText variant="sm" color={COLORS.neutral[600]}>
                Visa ending in 4242
              </AppText>
            </View>
            <ChevronRight size={20} color={COLORS.neutral[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <AppText variant="lg" weight="bold" style={styles.sectionTitle}>Order Items</AppText>
          <View style={styles.orderCard}>
            {cart.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemInfo}>
                  <AppText variant="sm" numberOfLines={2}>{item.name}</AppText>
                  <AppText variant="sm" weight="bold" style={{ marginTop: 2 }}>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <AppText variant="sm" color={COLORS.neutral[600]}>Items:</AppText>
              <AppText variant="sm">${subtotal.toFixed(2)}</AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant="sm" color={COLORS.neutral[600]}>Shipping:</AppText>
              <AppText variant="sm" color={COLORS.success.DEFAULT}>FREE</AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant="sm" color={COLORS.neutral[600]}>Tax:</AppText>
              <AppText variant="sm">${tax.toFixed(2)}</AppText>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <AppText variant="lg" weight="bold">Order Total:</AppText>
              <AppText variant="lg" weight="bold" color={COLORS.error.DEFAULT}>
                ${total.toFixed(2)}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.securityNote}>
            <ShieldCheck size={16} color={COLORS.neutral[500]} />
            <AppText variant="xs" color={COLORS.neutral[500]}>
              Secure payment encryption. Your data is safe.
            </AppText>
          </View>
          <AppButton
            title="Place Your Order"
            onPress={handlePlaceOrder}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.orderBtn}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
    ...SHADOWS.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.neutral[0],
    marginBottom: SPACING.sm,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.accent.DEFAULT,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.neutral[200],
    marginHorizontal: SPACING.xs,
  },
  stepLineActive: {
    backgroundColor: COLORS.accent.DEFAULT,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.xs,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral[0],
    padding: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  cardIcon: {
    marginRight: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
    gap: SPACING.md,
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.neutral[50],
  },
  itemInfo: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: 8,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    padding: SPACING.lg,
    marginTop: SPACING.xl,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.lg,
  },
  orderBtn: {
    backgroundColor: COLORS.accent.DEFAULT,
    borderRadius: 8,
    borderColor: '#E68A00',
    borderWidth: 1,
  },
});
