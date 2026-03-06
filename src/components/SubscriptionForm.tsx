import { useState } from 'react';
import { CreditCard, Calendar, Check, X, Info, Crown, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  price: number;
  period: 'monthly' | 'yearly';
  periodAr: string;
  periodFr: string;
  features: string[];
  featuresAr: string[];
  featuresFr: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const SubscriptionForm = ({ isOpen, onClose, userId, userEmail, userName }: SubscriptionFormProps) => {
  const { language, dir } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: userName || '',
    email: userEmail || '',
    agreeTerms: false
  });

  const plans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      nameAr: 'شهري',
      nameFr: 'Mensuel',
      price: 2999,
      period: 'monthly',
      periodAr: 'شهري',
      periodFr: 'mensuel',
      features: [
        'Access to all kindergartens',
        'Unlimited registration requests',
        'Priority support',
        'Advanced search filters'
      ],
      featuresAr: [
        'الوصول لجميع الروضات',
        'طلبات تسجيل غير محدودة',
        'دعم أولوي',
        'فلاتر بحث متقدمة'
      ],
      featuresFr: [
        'Accès à toutes les crèches',
        'Demandes d\'inscription illimitées',
        'Support prioritaire',
        'Filtres de recherche avancés'
      ],
      icon: <Calendar className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'yearly',
      name: 'Yearly',
      nameAr: 'سنوي',
      nameFr: 'Annuel',
      price: 29990,
      period: 'yearly',
      periodAr: 'سنوي',
      periodFr: 'annuel',
      features: [
        'Everything in Monthly',
        'Save 20% annually',
        'Exclusive kindergarten insights',
        'Early access to new features',
        'Personalized recommendations'
      ],
      featuresAr: [
        'كل شيء في الباقة الشهرية',
        'وفر 20% سنوياً',
        'رؤى حصرية للروضات',
        'وصول مبكر للميزات الجديدة',
        'توصيات مخصصة'
      ],
      featuresFr: [
        'Tout dans l\'abonnement mensuel',
        'Économisez 20% par an',
        'Aperçus exclusifs des crèches',
        'Accès anticipé aux nouvelles fonctionnalités',
        'Recommandations personnalisées'
      ],
      popular: true,
      icon: <Crown className="w-5 h-5" />,
      color: 'amber'
    }
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast.error(language === 'ar' 
        ? 'يجب الموافقة على الشروط والأحكام' 
        : 'Vous devez accepter les conditions générales');
      return;
    }

    setLoading(true);

    try {
      // Get current user if not provided
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = userId || user?.id;

      if (!currentUserId) {
        throw new Error('User not authenticated');
      }

      // Create subscription record
      const { error } = await supabase
        .from('platform_subscriptions')
        .insert({
          id: crypto.randomUUID(),
          user_id: currentUserId,
          plan_type: selectedPlan as 'monthly' | 'yearly',
          price: plans.find(p => p.id === selectedPlan)?.price || 0,
          status: 'active' as const,
          start_date: new Date().toISOString(),
          end_date: selectedPlan === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: 'card',
          card_last_four: formData.cardNumber.slice(-4),
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast.success(language === 'ar' 
        ? 'تم تفعيل الاشتراك بنجاح! شكراً لثقتك بمنصتنا.' 
        : 'Abonnement activé avec succès! Merci de votre confiance.');

      // Reset form
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: userName || '',
        email: userEmail || '',
        agreeTerms: false
      });

      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(language === 'ar' 
        ? 'حدث خطأ أثناء تفعيل الاشتراك. يرجى المحاولة مرة أخرى.' 
        : 'Une erreur est survenue lors de l\'activation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative bg-card rounded-3xl shadow-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors shadow-soft`}
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 rounded-t-3xl">
          <div className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-full">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? 'اشتراك المنصة المميز' : 'Abonnement Premium'}
              </h2>
              <p className="text-primary-foreground/80">
                {language === 'ar' ? 'احصل على أفضل تجربة لبحث وتسجيل أطفالك في الروضات' : 'Obtenez la meilleure expérience pour trouver et inscrire vos enfants'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Plans Selection */}
          <div>
            <h3 className={`text-lg font-bold text-foreground mb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? 'اختر الباقة المناسبة' : 'Choisissez votre abonnement'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                {plan.popular && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                      {language === 'ar' ? 'الأكثر شعبية' : 'Populaire'}
                    </Badge>
                  </div>
                )}
                <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedPlan === plan.id 
                    ? `ring-2 ring-${plan.color === 'amber' ? 'amber' : 'blue'}-500 border-${plan.color === 'amber' ? 'amber' : 'blue'}-500` 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPlan(plan.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-${plan.color === 'amber' ? 'amber' : 'blue'}-100 text-${plan.color === 'amber' ? 'amber' : 'blue'}-600`}>
                          {plan.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">
                            {language === 'ar' ? plan.nameAr : plan.nameFr}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? plan.periodAr : plan.periodFr}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">{plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">{language === 'ar' ? 'دج' : 'DA'}</span>
                        <span className="text-sm text-muted-foreground">/{language === 'ar' ? plan.periodAr : plan.periodFr}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(language === 'ar' ? plan.featuresAr : plan.featuresFr).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          </div>

          <Separator />

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className={`text-lg font-bold text-foreground mb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'معلومات الدفع' : 'Informations de paiement'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber">{language === 'ar' ? 'رقم البطاقة' : 'Numéro de carte'}</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    maxLength={19}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiryDate">{language === 'ar' ? 'تاريخ الانتهاء' : "Date d'expiration"}</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    maxLength={5}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    maxLength={3}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="cardholderName">{language === 'ar' ? 'اسم حامل البطاقة' : 'Nom du titulaire'}</Label>
                  <Input
                    id="cardholderName"
                    type="text"
                    placeholder={language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed'}
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                className="mt-1"
                required
              />
              <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground cursor-pointer">
                {language === 'ar' 
                  ? 'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بالمنصة' 
                  : 'J\'accepte les conditions générales et la politique de confidentialité de la plateforme'
                }
              </Label>
            </div>

            {/* Order Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className={`font-bold text-foreground mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'ملخص الطلب' : 'Résumé de la commande'}
                </h4>
                <div className="space-y-2">
                  <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-muted-foreground">
                      {language === 'ar' ? selectedPlanData?.nameAr : selectedPlanData?.nameFr}
                    </span>
                    <span className="font-medium">{selectedPlanData?.price.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}</span>
                  </div>
                  <Separator />
                  <div className={`flex justify-between text-lg font-bold ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-primary">{selectedPlanData?.price.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 gradient-primary border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {language === 'ar' ? 'جاري المعالجة...' : 'Traitement en cours...'}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {language === 'ar' ? 'تفعيل الاشتراك الآن' : 'Activer l\'abonnement maintenant'}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
