import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Package, Shield, Sparkles, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '../../config/routes.constants';
import { UI_CONFIG } from '../../config/ui.config';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const { auth, brand, messages, images } = UI_CONFIG;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.HOME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success(messages.success.loginSuccess);

        // Redirect based on user role
        const userResult = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('shophub_auth_token')}`
          }
        }).then(res => res.json());

        if (userResult.user?.role === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        } else {
          navigate(from === ROUTES.LOGIN ? ROUTES.HOME : from, { replace: true });
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(messages.error.genericError);
    }
  };

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
            <span className="text-2xl font-bold gradient-text">{brand.name}</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">{auth.login.title}</h1>
            <p className="text-neutral-600">{auth.login.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label={auth.register.fields.email.label}
              placeholder={auth.register.fields.email.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <div>
             <Input
  type={showPassword ? 'text' : 'password'}
  label={auth.register.fields.password.label}
  placeholder={auth.register.fields.password.placeholder}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  leftIcon={<Lock className="w-5 h-5" />}
  rightIcon={
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="focus:outline-none"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5 text-neutral-500 hover:text-neutral-700" />
      ) : (
        <Eye className="w-5 h-5 text-neutral-500 hover:text-neutral-700" />
      )}
    </button>
  }
  required
/>

</div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-neutral-600">{auth.login.rememberMe}</span>
              </label>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              {auth.login.submitButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-50 text-neutral-500">{auth.login.orContinueWith}</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-white hover:border-neutral-300 transition-all bg-white/50">
              <img src={images.socialIcons.google} alt="Google" className="w-5 h-5" />
              <span className="font-medium text-neutral-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-white hover:border-neutral-300 transition-all bg-white/50">
              <img src={images.socialIcons.github} alt="GitHub" className="w-5 h-5" />
              <span className="font-medium text-neutral-700">GitHub</span>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-neutral-600">
            {auth.login.noAccount}{' '}
            <Link to={ROUTES.REGISTER} className="font-semibold text-primary-600 hover:text-primary-700">
              {auth.login.createAccount}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-accent-600 relative overflow-hidden">
        <div className={`absolute inset-0 bg-[url('${images.auth.loginBackground}')] bg-cover bg-center opacity-20 mix-blend-overlay`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              {auth.login.hero.title}
            </h2>
            <p className="text-xl text-white/90 max-w-lg leading-relaxed">
              {auth.login.hero.subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {auth.login.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  {feature.icon === 'Shield' && <Shield className="w-6 h-6" />}
                  {feature.icon === 'Package' && <Package className="w-6 h-6" />}
                  {feature.icon === 'Sparkles' && <Sparkles className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
