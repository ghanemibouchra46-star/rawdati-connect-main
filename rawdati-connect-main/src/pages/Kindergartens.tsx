import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import KindergartenCard from '@/components/KindergartenCard';
import FilterSidebar from '@/components/FilterSidebar';
import KindergartenDetailModal from '@/components/KindergartenDetailModal';
import RegistrationModal from '@/components/RegistrationModal';
import Footer from '@/components/Footer';
import { kindergartens, Kindergarten } from '@/data/kindergartens';
import { GraduationCap, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Kindergartens = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const [detailModalKindergarten, setDetailModalKindergarten] = useState<Kindergarten | null>(null);
  const [registerModalKindergarten, setRegisterModalKindergarten] = useState<Kindergarten | null>(null);

  const filteredKindergartens = useMemo(() => {
    return kindergartens.filter((k) => {
      if (searchQuery && !k.nameAr.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedMunicipality && k.municipality !== selectedMunicipality) {
        return false;
      }
      if (k.pricePerMonth < priceRange[0] || k.pricePerMonth > priceRange[1]) {
        return false;
      }
      if (selectedServices.length > 0 && !selectedServices.every((s) => k.services.includes(s))) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedMunicipality, priceRange, selectedServices]);

  const handleClearFilters = () => {
    setSelectedMunicipality('');
    setPriceRange([0, 15000]);
    setSelectedServices([]);
    setSearchQuery('');
  };

  const handleViewDetails = (id: string) => {
    const kg = kindergartens.find((k) => k.id === id);
    if (kg) setDetailModalKindergarten(kg);
  };

  const handleRegister = (id: string) => {
    const kg = kindergartens.find((k) => k.id === id);
    if (kg) setRegisterModalKindergarten(kg);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">اكتشف الروضات</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              روضات ولاية معسكر
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              اختر من بين أفضل الروضات في ولاية معسكر، مع معلومات شاملة عن الأسعار والخدمات والتقييمات
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث عن روضة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kindergartens Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <FilterSidebar
              selectedMunicipality={selectedMunicipality}
              onMunicipalityChange={setSelectedMunicipality}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
              onClearFilters={handleClearFilters}
            />

            {/* Cards Grid */}
            <div className="flex-1">
              {filteredKindergartens.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    عرض {filteredKindergartens.length} روضة
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredKindergartens.map((kindergarten, index) => (
                      <div
                        key={kindergarten.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <KindergartenCard
                          kindergarten={kindergarten}
                          onViewDetails={handleViewDetails}
                          onRegister={handleRegister}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
                  <p className="text-muted-foreground mb-4">جرب تغيير معايير البحث</p>
                  <button
                    onClick={handleClearFilters}
                    className="text-primary hover:underline font-medium"
                  >
                    مسح جميع الفلاتر
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <KindergartenDetailModal
        kindergarten={detailModalKindergarten}
        isOpen={!!detailModalKindergarten}
        onClose={() => setDetailModalKindergarten(null)}
        onRegister={() => {
          setRegisterModalKindergarten(detailModalKindergarten);
          setDetailModalKindergarten(null);
        }}
      />

      <RegistrationModal
        kindergarten={registerModalKindergarten}
        isOpen={!!registerModalKindergarten}
        onClose={() => setRegisterModalKindergarten(null)}
      />
    </div>
  );
};

export default Kindergartens;
