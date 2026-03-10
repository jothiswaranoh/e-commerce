import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, TrendingUp, Shield,
  Truck, Mail, CheckCircle2, ChevronRight
} from 'lucide-react';
import { ROUTES } from '../config/routes.constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { HOME } from '../config/ui.config';
import CategoriesSection from './Home/CategorySession';
import FeaturedProductsSection from './Home/FeaturedProductsSession';

/* ─────────────────────────────────────────
   Feature strip data
───────────────────────────────────────── */
const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₹999',
    color: 'bg-indigo-50 text-indigo-500',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions',
    color: 'bg-emerald-50 text-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'Guaranteed low prices',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: Sparkles,
    title: 'Quality Products',
    description: 'Verified & authentic',
    color: 'bg-rose-50 text-rose-500',
  },
];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-7">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">
                New Arrivals Every Week
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              {HOME.hero.title}
              <span className="block text-indigo-300 mt-1">
                {/* subtitle slot — rendered from config */}
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
              {HOME.hero.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={ROUTES.PRODUCTS}>
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/40 hover:shadow-indigo-900/60 hover:-translate-y-0.5">
                  {HOME.hero.primaryCTA}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/15 transition-all backdrop-blur-sm">
                  {HOME.hero.secondaryCTA}
                  <ChevronRight className="w-4 h-4 text-white/60" />
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-2">
                {['bg-indigo-400', 'bg-violet-400', 'bg-pink-400', 'bg-amber-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-slate-900`} />
                ))}
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-white font-semibold">2,400+</span> happy customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURE STRIP
      ══════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-6 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES + FEATURED (unchanged logic)
      ══════════════════════════════════════ */}
      <CategoriesSection />
      <FeaturedProductsSection />

      {/* ══════════════════════════════════════
          PROMOTIONAL BANNER
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-5">
              Limited Time
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              {HOME.sections.promotion.title}
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              {HOME.sections.promotion.subtitle}
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/40 hover:-translate-y-0.5">
                {HOME.sections.promotion.primaryCTA}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6 text-indigo-500" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              {HOME.sections.newsletter.title}
            </h2>
            <p className="text-gray-400 mb-8">
              {HOME.sections.newsletter.subtitle}
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                You're subscribed! We'll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder={HOME.sections.newsletter.description ?? 'Enter your email…'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300 transition-colors"
                />
                <button
                  type="submit"
                  className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200 flex-shrink-0"
                >
                  {HOME.sections.newsletter.primaryCTA}
                </button>
              </form>
            )}

            {/* Trust note */}
            <p className="mt-4 text-xs text-gray-400">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}