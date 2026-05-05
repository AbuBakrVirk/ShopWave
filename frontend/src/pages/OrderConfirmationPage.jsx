/**
 * OrderConfirmationPage.jsx - Success page after order placement
 */

import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">

        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Order Number</p>
              <p className="text-lg font-bold text-orange-500">{orderNumber}</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full capitalize">
              {order?.status || 'Pending'}
            </span>
          </div>

          {order && (
            <>
              {/* Customer info */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Delivery To</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{order.customer?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer?.address}, {order.customer?.city}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer?.phone}</p>
              </div>

              {/* Items */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Items Ordered</p>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300 line-clamp-1 flex-1">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium ml-4">
                        ${item.subtotal?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between">
                <span className="font-bold text-gray-900 dark:text-white">Total Paid</span>
                <span className="font-bold text-xl text-orange-500">${order.totalAmount?.toFixed(2)}</span>
              </div>

              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Payment: {order.paymentMethod}
              </div>
            </>
          )}
        </div>

        {/* Order tracking steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Order Status</p>
          <div className="flex items-center justify-between">
            {[
              { icon: CheckCircle, label: 'Confirmed', done: true },
              { icon: Package, label: 'Processing', done: false },
              { icon: Truck, label: 'Shipped', done: false },
              { icon: Home, label: 'Delivered', done: false },
            ].map(({ icon: Icon, label, done }, i, arr) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    done ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs mt-1 ${done ? 'text-green-500 font-medium' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 ${done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/products"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
          >
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
