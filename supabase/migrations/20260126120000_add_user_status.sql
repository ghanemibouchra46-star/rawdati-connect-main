-- Add status column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing profiles to be approved
UPDATE profiles SET status = 'approved' WHERE status IS NULL;
