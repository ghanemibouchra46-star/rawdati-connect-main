-- Create kindergartens table for Mascara platform
CREATE TABLE IF NOT EXISTS public.kindergartens (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  municipality TEXT NOT NULL,
  municipality_ar TEXT NOT NULL,
  municipality_fr TEXT NOT NULL,
  address TEXT NOT NULL,
  address_ar TEXT NOT NULL,
  address_fr TEXT NOT NULL,
  phone TEXT NOT NULL,
  price_per_month INTEGER NOT NULL,
  age_min INTEGER NOT NULL DEFAULT 3,
  age_max INTEGER NOT NULL DEFAULT 6,
  working_hours_open TEXT NOT NULL DEFAULT '07:30',
  working_hours_close TEXT NOT NULL DEFAULT '17:00',
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  images JSONB NOT NULL DEFAULT '[]',
  services TEXT[] NOT NULL DEFAULT '{}',
  activities JSONB NOT NULL DEFAULT '[]',
  facilities JSONB NOT NULL DEFAULT '[]',
  price_breakdown JSONB NOT NULL DEFAULT '[]',
  has_autism_wing BOOLEAN NOT NULL DEFAULT false,
  description_ar TEXT,
  description_fr TEXT,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kindergartens ENABLE ROW LEVEL SECURITY;

-- Anyone can read kindergartens (public listing)
CREATE POLICY "Public can view kindergartens"
ON public.kindergartens
FOR SELECT
USING (true);

-- Only admins can insert/update/delete (for future admin panel)
CREATE POLICY "Admins can manage kindergartens"
ON public.kindergartens
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_kindergartens_municipality ON public.kindergartens(municipality);
CREATE INDEX IF NOT EXISTS idx_kindergartens_price ON public.kindergartens(price_per_month);
CREATE INDEX IF NOT EXISTS idx_kindergartens_rating ON public.kindergartens(rating DESC);

-- Trigger for updated_at
CREATE TRIGGER update_kindergartens_updated_at
  BEFORE UPDATE ON public.kindergartens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
