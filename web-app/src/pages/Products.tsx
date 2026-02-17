import { useState, useEffect, useMemo } from 'react';
import {
  SlidersHorizontal, X, Search, Tag
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { useCategories } from '../hooks/useCategory';
import type { Category } from '../api/category';

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

      {/* Categories */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
          <Tag className="w-3 h-3" /> Category
        </p>

        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
              selectedCategory === ''
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                selectedCategory === cat.name
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categoriesResponse } = useCategories(1, 100);
  const categories: Category[] = categoriesResponse?.data ?? [];

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
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

  const hasActiveFilters =
    selectedCategory !== '' || searchInput.trim() !== '';

  const clearAll = () => {
    setSelectedCategory('');
    setSearchInput('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-7">

        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            products={products}
            categories={categories}
            categoryCounts={categoryCounts}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchInput}
            setSearchQuery={setSearchInput}
            hasActiveFilters={hasActiveFilters}
            clearAll={clearAll}
            showMobileFilters={false}
            setShowMobileFilters={() => {}}
          />
        </aside>

        {/* ✅ PERFECTLY ALIGNED GRID */}
        <div className="flex-1 min-w-0">
         <div className="grid 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-3 
                2xl:grid-cols-4 
                gap-8">

            {displayed.map(product => (
              <div key={product.id} className="h-full flex">
                <div className="w-full h-full flex">
                  <ProductCard
                    id={product.id.toString()}
                    name={product.name}
                    price={product.variants?.[0]?.price ?? 0}
                    image={
                      product.images?.[0]?.url ||
                      product.images?.[0] ||
                      'https://via.placeholder.com/400?text=No+Image'
                    }
                    category={product.category?.name ?? 'Uncategorized'}
                    viewMode="grid"
                  />
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}