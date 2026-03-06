import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SubscriptionRequest {
  id: string;
  kindergarten_id: string;
  parent_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  child_name: string;
  child_age: string;
  ccp: string;
  address: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  payment_confirmed: boolean;
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}

// Get all subscription requests (for admins)
export function useAllSubscriptionRequests() {
  return useQuery({
    queryKey: ['subscription_requests', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_requests')
        .select(`
          *,
          kindergartens (
            id,
            name_ar,
            name_fr,
            municipality_ar,
            municipality_fr
          ),
          profiles (
            id,
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SubscriptionRequest[];
    },
    staleTime: 30 * 1000,
  });
}

// Get subscription requests for current user (parents)
export function useMySubscriptionRequests() {
  return useQuery({
    queryKey: ['subscription_requests', 'my'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('subscription_requests')
        .select(`
          *,
          kindergartens (
            id,
            name_ar,
            name_fr,
            municipality_ar,
            municipality_fr
          )
        `)
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SubscriptionRequest[];
    },
    staleTime: 30 * 1000,
  });
}

// Get subscription requests for owner's kindergartens
export function useOwnerSubscriptionRequests() {
  return useQuery({
    queryKey: ['subscription_requests', 'owner'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get owner's kindergartens first
      const { data: ownerKgs, error: kgError } = await supabase
        .from('owner_kindergartens')
        .select('kindergarten_id')
        .eq('owner_id', user.id);

      if (kgError) throw kgError;
      if (!ownerKgs || ownerKgs.length === 0) return [];

      const kindergartenIds = ownerKgs.map(kg => kg.kindergarten_id);

      // Get subscription requests for owner's kindergartens
      const { data, error } = await supabase
        .from('subscription_requests')
        .select(`
          *,
          kindergartens (
            id,
            name_ar,
            name_fr,
            municipality_ar,
            municipality_fr
          ),
          profiles (
            id,
            full_name,
            phone
          )
        `)
        .in('kindergarten_id', kindergartenIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SubscriptionRequest[];
    },
    staleTime: 30 * 1000,
  });
}

// Update subscription request status
export function useUpdateSubscriptionRequest() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      payment_confirmed = false 
    }: { 
      id: string; 
      status: 'approved' | 'rejected'; 
      payment_confirmed?: boolean;
    }) => {
      const updateData: any = { status };
      if (payment_confirmed) {
        updateData.payment_confirmed = true;
        updateData.payment_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('subscription_requests')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return { id, status };
    },
    onSuccess: ({ status }) => {
      toast.success(
        language === 'ar' 
          ? `تم ${status === 'approved' ? 'قبول' : 'رفض'} الطلب بنجاح`
          : `Demande ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`
      );
      
      // Invalidate all subscription request queries
      queryClient.invalidateQueries({ queryKey: ['subscription_requests'] });
    },
    onError: () => {
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ أثناء تحديث الطلب'
          : 'Erreur lors de la mise à jour de la demande'
      );
    },
  });
}
