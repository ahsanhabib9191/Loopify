/*
  # Create User Settings Table
  
  1. New Tables
     - `user_settings` - Stores user preferences and settings
       - `id` (uuid, primary key)
       - `user_id` (uuid, references auth.users)
       - `display_name` (text)
       - `bio` (text)
       - `timezone` (text)
       - Various notification and appearance settings
  
  2. Security
     - Enable RLS on `user_settings` table
     - Add policies for authenticated users to manage their own settings
*/

-- Check if the table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_settings') THEN
    -- Create user_settings table
    CREATE TABLE public.user_settings (
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
    CREATE UNIQUE INDEX user_settings_user_id_key ON public.user_settings(user_id);

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
  END IF;
END $$;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_settings_updated_at();