-- Allow admins to manage all registration requests
-- This policy uses the existing has_role function to check for 'admin' role

DO $$ 
BEGIN
    -- Drop existing policy if it exists to avoid conflicts
    DROP POLICY IF EXISTS "Admins can manage all registration requests" ON public.registration_requests;
    
    -- Create new policy
    CREATE POLICY "Admins can manage all registration requests"
    ON public.registration_requests
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));
END $$;

-- Also ensure registrations can be seen by admins if not already covered by "Users can view their own requests"
-- The existing policy is: USING (auth.uid() = user_id OR auth.uid() IS NULL);
-- Note: auth.uid() IS NULL might be for public view, but usually we want restricted access.
-- Let's update the select policy too just in case.

DROP POLICY IF EXISTS "Allow admins to view all requests" ON public.registration_requests;
CREATE POLICY "Allow admins to view all requests"
ON public.registration_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
