'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Figma, 
  Download, 
  Upload, 
  RefreshCw,
  Eye,
  Users,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Link,
  FileText,
  Image,
  Layers,
  Code,
  Palette,
  Zap,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

interface FigmaIntegrationProps {
  onClose: () => void;
}

const FigmaIntegration: React.FC<FigmaIntegrationProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'connect' | 'import' | 'export' | 'sync'>('connect');
  const [isConnected, setIsConnected] = useState(false);
  const [figmaFiles, setFigmaFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'complete'>('idle');

  const mockFigmaFiles = [
    {
      id: 'file-1',
      name: 'Mobile App Design System',
      thumbnail: 'https://via.placeholder.com/300x200',
      lastModified: '2024-01-15T10:30:00Z',
      collaborators: ['Sarah Chen', 'Alex Rodriguez', 'Mike Johnson'],
      components: 45,
      frames: 12,
      status: 'active',
      type: 'design-system'
    },
    {
      id: 'file-2',
      name: 'Website Redesign - Homepage',
      thumbnail: 'https://via.placeholder.com/300x200',
      lastModified: '2024-01-14T15:45:00Z',
      collaborators: ['Emma Davis', 'David Kim'],
      components: 23,
      frames: 8,
      status: 'in-review',
      type: 'website'
    },
    {
      id: 'file-3',
      name: 'Brand Guidelines 2024',
      thumbnail: 'https://via.placeholder.com/300x200',
      lastModified: '2024-01-13T09:15:00Z',
      collaborators: ['Sarah Chen'],
      components: 67,
      frames: 15,
      status: 'completed',
      type: 'branding'
    },
    {
      id: 'file-4',
      name: 'Dashboard UI Components',
      thumbnail: 'https://via.placeholder.com/300x200',
      lastModified: '2024-01-12T14:20:00Z',
      collaborators: ['Alex Rodriguez', 'Mike Johnson', 'Emma Davis'],
      components: 89,
      frames: 20,
      status: 'active',
      type: 'component-library'
    }
  ];

  const integrationFeatures = [
    {
      id: 'one-click-import',
      name: 'One-Click Import',
      description: 'Import entire Figma files with components, styles, and assets',
      icon: Download,
      status: 'available',
      usage: '1,247 imports this month'
    },
    {
      id: 'seamless-export',
      name: 'Seamless Export',
      description: 'Export designs back to Figma with changes preserved',
      icon: Upload,
      status: 'available',
      usage: '856 exports this month'
    },
    {
      id: 'real-time-sync',
      name: 'Real-time Sync',
      description: 'Bidirectional sync keeps designs up-to-date automatically',
      icon: RotateCcw,
      status: 'beta',
      usage: '342 syncs active'
    },
    {
      id: 'component-mapping',
      name: 'Component Mapping',
      description: 'Intelligent mapping between Figma and code components',
      icon: Code,
      status: 'coming-soon',
      usage: 'Q2 2024 release'
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Connect Figma',
      description: 'Authenticate with your Figma account',
      icon: Link,
      completed: isConnected
    },
    {
      step: 2,
      title: 'Select Files',
      description: 'Choose designs to import or sync',
      icon: FileText,
      completed: selectedFiles.length > 0
    },
    {
      step: 3,
      title: 'Import Assets',
      description: 'One-click import with full fidelity',
      icon: Download,
      completed: false
    },
    {
      step: 4,
      title: 'AI Enhancement',
      description: 'Optional AI-powered improvements',
      icon: Zap,
      completed: false
    },
    {
      step: 5,
      title: 'Archive & Share',
      description: 'Store in asset library and share with team',
      icon: Share2,
      completed: false
    }
  ];

  useEffect(() => {
    if (isConnected) {
      setFigmaFiles(mockFigmaFiles);
    }
  }, [isConnected]);

  const handleConnect = async () => {
    // Simulate Figma OAuth flow
    const connectingSteps = [
      'Opening Figma authentication...',
      'Verifying credentials...',
      'Fetching user data...',
      'Loading file list...',
      'Connection established!'
    ];

    for (const step of connectingSteps) {
      console.log(step);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsConnected(true);
  };

  const handleImport = async () => {
    if (selectedFiles.length === 0) return;
    
    setImporting(true);
    
    const importSteps = [
      'Analyzing selected files...',
      'Extracting components and assets...',
      'Converting to universal format...',
      'Applying AI enhancements...',
      'Saving to asset library...',
      'Import complete!'
    ];

    for (const step of importSteps) {
      console.log(step);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setImporting(false);
    setSelectedFiles([]);
  };

  const handleExport = async () => {
    setExporting(true);
    
    const exportSteps = [
      'Preparing assets for export...',
      'Converting to Figma format...',
      'Uploading to Figma...',
      'Updating file metadata...',
      'Export complete!'
    ];

    for (const step of exportSteps) {
      console.log(step);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setExporting(false);
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setSyncStatus('complete');
    setTimeout(() => setSyncStatus('idle'), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'in-review': return 'yellow';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'design-system': return Layers;
      case 'website': return FileText;
      case 'branding': return Palette;
      case 'component-library': return Code;
      default: return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Figma className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Figma Integration
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  One-click import/export with seamless collaboration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isConnected && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            {(['connect', 'import', 'export', 'sync'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab === 'connect' && '🔗 Connect'}
                {tab === 'import' && '📥 Import'}
                {tab === 'export' && '📤 Export'}
                {tab === 'sync' && '🔄 Sync'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'connect' && (
            <div className="space-y-6">
              {!isConnected ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-24 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                    <Figma className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Connect to Figma
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Connect your Figma account to enable seamless import/export and real-time collaboration features.
                  </p>
                  <button
                    onClick={handleConnect}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2 mx-auto"
                  >
                    <Link className="h-5 w-5" />
                    <span>Connect Figma Account</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                        Successfully Connected!
                      </h3>
                    </div>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      Your Figma account is now connected. You can import files, export designs, and enable real-time sync.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {figmaFiles.length}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Files Found</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {figmaFiles.reduce((sum, file) => sum + file.components, 0)}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Components</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {figmaFiles.reduce((sum, file) => sum + file.frames, 0)}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Frames</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {new Set(figmaFiles.flatMap(file => file.collaborators)).size}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Collaborators</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      🚀 Available Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {integrationFeatures.map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <div
                            key={feature.id}
                            className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  {feature.name}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                feature.status === 'available' ? 'bg-green-100 text-green-800' :
                                feature.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {feature.status}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {feature.usage}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              {!isConnected ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Please connect your Figma account first to import files.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      📥 Import from Figma
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedFiles.length} selected
                      </span>
                      <button
                        onClick={handleImport}
                        disabled={selectedFiles.length === 0 || importing}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {importing ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>Importing...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Import Selected</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {figmaFiles.map((file) => {
                      const TypeIcon = getTypeIcon(file.type);
                      const isSelected = selectedFiles.includes(file.id);
                      
                      return (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedFiles(prev => prev.filter(id => id !== file.id));
                            } else {
                              setSelectedFiles(prev => [...prev, file.id]);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <TypeIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  {file.name}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {formatDate(file.lastModified)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full bg-${getStatusColor(file.status)}-100 text-${getStatusColor(file.status)}-800`}>
                                {file.status}
                              </span>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-purple-600" />
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {file.components}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Components</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {file.frames}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Frames</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-3 w-3 text-slate-400" />
                            <div className="flex -space-x-1">
                              {file.collaborators.slice(0, 3).map((collaborator, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-slate-800"
                                  title={collaborator}
                                >
                                  {collaborator.charAt(0)}
                                </div>
                              ))}
                              {file.collaborators.length > 3 && (
                                <div className="w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-medium border-2 border-white dark:border-slate-800">
                                  +{file.collaborators.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="mx-auto h-24 w-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                  <Upload className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Export to Figma
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Export your enhanced designs back to Figma with all changes and improvements preserved.
                </p>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Export to Figma</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  🔄 Workflow Steps
                </h3>
                <div className="space-y-4">
                  {workflowSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.step}
                        className={`flex items-center space-x-4 p-3 rounded-lg ${
                          step.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{step.step}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            step.completed ? 'text-green-900 dark:text-green-100' : 'text-slate-900 dark:text-white'
                          }`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm ${
                            step.completed ? 'text-green-700 dark:text-green-300' : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                        <Icon className={`h-5 w-5 ${
                          step.completed ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  🔄 Real-time Sync
                </h3>
                <button
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                                            <RotateCcw className="h-4 w-4" />
                      <span>Sync Now</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    📊 Sync Status
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Figma → Hub</span>
                      <span className="text-sm text-green-600 dark:text-green-400">✓ Up to date</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Hub → Figma</span>
                      <span className="text-sm text-green-600 dark:text-green-400">✓ Up to date</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Last Sync</span>
                      <span className="text-sm text-slate-900 dark:text-white">2 min ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    📈 Activity
                  </h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">127</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Syncs today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">3</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Active sessions</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    ⚙️ Settings
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Auto-sync</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Notifications</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Conflict resolution</span>
                    </label>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {syncStatus === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                          Sync Complete!
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          All files are now synchronized between Figma and Design AI Hub.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FigmaIntegration;