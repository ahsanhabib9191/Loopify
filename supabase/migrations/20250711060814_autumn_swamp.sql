/*
  # Create user settings table

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
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
*/

-- Create user settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS user_settings_user_id_key ON public.user_settings(user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);