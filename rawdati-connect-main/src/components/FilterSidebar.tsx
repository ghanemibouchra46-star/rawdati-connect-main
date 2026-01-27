import { useState } from 'react';
import { MapPin, DollarSign, Calendar, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { municipalities, services } from '@/data/kindergartens';

interface FilterSidebarProps {
  selectedMunicipality: string;
  onMunicipalityChange: (id: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  selectedMunicipality,
  onMunicipalityChange,
  priceRange,
  onPriceRangeChange,
  selectedServices,
  onServicesChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter((s) => s !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  const hasActiveFilters = selectedMunicipality !== '' || selectedServices.length > 0 || priceRange[0] > 0 || priceRange[1] < 15000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          تصفية النتائج
        </h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-coral hover:text-coral/80 hover:bg-coral/10"
          >
            <X className="w-4 h-4 ml-1" />
            مسح
          </Button>
        )}
      </div>

      {/* Municipality Filter */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          البلدية
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onMunicipalityChange('')}
            className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all ${
              selectedMunicipality === ''
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            جميع البلديات
          </button>
          {municipalities.map((muni) => (
            <button
              key={muni.id}
              onClick={() => onMunicipalityChange(muni.id)}
              className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all ${
                selectedMunicipality === muni.id
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {muni.nameAr}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <DollarSign className="w-4 h-4 text-accent" />
          السعر الشهري
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
            <span>{priceRange[0].toLocaleString()} دج</span>
            <span>{priceRange[1].toLocaleString()} دج</span>
          </div>
        </div>
      </div>

      {/* Services Filter */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="w-4 h-4 text-secondary" />
          الخدمات
        </label>
        <div className="space-y-2">
          {services.map((service) => (
            <label
              key={service.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-all"
            >
              <Checkbox
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => handleServiceToggle(service.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-lg">{service.icon}</span>
              <span className="text-sm text-foreground">{service.nameAr}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-card rounded-full px-6 gap-2 border-border bg-card"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        تصفية
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
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-in-right">
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
            <FilterContent />
            <Button 
              className="w-full mt-6 gradient-accent border-0 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              تطبيق الفلاتر
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
