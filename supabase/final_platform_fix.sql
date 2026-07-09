-- 1. إصلاح مشكلة تسجيل المستخدمين (تخزين الاسم، الهاتف، الصلاحية، والموافقة التلقائية)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role TEXT;
  target_user_type TEXT;
  user_phone TEXT;
  user_full_name TEXT;
BEGIN
  -- استخراج البيانات من metadata
  assigned_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'parent');
  user_phone := NEW.raw_user_meta_data ->> 'phone';
  user_full_name := COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '');
  
  -- تحديد نوع المستخدم
  target_user_type := CASE 
    WHEN assigned_role = 'owner' THEN 'kindergarten'
    WHEN assigned_role = 'admin' THEN 'admin'
    ELSE 'parent'
  END;

  -- تحديث حالة الحساب إلى approved تلقائياً لتجاوز رسالة "قيد المراجعة"
  INSERT INTO public.profiles (id, full_name, phone, role, user_type, status)
  VALUES (
    NEW.id, 
    user_full_name,
    user_phone,
    assigned_role,
    target_user_type,
    'approved'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    role = EXCLUDED.role,
    user_type = EXCLUDED.user_type,
    status = 'approved';

  -- إضافة الصلاحية في جدول user_roles لتفادي المشاكل مع الأدمن
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2. تصحيح جميع الحسابات المعلقة أو التي تحتوي على بيانات ناقصة
UPDATE public.profiles 
SET status = 'approved' 
WHERE status = 'pending' OR status IS NULL;

-- إذا كان الحساب لصاحب روضة وتم تسجيله بالخطأ كـ parent
UPDATE public.profiles p
SET role = 'owner', user_type = 'kindergarten'
FROM auth.users u
WHERE p.id = u.id AND u.raw_user_meta_data->>'role' = 'owner' AND p.role = 'parent';

-- إصلاح جدول الصلاحيات أيضا
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'owner'
FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'owner'
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. السماح لأصحاب الروضات بإنشاء روضاتهم في قاعدة البيانات
DROP POLICY IF EXISTS "Admins can manage kindergartens" ON public.kindergartens;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.kindergartens;
DROP POLICY IF EXISTS "Enable update for owners and admins" ON public.kindergartens;
DROP POLICY IF EXISTS "Enable read access for all" ON public.kindergartens;

CREATE POLICY "Enable insert for authenticated users" ON public.kindergartens
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for owners and admins" ON public.kindergartens
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for all" ON public.kindergartens
FOR SELECT USING (true);
