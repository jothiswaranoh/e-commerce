import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Heart, ArrowLeft, ChevronLeft, ChevronRight,
  Minus, Plus, Shield, Truck, RotateCcw
} from 'lucide-react';
import { productService } from '../services/productService';
import { Product, ProductVariant } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';

/* ── localStorage wishlist helpers ── */
function getWishlist(): Set<string> {
  try {
    const raw = localStorage.getItem('wishlist');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}
function toggleWishlistItem(id: string): boolean {
  const wl = getWishlist();
  if (wl.has(id)) { wl.delete(id); localStorage.setItem('wishlist', JSON.stringify([...wl])); return false; }
  wl.add(id); localStorage.setItem('wishlist', JSON.stringify([...wl])); return true;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: isCartLoading } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await productService.getProduct(id);
        if (response.success && response.data) {
          setProduct(response.data);
          setCurrentImageIndex(0);
          setIsWishlisted(getWishlist().has(id));
          const variants = response.data.variants || [];
          if (variants.length > 0) {
            const cheapest = [...variants].sort((a, b) => a.price - b.price)[0];
            setSelectedVariant(cheapest);
          }
        }
      } catch {
        toast.error('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    try {
      await addToCart(product.id, quantity, selectedVariant.id);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const handleWishlist = () => {
    if (!id) return;
    const nowLiked = toggleWishlistItem(id);
    setIsWishlisted(nowLiked);
    if (nowLiked) {
      toast.success('Added to wishlist ❤️');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingCart className="w-7 h-7 text-indigo-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
        <p className="text-gray-400 text-sm mb-6">This product may have been removed or is no longer available.</p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://via.placeholder.com/600?text=No+Image'];

  const goNext = () => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  const goPrev = () => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Breadcrumb / Back Bar ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
          <h1 className="text-2xl font-bold mt-2 tracking-tight line-clamp-1">{product.name}</h1>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-10">

          {/* ── LEFT: Image Gallery ── */}
          <div>
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4 group">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600?text=Image+Error';
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all border border-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all border border-gray-100"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-18 h-18 flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === index
                      ? 'border-indigo-500 shadow-md shadow-indigo-100'
                      : 'border-gray-200 hover:border-indigo-300'
                      }`}
                  >
                    <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex flex-col">

            {/* Category badge */}
            {product.category && (
              <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-4 self-start">
                {product.category.name}
              </span>
            )}

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-indigo-600">
                {selectedVariant ? `₹${selectedVariant.price.toLocaleString('en-IN')}` : 'Unavailable'}
              </span>
              {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                <span className="text-xs text-amber-600 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full">
                  Only {selectedVariant.stock} left!
                </span>
              )}
              {selectedVariant && selectedVariant.stock === 0 && (
                <span className="text-xs text-red-600 font-bold px-2 py-0.5 bg-red-50 border border-red-200 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Options</p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isOOS = variant.stock === 0;
                    return (
                      <button
                        key={variant.id}
                        disabled={isOOS}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                          : isOOS
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                      >
                        {variant.name}
                        {isOOS && <span className="ml-1 text-xs">(OOS)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="prose prose-sm text-gray-500 mb-6 max-w-none"
              />
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Quantity</p>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !selectedVariant || selectedVariant.stock === 0}
                className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-bold
                           bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl
                           transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isCartLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {isCartLoading ? 'Adding…' : 'Add to Cart'}
              </button>

              {/* Like / Wishlist button — Functional */}
              <button
                onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${isWishlisted
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-400 hover:text-indigo-500'
                  }`}
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : ''
                    }`}
                />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'On orders over ₹999', color: 'text-indigo-500 bg-indigo-50' },
                { icon: Shield, label: 'Secure Payment', sub: '100% protected', color: 'text-emerald-500 bg-emerald-50' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '7-day policy', color: 'text-amber-500 bg-amber-50' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${b.color}`}>
                    <b.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-gray-700">{b.label}</p>
                  <p className="text-[10px] text-gray-400">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}