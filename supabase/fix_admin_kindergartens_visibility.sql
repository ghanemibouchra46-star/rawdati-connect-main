-- =====================================================
-- FIX: Ensure ALL kindergartens are visible to admins
-- AND approved kindergartens are visible to everyone
-- =====================================================

-- 1. Drop all existing policies on kindergartens to start clean
DROP POLICY IF EXISTS "Public can view kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Admins can manage kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Owners can view their kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Anyone can view approved kindergartens" ON public.kindergartens;

-- 2. Enable RLS
ALTER TABLE public.kindergartens ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone (anon + authenticated) can see APPROVED kindergartens
CREATE POLICY "Public can view approved kindergartens"
ON public.kindergartens
FOR SELECT
USING (status = 'approved');

-- 4. Policy: Admins can see ALL kindergartens and perform all operations
-- Checks both user_roles table AND profiles.role for maximum compatibility
CREATE POLICY "Admins full access to kindergartens"
ON public.kindergartens
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
  OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Policy: Owners can see their own kindergartens
CREATE POLICY "Owners can view own kindergartens"
ON public.kindergartens
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.owner_kindergartens 
    WHERE owner_id = auth.uid() AND kindergarten_id = kindergartens.id
  )
);

-- 6. Verify: Show all kindergartens in the table
SELECT id, name_ar, name_fr, status, municipality_ar 
FROM public.kindergartens
ORDER BY created_at DESC;
