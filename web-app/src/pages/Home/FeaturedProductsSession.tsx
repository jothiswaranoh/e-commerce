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
        const response = await productService.getProducts();
        if (response.success && response.data) {
          setProducts(response.data.slice(0, 8));
        } else {
          console.error('Failed to load featured products', response.error);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-2">
              {HOME.sections.featured.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {HOME.sections.featured.subtitle}
            </p>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline">
              View All
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-neutral-100 rounded-xl h-96 animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={product.variants?.[0]?.price || 0}
                image={product.image}
                category={product.category?.name || 'Uncategorized'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
