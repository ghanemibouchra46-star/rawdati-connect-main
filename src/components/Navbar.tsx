import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { language, dir, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      toast({
        title: t('auth.loading'),
      });
      await logout();
      // Use window.location as a more robust way to ensure a fresh state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: force clear and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };


  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo size="md" />
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
              <LanguageSelector />
              <Link to="/admin-auth">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all duration-300" title={t('admin.title')}>
                  <Shield className="w-5 h-5 text-red-500" />
                </Button>
              </Link>
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
                      to="/parent"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      {t('parent.title')}
                    </Link>
                    <Link
                      to="/parent/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      {t('parent.settings')}
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-start px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 ml-2" />
                      {t('admin.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2 rounded-full font-bold hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">{t('auth.login')}</span>
                  </Button>
                </Link>
                <Link to="/owner-auth">
                  <Button size="sm" className="gap-2 gradient-accent border-0 rounded-full shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold hover:scale-105">
                    <Building2 className="w-4 h-4" />
                    <span className="hidden lg:inline">{t('nav.ownerLogin')}</span>
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
                    to="/parent"
                    className="block text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('parent.title')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('admin.logout')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-border">
                  <Link
                    to="/admin-auth"
                    className="block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="ghost" className="justify-start gap-2 w-full rounded-2xl font-bold py-6 text-red-500 hover:bg-red-500/10 hover:text-red-600 border border-red-100">
                      <Shield className="w-5 h-5" />
                      {t('admin.title')}
                    </Button>
                  </Link>
                  <Link
                    to="/auth"
                    className="block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="justify-start gap-2 w-full rounded-2xl font-bold py-6 border-primary/50 bg-primary/5 text-primary hover:bg-primary/10">
                      <User className="w-5 h-5" />
                      {t('auth.login')}
                    </Button>
                  </Link>
                  <Link
                    to="/owner-auth"
                    className="block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="justify-start gap-2 gradient-accent border-0 w-full rounded-2xl font-bold py-6 text-primary-foreground">
                      <Building2 className="w-5 h-5" />
                      {t('nav.ownerLogin')}
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

