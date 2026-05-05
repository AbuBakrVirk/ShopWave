import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  pending:    'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  confirmed:  'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  processing: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  shipped:    'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  delivered:  'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  cancelled:  'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [trackInput, setTrackInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    // If logged in as admin, fetch all orders; otherwise show guest tracking only
    if (user?.role === 'admin') {
      axios.get('/api/orders')
        .then(r => setOrders(r.data.orders))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    } else {
      // Regular users: load orders from localStorage (placed during this session)
      const saved = localStorage.getItem('shopwave_my_orders');
      setOrders(saved ? JSON.parse(saved) : []);
      setLoading(false);
    }
  }, [user]);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setTracking(true);
    setTrackError('');
    setTrackedOrder(null);
    try {
      const res = await axios.get(`/api/orders/track/${trackInput.trim().toUpperCase()}`);
      setTrackedOrder(res.data.order);
    } catch {
      setTrackError('No order found with that number. Please check and try again.');
    } finally {
      setTracking(false);
    }
  };

  const filtered = orders.filter(o =>
    !search ||
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stepIndex = (status) => STEPS.indexOf(status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage your orders</p>
        </div>

        {/* ── Order Tracker ─────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Track an Order</h2>
          <p className="text-sm text-gray-400 mb-4">Enter your order number (e.g. SW-1234567890)</p>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder="SW-1234567890"
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors"
            />
            <button
              type="submit"
              disabled={tracking}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {tracking
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Search className="w-4 h-4" />
              }
              Track
            </button>
          </form>

          {trackError && (
            <p className="text-sm text-red-500 mt-3">{trackError}</p>
          )}

          {/* Tracked order result */}
          {trackedOrder && (
            <div className="mt-5 border border-gray-100 dark:border-gray-800 rounded-xl p-5 fade-up">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Order</p>
                  <p className="font-bold text-orange-500">{trackedOrder.orderNumber}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[trackedOrder.status] || STATUS_STYLES.pending}`}>
                  {trackedOrder.status}
                </span>
              </div>

              {/* Progress bar */}
              {trackedOrder.status !== 'cancelled' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
                          i <= stepIndex(trackedOrder.status)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}>
                          {i < stepIndex(trackedOrder.status) ? '✓' : i + 1}
                        </div>
                        <span className={`text-[10px] capitalize text-center ${
                          i <= stepIndex(trackedOrder.status) ? 'text-orange-500 font-medium' : 'text-gray-400'
                        }`}>{step}</span>
                      </div>
                    ))}
                  </div>
                  {/* Connector line */}
                  <div className="relative h-1 bg-gray-100 dark:bg-gray-800 rounded-full -mt-8 mx-3.5 z-0">
                    <div
                      className="absolute h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, (stepIndex(trackedOrder.status) / (STEPS.length - 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                <div>
                  <p className="text-xs text-gray-400">Customer</p>
                  <p className="font-medium text-gray-900 dark:text-white">{trackedOrder.customer?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-gray-900 dark:text-white">${trackedOrder.totalAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment</p>
                  <p className="text-gray-700 dark:text-gray-300">{trackedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Placed on</p>
                  <p className="text-gray-700 dark:text-gray-300">{new Date(trackedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
                {trackedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => e.target.src = 'https://placehold.co/40x40/f97316/white?text=IMG'}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">${item.subtotal?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Order History ──────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 && orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-sm text-gray-400 mb-6">
              Orders you place will appear here. Use the tracker above to look up any order by number.
            </p>
            <Link to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Search bar — only show if there are orders */}
            {orders.length > 0 && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by order number or name..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400 transition-colors"
                />
              </div>
            )}

            {filtered.map(order => (
              <div key={order.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

                {/* Order header */}
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-500">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        &nbsp;·&nbsp; {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">${order.totalAmount?.toFixed(2)}</p>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                        {order.status}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded === order.id ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded === order.id && (
                  <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-4 fade-up">

                    {/* Progress */}
                    {order.status !== 'cancelled' && (
                      <div className="mb-5">
                        <div className="flex items-start justify-between">
                          {STEPS.map((step, i) => (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                                i <= stepIndex(order.status)
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                              }`}>
                                {i < stepIndex(order.status) ? '✓' : i + 1}
                              </div>
                              <span className={`text-[10px] capitalize text-center ${
                                i <= stepIndex(order.status) ? 'text-orange-500 font-medium' : 'text-gray-400'
                              }`}>{step}</span>
                            </div>
                          ))}
                        </div>
                        <div className="relative h-1 bg-gray-100 dark:bg-gray-800 rounded-full -mt-7 mx-3 z-0">
                          <div
                            className="absolute h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${Math.max(0, (stepIndex(order.status) / (STEPS.length - 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Delivery info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Deliver to</p>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customer?.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{order.customer?.address}, {order.customer?.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                        <p className="text-gray-700 dark:text-gray-300">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2.5">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => e.target.src = 'https://placehold.co/48x48/f97316/white?text=IMG'}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">${item.subtotal?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Order Total</span>
                      <span className="text-lg font-bold text-orange-500">${order.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
