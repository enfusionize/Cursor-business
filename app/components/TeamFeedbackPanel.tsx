'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Users, 
  MessageSquare, 
  Plus,
  Star,
  Clock,
  Target,
  Lightbulb,
  Zap,
  FileText,
  Share2,
  Edit3,
  Bot,
  Palette,
  Link,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface TeamFeedbackPanelProps {
  onClose: () => void;
}

const TeamFeedbackPanel: React.FC<TeamFeedbackPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'collect' | 'analysis' | 'roadmap'>('collect');
  const [newFeedback, setNewFeedback] = useState({
    category: '',
    priority: 'medium',
    description: '',
    impact: '',
    effort: ''
  });

  const feedbackCategories = [
    { id: 'file-sharing', name: 'File Sharing & Storage', icon: Share2, color: 'blue' },
    { id: 'collaboration', name: 'Team Collaboration', icon: Users, color: 'green' },
    { id: 'ai-tools', name: 'AI Editors & Tools', icon: Bot, color: 'purple' },
    { id: 'design-tools', name: 'Design Tool Access', icon: Palette, color: 'pink' },
    { id: 'workflow', name: 'Workflow Automation', icon: Zap, color: 'yellow' },
    { id: 'figma-integration', name: 'Figma Integration', icon: Link, color: 'orange' },
    { id: 'editing', name: 'Real-time Editing', icon: Edit3, color: 'red' },
    { id: 'other', name: 'Other Ideas', icon: Lightbulb, color: 'indigo' }
  ];

  const existingFeedback = [
    {
      id: 1,
      category: 'figma-integration',
      title: 'One-click Figma import/export',
      description: 'Seamlessly import designs from Figma and export back with changes',
      priority: 'high',
      votes: 12,
      status: 'in-progress',
      submittedBy: 'Sarah Chen',
      submittedAt: '2024-01-15T10:30:00Z',
      impact: 'high',
      effort: 'medium'
    },
    {
      id: 2,
      category: 'ai-tools',
      title: 'AI-powered design suggestions',
      description: 'Real-time AI suggestions while designing to improve layouts and color choices',
      priority: 'high',
      votes: 8,
      status: 'planned',
      submittedBy: 'Alex Rodriguez',
      submittedAt: '2024-01-14T15:45:00Z',
      impact: 'high',
      effort: 'high'
    },
    {
      id: 3,
      category: 'file-sharing',
      title: 'Version control for design files',
      description: 'Git-like version control specifically designed for design assets',
      priority: 'medium',
      votes: 15,
      status: 'completed',
      submittedBy: 'Mike Johnson',
      submittedAt: '2024-01-13T09:15:00Z',
      impact: 'medium',
      effort: 'high'
    },
    {
      id: 4,
      category: 'collaboration',
      title: 'Real-time cursor tracking',
      description: 'See where team members are working in real-time across all tools',
      priority: 'low',
      votes: 6,
      status: 'backlog',
      submittedBy: 'Emma Davis',
      submittedAt: '2024-01-12T14:20:00Z',
      impact: 'low',
      effort: 'medium'
    },
    {
      id: 5,
      category: 'workflow',
      title: 'Automated asset optimization',
      description: 'Automatically optimize images and assets for different platforms',
      priority: 'medium',
      votes: 10,
      status: 'planned',
      submittedBy: 'David Kim',
      submittedAt: '2024-01-11T11:30:00Z',
      impact: 'medium',
      effort: 'low'
    }
  ];

  const handleSubmitFeedback = () => {
    // In real app, this would submit to API
    console.log('Submitting feedback:', newFeedback);
    setNewFeedback({
      category: '',
      priority: 'medium',
      description: '',
      impact: '',
      effort: ''
    });
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = feedbackCategories.find(c => c.id === categoryId);
    return category ? category.icon : Lightbulb;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = feedbackCategories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'planned': return 'yellow';
      case 'backlog': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'planned': return Target;
      case 'backlog': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const roadmapItems = [
    {
      quarter: 'Q1 2024',
      items: [
        { title: 'Figma One-Click Integration', status: 'in-progress', impact: 'high' },
        { title: 'AI Design Suggestions', status: 'planned', impact: 'high' },
        { title: 'Advanced File Sharing', status: 'planned', impact: 'medium' }
      ]
    },
    {
      quarter: 'Q2 2024',
      items: [
        { title: 'Real-time Collaboration', status: 'planned', impact: 'high' },
        { title: 'Automated Asset Optimization', status: 'planned', impact: 'medium' },
        { title: 'Advanced AI Editors', status: 'planned', impact: 'high' }
      ]
    },
    {
      quarter: 'Q3 2024',
      items: [
        { title: 'Multi-platform Tool Integration', status: 'backlog', impact: 'medium' },
        { title: 'Advanced Analytics', status: 'backlog', impact: 'low' },
        { title: 'Custom Workflow Builder', status: 'backlog', impact: 'medium' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Team Collaboration Hub
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            {(['collect', 'analysis', 'roadmap'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab === 'collect' && '💬 Collect Feedback'}
                {tab === 'analysis' && '📊 Analysis'}
                {tab === 'roadmap' && '🗺️ Roadmap'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'collect' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submit New Feedback */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    💡 Share Your Ideas
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newFeedback.category}
                        onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                        className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a category...</option>
                        {feedbackCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        What would make your life easier?
                      </label>
                      <textarea
                        value={newFeedback.description}
                        onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})}
                        placeholder="Describe the feature, tool, or improvement you'd like to see..."
                        className="w-full h-24 p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={newFeedback.priority}
                          onChange={(e) => setNewFeedback({...newFeedback, priority: e.target.value})}
                          className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Impact
                        </label>
                        <select
                          value={newFeedback.impact}
                          onChange={(e) => setNewFeedback({...newFeedback, impact: e.target.value})}
                          className="w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select impact...</option>
                          <option value="low">Low Impact</option>
                          <option value="medium">Medium Impact</option>
                          <option value="high">High Impact</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitFeedback}
                      disabled={!newFeedback.category || !newFeedback.description}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Submit Feedback</span>
                    </button>
                  </div>
                </div>

                {/* Quick Ideas */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    🚀 Quick Ideas
                  </h3>
                  
                  <div className="space-y-3">
                    {feedbackCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setNewFeedback({...newFeedback, category: category.id})}
                          className="w-full text-left p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-${category.color}-100 dark:bg-${category.color}-900/20 rounded-lg`}>
                              <Icon className={`h-4 w-4 text-${category.color}-600 dark:text-${category.color}-400`} />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {category.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Existing Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  📝 Community Feedback
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {existingFeedback.map((feedback) => {
                    const CategoryIcon = getCategoryIcon(feedback.category);
                    const StatusIcon = getStatusIcon(feedback.status);
                    
                    return (
                      <motion.div
                        key={feedback.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className={`h-4 w-4 text-${getCategoryColor(feedback.category)}-600`} />
                            <span className={`text-xs px-2 py-1 bg-${getStatusColor(feedback.status)}-100 text-${getStatusColor(feedback.status)}-800 rounded-full`}>
                              {feedback.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-slate-500">
                            <Star className="h-3 w-3" />
                            <span>{feedback.votes}</span>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          {feedback.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {feedback.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>by {feedback.submittedBy}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 bg-${feedback.priority === 'high' ? 'red' : feedback.priority === 'medium' ? 'yellow' : 'green'}-100 text-${feedback.priority === 'high' ? 'red' : feedback.priority === 'medium' ? 'yellow' : 'green'}-800 rounded-full`}>
                              {feedback.priority}
                            </span>
                            <StatusIcon className="h-3 w-3" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    📊 Category Breakdown
                  </h3>
                  <div className="space-y-3">
                    {feedbackCategories.slice(0, 5).map((category) => {
                      const count = existingFeedback.filter(f => f.category === category.id).length;
                      const percentage = Math.round((count / existingFeedback.length) * 100);
                      
                      return (
                        <div key={category.id} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{category.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className={`bg-${category.color}-500 h-2 rounded-full`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-900 dark:text-white">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    🎯 Priority Distribution
                  </h3>
                  <div className="space-y-3">
                    {['high', 'medium', 'low'].map((priority) => {
                      const count = existingFeedback.filter(f => f.priority === priority).length;
                      const color = priority === 'high' ? 'red' : priority === 'medium' ? 'yellow' : 'green';
                      
                      return (
                        <div key={priority} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{priority} Priority</span>
                          <span className={`px-2 py-1 bg-${color}-100 text-${color}-800 rounded-full text-sm`}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    🔄 Status Overview
                  </h3>
                  <div className="space-y-3">
                    {['completed', 'in-progress', 'planned', 'backlog'].map((status) => {
                      const count = existingFeedback.filter(f => f.status === status).length;
                      const color = getStatusColor(status);
                      
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{status.replace('-', ' ')}</span>
                          <span className={`px-2 py-1 bg-${color}-100 text-${color}-800 rounded-full text-sm`}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  🎯 Top Requested Features
                </h3>
                <div className="space-y-3">
                  {existingFeedback
                    .sort((a, b) => b.votes - a.votes)
                    .slice(0, 3)
                    .map((feedback, index) => (
                      <div key={feedback.id} className="flex items-center space-x-4 p-3 bg-white dark:bg-slate-700 rounded-lg">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                          index === 0 ? 'from-yellow-400 to-yellow-600' :
                          index === 1 ? 'from-slate-300 to-slate-500' :
                          'from-orange-400 to-orange-600'
                        } flex items-center justify-center text-white font-bold`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">{feedback.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{feedback.votes} votes</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400">+{Math.floor(Math.random() * 5) + 1}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  🗺️ Development Roadmap
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Based on team feedback and business priorities
                </p>
              </div>

              <div className="space-y-6">
                {roadmapItems.map((quarter, quarterIndex) => (
                  <div key={quarter.quarter} className="relative">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold">
                        {quarter.quarter}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                      {quarter.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: quarterIndex * 0.1 + itemIndex * 0.05 }}
                          className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {item.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full bg-${getStatusColor(item.status)}-100 text-${getStatusColor(item.status)}-800`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Impact:</span>
                            <span className={`text-sm font-medium ${
                              item.impact === 'high' ? 'text-red-600' :
                              item.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {item.impact}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamFeedbackPanel;