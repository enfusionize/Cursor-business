import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  Leaf,
  Users,
  Globe,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Award,
  Filter,
  Search,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const Exchange = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    riskLevel: '',
    impactFocus: '',
    minInvestment: '',
    maxInvestment: ''
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    fetchExchangeData();
  }, [filters]);

  const fetchExchangeData = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/exchange/opportunities?${queryParams}`);
      const data = await response.json();
      
      setOpportunities(data.opportunities);
      setMetrics(data.metrics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exchange data:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getKPIHealthColor = (health) => {
    switch (health) {
      case 'Green': return 'text-green-400 bg-green-400/20';
      case 'Yellow': return 'text-yellow-400 bg-yellow-400/20';
      case 'Red': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'High': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getESGColor = (score) => {
    if (score.includes('A+')) return 'text-emerald-400';
    if (score.includes('A')) return 'text-green-400';
    if (score.includes('B')) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Exchange opportunities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Enfusionize™ Exchange</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white/90 text-sm">
                Verified Opportunities: <span className="font-bold text-purple-400">{opportunities.length}</span>
              </div>
              <div className="text-white/90 text-sm">
                Avg IRR: <span className="font-bold text-green-400">{metrics?.averageIRR.toFixed(1)}%</span>
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
              AI-Verified Investment Opportunities
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Access data-driven, conscious businesses optimized by Master M.A.P.P.™ with real-time KPI tracking
            </p>
          </motion.div>
        </div>

        {/* Exchange Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-400 mr-2" />
              <h3 className="text-white font-semibold">Total Deal Volume</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(metrics?.totalDealVolume || 0)}
            </div>
            <div className="text-white/60 text-sm">
              {metrics?.totalOpportunities} active deals
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-white font-semibold">Avg M.A.P.P.™ Score</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics?.averageMAPPScore.toFixed(1)}/100
            </div>
            <div className="text-white/60 text-sm">
              Growth-readiness verified
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
              <h3 className="text-white font-semibold">Carbon Impact</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics?.impactSummary.totalCarbonReduction.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">
              Tons CO₂ reduced annually
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-white font-semibold">Social Impact</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {(metrics?.impactSummary.totalJobsCreated + metrics?.impactSummary.totalPeopleImpacted).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">
              Lives positively impacted
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-white/70 mr-2" />
            <h3 className="text-white font-semibold">Filter Opportunities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Sectors</option>
              <option value="cleantech">CleanTech</option>
              <option value="edtech">EdTech</option>
              <option value="healthtech">HealthTech</option>
              <option value="agtech">AgTech</option>
              <option value="manufacturing">Manufacturing</option>
            </select>

            <select
              value={filters.riskLevel}
              onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <select
              value={filters.impactFocus}
              onChange={(e) => handleFilterChange('impactFocus', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Impact Levels</option>
              <option value="high">High Impact (A+ ESG)</option>
              <option value="medium">Medium Impact (A ESG)</option>
            </select>

            <input
              type="number"
              placeholder="Min Investment"
              value={filters.minInvestment}
              onChange={(e) => handleFilterChange('minInvestment', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="number"
              placeholder="Max Investment"
              value={filters.maxInvestment}
              onChange={(e) => handleFilterChange('maxInvestment', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </motion.div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
              onClick={() => setSelectedOpportunity(opportunity)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{opportunity.companyName}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400 text-sm">{opportunity.sector}</span>
                    <span className="text-white/50">•</span>
                    <span className="text-white/70 text-sm">{opportunity.stage}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getRiskColor(opportunity.riskLevel)}`}>
                    {opportunity.riskLevel} Risk
                  </span>
                  <span className={`text-sm font-medium ${getESGColor(opportunity.impactMetrics.esgScore)}`}>
                    {opportunity.impactMetrics.esgScore}
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-white/70 text-sm">Revenue (ARR)</div>
                  <div className="text-white font-semibold">{opportunity.revenue}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Growth Rate</div>
                  <div className="text-green-400 font-semibold">+{opportunity.growthRate}%</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">M.A.P.P.™ Score</div>
                  <div className="text-purple-400 font-semibold">{opportunity.mappScore}/100</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Projected IRR</div>
                  <div className="text-green-400 font-semibold">{opportunity.irr}%</div>
                </div>
              </div>

              {/* Investment Details */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Investment Type</span>
                  <span className="text-white font-medium">{opportunity.investmentType}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Deal Size</span>
                  <span className="text-white font-medium">{opportunity.dealSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Min Investment</span>
                  <span className="text-white font-medium">{formatCurrency(opportunity.minInvestment)}</span>
                </div>
              </div>

              {/* Impact Highlights */}
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Impact Highlights</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {opportunity.impactMetrics.carbonReduction && (
                    <div className="flex items-center text-green-400">
                      <Leaf className="h-3 w-3 mr-1" />
                      {opportunity.impactMetrics.carbonReduction} tons CO₂ saved
                    </div>
                  )}
                  {opportunity.impactMetrics.jobsCreated && (
                    <div className="flex items-center text-blue-400">
                      <Users className="h-3 w-3 mr-1" />
                      {opportunity.impactMetrics.jobsCreated} jobs created
                    </div>
                  )}
                  {opportunity.impactMetrics.studentsEducated && (
                    <div className="flex items-center text-yellow-400">
                      <Award className="h-3 w-3 mr-1" />
                      {opportunity.impactMetrics.studentsEducated.toLocaleString()} students educated
                    </div>
                  )}
                  {opportunity.impactMetrics.patientsServed && (
                    <div className="flex items-center text-red-400">
                      <Star className="h-3 w-3 mr-1" />
                      {opportunity.impactMetrics.patientsServed.toLocaleString()} patients served
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getKPIHealthColor(opportunity.dataVerification.kpiHealth).includes('green') ? 'bg-green-400' : getKPIHealthColor(opportunity.dataVerification.kpiHealth).includes('yellow') ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  <span className="text-white/60 text-xs">
                    KPI Health: {opportunity.dataVerification.kpiHealth}
                  </span>
                </div>
                <div className="flex items-center text-white/60 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {new Date(opportunity.dueDate).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Join the Exchange?
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Access exclusive, AI-verified investment opportunities with real-time data tracking and automated covenant protection.
            </p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Request Exchange Access
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Exchange;