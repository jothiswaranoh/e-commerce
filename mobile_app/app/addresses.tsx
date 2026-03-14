import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowLeft, MapPin, Edit2, Trash2, Check } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';
import { MOCK_ADDRESSES } from '@/lib/constants';

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [selectedId, setSelectedId] = useState(MOCK_ADDRESSES[0]?.id || null);

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const toggleDefault = (id: string) => {
    setSelectedId(id);
  };

  const renderAddressCard = (address: any) => (
    <TouchableOpacity
      key={address.id}
      style={[
        styles.card,
        selectedId === address.id && styles.defaultCard,
      ]}
      activeOpacity={0.8}
      onPress={() => toggleDefault(address.id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <MapPin size={20} color={COLORS.primary.DEFAULT} />
          <AppText variant="sm" weight="semibold" style={styles.typeLabel}>
            {address.type}
          </AppText>
        </View>
        {selectedId === address.id && (
          <View style={styles.checkContainer}>
            <Check size={20} color={COLORS.primary.DEFAULT} />
          </View>
        )}
      </View>

      <View style={styles.addressDetails}>
        <AppText variant="md" weight="bold" style={styles.name}>
          {address.name}
        </AppText>
        <AppText variant="sm" numberOfLines={2} style={styles.street}>
          {address.street}
        </AppText>
        <AppText variant="sm" style={styles.location}>
          {address.city}, {address.zip}
        </AppText>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Edit2 size={18} color={COLORS.neutral[600]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={() => handleDelete(address.id)}
        >
          <Trash2 size={18} color={COLORS.neutral[600]} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const hasAddresses = addresses.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.neutral[900]} />
        </TouchableOpacity>
        <AppText variant="lg" weight="bold" style={styles.headerTitle}>
          Addresses
        </AppText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasAddresses ? (
          addresses.map(renderAddressCard)
        ) : (
          <View style={styles.emptyState}>
            <MapPin size={64} color={COLORS.neutral[400]} />
            <AppText variant="lg" weight="semibold" style={styles.emptyTitle}>
              No Addresses
            </AppText>
            <AppText variant="sm" color={COLORS.neutral[500]} style={styles.emptySubtitle}>
              Add your first delivery address to get started.
            </AppText>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Plus size={24} color={COLORS.neutral[0]} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
    ...SHADOWS.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: BORDERS.radius.full,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING['3xl'],
    paddingBottom: 120,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(3, 2, 2, 0.2)',
    ...SHADOWS.lg,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 12,
  },
  defaultCard: {
    borderColor: COLORS.primary.DEFAULT,
    shadowColor: COLORS.neutral[0],
    shadowOpacity: 0.15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 20,
  },
  typeLabel: {
    color: COLORS.primary.DEFAULT,
  },
  checkContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(124,58,237,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressDetails: {
    marginBottom: SPACING.lg,
  },
  name: {
    marginBottom: SPACING.xs,
    color: COLORS.neutral[900],
  },
  street: {
    marginBottom: SPACING.xs,
    color: COLORS.neutral[900],
    lineHeight: 22,
  },
  location: {
    color: COLORS.neutral[600],
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.lg,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 100,
    gap: SPACING.lg,
  },
  emptyTitle: {
    color: COLORS.neutral[900],
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 280,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
});
