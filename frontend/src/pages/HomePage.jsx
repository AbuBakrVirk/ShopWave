/**
 * HomePage.jsx - Main landing page
 * Features: hero banner, categories, featured products, deals
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, RefreshCw, Headphones, ChevronRight } from 'lucide-react';
import axios from '../lib/axios';
import ProductCard from '../components/ui/ProductCard';
import { ProductSkeletonGrid } from '../components/ui/ProductSkeleton';

const categories = [
  { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Fashion', icon: '👗', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { name: 'Computers', icon: '💻', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Home & Kitchen', icon: '🏠', color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'Gaming', icon: '🎮', color: 'from-red-500 to-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  { name: 'Sports', icon: '⚽', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { name: 'Furniture', icon: '🛋️', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'text-blue-500' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected', color: 'text-green-500' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy', color: 'text-purple-500' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help', color: 'text-orange-500' },
];

const bannerSlides = [
  {
    title: 'Next-Gen Electronics',
    subtitle: 'Discover the latest smartphones, laptops & more',
    cta: 'Shop Electronics',
    category: 'Electronics',
    bg: 'from-slate-900 via-blue-900 to-slate-900',
    accent: 'text-blue-400',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600',
  },
  {
    title: 'Summer Fashion Sale',
    subtitle: 'Up to 50% off on trending styles',
    cta: 'Shop Fashion',
    category: 'Fashion',
    bg: 'from-rose-900 via-pink-900 to-rose-900',
    accent: 'text-pink-400',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
  },
  {
    title: 'Gaming Universe',
    subtitle: 'Level up your gaming setup today',
    cta: 'Shop Gaming',
    category: 'Gaming',
    bg: 'from-gray-900 via-purple-900 to-gray-900',
    accent: 'text-purple-400',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/products?featured=true&limit=8');
        setFeaturedProducts(res.data.products);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Auto-advance banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = bannerSlides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className={`relative bg-gradient-to-r ${slide.bg} text-white overflow-hidden transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 fade-in">
              <span className={`inline-block text-sm font-semibold ${slide.accent} uppercase tracking-widest mb-3`}>
                🔥 Hot Deals
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-md">
                {slide.subtitle}
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to={`/products?category=${encodeURIComponent(slide.category)}`}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-orange-500/30"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {slide.cta}
                </Link>
                <Link
                  to="/products"
                  className="flex items-center gap-2 px-6 py-3 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-full transition-all"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src={slide.image}
                alt="Banner"
                className="w-full max-w-sm rounded-2xl shadow-2xl object-cover aspect-video"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-orange-500' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Features Bar ────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Find exactly what you're looking for</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`${cat.bg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer group`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Handpicked top picks just for you</p>
          </div>
          <Link to="/products?featured=true" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductSkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Promo Banner ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">🎁 Special Offer</h2>
          <p className="text-orange-100 text-lg mb-6">Get 15% off your first order when you sign up today!</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-orange-600 font-bold rounded-full hover:bg-orange-50 transition-colors shadow-lg"
          >
            Sign Up Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
