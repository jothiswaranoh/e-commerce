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
import { Heart } from 'lucide-react-native';
import { useFavourite } from '@/context/FavouriteContext';
import { BlurView } from 'expo-blur';
import { Product } from '@/types/product';

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
  const heartScale = useRef(new Animated.Value(1)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const { toggleFavourite, isFavourite } = useFavourite();
  const favourite = isFavourite(product.id);

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

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return `${count}`;
  };

  // Support both old and new structure
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

        {/* IMAGE SLIDER */}
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
          {/*Favourite Button */}
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => {
              toggleFavourite(product);
              animateHeart();
            }}
          >
            <BlurView intensity={60} tint="dark" style={styles.blurHeart}>
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Heart
                  size={18}
                  color={favourite ? "#ff3040" : "#fff"}
                  fill={favourite ? "#ff3040" : "none"}
                />
              </Animated.View>
            </BlurView>
          </TouchableOpacity>
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
                  size={12}
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
            <AppText variant="md" weight="medium" color={COLORS.neutral[900]}>
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
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0,
    // iOS shadow
    shadowColor: '#9000ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    // Android shadow
    elevation: 6,
    marginBottom: 8,
  },
  imageContainer: {
    backgroundColor: COLORS.neutral[50],
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: 150,
  },
  image: {
    width: width - 135,
    height: 150,
    resizeMode: 'contain',
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
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 4,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    marginBottom: 4,
    lineHeight: 20,
    fontSize: 15,
    color: COLORS.neutral[500],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 0.5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
 favButton: {
  position: 'absolute',
  top: 10,
  right: 10,
},
blurHeart: {
  width: 34,
  height: 34,
  borderRadius: 17,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}
});
