import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Package, Shield, Sparkles, Phone, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../config/routes.constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validators';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (response.success) {
        setIsSuccess(true);
        toast.success('Account created successfully!');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Account Created!</h2>
          <p className="text-neutral-600 mb-8">
            We've sent a verification link to <span className="font-medium text-neutral-900">{formData.email}</span>.
            Please verify your email to access all features.
          </p>
          <div className="space-y-4">
            <Link to={ROUTES.HOME}>
              <Button fullWidth>
                Go to Homepage
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" fullWidth>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ShopHub</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">Create Account</h1>
            <p className="text-neutral-600">Join us to start your shopping journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type="tel"
              label="Phone Number (Optional)"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone className="w-5 h-5" />}
            />

            <div className="space-y-4">
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                leftIcon={<Lock className="w-5 h-5" />}
                required
              />
              <PasswordStrengthIndicator password={formData.password} showRequirements={false} />
            </div>

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex items-start gap-2">
              <input type="checkbox" className="w-4 h-4 mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" required />
              <span className="text-sm text-neutral-600">
                I agree to the <Link to="#" className="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</Link> and <Link to="#" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</Link>
              </span>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-50 text-neutral-500">Or sign up with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-white hover:border-neutral-300 transition-all bg-white/50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="font-medium text-neutral-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-white hover:border-neutral-300 transition-all bg-white/50">
              <img src="https://www.svgrepo.com/show/448224/github.svg" alt="GitHub" className="w-5 h-5" />
              <span className="font-medium text-neutral-700">GitHub</span>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-neutral-600">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Join the Community
            </h2>
            <p className="text-xl text-white/90 max-w-lg leading-relaxed">
              Create an account to unlock exclusive deals, track orders, and personalized recommendations.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Member Benefits</h3>
                <p className="text-white/80">Early access to sales and exclusive member-only discounts</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Order Tracking</h3>
                <p className="text-white/80">Real-time updates on your delivery status</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Wishlist</h3>
                <p className="text-white/80">Save your favorite items and get notified when they drop in price</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
