import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await mockApi.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
          </div>
        </div>
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
        <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            <span className="text-xl text-gray-500 line-through">₹{Math.round(product.price * 1.33)}</span>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Size</h3>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button key={size} className="border-2 border-gray-300 rounded-lg px-6 py-2 hover:border-gray-900 transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Color</h3>
              <div className="flex gap-2">
                {['bg-black', 'bg-gray-500', 'bg-blue-500'].map((color) => (
                  <button key={color} className={`w-10 h-10 ${color} rounded-full border-2 border-gray-300 hover:border-gray-900`} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100">-</button>
                <span className="text-lg font-semibold">1</span>
                <button className="w-10 h-10 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100">+</button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="border-2 border-gray-300 p-3 rounded-lg hover:border-gray-900 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
