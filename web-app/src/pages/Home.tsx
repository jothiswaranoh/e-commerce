import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Shield, Truck } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Product } from '../types';
import { ROUTES } from '../config/routes.constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { HOME } from '../config/ui.config';
import CategoriesSection from './Home/CategorySession';
import FeaturedProductsSection from './Home/FeaturedProductsSession';


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getAllProducts();
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₹999',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Guaranteed low prices',
    },
    {
      icon: Sparkles,
      title: 'Quality Products',
      description: 'Verified & authentic',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">New Arrivals Every Week</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {HOME.hero.title}
              <span className="block bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
                
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {HOME.hero.tagline}

            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  {HOME.hero.primaryCTA}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white/10">
                {HOME.hero.secondaryCTA}
              </Button>
            </div>
          </div>
        </div>
      </section>

     {/* Features */}
      <section className="bg-white py-12 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                {/* Icon */}
                <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {feature.description}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>


      <CategoriesSection />
      <FeaturedProductsSection />


      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-accent-600 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {HOME.sections.promotion.title}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {HOME.sections.promotion.subtitle}
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                {HOME.sections.promotion.primaryCTA}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{HOME.sections.newsletter.title}</h2>
          <p className="text-lg text-neutral-300 mb-8">
            {HOME.sections.newsletter.subtitle}
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={HOME.sections.newsletter.description}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button type="submit" size="sm" variant="primary">
              {HOME.sections.newsletter.primaryCTA}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

