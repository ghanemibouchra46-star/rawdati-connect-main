-- Add status column to kindergartens table for admin management
ALTER TABLE public.kindergartens 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Set all existing kindergartens as approved since they were pre-loaded
UPDATE public.kindergartens SET status = 'approved' WHERE status = 'pending';
