-- Ensure the default status for new kindergartens is approved
ALTER TABLE public.kindergartens
ALTER COLUMN status SET DEFAULT 'approved';

-- Allow anyone to view all kindergartens
DROP POLICY IF EXISTS "Public can view approved kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Public can view kindergartens" ON public.kindergartens;
CREATE POLICY "Public can view all kindergartens"
ON public.kindergartens
FOR SELECT
USING (true);

GRANT SELECT ON public.kindergartens TO anon, authenticated;

-- Ensure admins can see and manage ALL kindergartens (including pending/rejected)
-- This uses the user_roles table to verify admin status
DROP POLICY IF EXISTS "Admins can manage kindergartens" ON public.kindergartens;
CREATE POLICY "Admins can manage kindergartens"
ON public.kindergartens
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
