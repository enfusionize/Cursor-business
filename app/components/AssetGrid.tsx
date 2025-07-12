'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Download, 
  Eye, 
  Share2, 
  Clock,
  User,
  Tag,
  Sparkles,
  FileText,
  Video,
  Image as ImageIcon,
  Layers
} from 'lucide-react';

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

interface AssetGridProps {
  assets: Asset[];
  viewMode: 'grid' | 'list';
  loading: boolean;
  onAssetSelect: (asset: Asset) => void;
}

const AssetGrid: React.FC<AssetGridProps> = ({ 
  assets, 
  viewMode, 
  loading, 
  onAssetSelect 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'design':
        return <Layers className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Layers className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No assets found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer"
            onClick={() => onAssetSelect(asset)}
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    {getTypeIcon(asset.type)}
                  </div>
                  {asset.aiGenerated && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1">
                      <Sparkles className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {asset.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{asset.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{asset.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{asset.remixes}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{asset.creator}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(asset.created)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {asset.tags.length > 3 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          +{asset.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset, index) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer group"
          onClick={() => onAssetSelect(asset)}
        >
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-xl flex items-center justify-center relative overflow-hidden">
              <div className="text-white">
                {getTypeIcon(asset.type)}
              </div>
              {asset.aiGenerated && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 rounded-full p-1">
                  <Sparkles className="h-3 w-3" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                  {asset.name}
                </h3>
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  {getTypeIcon(asset.type)}
                </div>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                {asset.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">{asset.creator}</span>
                </div>
                <span>{formatDate(asset.created)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{asset.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-3 w-3" />
                    <span>{asset.downloads}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {asset.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AssetGrid;