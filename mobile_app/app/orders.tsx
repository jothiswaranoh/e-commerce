import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, CheckCircle, Clock, Truck, PackageCheck, Download, RefreshCw } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, GRADIENTS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

const MOCK_ORDERS = [
  {
    id: '405-1234567-1234567',
    date: 'Dec 12, 2023',
    total: '$149.99',
    status: 'Delivered',
    statusIcon: PackageCheck,
    items: [
      { ...MOCK_PRODUCTS[0], qty: 1, price: 149.99 },
    ],
  },
  {
    id: '405-7654321-7654321',
    date: 'Nov 28, 2023',
    total: '$279.00',
    status: 'Shipped',
    statusIcon: Truck,
    items: [
      { ...MOCK_PRODUCTS[1], qty: 2, price: 139.50 },
    ],
  },
  {
    id: '405-9876543-9876543',
    date: 'Nov 20, 2023',
    total: '$89.99',
    status: 'Processing',
    statusIcon: Clock,
    items: [
      { ...MOCK_PRODUCTS[2], qty: 1, price: 89.99 },
    ],
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const filteredOrders = MOCK_ORDERS.filter(order => filter === 'all' || order.status.toLowerCase() === filter);

  const renderStatus = (order: any) => {
    const Icon = order.statusIcon;
const statusColors = {
      Delivered: COLORS.success,
      Shipped: COLORS.primary,
      Processing: COLORS.warning,
    } as const;

    const color = statusColors[order.status as keyof typeof statusColors] || { 
      DEFAULT: COLORS.neutral[600], light: COLORS.neutral[100] };

    return (
      <View style={[styles.statusBadge, { backgroundColor: color.light }]}>
        <Icon size={16} color={color.DEFAULT} />
        <AppText variant="xs" weight="medium" color={color.DEFAULT}>
          {order.status}
        </AppText>
      </View>
    );
  };

  const renderOrder = (order: any) => (
    <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.95}>
      <View style={styles.orderHeader}>
        <View style={styles.orderMeta}>
          <AppText variant="sm" color={COLORS.neutral[600]}>Order #{order.id}</AppText>
          <AppText variant="xs" color={COLORS.neutral[500]}>{order.date}</AppText>
        </View>
        {renderStatus(order)}
      </View>

      {order.items.map((item: any, index: number) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <AppText variant="md" weight="semibold" numberOfLines={2}>
              {item.name}
            </AppText>
            <AppText variant="sm" color={COLORS.neutral[600]}>
              Qty {item.qty} • ${item.price.toFixed(2)}
            </AppText>
          </View>
          <TouchableOpacity style={styles.reorderBtn}>
            <RefreshCw size={16} color={COLORS.accent.DEFAULT} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.orderFooter}>
        <AppText variant="lg" weight="bold">{order.total}</AppText>
        <TouchableOpacity style={styles.invoiceBtn}>
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
        <AppText variant="xl" weight="bold" color="#fff">Your Orders</AppText>
        <View style={{ width: 44 }} />
      </LinearGradient>

      <View style={styles.filterRow}>
        {['all', 'delivered', 'shipped', 'processing'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              filter === tab && styles.activeFilterTab,
            ]}
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(renderOrder)
        ) : (
          <View style={styles.emptyState}>
            <PackageCheck size={64} color={COLORS.neutral[400]} />
            <AppText variant="lg" weight="semibold" color={COLORS.neutral[900]}>
              No orders yet
            </AppText>
            <AppText variant="sm" color={COLORS.neutral[500]}>
              Your shopping journey begins when you place your first order.
            </AppText>
          </View>
        )}
      </ScrollView>
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
    backdropFilter: 'blur(10px)',
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
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  invoiceBtn: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 120,
    gap: SPACING.lg,
  },
});

