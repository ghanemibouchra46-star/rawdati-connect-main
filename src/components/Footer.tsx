import { Mail, Phone, MapPin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Logo from './Logo';
import { PricingModal, FAQModal, RegisterInfoModal, DashboardInfoModal, ContactModal } from './InfoModals';

import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, dir } = useLanguage();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center group mb-6">
              <Logo size="md" className="text-primary-foreground" />
            </Link>
            <p className="text-sm text-primary-foreground/70 mb-6 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61579605182708"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-all duration-300 hover:scale-110"
                title={t('footer.facebookTitle')}
              >
                <Facebook className="w-5 h-5" />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-lg mb-5 text-accent">🔗 {t('footer.quickLinks')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">{t('footer.home')}</Link></li>
              <li><Link to="/kindergartens" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">{t('footer.allKindergartens')}</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">{t('footer.aboutUs')}</Link></li>
              <li>
                <button 
                  onClick={() => setIsContactOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right"
                >
                  {t('footer.contactUs')}
                </button>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="font-extrabold text-lg mb-5 text-secondary">🏫 {t('footer.forOwners')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70 flex flex-col items-start">
              <li>
                <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  {t('footer.registerYourKg')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsDashboardOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  {t('footer.dashboard')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsPricingOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  {t('footer.pricing')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsFAQOpen(true)}
                  className="hover:text-primary-foreground hover:pr-2 transition-all duration-300 text-right w-full"
                >
                  {t('footer.faq')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-extrabold text-lg mb-5 text-coral">📞 {t('footer.contact')}</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>{t('footer.location')}</span>
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
                <span>Rawdati245@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} روضتي. {t('footer.rights')} 💕
          </p>
        </div>
      </div>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      <RegisterInfoModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <DashboardInfoModal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
};

export default Footer;
