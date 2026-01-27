import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoIcon from '@/assets/logo-icon.png';

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-primary-foreground/20">
                <img src={logoIcon} alt="روضتي معسكر" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl leading-tight text-primary-foreground">روضتي</span>
                <span className="text-sm font-semibold text-primary-foreground/70 leading-tight">معسكر</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 mb-6 leading-relaxed">
              منصتك الموثوقة للعثور على أفضل روضات الأطفال في ولاية معسكر. 🎈
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/rawdati.mascara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-all duration-300 hover:scale-110"
                title="صفحتنا على فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/rawdati.mascara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-coral/20 flex items-center justify-center hover:bg-coral/40 transition-all duration-300 hover:scale-110"
                title="حسابنا على انستغرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.x.com/rawdati_mascara" 
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
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/register-kindergarten" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">سجل روضتك</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">لوحة التحكم</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">الأسعار</Link></li>
              <li><Link to="/faq" className="hover:text-primary-foreground hover:pr-2 transition-all duration-300">الأسئلة الشائعة</Link></li>
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
                <span>معسكر، الجزائر 🇩🇿</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary-foreground" />
                </div>
                <span dir="ltr">+213 45 XX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-coral/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>contact@rawdati.dz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} روضتي معسكر. جميع الحقوق محفوظة 💕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
