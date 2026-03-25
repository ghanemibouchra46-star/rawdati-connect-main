-- 1. Sync Role Detection Logic
-- This enhancement allows permissions to work correctly even if roles are only in the profiles table
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    -- Check user_roles table
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  ) OR EXISTS (
    -- Check profiles table (legacy or migration fallback)
    SELECT 1 FROM public.profiles WHERE id = _user_id AND (role::text = _role::text OR (user_type::text = _role::text AND _role != 'admin'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Sync user_roles table from profiles
-- This ensures that everyone who has a role in the profiles table also has it in user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::public.app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Ensure admins have access to everything
-- This is a safety measure to ensure the admin is recognized correctly
DO $$
DECLARE
    v_role_exists BOOLEAN;
BEGIN
    -- Update existing admin profiles to ensure they have the 'admin' role correctly set
    UPDATE public.profiles 
    SET role = 'admin', user_type = 'admin' 
    WHERE role = 'admin' OR user_type = 'admin';
    
    -- Ensure the admin role is in user_roles for all admins found in profiles
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::public.app_role
    FROM public.profiles
    WHERE role = 'admin'
    ON CONFLICT (user_id, role) DO NOTHING;
END $$;
