
-- FULL BOOKING FIX (Combined for convenience)

-- 1. Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  kindergarten_id text NOT NULL,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
  parent_name text NOT NULL,
  phone text NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id)
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Add policies for bookings
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can view their own bookings') THEN
    CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can insert their own bookings') THEN
    CREATE POLICY "Users can insert their own bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- 2. Fix notifications table
-- Update type constraint to include 'booking'
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('info', 'success', 'warning', 'error', 'booking'));

-- Change related_id from UUID to TEXT to support any kindergarten ID type
ALTER TABLE public.notifications ALTER COLUMN related_id TYPE TEXT;

-- Add INSERT policy for notifications
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can insert their own notifications') THEN
    CREATE POLICY "Users can insert their own notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;
