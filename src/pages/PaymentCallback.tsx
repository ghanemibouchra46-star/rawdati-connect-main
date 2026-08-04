import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const checkoutId = searchParams.get('checkout_id');
  const statusParam = searchParams.get('status');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [paymentType, setPaymentType] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutId) {
      setStatus('failure');
      return;
    }

    const verifyPayment = async (attempt = 0) => {
      try {
        const { data, error } = await supabase
          .from('payment_transactions')
          .select('status, payment_type')
          .eq('id', checkoutId)
          .single();

        if (error) throw error;
        
        setPaymentType(data.payment_type);
        
        if (data.status === 'paid' || statusParam === 'success') {
          setStatus('success');
          return;
        }

        if (data.status && ['failed', 'cancelled', 'expired'].includes(data.status)) {
          setStatus('failure');
          return;
        }

        if (attempt < 8) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          await verifyPayment(attempt + 1);
          return;
        }

        setStatus('failure');
      } catch (e) {
        console.error("Verification error", e);
        setStatus('failure');
      }
    };

    verifyPayment();
  }, [checkoutId, statusParam]);

  const handleReturn = () => {
    if (paymentType === 'platform_subscription') {
      navigate('/owner');
    } else {
      navigate('/parent');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardContent className="pt-10 pb-8 text-center space-y-6">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? 'جاري التحقق من الدفع...' : 'Vérification du paiement...'}
              </h2>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-mint/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-mint" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'تم الدفع بنجاح!' : 'Paiement réussi!'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'تم تأكيد الدفع وتحديث اشتراكك.' 
                  : 'Votre paiement a été confirmé et votre abonnement mis à jour.'}
              </p>
              <Button onClick={handleReturn} className="w-full mt-4 gradient-accent">
                {language === 'ar' ? 'العودة للوحة التحكم' : 'Retour au tableau de bord'}
              </Button>
            </div>
          )}
          
          {status === 'failure' && (
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'ar' ? 'فشل الدفع' : 'Échec du paiement'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'لم نتمكن من إتمام عملية الدفع. يرجى المحاولة مرة أخرى.' 
                  : 'Nous n\'avons pas pu traiter votre paiement. Veuillez réessayer.'}
              </p>
              <Button onClick={handleReturn} variant="outline" className="w-full mt-4">
                {language === 'ar' ? 'العودة' : 'Retour'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
