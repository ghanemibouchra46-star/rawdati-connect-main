import { useState } from 'react';
import { MapPin, DollarSign, Calendar, Sparkles, X, SlidersHorizontal, Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { municipalities, services, filterableActivities } from '@/data/kindergartens';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterSidebarProps {
  selectedMunicipality: string;
  onMunicipalityChange: (id: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  selectedActivities: string[];
  onActivitiesChange: (activities: string[]) => void;
  onClearFilters: () => void;
  hasAutismWing: boolean;
  onAutismFilterChange: (checked: boolean) => void;
}

const FilterSidebar = ({
  selectedMunicipality,
  onMunicipalityChange,
  priceRange,
  onPriceRangeChange,
  selectedServices,
  onServicesChange,
  selectedActivities,
  onActivitiesChange,
  onClearFilters,
  hasAutismWing,
  onAutismFilterChange,
}: FilterSidebarProps) => {
  const { t, language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter((s) => s !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  const handleActivityToggle = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      onActivitiesChange(selectedActivities.filter((a) => a !== activityId));
    } else {
      onActivitiesChange([...selectedActivities, activityId]);
    }
  };

  const hasActiveFilters = selectedMunicipality !== '' || selectedServices.length > 0 || selectedActivities.length > 0 || priceRange[0] > 0 || priceRange[1] < 15000;

  const FilterContent = () => (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          {t('filter.title')}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-coral hover:text-coral/80 hover:bg-coral/10"
          >
            <X className={`w-4 h-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
            {t('common.cancel')}
          </Button>
        )}
      </div>

      {/* Municipality Filter */}
      <div className="space-y-3">
        <label className={`flex items-center gap-2 text-sm font-semibold text-foreground ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          <MapPin className="w-4 h-4 text-primary" />
          {t('filter.municipality')}
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onMunicipalityChange('')}
            className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'} px-3 py-2 rounded-lg text-sm transition-all ${selectedMunicipality === ''
              ? 'bg-primary text-primary-foreground shadow-soft'
              : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
          >
            {t('filter.allMunicipalities')}
          </button>
          {municipalities.map((muni) => (
            <button
              key={muni.id}
              onClick={() => onMunicipalityChange(muni.id)}
              className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'} px-3 py-2 rounded-lg text-sm transition-all ${selectedMunicipality === muni.id
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
            >
              {language === 'ar' ? muni.nameAr : muni.nameFr}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <label className={`flex items-center gap-2 text-sm font-semibold text-foreground ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          <DollarSign className="w-4 h-4 text-accent" />
          {t('filter.priceRange')}
        </label>
        <div className="px-2">
          <Slider
            value={[priceRange[0], priceRange[1]]}
            min={0}
            max={15000}
            step={500}
            onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} {t('mascara') === 'معسكر' ? 'دج' : 'DA'}</span>
            <span>{priceRange[1].toLocaleString()} {t('mascara') === 'معسكر' ? 'دج' : 'DA'}</span>
          </div>
        </div>
      </div>

      {/* Autism Wing Filter */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="autism-filter"
            checked={hasAutismWing}
            onCheckedChange={(checked) => onAutismFilterChange(checked as boolean)}
          />
          <label
            htmlFor="autism-filter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
          >
            <span className="text-xl">🧩</span>
            {t('filter.autism')}
          </label>
        </div>
      </div>

      {/* Clear Filters Button */}
      {/* Services Filter */}
      <div className="space-y-3">
        <label className={`flex items-center gap-2 text-sm font-semibold text-foreground ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          <Sparkles className="w-4 h-4 text-secondary" />
          {t('filter.services')}
        </label>
        <div className="space-y-2">
          {services.map((service) => (
            <label
              key={service.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-all ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <Checkbox
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => handleServiceToggle(service.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-lg">{service.icon}</span>
              <span className="text-sm text-foreground">{language === 'ar' ? service.nameAr : service.nameFr}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Activities Filter */}
      <div className="space-y-3">
        <label className={`flex items-center gap-2 text-sm font-semibold text-foreground ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
          <Palette className="w-4 h-4 text-purple-500" />
          {t('kindergartens.activities') || (language === 'ar' ? 'النشاطات' : 'Activities')}
        </label>
        <div className="space-y-2">
          {filterableActivities.map((activity) => (
            <label
              key={activity.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-all ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <Checkbox
                checked={selectedActivities.includes(activity.id)}
                onCheckedChange={() => handleActivityToggle(activity.id)}
                className="border-border data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <span className="text-lg">{activity.icon}</span>
              <span className="text-sm text-foreground">{language === 'ar' ? activity.nameAr : activity.nameFr}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-card rounded-full px-6 gap-2 border-border bg-card"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t('filter.title')}
        {hasActiveFilters && (
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
            {(selectedMunicipality ? 1 : 0) + selectedServices.length}
          </span>
        )}
      </Button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setIsOpen(false)} />
          <div className={`absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto ${language === 'ar' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
            <FilterContent />
            <Button
              className="w-full mt-6 gradient-accent border-0 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 bg-card rounded-2xl p-6 shadow-card h-fit sticky top-24">
        <FilterContent />
      </aside>
    </>
  );
};

export default FilterSidebar;
