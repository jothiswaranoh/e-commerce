import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck, Package, Truck, MapPin, ArrowRight } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import { COLORS, SPACING, SHADOWS, BORDERS, GRADIENTS } from '@/lib/theme';

export default function OrderConfirmationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const orderSteps = [
    { icon: CircleCheck, label: 'Order Confirmed', status: 'complete' },
    { icon: Package, label: 'Processing', status: 'current' },
    { icon: Truck, label: 'Shipped', status: 'pending' },
    { icon: MapPin, label: 'Delivered', status: 'pending' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.headerGradient}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <CircleCheck size={80} color={COLORS.neutral[0]} strokeWidth={1.5} />
        </Animated.View>
        <AppText variant="2xl" weight="bold" color={COLORS.neutral[0]}>
          Order Confirmed!
        </AppText>
        <AppText variant="md" color="rgba(255,255,255,0.9)">
          Thank you for shopping with us
        </AppText>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Order Info Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <View>
              <AppText variant="sm" color={COLORS.neutral[500]}>Order Number</AppText>
              <AppText variant="lg" weight="bold">#{id}</AppText>
            </View>
            <View style={styles.statusBadge}>
              <AppText variant="sm" weight="semibold" color={COLORS.success.dark}>
                Confirmed
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Order Timeline */}
          <View style={styles.timeline}>
            {orderSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isComplete = step.status === 'complete';
              const isCurrent = step.status === 'current';
              return (
                <View key={index} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineIcon,
                      isComplete && styles.timelineIconComplete,
                      isCurrent && styles.timelineIconCurrent,
                    ]}
                  >
                    <IconComponent
                      size={20}
                      color={isComplete || isCurrent ? COLORS.neutral[0] : COLORS.neutral[400]}
                    />
                  </View>
                  <AppText
                    variant="xs"
                    weight={isComplete || isCurrent ? 'semibold' : 'regular'}
                    color={isComplete || isCurrent ? COLORS.neutral[900] : COLORS.neutral[400]}
                  >
                    {step.label}
                  </AppText>
                  {index < orderSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        isComplete && styles.timelineLineComplete,
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Truck size={20} color={COLORS.primary.DEFAULT} />
            <View style={styles.infoContent}>
              <AppText variant="sm" weight="semibold">Estimated Delivery</AppText>
              <AppText variant="md" color={COLORS.neutral[600]}>3-5 Business Days</AppText>
            </View>
          </View>
        </View>

        {/* Email Notification */}
        <View style={styles.notificationCard}>
          <AppText variant="sm" color={COLORS.neutral[600]} style={styles.notificationText}>
            📧 Order confirmation and tracking details have been sent to your email address.
          </AppText>
        </View>
      </Animated.View>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        <AppButton
          title="Continue Shopping"
          onPress={() => router.replace('/(tabs)')}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[100],
  },
  headerGradient: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
  },
  orderCard: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: COLORS.success.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDERS.radius.full,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
    marginVertical: SPACING.xl,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  timelineIconComplete: {
    backgroundColor: COLORS.success.DEFAULT,
  },
  timelineIconCurrent: {
    backgroundColor: COLORS.primary.DEFAULT,
    ...SHADOWS.primaryGlow,
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    left: '60%',
    width: '80%',
    height: 2,
    backgroundColor: COLORS.neutral[200],
  },
  timelineLineComplete: {
    backgroundColor: COLORS.success.DEFAULT,
  },
  infoCard: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: BORDERS.radius.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: COLORS.info.light,
    borderRadius: BORDERS.radius.lg,
    padding: SPACING.lg,
  },
  notificationText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: SPACING.xl,
    backgroundColor: COLORS.neutral[0],
    ...SHADOWS.lg,
  },
});
