-- Add medical information to children table
ALTER TABLE public.children 
ADD COLUMN IF NOT EXISTS medical_condition TEXT,
ADD COLUMN IF NOT EXISTS food_allergies TEXT;

-- Create staff table for teachers and employees
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher', -- teacher, assistant, cleaner, etc.
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their staff" ON public.staff
  FOR ALL USING (
    kindergarten_id IN (
      SELECT kindergarten_id FROM public.owner_kindergartens WHERE owner_id = auth.uid()
    )
  );

-- Create attendance table for both children and staff
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id TEXT NOT NULL,
  entity_id UUID NOT NULL, -- references children(id) or staff(id)
  entity_type TEXT NOT NULL CHECK (entity_type IN ('child', 'staff')),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_id, attendance_date)
);

-- Enable RLS for attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage attendance" ON public.attendance
  FOR ALL USING (
    kindergarten_id IN (
      SELECT kindergarten_id FROM public.owner_kindergartens WHERE owner_id = auth.uid()
    )
  );

-- Create payments table for tuition fees
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id TEXT NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE,
  for_month INTEGER NOT NULL CHECK (for_month >= 1 AND for_month <= 12),
  for_year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'debt')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage payments" ON public.payments
  FOR ALL USING (
    kindergarten_id IN (
      SELECT kindergarten_id FROM public.owner_kindergartens WHERE owner_id = auth.uid()
    )
  );
