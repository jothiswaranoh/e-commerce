import { useState, useEffect, useMemo } from 'react';
import {
  SlidersHorizontal, X, Search, Tag, Sparkles
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { useCategories } from '../hooks/useCategory';
import type { Category } from '../api/category';
import { useLocation, useNavigate } from 'react-router-dom';

type FilterSidebarProps = {
  products: Product[];
  categories: Category[];
  categoryCounts: Record<string, number>;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  hasActiveFilters: boolean;
  clearAll: () => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (v: boolean) => void;
};

function FilterSidebar({
  products,
  categories,
  categoryCounts,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  hasActiveFilters,
  clearAll,
}: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold text-gray-800 tracking-tight">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-8 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-xl
                       focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                       placeholder:text-gray-300 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <Tag className="w-3 h-3" /> Category
        </p>

        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${selectedCategory === ''
              ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
              : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
          >
            <span>All Products</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {products.length}
            </span>
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${selectedCategory === cat.name
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {categoryCounts[cat.name] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categoriesResponse } = useCategories(1, 100);
  const categories: Category[] = categoriesResponse?.data ?? [];
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get('category') ?? '';

  useEffect(() => {
    const debounce = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts();
        setProducts(res?.data?.data ?? []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      const name = p.category?.name ?? 'Uncategorized';
      map[name] = (map[name] ?? 0) + 1;
    });
    return map;
  }, [products]);

  const displayed = useMemo(() => {
    let list = [...products];
    if (selectedCategory)
      list = list.filter(p => p.category?.name === selectedCategory);
    if (searchQuery.trim())
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return list;
  }, [products, selectedCategory, searchQuery]);

  const hasActiveFilters = selectedCategory !== '' || searchInput.trim() !== '';

  const clearAll = () => {
    navigate('/products');
    setSearchInput('');
    setSearchQuery('');
  };

  const handleCategoryChange = (category: string) => {
    if (!category) {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">Shop Everything</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-2">
            All Products
          </h1>
          <p className="text-slate-400 mt-1 text-base">
            {loading ? 'Loading…' : `${products.length} products available`}
            {selectedCategory && ` · ${selectedCategory}`}
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-7">

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
          <FilterSidebar
            products={products}
            categories={categories}
            categoryCounts={categoryCounts}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            searchQuery={searchInput}
            setSearchQuery={setSearchInput}
            hasActiveFilters={hasActiveFilters}
            clearAll={clearAll}
            showMobileFilters={false}
            setShowMobileFilters={() => { }}
          />
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            /* Skeleton grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Tag className="w-7 h-7 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={clearAll}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayed.map(product => (
                <div key={product.id} className="h-full flex">
                  <div className="w-full h-full flex">
                    <ProductCard
                      id={product.id.toString()}
                      variantId={product.variants?.[0]?.id}
                      name={product.name}
                      price={product.variants?.[0]?.price ?? 0}
                      image={
                        (product.images?.[0] as any)?.url ||
                        (typeof product.images?.[0] === 'string' ? product.images[0] : undefined) ||
                        'https://via.placeholder.com/400?text=No+Image'
                      }
                      category={product.category?.name ?? 'Uncategorized'}
                      viewMode="grid"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}