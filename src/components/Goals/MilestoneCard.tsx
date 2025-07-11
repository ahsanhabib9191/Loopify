import React from 'react';
import { Milestone } from '../../types/goals';
import { Calendar, CheckCircle, Clock, Gift, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function MilestoneCard({ milestone, onEdit, onDelete, onComplete }: MilestoneCardProps) {
  const isOverdue = milestone.target_date && 
    new Date(milestone.target_date) < new Date() && 
    milestone.status !== 'completed';

  const isCompleted = milestone.status === 'completed';

  return (
    <div className={`glass-card p-4 transition-all duration-300 group ${
      isCompleted ? 'bg-emerald-500/10 border-emerald-500/20' : 
      isOverdue ? 'bg-red-500/10 border-red-500/20' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onComplete(milestone.id)}
            disabled={isCompleted}
            className={`mt-1 p-1 rounded-full transition-colors ${
              isCompleted 
                ? 'text-emerald-400 cursor-default' 
                : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            <CheckCircle size={20} className={isCompleted ? 'fill-current' : ''} />
          </button>
          
          <div className="flex-1">
            <h4 className={`font-medium transition-all ${
              isCompleted ? 'text-emerald-400 line-through' : 'text-white'
            }`}>
              {milestone.title}
            </h4>
            
            {milestone.description && (
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                {milestone.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2 text-xs">
              {milestone.target_date && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue ? 'text-red-400' : 'text-gray-500'
                }`}>
                  <Calendar size={12} />
                  <span>
                    {isCompleted && milestone.completed_at
                      ? `Completed ${format(new Date(milestone.completed_at), 'MMM d')}`
                      : format(new Date(milestone.target_date), 'MMM d, yyyy')
                    }
                  </span>
                </div>
              )}
              
              {milestone.reward && (
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Gift size={12} />
                  <span>{milestone.reward}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock size={12} />
                <span>{format(new Date(milestone.created_at), 'MMM d')}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(milestone)}
            className="p-1 hover:bg-gray-700/50 rounded transition-colors"
          >
            <Edit size={14} className="text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={() => onDelete(milestone.id)}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
          >
            <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}