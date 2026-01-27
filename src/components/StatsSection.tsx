import { useEffect, useState } from 'react';
import { GraduationCap, MapPin, Users, Star, Sparkles } from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  emoji: string;
  gradient: string;
}

const stats: StatItem[] = [
  { icon: GraduationCap, value: 10, suffix: '+', label: 'روضة معتمدة', emoji: '🏫', gradient: 'gradient-accent' },
  { icon: MapPin, value: 5, suffix: '', label: 'بلديات', emoji: '📍', gradient: 'bg-gradient-to-br from-coral to-primary' },
  { icon: Users, value: 500, suffix: '+', label: 'ولي مسجل', emoji: '👨‍👩‍👧', gradient: 'bg-gradient-to-br from-secondary to-mint' },
  { icon: Star, value: 4.6, suffix: '', label: 'متوسط التقييم', emoji: '⭐', gradient: 'bg-gradient-to-br from-accent to-secondary' },
];

const AnimatedCounter = ({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
      {/* Playful decorative elements */}
      <div className="absolute top-10 right-20 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-10 left-20 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse-soft" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-card rounded-full shadow-soft mb-4 border-2 border-primary/20">
            <Sparkles className="w-5 h-5 text-accent animate-pulse-soft" />
            <span className="font-bold text-foreground">📊 إحصائياتنا</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            أرقام تتحدث عن <span className="text-gradient-rainbow">نجاحنا</span> 🎉
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            ثقة الأولياء بمنصة روضتي تزداد يوماً بعد يوم
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-card rounded-3xl p-8 text-center shadow-card hover:shadow-hover transition-all duration-300 border-2 border-primary/20 overflow-hidden hover:scale-105 hover:-translate-y-2">
                {/* Sparkle decoration */}
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center animate-bounce-soft opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm">✨</span>
                </div>
                
                <div className={`w-18 h-18 mx-auto mb-5 rounded-2xl ${stat.gradient} flex items-center justify-center shadow-soft transform group-hover:rotate-6 transition-transform duration-300`} style={{ width: '72px', height: '72px' }}>
                  <stat.icon className="w-9 h-9 text-white" />
                </div>
                
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                  <AnimatedCounter 
                    target={stat.value} 
                    suffix={stat.suffix} 
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                  />
                </div>
                
                <p className="text-lg text-foreground font-bold flex items-center justify-center gap-2">
                  <span>{stat.emoji}</span>
                  <span>{stat.label}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
