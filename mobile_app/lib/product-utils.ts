import { BackendProduct, Product } from '@/types/product';

const DEFAULT_PRODUCT_IMAGE =
  'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=800';

export function mapBackendProduct(product: BackendProduct): Product {
  const primaryVariant = product.variants?.[0];
  const price = Number(primaryVariant?.price ?? 0);
  const features = product.product_attributes?.map(
    (attribute) => `${attribute.key}: ${attribute.value}`
  );

  return {
    id: String(product.id),
    name: product.name,
    price,
    image_url: product.images?.[0] ?? DEFAULT_PRODUCT_IMAGE,
    images: product.images?.length ? product.images : [DEFAULT_PRODUCT_IMAGE],
    description: product.description ?? 'No description available.',
    category: product.category?.name ?? 'Uncategorized',
    rating: 4.5,
    reviewCount: 0,
    inStock: (product.variants ?? []).some((variant) => Number(variant.stock) > 0),
    isPrime: true,
    features: features?.length ? features : ['Quality checked', 'Fast shipping'],
    variants: product.variants?.map((variant) => ({
      ...variant,
      id: String(variant.id),
      price: Number(variant.price ?? 0),
      stock: Number(variant.stock ?? 0),
    })),
  };
}
