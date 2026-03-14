import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getWishlist, toggleWishlistItem } from '../utils/wishlist';
import { ROUTES } from '../config/routes.constants';

interface ProductCardProps {
  id?: string;
  variantId?: string | number;
  name?: string;
  price?: number;
  stock?: number;
  image?: string;
  images?: { id: number; url: string }[];
  category?: string;
  rating?: number;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({
  id = '1',
  variantId,
  name = "Product Name",
  price = 999,
  stock = 0,
  image,
  images,
  category = "Electronics",
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isWishlisted, setIsWishlisted] = useState(() => getWishlist().has(id));
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdatingQty, setIsUpdatingQty] = useState(false);
  const isOutOfStock = stock <= 0;

  const cartItem = items.find((item) => {
    const sameProduct = String(item.product_id) === String(id);
    return sameProduct;
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(id, 1, variantId);
      toast.success('Product successfully added to cart');
    } catch (error: any) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem || isUpdatingQty) return;

    try {
      setIsUpdatingQty(true);
      if (cartItem.quantity <= 1) {
        await removeFromCart(cartItem.id);
      } else {
        await updateQuantity(cartItem.id, cartItem.quantity - 1);
      }
    } catch {
      toast.error('Failed to update quantity.');
    } finally {
      setIsUpdatingQty(false);
    }
  };

  const handleIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem || isUpdatingQty) return;

    try {
      setIsUpdatingQty(true);
      await updateQuantity(cartItem.id, cartItem.quantity + 1);
    } catch {
      toast.error('Failed to update quantity.');
    } finally {
      setIsUpdatingQty(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowLiked = toggleWishlistItem(id);
    setIsWishlisted(nowLiked);
    if (nowLiked) {
      toast.success('Added to wishlist ❤️');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  const imageSrc =
    images && images.length > 0
      ? images[0]?.url
      : image
        ? image
        : 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400';
        
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
                    hover:shadow-xl hover:border-gray-200 transition-all duration-300
                    hover:-translate-y-1
                    h-full flex flex-col">

      {/* ── IMAGE ── */}
      <Link
        to={`/product/${id}`}
        className="relative block aspect-square bg-gray-50 overflow-hidden"
      >
        {/* Skeleton while loading */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400';
            setIsImageLoaded(true);
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px] pointer-events-none" />
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[11px] font-bold text-indigo-700 rounded-full border border-indigo-100">
            {category}
          </span>
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-red-50/95 backdrop-blur-sm text-[11px] font-bold text-red-600 rounded-full border border-red-200">
              Out of Stock
            </span>
          )}
        </div>

        {/* Like / Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm
                     rounded-full hover:bg-white transition-all duration-200
                     shadow-sm hover:shadow-md
                     opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                     active:scale-90"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${isWishlisted
              ? 'fill-red-500 text-red-500 scale-110'
              : 'text-gray-500'
              }`}
          />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                        flex items-end justify-center pb-4">
          <span className="text-white text-xs font-bold tracking-wide uppercase">
            View Details
          </span>
        </div>
      </Link>

      {/* ── CONTENT ── */}
      <div className="p-4 flex flex-col flex-grow">

        <Link to={`/product/${id}`} className="block mb-3">
          <h3 className="text-sm font-bold text-gray-900
                         hover:text-indigo-600 transition-colors
                         line-clamp-2 min-h-[2.6rem] leading-snug">
            {name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3">

          {/* Price */}
          <span className="text-xl font-bold text-indigo-600 whitespace-nowrap">
            ₹{price.toLocaleString('en-IN')}
          </span>

          {/* Add to Cart */}
          {isOutOfStock ? (
            <div className="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl whitespace-nowrap">
              Out of Stock
            </div>
          ) : cartItem ? (
            <div className="flex items-center rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50">
              <button
                onClick={handleDecrease}
                disabled={isUpdatingQty}
                className="px-3 py-2 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="min-w-8 text-center text-sm font-bold text-indigo-700">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncrease}
                disabled={isUpdatingQty}
                className="px-3 py-2 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold
                         bg-indigo-600 hover:bg-indigo-500 text-white
                         rounded-xl transition-all duration-200
                         shadow-sm hover:shadow-indigo-200 hover:shadow-md
                         disabled:opacity-60 disabled:cursor-not-allowed
                         active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {isAdding ? 'Adding…' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}