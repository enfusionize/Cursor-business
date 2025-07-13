import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Leaf,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  return: number;
  riskLevel: string;
  category: string;
  lastUpdated: Date;
  isConscious: boolean;
}

const Investments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterConscious, setFilterConscious] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, []);

  useEffect(() => {
    filterInvestments();
  }, [investments, searchTerm, filterRisk, filterConscious]);

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments');
      const data = await response.json();
      setInvestments(data.investments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setLoading(false);
    }
  };

  const filterInvestments = () => {
    let filtered = investments;

    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRisk) {
      filtered = filtered.filter(inv => inv.riskLevel === filterRisk);
    }

    if (filterConscious) {
      filtered = filtered.filter(inv => 
        filterConscious === 'conscious' ? inv.isConscious : !inv.isConscious
      );
    }

    setFilteredInvestments(filtered);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'High': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getReturnColor = (returnValue: number) => {
    return returnValue >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatCurrency = (amount: number) => {
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
        <div className="text-white text-xl">Loading your investments...</div>
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
              <Leaf className="h-8 w-8 text-green-400 mr-3" />
              <h1 className="text-xl font-bold text-white">My Investments</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Investment</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-white/50" />
              <input
                type="text"
                placeholder="Search investments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
            <select
              value={filterConscious}
              onChange={(e) => setFilterConscious(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Investments</option>
              <option value="conscious">Conscious Only</option>
              <option value="traditional">Traditional Only</option>
            </select>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-white/70" />
              <span className="text-white/70 text-sm">
                {filteredInvestments.length} of {investments.length} investments
              </span>
            </div>
          </div>
        </div>

        {/* Investment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((investment, index) => (
            <motion.div
              key={investment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{investment.name}</h3>
                  <p className="text-white/70 text-sm">{investment.type}</p>
                  <p className="text-white/50 text-xs">{investment.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {investment.isConscious && (
                    <Leaf className="h-4 w-4 text-green-400" title="Conscious Investment" />
                  )}
                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-white/10 rounded">
                      <Edit className="h-4 w-4 text-white/70" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Investment Amount</span>
                  <span className="text-white font-medium">{formatCurrency(investment.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Current Value</span>
                  <span className="text-white font-medium">{formatCurrency(investment.currentValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Return</span>
                  <div className="flex items-center space-x-2">
                    {investment.return >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`font-medium ${getReturnColor(investment.return)}`}>
                      {investment.return >= 0 ? '+' : ''}{investment.return.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Risk Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(investment.riskLevel)}`}>
                    {investment.riskLevel}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center text-xs text-white/50">
                  <span>Last Updated</span>
                  <span>{new Date(investment.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInvestments.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No investments found</h3>
            <p className="text-white/70 mb-4">
              {searchTerm || filterRisk || filterConscious
                ? "Try adjusting your filters to see more investments."
                : "Start building your conscious investment portfolio today."}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Investment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Investments;