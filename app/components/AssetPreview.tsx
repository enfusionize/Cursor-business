'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Heart, Share2, Edit3, Eye, User, Clock, Tag } from 'lucide-react';

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

interface AssetPreviewProps {
  asset: Asset;
  onClose: () => void;
}

const AssetPreview: React.FC<AssetPreviewProps> = ({ asset, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
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
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {asset.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Left - Asset Preview */}
          <div className="flex-1 p-6 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-xl font-medium">{asset.name}</p>
                <p className="text-purple-100 mt-2">
                  {asset.metadata.width && asset.metadata.height 
                    ? `${asset.metadata.width} × ${asset.metadata.height}`
                    : 'Preview'}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Asset Details */}
          <div className="w-80 p-6 border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {asset.likes}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Likes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {asset.downloads}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Downloads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {asset.remixes}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Remixes</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {asset.description}
                </p>
              </div>

              {/* Creator Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Creator
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {asset.creator}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Created {formatDate(asset.created)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Type</span>
                    <span className="text-slate-900 dark:text-white capitalize">
                      {asset.type}
                    </span>
                  </div>
                  {asset.metadata.format && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Format</span>
                      <span className="text-slate-900 dark:text-white">
                        {asset.metadata.format}
                      </span>
                    </div>
                  )}
                  {asset.metadata.width && asset.metadata.height && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Dimensions</span>
                      <span className="text-slate-900 dark:text-white">
                        {asset.metadata.width} × {asset.metadata.height}
                      </span>
                    </div>
                  )}
                  {asset.aiGenerated && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">AI Generated</span>
                      <span className="text-yellow-600 dark:text-yellow-400">Yes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Source Files */}
              {asset.sourceFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Source Files
                  </h3>
                  <div className="space-y-2">
                    {asset.sourceFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {file}
                        </span>
                        <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                          <Download className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools Used */}
              {asset.metadata.tools && asset.metadata.tools.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Tools Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {asset.metadata.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssetPreview;