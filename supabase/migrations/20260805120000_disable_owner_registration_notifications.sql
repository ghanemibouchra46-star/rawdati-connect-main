-- Disable owner notifications for parent registration requests
-- This stops the trigger that created notifications for kindergarten owners

DROP TRIGGER IF EXISTS on_registration_request_created ON public.registration_requests;
DROP FUNCTION IF EXISTS public.notify_owner_on_registration();
