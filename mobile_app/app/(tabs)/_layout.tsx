import { Tabs } from 'expo-router';
import { Home, ShoppingCart, Settings, Heart, Grid3X3 } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
import { useCart } from '@/context/CartContext';
import { COLORS, SPACING } from '@/lib/theme';
import AppText from '@/components/AppText';

export default function TabLayout() {
  const { itemCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.primary.DEFAULT,
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarStyle: {
          position: 'relative',
          backgroundColor: COLORS.neutral[0],
          borderTopWidth: 1,
          borderTopColor: COLORS.neutral[300],
          height: Platform.OS === 'ios' ? 80 : 80,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 8,
          elevation: 0,
          shadowColor: 'transparent',
        },
        
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          
        },
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Home size={22} color={focused ? COLORS.primary.DEFAULT : COLORS.neutral[400]} />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Grid3X3 size={22} color={focused ? COLORS.primary.DEFAULT : COLORS.neutral[400]} />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourite',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Heart size={22} color={focused ? COLORS.primary.DEFAULT : COLORS.neutral[400]} />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <ShoppingCart size={22} color={focused ? COLORS.primary.DEFAULT : COLORS.neutral[400]} />
                {itemCount > 0 && (
                  <View style={styles.badge}>
                    <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                      {itemCount > 9 ? '9+' : itemCount}
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Settings size={22} color={focused ? COLORS.primary.DEFAULT : COLORS.neutral[400]} />
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 32,
    borderRadius: 16,
    position: 'relative',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.error.DEFAULT,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.neutral[0],
  },
});

