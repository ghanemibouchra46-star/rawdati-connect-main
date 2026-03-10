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

export const useSubscriptionRequests = () => {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests((data as SubscriptionRequest[]) || []);
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

  const approveRequest = async (requestId: string) => {
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
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: 'approved' as const, updated_at: new Date().toISOString() }
            : req
        )
      );

      toast.success(
        language === 'ar' 
          ? 'تمت الموافقة على الطلب بنجاح' 
          : 'Request approved successfully'
      );
    } catch (err) {
      console.error('Error approving request:', err);
      toast.error(
        language === 'ar' 
          ? 'فشل في الموافقة على الطلب' 
          : 'Failed to approve request'
      );
    }
  };

  const rejectRequest = async (requestId: string) => {
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
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: 'rejected' as const, updated_at: new Date().toISOString() }
            : req
        )
      );

      toast.success(
        language === 'ar' 
          ? 'تم رفض الطلب' 
          : 'Request rejected'
      );
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error(
        language === 'ar' 
          ? 'فشل في رفض الطلب' 
          : 'Failed to reject request'
      );
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    requests,
    isLoading,
    error,
    approveRequest,
    rejectRequest,
    refetch: fetchRequests
  };
};

export const useAllSubscriptionRequests = () => {
  return useSubscriptionRequests();
};
