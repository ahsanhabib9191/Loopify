/*
  # Create Milestones Table

  1. New Tables
    - `milestones`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `goal_id` (uuid, optional foreign key to goals)
      - `title` (text, required)
      - `description` (text, optional)
      - `target_date` (date, optional)
      - `completed_at` (timestamp, optional)
      - `status` (text, default 'pending' - pending, completed, overdue)
      - `reward` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `milestones` table
    - Add policies for authenticated users to manage their own milestones
    - Add constraints for valid enum values

  3. Indexes
    - Add indexes for common query patterns
*/

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    goal_id uuid REFERENCES public.goals(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    target_date date,
    completed_at timestamptz,
    status text DEFAULT 'pending' NOT NULL,
    reward text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own milestones"
  ON public.milestones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones"
  ON public.milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
  ON public.milestones
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
  ON public.milestones
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add constraints for valid enum values
ALTER TABLE public.milestones ADD CONSTRAINT valid_milestone_status 
  CHECK (status IN ('pending', 'completed', 'overdue'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON public.milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_goal_id ON public.milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON public.milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_target_date ON public.milestones(target_date);
CREATE INDEX IF NOT EXISTS idx_milestones_created_at ON public.milestones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_milestones_user_status ON public.milestones(user_id, status);
CREATE INDEX IF NOT EXISTS idx_milestones_user_goal ON public.milestones(user_id, goal_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_milestones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milestones_updated_at
    BEFORE UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_milestones_updated_at();