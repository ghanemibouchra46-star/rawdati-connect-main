-- Fix RLS for payments table to allow parents to record their electronic payments
-- This resolves the "new row violates row-level security policy for table 'payments'" error

-- 1. Allow parents to INSERT payments for their own children
DROP POLICY IF EXISTS "Parents can insert payments for their children" ON public.payments;
CREATE POLICY "Parents can insert payments for their children" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  child_id IN (
    SELECT id FROM public.children WHERE parent_id = auth.uid()
  )
);

-- 2. Ensure parents can also UPDATE their own payments (if needed for status updates)
DROP POLICY IF EXISTS "Parents can update their children's payments" ON public.payments;
CREATE POLICY "Parents can update their children's payments" 
ON public.payments 
FOR UPDATE
USING (
  child_id IN (
    SELECT id FROM public.children WHERE parent_id = auth.uid()
  )
);

-- 3. Verify SELECT policy exists (from previous migration)
-- If it doesn't exist, this will create it
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Parents can view their children''s payments') THEN
    CREATE POLICY "Parents can view their children's payments" 
    ON public.payments
    FOR SELECT
    USING (
      child_id IN (
        SELECT id FROM public.children WHERE parent_id = auth.uid()
      )
    );
  END IF;
END $$;
