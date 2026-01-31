import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { mockApi } from '../../services/mockApi';
import { Product } from '../../types';
import { ROUTES } from '../../config/routes.constants';
import Button from '../../components/ui/Button';
import { HOME } from '../../config/ui.config';

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await mockApi.getAllProducts();
        setProducts(data.slice(0, 8));
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
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
