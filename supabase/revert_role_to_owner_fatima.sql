-- FIX: Revert ghanemifatima4@gmail.com from Admin to Owner
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    v_email TEXT := 'ghanemifatima4@gmail.com';
    v_user_id UUID;
BEGIN
    -- 1. Get the User ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User % not found.', v_email;
    ELSE
        -- 2. Update Public Profile Role
        UPDATE public.profiles 
        SET role = 'owner'::public.app_role,
            status = 'approved'
        WHERE id = v_user_id;

        -- 3. Update user_roles Table
        -- Remove admin role if exists
        DELETE FROM public.user_roles 
        WHERE user_id = v_user_id AND role = 'admin'::public.app_role;

        -- Add owner role if missing
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_user_id, 'owner'::public.app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Role reverted to OWNER successfully for %!', v_email;
    END IF;
END $$;
