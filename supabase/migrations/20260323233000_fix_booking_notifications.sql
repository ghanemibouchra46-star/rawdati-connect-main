
-- Fix notifications table for bookings
-- 1. Add INSERT policy for authenticated users
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'Users can insert their own notifications'
  ) THEN
    CREATE POLICY "Users can insert their own notifications"
    ON public.notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- 2. Update type constraint to include 'booking'
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('info', 'success', 'warning', 'error', 'booking'));

-- 3. Change related_id from UUID to TEXT to support any kindergarten ID type
ALTER TABLE public.notifications ALTER COLUMN related_id TYPE TEXT;

-- 4. Ensure bookings table has insert policy for authenticated users
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Users can insert their own bookings'
  ) THEN
    CREATE POLICY "Users can insert their own bookings"
    ON public.bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
