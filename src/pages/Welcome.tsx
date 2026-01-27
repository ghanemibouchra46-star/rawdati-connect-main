import { useNavigate } from 'react-router-dom';
import { Baby } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const languages = [
    {
      code: 'ar' as const,
      name: 'العربية',
      flag: '🇩🇿',
      welcome: 'مرحباً',
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-teal-700'
    },
    {
      code: 'fr' as const,
      name: 'Français',
      flag: '🇫🇷',
      welcome: 'Bienvenue',
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'hover:from-blue-600 hover:to-indigo-700'
    },
    {
      code: 'en' as const,
      name: 'English',
      flag: '🇬🇧',
      welcome: 'Welcome',
      gradient: 'from-rose-500 to-pink-600',
      hoverGradient: 'hover:from-rose-600 hover:to-pink-700'
    }
  ];

  const handleLanguageSelect = (languageCode: 'ar' | 'fr' | 'en') => {
    setLanguage(languageCode);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Stars effect */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl animate-bounce">
            <Baby className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-pink-400 to-accent bg-clip-text text-transparent">
              روضتي
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto">
            Kindergarten Platform | منصة الروضات | Plateforme des Jardins d'Enfants
          </p>
        </div>

        {/* Language Selection */}
        <div className="w-full max-w-lg">
          <h2 className="text-center text-white/80 text-lg mb-6 font-medium">
            اختر لغتك • Choisissez votre langue • Choose your language
          </h2>

          <div className="space-y-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r ${lang.gradient} ${lang.hoverGradient} p-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-${lang.code === 'ar' ? 'emerald' : lang.code === 'fr' ? 'blue' : 'rose'}-500/25`}
              >
                <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl px-6 py-5 flex items-center justify-between transition-all duration-300 group-hover:bg-slate-900/30">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{lang.flag}</span>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{lang.name}</p>
                      <p className="text-sm text-white/70">{lang.welcome}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Mascara, Algeria 🇩🇿
          </p>
          <p className="text-gray-600 text-xs mt-2">
            © 2024 Rawdati - روضتي
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
