import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

type PlatformSubscription = Database['public']['Tables']['platform_subscriptions']['Row'];

export function useMyPlatformSubscription() {
  return useQuery({
    queryKey: ['platform_subscription', 'my'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      try {
        const { data, error } = await supabase
          .from('platform_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['active', 'pending'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null;
          }
          throw error;
        }

        return data;
      } catch (err) {
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useAllPlatformSubscriptions() {
  return useQuery({
    queryKey: ['platform_subscriptions', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_subscriptions')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (PlatformSubscription & { profiles: any })[];
    },
    staleTime: 30 * 1000,
  });
}

export function useUpdatePlatformSubscription() {
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: string; 
      status: 'active' | 'cancelled' | 'expired' | 'pending' 
    }) => {
      const { data, error } = await supabase
        .from('platform_subscriptions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success(
        language === 'ar' 
          ? 'تم تحديث حالة الاشتراك بنجاح' 
          : 'Le statut de l\'abonnement a été mis à jour avec succès'
      );
    },
    onError: () => {
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ أثناء تحديث حالة الاشتراك' 
          : 'Une erreur est survenue lors de la mise à jour du statut de l\'abonnement'
      );
    }
  });
}

export function useCreatePlatformSubscription() {
  const { language } = useLanguage();
  
  return useMutation({
    mutationFn: async (subscriptionData: Omit<PlatformSubscription, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('platform_subscriptions')
        .insert({
          ...subscriptionData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success(
        language === 'ar' 
          ? 'تم إنشاء طلب الاشتراك بنجاح' 
          : 'La demande d\'abonnement a été créée avec succès'
      );
    },
    onError: () => {
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ أثناء إنشاء طلب الاشتراك' 
          : 'Une erreur est survenue lors de la création de la demande d\'abonnement'
      );
    }
  });
}
