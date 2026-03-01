import { Search, MapPin, Star, Stethoscope, Shirt, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { municipalities } from '@/data/kindergartens';
import logoIcon from '@/assets/logo-icon.png';
import childrenPlaying from '@/assets/children-playing.png';
import childrenLearning from '@/assets/children-learning.png';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onMunicipalitySelect: (id: string) => void;
}

const HeroSection = ({ onSearch, onMunicipalitySelect }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] gradient-hero overflow-hidden">
      {/* Playful Decorative Elements */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 left-20 w-56 h-56 bg-secondary/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse-soft" />
      <div className="absolute top-1/4 left-1/3 w-28 h-28 bg-lavender/20 rounded-full blur-3xl animate-float" />

      {/* Floating Fun Shapes */}
      <div className="absolute top-28 left-1/4 w-6 h-6 bg-coral rounded-full opacity-70 animate-float" />
      <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-mint rounded-xl opacity-60 animate-float-delayed rotate-45" />
      <div className="absolute top-1/3 left-10 w-5 h-5 bg-lavender rounded-full opacity-80 animate-pulse-soft" />
      <div className="absolute bottom-1/3 right-16 w-7 h-7 bg-accent rounded-lg opacity-70 animate-wiggle" />
      <div className="absolute top-40 right-1/5 w-4 h-4 bg-secondary rounded-full opacity-60 animate-bounce-soft" />

      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Playful Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full shadow-soft mb-8 animate-fade-in border-2 border-primary/20">
            <Sparkles className="w-5 h-5 text-accent animate-pulse-soft" />
            <span className="text-base font-bold text-foreground">🌟 أفضل الروضات لطفلك 🌟</span>
            <Heart className="w-5 h-5 text-primary animate-pulse-soft" />
          </div>

          {/* Main Heading with Playful Style */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            اكتشف أفضل{' '}
            <span className="text-gradient-rainbow">روضات الأطفال</span>
            <br />
            <span className="inline-flex items-center gap-3">
              الخيار الأمثل
              <span className="text-3xl md:text-5xl">🎈</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            منصتك الموثوقة للعثور على الروضة المثالية لطفلك. قارن الأسعار، الخدمات،
            واطلع على تقييمات الأولياء.
          </p>

          {/* Playful Search Box */}
          <div className="bg-card rounded-3xl p-6 shadow-card max-w-2xl mx-auto animate-scale-in border-2 border-primary/20" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                <Input
                  type="text"
                  placeholder="🔍 ابحث باسم الروضة..."
                  className="pr-12 h-14 bg-muted/50 border-2 border-primary/20 rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:border-primary transition-all"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="h-14 px-10 gradient-accent border-0 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg hover:scale-105"
              >
                🎯 بحث
              </Button>
            </div>
          </div>

          {/* Municipality Quick Links */}
          <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-base font-bold text-muted-foreground mb-5">📍 البلديات الرئيسية:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {municipalities.map((muni) => (
                <button
                  key={muni.id}
                  onClick={() => onMunicipalitySelect(muni.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-card hover:bg-primary/10 rounded-full text-base font-bold text-foreground shadow-soft hover:shadow-hover border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  {muni.nameAr}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Services Links */}
          <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-base font-bold text-muted-foreground mb-5">✨ خدمات أخرى:</p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link
                to="/doctors"
                className="flex flex-col items-center gap-3 p-6 bg-card hover:bg-primary/5 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-300 min-w-[140px] border-2 border-primary/20 hover:border-primary hover:scale-105"
              >
                <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center shadow-soft">
                  <Stethoscope className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="text-base font-bold text-foreground">🩺 أطباء الأطفال</span>
              </Link>
              <Link
                to="/speech-therapy"
                className="flex flex-col items-center gap-3 p-6 bg-card hover:bg-lavender/5 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-300 min-w-[140px] border-2 border-lavender/20 hover:border-lavender hover:scale-105"
              >
                <div className="w-16 h-16 gradient-playful rounded-2xl flex items-center justify-center shadow-soft">
                  <MessageCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="text-base font-bold text-foreground">🗣️ أخصائيو الأرطفونيا</span>
              </Link>
              <Link
                to="/clothing-stores"
                className="flex flex-col items-center gap-3 p-6 bg-card hover:bg-secondary/5 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-300 min-w-[140px] border-2 border-secondary/20 hover:border-secondary hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-mint rounded-2xl flex items-center justify-center shadow-soft">
                  <Shirt className="w-8 h-8 text-secondary-foreground" />
                </div>
                <span className="text-base font-bold text-foreground">👕 محلات ملابس الأطفال</span>
              </Link>
            </div>
          </div>

          {/* Children Images Section */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="relative group">
                <img
                  src={childrenPlaying}
                  alt="أطفال يلعبون"
                  className="w-40 h-40 rounded-3xl object-cover shadow-card border-4 border-card group-hover:scale-105 group-hover:rotate-3 transition-all duration-300"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center animate-bounce-soft shadow-soft">
                  <span className="text-lg">🎨</span>
                </div>
              </div>
              <div className="relative group">
                <img
                  src={childrenLearning}
                  alt="أطفال يتعلمون"
                  className="w-40 h-40 rounded-3xl object-cover shadow-card border-4 border-card group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300"
                />
                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center animate-bounce-soft shadow-soft" style={{ animationDelay: '0.5s' }}>
                  <span className="text-lg">📚</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
