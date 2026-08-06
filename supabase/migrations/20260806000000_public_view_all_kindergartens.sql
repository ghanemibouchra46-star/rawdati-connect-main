-- 1. Set the default status for new kindergartens to approved
ALTER TABLE public.kindergartens
ALTER COLUMN status SET DEFAULT 'approved';

-- 2. Allow public SELECT access to all kindergarten records
DROP POLICY IF EXISTS "Public can view approved kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Public can view kindergartens" ON public.kindergartens;

CREATE POLICY "Public can view all kindergartens"
ON public.kindergartens
FOR SELECT
USING (true);

-- 3. Ensure anon and authenticated roles have SELECT permission
GRANT SELECT ON public.kindergartens TO anon, authenticated;
