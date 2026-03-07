import { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Kindergarten } from '@/data/kindergartens';

interface PaymentProcessProps {
  kindergarten: Kindergarten;
  bookingData: any;
  onComplete?: () => void;
}

const PaymentProcess = ({ kindergarten, bookingData, onComplete }: PaymentProcessProps) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
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
      await new Promise(resolve => setTimeout(resolve, 3000));

      setCurrentStep(currentStep + 1);
      onComplete?.();
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
            <h3 className="text-lg font-semibold mb-4">{currentStepData?.title}</h3>
            <p className="text-muted-foreground mb-4">{currentStepData?.description}</p>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{kindergarten.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'ar' ? 'السعر' : 'Prix'}:</span>
                  <span className="text-2xl font-bold text-primary">{kindergarten.price || 0} {language === 'ar' ? 'دج' : 'MAD'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'ar' ? 'المدة' : 'Durée'}:</span>
                  <span className="font-semibold">{language === 'ar' ? 'شهر واحد' : '1 mois'}</span>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">{language === 'ar' ? 'معلومات الحجز' : 'Informations de réservation'}:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'اسم الطفل' : 'Nom de l\'enfant'}:</span>
                      <span className="font-medium">{bookingData?.childName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'عمر الطفل' : 'Âge de l\'enfant'}:</span>
                      <span className="font-medium">{bookingData?.childAge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'تاريخ الحجز' : 'Date de réservation'}:</span>
                      <span className="font-medium">{bookingData?.bookingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'وقت الحجز' : 'Heure de réservation'}:</span>
                      <span className="font-medium">{bookingData?.bookingTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                {language === 'ar' ? 'السابق' : 'Précédent'}
              </Button>
              <Button onClick={handleNext}>
                {language === 'ar' ? 'التالي' : 'Suivant'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{currentStepData?.title}</h3>
            <p className="text-muted-foreground mb-4">{currentStepData?.description}</p>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'معلومات البطاقة' : 'Informations de carte'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'اسم حامل البطاقة' : 'Nom du titulaire'}
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardHolderName}
                      onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم كما يظهر على البطاقة' : 'Nom comme il apparaît sur la carte'}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'رقم البطاقة' : 'Numéro de carte'}
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border rounded-md"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'Date d\'expiration'}
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border rounded-md"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 border rounded-md"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
              >
                {language === 'ar' ? 'السابق' : 'Précédent'}
              </Button>
              <Button onClick={handleNext}>
                {language === 'ar' ? 'التالي' : 'Suivant'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{currentStepData?.title}</h3>
            <p className="text-muted-foreground mb-4">{currentStepData?.description}</p>
            
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-600 mb-2">
                  {language === 'ar' ? 'تم تأكيد الحجز بنجاح!' : 'Réservation confirmée avec succès!'}
                </h4>
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'سيتم إرسال تأكيد الحجز إلى بريدك الإلكتروني' 
                    : 'Un email de confirmation a été envoyé à votre adresse email'
                  }
                </p>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">{language === 'ar' ? 'ملخص الحجز' : 'Résumé de la réservation'}:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'الروضة' : 'Crèche'}:</span>
                      <span className="font-medium">{kindergarten.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'التاريخ' : 'Date'}:</span>
                      <span className="font-medium">{bookingData?.bookingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'الوقت' : 'Heure'}:</span>
                      <span className="font-medium">{bookingData?.bookingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'الطفل' : 'Enfant'}:</span>
                      <span className="font-medium">{bookingData?.childName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'المبلغ' : 'Montant'}:</span>
                      <span className="font-medium">{kindergarten.price || 0} {language === 'ar' ? 'دج' : 'MAD'}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={onComplete} className="w-full mt-4">
                  {language === 'ar' ? 'إغلاق' : 'Fermer'}
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                step.id === currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id === currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id}
              </div>
              <span className="ml-2 text-sm">{step.title}</span>
            </div>
          ))}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default PaymentProcess;
