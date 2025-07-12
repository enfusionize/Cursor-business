'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Sparkles, 
  Image, 
  Video, 
  FileText, 
  Layers, 
  Palette, 
  Zap,
  Grid,
  List,
  Eye,
  Edit3,
  Heart,
  Clock,
  User,
  Tag,
  TrendingUp
} from 'lucide-react';

// Import components
import AssetGrid from './components/AssetGrid';
import AssetUpload from './components/AssetUpload';
import AIRemixPanel from './components/AIRemixPanel';
import DesignToolsPanel from './components/DesignToolsPanel';
import SearchFilters from './components/SearchFilters';
import AssetPreview from './components/AssetPreview';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'design';
  url: string;
  thumbnail: string;
  creator: string;
  created: string;
  tags: string[];
  description: string;
  likes: number;
  downloads: number;
  remixes: number;
  aiGenerated: boolean;
  sourceFiles: string[];
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    tools?: string[];
  };
}

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document' | 'design'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showRemixPanel, setShowRemixPanel] = useState(false);
  const [showDesignTools, setShowDesignTools] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample data for demonstration
  useEffect(() => {
    const sampleAssets: Asset[] = [
      {
        id: '1',
        name: 'Modern UI Kit',
        type: 'design',
        url: '/api/assets/1',
        thumbnail: '/thumbnails/ui-kit.png',
        creator: 'Design Team',
        created: '2024-01-15T10:30:00Z',
        tags: ['ui', 'kit', 'modern', 'components'],
        description: 'Complete UI kit with modern components',
        likes: 245,
        downloads: 1200,
        remixes: 45,
        aiGenerated: false,
        sourceFiles: ['ui-kit.fig', 'ui-kit.sketch', 'ui-kit.psd'],
        metadata: {
          tools: ['Figma', 'Sketch', 'Photoshop'],
          format: 'Multi-format'
        }
      },
      {
        id: '2',
        name: 'AI Brand Identity',
        type: 'image',
        url: '/api/assets/2',
        thumbnail: '/thumbnails/brand-identity.png',
        creator: 'AI Assistant',
        created: '2024-01-14T15:45:00Z',
        tags: ['branding', 'logo', 'identity', 'ai-generated'],
        description: 'AI-generated brand identity system',
        likes: 189,
        downloads: 856,
        remixes: 78,
        aiGenerated: true,
        sourceFiles: ['brand-identity.ai', 'brand-identity.svg'],
        metadata: {
          width: 2048,
          height: 1536,
          format: 'SVG',
          tools: ['Midjourney', 'Illustrator']
        }
      },
      {
        id: '3',
        name: 'Motion Graphics Pack',
        type: 'video',
        url: '/api/assets/3',
        thumbnail: '/thumbnails/motion-graphics.png',
        creator: 'Animation Studio',
        created: '2024-01-13T09:15:00Z',
        tags: ['motion', 'graphics', 'animation', 'pack'],
        description: 'Professional motion graphics elements',
        likes: 312,
        downloads: 1456,
        remixes: 23,
        aiGenerated: false,
        sourceFiles: ['motion-pack.aep', 'motion-pack.mov'],
        metadata: {
          format: 'MP4',
          tools: ['After Effects', 'Cinema 4D']
        }
      }
    ];

    setTimeout(() => {
      setAssets(sampleAssets);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const statsData = [
    { label: 'Total Assets', value: assets.length, icon: Image },
    { label: 'AI Generated', value: assets.filter(a => a.aiGenerated).length, icon: Sparkles },
    { label: 'Total Downloads', value: assets.reduce((sum, a) => sum + a.downloads, 0), icon: Download },
    { label: 'Active Remixes', value: assets.reduce((sum, a) => sum + a.remixes, 0), icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Design AI Hub
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDesignTools(!showDesignTools)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Palette className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowRemixPanel(!showRemixPanel)}
                className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Sparkles className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
                <option value="design">Designs</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Grid */}
        <AssetGrid 
          assets={filteredAssets}
          viewMode={viewMode}
          loading={loading}
          onAssetSelect={setSelectedAsset}
        />
      </div>

      {/* Modals and Panels */}
      <AnimatePresence>
        {showUpload && (
          <AssetUpload onClose={() => setShowUpload(false)} />
        )}
        {showRemixPanel && (
          <AIRemixPanel onClose={() => setShowRemixPanel(false)} />
        )}
        {showDesignTools && (
          <DesignToolsPanel onClose={() => setShowDesignTools(false)} />
        )}
        {selectedAsset && (
          <AssetPreview 
            asset={selectedAsset} 
            onClose={() => setSelectedAsset(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}