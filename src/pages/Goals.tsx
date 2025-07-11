import React, { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { GoalCard } from '../components/Goals/GoalCard';
import { GoalModal } from '../components/Goals/GoalModal';
import { MilestoneCard } from '../components/Goals/MilestoneCard';
import { MilestoneModal } from '../components/Goals/MilestoneModal';
import { Goal, Milestone, CreateGoalData, CreateMilestoneData } from '../types/goals';
import { 
  Target, 
  Plus, 
  Flag, 
  TrendingUp, 
  Calendar, 
  Award, 
  RefreshCw,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

type TabType = 'overview' | 'goals' | 'milestones';
type FilterType = 'all' | 'active' | 'completed' | 'overdue';

export function Goals() {
  const {
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
    refetch,
  } = useGoals();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [goalFilter, setGoalFilter] = useState<FilterType>('all');
  const [milestoneFilter, setMilestoneFilter] = useState<FilterType>('all');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [editingMilestone, setEditingMilestone] = useState<Milestone | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = getGoalStats();

  // Filter goals based on selected filter
  const filteredGoals = React.useMemo(() => {
    let filtered = goals;
    
    switch (goalFilter) {
      case 'active':
        filtered = getGoalsByStatus('active');
        break;
      case 'completed':
        filtered = getGoalsByStatus('completed');
        break;
      case 'overdue':
        filtered = goals.filter(goal => {
          if (!goal.target_date || goal.status === 'completed') return false;
          return new Date(goal.target_date) < new Date();
        });
        break;
      default:
        filtered = goals;
    }
    
    return filtered;
  }, [goals, goalFilter, getGoalsByStatus]);

  // Filter milestones based on selected filter
  const filteredMilestones = React.useMemo(() => {
    let filtered = milestones;
    
    switch (milestoneFilter) {
      case 'active':
        filtered = milestones.filter(m => m.status === 'pending');
        break;
      case 'completed':
        filtered = milestones.filter(m => m.status === 'completed');
        break;
      case 'overdue':
        filtered = milestones.filter(m => {
          if (!m.target_date || m.status === 'completed') return false;
          return new Date(m.target_date) < new Date();
        });
        break;
      default:
        filtered = milestones;
    }
    
    return filtered;
  }, [milestones, milestoneFilter]);

  const handleCreateGoal = async (goalData: CreateGoalData) => {
    try {
      await createGoal(goalData);
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  const handleUpdateGoal = async (goalData: CreateGoalData) => {
    if (!editingGoal) return;
    
    try {
      await updateGoal(editingGoal.id, goalData);
      setEditingGoal(undefined);
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) return;
    
    try {
      await deleteGoal(id);
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const handleUpdateProgress = async (goal: Goal, newValue: number) => {
    try {
      const updates: Partial<Goal> = { current_value: newValue };
      
      // Auto-complete goal if target is reached
      if (newValue >= goal.target_value && goal.status === 'active') {
        updates.status = 'completed';
      }
      
      await updateGoal(goal.id, updates);
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleCreateMilestone = async (milestoneData: CreateMilestoneData) => {
    try {
      await createMilestone(milestoneData);
    } catch (err) {
      console.error('Failed to create milestone:', err);
    }
  };

  const handleUpdateMilestone = async (milestoneData: CreateMilestoneData) => {
    if (!editingMilestone) return;
    
    try {
      await updateMilestone(editingMilestone.id, milestoneData);
      setEditingMilestone(undefined);
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    
    try {
      await deleteMilestone(id);
    } catch (err) {
      console.error('Failed to delete milestone:', err);
    }
  };

  const handleCompleteMilestone = async (id: string) => {
    try {
      await completeMilestone(id);
    } catch (err) {
      console.error('Failed to complete milestone:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Failed to refresh goals:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: TrendingUp },
    { id: 'goals' as TabType, label: 'Goals', icon: Target },
    { id: 'milestones' as TabType, label: 'Milestones', icon: Flag },
  ];

  const goalFilterOptions = [
    { value: 'all' as FilterType, label: 'All Goals', count: goals.length },
    { value: 'active' as FilterType, label: 'Active', count: stats.activeGoals },
    { value: 'completed' as FilterType, label: 'Completed', count: stats.completedGoals },
    { value: 'overdue' as FilterType, label: 'Overdue', count: stats.overdue },
  ];

  const milestoneFilterOptions = [
    { value: 'all' as FilterType, label: 'All Milestones', count: milestones.length },
    { value: 'active' as FilterType, label: 'Active', count: milestones.filter(m => m.status === 'pending').length },
    { value: 'completed' as FilterType, label: 'Completed', count: stats.completedMilestones },
    { value: 'overdue' as FilterType, label: 'Overdue', count: milestones.filter(m => m.target_date && new Date(m.target_date) < new Date() && m.status !== 'completed').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Goals</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button onClick={handleRefresh} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Goals & Milestones</h1>
          <p className="text-gray-400">
            Track your progress towards your creator goals and celebrate milestones.
            {stats.totalGoals > 0 && (
              <span className="ml-2 text-cyan-400">
                {stats.activeGoals} active • {stats.completedGoals} completed • {Math.round(stats.completionRate)}% success rate
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setIsGoalModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 glass-card p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target size={20} className="text-cyan-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Total Goals</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalGoals}</p>
              </div>
              
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle size={20} className="text-emerald-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Active</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.activeGoals}</p>
              </div>
              
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award size={20} className="text-violet-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Completed</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.completedGoals}</p>
              </div>
              
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle size={20} className="text-red-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Overdue</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.overdue}</p>
              </div>
              
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flag size={20} className="text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Milestones</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalMilestones}</p>
              </div>
              
              <div className="glass-card p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp size={20} className="text-emerald-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-white">{Math.round(stats.completionRate)}%</p>
              </div>
            </div>

            {/* Recent Goals */}
            {goals.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Recent Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.slice(0, 6).map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goalProgress={getGoalProgress(goal)}
                      onEdit={setEditingGoal}
                      onDelete={handleDeleteGoal}
                      onUpdateProgress={handleUpdateProgress}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Milestones */}
            {milestones.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Recent Milestones</h3>
                  <button
                    onClick={() => setIsMilestoneModalOpen(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Milestone</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {milestones.slice(0, 5).map((milestone) => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      onEdit={setEditingMilestone}
                      onDelete={handleDeleteMilestone}
                      onComplete={handleCompleteMilestone}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <Filter size={16} className="text-gray-400 flex-shrink-0" />
                {goalFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGoalFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      goalFilter === option.value
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Goal</span>
              </button>
            </div>

            {/* Goals Grid */}
            {filteredGoals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {goalFilter === 'all' ? 'No Goals Yet' : `No ${goalFilter} Goals`}
                </h3>
                <p className="text-gray-400 mb-6">
                  {goalFilter === 'all' 
                    ? 'Create your first goal to start tracking your progress.'
                    : `You don't have any ${goalFilter} goals at the moment.`
                  }
                </p>
                {goalFilter === 'all' && (
                  <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                  >
                    <Plus size={18} />
                    <span>Create Your First Goal</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goalProgress={getGoalProgress(goal)}
                    onEdit={setEditingGoal}
                    onDelete={handleDeleteGoal}
                    onUpdateProgress={handleUpdateProgress}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <Filter size={16} className="text-gray-400 flex-shrink-0" />
                {milestoneFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMilestoneFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      milestoneFilter === option.value
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setIsMilestoneModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Milestone</span>
              </button>
            </div>

            {/* Milestones List */}
            {filteredMilestones.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Flag size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {milestoneFilter === 'all' ? 'No Milestones Yet' : `No ${milestoneFilter} Milestones`}
                </h3>
                <p className="text-gray-400 mb-6">
                  {milestoneFilter === 'all' 
                    ? 'Create milestones to celebrate your progress along the way.'
                    : `You don't have any ${milestoneFilter} milestones at the moment.`
                  }
                </p>
                {milestoneFilter === 'all' && (
                  <button 
                    onClick={() => setIsMilestoneModalOpen(true)}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                  >
                    <Plus size={18} />
                    <span>Create Your First Milestone</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMilestones.map((milestone) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    onEdit={setEditingMilestone}
                    onDelete={handleDeleteMilestone}
                    onComplete={handleCompleteMilestone}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(undefined);
        }}
        onSave={editingGoal ? handleUpdateGoal : handleCreateGoal}
        goal={editingGoal}
      />

      {/* Milestone Modal */}
      <MilestoneModal
        isOpen={isMilestoneModalOpen}
        onClose={() => {
          setIsMilestoneModalOpen(false);
          setEditingMilestone(undefined);
        }}
        onSave={editingMilestone ? handleUpdateMilestone : handleCreateMilestone}
        milestone={editingMilestone}
        goals={goals}
      />
    </div>
  );
}