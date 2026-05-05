/**
 * CartPage.jsx - Shopping cart with quantity management
 */

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
          >
            <ShoppingBag className="w-5 h-5" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Shopping Cart <span className="text-gray-400 font-normal text-lg">({cartItems.length} items)</span>
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex gap-4 fade-in"
              >
                {/* Product image */}
                <Link to={`/products/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/100x100/f97316/white?text=IMG`;
                    }}
                  />
                </Link>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <span className="text-xs text-orange-500 font-medium">{item.category}</span>
                      <Link to={`/products/${item.id}`}>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-orange-500 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>

                    {/* Item total */}
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-xl">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="flex gap-2 mb-6">
                <div className="flex-1 flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 text-sm outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400"
                  />
                </div>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Apply
                </button>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
