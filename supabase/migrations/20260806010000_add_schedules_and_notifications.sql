-- Add schedules table and enhance notifications schema for kindergarten and parent support

-- 1. Create schedules table
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id TEXT REFERENCES public.kindergartens(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  activity_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enhance notifications table schema
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS kindergarten_id TEXT REFERENCES public.kindergartens(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS child_name TEXT;

ALTER TABLE public.notifications
  ALTER COLUMN type SET DEFAULT 'info';

-- 3. Normalize existing notification data where appropriate
UPDATE public.notifications
SET parent_id = user_id
WHERE parent_id IS NULL AND user_id IS NOT NULL;

-- 4. Enable RLS on schedules and notifications
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. Policies for schedules and notifications
DROP POLICY IF EXISTS "Public read schedules" ON public.schedules;
CREATE POLICY "Public read schedules"
  ON public.schedules
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners write schedules" ON public.schedules;
CREATE POLICY "Owners write schedules"
  ON public.schedules
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT owner_id FROM public.owner_kindergartens WHERE kindergarten_id = public.schedules.kindergarten_id
    )
  );

DROP POLICY IF EXISTS "Parents read notifications" ON public.notifications;
CREATE POLICY "Parents read notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Owners insert notifications" ON public.notifications;
CREATE POLICY "Owners insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
