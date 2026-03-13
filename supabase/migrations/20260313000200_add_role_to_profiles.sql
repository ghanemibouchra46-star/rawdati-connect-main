-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role public.app_role;

-- Update existing profiles based on user_roles
UPDATE public.profiles p
SET role = ur.role
FROM public.user_roles ur
WHERE p.id = ur.user_id;

-- Update handle_new_user function to include role in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.app_role;
  target_user_type TEXT;
BEGIN
  -- Determine role from metadata, default to 'parent'
  assigned_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'parent');
  
  -- Determine user_type for the interface
  target_user_type := CASE 
    WHEN assigned_role = 'owner' THEN 'kindergarten'
    WHEN assigned_role = 'admin' THEN 'admin'
    ELSE 'parent'
  END;

  -- Create profile with role and user_type
  INSERT INTO public.profiles (id, full_name, phone, role, user_type)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    assigned_role,
    target_user_type
  );

  -- Insert into user_roles (keeping it for compatibility)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;
