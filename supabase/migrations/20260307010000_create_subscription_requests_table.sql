-- Create subscription_requests table for premium kindergarten subscriptions
CREATE TABLE IF NOT EXISTS public.subscription_requests (
  id TEXT PRIMARY KEY,
  kindergarten_id TEXT NOT NULL,
  parent_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age TEXT NOT NULL,
  ccp TEXT NOT NULL,
  address TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_confirmed BOOLEAN NOT NULL DEFAULT false,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_subscription_requests_kindergarten 
    FOREIGN KEY (kindergarten_id) REFERENCES public.kindergartens(id) ON DELETE CASCADE,
  CONSTRAINT fk_subscription_requests_parent 
    FOREIGN KEY (parent_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can insert subscription requests
CREATE POLICY "Public can insert subscription requests"
ON public.subscription_requests
FOR INSERT
WITH CHECK (true);

-- Users can view their own requests, admins can view all
CREATE POLICY "Users can view own subscription requests, admins can view all"
ON public.subscription_requests
FOR SELECT
USING (
  auth.uid() = parent_id OR 
  public.has_role(auth.uid(), 'admin')
);

-- Kindergarten owners can view requests for their kindergartens
CREATE POLICY "Owners can view requests for their kindergartens"
ON public.subscription_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.owner_kindergartens 
    WHERE owner_kindergartens.owner_id = auth.uid() 
    AND owner_kindergartens.kindergarten_id = subscription_requests.kindergarten_id
  )
);

-- Users can update their own requests, admins can update all
CREATE POLICY "Users can update own requests, admins can update all"
ON public.subscription_requests
FOR UPDATE
USING (
  auth.uid() = parent_id OR 
  public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete requests
CREATE POLICY "Only admins can delete subscription requests"
ON public.subscription_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscription_requests_kindergarten_id ON public.subscription_requests(kindergarten_id);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_parent_id ON public.subscription_requests(parent_id);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_status ON public.subscription_requests(status);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_created_at ON public.subscription_requests(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_subscription_requests_updated_at
  BEFORE UPDATE ON public.subscription_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.subscription_requests IS 'Premium subscription requests for kindergartens with payment information';
