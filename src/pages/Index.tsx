import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatsSection from '@/components/StatsSection';
import KindergartenCard from '@/components/KindergartenCard';
import { kindergartens as localKindergartens } from '@/data/kindergartens';
import { useKindergartens } from '@/hooks/useKindergartens';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, ArrowLeft, ArrowRight, Star, MapPin, Users, Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import childrenPlaying from '@/assets/children-playing.png';
import SearchAutocomplete from '@/components/SearchAutocomplete';

const FEATURED_COUNT = 6;

const Index = () => {
  const { t, language, dir } = useLanguage();
  const navigate = useNavigate();
  const { data: supabaseKindergartens } = useKindergartens();
  const featuredList = (supabaseKindergartens && supabaseKindergartens.length > 0)
    ? supabaseKindergartens.slice(0, FEATURED_COUNT)
    : localKindergartens.slice(0, FEATURED_COUNT);
  const totalCount = (supabaseKindergartens && supabaseKindergartens.length > 0)
    ? supabaseKindergartens.length
    : localKindergartens.length;
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const handleSearch = (query: string) => {
    navigate(`/kindergartens?search=${encodeURIComponent(query)}`);
  };

  const features = [
    {
      icon: GraduationCap,
      title: t('features.certified'),
      description: t('features.certifiedDesc')
    },
    {
      icon: Star,
      title: t('features.reviews'),
      description: t('features.reviewsDesc')
    },
    {
      icon: MapPin,
      title: t('features.nearby'),
      description: t('features.nearbyDesc')
    },
    {
      icon: Users,
      title: t('features.easyRegister'),
      description: t('features.easyRegisterDesc')
    }
  ];

  const services = [
    {
      icon: GraduationCap,
      title: 'روضتي بالوردي',
      description: 'اكتشف أفضل الروضات في منطقتك',
      link: '/kindergartens',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={childrenPlaying}
            alt={t('platform.name')}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Banner */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-emerald-600/20 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-purple-600/30">
              <span className="text-2xl font-bold text-purple-600">مرحباً بك في</span>
              <span className="text-xl">👋</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight drop-shadow-lg">
              <span className="block mb-3 text-foreground">
                روضتي
              </span>
              <span className="block text-transparent bg-gradient-to-r from-purple-600 via-purple-600 to-emerald-600 bg-clip-text drop-shadow-none">
                بالوردي
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm inline-flex flex-wrap items-center justify-center gap-2">
              منصتك الأولى للعثور على أفضل الروضات في منطقتك
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20 text-purple-600">
                <Home className="w-4 h-4" />
              </span>
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <SearchAutocomplete onSearch={handleSearch} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kindergartens">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-10 py-6 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 font-semibold shadow-soft">
                  <GraduationCap className="w-6 h-6" />
                  {t('hero.explore')}
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-10 py-6 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 font-semibold">
                  {t('hero.aboutUs')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Kindergartens Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('kindergartens.pageTitle')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              {t('kindergartens.pageSubtitle')}
            </p>
            <Link to="/kindergartens">
              <Button size="lg" className="gap-2 gradient-accent border-0 shadow-soft hover:shadow-hover">
                <GraduationCap className="w-5 h-5" />
                {t('hero.explore')}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredList.map((kindergarten) => (
              <KindergartenCard
                key={kindergarten.id}
                kindergarten={kindergarten}
                onViewDetails={() => navigate('/kindergartens')}
                onRegister={() => navigate('/kindergartens')}
                onBook={() => navigate('/kindergartens')}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/kindergartens">
              <Button variant="outline" size="lg" className="gap-2">
                {t('kindergartens.count').replace('{count}', String(totalCount))} — {language === 'ar' ? 'عرض الكل' : language === 'fr' ? 'Voir tout' : 'View All'}
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('features.title')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {t('features.certified')}
              </h3>
              <p className="text-muted-foreground">
                {t('features.certifiedDesc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {t('features.reviews')}
              </h3>
              <p className="text-muted-foreground">
                {t('features.reviewsDesc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {t('features.nearby')}
              </h3>
              <p className="text-muted-foreground">
                {t('features.nearbyDesc')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {t('features.easyRegister')}
              </h3>
              <p className="text-muted-foreground">
                {t('features.easyRegisterDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('services.title')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="relative">
              <Link to="/kindergartens">
                <Card className="h-full border-0 shadow-soft hover:shadow-hover transition-all duration-300 group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-32 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-16 h-16 text-white/90" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {services[0].title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{services[0].description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                جديد
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t('cta.ownerTitle')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t('cta.ownerDesc')}
          </p>
          <Link to="/owner-auth">
            <Button size="lg" className="gap-2 gradient-accent border-0 shadow-soft hover:shadow-hover transition-all duration-300">
              {t('cta.register')}
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
