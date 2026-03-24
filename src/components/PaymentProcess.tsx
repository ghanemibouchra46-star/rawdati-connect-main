import { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Kindergarten } from '@/data/kindergartens';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PaymentProcessProps {
  kindergarten: Kindergarten;
  bookingData: any;
  onComplete: () => void;
  onSuccess?: (txId: string) => void;
}

const PaymentProcess = ({ kindergarten, bookingData, onComplete, onSuccess }: PaymentProcessProps) => {
  const { language, dir } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'baridi'>('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    {
      id: 1,
      title: language === 'ar' ? 'تأكيد الطلب' : 'Confirmer la commande',
      description: language === 'ar' ? 'مراجعة معلومات الخدمة' : 'Vérifier les informations du service'
    },
    {
      id: 2,
      title: language === 'ar' ? 'طريقة الدفع' : 'Mode de paiement',
      description: language === 'ar' ? 'اختر الطريقة المناسبة لك' : 'Choisissez votre mode de paiement'
    },
    {
      id: 3,
      title: language === 'ar' ? 'معلومات الدفع' : 'Informations de paiement',
      description: language === 'ar' ? 'إتمام عملية الدفع' : 'Finaliser le paiement'
    },
    {
      id: 4,
      title: language === 'ar' ? 'تأكيد النجاح' : 'Succès',
      description: language === 'ar' ? 'تمت العملية بنجاح' : 'Opération réussie'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txId = 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      if (onSuccess) {
        onSuccess(txId);
      }
      
      handleNext();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Card className="border-none shadow-none bg-muted/30">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'ar' ? 'السعر الكلي' : 'Prix total'}:</span>
                  <span className="text-2xl font-black text-primary">{bookingData?.amount || kindergarten?.pricePerMonth || 0} {language === 'ar' ? 'دج' : 'DZD'}</span>
                </div>
                
                <div className="border-t border-border/50 pt-3 space-y-2">
                  <h4 className="font-semibold">{language === 'ar' ? 'التفاصيل' : 'Détails'}:</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {bookingData?.childName && (
                      <>
                        <span className="text-muted-foreground">{language === 'ar' ? 'الاسم' : 'Nom'}:</span>
                        <span className="font-medium text-right">{bookingData.childName}</span>
                      </>
                    )}
                    <span className="text-muted-foreground">{language === 'ar' ? 'الخدمة' : 'Service'}:</span>
                    <span className="font-medium text-right">
                      {bookingData?.serviceName || (language === 'ar' ? 'اشتراك شهري' : 'Abonnement mensuel')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => onComplete()} className="flex-1 rounded-xl">
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </Button>
              <Button onClick={handleNext} className="flex-[2] gradient-accent rounded-xl shadow-soft">
                {language === 'ar' ? 'متابعة' : 'Continuer'}
                <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-soft' : 'border-border/50 hover:border-primary/30'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-bold">{language === 'ar' ? 'البطاقة الذهبية / CIB' : 'Edahabia / CIB'}</p>
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'دفع آمن بالبطاقة البنكية' : 'Paiement sécurisé par carte'}</p>
                </div>
              </button>

              <button 
                onClick={() => setPaymentMethod('baridi')}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'baridi' ? 'border-primary bg-primary/5 shadow-soft' : 'border-border/50 hover:border-primary/30'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-amber-500" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-bold">{language === 'ar' ? 'بريدي موب' : 'Baridi Mob'}</p>
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'عبر تحويل بريدي مباشر' : 'Via virement postal direct'}</p>
                </div>
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handlePrevious} className="flex-1 rounded-xl">
                {language === 'ar' ? 'رجوع' : 'Retour'}
              </Button>
              <Button onClick={handleNext} className="flex-[2] gradient-accent rounded-xl shadow-soft">
                {language === 'ar' ? 'تأكيد الاختيار' : 'Confirmer'}
              </Button>
            </div>
          </div>
        );

      case 3:
        if (paymentMethod === 'card') {
          return (
            <div className="space-y-4">
              <Card className="border-none shadow-none bg-muted/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{language === 'ar' ? 'اسم حامل البطاقة' : 'Titulaire'}</label>
                    <input
                      type="text"
                      value={paymentData.cardHolderName}
                      onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                      className="w-full px-3 py-2 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{language === 'ar' ? 'رقم البطاقة' : 'Numéro'}</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-10 pr-3 py-2 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                        maxLength={19}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">MM/YY</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="w-full px-3 py-2 bg-background border rounded-lg text-center outline-none focus:ring-2 focus:ring-primary/20"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <input
                        type="password"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className="w-full px-3 py-2 bg-background border rounded-lg text-center outline-none focus:ring-2 focus:ring-primary/20"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handlePrevious} className="flex-1 rounded-xl">{language === 'ar' ? 'رجوع' : 'Retour'}</Button>
                <Button onClick={handleSubmit} disabled={isProcessing} className="flex-[2] gradient-accent rounded-xl">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إتمام الدفع' : 'Payer')}
                </Button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <Card className="border-none shadow-none bg-primary/5 border-2 border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{language === 'ar' ? 'رقم الحساب (RIP)' : 'Numéro RIP'}</p>
                    <p className="text-xl font-mono font-black text-primary tracking-tighter">007 99999 0012345678 90</p>
                    <div className="pt-2">
                      <p className="text-sm font-bold">Rawdati Connect SARL</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">1</div>
                      <p>{language === 'ar' ? 'قم بنسخ رقم الـ RIP أعلاه' : 'Copiez le numéro RIP ci-dessus'}</p>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">2</div>
                      <p>{language === 'ar' ? 'حول المبلغ عبر تطبيق بريدي موب أو مكتب البريد' : 'Transférez via Baridi Mob ou la Poste'}</p>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">3</div>
                      <p>{language === 'ar' ? 'اضغط على زر "تأكيد التحويل" أدناه' : 'Veuillez cliquer sur "Confirmer" après le transfert'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handlePrevious} className="flex-1 rounded-xl">{language === 'ar' ? 'رجوع' : 'Retour'}</Button>
                <Button onClick={handleSubmit} disabled={isProcessing} className="flex-[2] gradient-accent rounded-xl shadow-soft">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'تأكيد التحويل' : 'Confirmer')}
                </Button>
              </div>
            </div>
          );
        }

      case 4:
        return (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-mint/10 flex items-center justify-center mx-auto animate-bounce-subtle">
              <CheckCircle className="w-10 h-10 text-mint" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-foreground">{language === 'ar' ? 'تمت العملية بنجاح!' : 'Succès !'}</h4>
              <p className="text-muted-foreground px-6 text-sm">
                {language === 'ar' 
                  ? 'شكراً لك. سنقوم بمراجعة طلبك وتفعيل الخدمة في أقرب وقت ممكن.' 
                  : 'Merci. Nous allons examiner votre demande و تفعيل الخدمة قريباً.'}
              </p>
            </div>
            
            <div className="px-6">
              <Button onClick={() => onComplete()} className="w-full gradient-accent h-12 text-lg rounded-2xl shadow-soft">
                {language === 'ar' ? 'إغلاق' : 'Fermer'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onComplete()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl" dir={dir}>
        <DialogHeader className="p-6 pb-2 text-center">
          <DialogTitle className="text-xl font-black">{steps.find(s => s.id === currentStep)?.title}</DialogTitle>
          <DialogDescription>{steps.find(s => s.id === currentStep)?.description}</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step.id === currentStep ? 'w-8 bg-primary shadow-soft' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {renderStep()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProcess;

