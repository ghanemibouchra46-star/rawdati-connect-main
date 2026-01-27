import { useState, useMemo } from 'react';
import { Star, Phone, Clock, MapPin, MessageSquare, Search, ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { speechTherapists } from '@/data/speechTherapists';
import { municipalities } from '@/data/kindergartens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const SpeechTherapy = () => {
  const { t, language, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  const filteredTherapists = useMemo(() => {
    return speechTherapists.filter(therapist => {
      const name = language === 'ar' ? therapist.nameAr : therapist.nameFr;
      const specialty = language === 'ar' ? therapist.specialtyAr : therapist.specialtyFr;
      const address = language === 'ar' ? therapist.addressAr : therapist.addressFr;

      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMunicipality = !selectedMunicipality || therapist.municipalityId === selectedMunicipality;
      return matchesSearch && matchesMunicipality;
    });
  }, [searchQuery, selectedMunicipality, language]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative gradient-hero pt-24 pb-16">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="container mx-auto px-4 relative z-10" dir={dir}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
            {t('auth.backHome')}
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-soft mb-6">
              <Brain className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-foreground">{t('speech.pageTitle')}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t('speech.find')}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {t('speech.pageSubtitle')}
            </p>

            {/* Search */}
            <div className="bg-card rounded-2xl p-4 shadow-card max-w-xl mx-auto">
              <div className="relative">
                <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <Input
                  type="text"
                  placeholder={t('speech.searchPlaceholder')}
                  className={`${dir === 'rtl' ? 'pr-10' : 'pl-10'} h-12 bg-muted/50 border-0 rounded-xl`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Municipality Filter */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button
                onClick={() => setSelectedMunicipality('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedMunicipality
                    ? 'bg-secondary text-secondary-foreground shadow-soft'
                    : 'bg-card hover:bg-muted text-foreground'
                  }`}
              >
                {t('doctors.all')}
              </button>
              {municipalities.map((muni) => (
                <button
                  key={muni.id}
                  onClick={() => setSelectedMunicipality(muni.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedMunicipality === muni.id
                      ? 'bg-secondary text-secondary-foreground shadow-soft'
                      : 'bg-card hover:bg-muted text-foreground'
                    }`}
                >
                  {language === 'ar' ? muni.nameAr : muni.nameFr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Therapists Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map((therapist) => {
              const name = language === 'ar' ? therapist.nameAr : therapist.nameFr;
              const specialty = language === 'ar' ? therapist.specialtyAr : therapist.specialtyFr;
              const address = language === 'ar' ? therapist.addressAr : therapist.addressFr;
              const serviceList = language === 'ar' ? therapist.servicesAr : therapist.servicesFr;

              return (
                <Card key={therapist.id} className="overflow-hidden hover:shadow-hover transition-all duration-300 group" dir={dir}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={therapist.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute top-3 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                      <Badge className="bg-card/90 text-foreground backdrop-blur-sm">
                        <Star className={`w-3 h-3 fill-accent text-accent ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {therapist.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className={`text-xl font-bold text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{name}</h3>
                    <p className={`text-secondary font-medium mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{specialty}</p>

                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                        <MapPin className="w-4 h-4 text-secondary shrink-0" />
                        <span>{address}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                        <Clock className="w-4 h-4 text-secondary shrink-0" />
                        <span>{therapist.workingHours}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                        <Phone className="w-4 h-4 text-secondary shrink-0" />
                        <span dir="ltr">{therapist.phone}</span>
                      </div>
                    </div>

                    {/* Services Tags */}
                    <div className={`flex flex-wrap gap-1.5 mb-4 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
                      {serviceList.slice(0, 3).map((service) => (
                        <Badge key={service} variant="outline" className="text-[10px] sm:text-xs">
                          {service}
                        </Badge>
                      ))}
                      {serviceList.length > 3 && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          +{serviceList.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className={`mt-4 pt-4 border-t border-border flex items-center justify-between ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {t('doctors.experience').replace('{years}', therapist.experience.toString())}
                      </span>
                      <a href={`tel:${therapist.phone.replace(/\s/g, '')}`}>
                        <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-0 font-bold">
                          <Phone className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                          {t('doctors.callNow')}
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredTherapists.length === 0 && (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('kindergartens.noResults')}</h3>
              <p className="text-muted-foreground">{t('kindergartens.noResultsDesc')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpeechTherapy;
