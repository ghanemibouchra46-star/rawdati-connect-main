import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Shield, Building2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const languageLabel = language === 'ar' ? 'DZ العربية' : language === 'fr' ? 'DZ Français' : 'DZ English';

  const navLinks = (
    <>
      <Link
        to="/"
        className="text-[#4a4a6a] hover:text-primary transition-colors font-medium"
      >
        {t('nav.home')}
      </Link>
      <Link
        to="/kindergartens"
        className="text-[#4a4a6a] hover:text-primary transition-colors font-medium"
      >
        {t('nav.kindergartens')}
      </Link>
      <Link
        to="/about"
        className="text-[#4a4a6a] hover:text-primary transition-colors font-medium"
      >
        {t('nav.about')}
      </Link>
    </>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Nav group: links, language pill, login, shield (يظهر يميناً في RTL) */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-6">
              {navLinks}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-4 py-2 bg-amber-50/90 border border-amber-200/80 text-[#4a4a6a] hover:bg-amber-100/90 transition-colors text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  <span>{languageLabel}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setLanguage('ar')} className="gap-2 cursor-pointer">
                  DZ العربية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fr')} className="gap-2 cursor-pointer">
                  DZ Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className="gap-2 cursor-pointer">
                  DZ English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-[#4a4a6a]">
                  <User className="w-4 h-4" />
                  <span className="hidden md:block truncate max-w-[120px]">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      {language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'}
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      {language === 'ar' ? 'الملف الشخصي' : 'Profil'}
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-[#4a4a6a] hover:text-primary transition-colors font-medium text-sm">
                <User className="w-4 h-4" />
                <span>{t('nav.login')}</span>
              </Link>
            )}

            <Link to="/contact" className="text-[#4a4a6a] hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-muted/50">
              <Shield className="w-5 h-5" strokeWidth={1.5} />
            </Link>
          </div>

          {/* دخول الملاك (يظهر يساراً في RTL) */}
          <div className="flex items-center gap-2">
            <Link
              to="/owner-auth"
              className="hidden md:flex items-center gap-2 rounded-2xl px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 text-white font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all shrink-0"
            >
              <span>{t('nav.ownerLogin')}</span>
              <Building2 className="w-5 h-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-white py-4 space-y-4">
            {navLinks}
            <Link to="/owner-auth" className="flex items-center gap-2 rounded-2xl px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 text-white font-bold w-full justify-center">
              <span>{t('nav.ownerLogin')}</span>
              <Building2 className="w-5 h-5" />
            </Link>
            {!user && (
              <Link to="/auth" className="flex items-center gap-2 font-medium">
                <User className="w-4 h-4" />
                {t('nav.login')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
