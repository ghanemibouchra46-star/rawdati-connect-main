import { CreditCard, Calendar, Hash, Banknote, CheckCircle2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Kindergarten } from '@/data/kindergartens';

interface PaymentOrderProps {
  orderId: string;
  date: string;
  amount: number;
  status: string;
  kindergarten: Kindergarten;
  onClose: () => void;
}

const PaymentOrder = ({ orderId, date, amount, status, kindergarten, onClose }: PaymentOrderProps) => {
  const { t, language, dir } = useLanguage();

  return (
    <div className="space-y-6 animate-scale-in" dir={dir}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {t('payment.orderTitle')}
        </h2>
        <p className="text-muted-foreground mt-1">
          {language === 'ar' 
            ? `شكراً لثقتك بـ ${kindergarten.name_ar}` 
            : `Merci de votre confiance en ${kindergarten.nameFr}`}
        </p>
      </div>

      <div className="bg-muted/30 rounded-2xl p-6 space-y-4 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Hash className="w-5 h-5" />
            <span>{t('payment.orderNumber')}</span>
          </div>
          <span className="font-mono font-bold text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span>{t('payment.date')}</span>
          </div>
          <span className="font-medium">{new Date(date).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5" />
            <span>{t('payment.status')}</span>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            {t('payment.pending')}
          </span>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3 text-foreground font-bold">
            <Banknote className="w-6 h-6 text-primary" />
            <span className="text-lg">{t('payment.amount')}</span>
          </div>
          <span className="text-2xl font-black text-primary">
            {amount} {language === 'ar' ? 'دج' : 'DA'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          {t('payment.method')}
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          <label className="relative flex items-center p-4 cursor-pointer rounded-xl border border-border hover:border-primary/50 transition-all bg-card group shadow-sm">
            <input type="radio" name="paymentOption" className="sr-only peer" defaultChecked />
            <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-xl transition-all" />
            
            <div className="flex items-center justify-between w-full z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
                  <span className="text-xl font-bold text-amber-600">Ed</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{t('payment.edahabia')}</p>
                  <p className="text-xs text-muted-foreground">Algérie Poste</p>
                </div>
              </div>
              <div className="w-5 h-5 border-2 border-muted-foreground rounded-full flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </label>

          <label className="relative flex items-center p-4 cursor-pointer rounded-xl border border-border hover:border-primary/50 transition-all bg-card group shadow-sm">
            <input type="radio" name="paymentOption" className="sr-only peer" />
            <div className="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-xl transition-all" />
            
            <div className="flex items-center justify-between w-full z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                  <span className="text-xl font-bold text-blue-600">BM</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{t('payment.baridimob')}</p>
                  <p className="text-xs text-muted-foreground">Baridi Mob App</p>
                </div>
              </div>
              <div className="w-5 h-5 border-2 border-muted-foreground rounded-full flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button className="w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg gap-2">
          <CreditCard className="w-5 h-5" />
          {t('payment.payNow')}
        </Button>
        <Button variant="ghost" onClick={onClose} className="w-full h-12 rounded-xl text-muted-foreground">
          {t('modal.close')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentOrder;
