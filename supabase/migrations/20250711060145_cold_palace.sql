/*
  # Fix Goals Table Migration
  
  1. Changes
     - Adds IF NOT EXISTS to policy creation statements
     - Ensures all policies are created only if they don't already exist
*/

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Check if the "Users can view their own goals" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'goals' AND policyname = 'Users can view their own goals'
    ) THEN
        CREATE POLICY "Users can view their own goals"
          ON public.goals
          FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;

    -- Check if the "Users can insert their own goals" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'goals' AND policyname = 'Users can insert their own goals'
    ) THEN
        CREATE POLICY "Users can insert their own goals"
          ON public.goals
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Check if the "Users can update their own goals" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'goals' AND policyname = 'Users can update their own goals'
    ) THEN
        CREATE POLICY "Users can update their own goals"
          ON public.goals
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Check if the "Users can delete their own goals" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'goals' AND policyname = 'Users can delete their own goals'
    ) THEN
        CREATE POLICY "Users can delete their own goals"
          ON public.goals
          FOR DELETE
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;
END $$;