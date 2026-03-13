-- Update handle_new_user function to also set user_type for the subscription interface
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

  -- Create profile with user_type
  INSERT INTO public.profiles (id, full_name, phone, user_type)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    target_user_type
  );

  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;
