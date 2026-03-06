import { useState } from 'react';
import { X, CreditCard, User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Kindergarten } from '@/data/kindergartens';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface PaymentModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ kindergarten, isOpen, onClose }: PaymentModalProps) => {
  const { t, language, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    ccp: '',
    address: '',
    message: ''
  });

  if (!isOpen || !kindergarten) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would integrate with your payment processor
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(language === 'ar' 
        ? 'تم إرسال طلب الاشتراك بنجاح! سنتواصل معك قريباً.' 
        : 'Demande d\'inscription envoyée avec succès! Nous vous contacterons bientôt.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        childName: '',
        childAge: '',
        ccp: '',
        address: '',
        message: ''
      });
      
      onClose();
    } catch (error) {
      toast.error(language === 'ar' 
        ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' 
        : 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const name = language === 'ar' ? kindergarten.nameAr : kindergarten.nameFr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative bg-card rounded-3xl shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors shadow-soft`}
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-t-3xl">
          <div className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-full">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? 'اشتراك في الروضة' : 'Inscription à la crèche'}
              </h2>
              <p className="text-amber-100">{name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Parent Information */}
          <div>
            <h3 className={`text-lg font-bold text-foreground mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <User className="w-5 h-5 text-primary" />
              {language === 'ar' ? 'معلومات ولي الأمر' : 'Informations du parent'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'الاسم' : 'Prénom'} *
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder={language === 'ar' ? 'أحمد' : 'Ahmed'}
                  required
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'اللقب' : 'Nom'} *
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder={language === 'ar' ? 'محمد' : 'Mohamed'}
                  required
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <Mail className="w-4 h-4 inline mr-1" />
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={language === 'ar' ? 'ahmed@example.com' : 'ahmed@example.com'}
                  required
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <Phone className="w-4 h-4 inline mr-1" />
                  {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'} *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={language === 'ar' ? '0551234567' : '0551234567'}
                  required
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
            </div>
          </div>

          {/* Child Information */}
          <div>
            <h3 className={`text-lg font-bold text-foreground mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <Calendar className="w-5 h-5 text-primary" />
              {language === 'ar' ? 'معلومات الطفل' : 'Informations de l\'enfant'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'اسم الطفل' : 'Nom de l\'enfant'} *
                </label>
                <Input
                  value={formData.childName}
                  onChange={(e) => handleInputChange('childName', e.target.value)}
                  placeholder={language === 'ar' ? 'سارة' : 'Sarah'}
                  required
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'عمر الطفل' : 'Âge de l\'enfant'} *
                </label>
                <Input
                  value={formData.childAge}
                  onChange={(e) => handleInputChange('childAge', e.target.value)}
                  placeholder={language === 'ar' ? '4 سنوات' : '4 ans'}
                  required
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className={`text-lg font-bold text-foreground mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <CreditCard className="w-5 h-5 text-primary" />
              {language === 'ar' ? 'معلومات الدفع' : 'Informations de paiement'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'رقم الحساب البريدي (CCP)' : 'Numéro de compte CCP'} *
                </label>
                <Input
                  value={formData.ccp}
                  onChange={(e) => handleInputChange('ccp', e.target.value)}
                  placeholder={language === 'ar' ? '1234567890123456' : '1234567890123456'}
                  required
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'العنوان' : 'Adresse'}
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={language === 'ar' ? 'معسكر، الجزائر' : 'Mascara, Algérie'}
                  className={dir === 'rtl' ? 'text-right' : 'text-left'}
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className={`block text-sm font-medium text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <FileText className="w-4 h-4 inline mr-1" />
              {language === 'ar' ? 'رسالة إضافية' : 'Message additionnel'}
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={language === 'ar' ? 'ملاحظات إضافية...' : 'Notes additionnelles...'}
              rows={3}
              className={dir === 'rtl' ? 'text-right' : 'text-left'}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
              disabled={loading}
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold"
              disabled={loading}
            >
              {loading 
                ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...')
                : (language === 'ar' ? 'إرسال طلب الاشتراك' : 'Envoyer la demande')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
