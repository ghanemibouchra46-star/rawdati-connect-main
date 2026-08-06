import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// جلب الجدول الأسبوعي الحقيقي للروضة
export const useWeeklySchedule = (kindergartenId: string) => {
  return useQuery({
    queryKey: ['schedule', kindergartenId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('kindergarten_id', kindergartenId)
        .order('time_slot', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!kindergartenId,
  });
};

// جلب الإشعارات الحقيقية الخاصة بالولي
export const useParentNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// تحديد الإشعار كـ "تمت القراءة"
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
