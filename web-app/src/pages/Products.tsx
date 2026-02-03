import { useState, useEffect } from 'react';
import { SlidersHorizontal, Grid3x3, List, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import Button from '../components/ui/Button';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts();
        if (response.success && response.data) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          console.error('Failed to load products', response.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category?.name === selectedCategory);
    }

    const getPrice = (p: Product) => p.variants?.[0]?.price || 0;

    if (sortBy === 'price-low') {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortBy, products]);

  // FilterSidebar Component
  const FilterSidebar = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          Filters
        </h3>
        {showMobileFilters && (
          <button
            onClick={() => setShowMobileFilters(false)}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Category</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              All Products
            </label>
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {selectedCategory && (
          <Button
            variant="outline"
            fullWidth
            onClick={() => setSelectedCategory('')}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">All Products</h1>
          <p className="text-lg text-white/90">Discover our complete collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <p className="text-neutral-600 font-medium">
                    <span className="text-primary-600 font-bold">{filteredProducts.length}</span> products found
                  </p>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name: A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-96 animate-shimmer" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">No products found</h3>
                  <p className="text-neutral-600 mb-6">
                    Try adjusting your filters to find what you're looking for
                  </p>
                  <Button onClick={() => setSelectedCategory('')}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredProducts.map((product) => (
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
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {
        showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
              <FilterSidebar />
            </div>
          </div>
        )
      }
    </div >
  );
}

