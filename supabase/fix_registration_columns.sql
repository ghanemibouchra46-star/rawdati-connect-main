-- Add medical condition and food allergy fields to registration_requests table if they are missing
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registration_requests' AND column_name='medical_condition') THEN
    ALTER TABLE public.registration_requests ADD COLUMN medical_condition TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registration_requests' AND column_name='food_allergies') THEN
    ALTER TABLE public.registration_requests ADD COLUMN food_allergies TEXT;
  END IF;
  
  -- Ensure status column exists and has the correct check constraint
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registration_requests' AND column_name='status') THEN
    ALTER TABLE public.registration_requests ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Also add medical columns to children table to ensure they match
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='children' AND column_name='medical_condition') THEN
    ALTER TABLE public.children ADD COLUMN medical_condition TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='children' AND column_name='food_allergies') THEN
    ALTER TABLE public.children ADD COLUMN food_allergies TEXT;
  END IF;
END $$;
