import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones,
  Star, ChevronRight, Zap, TrendingUp, Award, Users
} from 'lucide-react';
import axios from '../lib/axios';
import ProductCard from '../components/ui/ProductCard';
import { ProductSkeletonGrid } from '../components/ui/ProductSkeleton';

/* ── Static data ─────────────────────────────────────── */
const HERO_SLIDES = [
  {
    eyebrow: 'New Arrivals 2025',
    heading: 'The Latest\nTech Is Here',
    sub: 'Explore our newest collection of smartphones, laptops, and accessories — all at competitive prices.',
    cta: 'Shop Electronics',
    link: '/products?category=Electronics',
    bg: 'from-slate-950 to-blue-950',
    accent: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=700&q=80',
  },
  {
    eyebrow: 'Summer Collection',
    heading: 'Style That\nSpeaks Loud',
    sub: 'Refresh your wardrobe with trending fashion pieces. Up to 40% off on selected styles.',
    cta: 'Browse Fashion',
    link: '/products?category=Fashion',
    bg: 'from-rose-950 to-pink-950',
    accent: '#f43f5e',
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&q=80',
  },
  {
    eyebrow: 'Level Up',
    heading: 'Built for\nGamers',
    sub: 'Consoles, accessories, and peripherals for every type of gamer. Free shipping on all orders.',
    cta: 'Shop Gaming',
    link: '/products?category=Gaming',
    bg: 'from-violet-950 to-purple-950',
    accent: '#8b5cf6',
    img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=700&q=80',
  },
];

const CATEGORIES = [
  { name: 'Electronics',    emoji: '📱', color: 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/70',   text: 'text-blue-600 dark:text-blue-400' },
  { name: 'Fashion',        emoji: '👗', color: 'bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-950/70',   text: 'text-pink-600 dark:text-pink-400' },
  { name: 'Computers',      emoji: '💻', color: 'bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/70', text: 'text-indigo-600 dark:text-indigo-400' },
  { name: 'Home & Kitchen', emoji: '🏠', color: 'bg-green-50 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-950/70', text: 'text-green-600 dark:text-green-400' },
  { name: 'Gaming',         emoji: '🎮', color: 'bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70',     text: 'text-red-600 dark:text-red-400' },
  { name: 'Sports',         emoji: '⚽', color: 'bg-yellow-50 dark:bg-yellow-950/40 hover:bg-yellow-100 dark:hover:bg-yellow-950/70', text: 'text-yellow-600 dark:text-yellow-400' },
  { name: 'Furniture',      emoji: '🛋️', color: 'bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-950/70', text: 'text-orange-600 dark:text-orange-400' },
];

const FEATURES = [
  { icon: Truck,       title: 'Free Delivery',    desc: 'On all orders above $50',    color: 'text-blue-500' },
  { icon: ShieldCheck, title: 'Secure Payments',  desc: '100% protected checkout',    color: 'text-green-500' },
  { icon: RefreshCw,   title: '30-Day Returns',   desc: 'Hassle-free return policy',  color: 'text-purple-500' },
  { icon: Headphones,  title: '24/7 Support',     desc: 'We\'re always here to help', color: 'text-orange-500' },
];

const STATS = [
  { icon: Users,     value: '50K+',  label: 'Happy Customers' },
  { icon: Award,     value: '10K+',  label: 'Products Listed' },
  { icon: TrendingUp,value: '99%',   label: 'Satisfaction Rate' },
  { icon: Zap,       value: '2-Day', label: 'Fast Delivery' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Verified Buyer',
    avatar: 'S',
    rating: 5,
    text: 'Ordered a laptop and it arrived in perfect condition. The packaging was great and delivery was faster than expected. Will definitely shop here again.',
  },
  {
    name: 'James K.',
    role: 'Verified Buyer',
    avatar: 'J',
    rating: 5,
    text: 'Great selection of products and the prices are very competitive. Customer support helped me quickly when I had a question about my order.',
  },
  {
    name: 'Priya R.',
    role: 'Verified Buyer',
    avatar: 'P',
    rating: 4,
    text: 'Love the variety here. Found exactly what I was looking for at a better price than other stores. The checkout process was smooth and easy.',
  },
];

/* ── Component ───────────────────────────────────────── */
export default function LandingPage() {
  const [slide, setSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    axios.get('/api/products?featured=true&limit=8')
      .then(r => setFeatured(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className={`relative bg-gradient-to-br ${current.bg} overflow-hidden`}>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div key={slide} className="fade-up">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full border"
                style={{ color: current.accent, borderColor: current.accent + '40', background: current.accent + '15' }}>
                {current.eyebrow}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 whitespace-pre-line">
                {current.heading}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                {current.sub}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={current.link}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ background: current.accent }}>
                  {current.cta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white border border-white/20 hover:bg-white/10 transition-all">
                  View All Products
                </Link>
              </div>
            </div>

            {/* Image */}
            <div key={`img-${slide}`} className="hidden md:flex justify-center fade-in">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-3xl opacity-20"
                  style={{ background: current.accent }} />
                <img
                  src={current.img}
                  alt="Hero"
                  className="relative w-full max-w-md rounded-2xl object-cover aspect-video shadow-2xl"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES BAR
      ══════════════════════════════════════════════════ */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Browse</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors">
            All categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`${cat.color} rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer`}
            >
              <span className="text-2xl sm:text-3xl">{cat.emoji}</span>
              <span className={`text-xs font-medium text-center leading-tight ${cat.text}`}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════ */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ProductSkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold text-sm rounded-lg transition-all duration-200">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROMO BANNER
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Banner 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-white/5 rounded-full" />
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Limited Time</p>
            <h3 className="text-2xl font-bold mb-2">Up to 30% off<br />Electronics</h3>
            <p className="text-blue-200 text-sm mb-5">Grab the best deals on phones, laptops, and more before they're gone.</p>
            <Link to="/products?category=Electronics"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 text-white">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-white/5 rounded-full" />
            <p className="text-orange-200 text-xs font-semibold uppercase tracking-widest mb-2">New Members</p>
            <h3 className="text-2xl font-bold mb-2">Get 15% off<br />Your First Order</h3>
            <p className="text-orange-200 text-sm mb-5">Create a free account and use code WELCOME15 at checkout.</p>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 font-semibold text-sm rounded-lg hover:bg-orange-50 transition-colors">
              Sign Up Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════ */}
      <section className="bg-gray-900 dark:bg-gray-950 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
                <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Reviews</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className={`w-4 h-4 ${s < t.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200 dark:text-gray-700'}`} />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════ */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Stay Updated</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Get Deals in Your Inbox
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and more.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('Thanks for subscribing!'); }}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:border-orange-400 transition-colors"
            />
            <button type="submit"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>

    </div>
  );
}
