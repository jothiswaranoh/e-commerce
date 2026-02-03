import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Note: API integration might differ on how it returns variants. 
  // For now assuming basic product structure, will enhance when variants are fully exposed in API response type.

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await productService.getProduct(id);
        if (response.success && response.data) {
          setProduct(response.data);
          // If product has variants, we might want to pre-select a default size/variant here if logic dictates
          // For now, assuming basic product is enough.
        } else {
          console.error('Failed to load product', response.error);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      // Show toast or some feedback (optional, assuming cart updates automatically show via badge/toast provider if connected)
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Helper to fallback image if missing
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/600?text=No+Image';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/products')}
        className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600?text=Image+Error';
            }}
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            {/* Price might depend on variants later, showing base price for now if available, or finding first variant price */}
            {/* Assuming product has price or we take from variants. Type might assume price exists on product or not. 
                 Checking backend model: Product doesn't have price, Variant does. 
                 Frontend Product type needs to reflect that or API should expose a display price.
                 I will assume API serializes a 'price' or 'display_price' for convenience, or we take from variants[0]
              */}
            <span className="text-3xl font-bold text-gray-900">
              {product.formatted_price || "Price on Selection"}
            </span>
          </div>

          <div dangerouslySetInnerHTML={{ __html: product.description || '' }} className="prose text-gray-600 mb-8" />

          {/* Variants Selection (Placeholder logic until API exposes variants structure clearly in frontend) */}
          {/*
          <div className="space-y-6 mb-8">
             Variant selectors would go here
          </div>
          */}

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100"
                >-</button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100"
                >+</button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={isCartLoading}
              className="flex-1 py-3 flex items-center justify-center gap-2"
              size="lg"
            >
              {isCartLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
              Add to Cart
            </Button>
            <button className="border-2 border-gray-300 p-3 rounded-lg hover:border-gray-900 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
