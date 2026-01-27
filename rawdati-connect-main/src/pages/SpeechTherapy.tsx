import { useState, useMemo } from 'react';
import { Star, Phone, Clock, MapPin, Search, ArrowRight, MessageCircle, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { speechTherapists } from '@/data/speechTherapists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SpeechTherapy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  const municipalities = [...new Set(speechTherapists.map(s => s.municipality))];

  const filteredTherapists = useMemo(() => {
    return speechTherapists.filter(therapist => {
      const matchesSearch = therapist.name.includes(searchQuery) || 
                           therapist.specialty.includes(searchQuery) ||
                           therapist.address.includes(searchQuery) ||
                           therapist.services.some(s => s.includes(searchQuery));
      const matchesMunicipality = !selectedMunicipality || therapist.municipality === selectedMunicipality;
      return matchesSearch && matchesMunicipality;
    });
  }, [searchQuery, selectedMunicipality]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative gradient-hero pt-24 pb-16">
        <div className="absolute top-20 right-10 w-40 h-40 bg-lavender/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-20 w-56 h-56 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse-soft" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 mb-6 font-bold hover:pr-2">
            <ArrowRight className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-card rounded-full shadow-soft mb-6 border-2 border-lavender/30">
              <MessageCircle className="w-5 h-5 text-lavender" />
              <span className="text-base font-bold text-foreground">🗣️ أخصائيو الأرطفونيا في ولاية معسكر</span>
              <Sparkles className="w-5 h-5 text-accent animate-pulse-soft" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
              اعثر على <span className="text-gradient-rainbow">أخصائي أرطفونيا</span> موثوق 🎯
            </h1>
            <p className="text-lg text-muted-foreground mb-8 font-medium">
              متخصصون في علاج اضطرابات النطق والكلام والتواصل للأطفال
            </p>

            {/* Search */}
            <div className="bg-card rounded-3xl p-6 shadow-card max-w-xl mx-auto border-2 border-lavender/20">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-lavender" />
                <Input
                  type="text"
                  placeholder="🔍 ابحث باسم الأخصائي أو الخدمة..."
                  className="pr-12 h-14 bg-muted/50 border-2 border-lavender/20 rounded-2xl text-lg focus:border-lavender transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Municipality Filter */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={() => setSelectedMunicipality('')}
                className={`px-5 py-3 rounded-full text-base font-bold transition-all duration-300 border-2 ${
                  !selectedMunicipality 
                    ? 'gradient-playful text-primary-foreground border-transparent shadow-soft' 
                    : 'bg-card hover:bg-lavender/10 text-foreground border-lavender/20 hover:border-lavender'
                }`}
              >
                الكل
              </button>
              {municipalities.map((muni) => (
                <button
                  key={muni}
                  onClick={() => setSelectedMunicipality(muni)}
                  className={`px-5 py-3 rounded-full text-base font-bold transition-all duration-300 border-2 ${
                    selectedMunicipality === muni 
                      ? 'gradient-playful text-primary-foreground border-transparent shadow-soft' 
                      : 'bg-card hover:bg-lavender/10 text-foreground border-lavender/20 hover:border-lavender'
                  }`}
                >
                  {muni}
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
            {filteredTherapists.map((therapist) => (
              <Card key={therapist.id} className="overflow-hidden hover:shadow-hover transition-all duration-300 group border-2 border-lavender/20 hover:border-lavender rounded-3xl hover:scale-[1.02]">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={therapist.image} 
                    alt={therapist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-card/90 text-foreground backdrop-blur-sm rounded-full px-3 py-1 font-bold">
                      <Star className="w-4 h-4 fill-accent text-accent ml-1" />
                      {therapist.rating}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="gradient-playful text-primary-foreground rounded-full px-3 py-1 font-bold">
                      <Award className="w-4 h-4 ml-1" />
                      {therapist.experience} سنة خبرة
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-extrabold text-foreground mb-2">{therapist.name}</h3>
                  <p className="text-lavender font-bold mb-4">{therapist.specialty}</p>
                  
                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {therapist.services.slice(0, 3).map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-lavender/10 text-lavender border-0 rounded-full text-xs font-medium">
                        {service}
                      </Badge>
                    ))}
                    {therapist.services.length > 3 && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 rounded-full text-xs">
                        +{therapist.services.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-lavender" />
                      <span>{therapist.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-lavender" />
                      <span>{therapist.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-lavender" />
                      <span dir="ltr">{therapist.phone}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-lavender/20">
                    <a href={`tel:${therapist.phone.replace(/\s/g, '')}`} className="block w-full">
                      <Button size="lg" className="w-full gradient-playful border-0 rounded-2xl font-bold hover:scale-105 transition-all duration-300">
                        <Phone className="w-5 h-5 ml-2" />
                        📞 اتصل الآن
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTherapists.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="w-20 h-20 text-lavender/50 mx-auto mb-4" />
              <h3 className="text-2xl font-extrabold text-foreground mb-2">لا توجد نتائج 😔</h3>
              <p className="text-muted-foreground text-lg">جرب البحث بكلمات مختلفة</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpeechTherapy;
