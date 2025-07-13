import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Leaf, 
  Target, 
  AlertCircle,
  User,
  Settings,
  Bell,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, investmentsRes] = await Promise.all([
        fetch('/api/portfolio/analytics'),
        fetch('/api/investments')
      ]);
      
      const analyticsData = await analyticsRes.json();
      const investmentsData = await investmentsRes.json();
      
      setAnalytics(analyticsData);
      setInvestments(investmentsData.investments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your investment dashboard...</div>
      </div>
    );
  }

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Conscious Wealth</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-white/70 hover:text-white cursor-pointer" />
              <Settings className="h-6 w-6 text-white/70 hover:text-white cursor-pointer" />
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-white/70" />
                <span className="text-white/90">Alex Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">
                  ${analytics?.portfolioMetrics.totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">
                +{analytics?.portfolioMetrics.returnPercentage.toFixed(2)}%
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Returns</p>
                <p className="text-2xl font-bold text-white">
                  ${analytics?.portfolioMetrics.totalReturn.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">
                +{analytics?.portfolioMetrics.returnPercentage.toFixed(2)}%
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Conscious Investing</p>
                <p className="text-2xl font-bold text-white">
                  {analytics?.portfolioMetrics.consciousInvestmentPercentage.toFixed(1)}%
                </p>
              </div>
              <Leaf className="h-8 w-8 text-green-400" />
            </div>
            <div className="flex items-center mt-2">
              <Target className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">Target: 75%</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Risk Score</p>
                <p className="text-2xl font-bold text-white">
                  {analytics?.portfolioMetrics.riskScore}/10
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400 text-sm">Medium Risk</span>
            </div>
          </motion.div>
        </div>

        {/* Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.performanceHistory}>
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
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="rgba(59, 130, 246, 0.3)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="conscious" 
                  stroke="#10B981" 
                  fill="rgba(16, 185, 129, 0.3)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={analytics?.assetAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {analytics?.assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Your Conscious Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {analytics?.consciousImpact.carbonFootprintReduction}
              </div>
              <div className="text-white/70 text-sm">Tons CO₂ Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {analytics?.consciousImpact.jobsCreated}
              </div>
              <div className="text-white/70 text-sm">Jobs Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {analytics?.consciousImpact.sustainableProjectsFunded}
              </div>
              <div className="text-white/70 text-sm">Projects Funded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {analytics?.consciousImpact.renewableEnergyGenerated}
              </div>
              <div className="text-white/70 text-sm">MWh Clean Energy</div>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Investment Recommendations</h3>
          <div className="space-y-4">
            {analytics?.recommendations.map((rec, index) => (
              <div key={rec.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{rec.title}</h4>
                    <p className="text-white/70 text-sm mt-1">{rec.description}</p>
                    <p className="text-white/60 text-xs mt-2">{rec.suggestedAction}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rec.priority === 'high' 
                      ? 'bg-red-500/20 text-red-300' 
                      : rec.priority === 'medium' 
                      ? 'bg-yellow-500/20 text-yellow-300' 
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;