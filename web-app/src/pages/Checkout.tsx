import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Truck, MapPin, User, Mail, Phone, Home,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles
} from 'lucide-react';
import { ROUTES } from '../config/routes.constants';
import Input from '../components/ui/Input';

type CheckoutStep = 'shipping' | 'review';

const INDIA_STATE_CITY_OPTIONS: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Other'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Tawang', 'Pasighat', 'Other'],
  Assam: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Other'],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Other'],
  Chhattisgarh: ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Other'],
  Goa: ['Panaji', 'Margao', 'Mapusa', 'Vasco da Gama', 'Other'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Other'],
  Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Other'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Other'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Other'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Other'],
  Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Other'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Other'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Other'],
  Manipur: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Other'],
  Meghalaya: ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Other'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Other'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Other'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Other'],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Other'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Other'],
  Sikkim: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Other'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Other'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Other'],
  Tripura: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Other'],
  'Uttar Pradesh': ['Lucknow', 'Noida', 'Kanpur', 'Varanasi', 'Other'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Haldwani', 'Roorkee', 'Other'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Other'],
  'Andaman and Nicobar Islands': ['Port Blair', 'Other'],
  Chandigarh: ['Chandigarh', 'Other'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa', 'Other'],
  Delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka', 'Other'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Other'],
  Ladakh: ['Leh', 'Kargil', 'Other'],
  Lakshadweep: ['Kavaratti', 'Other'],
  Puducherry: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Other'],
};

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
  const stateOptions = Object.keys(INDIA_STATE_CITY_OPTIONS);
  const cityOptions = shippingInfo.state ? INDIA_STATE_CITY_OPTIONS[shippingInfo.state] ?? [] : [];

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

    const normalizedZipCode = shippingInfo.zipCode.replace(/\D/g, '');
    if (normalizedZipCode.length !== 6) {
      toast.error('ZIP Code must be exactly 6 digits.');
      return;
    }

    if (normalizedZipCode !== shippingInfo.zipCode) {
      setShippingInfo((current) => ({
        ...current,
        zipCode: normalizedZipCode,
      }));
    }

    setCurrentStep('review');
  };

  const handleStateChange = (state: string) => {
    setShippingInfo((current) => ({
      ...current,
      state,
      city: '',
    }));
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
                    placeholder="Name"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      type="email" label="Email" placeholder="Email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      leftIcon={<Mail className="w-4 h-4" />} required
                    />
                    <Input
                      type="tel" label="Phone"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      leftIcon={<Phone className="w-4 h-4" />} required
                    />
                  </div>
                  <Input
                    label="Address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    leftIcon={<Home className="w-4 h-4" />} required
                  />
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="shipping-state">
                        State
                      </label>
                      <div className="relative">
                        <select
                          id="shipping-state"
                          value={shippingInfo.state}
                          onChange={(e) => handleStateChange(e.target.value)}
                          required
                          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select State</option>
                          {stateOptions.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="shipping-city">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <select
                          id="shipping-city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          required
                          disabled={!shippingInfo.state}
                          className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-12 pr-4 text-neutral-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
                        >
                          <option value="">{shippingInfo.state ? 'Select City' : 'Select State First'}</option>
                          {cityOptions.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Input label="ZIP Code" placeholder="400001"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({
                        ...shippingInfo,
                        zipCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                      })}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
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
