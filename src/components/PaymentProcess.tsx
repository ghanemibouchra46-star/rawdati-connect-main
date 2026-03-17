import { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, X } from 'lucide-react';
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
}

const PaymentProcess = ({ kindergarten, bookingData, onComplete }: PaymentProcessProps) => {
  const { language, dir } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // ... (rest of the steps and handlers remain the same until render)

  const steps = [
    {
      id: 1,
      title: language === 'ar' ? 'تأكيد الحجز' : 'Confirmer la réservation',
      description: language === 'ar' ? 'مراجعة معلومات الحجز' : 'Vérifier les informations de réservation'
    },
    {
      id: 2,
      title: language === 'ar' ? 'معلومات الدفع' : 'Informations de paiement',
      description: language === 'ar' ? 'إدخال معلومات البطاقة' : 'Entrer les informations de carte'
    },
    {
      id: 3,
      title: language === 'ar' ? 'تأكيد الدفع' : 'Confirmer le paiement',
      description: language === 'ar' ? 'مراجعة وتأكيد عملية الدفع' : 'Vérifier et confirmer le paiement'
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
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // We pass a dummy transaction ID for simulation
      const txId = 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      handleNext();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    const currentStepData = steps.find(step => step.id === currentStep);

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Card className="border-none shadow-none bg-muted/30">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'ar' ? 'السعر' : 'Prix'}:</span>
                  <span className="text-2xl font-bold text-primary">{bookingData?.amount || kindergarten.pricePerMonth || 0} {language === 'ar' ? 'دج' : 'DZD'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'ar' ? 'المدة' : 'Durée'}:</span>
                  <span className="font-semibold">{language === 'ar' ? 'شهر واحد' : '1 mois'}</span>
                </div>

                <div className="border-t border-border/50 pt-3">
                  <h4 className="font-semibold mb-2">{language === 'ar' ? 'معلومات الحجز' : 'Informations de réservation'}:</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">{language === 'ar' ? 'اسم الطفل' : 'Nom de l\'enfant'}:</span>
                    <span className="font-medium text-right">{bookingData?.childName}</span>
                    
                    <span className="text-muted-foreground">{language === 'ar' ? 'الشهر' : 'Mois'}:</span>
                    <span className="font-medium text-right">{bookingData?.month}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} className="w-full md:w-auto gradient-accent">
                {language === 'ar' ? 'تأكيد ومتابعة' : 'Confirmer et continuer'}
                <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Card className="border-none shadow-none bg-muted/30">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'اسم حامل البطاقة' : 'Nom du titulaire'}
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم كما يظهر على البطاقة' : 'Nom sur la بطاقة'}
                    className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'رقم البطاقة' : 'Numéro de carte'}
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full pl-10 pr-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'Date d\'expiration'}
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="***"
                      className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1"
              >
                {language === 'ar' ? 'رجوع' : 'Retour'}
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isProcessing}
                className="flex-[2] gradient-accent"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {language === 'ar' ? 'جاري المعالجة...' : 'Traitement...'}
                  </span>
                ) : (
                  <>
                    {language === 'ar' ? 'دفع الآان' : 'Payer maintenant'}
                    <CreditCard className={`w-4 h-4 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center py-6 space-y-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-mint/10 flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-mint" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-mint text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'تمت عملية الدفع!' : 'Paiement réussi !'}
              </h4>
              <p className="text-muted-foreground px-6">
                {language === 'ar' 
                  ? 'شكراً لك. تم تأكيد دفع رسوم اشتراك طفلك بنجاح.' 
                  : 'Merci. Le paiement des frais d\'inscription de votre enfant a été confirmé.'
                }
              </p>
            </div>
            
            <Card className="mx-6 bg-muted/30 border-none shadow-none">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ar' ? 'الطفل' : 'Enfant'}:</span>
                  <span className="font-semibold">{bookingData?.childName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ar' ? 'المبلغ' : 'Montant'}:</span>
                  <span className="font-semibold text-primary">{bookingData?.amount} دج</span>
                </div>
              </CardContent>
            </Card>

            <div className="px-6">
              <Button onClick={() => onComplete()} className="w-full gradient-accent h-12 text-lg">
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden" dir={dir}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {steps.find(s => s.id === currentStep)?.title}
          </DialogTitle>
          <DialogDescription>
            {steps.find(s => s.id === currentStep)?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step) => (
              <div
                key={step.id}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.id <= currentStep ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id}
              </div>
            ))}
          </div>
          
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProcess;


export default PaymentProcess;
