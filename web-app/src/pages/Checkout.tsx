import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CreditCard, Truck, MapPin, User, Mail, Phone, Home,
  CheckCircle2, ArrowRight, ArrowLeft, Lock, Sparkles
} from 'lucide-react';
import { ROUTES } from '../config/routes.constants';
import Input from '../components/ui/Input';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '', cardName: '', expiryDate: '', cvv: '',
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  const steps = [
    { id: 'shipping' as CheckoutStep, label: 'Shipping', icon: Truck },
    { id: 'payment' as CheckoutStep, label: 'Payment', icon: CreditCard },
    { id: 'review' as CheckoutStep, label: 'Review', icon: CheckCircle2 },
  ];

  const { items, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
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
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">Secure Checkout</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Checkout</h1>
          <p className="text-slate-400 mt-2">Complete your purchase securely</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2">

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
                <form onSubmit={handleShippingSubmit} className="px-6 py-6 space-y-5">
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
                    <Input label="City" placeholder="Mumbai"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      leftIcon={<MapPin className="w-4 h-4" />} required
                    />
                    <Input label="State" placeholder="Maharashtra"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      required
                    />
                    <Input label="ZIP Code" placeholder="400001"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-between pt-2">
                    <Link to={ROUTES.CART}>
                      <button type="button" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                      </button>
                    </Link>
                    <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200">
                      Continue to Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment */}
            {currentStep === 'payment' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
                    <p className="text-xs text-gray-400">Enter your payment information</p>
                  </div>
                </div>
                <form onSubmit={handlePaymentSubmit} className="px-6 py-6 space-y-5">
                  <Input
                    label="Card Number" placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                    leftIcon={<CreditCard className="w-4 h-4" />} required
                  />
                  <Input
                    label="Cardholder Name" placeholder="John Doe"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                    required
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Expiry Date" placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                      required
                    />
                    <Input
                      label="CVV" placeholder="123" type="password" maxLength={3}
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                      leftIcon={<Lock className="w-4 h-4" />} required
                    />
                  </div>
                  {/* Secure note */}
                  <div className="flex items-start gap-3 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <Lock className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-indigo-900">Secure Payment</p>
                      <p className="text-xs text-indigo-600">Your payment is encrypted and secure. We never store your card details.</p>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setCurrentStep('shipping')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200">
                      Review Order <ArrowRight className="w-4 h-4" />
                    </button>
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

                    {/* Payment */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-900">Payment Method</h3>
                        <button onClick={() => setCurrentStep('payment')}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">Edit</button>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}
                          </p>
                          <p className="text-xs text-gray-500">{paymentInfo.cardName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setCurrentStep('payment')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
