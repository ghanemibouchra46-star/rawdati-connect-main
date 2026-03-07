import { useState, useEffect } from 'react';
import { Crown, CreditCard, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSubscribe = () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth';
      return;
    }
    setShowSubscriptionForm(true);
  };

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
