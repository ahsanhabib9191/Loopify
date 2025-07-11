import React, { useState, useEffect } from 'react';
import { Goal, CreateGoalData, GoalCategory, GoalType, GoalPriority } from '../../types/goals';
import { X, Save, Target } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: CreateGoalData) => void;
  goal?: Goal;
}

const categoryOptions: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: 'content', label: 'Content Creation', emoji: '📝' },
  { value: 'growth', label: 'Audience Growth', emoji: '📈' },
  { value: 'engagement', label: 'Engagement', emoji: '💬' },
  { value: 'revenue', label: 'Revenue', emoji: '💰' },
  { value: 'learning', label: 'Learning & Skills', emoji: '🎓' },
  { value: 'personal', label: 'Personal Development', emoji: '🌟' },
];

const typeOptions: { value: GoalType; label: string; unit: string }[] = [
  { value: 'subscribers', label: 'Subscribers', unit: 'subscribers' },
  { value: 'followers', label: 'Followers', unit: 'followers' },
  { value: 'views', label: 'Views', unit: 'views' },
  { value: 'posts', label: 'Posts', unit: 'posts' },
  { value: 'videos', label: 'Videos', unit: 'videos' },
  { value: 'revenue', label: 'Revenue', unit: 'dollars' },
  { value: 'engagement_rate', label: 'Engagement Rate', unit: 'percent' },
  { value: 'custom', label: 'Custom Metric', unit: 'units' },
];

const priorityOptions: { value: GoalPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low Priority', color: 'text-gray-400' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-400' },
  { value: 'high', label: 'High Priority', color: 'text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'text-red-400' },
];

export function GoalModal({ isOpen, onClose, onSave, goal }: GoalModalProps) {
  const [formData, setFormData] = useState<CreateGoalData>({
    title: '',
    description: '',
    category: 'content',
    type: 'subscribers',
    target_value: 1000,
    target_date: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (goal) {
        setFormData({
          title: goal.title,
          description: goal.description || '',
          category: goal.category,
          type: goal.type,
          target_value: goal.target_value,
          target_date: goal.target_date || '',
          priority: goal.priority,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category: 'content',
          type: 'subscribers',
          target_value: 1000,
          target_date: '',
          priority: 'medium',
        });
      }
      setErrors({});
    }
  }, [isOpen, goal]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required';
    }
    
    if (formData.target_value <= 0) {
      newErrors.target_value = 'Target value must be greater than 0';
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

  const handleChange = (field: keyof CreateGoalData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedType = typeOptions.find(t => t.value === formData.type);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm p-6 border-b border-gray-800/30 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {goal ? 'Edit Goal' : 'Create New Goal'}
                </h2>
                <p className="text-sm text-gray-400">
                  Set a specific, measurable objective to track your progress
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
            <h3 className="text-lg font-semibold text-white border-b border-gray-800/30 pb-2">
              Goal Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="e.g., Reach 10,000 YouTube subscribers"
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
                placeholder="Describe what achieving this goal means to you..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Target & Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-800/30 pb-2">
              Target & Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Metric Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={formData.target_value}
                    onChange={(e) => handleChange('target_value', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                      errors.target_value ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="1000"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {selectedType?.unit}
                  </span>
                </div>
                {errors.target_value && <p className="text-red-400 text-sm mt-1">{errors.target_value}</p>}
              </div>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for open-ended goals
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
              <span>{goal ? 'Update Goal' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}