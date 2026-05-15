import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
  alignment?: 'left' | 'center';
  className?: string;
};

const urduSubtitles = [
  'Apne style ko naya roop dein',
  'Har din ek naya andaaz',
  'Quality jo mehsoos ho',
  'Trendsetter banein',
  'Khubsoorat libaas, behtareen qeemat',
  'Apne wardrobe ko upgrade karein',
  'Stylish rahein, confident rahein',
  'Jo pehnein to log dekhte rah jaayein',
  'Her outfit ek kahani sunata hai',
  'Essentials jo har wardrobe mein hon',
];

export function SectionHeading({
  title,
  subtitle,
  action,
  alignment = 'left',
  className,
}: SectionHeadingProps) {
  const displaySubtitle =
    subtitle ?? urduSubtitles[title.length % urduSubtitles.length];

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 mb-8',
        alignment === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-matte-black tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-400 italic font-light max-w-lg">
            {displaySubtitle}
          </p>
        </div>
        {action && (
          <a
            href={action.href}
            className={cn(
              'hidden sm:inline-flex items-center gap-1.5 text-sm font-medium',
              'text-muted-gold-dark hover:text-muted-gold transition-colors duration-200',
              'whitespace-nowrap',
            )}
          >
            {action.label}
            <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </div>

      <div
        className={cn(
          'h-0.5 w-12 bg-muted-gold rounded-full mt-1',
          alignment === 'center' && 'mx-auto',
        )}
      />
    </div>
  );
}
