-- Add user_type column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('kindergarten', 'parent', 'admin'));

-- Update user_type based on existing roles
UPDATE profiles p
SET user_type = 
  CASE 
    WHEN ur.role = 'owner' THEN 'kindergarten'
    WHEN ur.role = 'parent' THEN 'parent'
    WHEN ur.role = 'admin' THEN 'admin'
    ELSE 'parent' -- Default fallback
  END
FROM user_roles ur
WHERE p.id = ur.user_id;

-- Ensure new profiles get a default user_type if not specified
-- (This might require a trigger if roles are assigned later, but for now we'll assume the client sets it or the role is present)
