import { useState, useMemo } from 'react';
import { Star, Phone, Clock, MapPin, Stethoscope, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doctors } from '@/data/doctors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  const municipalities = [...new Set(doctors.map(d => d.municipality))];

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.includes(searchQuery) || 
                           doctor.specialty.includes(searchQuery) ||
                           doctor.address.includes(searchQuery);
      const matchesMunicipality = !selectedMunicipality || doctor.municipality === selectedMunicipality;
      return matchesSearch && matchesMunicipality;
    });
  }, [searchQuery, selectedMunicipality]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative gradient-hero pt-24 pb-16">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-soft mb-6">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">أطباء الأطفال في ولاية معسكر</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              اعثر على <span className="text-gradient">طبيب أطفال</span> موثوق
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              قائمة شاملة لأفضل أطباء الأطفال في ولاية معسكر
            </p>

            {/* Search */}
            <div className="bg-card rounded-2xl p-4 shadow-card max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ابحث باسم الطبيب أو التخصص..."
                  className="pr-10 h-12 bg-muted/50 border-0 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Municipality Filter */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button
                onClick={() => setSelectedMunicipality('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedMunicipality 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card hover:bg-muted text-foreground'
                }`}
              >
                الكل
              </button>
              {municipalities.map((muni) => (
                <button
                  key={muni}
                  onClick={() => setSelectedMunicipality(muni)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedMunicipality === muni 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card hover:bg-muted text-foreground'
                  }`}
                >
                  {muni}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-card/90 text-foreground backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-accent text-accent ml-1" />
                      {doctor.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-2">{doctor.name}</h3>
                  <p className="text-primary font-medium mb-3">{doctor.specialty}</p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{doctor.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{doctor.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span dir="ltr">{doctor.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      خبرة {doctor.experience} سنة
                    </span>
                    <a href={`tel:${doctor.phone.replace(/\s/g, '')}`}>
                      <Button size="sm" className="gradient-accent border-0">
                        <Phone className="w-4 h-4 ml-2" />
                        اتصل الآن
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-16">
              <Stethoscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Doctors;
