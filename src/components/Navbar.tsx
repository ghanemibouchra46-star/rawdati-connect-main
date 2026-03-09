import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import logoIcon from '@/assets/logo-icon.png';

const Navbar = () => {
  const { language, dir, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-soft group-hover:shadow-hover transition-all duration-300 group-hover:scale-105 border-2 border-primary">
              <img src={logoIcon} alt={t('platform.name')} className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl text-primary">
              {t('platform.name')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/kindergartens"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('nav.kindergartens')}
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('nav.about')}
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* Language Toggle + Shield */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-muted-foreground hover:text-foreground"
              >
                {language === 'ar' ? 'FR' : 'AR'}
              </Button>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:block">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </Button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      {language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'}
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      {language === 'ar' ? 'الملف الشخصي' : 'Profil'}
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary">
                    {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {language === 'ar' ? 'سجل الآن' : 'S\'inscrire'}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="py-4 space-y-4">
              <Link
                to="/"
                className="block text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/kindergartens"
                className="block text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.kindergartens')}
              </Link>
              <Link
                to="/about"
                className="block text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>

              {/* Mobile Auth */}
              {user ? (
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <Link
                    to="/dashboard"
                    className="block text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-border">
                  <Link
                    to="/auth"
                    className="block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="w-full border-primary/50 bg-primary/5 text-primary hover:bg-primary/10">
                      {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                    </Button>
                  </Link>
                  <Link
                    to="/auth"
                    className="block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {language === 'ar' ? 'سجل الآن' : 'S\'inscrire'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

