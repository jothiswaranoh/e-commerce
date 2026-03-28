import { useState, useEffect, useMemo, useRef } from 'react';
import {
  SlidersHorizontal, X, Search, Tag, Sparkles, Check
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
  selectedCategories: string[];
  toggleCategory: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  hasActiveFilters: boolean;
  clearAll: () => void;
  className?: string; // Add className to allow overriding styles (e.g., borders on mobile)
};

function FilterSidebar({
  categories,
  selectedCategories,
  toggleCategory,
  searchQuery,
  setSearchQuery,
  hasActiveFilters,
  clearAll,
  className = "bg-white rounded-2xl border border-neutral-200/60 shadow-lg shadow-neutral-200/30 overflow-hidden flex flex-col sticky top-24"
}: FilterSidebarProps) {
  const categoryListRef = useRef<HTMLDivElement | null>(null);

  const orderedCategories = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) {
      return categories;
    }

    const getRank = (categoryName: string) => {
      const normalizedName = categoryName.toLowerCase();

      if (normalizedName === normalizedSearch) return 0;
      if (normalizedName.startsWith(normalizedSearch)) return 1;
      if (normalizedName.includes(normalizedSearch)) return 2;
      return 3;
    };

    return [...categories].sort((a, b) => {
      const rankDiff = getRank(a.name) - getRank(b.name);
      if (rankDiff !== 0) return rankDiff;

      const selectedDiff =
        Number(selectedCategories.includes(b.name)) - Number(selectedCategories.includes(a.name));
      if (selectedDiff !== 0) return selectedDiff;

      return a.name.localeCompare(b.name);
    });
  }, [categories, searchQuery, selectedCategories]);

  useEffect(() => {
    categoryListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery]);

  return (
    <div className={className}>
      <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h2 className="text-base font-display font-bold text-neutral-900">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-5 border-b border-neutral-100">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-10 pr-9 text-sm bg-neutral-50 border border-transparent rounded-xl
                       focus:bg-white focus:outline-none focus:border-primary-200 focus:ring-4 focus:ring-primary-500/10
                       placeholder:text-neutral-400 transition-all duration-300 font-medium text-neutral-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-neutral-200 hover:bg-neutral-300 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-neutral-600" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" /> Categories
        </p>

        <div ref={categoryListRef} className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {orderedCategories.map(cat => {
            const isSelected = selectedCategories.includes(cat.name);
            return (
              <button 
                key={cat.id} 
                onClick={() => toggleCategory(cat.name)}
                className="w-full flex items-center gap-3 cursor-pointer group text-left"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary-600 border-primary-600 shadow-sm shadow-primary-500/30 text-white' 
                    : 'border-neutral-300 bg-white group-hover:border-primary-400 text-transparent'
                }`}>
                  <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} transition-all duration-200`} />
                </div>
                <span className={`text-sm select-none transition-colors ${isSelected ? 'font-semibold text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: categoriesResponse } = useCategories(1, 100);
  const categories: Category[] = categoriesResponse?.data ?? [];
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const categoryParam = query.get("categories") ?? "";
  const selectedCategories = categoryParam ? categoryParam.split(",") : [];
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
  }, [searchParam, categoryParam]);

  const displayed = useMemo(() => {
    let list = [...products];

    if (selectedCategories.length > 0)
      list = list.filter(p => p.category?.name && selectedCategories.includes(p.category.name));

    return list;
  }, [products, selectedCategories]);

  const hasActiveFilters = selectedCategories.length > 0 || searchParam !== '';

  const clearAll = () => {
    navigate('/products');
  };

  const toggleCategory = (category: string) => {
    let newCats = [...selectedCategories];
    if (newCats.includes(category)) {
      newCats = newCats.filter(c => c !== category);
    } else {
      newCats.push(category);
    }

    const params = new URLSearchParams(location.search);
    if (newCats.length === 0) {
      params.delete("categories");
    } else {
      params.set("categories", newCats.join(","));
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

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  const SidebarProps = {
    categories,
    selectedCategories,
    toggleCategory,
    searchQuery: searchParam,
    setSearchQuery: handleSidebarSearch,
    hasActiveFilters,
    clearAll
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-6 shadow-lg shadow-black/10">
            <Sparkles className="w-4 h-4 text-primary-300" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary-100">Shop Everything</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight mb-4 drop-shadow-sm">
            {searchParam ? `Results for "${searchParam}"` : "All Products"}
          </h1>
          <p className="text-primary-100/80 mt-2 text-lg font-medium max-w-xl">
            {loading
              ? 'Loading collection...'
              : `Explore ${selectedCategories.length > 0 || searchParam ? displayed.length : totalCount} items handpicked for you.`}
          </p>
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategories.map(cat => (
                <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm border border-white/20">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-sm text-sm font-bold text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Show Filters
            {selectedCategories.length > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-primary-600 text-white rounded-full text-[11px] font-bold ml-1">
                {selectedCategories.length}
              </span>
            )}
          </button>
          <span className="text-sm font-medium text-neutral-500">
            {displayed.length} Products
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start">
            <FilterSidebar {...SidebarProps} />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-neutral-100 shadow-sm">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                  <Tag className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-500 max-w-sm mb-8">We couldn't find anything matching your search criteria. Try adjusting your filters.</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {displayed.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    variantId={product.variants?.[0]?.id}
                    name={product.name}
                    price={product.variants?.[0]?.price ?? 0}
                    stock={product.variants?.[0]?.stock ?? 0}
                    images={product.images as any}
                    category={product.category?.name ?? 'Uncategorized'}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMobileFilters(false)} 
          />
          
          {/* Drawer Wrapper */}
          <div className="relative mr-auto flex h-full w-full max-w-[280px] flex-col bg-neutral-50 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                Filters
              </h2>
              <button 
                onClick={() => setShowMobileFilters(false)} 
                className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-neutral-700" />
              </button>
            </div>
            
            {/* Embedded Sidebar Content */}
            <div className="flex-1 overflow-y-auto w-full">
               <FilterSidebar 
                 {...SidebarProps} 
                 className="flex flex-col h-full bg-white" 
               />
            </div>
            
            {/* Mobile Actions Overlay */}
            <div className="p-4 border-t border-neutral-200 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full px-4 py-3 bg-neutral-900 text-white font-bold rounded-xl shadow-md active:scale-95 transition-all text-sm"
              >
                Apply Filters ({displayed.length} items)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
