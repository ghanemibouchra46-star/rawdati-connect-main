-- Drop and recreate platform_subscriptions table without updated_at issues
DROP TABLE IF EXISTS public.platform_subscriptions CASCADE;

-- Create platform_subscriptions table
CREATE TABLE public.platform_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method TEXT DEFAULT 'ccp',
  payment_proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments
COMMENT ON TABLE public.platform_subscriptions IS 'Platform-wide user subscriptions';
COMMENT ON COLUMN public.platform_subscriptions.id IS 'Unique identifier for the subscription';
COMMENT ON COLUMN public.platform_subscriptions.user_id IS 'User ID who owns the subscription';
COMMENT ON COLUMN public.platform_subscriptions.plan_type IS 'monthly or yearly plan';
COMMENT ON COLUMN public.platform_subscriptions.price IS 'Price in Algerian Dinars';
COMMENT ON COLUMN public.platform_subscriptions.status IS 'active, cancelled, expired, or pending';
COMMENT ON COLUMN public.platform_subscriptions.start_date IS 'Subscription start date';
COMMENT ON COLUMN public.platform_subscriptions.end_date IS 'Subscription end date';
COMMENT ON COLUMN public.platform_subscriptions.payment_method IS 'Payment method (ccp, card, etc.)';
COMMENT ON COLUMN public.platform_subscriptions.payment_proof_url IS 'URL to payment proof image';
COMMENT ON COLUMN public.platform_subscriptions.created_at IS 'Subscription creation date';
