-- Fix Admin Account Script (Corrected)
-- RUN THIS IN SUPABASE SQL EDITOR

DO $$
DECLARE
    v_email TEXT := 'ghanemifatima4@gmail.com';
    v_user_id UUID;
BEGIN
    -- 1. Get the User ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User % not found. Please sign up first.', v_email;
    ELSE
        -- 2. Confirm the email
        -- We ONLY update email_confirmed_at. confirmed_at is generated automatically.
        UPDATE auth.users
        SET email_confirmed_at = now(),
            last_sign_in_at = now(),
            raw_app_meta_data = raw_app_meta_data || '{"provider": "email", "providers": ["email"]}'::jsonb
        WHERE id = v_user_id;

        -- 3. Ensure Profile Exists
        INSERT INTO public.profiles (id, full_name, status)
        VALUES (v_user_id, 'System Admin', 'approved')
        ON CONFLICT (id) DO UPDATE
        SET status = 'approved';

        -- 4. Assign Admin Role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin account fixed successfully!';
    END IF;
END $$;
