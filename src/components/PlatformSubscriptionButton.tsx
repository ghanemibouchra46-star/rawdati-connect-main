import { useState, useEffect } from 'react';
import { Crown, CreditCard, Star, Zap, Check, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useMyPlatformSubscription } from '@/hooks/usePlatformSubscription';
import SubscriptionForm from './SubscriptionForm';

interface PlatformSubscriptionButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const PlatformSubscriptionButton = ({ 
  variant = 'default', 
  size = 'default', 
  className = '' 
}: PlatformSubscriptionButtonProps) => {
  const { language, dir } = useLanguage();
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { data: subscription, isLoading } = useMyPlatformSubscription();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 PlatformSubscriptionButton - user fetched:', user);
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    console.log('📂 PlatformSubscriptionButton - showSubscriptionForm:', showSubscriptionForm);
  }, [showSubscriptionForm]);

  useEffect(() => {
    console.log('📊 PlatformSubscriptionButton - subscription:', subscription);
    console.log('⏳ PlatformSubscriptionButton - isLoading:', isLoading);
  }, [subscription, isLoading]);

  const handleSubscribe = () => {
    console.log('🚀 handleSubscribe called');
    console.log('👤 User:', user);
    console.log('📂 Show form:', showSubscriptionForm);
    
    if (!user) {
      console.log('🔐 No user, redirecting to login');
      // Redirect to login
      window.location.href = '/auth';
      return;
    }
    
    console.log('✅ Setting showSubscriptionForm to true');
    setShowSubscriptionForm(true);
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`border-muted-foreground/20 ${className}`}
        disabled
      >
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        {language === 'ar' ? 'جاري التحقق...' : 'Vérification...'}
      </Button>
    );
  }

  // If user has active subscription
  if (subscription?.status === 'active') {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
          <Check className="w-3 h-3 mr-1" />
          {language === 'ar' ? 'مشترك' : 'Abonné'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {language === 'ar' ? 'الباقة:' : 'Forfait:'} {language === 'ar' ? (subscription.plan_type === 'monthly' ? 'شهري' : 'سنوي') : (subscription.plan_type === 'monthly' ? 'Mensuel' : 'Annuel')}
        </span>
      </div>
    );
  }

  // If user has pending subscription
  if (subscription?.status === 'pending') {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
          <Clock className="w-3 h-3 mr-1" />
          {language === 'ar' ? 'قيد المراجعة' : 'En attente'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {language === 'ar' ? 'جاري مراجعة الدفع' : 'Paiement en cours de vérification'}
        </span>
      </div>
    );
  }

  // No subscription - show subscribe button
  return (
    <>
      <Button
        onClick={handleSubscribe}
        variant={variant}
        size={size}
        className={`gradient-primary border-0 shadow-soft hover:shadow-hover transition-all duration-300 flex items-center gap-2 ${className}`}
      >
        <Crown className="w-4 h-4" />
        {language === 'ar' ? 'اشتراك المنصة' : 'Abonnement Platform'}
        {variant === 'default' && (
          <Badge className="bg-white/20 text-white border-0 ml-2">
            {language === 'ar' ? 'مميز' : 'Premium'}
          </Badge>
        )}
      </Button>

      <SubscriptionForm
        isOpen={showSubscriptionForm}
        onClose={() => setShowSubscriptionForm(false)}
        userId={user?.id}
        userEmail={user?.email}
        userName={user?.user_metadata?.full_name || user?.email}
      />
    </>
  );
};

export default PlatformSubscriptionButton;
