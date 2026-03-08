import { useState } from 'react';
import { X, CreditCard, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Kindergarten } from '@/data/kindergartens';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PaymentProcess from '@/components/PaymentProcess';

interface PaymentModalProps {
  kindergarten: Kindergarten;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ kindergarten, isOpen, onClose }: PaymentModalProps) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    ccp: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Vous devez vous connecter d\'abord');
        return;
      }

      const subscriptionData = {
        kindergarten_id: kindergarten.id,
        parent_id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        child_name: formData.childName,
        child_age: formData.childAge,
        ccp: formData.ccp,
        address: formData.address,
        status: 'pending'
      };

      const { error } = await supabase
        .from('subscription_requests')
        .insert(subscriptionData);

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم إرسال طلب الاشتراك بنجاح' : 'Demande d\'inscription envoyée avec succès');
      setCurrentStep(2);
    } catch (error) {
      console.error('Error submitting subscription:', error);
      toast.error(language === 'ar' ? 'فشل في إرسال الطلب' : 'Échec de l\'envoi de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const bookingData = {
    parentName: `${formData.firstName} ${formData.lastName}`,
    parentEmail: formData.email,
    parentPhone: formData.phone,
    childName: formData.childName,
    bookingTime: new Date().toLocaleTimeString(),
    ...formData
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {language === 'ar' ? 'طلب الاشتراك' : 'Demande d\'inscription'} - {kindergarten.name}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{language === 'ar' ? 'الاسم الأول' : 'Prénom'}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">{language === 'ar' ? 'الاسم الأخير' : 'Nom'}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">{language === 'ar' ? 'الهاتف' : 'Téléphone'}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="childName">{language === 'ar' ? 'اسم الطفل' : 'Nom de l\'enfant'}</Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => handleInputChange('childName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="childAge">{language === 'ar' ? 'عمر الطفل' : 'Âge de l\'enfant'}</Label>
                <Input
                  id="childAge"
                  value={formData.childAge}
                  onChange={(e) => handleInputChange('childAge', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ccp">{language === 'ar' ? 'رقم البطاقة الوطنية' : 'Numéro de carte nationale'}</Label>
              <Input
                id="ccp"
                value={formData.ccp}
                onChange={(e) => handleInputChange('ccp', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">{language === 'ar' ? 'العنوان' : 'Adresse'}</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...') : (language === 'ar' ? 'إرسال الطلب' : 'Envoyer la demande')}
              </Button>
            </div>
          </form>
        ) : (
          <PaymentProcess
            kindergarten={kindergarten}
            bookingData={bookingData}
            onComplete={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;