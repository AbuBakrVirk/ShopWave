import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingCart, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'At least 6 characters';
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(form.email, form.password);
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
        navigate(user.role === 'admin' ? '/admin' : '/');
      } else {
        const user = await register(form.name, form.email, form.password);
        toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}.`);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">

      {/* Left panel — decorative, hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-700 flex-col justify-between p-12 text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold">ShopWave</span>
        </Link>

        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Shop smarter,<br />not harder.
          </h2>
          <p className="text-orange-100 text-base leading-relaxed max-w-sm">
            Thousands of products, competitive prices, and fast delivery — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: '50K+', label: 'Happy customers' },
              { value: '10K+', label: 'Products' },
              { value: '99%',  label: 'Satisfaction' },
              { value: '2-Day', label: 'Delivery' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-orange-200 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-orange-200 text-sm">© {new Date().getFullYear()} ShopWave</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-sm w-full mx-auto">

          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to store
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Shop<span className="text-orange-500">Wave</span></span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {isLogin ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-400 mb-7">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={switchMode} className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Demo hint */}
          {isLogin && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-lg px-4 py-3 mb-6 text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
              <p><strong>Admin:</strong> admin@shopwave.com / admin123</p>
              <p><strong>User:</strong> john@example.com / user123</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors ${
                      errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors ${
                    errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors ${
                    errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-orange-400'
                  }`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : isLogin ? 'Sign in' : 'Create account'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
