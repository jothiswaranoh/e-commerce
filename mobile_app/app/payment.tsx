import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ArrowLeft, CreditCard, Check, Shield } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { COLORS, GRADIENTS, SPACING, BORDERS, SHADOWS } from '@/lib/theme';

const MOCK_PAYMENTS = [
  { id: '2', type: 'master', last4: '5678', isDefault: false },
  { id: '4', type: 'upi', name: 'UPI', isDefault: false },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(MOCK_PAYMENTS.find(p => p.isDefault)?.id || null);

  const toggleDefault = (id: string) => setSelectedId(id);

  const renderPaymentCard = (payment: any) => (
    <TouchableOpacity
      key={payment.id}
      style={[
        styles.card,
        selectedId === payment.id && styles.selectedCard,
      ]}
      onPress={() => toggleDefault(payment.id)}
    >
      <View style={styles.cardHeader}>
        <CreditCard size={28} color={COLORS.primary.DEFAULT} />
        {payment.type === 'applepay'}
        {selectedId === payment.id && <Check size={24} color={COLORS.success.DEFAULT} />}
      </View>
      <View style={styles.cardDetails}>
        <AppText variant="lg" weight="bold">
          {payment.type === 'visa' && 'Visa'}
          {payment.type === 'master' && 'Mastercard'}
          {payment.name || ''}
        </AppText>
        {payment.last4 && (
          <AppText variant="sm" color={COLORS.neutral[600]}>
            **** **** **** {payment.last4}
          </AppText>
        )}
        <AppText variant="xs" color={COLORS.neutral[500]}>
          Expires 12/28 • Default {selectedId === payment.id && '(Selected)'}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.neutral[900]} />
        </TouchableOpacity>
        <AppText variant="xl" weight="bold">Payment Methods</AppText>
        <View style={{ width: 44 }} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {MOCK_PAYMENTS.map(renderPaymentCard)}
        
        <View style={styles.securityCard}>
          <Shield size={24} color={COLORS.success.DEFAULT} />
          <AppText variant="sm" style={styles.securityText}>
            Your payments are protected with encryption.
          </AppText>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color={COLORS.neutral[0]} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.lg,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  selectedCard: {
    borderColor: COLORS.accent.DEFAULT,
    ...SHADOWS.accentGlow,
  },
  cardHeader: {
    width: 56,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  applePay: {
    fontSize: 24,
    position: 'absolute',
    top: -4,
    right: -4,
  },
  cardDetails: {
    flex: 1,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.success.light,
    borderRadius: BORDERS.radius.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  securityText: {
    color: COLORS.success.DEFAULT,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
});
