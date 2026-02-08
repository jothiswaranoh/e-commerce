// src/pages/Home/FeaturedProductsSection.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { Product } from '../../types/product';
import { ROUTES } from '../../config/routes.constants';
import Button from '../../components/ui/Button';
import { HOME } from '../../config/ui.config';

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts({
          page: 1,
          per_page: 8,
        });

        if (res.success && Array.isArray(res.data?.data)) {
          setProducts(res.data.data);
        } else {
          console.error('Invalid products response', res);
        }
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-neutral-100 rounded-xl animate-shimmer" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold">{HOME.sections.featured.title}</h2>
            <p className="text-neutral-600">{HOME.sections.featured.subtitle}</p>
          </div>

          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={String(product.id)}
              name={product.name}
              price={product.variants?.[0]?.price ?? 0}
              category={product.category?.name ?? 'Uncategorized'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}