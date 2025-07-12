const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

require('dotenv').config();

class BeatportMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'beatport-mcp',
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
    
    // Beatport API configuration
    this.beatportApi = {
      baseUrl: 'https://api.beatport.com/v4',
      clientId: process.env.BEATPORT_CLIENT_ID,
      clientSecret: process.env.BEATPORT_CLIENT_SECRET
    };
  }

  setupTools() {
    this.server.tool('search_tracks', {
      description: 'Search for tracks on Beatport with advanced filtering',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          genre: { type: 'string', description: 'Genre filter' },
          bpm: { 
            type: 'object', 
            properties: {
              min: { type: 'number' },
              max: { type: 'number' }
            },
            description: 'BPM range filter'
          },
          key: { type: 'string', description: 'Musical key filter' },
          energy: { 
            type: 'string', 
            enum: ['low', 'medium', 'high'],
            description: 'Energy level filter'
          },
          sortBy: { 
            type: 'string', 
            enum: ['relevance', 'popularity', 'release_date', 'bpm', 'price'],
            default: 'relevance'
          },
          limit: { type: 'number', default: 50, description: 'Number of results' }
        },
        required: ['query']
      }
    });

    this.server.tool('get_track_details', {
      description: 'Get detailed information about a specific track',
      inputSchema: {
        type: 'object',
        properties: {
          trackId: { type: 'string', description: 'Beatport track ID' },
          includeAudio: { type: 'boolean', default: false, description: 'Include audio preview' },
          includeWaveform: { type: 'boolean', default: false, description: 'Include waveform data' }
        },
        required: ['trackId']
      }
    });

    this.server.tool('get_recommendations', {
      description: 'Get track recommendations based on seed tracks or preferences',
      inputSchema: {
        type: 'object',
        properties: {
          seedTracks: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Seed track IDs for recommendations'
          },
          genre: { type: 'string', description: 'Target genre' },
          bpm: { type: 'number', description: 'Target BPM' },
          key: { type: 'string', description: 'Target key' },
          energy: { type: 'string', description: 'Target energy level' },
          limit: { type: 'number', default: 20, description: 'Number of recommendations' }
        },
        required: ['seedTracks']
      }
    });

    this.server.tool('purchase_track', {
      description: 'Purchase a track from Beatport',
      inputSchema: {
        type: 'object',
        properties: {
          trackId: { type: 'string', description: 'Track ID to purchase' },
          format: { 
            type: 'string', 
            enum: ['mp3', 'wav', 'aiff'],
            default: 'wav',
            description: 'Audio format'
          },
          quality: { 
            type: 'string', 
            enum: ['320kbps', 'lossless'],
            default: 'lossless',
            description: 'Audio quality'
          }
        },
        required: ['trackId']
      }
    });

    this.server.tool('get_charts', {
      description: 'Get Beatport charts and top tracks',
      inputSchema: {
        type: 'object',
        properties: {
          chartType: { 
            type: 'string', 
            enum: ['top', 'trending', 'new', 'genre'],
            default: 'top'
          },
          genre: { type: 'string', description: 'Genre for genre-specific charts' },
          timeRange: { 
            type: 'string', 
            enum: ['day', 'week', 'month'],
            default: 'week'
          },
          limit: { type: 'number', default: 50, description: 'Number of tracks' }
        }
      }
    });

    this.server.tool('analyze_track_compatibility', {
      description: 'Analyze track compatibility for DJ mixing',
      inputSchema: {
        type: 'object',
        properties: {
          trackId: { type: 'string', description: 'Track ID to analyze' },
          compareWith: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Track IDs to compare with'
          },
          analysisType: { 
            type: 'string', 
            enum: ['harmonic', 'rhythmic', 'energy', 'full'],
            default: 'full'
          }
        },
        required: ['trackId']
      }
    });

    this.server.tool('get_artist_tracks', {
      description: 'Get tracks by a specific artist',
      inputSchema: {
        type: 'object',
        properties: {
          artistId: { type: 'string', description: 'Artist ID' },
          includeRemixes: { type: 'boolean', default: true },
          sortBy: { 
            type: 'string', 
            enum: ['release_date', 'popularity', 'bpm'],
            default: 'release_date'
          },
          limit: { type: 'number', default: 50 }
        },
        required: ['artistId']
      }
    });

    this.server.tool('get_label_tracks', {
      description: 'Get tracks from a specific label',
      inputSchema: {
        type: 'object',
        properties: {
          labelId: { type: 'string', description: 'Label ID' },
          sortBy: { 
            type: 'string', 
            enum: ['release_date', 'popularity', 'bpm'],
            default: 'release_date'
          },
          limit: { type: 'number', default: 50 }
        },
        required: ['labelId']
      }
    });
  }

  setupEventHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_tracks',
            description: 'Search for tracks on Beatport with advanced filtering',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                genre: { type: 'string' },
                bpm: { type: 'object' },
                key: { type: 'string' },
                energy: { type: 'string' },
                sortBy: { type: 'string' },
                limit: { type: 'number' }
              },
              required: ['query']
            }
          },
          {
            name: 'get_track_details',
            description: 'Get detailed information about a specific track',
            inputSchema: {
              type: 'object',
              properties: {
                trackId: { type: 'string' },
                includeAudio: { type: 'boolean' },
                includeWaveform: { type: 'boolean' }
              },
              required: ['trackId']
            }
          },
          {
            name: 'get_recommendations',
            description: 'Get track recommendations based on seed tracks',
            inputSchema: {
              type: 'object',
              properties: {
                seedTracks: { type: 'array', items: { type: 'string' } },
                genre: { type: 'string' },
                bpm: { type: 'number' },
                key: { type: 'string' },
                energy: { type: 'string' },
                limit: { type: 'number' }
              },
              required: ['seedTracks']
            }
          },
          {
            name: 'purchase_track',
            description: 'Purchase a track from Beatport',
            inputSchema: {
              type: 'object',
              properties: {
                trackId: { type: 'string' },
                format: { type: 'string' },
                quality: { type: 'string' }
              },
              required: ['trackId']
            }
          },
          {
            name: 'get_charts',
            description: 'Get Beatport charts and top tracks',
            inputSchema: {
              type: 'object',
              properties: {
                chartType: { type: 'string' },
                genre: { type: 'string' },
                timeRange: { type: 'string' },
                limit: { type: 'number' }
              }
            }
          },
          {
            name: 'analyze_track_compatibility',
            description: 'Analyze track compatibility for DJ mixing',
            inputSchema: {
              type: 'object',
              properties: {
                trackId: { type: 'string' },
                compareWith: { type: 'array', items: { type: 'string' } },
                analysisType: { type: 'string' }
              },
              required: ['trackId']
            }
          },
          {
            name: 'get_artist_tracks',
            description: 'Get tracks by a specific artist',
            inputSchema: {
              type: 'object',
              properties: {
                artistId: { type: 'string' },
                includeRemixes: { type: 'boolean' },
                sortBy: { type: 'string' },
                limit: { type: 'number' }
              },
              required: ['artistId']
            }
          },
          {
            name: 'get_label_tracks',
            description: 'Get tracks from a specific label',
            inputSchema: {
              type: 'object',
              properties: {
                labelId: { type: 'string' },
                sortBy: { type: 'string' },
                limit: { type: 'number' }
              },
              required: ['labelId']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_tracks':
            return await this.searchTracks(args);
          case 'get_track_details':
            return await this.getTrackDetails(args);
          case 'get_recommendations':
            return await this.getRecommendations(args);
          case 'purchase_track':
            return await this.purchaseTrack(args);
          case 'get_charts':
            return await this.getCharts(args);
          case 'analyze_track_compatibility':
            return await this.analyzeTrackCompatibility(args);
          case 'get_artist_tracks':
            return await this.getArtistTracks(args);
          case 'get_label_tracks':
            return await this.getLabelTracks(args);
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

  async searchTracks(args) {
    const { query, genre, bpm, key, energy, sortBy = 'relevance', limit = 50 } = args;

    try {
      // Simulate Beatport API call
      const searchResults = {
        query,
        results: [
          {
            id: 'track_001',
            title: 'Deep House Groove',
            artist: 'Tech Master',
            genre: 'House',
            bpm: 128,
            key: 'C',
            energy: 'high',
            price: 1.49,
            previewUrl: 'https://preview.beatport.com/track_001.mp3',
            releaseDate: '2024-01-15',
            popularity: 85
          },
          {
            id: 'track_002',
            title: 'Techno Storm',
            artist: 'Digital Pulse',
            genre: 'Techno',
            bpm: 130,
            key: 'D',
            energy: 'high',
            price: 1.99,
            previewUrl: 'https://preview.beatport.com/track_002.mp3',
            releaseDate: '2024-01-10',
            popularity: 92
          }
        ],
        filters: { genre, bpm, key, energy },
        sortBy,
        totalResults: 150
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
            text: `Error searching tracks: ${error.message}`
          }
        ]
      };
    }
  }

  async getTrackDetails(args) {
    const { trackId, includeAudio = false, includeWaveform = false } = args;

    try {
      // Simulate track details
      const trackDetails = {
        id: trackId,
        title: 'Deep House Groove',
        artist: 'Tech Master',
        remixArtist: null,
        genre: 'House',
        subGenre: 'Deep House',
        bpm: 128,
        key: 'C',
        energy: 'high',
        price: 1.49,
        duration: '6:45',
        releaseDate: '2024-01-15',
        label: 'Deep Records',
        catalogNumber: 'DEEP001',
        previewUrl: includeAudio ? 'https://preview.beatport.com/track_001.mp3' : null,
        waveformData: includeWaveform ? 'waveform_data_001' : null,
        tags: ['deep house', 'groove', 'melodic'],
        similarTracks: ['track_003', 'track_004', 'track_005']
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(trackDetails, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting track details: ${error.message}`
          }
        ]
      };
    }
  }

  async getRecommendations(args) {
    const { seedTracks, genre, bpm, key, energy, limit = 20 } = args;

    try {
      // Simulate recommendation engine
      const recommendations = {
        seedTracks,
        recommendations: [
          {
            id: 'rec_001',
            title: 'Recommended Track 1',
            artist: 'Artist A',
            genre: genre || 'House',
            bpm: bpm || 128,
            key: key || 'C',
            energy: energy || 'high',
            similarityScore: 0.95,
            reason: 'Similar BPM and key to seed tracks'
          },
          {
            id: 'rec_002',
            title: 'Recommended Track 2',
            artist: 'Artist B',
            genre: genre || 'Techno',
            bpm: bpm || 130,
            key: key || 'D',
            energy: energy || 'high',
            similarityScore: 0.88,
            reason: 'Popular in same genre'
          }
        ],
        totalRecommendations: 50
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(recommendations, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting recommendations: ${error.message}`
          }
        ]
      };
    }
  }

  async purchaseTrack(args) {
    const { trackId, format = 'wav', quality = 'lossless' } = args;

    try {
      // Simulate purchase process
      const purchaseResult = {
        trackId,
        purchaseId: `purchase_${Date.now()}`,
        format,
        quality,
        downloadUrl: `https://download.beatport.com/${trackId}.${format}`,
        price: 1.49,
        purchaseDate: new Date().toISOString(),
        status: 'completed',
        message: `Track purchased successfully in ${format} format`
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
            text: `Error purchasing track: ${error.message}`
          }
        ]
      };
    }
  }

  async getCharts(args) {
    const { chartType = 'top', genre, timeRange = 'week', limit = 50 } = args;

    try {
      // Simulate charts data
      const charts = {
        chartType,
        genre,
        timeRange,
        tracks: [
          {
            id: 'chart_001',
            title: 'Chart Topper 1',
            artist: 'Top Artist',
            genre: 'House',
            bpm: 128,
            position: 1,
            previousPosition: 2,
            weeksOnChart: 5
          },
          {
            id: 'chart_002',
            title: 'Chart Topper 2',
            artist: 'Rising Star',
            genre: 'Techno',
            bpm: 130,
            position: 2,
            previousPosition: 5,
            weeksOnChart: 3
          }
        ],
        totalTracks: limit
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(charts, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting charts: ${error.message}`
          }
        ]
      };
    }
  }

  async analyzeTrackCompatibility(args) {
    const { trackId, compareWith, analysisType = 'full' } = args;

    try {
      // Simulate compatibility analysis
      const analysis = {
        trackId,
        compareWith,
        analysisType,
        compatibility: {
          harmonic: 85,
          rhythmic: 92,
          energy: 78,
          overall: 85
        },
        recommendations: [
          'Good harmonic compatibility',
          'Excellent rhythmic matching',
          'Consider energy progression'
        ],
        details: {
          bpmDifference: 2,
          keyCompatibility: 'harmonic',
          energyFlow: 'progressive'
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

  async getArtistTracks(args) {
    const { artistId, includeRemixes = true, sortBy = 'release_date', limit = 50 } = args;

    try {
      // Simulate artist tracks
      const artistTracks = {
        artistId,
        artistName: 'Tech Master',
        tracks: [
          {
            id: 'artist_001',
            title: 'Original Track',
            remixArtist: null,
            genre: 'House',
            bpm: 128,
            releaseDate: '2024-01-15'
          },
          {
            id: 'artist_002',
            title: 'Original Track (Remix)',
            remixArtist: 'Remix Artist',
            genre: 'House',
            bpm: 130,
            releaseDate: '2024-01-10'
          }
        ],
        totalTracks: 25
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(artistTracks, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting artist tracks: ${error.message}`
          }
        ]
      };
    }
  }

  async getLabelTracks(args) {
    const { labelId, sortBy = 'release_date', limit = 50 } = args;

    try {
      // Simulate label tracks
      const labelTracks = {
        labelId,
        labelName: 'Deep Records',
        tracks: [
          {
            id: 'label_001',
            title: 'Label Track 1',
            artist: 'Artist A',
            genre: 'House',
            bpm: 128,
            releaseDate: '2024-01-15'
          },
          {
            id: 'label_002',
            title: 'Label Track 2',
            artist: 'Artist B',
            genre: 'Techno',
            bpm: 130,
            releaseDate: '2024-01-10'
          }
        ],
        totalTracks: 150
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(labelTracks, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting label tracks: ${error.message}`
          }
        ]
      };
    }
  }

  run() {
    const transport = new StdioServerTransport();
    this.server.connect(transport);
    console.log('Beatport MCP Server running...');
  }
}

// Start the server
const beatportMCP = new BeatportMCP();
beatportMCP.run();