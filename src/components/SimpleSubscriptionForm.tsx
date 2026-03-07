import { useState } from 'react';
import { Crown, Calendar, Check, X, Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SimpleSubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

const SimpleSubscriptionForm = ({ isOpen, onClose, userId, userEmail, userName }: SimpleSubscriptionFormProps) => {
  const { language, dir } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: userName?.split(' ')[0] || '',
    lastName: userName?.split(' ')[1] || '',
    email: userEmail || '',
    phone: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === 'ar' 
          ? 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت' 
          : 'Fichier trop volumineux. Taille maximale 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error(language === 'ar' 
          ? 'يرجى رفع صورة فقط' 
          : 'Veuillez télécharger une image uniquement');
        return;
      }
      
      setPaymentProof(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentProof) {
      toast.error(language === 'ar' 
        ? 'يرجى رفع وصل الدفع' 
        : 'Veuillez télécharger le reçu de paiement');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error(language === 'ar' 
        ? 'يرجى ملء جميع الحقول المطلوبة' 
        : 'Veuillez remplir tous les champs obligatoires');
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

      // Upload payment proof
      let proofUrl = '';
      if (paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${currentUserId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(fileName, paymentProof);
        
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(fileName);
        
        proofUrl = publicUrl;
      }

      // Create subscription record
      const { error } = await supabase
        .from('platform_subscriptions')
        .insert({
          id: crypto.randomUUID(),
          user_id: currentUserId,
          plan_type: selectedPlan,
          price: selectedPlan === 'yearly' ? 29990 : 2999,
          status: 'pending',
          start_date: new Date().toISOString(),
          end_date: selectedPlan === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: 'ccp',
          payment_proof_url: proofUrl,
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast.success(language === 'ar' 
        ? 'تم إرسال طلب الاشتراك بنجاح! سيتم مراجعة وصل الدفع وتفعيل اشتراكك قريباً.' 
        : 'Demande d\'abonnement envoyée avec succès! Le reçu sera vérifié et votre abonnement sera activé prochainement.');

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: ''
      });
      setPaymentProof(null);
      setSelectedPlan('monthly');

      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
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
                {language === 'ar' ? 'احصل على أفضل تجربة للبحث وتسجيل أطفالك في الروضات' : 'Obtenez la meilleure expérience pour trouver et inscrire vos enfants'}
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
              {/* Monthly Plan */}
              <div className={`cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl p-4 border-2 ${
                selectedPlan === 'monthly' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-border hover:border-blue-500/50 bg-card'
              }`}
              onClick={() => setSelectedPlan('monthly')}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {language === 'ar' ? 'الباقة الشهرية' : 'Abonnement mensuel'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'مثالية للاستخدام القصير' : 'Idéal pour une utilisation à court terme'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">2,999</span>
                    <span className="text-muted-foreground">{language === 'ar' ? 'دج/شهر' : 'DA/mois'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-muted-foreground">{language === 'ar' ? 'الوصول لجميع الروضات' : 'Accès à toutes les crèches'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-muted-foreground">{language === 'ar' ? 'طلبات تسجيل غير محدودة' : 'Demandes d\'inscription illimitées'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-muted-foreground">{language === 'ar' ? 'دعم أولوي' : 'Support prioritaire'}</span>
                  </div>
                </div>
              </div>

              {/* Yearly Plan */}
              <div className={`cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl p-4 border-2 relative ${
                selectedPlan === 'yearly' 
                  ? 'border-amber-500 bg-amber-50' 
                  : 'border-border hover:border-amber-500/50 bg-card'
              }`}
              onClick={() => setSelectedPlan('yearly')}>
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    {language === 'ar' ? 'الأكثر شعبية' : 'Populaire'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {language === 'ar' ? 'الباقة السنوية' : 'Abonnement annuel'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'وفر 20% سنوياً' : 'Économisez 20% par an'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">29,990</span>
                    <span className="text-muted-foreground">{language === 'ar' ? 'دج/سنة' : 'DA/an'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground line-through">35,988</span>
                    <span className="text-sm font-bold text-green-600">
                      {language === 'ar' ? 'وفر 20%' : 'Économisez 20%'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    </div>
                    <span className="text-muted-foreground">{language === 'ar' ? 'كل شيء في الباقة الشهرية' : 'Tout dans l\'abonnement mensuel'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    </div>
                    <span className="text-muted-foreground">{language === 'ar' ? 'رؤى حصرية للروضات' : 'Aperçus exclusifs des crèches'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    </div>
                    <span className="text-muted-foreground">{language === 'ar' ? 'وصول مبكر للميزات الجديدة' : 'Accès anticipé aux nouvelles fonctionnalités'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-2">
                  {language === 'ar' ? 'تعليمات الدفع' : 'Instructions de paiement'}
                </h4>
                <div className="space-y-1 text-sm text-amber-800">
                  <p><strong>{language === 'ar' ? 'رقم الحساب CCP:' : 'Numéro de compte CCP:'}</strong> 007 99999 99 000000 00</p>
                  <p><strong>{language === 'ar' ? 'الاسم:' : 'Nom:'}</strong> {language === 'ar' ? 'روضتي للخدمات الرقمية' : 'Rawdati Services Numériques'}</p>
                  <p><strong>{language === 'ar' ? 'المبلغ:' : 'Montant:'}</strong> {selectedPlan === 'yearly' ? '29,990' : '2,999'} {language === 'ar' ? 'دج' : 'DA'}</p>
                  <p className="mt-2 text-xs">
                    {language === 'ar' 
                      ? 'بعد إتمام الدفع، يرجى رفع صورة وصل الدفع أدناه' 
                      : 'Après avoir effectué le paiement, veuillez télécharger une photo du reçu ci-dessous'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className={`text-lg font-bold text-foreground mb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'معلوماتك الشخصية' : 'Vos informations personnelles'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{language === 'ar' ? 'الاسم الأول' : 'Prénom'} *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={language === 'ar' ? 'أحمد' : 'Ahmed'}
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">{language === 'ar' ? 'الاسم الأخير' : 'Nom'} *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={language === 'ar' ? 'محمد' : 'Mohamed'}
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</Label>
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
                
                <div>
                  <Label htmlFor="phone">{language === 'ar' ? 'رقم الهاتف' : 'Téléphone'} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={language === 'ar' ? '+213 555 123 456' : '+213 555 123 456'}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="notes">{language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optionnel)'}</Label>
                  <Textarea
                    id="notes"
                    placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Toutes notes supplémentaires...'}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className={dir === 'rtl' ? 'text-right' : 'text-left'}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment Proof Upload */}
            <div>
              <h3 className={`text-lg font-bold text-foreground mb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'رفع وصل الدفع' : 'Télécharger le reçu de paiement'}
              </h3>
              
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      {language === 'ar' ? 'رفع صورة وصل الدفع' : 'Télécharger une photo du reçu'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === 'ar' ? 'PNG, JPG, GIF حتى 5 ميجابايت' : 'PNG, JPG, GIF jusqu\'à 5MB'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="payment-proof"
                    />
                    <label htmlFor="payment-proof">
                      <Button type="button" variant="outline" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'اختر ملف' : 'Choisir un fichier'}
                      </Button>
                    </label>
                  </div>
                  
                  {paymentProof && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">{paymentProof.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPaymentProof(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-muted/50 rounded-xl p-4">
              <h4 className={`font-bold text-foreground mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'ملخص الطلب' : 'Résumé de la commande'}
              </h4>
              <div className="space-y-2">
                <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">
                    {selectedPlan === 'yearly' 
                      ? (language === 'ar' ? 'الباقة السنوية' : 'Abonnement annuel')
                      : (language === 'ar' ? 'الباقة الشهرية' : 'Abonnement mensuel')
                    }
                  </span>
                  <span className="font-medium">{selectedPlan === 'yearly' ? '29,990' : '2,999'} {language === 'ar' ? 'دج' : 'DA'}</span>
                </div>
                <Separator />
                <div className={`flex justify-between text-lg font-bold ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-primary">{selectedPlan === 'yearly' ? '29,990' : '2,999'} {language === 'ar' ? 'دج' : 'DA'}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 gradient-primary border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg flex items-center justify-center gap-2"
              disabled={loading || !paymentProof}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...'}
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  {language === 'ar' ? 'إرسال طلب الاشتراك' : 'Envoyer la demande d\'abonnement'}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleSubscriptionForm;
