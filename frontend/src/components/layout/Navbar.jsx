import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Heart, Search, Sun, Moon, Menu, X,
  User, LogOut, LayoutDashboard, Package, ChevronDown, Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Electronics', to: '/products?category=Electronics' },
  { label: 'Fashion', to: '/products?category=Fashion' },
  { label: 'Gaming', to: '/products?category=Gaming' },
  { label: 'Kitchen', to: '/products?category=Home+%26+Kitchen' },
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const userRef = useRef(null);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-gray-950 transition-all duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-100 dark:border-gray-800'}`}>

      {/* Promo strip */}
      <div className="bg-gray-900 dark:bg-gray-800 text-gray-300 text-center text-xs py-2 px-4 hidden sm:block">
        <span className="inline-flex items-center gap-2">
          <Truck className="w-3 h-3" />
          Free shipping on orders over $50 &nbsp;·&nbsp; Use code <span className="text-orange-400 font-semibold">WAVE10</span> for 10% off
        </span>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
            <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Shop<span className="text-orange-500">Wave</span>
          </span>
        </Link>

        {/* Search — desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="flex w-full h-10 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 dark:focus-within:ring-orange-900/30 transition-all bg-gray-50 dark:bg-gray-900">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 text-sm bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button type="submit" className="px-4 text-gray-400 hover:text-orange-500 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {wishlist.length > 9 ? '9+' : wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-20 truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1.5 scale-in">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-gray-400" /> Admin Panel
                    </Link>
                  )}
                  <Link to="/orders" onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Package className="w-4 h-4 text-gray-400" /> My Orders
                  </Link>
                  <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"
              className="hidden sm:flex items-center gap-1.5 px-4 h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
              <User className="w-4 h-4" /> Sign in
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Category nav — desktop */}
      <nav className="hidden md:block border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 h-10">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors whitespace-nowrap ${
                location.pathname === link.to || (link.to !== '/' && location.pathname + location.search === link.to)
                  ? 'text-orange-500 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-4 fade-in">
          <form onSubmit={handleSearch} className="flex h-10 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden focus-within:border-orange-400 bg-gray-50 dark:bg-gray-900">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 text-sm bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
            <button type="submit" className="px-4 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-1">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {!user && (
            <Link to="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg">
              <User className="w-4 h-4" /> Sign in to your account
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
