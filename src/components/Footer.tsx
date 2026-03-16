import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logoIcon from '@/assets/logo-icon.png';
import { PricingModal, FAQModal, RegisterInfoModal, DashboardInfoModal } from './InfoModals';

const Footer = () => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-primary-foreground/20">
                <img src={logoIcon} alt="روضتي" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl leading-tight">
                  <span className="text-pink-500 font-arabic">روضتي</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 mb-6 leading-relaxed">
              منصتك الموثوقة للعثور على أفضل روضات الأطفال في روضتي. 🎈
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/روضتي.mascara"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-all duration-300 hover:scale-110"
                title="صفحتنا على فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/روضتي.mascara"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-coral/20 flex items-center justify-center hover:bg-coral/40 transition-all duration-300 hover:scale-110"
                title="حسابنا على انستغرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.x.com/روضتي_mascara"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-sky-light/20 flex items-center justify-center hover:bg-sky-light/40 transition-all duration-300 hover:scale-110"
                title="حسابنا على تويتر"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-lg mb-5 text-accent">🔗 روابط سريعة</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">الرئيسية</Link></li>
              <li><Link to="/kindergartens" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">جميع الروضات</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">من نحن</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="font-extrabold text-lg mb-5 text-secondary">🏫 لأصحاب الروضات</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70 flex flex-col items-start">
              <li>
                <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  سجل روضتك
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsDashboardOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  لوحة التحكم
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsPricingOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  الأسعار
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsFAQOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  الأسئلة الشائعة
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-extrabold text-lg mb-5 text-coral">📞 تواصل معنا</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>روضتي، الجزائر 🇩🇿</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary-foreground" />
                </div>
                <a href="tel:0798960780" className="hover:text-primary-foreground transition-colors" dir="ltr">0798960780</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-coral/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>contact@روضتي.dz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} روضتي. جميع الحقوق محفوظة 💕
          </p>
        </div>
      </div>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      <RegisterInfoModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <DashboardInfoModal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
    </footer>
  );
};

export default Footer;
