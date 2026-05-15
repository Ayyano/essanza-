import { Truck, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const badges = [
  {
    icon: Truck,
    title: 'Cash on Delivery',
    subtitle: 'Pay when you receive',
  },
  {
    icon: ShieldCheck,
    title: 'Nationwide Delivery',
    subtitle: 'Across all Pakistan',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    subtitle: '7-day return policy',
  },
  {
    icon: CreditCard,
    title: 'Secure Checkout',
    subtitle: '100% safe payment',
  },
];

type TrustBadgesProps = {
  className?: string;
};

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-4',
        className,
      )}
    >
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="flex items-center gap-3 p-3 rounded-lg bg-soft-beige/60"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted-gold/10 flex items-center justify-center">
            <badge.icon className="h-4 w-4 text-muted-gold-dark" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-matte-black leading-tight">
              {badge.title}
            </span>
            <span className="text-[10px] text-gray-400 leading-tight">
              {badge.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
