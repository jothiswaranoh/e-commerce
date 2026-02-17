import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import AppText from './AppText';
import { COLORS, SPACING } from '@/lib/theme';
import { Product } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'horizontal';
}

const { width } = Dimensions.get('window');

export default function ProductCard({
  product,
  onPress,
  variant = 'default'
}: ProductCardProps) {

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return `${count}`;
  };

  // 👇 Support both old and new structure
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : [];

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>

        {/* 🖼 IMAGE SLIDER */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
              );
              setActiveIndex(index);
            }}
          >
            {images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.image}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <View style={styles.dotsContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index && styles.activeDot
                  ]}
                />
              ))}
            </View>
          )}

          {product.discount && (
            <View style={styles.discountBadge}>
              <AppText variant="xs" weight="bold" color={COLORS.neutral[0]}>
                {product.discount}% off
              </AppText>
            </View>
          )}
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <AppText variant="md" numberOfLines={2} style={styles.title}>
            {product.name}
          </AppText>

          <View style={styles.ratingContainer}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  color={
                    star <= Math.round(product.rating)
                      ? COLORS.accent.DEFAULT
                      : COLORS.neutral[300]
                  }
                  fill={
                    star <= Math.round(product.rating)
                      ? COLORS.accent.DEFAULT
                      : 'transparent'
                  }
                />
              ))}
            </View>
            <AppText variant="sm" color={COLORS.info.DEFAULT}>
              {formatReviewCount(product.reviewCount)}
            </AppText>
          </View>

          <View style={styles.priceContainer}>
            <AppText variant="xl" weight="medium" color={COLORS.neutral[700]}>
              ${product.price.toFixed(2)}
            </AppText>

            {product.originalPrice && (
              <AppText
                variant="sm"
                color={COLORS.neutral[500]}
                style={styles.strikethrough}
              >
                ${product.originalPrice.toFixed(2)}
              </AppText>
            )}
          </View>

          {product.isPrime && (
            <AppText variant="xs" weight="bold" color={COLORS.info.DEFAULT}>
              ✓prime
            </AppText>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral[0],
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginBottom: SPACING.md,
  },
  imageContainer: {
    backgroundColor: COLORS.neutral[50],
    height: 200,
  },
  image: {
    width: width - 40,
    height: 200,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neutral[300],
  },
  activeDot: {
    backgroundColor: COLORS.accent.DEFAULT,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.error.DEFAULT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    marginBottom: 4,
    lineHeight: 20,
    color: COLORS.neutral[700],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
});