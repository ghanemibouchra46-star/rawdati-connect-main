-- Enhance payments table and kindergartens to support electronic payments

-- 1. Add new columns to payments table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='payments' AND column_name='payment_method') THEN
    ALTER TABLE public.payments ADD COLUMN payment_method TEXT DEFAULT 'manual';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='payments' AND column_name='transaction_id') THEN
    ALTER TABLE public.payments ADD COLUMN transaction_id TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='payments' AND column_name='paid_at') THEN
    ALTER TABLE public.payments ADD COLUMN paid_at TIMESTAMPTZ;
  END IF;
END $$;

-- 2. Add online payment settings to kindergartens
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='kindergartens' AND column_name='online_payment_enabled') THEN
    ALTER TABLE public.kindergartens ADD COLUMN online_payment_enabled BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='kindergartens' AND column_name='payment_config') THEN
    ALTER TABLE public.kindergartens ADD COLUMN payment_config JSONB DEFAULT '{}';
  END IF;
END $$;

-- 3. Update existing RLS for parents to see their children's payments
-- Note: Profiles table exists, let's ensure parents can see payments for their own children
-- The children table has parent_id (profile id)
-- The payments table has child_id

DROP POLICY IF EXISTS "Parents can view their children's payments" ON public.payments;
CREATE POLICY "Parents can view their children's payments" 
ON public.payments
FOR SELECT
USING (
  child_id IN (
    SELECT id FROM public.children WHERE parent_id = auth.uid()
  )
);

-- Ensure owners can still see payments for their own kindergarten
-- (This policy might already exist, but we ensure it works)
DROP POLICY IF EXISTS "Owners can manage payments" ON public.payments;
CREATE POLICY "Owners can manage payments"
ON public.payments
FOR ALL
USING (
  kindergarten_id IN (
    SELECT kindergarten_id FROM public.owner_kindergartens WHERE owner_id = auth.uid()
  )
);
