import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTrialStatus(userId: string | undefined) {
  const [status, setStatus] = useState<'trial' | 'active' | 'expired' | 'none'>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('platform_subscriptions')
          .select('status, is_trial')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching trial status:", error);
          setStatus('none');
        } else if (data) {
          if (data.is_trial && data.status === 'active') {
            setStatus('trial');
          } else if (data.status === 'active') {
            setStatus('active');
          } else if (data.status === 'expired') {
            setStatus('expired');
          } else {
            setStatus('none');
          }
        }
      } catch (e) {
        console.error("Exception in checkStatus:", e);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [userId]);

  return { status, loading };
}
