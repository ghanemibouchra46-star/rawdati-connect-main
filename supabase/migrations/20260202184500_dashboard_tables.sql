-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('child', 'staff')),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_id, attendance_date)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id TEXT NOT NULL,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  for_month INTEGER NOT NULL,
  for_year INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'debt')) DEFAULT 'pending',
  payment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add medical columns to children if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='children' AND column_name='medical_condition') THEN
    ALTER TABLE children ADD COLUMN medical_condition TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='children' AND column_name='food_allergies') THEN
    ALTER TABLE children ADD COLUMN food_allergies TEXT;
  END IF;
END $$;
