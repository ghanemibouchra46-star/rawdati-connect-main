import { useState } from 'react';
import { CreditCard, Calendar, Hash, Banknote, CheckCircle2, Wallet, ArrowRight, Upload, Camera, ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type PaymentStep = 'selection' | 'details' | 'upload';
type PaymentMethod = 'edahabia' | 'baridimob';

const PaymentOrder = ({ orderId, date, amount, status, kindergarten, onClose }: PaymentOrderProps) => {
  const { t, language, dir } = useLanguage();
  const [step, setStep] = useState<PaymentStep>('selection');
  const [method, setMethod] = useState<PaymentMethod>('edahabia');
  const [receipt, setReceipt] = useState<File | null>(null);

  const handleNext = () => {
    if (step === 'selection') setStep('details');
    else if (step === 'details') setStep('upload');
  };

  const handleBack = () => {
    if (step === 'details') setStep('selection');
    else if (step === 'upload') setStep('details');
  };

  const renderSelection = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
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
          <label className={`relative flex items-center p-4 cursor-pointer rounded-xl border transition-all bg-card group shadow-sm ${method === 'edahabia' ? 'border-primary' : 'border-border'}`}>
            <input 
              type="radio" 
              name="paymentOption" 
              className="sr-only" 
              checked={method === 'edahabia'} 
              onChange={() => setMethod('edahabia')}
            />
            {method === 'edahabia' && <div className="absolute inset-0 border-2 border-primary rounded-xl" />}
            
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
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${method === 'edahabia' ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </label>

          <label className={`relative flex items-center p-4 cursor-pointer rounded-xl border transition-all bg-card group shadow-sm ${method === 'baridimob' ? 'border-primary' : 'border-border'}`}>
            <input 
              type="radio" 
              name="paymentOption" 
              className="sr-only" 
              checked={method === 'baridimob'} 
              onChange={() => setMethod('baridimob')}
            />
            {method === 'baridimob' && <div className="absolute inset-0 border-2 border-primary rounded-xl" />}
            
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
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${method === 'baridimob' ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button 
          onClick={handleNext}
          className="w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg gap-2"
        >
          <CreditCard className="w-5 h-5" />
          {t('payment.payNow')}
        </Button>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${method === 'edahabia' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
          {method === 'edahabia' ? <CreditCard className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-bold text-foreground">{method === 'edahabia' ? t('payment.edahabia') : t('payment.baridimob')}</h3>
          <p className="text-xs text-muted-foreground">{t('payment.pending')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('payment.cardHolder')}</label>
          <Input placeholder="JEAN DUPONT" className="h-12 bg-muted/30 border-border focus:ring-primary" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('payment.cardNumber')}</label>
          <div className="relative">
            <Input placeholder="6280 0000 0000 0000" className="h-12 bg-muted/30 border-border focus:ring-primary pr-10" />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('payment.expiryDate')}</label>
            <Input placeholder="MM/YY" className="h-12 bg-muted/30 border-border focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('payment.cvv')}</label>
            <div className="relative">
              <Input placeholder="123" type="password" maxLength={3} className="h-12 bg-muted/30 border-border focus:ring-primary pr-10" />
              <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 flex gap-3 text-xs text-secondary items-start">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{language === 'ar' ? 'يتم تأمين العملية عبر نظام بريد الجزائر المشفر.' : 'La transaction est sécurisée par le système crypté d\'Algérie Poste.'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button 
          onClick={handleNext}
          className="w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          {t('payment.confirmPayment')}
        </Button>
        <Button variant="ghost" onClick={handleBack} className="w-full h-12 rounded-xl text-muted-foreground">
          {t('payment.back')}
        </Button>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <Camera className="w-10 h-10 text-primary" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-foreground">{t('payment.receiptTitle')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">
          {t('payment.receiptDesc')}
        </p>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${receipt ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) setReceipt(e.dataTransfer.files[0]);
        }}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={(e) => e.target.files?.[0] && setReceipt(e.target.files[0])}
          accept="image/*"
        />
        
        {receipt ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{receipt.name}</p>
            <button className="text-xs text-red-500 hover:underline" onClick={() => setReceipt(null)}>
              {language === 'ar' ? 'حذف' : 'Supprimer'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{t('payment.selectReceipt')}</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button 
          disabled={!receipt}
          onClick={onClose}
          className="w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg"
        >
          {t('payment.confirmPayment')}
        </Button>
        <Button variant="ghost" onClick={handleBack} className="w-full h-12 rounded-xl text-muted-foreground">
          {t('payment.back')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6" dir={dir}>
      {step === 'selection' && (
        <div className="text-center mb-4">
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
      )}

      {step === 'selection' && renderSelection()}
      {step === 'details' && renderDetails()}
      {step === 'upload' && renderUpload()}

      {step === 'selection' && (
        <Button variant="ghost" onClick={onClose} className="w-full h-12 rounded-xl text-muted-foreground">
          {t('modal.close')}
        </Button>
      )}
    </div>
  );
};

export default PaymentOrder;
