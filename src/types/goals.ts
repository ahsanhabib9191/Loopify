export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  type: GoalType;
  target_value: number;
  current_value: number;
  target_date?: string;
  status: GoalStatus;
  priority: GoalPriority;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  user_id: string;
  goal_id?: string;
  title: string;
  description?: string;
  target_date?: string;
  completed_at?: string;
  status: MilestoneStatus;
  reward?: string;
  created_at: string;
  updated_at: string;
}

export type GoalCategory = 
  | 'content' 
  | 'growth' 
  | 'engagement' 
  | 'revenue' 
  | 'learning' 
  | 'personal';

export type GoalType = 
  | 'subscribers' 
  | 'followers' 
  | 'views' 
  | 'posts' 
  | 'videos' 
  | 'revenue' 
  | 'engagement_rate' 
  | 'custom';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';

export type MilestoneStatus = 'pending' | 'completed' | 'overdue';

export interface GoalProgress {
  goal: Goal;
  progressPercentage: number;
  daysRemaining?: number;
  isOverdue: boolean;
  recentActivity: number;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  category: GoalCategory;
  type: GoalType;
  target_value: number;
  target_date?: string;
  priority: GoalPriority;
}

export interface CreateMilestoneData {
  goal_id?: string;
  title: string;
  description?: string;
  target_date?: string;
  reward?: string;
}