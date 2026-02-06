import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  rating?: number;
}

export default function ProductCard({
  id = '1',
  name = "Product Name",
  price = 999,
  image = "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400",
  category = "Electronics",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation();
    if (isAdding) return;

    try {
      setIsAdding(true);
      await addToCart(id, 1);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      alert(error.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Image Container */}
      <Link to={`/product/${id}`} className="relative block aspect-square bg-neutral-100 overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 animate-shimmer" />
        )}
       <img
          src={image}
          alt={name}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400';
            setIsImageLoaded(true);
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-neutral-700 rounded-full">
            {category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-600'
              }`}
          />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white text-sm font-semibold">Quick View</span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${id}`} className="block mb-2">
          <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ₹{price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="group/btn bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2.5 rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed">
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span className="font-semibold">{isAdding ? '...' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

