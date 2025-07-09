import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  Settings,
  Zap,
  Target,
  Activity
} from 'lucide-react';

// Mock cursor assistant (replace with actual @cursor-ai/client when available)
const CursorAssistant = ({ modeSwitch, tools, theme }: any) => (
  <div className="bg-gray-900 text-white p-4 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">AI Assistant</h3>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-xs rounded">Plan</button>
        <button className="px-3 py-1 bg-green-600 text-xs rounded">Exec</button>
        <button className="px-3 py-1 bg-purple-600 text-xs rounded">QA</button>
      </div>
    </div>
    <div className="bg-gray-800 p-3 rounded border text-sm">
      💡 Ask me anything: "Generate M.A.P.P.™ report for lead ID 12345" or "Show funnel analytics for last 30 days"
    </div>
    <div className="mt-3 text-xs text-gray-400">
      Connected tools: {tools?.join(', ') || 'xero, clickup, ghl, firecrawl, perplexity, mapp-ai-insights, fastapi'}
    </div>
  </div>
);

const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: '$47,250',
    clients: '12',
    projects: '8',
    roi: '247%'
  });

  const [mappMetrics, setMappMetrics] = useState({
    totalLeads: '127',
    freeReports: '89',
    premiumSales: '23',
    dashboardUsers: '12',
    conversionRate: '18.1%',
    avgDealValue: '$347',
    totalMRR: '$4,164'
  });

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agency operations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Agency Operations Dashboard</title>
        <meta name="description" content="Unified dashboard for agency operations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Agency Operations</h1>
                <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  S.A.I.A.S.™
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="h-5 w-5" />
                </button>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Monthly Revenue"
              value={metrics.revenue}
              change="+23%"
              icon={DollarSign}
              color="bg-green-500"
            />
            <MetricCard
              title="Active Clients"
              value={metrics.clients}
              change="+2"
              icon={Users}
              color="bg-blue-500"
            />
            <MetricCard
              title="Active Projects"
              value={metrics.projects}
              change="+3"
              icon={Target}
              color="bg-purple-500"
            />
            <MetricCard
              title="Average ROI"
              value={metrics.roi}
              change="+47%"
              icon={TrendingUp}
              color="bg-orange-500"
            />
          </div>

          {/* M.A.P.P.™ Launch Funnel Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">M.A.P.P.™ Launch Funnel</h2>
                  <p className="text-purple-100">Marketing Automation Process & Plan - Revenue Engine</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{mappMetrics.totalMRR}</div>
                  <div className="text-purple-200 text-sm">Monthly Recurring Revenue</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-xl font-bold text-gray-900">{mappMetrics.totalLeads}</p>
                    <p className="text-sm text-green-600">+12 today</p>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Free Reports</p>
                    <p className="text-xl font-bold text-gray-900">{mappMetrics.freeReports}</p>
                    <p className="text-sm text-blue-600">70% conversion</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-100">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Premium Sales</p>
                    <p className="text-xl font-bold text-gray-900">{mappMetrics.premiumSales}</p>
                    <p className="text-sm text-purple-600">{mappMetrics.conversionRate} rate</p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-100">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dashboard Users</p>
                    <p className="text-xl font-bold text-gray-900">{mappMetrics.dashboardUsers}</p>
                    <p className="text-sm text-orange-600">{mappMetrics.avgDealValue} AVG</p>
                  </div>
                  <div className="p-2 rounded-full bg-orange-100">
                    <Target className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">M.A.P.P.™ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Report
                  </button>
                  <button className="flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Funnel Analytics
                  </button>
                  <button className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    Lead Scoring
                  </button>
                  <button className="flex items-center justify-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI Insights
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent M.A.P.P.™ Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-green-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Premium report purchased</p>
                      <p className="text-xs text-gray-600">TechCorp Industries • $297</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New dashboard user activated</p>
                      <p className="text-xs text-gray-600">StartupXYZ • Standard plan</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 bg-purple-50 rounded-lg">
                    <div className="h-2 w-2 bg-purple-400 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">AI insight report generated</p>
                      <p className="text-xs text-gray-600">RetailCo • Free snapshot</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Assistant */}
              <CursorAssistant 
                modeSwitch={true}
                tools={["xero", "clickup", "ghl", "firecrawl", "perplexity"]}
                theme="dark"
              />

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                    <Zap className="h-5 w-5 mr-2" />
                    M.A.P.P.™ Report
                  </button>
                  <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Generate Invoice
                  </button>
                  <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    <Users className="h-5 w-5 mr-2" />
                    New Project
                  </button>
                  <button className="flex items-center justify-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Funnel Analytics
                  </button>
                  <button className="flex items-center justify-center p-4 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Client Update
                  </button>
                  <button className="flex items-center justify-center p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Call
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Payment received from ACME Corp</p>
                      <p className="text-xs text-gray-600">2 hours ago • $10,000</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New task created: Landing page design</p>
                      <p className="text-xs text-gray-600">4 hours ago • Assigned to Design Team</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <div className="h-2 w-2 bg-purple-400 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Campaign optimization completed</p>
                      <p className="text-xs text-gray-600">6 hours ago • +15% CTR improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* System Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Xero</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ClickUp</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">GoHighLevel</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">n8n Workflows</span>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600">5 Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* This Week */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Client Strategy Call</p>
                      <p className="text-xs text-gray-600">Tomorrow 2:00 PM</p>
                    </div>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Campaign Launch</p>
                      <p className="text-xs text-gray-600">Friday 10:00 AM</p>
                    </div>
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Monthly Review</p>
                      <p className="text-xs text-gray-600">Next Monday</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}