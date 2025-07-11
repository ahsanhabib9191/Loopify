/*
  # Create goals and milestones tables

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text, nullable)
      - `category` (text)
      - `type` (text)
      - `target_value` (numeric)
      - `current_value` (numeric)
      - `target_date` (date, nullable)
      - `status` (text)
      - `priority` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `milestones`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `goal_id` (uuid, foreign key to goals, nullable)
      - `title` (text)
      - `description` (text, nullable)
      - `target_date` (date, nullable)
      - `completed_at` (timestamptz, nullable)
      - `status` (text)
      - `reward` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  type text NOT NULL,
  target_value numeric NOT NULL,
  current_value numeric NOT NULL DEFAULT 0,
  target_date date,
  status text NOT NULL,
  priority text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_category CHECK (category IN ('content', 'growth', 'engagement', 'revenue', 'learning', 'personal')),
  CONSTRAINT valid_type CHECK (type IN ('subscribers', 'followers', 'views', 'posts', 'videos', 'revenue', 'engagement_rate', 'custom')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES goals(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  target_date date,
  completed_at timestamptz,
  status text NOT NULL,
  reward text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'overdue'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_goal_id ON milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_created_at ON milestones(created_at DESC);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for goals
CREATE POLICY "Users can create their own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for milestones
CREATE POLICY "Users can create their own milestones"
  ON milestones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own milestones"
  ON milestones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
  ON milestones FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
  ON milestones FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create triggers to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON milestones
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();