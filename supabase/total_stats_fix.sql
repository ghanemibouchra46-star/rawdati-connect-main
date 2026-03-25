-- ADMIN DASHBOARD TOTAL FIX SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Identify the admin (using your correct email: ghanemibouchra46@gmail.com)
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'ghanemibouchra46@gmail.com' LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
        -- Force Profile to be admin
        UPDATE public.profiles 
        SET role = 'admin', user_type = 'admin', status = 'approved'
        WHERE id = v_user_id;

        -- Ensure entry exists in user_roles
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin user % has been fully authorized.', v_user_id;
    ELSE
        RAISE NOTICE 'Admin user with email ghanemibouchra46@gmail.com not found in auth.users table.';
    END IF;
END $$;

-- 2. Update Role Detection Function (Make it more robust)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  -- 1. Check user_roles table
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) THEN
    RETURN TRUE;
  END IF;

  -- 2. Check profiles table (double check)
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = _role) THEN
    RETURN TRUE;
  END IF;
  
  -- 3. Special case for Admin by email (hardcoded safety for YOUR specific account)
  IF _role = 'admin' THEN
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id AND email = 'ghanemibouchra46@gmail.com') THEN
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Sync all parent roles
-- Make sure all parents are recognized in both tables
INSERT INTO public.user_roles (user_id, role)
SELECT id, role
FROM public.profiles
WHERE role = 'parent'
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Enable RLS and verify policies
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.registration_requests;
CREATE POLICY "Admins can view all registrations" ON public.registration_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

RAISE NOTICE 'Statistics fix applied successfully.';
