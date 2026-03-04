-- SUPER-FIX SCRIPT for Rawdati Platform
-- This script fixes: 1. Missing 'status' column, 2. Admin permissions, 3. Approves the kindergarten.

-- 1. Ensure 'status' column exists in kindergartens table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kindergartens' AND column_name='status') THEN
        ALTER TABLE public.kindergartens ADD COLUMN status TEXT NOT NULL DEFAULT 'approved';
        -- Add a check constraint for safety
        ALTER TABLE public.kindergartens ADD CONSTRAINT check_kg_status CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- 2. Grant Admin permissions to ghanemibouchra46@gmail.com
DO $$
DECLARE
    v_email TEXT := 'ghanemibouchra46@gmail.com';
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

    IF v_user_id IS NOT NULL THEN
        -- Ensure Profile exists and is approved
        INSERT INTO public.profiles (id, full_name, status)
        VALUES (v_user_id, 'Super Admin', 'approved')
        ON CONFLICT (id) DO UPDATE SET status = 'approved';

        -- Ensure Admin Role exists
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin'::public.app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;

-- 3. Force Approve the specific kindergarten "براعم الوفاء"
UPDATE public.kindergartens 
SET status = 'approved' 
WHERE name_ar LIKE '%براعم الوفاء%';

-- 4. Enable RLS and set generic Admin policy just in case it was lost
ALTER TABLE public.kindergartens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage kindergartens" ON public.kindergartens;
CREATE POLICY "Admins can manage kindergartens"
ON public.kindergartens
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
));
