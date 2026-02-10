import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
        <Stack.Screen name="order-confirmation/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </CartProvider>
  );
}
