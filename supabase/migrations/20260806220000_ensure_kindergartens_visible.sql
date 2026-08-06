-- =====================================================
-- FIX: Ensure all kindergartens are visible on the platform
-- This migration:
-- 1. Sets all existing kindergartens to 'approved' status
-- 2. Changes the default status for new kindergartens to 'approved'
-- 3. Cleans up and recreates RLS policies for public access
-- =====================================================

-- 1. Update all kindergartens to approved status
UPDATE public.kindergartens SET status = 'approved' WHERE status != 'approved';

-- 2. Ensure default status for NEW kindergartens is 'approved'
ALTER TABLE public.kindergartens
ALTER COLUMN status SET DEFAULT 'approved';

-- 3. Drop all existing SELECT policies to start clean
DROP POLICY IF EXISTS "Public can view kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Public can view all kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Public can view approved kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Anyone can view approved kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Owners can view own kindergartens" ON public.kindergartens;

-- 4. Recreate public SELECT policy: anyone can view approved kindergartens
CREATE POLICY "Public can view approved kindergartens"
ON public.kindergartens
FOR SELECT
USING (status = 'approved');

-- 5. Keep admin full access policy (drop and recreate for clean state)
DROP POLICY IF EXISTS "Admins can manage kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Admins full access to kindergartens" ON public.kindergartens;
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

-- 6. Keep owner policies
DROP POLICY IF EXISTS "Owners can insert their kindergarten" ON public.kindergartens;
CREATE POLICY "Owners can insert their kindergarten"
ON public.kindergartens
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update their own kindergarten" ON public.kindergartens;
CREATE POLICY "Owners can update their own kindergarten"
ON public.kindergartens
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.owner_kindergartens
    WHERE owner_id = auth.uid()
    AND kindergarten_id = kindergartens.id
  )
);

-- 7. Ensure permissions are granted
GRANT SELECT ON public.kindergartens TO anon, authenticated;
