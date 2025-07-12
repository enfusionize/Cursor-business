'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Palette, 
  Figma, 
  Zap,
  ExternalLink,
  Play,
  Settings,
  Download,
  Upload,
  Sync,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Cloud
} from 'lucide-react';

interface DesignToolsPanelProps {
  onClose: () => void;
}

const DesignToolsPanel: React.FC<DesignToolsPanelProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'tools' | 'integrations' | 'workflow'>('tools');
  const [connectedTools, setConnectedTools] = useState<string[]>(['figma', 'sketch']);
  const [syncing, setSyncing] = useState<string | null>(null);

  const designTools = [
    {
      id: 'figma',
      name: 'Figma',
      icon: '🎨',
      description: 'Design, prototype, and collaborate',
      status: 'connected',
      features: ['Design Sync', 'Component Library', 'Prototyping', 'Collaboration'],
      mcpEndpoint: 'figma-mcp',
      actions: [
        { label: 'Open in Figma', action: 'open' },
        { label: 'Import Designs', action: 'import' },
        { label: 'Sync Components', action: 'sync' },
        { label: 'Export Assets', action: 'export' }
      ]
    },
    {
      id: 'sketch',
      name: 'Sketch',
      icon: '💎',
      description: 'Vector graphics and UI design',
      status: 'connected',
      features: ['Vector Design', 'Symbols', 'Prototyping', 'Plugins'],
      mcpEndpoint: 'sketch-mcp',
      actions: [
        { label: 'Open in Sketch', action: 'open' },
        { label: 'Import Symbols', action: 'import' },
        { label: 'Sync Libraries', action: 'sync' }
      ]
    },
    {
      id: 'adobe-creative',
      name: 'Adobe Creative Suite',
      icon: '🔴',
      description: 'Photoshop, Illustrator, After Effects',
      status: 'available',
      features: ['Photo Editing', 'Vector Art', 'Motion Graphics', 'Web Design'],
      mcpEndpoint: 'adobe-mcp',
      actions: [
        { label: 'Connect Adobe CC', action: 'connect' },
        { label: 'Import from CC', action: 'import' }
      ]
    },
    {
      id: 'blender',
      name: 'Blender',
      icon: '🟠',
      description: '3D modeling, animation, and rendering',
      status: 'available',
      features: ['3D Modeling', 'Animation', 'Rendering', 'Sculpting'],
      mcpEndpoint: 'blender-mcp',
      actions: [
        { label: 'Connect Blender', action: 'connect' },
        { label: 'Import 3D Assets', action: 'import' }
      ]
    },
    {
      id: 'canva',
      name: 'Canva',
      icon: '🎭',
      description: 'Easy graphic design and templates',
      status: 'available',
      features: ['Templates', 'Brand Kit', 'Collaboration', 'Social Media'],
      mcpEndpoint: 'canva-mcp',
      actions: [
        { label: 'Connect Canva', action: 'connect' },
        { label: 'Import Templates', action: 'import' }
      ]
    }
  ];

  const mcpIntegrations = [
    {
      id: 'midjourney-mcp',
      name: 'Midjourney MCP',
      description: 'AI image generation integration',
      status: 'active',
      endpoints: ['generate', 'upscale', 'variations'],
      usage: '1,247 requests today'
    },
    {
      id: 'stable-diffusion-mcp',
      name: 'Stable Diffusion MCP',
      description: 'Open-source AI image generation',
      status: 'active',
      endpoints: ['txt2img', 'img2img', 'inpaint'],
      usage: '856 requests today'
    },
    {
      id: 'runway-mcp',
      name: 'Runway MCP',
      description: 'AI video and motion generation',
      status: 'active',
      endpoints: ['gen-video', 'interpolate', 'remove-bg'],
      usage: '342 requests today'
    },
    {
      id: 'figma-mcp',
      name: 'Figma MCP',
      description: 'Design tool integration',
      status: 'active',
      endpoints: ['files', 'components', 'comments'],
      usage: '2,134 requests today'
    }
  ];

  const handleToolAction = async (toolId: string, action: string) => {
    setSyncing(toolId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (action === 'connect') {
      setConnectedTools(prev => [...prev, toolId]);
    }
    
    setSyncing(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'syncing':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'available':
        return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
      default:
        return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'syncing':
        return <Clock className="h-4 w-4" />;
      case 'available':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
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
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Design Tools Hub
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
            {(['tools', 'integrations', 'workflow'] as const).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  activeSection === section 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeSection === 'tools' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {designTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{tool.icon}</span>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(tool.status)}`}>
                        {getStatusIcon(tool.status)}
                        <span className="capitalize">{tool.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {tool.actions.map((action) => (
                        <button
                          key={action.action}
                          onClick={() => handleToolAction(tool.id, action.action)}
                          disabled={syncing === tool.id}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          {syncing === tool.id ? (
                            <>
                              <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                              <span>...</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3" />
                              <span>{action.label}</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mcpIntegrations.map((integration) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {integration.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {integration.description}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        <span className="capitalize">{integration.status}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Endpoints
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {integration.endpoints.map((endpoint) => (
                          <span
                            key={endpoint}
                            className="px-2 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-mono"
                          >
                            {endpoint}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {integration.usage}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <Sync className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'workflow' && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Automated Workflows
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          Asset Sync Pipeline
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Automatically sync designs from Figma → AI Enhancement → Archive
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          Team Collaboration
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Real-time notifications and asset sharing across tools
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Cloud className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          Cloud Backup
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Automatic backup of all design assets and versions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesignToolsPanel;