import React from 'react';
import { Goal, GoalProgress } from '../../types/goals';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Flag, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface GoalCardProps {
  goalProgress: GoalProgress;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (goal: Goal, newValue: number) => void;
}

const categoryColors = {
  content: 'from-blue-500 to-cyan-500',
  growth: 'from-emerald-500 to-teal-500',
  engagement: 'from-purple-500 to-pink-500',
  revenue: 'from-yellow-500 to-amber-500',
  learning: 'from-indigo-500 to-violet-500',
  personal: 'from-rose-500 to-pink-500',
};

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

const statusColors = {
  active: 'bg-emerald-500/20 text-emerald-400',
  completed: 'bg-cyan-500/20 text-cyan-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export function GoalCard({ goalProgress, onEdit, onDelete, onUpdateProgress }: GoalCardProps) {
  const { goal, progressPercentage, daysRemaining, isOverdue } = goalProgress;

  const handleProgressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    onUpdateProgress(goal, newValue);
  };

  return (
    <div className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${categoryColors[goal.category]}`}>
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-gradient transition-all duration-300">
              {goal.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[goal.status]}`}>
                {goal.status}
              </span>
              <Flag size={12} className={priorityColors[goal.priority]} />
              <span className="text-xs text-gray-500 capitalize">{goal.priority}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Edit size={16} className="text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {goal.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Progress</span>
          <span className="text-sm font-bold text-white">
            {goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${categoryColors[goal.category]} transition-all duration-500`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {progressPercentage.toFixed(1)}% complete
          </span>
          {goal.status === 'completed' && (
            <CheckCircle size={16} className="text-emerald-400" />
          )}
        </div>
      </div>

      {/* Quick Progress Update */}
      {goal.status === 'active' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2">
            Update Progress
          </label>
          <input
            type="number"
            min="0"
            max={goal.target_value}
            value={goal.current_value}
            onChange={handleProgressUpdate}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Target Date & Status */}
      <div className="flex items-center justify-between text-sm">
        {goal.target_date && (
          <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
            {isOverdue ? <AlertTriangle size={14} /> : <Calendar size={14} />}
            <span>
              {isOverdue ? 'Overdue' : daysRemaining !== undefined ? `${daysRemaining} days left` : format(new Date(goal.target_date), 'MMM d, yyyy')}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-1 text-gray-500">
          <Clock size={12} />
          <span>{format(new Date(goal.created_at), 'MMM d')}</span>
        </div>
      </div>

      {/* Achievement Badge */}
      {progressPercentage >= 100 && goal.status !== 'completed' && (
        <div className="mt-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-emerald-400 font-medium text-sm">Goal Achieved! 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
}