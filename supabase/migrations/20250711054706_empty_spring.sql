/*
  # Create user settings table

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, references auth.users)
      - `display_name` (text, nullable)
      - `bio` (text, nullable)
      - `timezone` (text, default 'America/New_York')
      - `email_notifications` (boolean, default true)
      - `content_reminders` (boolean, default true)
      - `goal_reminders` (boolean, default true)
      - `weekly_reports` (boolean, default true)
      - `system_updates` (boolean, default true)
      - `theme` (text, default 'dark')
      - `compact_mode` (boolean, default false)
      - `animations_enabled` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `user_settings` table
    - Add policies for authenticated users to manage their own settings
  3. Triggers
    - Add trigger to update `updated_at` column on update
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  bio text,
  timezone text DEFAULT 'America/New_York',
  email_notifications boolean DEFAULT true,
  content_reminders boolean DEFAULT true,
  goal_reminders boolean DEFAULT true,
  weekly_reports boolean DEFAULT true,
  system_updates boolean DEFAULT true,
  theme text DEFAULT 'dark',
  compact_mode boolean DEFAULT false,
  animations_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (uid() = user_id);

CREATE POLICY "Users can view their own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (uid() = user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_user_settings_updated_at();

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);