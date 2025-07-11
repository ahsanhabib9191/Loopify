/*
  # Create Goals Table

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `description` (text, optional)
      - `category` (text, required - content, growth, engagement, revenue, learning, personal)
      - `type` (text, required - subscribers, followers, views, posts, videos, revenue, engagement_rate, custom)
      - `target_value` (numeric, required)
      - `current_value` (numeric, default 0)
      - `target_date` (date, optional)
      - `status` (text, default 'active' - active, completed, paused, cancelled)
      - `priority` (text, default 'medium' - low, medium, high, critical)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `goals` table
    - Add policies for authenticated users to manage their own goals
    - Add constraints for valid enum values

  3. Indexes
    - Add indexes for common query patterns
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    type text NOT NULL,
    target_value numeric NOT NULL,
    current_value numeric DEFAULT 0 NOT NULL,
    target_date date,
    status text DEFAULT 'active' NOT NULL,
    priority text DEFAULT 'medium' NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own goals"
  ON public.goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON public.goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON public.goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add constraints for valid enum values
ALTER TABLE public.goals ADD CONSTRAINT valid_category 
  CHECK (category IN ('content', 'growth', 'engagement', 'revenue', 'learning', 'personal'));

ALTER TABLE public.goals ADD CONSTRAINT valid_type 
  CHECK (type IN ('subscribers', 'followers', 'views', 'posts', 'videos', 'revenue', 'engagement_rate', 'custom'));

ALTER TABLE public.goals ADD CONSTRAINT valid_status 
  CHECK (status IN ('active', 'completed', 'paused', 'cancelled'));

ALTER TABLE public.goals ADD CONSTRAINT valid_priority 
  CHECK (priority IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE public.goals ADD CONSTRAINT positive_target_value 
  CHECK (target_value > 0);

ALTER TABLE public.goals ADD CONSTRAINT non_negative_current_value 
  CHECK (current_value >= 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON public.goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_priority ON public.goals(priority);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON public.goals(target_date);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON public.goals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON public.goals(user_id, status);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION update_goals_updated_at();