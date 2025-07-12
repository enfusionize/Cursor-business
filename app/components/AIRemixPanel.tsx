'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Palette, 
  Zap,
  RefreshCw,
  Download,
  Share2,
  Settings,
  Eye,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';

interface AIRemixPanelProps {
  onClose: () => void;
}

const AIRemixPanel: React.FC<AIRemixPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'remix' | 'enhance'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState('midjourney');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [quality, setQuality] = useState('high');

  const aiTools = [
    {
      id: 'midjourney',
      name: 'Midjourney',
      icon: '🎨',
      description: 'High-quality artistic image generation',
      capabilities: ['Images', 'Artistic', 'Photorealistic']
    },
    {
      id: 'stable-diffusion',
      name: 'Stable Diffusion',
      icon: '🖼️',
      description: 'Open-source image generation',
      capabilities: ['Images', 'Fast', 'Customizable']
    },
    {
      id: 'runway',
      name: 'Runway ML',
      icon: '🎬',
      description: 'Video and motion generation',
      capabilities: ['Videos', 'Motion', 'AI Editing']
    },
    {
      id: 'figma-ai',
      name: 'Figma AI',
      icon: '🎯',
      description: 'Design system generation',
      capabilities: ['UI/UX', 'Components', 'Wireframes']
    },
    {
      id: 'orchids-ai',
      name: 'Orchids AI',
      icon: '🌸',
      description: 'Creative design assistant',
      capabilities: ['Concepts', 'Branding', 'Layouts']
    }
  ];

  const styles = [
    'modern', 'minimalist', 'vintage', 'cyberpunk', 'organic', 'geometric',
    'abstract', 'realistic', 'cartoon', 'watercolor', 'oil-painting', 'sketch'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedAssets([]);
    
    // Simulate AI generation with MCP integration
    const mockAssets = [
      '/api/generated/asset1.png',
      '/api/generated/asset2.png',
      '/api/generated/asset3.png',
      '/api/generated/asset4.png'
    ];
    
    for (let i = 0; i < mockAssets.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedAssets(prev => [...prev, mockAssets[i]]);
    }
    
    setIsGenerating(false);
  };

  const handleRemix = async (assetUrl: string) => {
    setIsGenerating(true);
    
    // Simulate remix process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const remixedAsset = `/api/remixed/${Date.now()}.png`;
    setGeneratedAssets(prev => [...prev, remixedAsset]);
    
    setIsGenerating(false);
  };

  const TabButton: React.FC<{ 
    id: 'generate' | 'remix' | 'enhance'; 
    label: string; 
    icon: React.ReactNode;
  }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

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
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                AI Design Studio
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
            <TabButton id="generate" label="Generate" icon={<Wand2 className="h-4 w-4" />} />
            <TabButton id="remix" label="Remix" icon={<RefreshCw className="h-4 w-4" />} />
            <TabButton id="enhance" label="Enhance" icon={<Zap className="h-4 w-4" />} />
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Left Panel - Controls */}
          <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* AI Tool Selection */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  AI Tool
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {aiTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedTool === tool.id 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{tool.icon}</span>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {tool.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            {tool.capabilities.map((cap) => (
                              <span
                                key={cap}
                                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs rounded-full"
                              >
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Prompt
                </h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create..."
                  className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Style Selection */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Style
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((styleOption) => (
                    <button
                      key={styleOption}
                      onClick={() => setStyle(styleOption)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        style === styleOption 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {styleOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Settings */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  Quality
                </h3>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="draft">Draft</option>
                  <option value="standard">Standard</option>
                  <option value="high">High Quality</option>
                  <option value="ultra">Ultra High</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="flex-1 p-6">
            <div className="h-full">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                Generated Assets
              </h3>
              
              {generatedAssets.length === 0 && !isGenerating ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-24 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Ready to Create
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400">
                      Configure your settings and click Generate to start creating with AI
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto">
                  {generatedAssets.map((asset, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-white font-medium">Asset {index + 1}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Generated Asset
                        </span>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleRemix(asset)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="loading-dots mb-2">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Generating with {selectedTool}...
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIRemixPanel;