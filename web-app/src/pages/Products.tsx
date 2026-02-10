import { useState, useEffect, useMemo } from 'react';
import {
  SlidersHorizontal, X, Search, ChevronDown,
  LayoutGrid, LayoutList, Package, Tag, ArrowUpDown
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { useCategories } from '../hooks/useCategory';
import type { Category } from '../api/category';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: categoriesResponse } = useCategories();
  const categories: Category[] = categoriesResponse?.data ?? [];

  /* ── Fetch ── */
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

  /* ── Category counts ── */
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      const name = p.category?.name ?? 'Uncategorized';
      map[name] = (map[name] ?? 0) + 1;
    });
    return map;
  }, [products]);

  /* ── Filter + Sort ── */
  const displayed = useMemo(() => {
    let list = [...products];

    if (selectedCategory)
      list = list.filter(p => p.category?.name === selectedCategory);

    if (searchQuery.trim())
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0)); break;
      case 'price-desc': list.sort((a, b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0)); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const hasActiveFilters = selectedCategory !== '' || searchQuery.trim() !== '';

  const clearAll = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('default');
  };

  /* ══════════════════════════════════════
     FILTER SIDEBAR
  ══════════════════════════════════════ */
  const FilterSidebar = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold text-gray-800 tracking-tight">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
            >
              Clear all
            </button>
          )}
          {showMobileFilters && (
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Search inside sidebar */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-8 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300 transition-colors"
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

      {/* Category filter */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <Tag className="w-3 h-3" /> Category
        </p>

        <div className="space-y-1">
          {/* All */}
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${selectedCategory === ''
              ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
              : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
          >
            <span>All Products</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedCategory === '' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
              }`}>
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
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedCategory === cat.name ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                }`}>
                {categoryCounts[cat.name] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     SKELETON
  ══════════════════════════════════════ */
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gray-100 h-56 w-full" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        <div className="h-4 bg-gray-100 rounded-full w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-gray-100 rounded-full w-1/4" />
          <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="max-w-xl">
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Our collection
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-3">
              All Products
            </h1>
            <p className="text-slate-400 text-base">
              {loading
                ? 'Loading our catalog…'
                : `${products.length} product${products.length !== 1 ? 's' : ''} across ${categories.length} categories`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:border-indigo-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
              <FilterSidebar />
            </div>
          </div>
        )}

        <div className="flex gap-7">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
            <FilterSidebar />
          </aside>

          {/* ── Content ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                {/* Result count */}
                <p className="text-sm text-gray-500">
                  {loading ? (
                    <span className="inline-block w-24 h-4 bg-gray-200 rounded-full animate-pulse" />
                  ) : (
                    <>
                      Showing <span className="font-bold text-gray-900">{displayed.length}</span>
                      {selectedCategory && (
                        <> in <span className="font-semibold text-indigo-600">{selectedCategory}</span></>
                      )}
                      {searchQuery && (
                        <> for "<span className="font-semibold text-indigo-600">{searchQuery}</span>"</>
                      )}
                    </>
                  )}
                </p>

                {/* Active filter chip */}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    {selectedCategory}
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="h-9 pl-8 pr-8 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer font-medium text-gray-700 shadow-sm"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid / List / Skeleton / Empty */}
            {loading ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              }>
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>

            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
                  <Package className="w-9 h-9 text-indigo-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1.5">No products found</h3>
                <p className="text-sm text-gray-400 mb-6 max-w-xs">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different search.`
                    : 'No products in this category yet.'}
                </p>
                <button
                  onClick={clearAll}
                  className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Clear filters
                </button>
              </div>

            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              }>
                {displayed.map((product, i) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="animate-fade-in"
                  >
                    <ProductCard
                      id={product.id.toString()}
                      name={product.name}
                      price={product.variants?.[0]?.price ?? 0}
                      image={product.images?.[0]}
                      category={product.category?.name ?? 'Uncategorized'}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}