import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search, LayoutGrid, List } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ui/ProductCard';
import { ProductSkeletonGrid } from '../components/ui/ProductSkeleton';

const SORT_OPTIONS = [
  { value: '',           label: 'Relevance' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'popular',    label: 'Most Popular' },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Computers', 'Home & Kitchen', 'Gaming', 'Sports', 'Furniture'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [localMin, setLocalMin] = useState('');
  const [localMax, setLocalMax] = useState('');

  const category = searchParams.get('category') || 'All';
  const search   = searchParams.get('search')   || '';
  const sort     = searchParams.get('sort')     || '';
  const page     = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (category && category !== 'All') p.set('category', category);
      if (search)   p.set('search', search);
      if (sort)     p.set('sort', sort);
      if (minPrice) p.set('minPrice', minPrice);
      if (maxPrice) p.set('maxPrice', maxPrice);
      p.set('page', page);
      p.set('limit', 12);
      const res = await axios.get(`/api/products?${p}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const setParam = (key, value) => {
    const np = new URLSearchParams(searchParams);
    if (value) np.set(key, value); else np.delete(key);
    np.delete('page');
    setSearchParams(np);
  };

  const applyPrice = () => {
    const np = new URLSearchParams(searchParams);
    if (localMin) np.set('minPrice', localMin); else np.delete('minPrice');
    if (localMax) np.set('maxPrice', localMax); else np.delete('maxPrice');
    np.delete('page');
    setSearchParams(np);
    setFilterOpen(false);
  };

  const clearAll = () => {
    setLocalMin(''); setLocalMax('');
    setSearchParams({});
  };

  const hasFilters = category !== 'All' || search || sort || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {search
                ? <>Results for <span className="text-orange-500">"{search}"</span></>
                : category !== 'All' ? category : 'All Products'}
            </h1>
            {!loading && (
              <p className="text-sm text-gray-400 mt-0.5">
                {pagination.totalProducts ?? 0} products
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400 transition-colors"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                filterOpen || hasFilters
                  ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-orange-400'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
            </button>

            {hasFilters && (
              <button onClick={clearAll} className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 mb-6 fade-up">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
            <div className="flex items-center gap-3 max-w-xs">
              <input
                type="number"
                placeholder="Min $"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400"
              />
              <span className="text-gray-300 dark:text-gray-600">—</span>
              <input
                type="number"
                placeholder="Max $"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400"
              />
              <button onClick={applyPrice}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setParam('category', cat === 'All' ? '' : cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                (cat === 'All' && (category === 'All' || !category)) || category === cat
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <ProductSkeletonGrid count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Search className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-400 text-sm mb-6">Try different keywords or remove some filters</p>
            <button onClick={clearAll}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-10">
            <button
              onClick={() => setParam('page', page - 1)}
              disabled={!pagination.hasPrevPage}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:border-orange-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button key={p} onClick={() => setParam('page', p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-orange-400'
                    }`}>
                    {p}
                  </button>
                )
              )
            }

            <button
              onClick={() => setParam('page', page + 1)}
              disabled={!pagination.hasNextPage}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:border-orange-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
