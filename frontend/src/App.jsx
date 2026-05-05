/**
 * App.jsx - Main application with routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

// Main layout wrapper (with navbar + footer)
function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '12px',
                    background: '#1f2937',
                    color: '#fff',
                    fontSize: '14px',
                  },
                  success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
                }}
              />

              <Routes>
                {/* Public routes with main layout */}
                <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
                <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
                <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
                <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
                <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
                <Route path="/order-confirmation/:orderNumber" element={<MainLayout><OrderConfirmationPage /></MainLayout>} />
                <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
                <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
                <Route path="/login" element={<LoginPage mode="login" />} />
                <Route path="/register" element={<LoginPage mode="register" />} />

                {/* Admin routes (own layout, no footer) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={
                  <MainLayout>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-extrabold text-orange-500 mb-4">404</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
                        <a href="/" className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
                          Go Home
                        </a>
                      </div>
                    </div>
                  </MainLayout>
                } />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
