import { useEffect, useMemo, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.constants';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { CartItemSkeleton } from '../components/ui/Skeleton';

export default function Cart() {
  const { items, isLoading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedItemIds((current) => {
      const itemIds = items.map((item) => item.id);

      if (current.length === 0) {
        return itemIds;
      }

      const nextSelected = current.filter((id) => itemIds.includes(id));
      const newItemIds = itemIds.filter((id) => !current.includes(id));
      return [...nextSelected, ...newItemIds];
    });
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemIds.includes(item.id)),
    [items, selectedItemIds]
  );

  const selectedSubtotal = selectedItems.reduce((acc, item) => acc + item.total, 0);
  const shipping = selectedSubtotal > 999 ? 0 : selectedSubtotal > 0 ? 50 : 0;
  const total = selectedSubtotal + shipping;

  const freeShippingLeft = Math.max(1000 - selectedSubtotal, 0);
  const freeShippingProgress = selectedSubtotal > 0
    ? Math.min((selectedSubtotal / 1000) * 100, 100)
    : 0;
  const allSelected = items.length > 0 && selectedItemIds.length === items.length;

  const handleRemove = async (itemId: number, name: string) => {
    const confirmDelete = window.confirm(`Remove "${name}" from your cart?`);
    if (!confirmDelete) return;

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

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItemIds(allSelected ? [] : items.map((item) => item.id));
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.info('Select at least one cart item to continue.');
      return;
    }

    navigate(ROUTES.CHECKOUT, {
      state: { selectedCartItemIds: selectedItems.map((item) => item.id) },
    });
  };

  /* ───────── Loading ───────── */

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="relative max-w-7xl mx-auto px-6 py-14">
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Your cart
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-3">
            {[0, 1, 2].map(i => (
              <CartItemSkeleton key={i} />
            ))}
          </div>

          <div className="bg-white border rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  /* ───────── Empty Cart ───────── */

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-32">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-9 h-9 text-indigo-300 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>

          <p className="text-gray-400 text-sm mb-8">
            Discover amazing products and start shopping.
          </p>

          <Link to={ROUTES.PRODUCTS}>
            <button className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  /* ───────── Main Cart ───────── */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Your cart
          </p>

          <h1 className="text-4xl font-bold">Shopping Cart</h1>

          <p className="text-slate-400 mt-2">
            {selectedItems.length} of {items.length} items selected · ₹{selectedSubtotal.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-7">

        {/* LEFT — Items */}
        <div className="lg:col-span-2 space-y-3">

          {/* Free shipping */}
          {shipping > 0 && (
            <div className="bg-white border rounded-2xl px-5 py-4">
              <div className="flex justify-between mb-2 text-xs font-semibold">
                <span>Free shipping at ₹1,000</span>
                <span>₹{freeShippingLeft.toLocaleString('en-IN')} away</span>
              </div>

              <div className="h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="bg-white border rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <button
              onClick={toggleSelectAll}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800"
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
            <span className="text-sm text-gray-500">
              {selectedItems.length} selected
            </span>
          </div>

          {/* Items */}
          {items.map(item => {
            const isRemoving = removingId === item.id;
            const isUpdating = updatingId === item.id;
            const isSelected = selectedItemIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden ${
                  isRemoving ? 'opacity-50' : ''
                }`}
              >
                <div className="flex">
                  <div className="border-r border-gray-100 px-4 flex items-center justify-center">
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className="text-gray-500 hover:text-indigo-600"
                      aria-label={isSelected ? 'Deselect cart item' : 'Select cart item'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Image */}
                  <div className="w-28 bg-gray-50 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.product_name} />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-5">

                    <div className="flex justify-between">

                      <div>
                        <h3 className="font-bold">{item.product_name}</h3>

                        {item.variant_name && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.variant_name}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemove(item.id, item.product_name)}
                        disabled={isRemoving || isLoading}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                    <div className="flex justify-between mt-4">

                      {/* Quantity */}
                      <div className="flex border rounded-xl">

                        <button
                          onClick={() =>
                            handleQtyUpdate(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isUpdating}
                          className="px-3 py-2"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="px-3 py-2 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQtyUpdate(item.id, item.quantity + 1)
                          }
                          disabled={isUpdating}
                          className="px-3 py-2"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold">
                          ₹{item.total.toLocaleString('en-IN')}
                        </p>

                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">
                            ₹{item.price} each
                          </p>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue Shopping */}
          <Link to={ROUTES.PRODUCTS}>
            <button className="px-5 py-2 border rounded-xl">
              ← Continue Shopping
            </button>
          </Link>

        </div>

        {/* RIGHT — Summary */}
        <div className="bg-white border rounded-2xl p-6 h-fit sticky top-24">

          <h3 className="font-bold mb-4">Order Summary</h3>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal ({selectedItems.length} items)</span>
            <span>₹{selectedSubtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Buy Selected Items
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}