-- SQL Script to grant Admin privileges to a specific email
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    v_email TEXT := 'bouchragh1268967@gmail.com';
    v_user_id UUID;
BEGIN
    -- 1. Get the User ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User % not found. Please sign up first.', v_email;
    ELSE
        -- 2. Ensure Profile Exists and is approved
        INSERT INTO public.profiles (id, full_name, status)
        VALUES (v_user_id, 'Admin User', 'approved')
        ON CONFLICT (id) DO UPDATE
        SET status = 'approved';

        -- 3. Assign Admin Role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin permissions granted successfully for %!', v_email;
    END IF;
END $$;
