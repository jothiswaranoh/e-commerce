import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../config/routes.constants';
import Button from '../components/ui/Button';

import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { items, subtotal, isLoading, updateQuantity, removeFromCart, error } = useCart();
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + shipping;

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-neutral-400" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Your cart is empty</h2>
          <p className="text-neutral-600 mb-8">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button size="lg">
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-lg text-white/90">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} variant="elevated" padding="lg">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-neutral-300" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {item.product_name}
                        </h3>
                        {item.variant_name && (
                          <div className="text-sm text-neutral-600">
                            Variant: {item.variant_name}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                        title="Remove item"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center border-2 border-neutral-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all disabled:opacity-50"
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-lg min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center border-2 border-neutral-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all disabled:opacity-50"
                          disabled={isLoading}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                          ₹{item.total.toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-neutral-500">₹{item.price.toLocaleString()} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="flex justify-center mt-8">
              <Link to={ROUTES.PRODUCTS}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card variant="elevated" padding="lg" className="sticky top-24">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">Order Summary</h3>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-neutral-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <Badge variant="success">FREE</Badge>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-neutral-500">
                    Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-neutral-900">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <Link to={ROUTES.CHECKOUT}>
                <Button size="lg" fullWidth>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div >
    </div >
  );
}

