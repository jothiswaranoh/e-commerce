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
  categories: Category[];
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
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  hasActiveFilters,
  clearAll,
}: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_20px_45px_rgba(15,23,42,0.06)] overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 mb-3">
          Filters Options
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-base font-bold text-gray-900">Filters</span>
          </div>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="mt-3 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="px-6 py-5 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full h-12 pl-11 pr-10 text-sm bg-white border border-gray-200 rounded-2xl
                       focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50
                       placeholder:text-gray-300 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" /> Categories
        </p>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className={`text-sm leading-5 ${selectedCategory === '' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              All Products
            </span>
          </label>

          {categories.map(cat => (
            <label key={cat.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategory === cat.name}
                onChange={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className={`text-sm leading-5 ${selectedCategory === cat.name ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-900 mb-4">Availability</p>
        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-gray-400">
            <input type="checkbox" disabled className="mt-0.5 h-4 w-4 rounded border-gray-300" />
            In stock
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-400">
            <input type="checkbox" disabled className="mt-0.5 h-4 w-4 rounded border-gray-300" />
            Out of stock
          </label>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { data: categoriesResponse } = useCategories(1, 100);
  const categories: Category[] = categoriesResponse?.data ?? [];
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const selectedCategory = query.get("category") ?? "";
  const searchParam = query.get("search") ?? "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const search = searchParam;

        const res = await productService.getProducts({
          search,
          per_page: 100
        });
        setProducts(res?.data?.data ?? []);
        setTotalCount(res?.data?.meta?.total_count ?? 0);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParam, selectedCategory]);

  const displayed = useMemo(() => {
    let list = [...products];

    if (selectedCategory)
      list = list.filter(p => p.category?.name === selectedCategory);

    return list;
  }, [products, selectedCategory]);

  const hasActiveFilters = selectedCategory !== '' || searchParam !== '';

  const clearAll = () => {
    navigate('/products');
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(location.search);

    if (!category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    navigate(`/products?${params.toString()}`);
  };

  const handleSidebarSearch = (value: string) => {
    const params = new URLSearchParams(location.search);

    if (!value.trim()) {
      params.delete("search");
    } else {
      params.set("search", value);
    }

    navigate(`/products?${params.toString()}`, { replace: true });
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
            {searchParam ? `Results for "${searchParam}"` : "All Products"}
          </h1>
          <p className="text-slate-400 mt-1 text-base">
            {loading
              ? 'Loading…'
              : `${selectedCategory || searchParam ? displayed.length : totalCount} products available`}
            {selectedCategory && ` · ${selectedCategory}`}
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 py-8 flex gap-6">

        {/* Sidebar */}
        <aside className="hidden lg:block w-75 flex-shrink-0 sticky top-24 self-start">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            searchQuery={searchParam}
            setSearchQuery={handleSidebarSearch}
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
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayed.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  variantId={product.variants?.[0]?.id}
                  name={product.name}
                  price={product.variants?.[0]?.price ?? 0}
                  stock={product.variants?.[0]?.stock ?? 0}
                  images={product.images}
                  category={product.category?.name ?? 'Uncategorized'}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}