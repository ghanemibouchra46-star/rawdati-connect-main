-- Add premium fields to kindergartens table
ALTER TABLE public.kindergartens 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_info TEXT DEFAULT NULL;

-- Add comments
COMMENT ON COLUMN public.kindergartens.is_premium IS 'Whether the kindergarten is premium (offers subscription services)';
COMMENT ON COLUMN public.kindergartens.payment_info IS 'Payment information for premium subscriptions';
