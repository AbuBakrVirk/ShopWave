import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const SHOP_LINKS = [
  { label: 'All Products', to: '/products' },
  { label: 'Electronics', to: '/products?category=Electronics' },
  { label: 'Fashion', to: '/products?category=Fashion' },
  { label: 'Gaming', to: '/products?category=Gaming' },
  { label: 'Home & Kitchen', to: '/products?category=Home+%26+Kitchen' },
];

const HELP_LINKS = [
  { label: 'Track Your Order', to: '/track-order' },
  { label: 'Returns & Refunds', to: '#' },
  { label: 'Shipping Info', to: '#' },
  { label: 'FAQs', to: '#' },
  { label: 'Contact Support', to: '#' },
];

const ACCOUNT_LINKS = [
  { label: 'Sign In', to: '/login' },
  { label: 'Create Account', to: '/register' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand — spans 2 cols on md */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white">Shop<span className="text-orange-500">Wave</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              Your go-to destination for quality products across electronics, fashion, gaming, and more — delivered fast.
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:support@shopwave.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                support@shopwave.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                +1 (555) 123-4567
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                123 Commerce St, New York, NY 10001
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Help</h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} ShopWave. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
