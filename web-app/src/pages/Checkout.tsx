import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Truck, User, Mail, Phone, Home,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles
} from 'lucide-react';
import { ROUTES } from '../config/routes.constants';
import Input from '../components/ui/Input';

type CheckoutStep = 'shipping' | 'review';

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '',
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  const steps = [
    { id: 'shipping' as CheckoutStep, label: 'Shipping', icon: Truck },
    { id: 'review' as CheckoutStep, label: 'Review', icon: CheckCircle2 },
  ];

  const { items, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const renderStepActions = (sidebar = false) => {
    const wrapperClass = sidebar
      ? 'flex flex-col gap-3 border-t border-gray-100 px-6 py-5'
      : 'flex justify-between pt-2';

    if (currentStep === 'shipping') {
      return (
        <div className={wrapperClass}>
          <Link to={ROUTES.CART} className={sidebar ? 'block order-1' : ''}>
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${sidebar
                ? 'w-full px-5 py-3 bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'
                : 'px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'
                }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>
          </Link>
          <button
            type="submit"
            form="checkout-shipping-form"
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors shadow-sm shadow-indigo-200 ${sidebar ? 'order-2 w-full px-6 py-3' : 'px-6 py-2.5'
              }`}
          >
            Review Order <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className={wrapperClass}>
        <button
          type="button"
          onClick={() => setCurrentStep('shipping')}
          className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${sidebar
            ? 'order-1 w-full px-5 py-3 bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'
            : 'px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'
            }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors shadow-sm shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed ${sidebar ? 'order-2 w-full px-8 py-3' : 'px-8 py-3'
            }`}
        >
          {placingOrder ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Placing Order…
            </>
          ) : (
            <>Place Order <CheckCircle2 className="w-4 h-4" /></>
          )}
        </button>
      </div>
    );
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);
    try {
      const payload = {
        order: {
          tax: Math.round(tax),
          shipping_fee: shipping,
        },
        items: items.map(item => ({
          product_id: item.product_id,
          product_variant_id: (item as any).product_variant_id ?? 0,
          quantity: item.quantity,
        })),
      };
      const res = await orderService.placeOrder(payload);
      if (res.success) {
        toast.success('🎉 Order placed successfully!');
        await refreshCart();
        navigate('/profile?tab=orders');
      }
    } catch (error: any) {
      const message =
        error?.message ||
        error?.error?.error ||
        error?.error?.message ||
        (Array.isArray(error?.error?.errors) ? error.error.errors.join(', ') : null) ||
        (error?.status === 401 ? 'Please log in again to place your order.' : null) ||
        'Failed to place order. Please try again.';

      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary-300" />
            <span className="text-xs font-bold tracking-wider uppercase text-primary-200">Secure Checkout</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">Checkout</h1>
          <p className="text-primary-100/80 mt-2 font-medium">Complete your purchase securely</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Step Indicator ── */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100'
                        : isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-bold ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-1 mx-3 rounded-full transition-all ${isCompleted ? 'bg-emerald-400' : 'bg-gray-200'
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Main Content ── */}
          <div className="lg:col-span-8">

            {/* Shipping */}
            {currentStep === 'shipping' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Truck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
                    <p className="text-xs text-gray-400">Where should we deliver your order?</p>
                  </div>
                </div>
                <form id="checkout-shipping-form" onSubmit={handleShippingSubmit} className="px-6 py-6 space-y-5">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      type="email" label="Email" placeholder="john@example.com"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      leftIcon={<Mail className="w-4 h-4" />} required
                    />
                    <Input
                      type="tel" label="Phone" placeholder="+91 98765 43210"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      leftIcon={<Phone className="w-4 h-4" />} required
                    />
                  </div>
                  <Input
                    label="Address" placeholder="123 Main Street, Apartment 4B"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    leftIcon={<Home className="w-4 h-4" />} required
                  />
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                        State
                      </label>
                      <select
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value, city: '' })}
                        required
                        className="w-full text-sm font-medium h-11 px-4 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm bg-white appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                      >
                        <option value="" disabled>Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                        City
                      </label>
                      <select
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        required
                        className="w-full text-sm font-medium h-11 px-4 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm bg-white appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                        disabled={!shippingInfo.state}
                      >
                        <option value="" disabled>Select City</option>
                        {shippingInfo.state === 'Maharashtra' && (
                          <>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Pune">Pune</option>
                            <option value="Nagpur">Nagpur</option>
                          </>
                        )}
                        {shippingInfo.state === 'Karnataka' && (
                          <>
                            <option value="Bengaluru">Bengaluru</option>
                            <option value="Mysuru">Mysuru</option>
                            <option value="Mangaluru">Mangaluru</option>
                          </>
                        )}
                        {shippingInfo.state === 'Tamil Nadu' && (
                          <>
                            <option value="Chennai">Chennai</option>
                            <option value="Coimbatore">Coimbatore</option>
                            <option value="Madurai">Madurai</option>
                          </>
                        )}
                        {shippingInfo.state === 'Kerala' && (
                          <>
                            <option value="Kochi">Kochi</option>
                            <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                            <option value="Kozhikode">Kozhikode</option>
                          </>
                        )}
                        {shippingInfo.state === 'Andhra Pradesh' && (
                          <>
                            <option value="Visakhapatnam">Visakhapatnam</option>
                            <option value="Vijayawada">Vijayawada</option>
                            <option value="Guntur">Guntur</option>
                          </>
                        )}
                        {shippingInfo.state === 'Telangana' && (
                          <>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Warangal">Warangal</option>
                            <option value="Nizamabad">Nizamabad</option>
                          </>
                        )}
                        {shippingInfo.state === 'Delhi' && (
                          <>
                            <option value="New Delhi">New Delhi</option>
                            <option value="North Delhi">North Delhi</option>
                            <option value="South Delhi">South Delhi</option>
                          </>
                        )}
                        {/* Fallback for Custom Cities if needed */}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <Input label="ZIP Code" placeholder="400001"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="lg:hidden">
                    {renderStepActions()}
                  </div>
                </form>
              </div>
            )}

            {/* Review */}
            {currentStep === 'review' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Review Your Order</h2>
                      <p className="text-xs text-gray-400">Verify details before placing your order</p>
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-5">
                    {/* Shipping */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-900">Shipping Address</h3>
                        <button onClick={() => setCurrentStep('shipping')}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">Edit</button>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm text-gray-600">
                        <p className="font-semibold text-gray-900">{shippingInfo.fullName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.email} · {shippingInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:hidden">
                  {renderStepActions()}
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-4 block mt-8 lg:mt-0">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Order Summary</h3>
                <p className="text-xs text-gray-400 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="px-6 py-4 space-y-3 max-h-52 overflow-y-auto border-b border-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.product_name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">₹{item.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 space-y-3 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold text-xs px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{shipping}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (GST 18%)</span>
                  <span className="font-semibold text-gray-900">₹{tax.toFixed(0)}</span>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">100% Secure Checkout</p>
                    <p className="text-xs text-emerald-600">SSL encrypted payment processing</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                {renderStepActions(true)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
