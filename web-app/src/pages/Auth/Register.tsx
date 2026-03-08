import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Package, Shield, Sparkles, Phone } from 'lucide-react';
import { ROUTES } from '../../config/routes.constants';
import { UI_CONFIG } from '../../config/ui.config';
import Input from '../../components/ui/Input';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validators';

const { auth, brand, messages, images } = UI_CONFIG;

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error(messages.validation.invalidEmail);
      return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error(messages.validation.invalidPhone);
      return;
    }
    if (!validatePassword(formData.password)) {
      toast.error(messages.validation.passwordTooShort);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(messages.validation.passwordsDoNotMatch);
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
        toast.success(messages.success.registerSuccess);
        navigate(ROUTES.HOME, { replace: true });
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error(messages.error.genericError);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── LEFT: Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">{brand.name}</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-1.5">
              {auth.register.title}
            </h1>
            <p className="text-gray-400 text-sm">{auth.register.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={auth.register.fields.fullName.label}
              placeholder={auth.register.fields.fullName.placeholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              leftIcon={<User className="w-4 h-4" />}
              required
            />
            <Input
              type="email"
              label={auth.register.fields.email.label}
              placeholder={auth.register.fields.email.placeholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              type="tel"
              label={auth.register.fields.phone.label}
              placeholder={auth.register.fields.phone.placeholder}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <div className="space-y-3">
              <Input
                type="password"
                label={auth.register.fields.password.label}
                placeholder={auth.register.fields.password.placeholder}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <PasswordStrengthIndicator password={formData.password} showRequirements={false} />
            </div>
            <Input
              type="password"
              label={auth.register.fields.confirmPassword.label}
              placeholder={auth.register.fields.confirmPassword.placeholder}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                required
              />
              <span className="text-sm text-gray-500">
                I agree to the{' '}
                <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 flex items-center justify-center gap-2
                         bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold
                         rounded-xl transition-all shadow-sm shadow-indigo-200
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <>
                  {auth.register.submitButton}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gray-50 text-gray-400 font-medium">{auth.register.orSignUpWith}</span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700">
              <img src={images.socialIcons.google} alt="Google" className="w-4 h-4" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700">
              <img src={images.socialIcons.github} alt="GitHub" className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            {auth.register.haveAccount}{' '}
            <Link to={ROUTES.LOGIN} className="font-bold text-indigo-600 hover:text-indigo-700">
              {auth.register.signIn}
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Branding panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-14 text-white">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
            <Sparkles className="w-7 h-7 text-indigo-300" />
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-5">
            Join the Community
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm">
            Create an account to unlock exclusive deals, track orders, and get personalised recommendations.
          </p>

          <div className="space-y-5">
            {[
              { icon: <Shield className="w-5 h-5 text-indigo-300" />, title: 'Member Benefits', desc: 'Early access to sales and exclusive member-only discounts' },
              { icon: <Package className="w-5 h-5 text-indigo-300" />, title: 'Order Tracking', desc: 'Real-time updates on your delivery status' },
              { icon: <Sparkles className="w-5 h-5 text-indigo-300" />, title: 'Wishlist', desc: 'Save favourites and get notified when prices drop' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5">{f.title}</h3>
                  <p className="text-slate-400 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
