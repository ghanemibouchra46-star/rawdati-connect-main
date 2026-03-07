import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionRequest {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  subscription_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const usePlatformSubscription = () => {
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubscriptionRequests(data || []);
    } catch (err) {
      console.error('Error fetching subscription requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription requests');
      toast.error('Failed to load subscription requests');
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

      toast.success('Subscription approved successfully');
    } catch (err) {
      console.error('Error approving subscription:', err);
      toast.error('Failed to approve subscription');
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

      toast.success('Subscription rejected');
    } catch (err) {
      console.error('Error rejecting subscription:', err);
      toast.error('Failed to reject subscription');
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