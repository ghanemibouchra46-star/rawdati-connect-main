-- Fix role and user_type for ghanemifatima4@gmail.com
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID from auth.users (assuming we have access or can try)
    -- In some environments, we might not have direct select on auth.users from public
    -- but we can try to find it via profiles if it exists
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'ghanemifatima4@gmail.com';

    IF target_user_id IS NOT NULL THEN
        -- 1. Ensure user_roles has 'owner' role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'owner')
        ON CONFLICT (user_id) DO UPDATE SET role = 'owner';

        -- 2. Ensure profiles has 'kindergarten' user_type
        UPDATE public.profiles 
        SET user_type = 'kindergarten' 
        WHERE id = target_user_id;
        
        RAISE NOTICE 'User ghanemifatima4@gmail.com has been fixed.';
    ELSE
        RAISE NOTICE 'User ghanemifatima4@gmail.com not found in auth.users.';
    END IF;
END $$;
