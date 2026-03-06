-- Create platform_subscriptions table for platform-wide subscriptions
CREATE TABLE IF NOT EXISTS public.platform_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method TEXT DEFAULT 'card',
  card_last_four TEXT,
  auto_renew BOOLEAN DEFAULT true,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Foreign key constraint
  CONSTRAINT fk_platform_subscriptions_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own platform subscriptions"
ON public.platform_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own platform subscriptions"
ON public.platform_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own platform subscriptions"
ON public.platform_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Only admins can delete subscriptions
CREATE POLICY "Only admins can delete platform subscriptions"
ON public.platform_subscriptions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_user_id ON public.platform_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_status ON public.platform_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_end_date ON public.platform_subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_created_at ON public.platform_subscriptions(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_platform_subscriptions_updated_at
  BEFORE UPDATE ON public.platform_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.platform_subscriptions IS 'Platform-wide subscriptions for parents and users';
