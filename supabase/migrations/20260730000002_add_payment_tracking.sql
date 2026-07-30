-- Migration 002: Add Payment Tracking

-- Create payment_transactions table to track Chargily payments
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kindergarten_id TEXT,
  chargily_checkout_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('platform_subscription', 'enrollment')),
  plan_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'expired')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_transactions' AND policyname = 'Users view own transactions') THEN
    CREATE POLICY "Users view own transactions" ON public.payment_transactions
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  
  -- Edge Functions usually write via service_role, which bypasses RLS, but if we need a policy for it:
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_transactions' AND policyname = 'Users can insert own transactions') THEN
    CREATE POLICY "Users can insert own transactions" ON public.payment_transactions
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
