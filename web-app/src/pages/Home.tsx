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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#050816_0%,#0d1430_34%,#171d45_68%,#090d1d_100%)] text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(79,70,229,0.22),transparent_0,transparent_28%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,0.16),transparent_0,transparent_24%),radial-gradient(circle_at_72%_72%,rgba(59,130,246,0.12),transparent_0,transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%,transparent_78%,rgba(255,255,255,0.03))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute -left-16 top-20 h-64 w-64 rounded-full border border-white/6 bg-white/[0.03] blur-2xl" />
        <div className="pointer-events-none absolute right-12 top-16 h-40 w-40 rounded-full border border-white/6 bg-white/[0.04] blur-2xl" />
        <div className="pointer-events-none absolute right-[8%] top-[18%] hidden h-[420px] w-[420px] rounded-full border border-white/6 bg-[radial-gradient(circle,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_42%,transparent_68%)] lg:block" />
        <div className="pointer-events-none absolute right-[14%] top-[26%] hidden h-[280px] w-[280px] rounded-full border border-white/8 lg:block" />
        <div className="pointer-events-none absolute right-[4%] top-[42%] hidden h-40 w-40 rounded-[32px] rotate-12 border border-white/8 bg-white/[0.03] shadow-[0_0_80px_rgba(255,255,255,0.04)] backdrop-blur-sm lg:block" />
        <div className="pointer-events-none absolute right-[18%] top-[58%] hidden h-24 w-24 rounded-full bg-gradient-to-br from-primary-400/25 to-accent-400/10 blur-xl lg:block" />
        <div className="pointer-events-none absolute bottom-[14%] right-[10%] hidden h-px w-[320px] bg-gradient-to-r from-transparent via-white/20 to-transparent lg:block" />
        <div className="pointer-events-none absolute right-[10%] top-[20%] hidden lg:block">
          <div className="rounded-[28px] border border-white/8 bg-white/[0.04] px-5 py-4 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Shopping</p>
            <p className="mt-2 text-lg font-semibold text-white/90">Discover standout pieces.</p>
            <p className="mt-1 text-sm text-slate-400">Curated collections for smarter shopping.</p>
          </div>
        </div>

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-18 lg:py-20">
          <div className="max-w-2xl">
            <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">
                New Arrivals Every Week
              </span>
            </div>

            {/* Heading */}
            <h1 className="mb-5 text-4xl font-bold leading-[0.98] tracking-[-0.05em] md:text-5xl lg:text-6xl">
              {HOME.hero.title}
              <span className="mt-2 block bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Modern essentials, elevated.
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
              {HOME.hero.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={ROUTES.PRODUCTS}>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-sm font-bold text-white transition-all shadow-[0_20px_40px_rgba(79,70,229,0.32)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgba(79,70,229,0.4)]">
                  {HOME.hero.primaryCTA}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-white/14 bg-white/7 px-7 py-3.5 text-sm font-semibold text-white transition-all backdrop-blur-md hover:bg-white/12">
                  {HOME.hero.secondaryCTA}
                  <ChevronRight className="w-4 h-4 text-white/60" />
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-5">
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
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <FeaturedProductsSection />

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