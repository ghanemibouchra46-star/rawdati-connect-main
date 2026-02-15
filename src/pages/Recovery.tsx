import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Recovery = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Recovery page mounted, checking for auth state...");

        // Supabase will automatically handle the token in the URL hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            console.log("Auth event in Recovery:", event);
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                // Successful capture of the recovery session
                navigate('/auth?recovery=true', { replace: true });
            }
        });

        // Backup: Check if we already have a session (e.g. hash was parsed quickly)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                console.log("Session found in Recovery, navigating to auth");
                navigate('/auth?recovery=true', { replace: true });
            }
        });

        // Timeout: If nothing happens after 5 seconds, redirect to home or login
        const timeout = setTimeout(() => {
            console.log("Recovery timeout reached");
            navigate('/auth', { replace: true });
        }, 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <h1 className="text-xl font-semibold">جاري التحقق من الرمز...</h1>
                <p className="text-muted-foreground">ستتم إعادة توجيهك تلقائياً خلال لحظات.</p>
            </div>
        </div>
    );
};

export default Recovery;
