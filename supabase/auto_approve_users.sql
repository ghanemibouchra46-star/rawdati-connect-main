-- Update the handle_new_user function to automatically approve all new users, especially owners.

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
  BEGIN
    assigned_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'parent');
  EXCEPTION WHEN OTHERS THEN
    assigned_role := 'parent';
  END;
  
  -- Determine user_type for the interface
  target_user_type := CASE 
    WHEN assigned_role = 'owner' THEN 'kindergarten'
    WHEN assigned_role = 'admin' THEN 'admin'
    ELSE 'parent'
  END;

  -- Create profile with role, user_type, and status='approved' (auto-approve everyone)
  INSERT INTO public.profiles (id, full_name, phone, role, user_type, status)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    assigned_role,
    target_user_type,
    'approved'
  );

  -- Insert into user_roles (keeping it for compatibility)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;

-- Also update existing pending profiles to approved
UPDATE public.profiles SET status = 'approved' WHERE status = 'pending';
