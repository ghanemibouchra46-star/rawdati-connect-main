import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubscriptionRequest {
  id: string;
  kindergarten_id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  child_name: string;
  child_age: string;
  ccp: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const usePlatformSubscription = () => {
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchSubscriptionRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected'
      }));

      setSubscriptionRequests(mappedData);
    } catch (err) {
      console.error('Error fetching subscription requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription requests');
      toast.error(
        language === 'ar' 
          ? 'فشل في تحميل طلبات الاشتراك' 
          : 'Failed to load subscription requests'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const approveSubscription = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('subscription_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      setSubscriptionRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: 'approved' as const, updated_at: new Date().toISOString() }
            : req
        )
      );

      toast.success(
        language === 'ar' 
          ? 'تمت الموافقة على الاشتراك بنجاح' 
          : 'Subscription approved successfully'
      );
    } catch (err) {
      console.error('Error approving subscription:', err);
      toast.error(
        language === 'ar' 
          ? 'فشل في الموافقة على الاشتراك' 
          : 'Failed to approve subscription'
      );
    }
  };

  const rejectSubscription = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('subscription_requests')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      setSubscriptionRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: 'rejected' as const, updated_at: new Date().toISOString() }
            : req
        )
      );

      toast.success(
        language === 'ar' 
          ? 'تم رفض الاشتراك' 
          : 'Subscription rejected'
      );
    } catch (err) {
      console.error('Error rejecting subscription:', err);
      toast.error(
        language === 'ar' 
          ? 'فشل في رفض الاشتراك' 
          : 'Failed to reject subscription'
      );
    }
  };

  useEffect(() => {
    fetchSubscriptionRequests();
  }, []);

  return {
    subscriptionRequests,
    isLoading,
    error,
    approveSubscription,
    rejectSubscription,
    refetch: fetchSubscriptionRequests
  };
};

export const useAllPlatformSubscriptions = () => {
  return usePlatformSubscription();
};

export const useUpdatePlatformSubscription = () => {
  const { approveSubscription, rejectSubscription } = usePlatformSubscription();

  return {
    approveSubscription,
    rejectSubscription
  };
};
