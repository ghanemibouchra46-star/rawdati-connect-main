import { Star, MapPin, Clock, Users, Bus, Utensils, Calculator, Globe, BookOpen, Dumbbell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Kindergarten } from '@/data/kindergartens';

interface KindergartenCardProps {
  kindergarten: Kindergarten;
  onViewDetails: (id: string) => void;
  onRegister: (id: string) => void;
}

const serviceIcons: Record<string, React.ReactNode> = {
  bus: <Bus className="w-3.5 h-3.5" />,
  meals: <Utensils className="w-3.5 h-3.5" />,
  'mental-math': <Calculator className="w-3.5 h-3.5" />,
  languages: <Globe className="w-3.5 h-3.5" />,
  quran: <BookOpen className="w-3.5 h-3.5" />,
  sports: <Dumbbell className="w-3.5 h-3.5" />,
};

const serviceNames: Record<string, string> = {
  bus: 'نقل',
  meals: 'وجبات',
  'mental-math': 'حساب ذهني',
  languages: 'لغات',
  quran: 'قرآن',
  sports: 'رياضة',
};

const KindergartenCard = ({ kindergarten, onViewDetails, onRegister }: KindergartenCardProps) => {
  return (
    <Card className="group overflow-hidden bg-card border-border hover:shadow-hover transition-all duration-500 rounded-2xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={kindergarten.images[0]}
          alt={kindergarten.nameAr}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-sm font-semibold text-foreground">{kindergarten.rating}</span>
          <span className="text-xs text-muted-foreground">({kindergarten.reviewCount})</span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-lg">
          <span className="text-sm font-bold text-primary-foreground">{kindergarten.pricePerMonth.toLocaleString()} دج</span>
          <span className="text-xs text-primary-foreground/80">/شهر</span>
        </div>

        {/* Municipality */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-card/90 backdrop-blur-sm rounded-full">
          <MapPin className="w-3.5 h-3.5 text-coral" />
          <span className="text-sm text-foreground">{kindergarten.municipalityAr}</span>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Name */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {kindergarten.nameAr}
        </h3>

        {/* Address */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
          {kindergarten.addressAr}
        </p>

        {/* Info Row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>{kindergarten.workingHours.open} - {kindergarten.workingHours.close}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-secondary" />
            <span>{kindergarten.ageRange.min}-{kindergarten.ageRange.max} سنوات</span>
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {kindergarten.services.slice(0, 4).map((service) => (
            <Badge 
              key={service} 
              variant="secondary" 
              className="gap-1 px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
            >
              {serviceIcons[service]}
              {serviceNames[service]}
            </Badge>
          ))}
          {kindergarten.services.length > 4 && (
            <Badge variant="secondary" className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
              +{kindergarten.services.length - 4}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl border-border hover:bg-muted"
            onClick={() => onViewDetails(kindergarten.id)}
          >
            التفاصيل
          </Button>
          <Button 
            className="flex-1 rounded-xl gradient-accent border-0 shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground"
            onClick={() => onRegister(kindergarten.id)}
          >
            سجل الآن
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KindergartenCard;
