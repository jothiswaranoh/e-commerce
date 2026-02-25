import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes.constants';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { CartItemSkeleton } from '../components/ui/Skeleton';

export default function Cart() {
  const { items, subtotal, isLoading, updateQuantity, removeFromCart, error } = useCart();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + shipping;
  const freeShippingLeft = 1000 - subtotal;
  const freeShippingProgress = Math.min((subtotal / 1000) * 100, 100);

  const handleRemove = async (itemId: number, name: string) => {
    setRemovingId(itemId);
    try {
      await removeFromCart(itemId);
      toast.success(`${name} removed from cart`);
    } catch {
      toast.error('Failed to remove item. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleQtyUpdate = async (itemId: number, newQty: number) => {
    try {
      await updateQuantity(itemId, newQty);
    } catch {
      toast.error('Failed to update quantity.');
    }
  };

  /* ── Loading ── */
  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero (skeleton state) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-14">
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">Your cart</p>
            <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-7">
            <div className="lg:col-span-2 space-y-3">
              {[0, 1, 2].map(i => <CartItemSkeleton key={i} />)}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm h-64 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 py-14">
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">Your cart</p>
            <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
          </div>
        </div>

        <div className="flex items-center justify-center py-32 px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-9 h-9 text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              You haven't added anything yet. Discover our products and find something you'll love.
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200">
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main cart ── */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">Your cart</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Shopping Cart
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            {items.length} {items.length === 1 ? 'item' : 'items'} · ₹{subtotal.toLocaleString('en-IN')} subtotal
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
            {typeof error === "string" ? error : (error as any)?.message || JSON.stringify(error)}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-7">

          {/* ── LEFT: Items ── */}
          <div className="lg:col-span-2 space-y-3">

            {/* Free shipping progress */}
            {shipping > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-indigo-500" />
                    Free shipping at ₹1,000
                  </p>
                  <span className="text-xs font-semibold text-indigo-600">
                    ₹{freeShippingLeft.toLocaleString('en-IN')} away
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart items */}
            {items.map((item, i) => {
              const isRemoving = removingId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all ${isRemoving ? 'opacity-50 scale-[0.99]' : 'hover:border-gray-200'
                    }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex gap-0">
                    {/* Image */}
                    <div className="w-28 sm:w-36 flex-shrink-0 bg-gray-50 flex items-center justify-center self-stretch">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                            {item.product_name}
                          </h3>
                          {item.variant_name && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Tag className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 font-medium">{item.variant_name}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.id, item.product_name)}
                          disabled={isLoading || isRemoving}
                          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Qty stepper */}
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQtyUpdate(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyUpdate(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ₹{item.total.toLocaleString('en-IN')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <div className="pt-2">
              <Link to={ROUTES.PRODUCTS}>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
                  ← Continue Shopping
                </button>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-24">

              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Order Summary</h3>
                <p className="text-xs text-gray-400 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="px-6 py-4 space-y-3 border-b border-gray-100">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{shipping}</span>
                  )}
                </div>

                {shipping > 0 && (
                  <div className="pt-1">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      ₹{freeShippingLeft.toLocaleString('en-IN')} more for free shipping
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              <div className="px-6 py-5">
                <Link to={ROUTES.CHECKOUT} className="block">
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <div className="mt-4 flex items-center justify-center gap-4">
                  {['Secure Payment', 'Easy Returns', 'Fast Delivery'].map(t => (
                    <span key={t} className="text-[10px] text-gray-400 font-medium">{t}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}