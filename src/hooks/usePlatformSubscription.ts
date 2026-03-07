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
      console.log('🔍 useMyPlatformSubscription started');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ No user found');
        return null;
      }

      console.log('✅ User found:', user.id);

      try {
        const { data, error } = await supabase
          .from('platform_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['active', 'pending'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        console.log('📊 Query result:', { data, error });

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('ℹ️ No subscription found (PGRST116)');
            return null;
          }
          console.error('❌ Database error:', error);
          throw error;
        }

        console.log('✅ Subscription data:', data);
        return data;
      } catch (err) {
        console.error('❌ Query failed:', err);
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
