import { useLanguage } from '@/contexts/LanguageContext';

interface Activity {
  id: string;
  nameAr: string;
  nameFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  description: string;
  schedule: string;
  icon: string;
}

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { language, dir } = useLanguage();

  const name = language === 'ar' ? activity.nameAr : activity.nameFr;
  // Fallback for description if localized fields aren't present yet in all data
  const description = (language === 'ar' ? activity.descriptionAr : activity.descriptionFr) || activity.description;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-border/30 hover:shadow-soft transition-all duration-300" dir={dir}>
      <div className={`flex items-start gap-3 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-2xl shadow-sm shrink-0">
          {activity.icon}
        </div>

        <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <h4 className="font-bold text-foreground mb-1">{name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg">
            <span className="text-xs text-primary font-medium">{activity.schedule}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
