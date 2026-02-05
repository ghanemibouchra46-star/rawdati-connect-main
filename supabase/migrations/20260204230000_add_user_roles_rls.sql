-- Add RLS policies for user_roles table to allow admin registration

-- Enable RLS on user_roles if not already enabled
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow insert own role" ON user_roles;
DROP POLICY IF EXISTS "Allow select own role" ON user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to insert own role" ON user_roles;
DROP POLICY IF EXISTS "Allow users to read own roles" ON user_roles;

-- Allow authenticated users to insert their own role
CREATE POLICY "Allow insert own role" ON user_roles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to select their own roles
CREATE POLICY "Allow select own role" ON user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT ON user_roles TO authenticated;
