import { Heart, Shield, Users, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative gradient-hero pt-24 pb-16">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="container mx-auto px-4 relative z-10" dir={dir}>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
            {t('auth.backHome')}
          </Link>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-soft mb-6">
              <Heart className="w-5 h-5 text-accent fill-accent" />
              <span className="text-sm font-medium text-foreground">{t('about.title')}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t('about.heroTitle')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4" dir={dir}>
          <div className="max-w-4xl mx-auto">
            {/* About Text */}
            <div className={`bg-card rounded-3xl p-8 md:p-12 shadow-card mb-12 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-6">
                <p className="text-xl font-medium text-primary">
                  {t('about.desc1')}
                </p>

                <p className="text-muted-foreground">
                  {t('about.desc2')}
                </p>

                <p className="text-muted-foreground">
                  {t('about.desc3')}
                </p>

                <p className="text-muted-foreground">
                  {t('about.desc4')}
                </p>

                <p className="text-xl font-semibold text-accent">
                  {t('about.quote')}
                </p>
              </div>
            </div>

            {/* Values */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              {t('about.values')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`bg-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className={`w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4 ${dir === 'rtl' ? 'mr-0' : 'ml-0'}`}>
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t('about.value1.title')}</h3>
                <p className="text-muted-foreground">
                  {t('about.value1.desc')}
                </p>
              </div>

              <div className={`bg-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className={`w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4 ${dir === 'rtl' ? 'mr-0' : 'ml-0'}`}>
                  <Heart className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t('about.value2.title')}</h3>
                <p className="text-muted-foreground">
                  {t('about.value2.desc')}
                </p>
              </div>

              <div className={`bg-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className={`w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center mb-4 ${dir === 'rtl' ? 'mr-0' : 'ml-0'}`}>
                  <Users className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t('about.value3.title')}</h3>
                <p className="text-muted-foreground">
                  {t('about.value3.desc')}
                </p>
              </div>

              <div className={`bg-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className={`w-14 h-14 bg-gradient-to-br from-coral/20 to-coral/10 rounded-xl flex items-center justify-center mb-4 ${dir === 'rtl' ? 'mr-0' : 'ml-0'}`}>
                  <Target className="w-7 h-7 text-coral" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t('about.value4.title')}</h3>
                <p className="text-muted-foreground">
                  {t('about.value4.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
