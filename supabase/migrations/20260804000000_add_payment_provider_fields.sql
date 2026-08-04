-- Add provider tracking columns to payment_transactions
ALTER TABLE public.payment_transactions
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'chargily',
  ADD COLUMN IF NOT EXISTS provider_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS provider_reference TEXT;

CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_status
  ON public.payment_transactions(provider_status);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider
  ON public.payment_transactions(provider);
