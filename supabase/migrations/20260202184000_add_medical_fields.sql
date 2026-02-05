-- Add medical condition and food allergy fields to registration_requests table
ALTER TABLE public.registration_requests 
ADD COLUMN IF NOT EXISTS medical_condition TEXT,
ADD COLUMN IF NOT EXISTS food_allergies TEXT;
