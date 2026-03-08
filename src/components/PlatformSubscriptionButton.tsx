import { useState } from 'react';
import { Crown, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlatformSubscriptionButtonProps {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const PlatformSubscriptionButton = ({ variant = 'default', size = 'default' }: PlatformSubscriptionButtonProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Here you would implement the subscription logic
      toast.success(language === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!');
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في الاشتراك' : 'Subscription failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSubscribe}
      disabled={isLoading}
      className="gap-2"
    >
      <Crown className="w-4 h-4" />
      {language === 'ar' ? 'اشتراك في المنصة' : 'Platform Subscription'}
    </Button>
  );
};

export default PlatformSubscriptionButton;