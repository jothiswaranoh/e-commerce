import { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CircleAlert, Clock, PackageCheck, Truck } from 'lucide-react-native';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import { BORDERS, COLORS, SHADOWS, SPACING } from '@/lib/theme';
import { OrderData, orderApi } from '@/lib/api';

const STATUS_META = {
  delivered: { label: 'Delivered', icon: PackageCheck, color: COLORS.success },
  shipped: { label: 'Shipped', icon: Truck, color: COLORS.primary },
  confirmed: { label: 'Confirmed', icon: Clock, color: COLORS.warning },
  pending: { label: 'Pending', icon: Clock, color: COLORS.warning },
  cancelled: { label: 'Cancelled', icon: CircleAlert, color: COLORS.error },
} as const;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!orderId) {
      setError('Order not found.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadOrder() {
      try {
        const response = await orderApi.getOrder(orderId);
        if (!isMounted) return;
        setOrder(response);
        setError(null);
      } catch (fetchError) {
        if (!isMounted) return;
        setOrder(null);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load order');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const statusMeta = useMemo(() => {
    if (!order) {
      return STATUS_META.pending;
    }

    return STATUS_META[order.status as keyof typeof STATUS_META] ?? STATUS_META.pending;
  }, [order]);

  const handleCancelOrder = () => {
    if (!order) {
      return;
    }

    Alert.alert('Cancel Order', 'Only pending orders can be cancelled. Continue?', [
      { text: 'Keep Order', style: 'cancel' },
      {
        text: 'Cancel Order',
        style: 'destructive',
        onPress: async () => {
          try {
            setCancelling(true);
            const updatedOrder = await orderApi.cancelOrder(order.id);
            setOrder(updatedOrder);
            setError(null);
          } catch (cancelError) {
            Alert.alert(
              'Unable to cancel order',
              cancelError instanceof Error ? cancelError.message : 'Please try again.'
            );
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color={COLORS.neutral[900]} />
          </TouchableOpacity>
          <AppText variant="lg" weight="bold">
            Order Details
          </AppText>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyState}>
          <CircleAlert size={56} color={COLORS.error.DEFAULT} />
          <AppText variant="lg" weight="bold" color={COLORS.neutral[900]}>
            Order unavailable
          </AppText>
          <AppText variant="sm" color={COLORS.neutral[500]}>
            {error ?? 'Unable to load this order.'}
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  const StatusIcon = statusMeta.icon;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.neutral[900]} />
        </TouchableOpacity>
        <AppText variant="lg" weight="bold">
          Order Details
        </AppText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <AppText variant="sm" color={COLORS.neutral[500]}>
                Order Number
              </AppText>
              <AppText variant="lg" weight="bold">
                #{order.order_number}
              </AppText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusMeta.color.light }]}>
              <StatusIcon size={16} color={statusMeta.color.DEFAULT} />
              <AppText variant="xs" weight="bold" color={statusMeta.color.DEFAULT}>
                {statusMeta.label}
              </AppText>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View>
              <AppText variant="xs" color={COLORS.neutral[500]}>
                Placed On
              </AppText>
              <AppText variant="sm">{formatDate(order.created_at)}</AppText>
            </View>
            <View>
              <AppText variant="xs" color={COLORS.neutral[500]}>
                Payment
              </AppText>
              <AppText variant="sm" style={styles.capitalizeText}>
                {order.payment_status}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="lg" weight="bold" style={styles.sectionTitle}>
            Items
          </AppText>
          {order.order_items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemRow}
              activeOpacity={0.85}
              onPress={() => router.push(`/product/${item.product_id}`)}
            >
              {item.product?.images?.[0] ? (
                <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} />
              ) : (
                <View style={styles.itemImage} />
              )}
              <View style={styles.itemContent}>
                <AppText variant="md" weight="semibold" numberOfLines={2}>
                  {item.product_name}
                </AppText>
                <AppText variant="sm" color={COLORS.neutral[500]}>
                  Qty {item.quantity} x ${Number(item.price).toFixed(2)}
                </AppText>
              </View>
              <AppText variant="sm" weight="bold">
                ${Number(item.total).toFixed(2)}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="lg" weight="bold" style={styles.sectionTitle}>
            Totals
          </AppText>
          <View style={styles.priceRow}>
            <AppText variant="sm" color={COLORS.neutral[500]}>
              Subtotal
            </AppText>
            <AppText variant="sm">${Number(order.subtotal).toFixed(2)}</AppText>
          </View>
          <View style={styles.priceRow}>
            <AppText variant="sm" color={COLORS.neutral[500]}>
              Shipping
            </AppText>
            <AppText variant="sm">${Number(order.shipping_fee).toFixed(2)}</AppText>
          </View>
          <View style={styles.priceRow}>
            <AppText variant="sm" color={COLORS.neutral[500]}>
              Tax
            </AppText>
            <AppText variant="sm">${Number(order.tax).toFixed(2)}</AppText>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <AppText variant="md" weight="bold">
              Total
            </AppText>
            <AppText variant="md" weight="bold">
              ${Number(order.total).toFixed(2)}
            </AppText>
          </View>
        </View>

        {order.status === 'pending' ? (
          <AppButton
            title="Cancel Order"
            onPress={handleCancelOrder}
            variant="outline"
            size="lg"
            fullWidth
            loading={cancelling}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[100],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.neutral[0],
    ...SHADOWS.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  summaryCard: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDERS.radius.full,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capitalizeText: {
    textTransform: 'capitalize',
  },
  sectionCard: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[100],
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  totalRow: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
});
