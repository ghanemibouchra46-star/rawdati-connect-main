-- دالة للأدمن فقط: إرجاع كل profiles مع دور كل مستخدم (تتجاوز RLS)
-- إذا لم تكن سياسات "Admins can view all profiles" مطبقة، لوحة الأدمن تعتمد على هذه الدالة
CREATE OR REPLACE FUNCTION public.get_profiles_with_roles_for_admin()
RETURNS TABLE (
  id uuid,
  full_name text,
  phone text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.phone,
    p.status,
    p.created_at,
    p.updated_at,
    COALESCE((
      SELECT r.role::text
      FROM public.user_roles r
      WHERE r.user_id = p.id
      ORDER BY CASE r.role WHEN 'admin' THEN 1 WHEN 'owner' THEN 2 ELSE 3 END
      LIMIT 1
    ), 'parent')
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- صلاحية استدعاء الدالة للمستخدمين المسجلين
GRANT EXECUTE ON FUNCTION public.get_profiles_with_roles_for_admin() TO authenticated;
