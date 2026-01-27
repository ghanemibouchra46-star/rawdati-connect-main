-- Create children table
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  kindergarten_id TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  photo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create child_activities table
CREATE TABLE IF NOT EXISTS child_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  kindergarten_id TEXT,
  activity_type TEXT CHECK (activity_type IN ('meal', 'nap', 'play', 'learning', 'other')),
  description TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_activities ENABLE ROW LEVEL SECURITY;

-- Policies for children table
CREATE POLICY "Parents can view their own children" ON children
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert their own children" ON children
  FOR INSERT WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update their own children" ON children
  FOR UPDATE USING (parent_id = auth.uid());

-- Policies for child_activities table
CREATE POLICY "Parents can view activities of their children" ON child_activities
  FOR SELECT USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

CREATE POLICY "Kindergarten owners can insert activities" ON child_activities
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_child_activities_child_id ON child_activities(child_id);
CREATE INDEX IF NOT EXISTS idx_child_activities_created_at ON child_activities(created_at DESC);
