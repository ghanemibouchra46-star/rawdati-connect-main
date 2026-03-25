-- Force assign admin role to specific emails directly
DO $$
DECLARE
    v_rec RECORD;
BEGIN
    FOR v_rec IN 
        SELECT id, email FROM auth.users 
        WHERE lower(email) IN (
            'bouchragh1268967@gmail.com', 
            'ghanemifatima4@gmail.com', 
            'ghanemibouchra46@gmail.com', 
            'rawdati245@gmail.com'
        )
    LOOP
        -- 1. Ensure profile exists and has admin role
        INSERT INTO public.profiles (id, full_name, role, status)
        VALUES (v_rec.id, 'Admin User', 'admin', 'approved')
        ON CONFLICT (id) DO UPDATE
        SET role = 'admin', status = 'approved';

        -- 2. Ensure user_roles has admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (v_rec.id, 'admin'::public.app_role)
        ON CONFLICT (user_id, role) DO NOTHING;

        RAISE NOTICE 'Admin role forcefully assigned to %', v_rec.email;
    END LOOP;
END $$;
