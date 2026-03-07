-- Create subscription_requests table (SIMPLE VERSION)
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
  status TEXT NOT NULL DEFAULT 'pending',
  payment_confirmed BOOLEAN NOT NULL DEFAULT false,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

-- Simple policies
CREATE POLICY "Public can insert subscription requests"
ON public.subscription_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view own subscription requests, admins can view all"
ON public.subscription_requests
FOR SELECT
USING (
  auth.uid() = parent_id OR 
  auth.uid()::text = 'bouchragh1268967@gmail.com' OR
  auth.uid()::text = 'ghanemifatima4@gmail.com' OR
  auth.uid()::text = 'ghanemibouchra46@gmail.com'
);

CREATE POLICY "Users can update own requests, admins can update all"
ON public.subscription_requests
FOR UPDATE
USING (
  auth.uid() = parent_id OR 
  auth.uid()::text = 'bouchragh1268967@gmail.com' OR
  auth.uid()::text = 'ghanemifatima4@gmail.com' OR
  auth.uid()::text = 'ghanemibouchra46@gmail.com'
);

CREATE POLICY "Only admins can delete subscription requests"
ON public.subscription_requests
FOR DELETE
USING (
  auth.uid()::text = 'bouchragh1268967@gmail.com' OR
  auth.uid()::text = 'ghanemifatima4@gmail.com' OR
  auth.uid()::text = 'ghanemibouchra46@gmail.com'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_requests_kindergarten_id ON public.subscription_requests(kindergarten_id);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_parent_id ON public.subscription_requests(parent_id);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_status ON public.subscription_requests(status);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_created_at ON public.subscription_requests(created_at DESC);
