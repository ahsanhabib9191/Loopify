import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface UserSettings {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  timezone: string;
  email_notifications: boolean;
  content_reminders: boolean;
  goal_reminders: boolean;
  weekly_reports: boolean;
  system_updates: boolean;
  theme: 'dark' | 'light';
  compact_mode: boolean;
  animations_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserSettingsData {
  display_name?: string;
  bio?: string;
  timezone?: string;
  email_notifications?: boolean;
  content_reminders?: boolean;
  goal_reminders?: boolean;
  weekly_reports?: boolean;
  system_updates?: boolean;
  theme?: 'dark' | 'light';
  compact_mode?: boolean;
  animations_enabled?: boolean;
}

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user settings
  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      // If no settings found, create default settings
      if (!data) {
        return createDefaultSettings();
      }

      setSettings(data);
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Create default settings for new user
  const createDefaultSettings = async () => {
    if (!user) return;

    try {
      const defaultSettings = {
        user_id: user.id,
        display_name: user.email?.split('@')[0] || null,
        bio: 'AI content creator and entrepreneur',
        timezone: 'America/New_York',
        email_notifications: true,
        content_reminders: true,
        goal_reminders: true,
        weekly_reports: true,
        system_updates: true,
        theme: 'dark' as const,
        compact_mode: false,
        animations_enabled: true,
      };

      const { data, error: upsertError } = await supabase
        .from('user_settings')
        .upsert([defaultSettings], { onConflict: 'user_id' })
        .select()
        .single();

      if (upsertError) {
        throw upsertError;
      }

      setSettings(data);
    } catch (err) {
      console.error('Error creating default settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to create settings');
    } finally {
      setLoading(false);
    }
  };

  // Update user settings
  const updateSettings = async (updates: UpdateUserSettingsData): Promise<UserSettings | null> => {
    if (!user || !settings) {
      setError('User not authenticated or settings not loaded');
      return null;
    }

    try {
      setIsSaving(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('id', settings.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setSettings(data);
      return data;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Apply theme from settings
  const applyTheme = (theme: 'dark' | 'light') => {
    // Apply theme to document
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  // Set up initial fetch and real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchSettings();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('user_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time settings update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            setSettings(payload.new as UserSettings);
            
            // Apply theme if it changed
            if (payload.old.theme !== payload.new.theme) {
              applyTheme(payload.new.theme);
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Apply theme when settings change
  useEffect(() => {
    if (settings) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme]);

  return {
    settings,
    loading,
    error,
    isSaving,
    updateSettings,
    refetch: fetchSettings,
  };
}