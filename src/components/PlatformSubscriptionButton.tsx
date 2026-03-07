import { useState } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlatformSubscriptionButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const PlatformSubscriptionButton = ({
  size = 'md',
  variant = 'default',
  className = ''
}: PlatformSubscriptionButtonProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
        return;
      }

      // Create subscription request
      const { error } = await supabase
        .from('subscription_requests')
        .insert({
          user_id: session.user.id,
          user_email: session.user.email,
          user_name: session.user.user_metadata?.full_name || session.user.email,
          subscription_type: 'premium',
          status: 'pending'
        });

      if (error) throw error;

      toast.success(
        language === 'ar'
          ? 'تم إرسال طلب الاشتراك بنجاح. سيتم مراجعته قريباً.'
          : 'Subscription request sent successfully. It will be reviewed soon.'
      );
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(language === 'ar' ? 'حدث خطأ في طلب الاشتراك' : 'Subscription request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`flex items-center gap-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Crown className="w-4 h-4" />
      )}
      {isLoading ? (
        language === 'ar' ? 'جاري الإرسال...' : 'Sending...'
      ) : (
        language === 'ar' ? 'اشتراك مميز' : 'Premium Subscription'
      )}
    </Button>
  );
};

export default PlatformSubscriptionButton;