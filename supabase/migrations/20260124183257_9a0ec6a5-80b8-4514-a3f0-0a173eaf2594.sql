-- Create owner_kindergartens table to map owners to their kindergartens
CREATE TABLE public.owner_kindergartens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  kindergarten_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_id, kindergarten_id)
);

-- Enable RLS
ALTER TABLE public.owner_kindergartens ENABLE ROW LEVEL SECURITY;

-- Policies for owner_kindergartens
CREATE POLICY "Owners can view their own kindergartens"
ON public.owner_kindergartens
FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all owner_kindergartens"
ON public.owner_kindergartens
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to notify kindergarten owner on new registration
CREATE OR REPLACE FUNCTION public.notify_owner_on_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner_user_id UUID;
BEGIN
  -- Find the owner of the kindergarten
  SELECT owner_id INTO owner_user_id
  FROM public.owner_kindergartens
  WHERE kindergarten_id = NEW.kindergarten_id
  LIMIT 1;

  -- If owner found, create notification
  IF owner_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (
      owner_user_id,
      'طلب تسجيل جديد',
      'تم استلام طلب تسجيل جديد من ' || NEW.parent_name || ' لطفل ' || NEW.child_name,
      'registration',
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_registration_request_created
AFTER INSERT ON public.registration_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_owner_on_registration();