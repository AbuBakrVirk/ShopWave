import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const [imgErr, setImgErr] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const fallback = `https://placehold.co/400x400/f97316/ffffff?text=${encodeURIComponent(product.name.slice(0, 12))}`;
  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="product-card group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200">

      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-square">
        <img
          src={imgErr ? fallback : product.image}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              Sold out
            </span>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-colors ${
              wishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className="w-3.5 h-3.5" fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/products/${product.id}`}
            className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-[10px] font-medium text-orange-500 uppercase tracking-wide mb-1">{product.category}</p>

        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-orange-500 dark:hover:text-orange-400 transition-colors leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className="w-3 h-3"
                fill={s <= Math.round(product.rating) ? '#f97316' : 'none'}
                stroke={s <= Math.round(product.rating) ? '#f97316' : '#d1d5db'}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-400">({product.reviewCount?.toLocaleString()})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              product.stock === 0
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : inCart
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.stock === 0 ? 'Sold out' : inCart ? 'Add more' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
