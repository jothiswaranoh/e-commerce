import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, PackageCheck, Truck, Clock, Download, RefreshCw, CircleAlert } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, GRADIENTS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import { OrderData, orderApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const STATUS_META = {
  delivered: { label: 'Delivered', icon: PackageCheck, color: COLORS.success },
  shipped: { label: 'Shipped', icon: Truck, color: COLORS.primary },
  confirmed: { label: 'Processing', icon: Clock, color: COLORS.warning },
  pending: { label: 'Processing', icon: Clock, color: COLORS.warning },
  cancelled: { label: 'Cancelled', icon: CircleAlert, color: COLORS.error },
} as const;

type FilterKey = 'all' | 'delivered' | 'shipped' | 'processing' | 'cancelled';

function formatOrderDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function matchesFilter(order: OrderData, filter: FilterKey) {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'processing') {
    return order.status === 'pending' || order.status === 'confirmed';
  }

  return order.status === filter;
}

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      if (!isAuthenticated) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await orderApi.getOrders({ page: 1, per_page: 20 });
        if (!isMounted) return;
        setOrders(response.data);
        setError(null);
      } catch (fetchError) {
        if (!isMounted) return;
        setOrders([]);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load orders');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesFilter(order, filter)),
    [filter, orders]
  );

  const renderStatus = (order: OrderData) => {
    const meta = STATUS_META[order.status as keyof typeof STATUS_META] ?? STATUS_META.pending;
    const Icon = meta.icon;

    return (
      <View style={[styles.statusBadge, { backgroundColor: meta.color.light }]}>
        <Icon size={16} color={meta.color.DEFAULT} />
        <AppText variant="xs" weight="medium" color={meta.color.DEFAULT}>
          {meta.label}
        </AppText>
      </View>
    );
  };

  const renderOrder = (order: OrderData) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderCard}
      activeOpacity={0.95}
      onPress={() => router.push(`/order/${order.id}`)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderMeta}>
          <AppText variant="sm" color={COLORS.neutral[600]}>
            Order #{order.order_number}
          </AppText>
          <AppText variant="xs" color={COLORS.neutral[500]}>
            {formatOrderDate(order.created_at)}
          </AppText>
        </View>
        {renderStatus(order)}
      </View>

      {order.order_items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          {item.product?.images?.[0] ? (
            <Image source={{ uri: item.product.images[0] }} style={styles.itemImage} />
          ) : (
            <View style={styles.itemImage} />
          )}
          <View style={styles.itemDetails}>
            <AppText variant="md" weight="semibold" numberOfLines={2}>
              {item.product_name}
            </AppText>
            <AppText variant="sm" color={COLORS.neutral[600]}>
              Qty {item.quantity} • ${Number(item.price).toFixed(2)}
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.reorderBtn}
            onPress={() => router.push(`/product/${item.product_id}`)}
          >
            <RefreshCw size={16} color={COLORS.accent.DEFAULT} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.orderFooter}>
        <AppText variant="lg" weight="bold">
          ${Number(order.total).toFixed(2)}
        </AppText>
        <TouchableOpacity style={styles.invoiceBtn} onPress={() => router.push(`/order/${order.id}`)}>
          <Download size={18} color={COLORS.primary.DEFAULT} />
          <AppText variant="sm" weight="medium" color={COLORS.primary.DEFAULT}>
            Invoice
          </AppText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={GRADIENTS.headerDark} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <AppText variant="xl" weight="bold" color="#fff">
          Your Orders
        </AppText>
        <View style={{ width: 44 }} />
      </LinearGradient>

      <View style={styles.filterRow}>
        {(['all', 'delivered', 'shipped', 'processing', 'cancelled'] as FilterKey[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, filter === tab && styles.activeFilterTab]}
            onPress={() => setFilter(tab)}
          >
            <AppText
              variant="sm"
              weight={filter === tab ? 'semibold' : 'medium'}
              color={filter === tab ? COLORS.neutral[900] : COLORS.neutral[500]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {error ? (
            <View style={styles.emptyState}>
              <CircleAlert size={64} color={COLORS.error.DEFAULT} />
              <AppText variant="lg" weight="semibold" color={COLORS.neutral[900]}>
                Orders unavailable
              </AppText>
              <AppText variant="sm" color={COLORS.neutral[500]}>
                {error}
              </AppText>
            </View>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrder)
          ) : (
            <View style={styles.emptyState}>
              <PackageCheck size={64} color={COLORS.neutral[400]} />
              <AppText variant="lg" weight="semibold" color={COLORS.neutral[900]}>
                {isAuthenticated ? 'No orders yet' : 'Sign in to view orders'}
              </AppText>
              <AppText variant="sm" color={COLORS.neutral[500]}>
                {isAuthenticated
                  ? 'Your shopping journey begins when you place your first order.'
                  : 'Orders are stored in your account on the backend.'}
              </AppText>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[0],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent.DEFAULT,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  orderCard: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  orderMeta: {
    gap: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDERS.radius.full,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  itemImage: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
  },
  reorderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['3xl'],
    gap: SPACING.md,
  },
});
