-- Update handle_new_user function to support role assignment from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.app_role;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone'
  );

  -- Determine role from metadata, default to 'parent'
  assigned_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'parent');

  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$$;
