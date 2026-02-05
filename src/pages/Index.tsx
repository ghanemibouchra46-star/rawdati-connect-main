import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatsSection from '@/components/StatsSection';
import KindergartenCard from '@/components/KindergartenCard';
import { kindergartens as localKindergartens } from '@/data/kindergartens';
import { useKindergartens } from '@/hooks/useKindergartens';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, Stethoscope, Shirt, ArrowLeft, ArrowRight, Star, MapPin, Users, MessageCircle, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import childrenPlaying from '@/assets/children-playing.png';
import childrenLearning from '@/assets/children-learning.png';

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
      title: t('services.kindergartens'),
      description: t('services.kindergartensDesc'),
      link: '/kindergartens',
      color: 'from-primary to-primary/80'
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

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-accent/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Banner */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-primary/30">
              <span className="text-2xl font-bold text-primary">{t('welcome')}</span>
              <span className="text-xl">👋</span>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-card/90 backdrop-blur-sm rounded-full shadow-lg mb-8">
              <Baby className="w-6 h-6 text-primary animate-bounce" />
              <span className="text-base font-semibold text-primary">{t('welcome.subtitle')}</span>
              <span className="text-xl">🌟</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight drop-shadow-lg">
              <span className="block mb-3 text-foreground">
                {t('hero.title1')}
              </span>
              <span className="block text-transparent bg-gradient-to-r from-primary via-primary to-accent bg-clip-text drop-shadow-none">
                {t('hero.title2')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
              {t('hero.description')}
              <span className="inline-block mx-2">🏫</span>
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <SearchAutocomplete onSearch={handleSearch} />
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

            {/* Small floating image */}
            <div className="mt-12 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <img
                  src={childrenLearning}
                  alt={t('platform.name')}
                  className="relative w-24 h-24 object-cover rounded-2xl shadow-xl border-3 border-white/90 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
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
                {t('kindergartens.count').replace('{count}', String(totalCount))} — {language === 'ar' ? 'عرض الكل' : 'Voir tout'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
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
            {services.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className="h-full border-0 shadow-soft hover:shadow-hover transition-all duration-300 group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`h-32 bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-16 h-16 text-white/90" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
