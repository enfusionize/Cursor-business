const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

require('dotenv').config();

class LoopcloudMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'loopcloud-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupEventHandlers();
    
    // Loopcloud API configuration
    this.loopcloudApi = {
      baseUrl: 'https://api.loopcloud.com/v1',
      apiKey: process.env.LOOPCLOUD_API_KEY,
      userId: process.env.LOOPCLOUD_USER_ID
    };
  }

  setupTools() {
    this.server.tool('search_loops', {
      description: 'Search for loops and samples on Loopcloud',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          category: { 
            type: 'string', 
            enum: ['drums', 'bass', 'melody', 'fx', 'vocals', 'percussion'],
            description: 'Loop category'
          },
          bpm: { 
            type: 'object', 
            properties: {
              min: { type: 'number' },
              max: { type: 'number' }
            },
            description: 'BPM range filter'
          },
          key: { type: 'string', description: 'Musical key filter' },
          length: { 
            type: 'string', 
            enum: ['1bar', '2bar', '4bar', '8bar', '16bar'],
            description: 'Loop length'
          },
          genre: { type: 'string', description: 'Genre filter' },
          sortBy: { 
            type: 'string', 
            enum: ['relevance', 'popularity', 'newest', 'bpm'],
            default: 'relevance'
          },
          limit: { type: 'number', default: 50, description: 'Number of results' }
        },
        required: ['query']
      }
    });

    this.server.tool('get_loop_details', {
      description: 'Get detailed information about a specific loop',
      inputSchema: {
        type: 'object',
        properties: {
          loopId: { type: 'string', description: 'Loop ID' },
          includeAudio: { type: 'boolean', default: false, description: 'Include audio preview' },
          includeWaveform: { type: 'boolean', default: false, description: 'Include waveform data' }
        },
        required: ['loopId']
      }
    });

    this.server.tool('purchase_loop', {
      description: 'Purchase a loop from Loopcloud',
      inputSchema: {
        type: 'object',
        properties: {
          loopId: { type: 'string', description: 'Loop ID to purchase' },
          format: { 
            type: 'string', 
            enum: ['wav', 'aiff', 'mp3'],
            default: 'wav',
            description: 'Audio format'
          },
          quality: { 
            type: 'string', 
            enum: ['44.1kHz', '48kHz', '96kHz'],
            default: '44.1kHz',
            description: 'Audio quality'
          }
        },
        required: ['loopId']
      }
    });

    this.server.tool('upload_loop', {
      description: 'Upload a loop to Loopcloud for storage and sharing',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: { type: 'string', description: 'Path to audio file' },
          title: { type: 'string', description: 'Loop title' },
          category: { 
            type: 'string', 
            enum: ['drums', 'bass', 'melody', 'fx', 'vocals', 'percussion']
          },
          bpm: { type: 'number', description: 'BPM of the loop' },
          key: { type: 'string', description: 'Musical key' },
          genre: { type: 'string', description: 'Genre' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
          isPublic: { type: 'boolean', default: false, description: 'Make loop public' }
        },
        required: ['filePath', 'title', 'category', 'bpm']
      }
    });

    this.server.tool('get_my_loops', {
      description: 'Get user\'s uploaded loops and purchased loops',
      inputSchema: {
        type: 'object',
        properties: {
          type: { 
            type: 'string', 
            enum: ['uploaded', 'purchased', 'all'],
            default: 'all'
          },
          category: { type: 'string', description: 'Filter by category' },
          sortBy: { 
            type: 'string', 
            enum: ['date', 'name', 'bpm', 'category'],
            default: 'date'
          },
          limit: { type: 'number', default: 50 }
        }
      }
    });

    this.server.tool('create_loop_pack', {
      description: 'Create a loop pack from selected loops',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Pack name' },
          description: { type: 'string', description: 'Pack description' },
          loopIds: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Loop IDs to include in pack'
          },
          isPublic: { type: 'boolean', default: false, description: 'Make pack public' },
          price: { type: 'number', description: 'Pack price (if public)' }
        },
        required: ['name', 'loopIds']
      }
    });

    this.server.tool('analyze_loop_compatibility', {
      description: 'Analyze loop compatibility for mixing and production',
      inputSchema: {
        type: 'object',
        properties: {
          loopId: { type: 'string', description: 'Loop ID to analyze' },
          compareWith: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Loop IDs to compare with'
          },
          analysisType: { 
            type: 'string', 
            enum: ['harmonic', 'rhythmic', 'energy', 'full'],
            default: 'full'
          }
        },
        required: ['loopId']
      }
    });

    this.server.tool('get_trending_loops', {
      description: 'Get trending and popular loops',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'Filter by category' },
          timeRange: { 
            type: 'string', 
            enum: ['day', 'week', 'month'],
            default: 'week'
          },
          limit: { type: 'number', default: 20 }
        }
      }
    });

    this.server.tool('sync_loop_library', {
      description: 'Sync local loop library with Loopcloud',
      inputSchema: {
        type: 'object',
        properties: {
          localPath: { type: 'string', description: 'Local loop library path' },
          syncDirection: { 
            type: 'string', 
            enum: ['upload', 'download', 'bidirectional'],
            default: 'bidirectional'
          },
          categories: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Categories to sync'
          }
        },
        required: ['localPath']
      }
    });
  }

  setupEventHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_loops',
            description: 'Search for loops and samples on Loopcloud',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                category: { type: 'string' },
                bpm: { type: 'object' },
                key: { type: 'string' },
                length: { type: 'string' },
                genre: { type: 'string' },
                sortBy: { type: 'string' },
                limit: { type: 'number' }
              },
              required: ['query']
            }
          },
          {
            name: 'get_loop_details',
            description: 'Get detailed information about a specific loop',
            inputSchema: {
              type: 'object',
              properties: {
                loopId: { type: 'string' },
                includeAudio: { type: 'boolean' },
                includeWaveform: { type: 'boolean' }
              },
              required: ['loopId']
            }
          },
          {
            name: 'purchase_loop',
            description: 'Purchase a loop from Loopcloud',
            inputSchema: {
              type: 'object',
              properties: {
                loopId: { type: 'string' },
                format: { type: 'string' },
                quality: { type: 'string' }
              },
              required: ['loopId']
            }
          },
          {
            name: 'upload_loop',
            description: 'Upload a loop to Loopcloud for storage and sharing',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: { type: 'string' },
                title: { type: 'string' },
                category: { type: 'string' },
                bpm: { type: 'number' },
                key: { type: 'string' },
                genre: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                isPublic: { type: 'boolean' }
              },
              required: ['filePath', 'title', 'category', 'bpm']
            }
          },
          {
            name: 'get_my_loops',
            description: 'Get user\'s uploaded loops and purchased loops',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                category: { type: 'string' },
                sortBy: { type: 'string' },
                limit: { type: 'number' }
              }
            }
          },
          {
            name: 'create_loop_pack',
            description: 'Create a loop pack from selected loops',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                loopIds: { type: 'array', items: { type: 'string' } },
                isPublic: { type: 'boolean' },
                price: { type: 'number' }
              },
              required: ['name', 'loopIds']
            }
          },
          {
            name: 'analyze_loop_compatibility',
            description: 'Analyze loop compatibility for mixing and production',
            inputSchema: {
              type: 'object',
              properties: {
                loopId: { type: 'string' },
                compareWith: { type: 'array', items: { type: 'string' } },
                analysisType: { type: 'string' }
              },
              required: ['loopId']
            }
          },
          {
            name: 'get_trending_loops',
            description: 'Get trending and popular loops',
            inputSchema: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                timeRange: { type: 'string' },
                limit: { type: 'number' }
              }
            }
          },
          {
            name: 'sync_loop_library',
            description: 'Sync local loop library with Loopcloud',
            inputSchema: {
              type: 'object',
              properties: {
                localPath: { type: 'string' },
                syncDirection: { type: 'string' },
                categories: { type: 'array', items: { type: 'string' } }
              },
              required: ['localPath']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_loops':
            return await this.searchLoops(args);
          case 'get_loop_details':
            return await this.getLoopDetails(args);
          case 'purchase_loop':
            return await this.purchaseLoop(args);
          case 'upload_loop':
            return await this.uploadLoop(args);
          case 'get_my_loops':
            return await this.getMyLoops(args);
          case 'create_loop_pack':
            return await this.createLoopPack(args);
          case 'analyze_loop_compatibility':
            return await this.analyzeLoopCompatibility(args);
          case 'get_trending_loops':
            return await this.getTrendingLoops(args);
          case 'sync_loop_library':
            return await this.syncLoopLibrary(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async searchLoops(args) {
    const { query, category, bpm, key, length, genre, sortBy = 'relevance', limit = 50 } = args;

    try {
      // Simulate Loopcloud API call
      const searchResults = {
        query,
        results: [
          {
            id: 'loop_001',
            title: 'Deep House Kick',
            category: 'drums',
            bpm: 128,
            key: 'C',
            length: '4bar',
            genre: 'House',
            price: 0.99,
            previewUrl: 'https://preview.loopcloud.com/loop_001.mp3',
            uploadDate: '2024-01-15',
            popularity: 85
          },
          {
            id: 'loop_002',
            title: 'Techno Bassline',
            category: 'bass',
            bpm: 130,
            key: 'D',
            length: '8bar',
            genre: 'Techno',
            price: 1.49,
            previewUrl: 'https://preview.loopcloud.com/loop_002.mp3',
            uploadDate: '2024-01-10',
            popularity: 92
          }
        ],
        filters: { category, bpm, key, length, genre },
        sortBy,
        totalResults: 250
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(searchResults, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching loops: ${error.message}`
          }
        ]
      };
    }
  }

  async getLoopDetails(args) {
    const { loopId, includeAudio = false, includeWaveform = false } = args;

    try {
      // Simulate loop details
      const loopDetails = {
        id: loopId,
        title: 'Deep House Kick',
        category: 'drums',
        bpm: 128,
        key: 'C',
        length: '4bar',
        genre: 'House',
        price: 0.99,
        duration: '4.0s',
        uploadDate: '2024-01-15',
        uploader: 'LoopMaster',
        previewUrl: includeAudio ? 'https://preview.loopcloud.com/loop_001.mp3' : null,
        waveformData: includeWaveform ? 'waveform_data_001' : null,
        tags: ['kick', 'house', 'deep'],
        similarLoops: ['loop_003', 'loop_004', 'loop_005']
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(loopDetails, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting loop details: ${error.message}`
          }
        ]
      };
    }
  }

  async purchaseLoop(args) {
    const { loopId, format = 'wav', quality = '44.1kHz' } = args;

    try {
      // Simulate purchase process
      const purchaseResult = {
        loopId,
        purchaseId: `purchase_${Date.now()}`,
        format,
        quality,
        downloadUrl: `https://download.loopcloud.com/${loopId}.${format}`,
        price: 0.99,
        purchaseDate: new Date().toISOString(),
        status: 'completed',
        message: `Loop purchased successfully in ${format} format`
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(purchaseResult, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error purchasing loop: ${error.message}`
          }
        ]
      };
    }
  }

  async uploadLoop(args) {
    const { filePath, title, category, bpm, key, genre, tags = [], isPublic = false } = args;

    try {
      // Simulate upload process
      const uploadResult = {
        loopId: `upload_${Date.now()}`,
        title,
        category,
        bpm,
        key,
        genre,
        tags,
        isPublic,
        uploadDate: new Date().toISOString(),
        status: 'completed',
        message: `Loop uploaded successfully: ${title}`
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(uploadResult, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error uploading loop: ${error.message}`
          }
        ]
      };
    }
  }

  async getMyLoops(args) {
    const { type = 'all', category, sortBy = 'date', limit = 50 } = args;

    try {
      // Simulate user loops
      const myLoops = {
        type,
        loops: [
          {
            id: 'my_loop_001',
            title: 'My Deep House Kick',
            category: 'drums',
            bpm: 128,
            key: 'C',
            uploadDate: '2024-01-15',
            isPublic: true,
            downloads: 25
          },
          {
            id: 'my_loop_002',
            title: 'My Techno Bass',
            category: 'bass',
            bpm: 130,
            key: 'D',
            uploadDate: '2024-01-10',
            isPublic: false,
            downloads: 0
          }
        ],
        totalLoops: 15
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(myLoops, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting my loops: ${error.message}`
          }
        ]
      };
    }
  }

  async createLoopPack(args) {
    const { name, description, loopIds, isPublic = false, price } = args;

    try {
      // Simulate pack creation
      const packResult = {
        packId: `pack_${Date.now()}`,
        name,
        description,
        loopIds,
        isPublic,
        price: isPublic ? price : null,
        createDate: new Date().toISOString(),
        status: 'created',
        message: `Loop pack created successfully: ${name}`
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(packResult, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating loop pack: ${error.message}`
          }
        ]
      };
    }
  }

  async analyzeLoopCompatibility(args) {
    const { loopId, compareWith, analysisType = 'full' } = args;

    try {
      // Simulate compatibility analysis
      const analysis = {
        loopId,
        compareWith,
        analysisType,
        compatibility: {
          harmonic: 88,
          rhythmic: 95,
          energy: 82,
          overall: 88
        },
        recommendations: [
          'Excellent rhythmic compatibility',
          'Good harmonic matching',
          'Consider energy progression'
        ],
        details: {
          bpmDifference: 0,
          keyCompatibility: 'perfect',
          energyFlow: 'smooth'
        }
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing compatibility: ${error.message}`
          }
        ]
      };
    }
  }

  async getTrendingLoops(args) {
    const { category, timeRange = 'week', limit = 20 } = args;

    try {
      // Simulate trending loops
      const trendingLoops = {
        category,
        timeRange,
        loops: [
          {
            id: 'trending_001',
            title: 'Trending Kick',
            category: 'drums',
            bpm: 128,
            key: 'C',
            popularity: 95,
            downloads: 150
          },
          {
            id: 'trending_002',
            title: 'Viral Bassline',
            category: 'bass',
            bpm: 130,
            key: 'D',
            popularity: 92,
            downloads: 120
          }
        ],
        totalLoops: limit
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(trendingLoops, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting trending loops: ${error.message}`
          }
        ]
      };
    }
  }

  async syncLoopLibrary(args) {
    const { localPath, syncDirection = 'bidirectional', categories = [] } = args;

    try {
      // Simulate library sync
      const syncResult = {
        localPath,
        syncDirection,
        categories,
        syncDate: new Date().toISOString(),
        uploaded: 5,
        downloaded: 12,
        conflicts: 0,
        status: 'completed',
        message: `Loop library synced successfully`
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(syncResult, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error syncing loop library: ${error.message}`
          }
        ]
      };
    }
  }

  run() {
    const transport = new StdioServerTransport();
    this.server.connect(transport);
    console.log('Loopcloud MCP Server running...');
  }
}

// Start the server
const loopcloudMCP = new LoopcloudMCP();
loopcloudMCP.run();