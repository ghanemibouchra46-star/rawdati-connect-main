import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, fr, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

interface Review {
  id: string;
  parent_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const { language, dir } = useLanguage();

  const getLocale = () => {
    switch (language) {
      case 'ar': return ar;
      case 'fr': return fr;
      default: return enUS;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
    locale: getLocale()
  });

  return (
    <div className="bg-muted/50 rounded-xl p-4 border border-border/30" dir={dir}>
      <div className={`flex items-start justify-between mb-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-lg">
              {review.parent_name.charAt(0)}
            </span>
          </div>
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <p className="font-semibold text-foreground">{review.parent_name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>

        <div className={`flex items-center gap-0.5 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating
                  ? 'text-accent fill-accent'
                  : 'text-muted-foreground/30'
                }`}
            />
          ))}
        </div>
      </div>

      {review.comment && (
        <p className={`text-muted-foreground text-sm leading-relaxed ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {review.comment}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
