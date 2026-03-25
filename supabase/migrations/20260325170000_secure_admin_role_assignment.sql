-- Function to securely assign the admin role to specific emails
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_email text;
  v_user_id uuid;
BEGIN
  -- Get the email and ID of the user calling the function
  v_user_id := auth.uid();
  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;

  -- Verify the email is one of the authorized admin emails
  IF v_user_email IN (
    'bouchragh1268967@gmail.com', 
    'ghanemifatima4@gmail.com', 
    'ghanemibouchra46@gmail.com', 
    'rawdati245@gmail.com'
  ) THEN
    -- 1. Insert into user_roles
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    -- 2. Update profiles table
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = v_user_id;

    RETURN true;
  END IF;

  RETURN false;
END;
$$;
