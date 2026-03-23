-- Ensure all approved kindergartens are visible to everyone (anon and authenticated)
-- This fixes the issue where loggednd users saw 0 kindergartens
DROP POLICY IF EXISTS "Public can view kindergartens" ON public.kindergartens;
CREATE POLICY "Public can view kindergartens"
ON public.kindergartens
FOR SELECT
USING (status = 'approved');

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
