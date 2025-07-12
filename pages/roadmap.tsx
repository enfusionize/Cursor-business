import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Zap,
  Crown,
  CheckCircle,
  Clock,
  Users,
  Leaf,
  DollarSign,
  BarChart3,
  Globe,
  Heart,
  ArrowRight,
  Star,
  Award,
  Lightbulb
} from 'lucide-react';

const WealthRoadmap = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [activeStage, setActiveStage] = useState('preparation');
  const [loading, setLoading] = useState(true);
  const [completedMilestones, setCompletedMilestones] = useState(new Set());

  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    try {
      const response = await fetch('/api/wealth/roadmap');
      const data = await response.json();
      setRoadmapData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roadmap data:', error);
      setLoading(false);
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'preparation': return <Target className="h-6 w-6" />;
      case 'acceleration': return <TrendingUp className="h-6 w-6" />;
      case 'catalyzing': return <Zap className="h-6 w-6" />;
      case 'scaling': return <Crown className="h-6 w-6" />;
      default: return <Target className="h-6 w-6" />;
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'preparation': return 'from-blue-400 to-cyan-400';
      case 'acceleration': return 'from-green-400 to-emerald-400';
      case 'catalyzing': return 'from-purple-400 to-pink-400';
      case 'scaling': return 'from-yellow-400 to-orange-400';
      default: return 'from-blue-400 to-cyan-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const toggleMilestone = (milestoneId) => {
    const newCompleted = new Set(completedMilestones);
    if (newCompleted.has(milestoneId)) {
      newCompleted.delete(milestoneId);
    } else {
      newCompleted.add(milestoneId);
    }
    setCompletedMilestones(newCompleted);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your wealth roadmap...</div>
      </div>
    );
  }

  const stages = Object.entries(roadmapData?.stages || {});
  const activeStageData = roadmapData?.stages[activeStage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Wealth Roadmap</h1>
            </div>
            <div className="text-white/90 text-sm">
              Your journey to conscious wealth mastery
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Wealth Journey
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From preparation to scaling your Wealthprint™ - a comprehensive roadmap for conscious wealth building
            </p>
          </motion.div>
        </div>

        {/* Stage Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {stages.map(([stageKey, stageData], index) => (
            <motion.button
              key={stageKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveStage(stageKey)}
              className={`p-6 rounded-xl border transition-all ${
                activeStage === stageKey
                  ? 'bg-white/20 border-white/30 scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getStageColor(stageKey)}`}>
                  {getStageIcon(stageKey)}
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{stageData.title}</h3>
              <p className="text-white/60 text-xs">{stageData.netWorthRange}</p>
            </motion.button>
          ))}
        </div>

        {/* Active Stage Details */}
        {activeStageData && (
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8"
          >
            <div className="flex items-center mb-6">
              <div className={`p-4 rounded-lg bg-gradient-to-r ${getStageColor(activeStage)} mr-4`}>
                {getStageIcon(activeStage)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{activeStageData.title}</h2>
                <p className="text-white/70 mb-2">{activeStageData.description}</p>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span>Net Worth: {activeStageData.netWorthRange}</span>
                  <span>•</span>
                  <span>Timeframe: {activeStageData.timeframe}</span>
                </div>
              </div>
            </div>

            {/* Key Focus Areas */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Key Focus Areas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activeStageData.keyFocus.map((focus, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 text-center">
                    <span className="text-white/80 text-sm">{focus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
              <div className="space-y-4">
                {activeStageData.milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white/5 rounded-lg p-6 border-l-4 transition-all ${
                      completedMilestones.has(milestone.id)
                        ? 'border-green-400 bg-green-500/10'
                        : 'border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleMilestone(milestone.id)}
                          className={`mr-3 p-1 rounded-full transition-colors ${
                            completedMilestones.has(milestone.id)
                              ? 'text-green-400'
                              : 'text-white/50 hover:text-white'
                          }`}
                        >
                          <CheckCircle className="h-6 w-6" />
                        </button>
                        <div>
                          <h4 className="text-white font-semibold">{milestone.title}</h4>
                          <p className="text-white/70 text-sm">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(milestone.priority)}`}>
                          {milestone.priority}
                        </span>
                        <div className="flex items-center text-white/60 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {milestone.timeline}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-white/80 text-sm mb-2">
                        <strong>Target:</strong> {milestone.target}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-white/80 text-sm font-medium mb-2">Action Items:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {milestone.actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-center text-white/60 text-xs">
                            <ArrowRight className="h-3 w-3 mr-2 text-green-400" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Wealthprint Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <DollarSign className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Financial Metrics</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(roadmapData?.wealthprintMetrics.financial || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-white/70 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white/60 text-xs">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Impact Metrics</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(roadmapData?.wealthprintMetrics.impact || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-white/70 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white/60 text-xs">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Star className="h-6 w-6 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Influence Metrics</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(roadmapData?.wealthprintMetrics.influence || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-white/70 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-white/60 text-xs">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Catalyzing Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20"
        >
          <div className="flex items-center mb-6">
            <Lightbulb className="h-6 w-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Catalyzing Strategies</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmapData?.catalyzingStrategies.map((category, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-3">{category.category}</h4>
                <div className="space-y-2">
                  {category.strategies.map((strategy, strategyIndex) => (
                    <div key={strategyIndex} className="flex items-center text-white/70 text-sm">
                      <ArrowRight className="h-3 w-3 mr-2 text-green-400" />
                      {strategy}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WealthRoadmap;