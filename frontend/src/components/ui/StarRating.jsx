import { Star } from 'lucide-react';

export default function StarRating({ rating, reviewCount, size = 'sm' }) {
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const iconSize = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={iconSize}
            fill={star <= Math.round(rating) ? '#f97316' : 'none'}
            stroke={star <= Math.round(rating) ? '#f97316' : '#d1d5db'}
          />
        ))}
      </div>
      <span className={`text-gray-500 dark:text-gray-400 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        {rating} {reviewCount !== undefined && `(${reviewCount?.toLocaleString()})`}
      </span>
    </div>
  );
}
