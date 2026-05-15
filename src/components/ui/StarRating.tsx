import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
  className?: string;
};

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
} as const;

export function StarRating({
  rating,
  count,
  size = 'sm',
  showCount = true,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const roundedRating = rating % 1 >= 0.75 ? fullStars + 1 : fullStars;

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < roundedRating) {
            return (
              <Star
                key={i}
                className={cn(sizeMap[size], 'fill-amber-400 text-amber-400')}
              />
            );
          }
          if (i === roundedRating && hasHalf) {
            return (
              <div key={i} className="relative">
                <Star
                  className={cn(sizeMap[size], 'text-gray-200', 'fill-gray-200')}
                />
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star
                    className={cn(
                      sizeMap[size],
                      'fill-amber-400 text-amber-400',
                    )}
                  />
                </div>
              </div>
            );
          }
          return (
            <Star
              key={i}
              className={cn(sizeMap[size], 'text-gray-200', 'fill-gray-200')}
            />
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-[11px] text-gray-400 font-medium">
          ({count})
        </span>
      )}
    </div>
  );
}
