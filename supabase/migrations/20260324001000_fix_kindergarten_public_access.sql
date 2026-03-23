
-- 1. Ensure RLS is enabled on kindergartens
ALTER TABLE IF EXISTS public.kindergartens ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing public policy if it exists to ensure a clean slate
DROP POLICY IF EXISTS "Public can view kindergartens" ON public.kindergartens;

-- 3. Re-create the public select policy
-- This allows anyone (both anonymous and authenticated) to view approved kindergartens
CREATE POLICY "Public can view approved kindergartens"
ON public.kindergartens
FOR SELECT
USING (status = 'approved');

-- 4. Grant select permissions to anonymous and authenticated roles
GRANT SELECT ON public.kindergartens TO anon, authenticated;

-- 5. Set up a separate policy for admins to see everything (optional but good practice)
DROP POLICY IF EXISTS "Admins can manage kindergartens" ON public.kindergartens;
CREATE POLICY "Admins can manage kindergartens"
ON public.kindergartens
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Important: Also ensure that storage permissions allow public access if needed
-- (This assumes the bucket 'kindergarten-images' is already public, which it should be based on useKindergartens.ts)
