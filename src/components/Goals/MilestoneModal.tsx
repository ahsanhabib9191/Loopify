import React, { useState, useEffect } from 'react';
import { Milestone, CreateMilestoneData, Goal } from '../../types/goals';
import { X, Save, Flag } from 'lucide-react';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestoneData: CreateMilestoneData) => void;
  milestone?: Milestone;
  goals: Goal[];
}

export function MilestoneModal({ isOpen, onClose, onSave, milestone, goals }: MilestoneModalProps) {
  const [formData, setFormData] = useState<CreateMilestoneData>({
    goal_id: '',
    title: '',
    description: '',
    target_date: '',
    reward: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (milestone) {
        setFormData({
          goal_id: milestone.goal_id || '',
          title: milestone.title,
          description: milestone.description || '',
          target_date: milestone.target_date || '',
          reward: milestone.reward || '',
        });
      } else {
        setFormData({
          goal_id: '',
          title: '',
          description: '',
          target_date: '',
          reward: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, milestone]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Milestone title is required';
    }

    if (formData.target_date) {
      const targetDate = new Date(formData.target_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (targetDate < today) {
        newErrors.target_date = 'Target date cannot be in the past';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof CreateMilestoneData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm p-6 border-b border-gray-800/30 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
                <Flag size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {milestone ? 'Edit Milestone' : 'Create New Milestone'}
                </h2>
                <p className="text-sm text-gray-400">
                  Set a checkpoint to celebrate your progress
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Milestone Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="e.g., Reach 5,000 subscribers"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="What makes this milestone special?"
              />
            </div>

            {activeGoals.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Related Goal (Optional)
                </label>
                <select
                  value={formData.goal_id}
                  onChange={(e) => handleChange('goal_id', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="">No related goal</option>
                  {activeGoals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => handleChange('target_date', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                  errors.target_date ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.target_date && <p className="text-red-400 text-sm mt-1">{errors.target_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reward (Optional)
              </label>
              <input
                type="text"
                value={formData.reward}
                onChange={(e) => handleChange('reward', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="e.g., Celebrate with dinner out"
              />
              <p className="text-xs text-gray-500 mt-1">
                How will you celebrate achieving this milestone?
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-800/30">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{milestone ? 'Update Milestone' : 'Create Milestone'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}