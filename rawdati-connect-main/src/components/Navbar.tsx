import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoIcon from '@/assets/logo-icon.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-card/90 backdrop-blur-md border-b-2 border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-soft group-hover:shadow-hover transition-all duration-300 group-hover:scale-105 border-2 border-primary/20">
              <img src={logoIcon} alt="روضتي معسكر" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-primary leading-tight">روضتي</span>
              <span className="text-sm font-semibold text-secondary leading-tight">معسكر</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-bold text-lg hover:scale-105"
            >
              الرئيسية
            </Link>
            <Link 
              to="/kindergartens" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-bold text-lg hover:scale-105"
            >
              الروضات
            </Link>
            <Link 
              to="/about" 
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-bold text-lg hover:scale-105"
            >
              من نحن
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="lg" className="gap-2 rounded-full font-bold hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <User className="w-5 h-5" />
                <span>دخول الأولياء</span>
              </Button>
            </Link>
            <Link to="/owner-auth">
              <Button size="lg" className="gap-2 gradient-accent border-0 rounded-full shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold hover:scale-105">
                <Building2 className="w-5 h-5" />
                <span>مساحة المديرين</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-2xl hover:bg-primary/10 transition-colors border-2 border-primary/20"
          >
            {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t-2 border-primary/20 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all font-bold text-lg"
                onClick={() => setIsOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                to="/kindergartens" 
                className="px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all font-bold text-lg"
                onClick={() => setIsOpen(false)}
              >
                الروضات
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all font-bold text-lg"
                onClick={() => setIsOpen(false)}
              >
                من نحن
              </Link>
              <div className="border-t-2 border-primary/20 pt-4 mt-2 flex flex-col gap-3">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="justify-start gap-2 w-full rounded-2xl font-bold text-lg py-6">
                    <User className="w-5 h-5" />
                    <span>دخول الأولياء</span>
                  </Button>
                </Link>
                <Link to="/owner-auth" onClick={() => setIsOpen(false)}>
                  <Button className="justify-start gap-2 gradient-accent border-0 w-full rounded-2xl font-bold text-lg py-6">
                    <Building2 className="w-5 h-5" />
                    <span>مساحة المديرين</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
