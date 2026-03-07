import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionRequest {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  subscription_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export function useSubscriptionRequests() {
  const query = useQuery({
    queryKey: ['subscription-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscription requests:', error);
        return [];
      }

      return (data || []) as SubscriptionRequest[];
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  return query;
}

export function useApproveSubscription() {
  return async (requestId: string) => {
    const { error } = await supabase
      .from('subscription_requests')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      console.error('Error approving subscription:', error);
      throw error;
    }
  };
}

export function useAllSubscriptionRequests() {
  return useSubscriptionRequests();
}

export function useOwnerSubscriptionRequests() {
  return useSubscriptionRequests();
}