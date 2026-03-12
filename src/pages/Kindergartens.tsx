import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import KindergartenCard from '@/components/KindergartenCard';
import FilterSidebar from '@/components/FilterSidebar';
import KindergartenDetailModal from '@/components/KindergartenDetailModal';
import RegistrationModal from '@/components/RegistrationModal';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { kindergartens as localKindergartens, Kindergarten, filterableActivities } from '@/data/kindergartens';
import { useKindergartens } from '@/hooks/useKindergartens';
import { GraduationCap, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { arabicSearch } from '@/lib/arabicUtils';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Map activity filter IDs to keywords for fuzzy matching against activity names
const activityKeywords: Record<string, string[]> = {
  drawing: ['رسم', 'تلوين', 'فنون', 'dessin', 'art', 'drawing'],
  music: ['أناشيد', 'موسيقى', 'chant', 'music'],
  robotics: ['روبوتيك', 'برمجة', 'robot', 'robotique'],
  swimming: ['سباحة', 'natation', 'swimming'],
  games: ['ألعاب', 'تعليمية', 'jeux', 'games'],
  quran: ['قرآن', 'تحفيظ', 'تجويد', 'coran', 'quran'],
};

const kindergartenMatchesActivity = (k: Kindergarten, activityFilterId: string): boolean => {
  const keywords = activityKeywords[activityFilterId];
  if (!keywords) return false;
  return k?.activities?.some(act => {
    const name = ((act?.name_ar || '') + ' ' + (act?.nameFr || '')).toLowerCase();
    return keywords.some(kw => name.includes(kw.toLowerCase()));
  });
};

const Kindergartens = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: supabaseKindergartens, isLoading: isLoadingKg } = useKindergartens();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  const kindergartens = supabaseKindergartens || [];

  console.log("Kindergartens.tsx - supabaseKindergartens:", supabaseKindergartens);
  console.log("Kindergartens.tsx - localKindergartens:", localKindergartens);
  console.log("Kindergartens.tsx - final kindergartens:", kindergartens);
  console.log("Kindergartens.tsx - isLoadingKg:", isLoadingKg);

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  // ... rest of state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [hasAutismWing, setHasAutismWing] = useState(false);

  const [detailModalKindergarten, setDetailModalKindergarten] = useState<Kindergarten | null>(null);
  const [registerModalKindergarten, setRegisterModalKindergarten] = useState<Kindergarten | null>(null);
  const [bookingModalKindergarten, setBookingModalKindergarten] = useState<Kindergarten | null>(null);

  const filteredKindergartens = useMemo(() => {
    console.log("Computing filteredKindergartens...");
    console.log("Total kindergartens:", kindergartens?.length || 0);
    console.log("Search query:", searchQuery);
    console.log("Selected municipality:", selectedMunicipality);
    
    const filtered = kindergartens.filter((k) => {
      const searchStr = `${k?.name_ar || ''} ${k?.nameFr || ''} ${k?.municipality_ar || ''} ${k?.municipalityFr || ''}`;
      if (searchQuery && !arabicSearch(searchStr, searchQuery)) {
        return false;
      }
      if (selectedMunicipality && k?.municipality !== selectedMunicipality) {
        return false;
      }
      const price = k?.pricePerMonth || 0;
      const minPrice = priceRange[0];
      const maxPrice = priceRange[1] >= 15000 ? Infinity : priceRange[1];
      if (price < minPrice || price > maxPrice) {
        return false;
      }
      if (selectedServices.length > 0 && !selectedServices.every((s) => k?.services?.includes(s))) {
        return false;
      }
      if (selectedActivities.length > 0 && !selectedActivities.every((a) => kindergartenMatchesActivity(k, a))) {
        return false;
      }
      if (hasAutismWing && !k?.hasAutismWing) {
        return false;
      }
      return true;
    });
    
    console.log("Filtered kindergartens:", filtered.length);
    return filtered;
  }, [searchQuery, selectedMunicipality, priceRange, selectedServices, selectedActivities, hasAutismWing, language, kindergartens]);

  const handleClearFilters = () => {
    setSelectedMunicipality('');
    setPriceRange([0, 15000]);
    setSelectedServices([]);
    setSelectedActivities([]);
    setHasAutismWing(false);
    setSearchQuery('');
  };

  const handleViewDetails = (id: string) => {
    console.log("handleViewDetails called with id:", id);
    const kg = kindergartens.find((k) => k?.id === id);
    console.log("Found kindergarten:", kg);
    if (kg) {
      console.log("Setting detailModalKindergarten");
      setDetailModalKindergarten(kg);
    } else {
      console.log("Kindergarten not found!");
    }
  };

  const handleRegister = (id: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const kg = kindergartens.find((k) => k?.id === id);
    if (kg) setRegisterModalKindergarten(kg);
  };

  const handleBooking = (id: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const kg = kindergartens.find((k) => k?.id === id);
    if (kg) setBookingModalKindergarten(kg);
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
              <span className="text-sm font-medium text-primary">{t('nav.kindergartens')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('kindergartens.pageTitle')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('kindergartens.pageSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchAutocomplete
                onSearch={(query) => {
                  setSearchQuery(query);
                  setSearchParams({ search: query });
                }}
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
              selectedActivities={selectedActivities}
              onActivitiesChange={setSelectedActivities}
              onClearFilters={handleClearFilters}
              hasAutismWing={hasAutismWing}
              onAutismFilterChange={setHasAutismWing}
            />

            {/* Cards Grid */}
            <div className="flex-1">
              {isLoadingKg ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">{t('auth.loading')}</p>
                </div>
              ) : filteredKindergartens.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('kindergartens.count').replace('{count}', filteredKindergartens.length.toString())}
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
                          onBook={handleBooking}
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
                  <h3 className="text-xl font-bold text-foreground mb-2">{t('kindergartens.noResults')}</h3>
                  <p className="text-muted-foreground mb-4">{t('kindergartens.noResultsDesc')}</p>
                  <button
                    onClick={handleClearFilters}
                    className="text-primary hover:underline font-medium"
                  >
                    {t('kindergartens.clearFilters')}
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
        onClose={() => {
          console.log("Closing detail modal");
          setDetailModalKindergarten(null);
        }}
        onRegister={() => {
          if (detailModalKindergarten) {
            handleRegister(detailModalKindergarten.id);
            setDetailModalKindergarten(null);
          }
        }}
        onBook={() => {
          if (detailModalKindergarten) {
            handleBooking(detailModalKindergarten.id);
            setDetailModalKindergarten(null);
          }
        }}
      />

      <RegistrationModal
        kindergarten={registerModalKindergarten}
        isOpen={!!registerModalKindergarten}
        onClose={() => setRegisterModalKindergarten(null)}
      />

      <BookingModal
        kindergarten={bookingModalKindergarten}
        isOpen={!!bookingModalKindergarten}
        onClose={() => setBookingModalKindergarten(null)}
      />
    </div>
  );
};

export default Kindergartens;
