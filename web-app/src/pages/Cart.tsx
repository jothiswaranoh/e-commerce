import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes.constants';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { CartItemSkeleton } from '../components/ui/Skeleton';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function Cart() {
  const { items, subtotal, isLoading, updateQuantity, removeFromCart } = useCart();

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{ id: number, name: string } | null>(null);

  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + shipping;
  const freeShippingLeft = 1000 - subtotal;
  const freeShippingProgress = Math.min((subtotal / 1000) * 100, 100);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleRemove = (itemId: number, name: string) => {
    setItemToRemove({ id: itemId, name });
    setIsConfirmModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;

    const { id: itemId, name } = itemToRemove;
    setRemovingId(itemId);
    setIsConfirmModalOpen(false);

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
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try {
      await updateQuantity(itemId, newQty);
    } catch {
      toast.error('Failed to update quantity.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-6 shadow-lg shadow-black/10">
              <ShoppingBag className="w-4 h-4 text-primary-300" />
              <span className="text-xs font-bold tracking-widest uppercase text-primary-100">Your Cart</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight mb-4 drop-shadow-sm">
              Shopping Cart
            </h1>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[0, 1, 2].map(i => (
              <CartItemSkeleton key={i} />
            ))}
          </div>

          <div className="lg:col-span-4 bg-white border border-neutral-100 shadow-xl shadow-neutral-200/40 rounded-3xl h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-32 px-4">
        <div className="text-center max-w-md w-full bg-white p-12 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-200/40 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShoppingBag className="w-12 h-12 text-primary-400" />
          </div>

          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">
            Your cart is empty
          </h2>

          <p className="text-neutral-500 mb-10 text-lg">
            Looks like you haven't made your choice yet.
          </p>

          <Link to={ROUTES.PRODUCTS} className="block">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 flex justify-center items-center gap-2">
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-6 shadow-lg shadow-black/10">
            <ShoppingBag className="w-4 h-4 text-primary-300" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary-100">Your Cart</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight mb-4 drop-shadow-sm">
            Shopping Cart
          </h1>
          <p className="text-primary-100/80 mt-2 text-lg font-medium max-w-xl">
            {items.length} items · ₹{subtotal.toLocaleString('en-IN')}
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-12 gap-8 lg:gap-12 pl-safe pr-safe">

        {/* LEFT — Items */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Free shipping */}
          {shipping > 0 ? (
            <div className="bg-white border border-primary-100 rounded-3xl p-6 shadow-md shadow-primary-500/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
              <div className="flex justify-between items-center mb-3 text-sm font-bold text-neutral-800">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  Free shipping at ₹1,000
                </span>
                <span className="text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  ₹{freeShippingLeft.toLocaleString('en-IN')} away
                </span>
              </div>

              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${freeShippingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-emerald-200/50 rounded-3xl p-5 shadow-sm flex items-center gap-4 text-emerald-800 font-bold">
              <div className="w-10 h-10 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p>You've unlocked Free Shipping!</p>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-4">
            {items.map(item => {
              const isRemoving = removingId === item.id;
              const isUpdating = updatingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row gap-5 p-5 bg-white border border-neutral-100 rounded-3xl shadow-lg shadow-neutral-200/20 relative group ${
                    isRemoving ? 'opacity-50 pointer-events-none scale-[0.98]' : ''
                  } transition-all duration-300 hover:border-primary-100 hover:shadow-xl`}
                >
                  {/* Image */}
                  <div className="w-full h-48 sm:w-32 sm:h-32 bg-neutral-50 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-100 relative">
                    {item.image ? (
                      <img src={item.image} alt={item.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-neutral-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <Link to={`${ROUTES.PRODUCTS}/${item.product_id}`} className="hover:text-primary-600 transition-colors">
                          <h3 className="font-bold text-lg text-neutral-900 line-clamp-2 leading-tight">{item.product_name}</h3>
                        </Link>
                        {item.variant_name && (
                          <p className="text-sm text-neutral-500 mt-2 flex items-center gap-1.5 font-medium">
                            <Tag className="w-3.5 h-3.5" /> {item.variant_name}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleRemove(item.id, item.product_name)}
                        disabled={isRemoving || isLoading}
                        className="p-2.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0 bg-neutral-50 sm:bg-transparent"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6 sm:mt-4">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl p-1 shadow-inner">
                        <button
                          onClick={() => handleQtyUpdate(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-neutral-900 select-none">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyUpdate(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="p-1.5 text-neutral-600 hover:text-primary-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-neutral-900 tracking-tight">
                          ₹{item.total.toLocaleString('en-IN')}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs font-medium text-neutral-500 mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping */}
          <div className="mt-4 hidden lg:block">
            <Link to={ROUTES.PRODUCTS} className="inline-flex">
              <button className="px-6 py-3 border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 font-bold rounded-xl transition-all flex items-center gap-2">
                ← Continue Shopping
              </button>
            </Link>
          </div>
          <div className="mt-2 block lg:hidden w-full">
            <Link to={ROUTES.PRODUCTS} className="block">
              <button className="w-full px-6 py-3.5 border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 font-bold rounded-2xl transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>

        </div>

        {/* RIGHT — Summary */}
        <div className="lg:col-span-4 block mt-8 lg:mt-0">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-neutral-200/40 sticky top-28 mb-10 lg:mb-0">

            <h3 className="font-display font-bold text-xl text-neutral-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 text-sm font-medium text-neutral-600">
              <div className="flex justify-between items-center">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-neutral-900 font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping cost</span>
                <span className={`font-bold ${shipping === 0 ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md' : 'text-neutral-900'}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-end font-display font-bold text-neutral-900 border-t border-neutral-100 pt-6">
              <span className="text-lg">Total</span>
              <span className="text-3xl text-primary-600 tracking-tight">₹{total.toLocaleString('en-IN')}</span>
            </div>
            
            <p className="text-xs text-neutral-500 text-right mt-2 font-medium">Including all taxes</p>

            <Link to={ROUTES.CHECKOUT} className="block mt-8">
              <button className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-neutral-400 bg-neutral-50 py-3 rounded-xl border border-neutral-100">
              <ShoppingBag className="w-4 h-4" /> Secure checkout
            </div>
          </div>
        </div>

      </div>

      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setItemToRemove(null);
        }}
        onConfirm={confirmRemove}
        title="Remove Item"
        message={`Remove "${itemToRemove?.name}" from your cart?`}
        confirmText="Remove"
        variant="danger"
        isLoading={removingId !== null}
      />
    </div>
  );
}