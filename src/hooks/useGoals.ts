import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Goal, Milestone, CreateGoalData, CreateMilestoneData, GoalProgress } from '../types/goals';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all goals for the current user
  const fetchGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setGoals(data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all milestones for the current user
  const fetchMilestones = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setMilestones(data || []);
    } catch (err) {
      console.error('Error fetching milestones:', err);
    }
  };

  // Create new goal
  const createGoal = async (goalData: CreateGoalData): Promise<Goal> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newGoal = {
        ...goalData,
        user_id: user.id,
        current_value: 0,
        status: 'active' as const,
      };

      const { data, error: createError } = await supabase
        .from('goals')
        .insert([newGoal])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setGoals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating goal:', err);
      throw err;
    }
  };

  // Update existing goal
  const updateGoal = async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error: updateError } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setGoals(prev => 
        prev.map(goal => goal.id === id ? { ...goal, ...data } : goal)
      );
      return data;
    } catch (err) {
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  // Delete goal
  const deleteGoal = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  // Create new milestone
  const createMilestone = async (milestoneData: CreateMilestoneData): Promise<Milestone> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newMilestone = {
        ...milestoneData,
        user_id: user.id,
        status: 'pending' as const,
      };

      const { data, error: createError } = await supabase
        .from('milestones')
        .insert([newMilestone])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setMilestones(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating milestone:', err);
      throw err;
    }
  };

  // Update milestone
  const updateMilestone = async (id: string, updates: Partial<Milestone>): Promise<Milestone> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error: updateError } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setMilestones(prev => 
        prev.map(milestone => milestone.id === id ? { ...milestone, ...data } : milestone)
      );
      return data;
    } catch (err) {
      console.error('Error updating milestone:', err);
      throw err;
    }
  };

  // Complete milestone
  const completeMilestone = async (id: string): Promise<void> => {
    await updateMilestone(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
  };

  // Delete milestone
  const deleteMilestone = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: deleteError } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      setMilestones(prev => prev.filter(milestone => milestone.id !== id));
    } catch (err) {
      console.error('Error deleting milestone:', err);
      throw err;
    }
  };

  // Get goal progress with calculations
  const getGoalProgress = (goal: Goal): GoalProgress => {
    const progressPercentage = goal.target_value > 0 
      ? Math.min((goal.current_value / goal.target_value) * 100, 100)
      : 0;

    let daysRemaining: number | undefined;
    let isOverdue = false;

    if (goal.target_date) {
      const targetDate = new Date(goal.target_date);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isOverdue = daysRemaining < 0;
    }

    return {
      goal,
      progressPercentage,
      daysRemaining,
      isOverdue,
      recentActivity: 0, // This could be calculated based on recent progress updates
    };
  };

  // Get goals by status
  const getGoalsByStatus = (status: Goal['status']) => {
    return goals.filter(goal => goal.status === status);
  };

  // Get milestones by goal
  const getMilestonesByGoal = (goalId: string) => {
    return milestones.filter(milestone => milestone.goal_id === goalId);
  };

  // Get goal statistics
  const getGoalStats = () => {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const overdue = goals.filter(g => {
      if (!g.target_date || g.status === 'completed') return false;
      return new Date(g.target_date) < new Date();
    }).length;

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;

    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      overdue,
      totalMilestones,
      completedMilestones,
      completionRate,
    };
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    fetchGoals();
    fetchMilestones();

    // Subscribe to real-time changes for goals
    const goalsSubscription = supabase
      .channel('goals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time goals update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setGoals(prev => [payload.new as Goal, ...prev]);
              break;
            case 'UPDATE':
              setGoals(prev => 
                prev.map(goal => 
                  goal.id === payload.new.id ? payload.new as Goal : goal
                )
              );
              break;
            case 'DELETE':
              setGoals(prev => prev.filter(goal => goal.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    // Subscribe to real-time changes for milestones
    const milestonesSubscription = supabase
      .channel('milestones_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'milestones',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time milestones update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setMilestones(prev => [payload.new as Milestone, ...prev]);
              break;
            case 'UPDATE':
              setMilestones(prev => 
                prev.map(milestone => 
                  milestone.id === payload.new.id ? payload.new as Milestone : milestone
                )
              );
              break;
            case 'DELETE':
              setMilestones(prev => prev.filter(milestone => milestone.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      goalsSubscription.unsubscribe();
      milestonesSubscription.unsubscribe();
    };
  }, [user]);

  return {
    goals,
    milestones,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    createMilestone,
    updateMilestone,
    completeMilestone,
    deleteMilestone,
    getGoalProgress,
    getGoalsByStatus,
    getMilestonesByGoal,
    getGoalStats,
    refetch: fetchGoals,
  };
}