import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { useCategories } from '../hooks/useCategory';
import type { Category } from '../api/category';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* ✅ ALWAYS read categories from data.data */
  const { data: categoriesResponse } = useCategories();
  const categories: Category[] = categoriesResponse?.data ?? [];

  /* =========================
     FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts();
        const list = res?.data?.data ?? [];

        setProducts(list);
        setFilteredProducts(list);
      } catch (err) {
        console.error(err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =========================
     FILTER
  ========================= */
  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(
        p => p.category?.name === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory]);

  /* =========================
     FILTER SIDEBAR
  ========================= */
  const FilterSidebar = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          Filters
        </h3>
        {showMobileFilters && (
          <button onClick={() => setShowMobileFilters(false)}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <h4 className="font-medium mb-3">Category</h4>

      <label className="flex gap-2 mb-2 cursor-pointer">
        <input
          type="radio"
          checked={selectedCategory === ''}
          onChange={() => setSelectedCategory('')}
        />
        All Products
      </label>

      {categories.map(cat => (
        <label key={cat.id} className="flex gap-2 mb-2 cursor-pointer">
          <input
            type="radio"
            checked={selectedCategory === cat.name}
            onChange={() => setSelectedCategory(cat.name)}
          />
          {cat.name}
        </label>
      ))}
    </div>
  );

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <h1 className="text-4xl font-bold text-center">All Products</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-64">
          <FilterSidebar />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-96 bg-white rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center">
              <h3 className="text-2xl font-bold">No products found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  name={product.name}
                  price={product.variants?.[0]?.price ?? 0}
                  image={product.images?.[0]}
                  category={product.category?.name ?? 'Uncategorized'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}