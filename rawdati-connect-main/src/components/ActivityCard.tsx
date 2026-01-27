import { Activity } from '@/data/kindergartens';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-border/30 hover:shadow-soft transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-2xl shadow-sm">
          {activity.icon}
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-foreground mb-1">{activity.nameAr}</h4>
          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg">
            <span className="text-xs text-primary font-medium">{activity.schedule}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
