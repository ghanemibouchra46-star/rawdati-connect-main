-- Grant admin access to ghanemifatima4@gmail.com
-- This migration finds the user by email and ensures they have the 'admin' role

DO $$ 
DECLARE 
    v_user_id UUID;
    v_email TEXT := 'ghanemifatima4@gmail.com';
BEGIN
    -- Get User ID from auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

    IF v_user_id IS NOT NULL THEN
        -- Ensure profile exists
        INSERT INTO public.profiles (id, full_name, status)
        VALUES (v_user_id, 'Admin User', 'approved')
        ON CONFLICT (id) DO UPDATE 
        SET status = 'approved';

        -- Ensure admin role exists for this user
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- If they had another role, we might want to ensure 'admin' is there at least.
        -- user_roles table has a unique constraint on (user_id, role) usually.
    END IF;
END $$;
