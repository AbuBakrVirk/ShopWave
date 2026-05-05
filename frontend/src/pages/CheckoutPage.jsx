/**
 * CheckoutPage.jsx - Order checkout form
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import axios from '../lib/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: '📱' },
  { id: 'jazzcash', label: 'JazzCash', icon: '📲' },
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          zipCode: form.zipCode,
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: orderTotal,
        paymentMethod: PAYMENT_METHODS.find(p => p.id === form.paymentMethod)?.label || 'Cash on Delivery',
      };

      const res = await axios.post('/api/orders', orderData);

      // Save order to localStorage so it appears on the Orders page
      const savedOrders = JSON.parse(localStorage.getItem('shopwave_my_orders') || '[]');
      savedOrders.unshift(res.data.order);
      localStorage.setItem('shopwave_my_orders', JSON.stringify(savedOrders));

      clearCart();
      navigate(`/order-confirmation/${res.data.order.orderNumber}`, {
        state: { order: res.data.order }
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">Your cart is empty</h2>
          <Link to="/products" className="text-orange-500 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/cart" className="hover:text-orange-500">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">Checkout</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none transition-colors ${
                        errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-orange-400'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none transition-colors ${
                        errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-orange-400'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-orange-400'
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apt 4B"
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none transition-colors ${
                        errors.address ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-orange-400'
                      }`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none transition-colors ${
                        errors.city ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-orange-400'
                      }`}
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>

                  {/* ZIP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:border-orange-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        form.paymentMethod === method.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={form.paymentMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => e.target.src = 'https://placehold.co/50x50/f97316/white?text=IMG'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Tax</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span>Total</span><span className="text-xl">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order · ${orderTotal.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secured by SSL encryption
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
