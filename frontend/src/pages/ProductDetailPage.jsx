/**
 * ProductDetailPage.jsx - Full product detail view
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart, Heart, Star, Truck, Shield, RefreshCw,
  ChevronRight, Minus, Plus, Share2, Check
} from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.product);
        // Fetch related products from same category
        const relRes = await axios.get(`/api/products?category=${encodeURIComponent(res.data.product.category)}&limit=4`);
        setRelatedProducts(relRes.data.products.filter(p => p.id !== id));
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await axios.post(`/api/products/${id}/review`, {
        rating: reviewRating,
        comment: reviewComment,
        userName: 'Anonymous'
      });
      setProduct(res.data.product);
      setReviewComment('');
      toast.success('Review submitted!');
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`skeleton h-${i === 0 ? 8 : 4} rounded w-${i % 2 === 0 ? 'full' : '3/4'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Product not found</h2>
          <Link to="/products" className="text-orange-500 hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images?.length ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-orange-500">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-orange-500">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 dark:text-gray-200 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Images */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square border border-gray-100 dark:border-gray-700">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://placehold.co/500x500/f97316/white?text=${encodeURIComponent(product.name.slice(0, 15))}`;
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-orange-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400">{product.brand}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className="w-5 h-5"
                    fill={star <= Math.round(product.rating) ? '#f97316' : 'none'}
                    stroke={star <= Math.round(product.rating) ? '#f97316' : '#d1d5db'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {product.rating} ({product.reviewCount?.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold px-2 py-0.5 rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {product.stock < 10 ? `Only ${product.stock} left in stock!` : 'In Stock'}
                  </span>
                </>
              ) : (
                <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isWishlisted(product.id)
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-400'
                }`}
              >
                <Heart className="w-5 h-5" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-orange-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: 'Free Shipping', sub: 'Orders over $50' },
                { icon: Shield, text: 'Secure Payment', sub: '100% Protected' },
                { icon: RefreshCw, text: 'Easy Returns', sub: '30-day policy' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Icon className="w-5 h-5 text-orange-500 mb-1" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{text}</span>
                  <span className="text-xs text-gray-400">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mb-12">
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 min-w-24">{key}:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating summary */}
                <div className="flex items-center gap-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-orange-500">{product.rating}</div>
                    <div className="flex justify-center mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-4 h-4" fill={s <= Math.round(product.rating) ? '#f97316' : 'none'} stroke={s <= Math.round(product.rating) ? '#f97316' : '#d1d5db'} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{product.reviewCount?.toLocaleString()} reviews</div>
                  </div>
                </div>

                {/* Submit review form */}
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Write a Review</h3>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewRating(s)}>
                        <Star className="w-6 h-6" fill={s <= reviewRating ? '#f97316' : 'none'} stroke={s <= reviewRating ? '#f97316' : '#d1d5db'} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm outline-none focus:border-orange-400 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
