import { Tabs } from 'expo-router';
import { Home, ShoppingCart, Grid3X3, Settings } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { useCart } from '@/context/CartContext';
import { COLORS, SHADOWS, BORDERS, SPACING } from '@/lib/theme';
import AppText from '@/components/AppText';

export default function TabLayout() {
  const { itemCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary.DEFAULT,
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarStyle: {
          backgroundColor: COLORS.neutral[0],
          borderTopColor: COLORS.neutral[100],
          borderTopWidth: 1,
          height: 70,
          paddingBottom: SPACING.sm,
          paddingTop: SPACING.sm,
          ...SHADOWS.sm,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Home size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Grid3X3 size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <ShoppingCart size={22} color={color} />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </AppText>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Settings size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 32,
    borderRadius: BORDERS.radius.lg,
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary[50],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accent.DEFAULT,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
