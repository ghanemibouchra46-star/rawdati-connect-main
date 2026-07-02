-- السماح لأصحاب الروضات بإنشاء روضتهم عند التسجيل
-- Run this in Supabase SQL Editor

-- 1. السماح لأي مستخدم مسجل بإضافة روضة جديدة
CREATE POLICY "Owners can insert their kindergarten"
ON public.kindergartens
FOR INSERT
WITH CHECK (true);

-- 2. السماح لصاحب الروضة بتعديل روضته فقط
CREATE POLICY "Owners can update their own kindergarten"
ON public.kindergartens
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.owner_kindergartens
    WHERE owner_id = auth.uid()
    AND kindergarten_id = kindergartens.id
  )
);

-- 3. السماح لأي مستخدم بإضافة ربط owner_kindergartens
CREATE POLICY "Allow insert owner_kindergartens"
ON public.owner_kindergartens
FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- 4. السماح للمستخدم برؤية روضته
CREATE POLICY "Owners can view their own link"
ON public.owner_kindergartens
FOR SELECT
USING (owner_id = auth.uid());
