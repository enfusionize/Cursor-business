import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  TrendingUp,
  Users,
  Leaf,
  Heart,
  Star,
  Award,
  Target,
  BarChart3,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const WealthprintTracker = () => {
  const [wealthprintData, setWealthprintData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWealthprintData();
  }, []);

  const fetchWealthprintData = async () => {
    try {
      // Mock data for demonstration
      const data = {
        overview: {
          totalWealthprintScore: 847,
          scoreChange: 23,
          rank: 'Elite Conscious Investor',
          percentile: 92,
          nextMilestone: 'Philanthropic Leader',
          progressToNext: 73
        },
        impact: {
          environmental: {
            carbonReduction: 15.7,
            renewableEnergyFunded: 342,
            treesPlanted: 2847,
            sustainableProjectsFunded: 43
          },
          social: {
            jobsCreated: 1247,
            peopleEducated: 5890,
            communitiesServed: 67,
            socialProjectsFunded: 28
          },
          governance: {
            transparencyScore: 94,
            ethicsRating: 'A+',
            complianceScore: 98,
            stakeholderSatisfaction: 91
          }
        },
        financial: {
          totalNetWorth: 3450000,
          consciousAllocation: 74.3,
          impactROI: 15.8,
          philanthropicGiving: 8.2,
          monthlyGrowth: 3.4
        },
        influence: {
          networkValue: 2.3,
          mentorshipReach: 147,
          thoughtLeadership: 86,
          industryRecognition: 23
        },
        timeline: [
          { month: 'Jan', wealthprint: 720, impact: 45, influence: 32 },
          { month: 'Feb', wealthprint: 735, impact: 48, influence: 35 },
          { month: 'Mar', wealthprint: 752, impact: 52, influence: 38 },
          { month: 'Apr', wealthprint: 768, impact: 55, influence: 42 },
          { month: 'May', wealthprint: 785, impact: 58, influence: 45 },
          { month: 'Jun', wealthprint: 802, impact: 62, influence: 48 },
          { month: 'Jul', wealthprint: 820, impact: 65, influence: 52 },
          { month: 'Aug', wealthprint: 847, impact: 68, influence: 55 }
        ],
        goals: [
          {
            id: 1,
            title: 'Carbon Neutral Portfolio',
            target: 'Achieve net-zero carbon footprint',
            progress: 87,
            deadline: '2024-12-31',
            status: 'On Track'
          },
          {
            id: 2,
            title: 'Impact Investment Target',
            target: 'Reach 80% conscious allocation',
            progress: 93,
            deadline: '2024-11-30',
            status: 'Ahead of Schedule'
          },
          {
            id: 3,
            title: 'Philanthropic Milestone',
            target: 'Donate $500K annually',
            progress: 64,
            deadline: '2024-12-31',
            status: 'On Track'
          },
          {
            id: 4,
            title: 'Mentorship Program',
            target: 'Mentor 200 aspiring investors',
            progress: 74,
            deadline: '2025-06-30',
            status: 'On Track'
          }
        ],
        achievements: [
          {
            id: 1,
            title: 'Conscious Investor Elite',
            description: 'Achieved 70%+ ESG allocation',
            date: '2024-08-15',
            icon: '🌱',
            rarity: 'Rare'
          },
          {
            id: 2,
            title: 'Impact Champion',
            description: 'Created 1000+ jobs through investments',
            date: '2024-07-22',
            icon: '👥',
            rarity: 'Epic'
          },
          {
            id: 3,
            title: 'Climate Hero',
            description: 'Reduced carbon footprint by 15+ tons',
            date: '2024-06-10',
            icon: '🌍',
            rarity: 'Legendary'
          },
          {
            id: 4,
            title: 'Thought Leader',
            description: 'Recognized as industry thought leader',
            date: '2024-05-03',
            icon: '🧠',
            rarity: 'Epic'
          }
        ]
      };
      
      setWealthprintData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wealthprint data:', error);
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'text-green-400';
      case 'Ahead of Schedule': return 'text-blue-400';
      case 'Behind Schedule': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your Wealthprint™ tracker...</div>
      </div>
    );
  }

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Wealthprint™ Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white/90 text-sm">
                Score: <span className="font-bold text-green-400">{wealthprintData?.overview.totalWealthprintScore}</span>
              </div>
              <div className="text-white/90 text-sm">
                Rank: <span className="font-bold text-purple-400">{wealthprintData?.overview.rank}</span>
              </div>
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
              Your Wealthprint™
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Track your wealth impact, influence, and conscious investing journey
            </p>
          </motion.div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <h3 className="text-white font-semibold">Wealthprint Score</h3>
              </div>
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+{wealthprintData?.overview.scoreChange}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {wealthprintData?.overview.totalWealthprintScore}
            </div>
            <div className="text-white/60 text-sm">
              {wealthprintData?.overview.percentile}th percentile
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <DollarSign className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-white font-semibold">Net Worth</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${(wealthprintData?.financial.totalNetWorth / 1000000).toFixed(1)}M
            </div>
            <div className="text-white/60 text-sm">
              +{wealthprintData?.financial.monthlyGrowth}% this month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Leaf className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-white font-semibold">Conscious Allocation</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {wealthprintData?.financial.consciousAllocation}%
            </div>
            <div className="text-white/60 text-sm">
              Target: 80%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-red-400 mr-2" />
              <h3 className="text-white font-semibold">Impact ROI</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {wealthprintData?.financial.impactROI}%
            </div>
            <div className="text-white/60 text-sm">
              Annual return with impact
            </div>
          </motion.div>
        </div>

        {/* Wealthprint Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Wealthprint Evolution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wealthprintData?.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px' 
                }}
              />
              <Line type="monotone" dataKey="wealthprint" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="impact" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="influence" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Environmental Impact</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Carbon Reduction</span>
                <span className="text-white font-medium">{wealthprintData?.impact.environmental.carbonReduction} tons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Renewable Energy</span>
                <span className="text-white font-medium">{wealthprintData?.impact.environmental.renewableEnergyFunded} MWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Trees Planted</span>
                <span className="text-white font-medium">{wealthprintData?.impact.environmental.treesPlanted.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Social Impact</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Jobs Created</span>
                <span className="text-white font-medium">{wealthprintData?.impact.social.jobsCreated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">People Educated</span>
                <span className="text-white font-medium">{wealthprintData?.impact.social.peopleEducated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Communities Served</span>
                <span className="text-white font-medium">{wealthprintData?.impact.social.communitiesServed}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Governance Score</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Transparency</span>
                <span className="text-white font-medium">{wealthprintData?.impact.governance.transparencyScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Ethics Rating</span>
                <span className="text-white font-medium">{wealthprintData?.impact.governance.ethicsRating}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Compliance</span>
                <span className="text-white font-medium">{wealthprintData?.impact.governance.complianceScore}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goals and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Active Goals</h3>
            <div className="space-y-4">
              {wealthprintData?.goals.map((goal, index) => (
                <div key={goal.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{goal.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{goal.target}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-white/10 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-white/60 text-sm">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {wealthprintData?.achievements.map((achievement, index) => (
                <div key={achievement.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{achievement.description}</p>
                      <div className="flex items-center text-white/60 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WealthprintTracker;