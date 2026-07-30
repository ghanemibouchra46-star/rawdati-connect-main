-- Migration 001: Add Trial System

-- 1. Add trial columns to platform_subscriptions
ALTER TABLE public.platform_subscriptions 
  ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_duration_days INTEGER;

-- 2. Add subscription_status to kindergartens
ALTER TABLE public.kindergartens 
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending'
    CHECK (subscription_status IN ('trial', 'active', 'expired', 'pending', 'suspended'));

-- 3. Update existing kindergartens to be in 'trial' status if they don't have a status
UPDATE public.kindergartens SET subscription_status = 'trial' WHERE subscription_status IS NULL OR subscription_status = 'pending';

-- 4. RLS for platform_subscriptions
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'platform_subscriptions' AND policyname = 'Users can view own subscription') THEN
    CREATE POLICY "Users can view own subscription" ON public.platform_subscriptions
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  -- Enable RLS on platform_subscriptions if not already enabled
  ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;
END $$;

-- 5. Update public access policy for kindergartens
DROP POLICY IF EXISTS "Public can view approved kindergartens" ON public.kindergartens;

CREATE POLICY "Public can view active kindergartens"
ON public.kindergartens
FOR SELECT
USING (subscription_status IN ('trial', 'active') OR status = 'approved'); -- Keep status='approved' for backward compatibility during transition
