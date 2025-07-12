import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { AudioPeripheralServer } from './audio-peripheral-server.js';
import { MIDIControllerServer } from './midi-controller-server.js';
import { SampleDatabaseServer } from './sample-database-server.js';
import { QuantizeSyncEngine } from './quantize-sync-engine.js';
import { USBDeviceManager } from './usb-device-manager.js';
import { NetworkManager } from './network-manager.js';

export class DJSampleMCPHost {
  private server: Server;
  private audioPeripheralServer: AudioPeripheralServer;
  private midiControllerServer: MIDIControllerServer;
  private sampleDatabaseServer: SampleDatabaseServer;
  private quantizeSyncEngine: QuantizeSyncEngine;
  private usbDeviceManager: USBDeviceManager;
  private networkManager: NetworkManager;

  constructor() {
    this.server = new Server(
      {
        name: 'dj-sample-mcp-host',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.initializeComponents();
    this.setupTools();
    this.setupEventHandlers();
  }

  private initializeComponents() {
    this.quantizeSyncEngine = new QuantizeSyncEngine();
    this.usbDeviceManager = new USBDeviceManager();
    this.networkManager = new NetworkManager();
    
    this.audioPeripheralServer = new AudioPeripheralServer(
      this.quantizeSyncEngine,
      this.usbDeviceManager,
      this.networkManager
    );
    
    this.midiControllerServer = new MIDIControllerServer(
      this.quantizeSyncEngine
    );
    
    this.sampleDatabaseServer = new SampleDatabaseServer();
  }

  private setupTools() {
    // Audio Peripheral Tools
    this.server.tool('capture_sample', {
      description: 'Capture audio sample from connected peripheral with automatic BPM detection and quantization',
      inputSchema: {
        type: 'object',
        properties: {
          deviceId: { type: 'string', description: 'Device ID to capture from' },
          duration: { type: 'number', description: 'Capture duration in seconds' },
          quantizeGrid: { 
            type: 'string', 
            enum: ['1/4', '1/8', '1/16', '1/32', '1/8T', '1/16T', 'off'],
            description: 'Quantization grid'
          },
          autoDetectBPM: { type: 'boolean', default: true },
          sampleName: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['deviceId']
      }
    });

    this.server.tool('sync_quantize', {
      description: 'Sync device to master clock with quantization',
      inputSchema: {
        type: 'object',
        properties: {
          deviceId: { type: 'string' },
          bpm: { type: 'number' },
          timeSignature: { type: 'string', default: '4/4' },
          quantizeGrid: { type: 'string' }
        },
        required: ['deviceId', 'bpm']
      }
    });

    this.server.tool('route_audio', {
      description: 'Route audio between devices and samplers',
      inputSchema: {
        type: 'object',
        properties: {
          sourceDevice: { type: 'string' },
          targetDevice: { type: 'string' },
          routingType: { 
            type: 'string', 
            enum: ['direct', 'processed', 'monitored']
          }
        },
        required: ['sourceDevice', 'targetDevice']
      }
    });

    // MIDI Controller Tools
    this.server.tool('assign_sample_to_pad', {
      description: 'Assign sample to MIDI controller pad',
      inputSchema: {
        type: 'object',
        properties: {
          controllerId: { type: 'string' },
          padNumber: { type: 'number' },
          sampleId: { type: 'string' },
          triggerMode: { 
            type: 'string', 
            enum: ['gate', 'toggle', 'momentary']
          }
        },
        required: ['controllerId', 'padNumber', 'sampleId']
      }
    });

    this.server.tool('sync_to_master_clock', {
      description: 'Sync MIDI controller to master clock',
      inputSchema: {
        type: 'object',
        properties: {
          controllerId: { type: 'string' },
          bpm: { type: 'number' },
          syncMode: { 
            type: 'string', 
            enum: ['internal', 'external', 'midi-clock']
          }
        },
        required: ['controllerId', 'bpm']
      }
    });

    // Sample Database Tools
    this.server.tool('search_samples', {
      description: 'Search samples in database',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          filters: {
            type: 'object',
            properties: {
              bpm: { type: 'object' },
              key: { type: 'string' },
              genre: { type: 'array', items: { type: 'string' } },
              tags: { type: 'array', items: { type: 'string' } }
            }
          },
          limit: { type: 'number', default: 50 }
        },
        required: ['query']
      }
    });

    this.server.tool('tag_sample', {
      description: 'Tag sample with metadata',
      inputSchema: {
        type: 'object',
        properties: {
          sampleId: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          metadata: { type: 'object' }
        },
        required: ['sampleId']
      }
    });

    this.server.tool('create_collection', {
      description: 'Create sample collection',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          sampleIds: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['name', 'sampleIds']
      }
    });

    this.server.tool('analyze_audio', {
      description: 'Analyze audio sample for BPM, key, and characteristics',
      inputSchema: {
        type: 'object',
        properties: {
          sampleId: { type: 'string' },
          analysisType: { 
            type: 'string', 
            enum: ['basic', 'detailed', 'spectral']
          }
        },
        required: ['sampleId']
      }
    });
  }

  private setupEventHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'capture_sample',
            description: 'Capture audio sample from connected peripheral',
            inputSchema: {
              type: 'object',
              properties: {
                deviceId: { type: 'string' },
                duration: { type: 'number' },
                quantizeGrid: { type: 'string' },
                autoDetectBPM: { type: 'boolean' },
                sampleName: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } }
              },
              required: ['deviceId']
            }
          },
          {
            name: 'sync_quantize',
            description: 'Sync device to master clock with quantization',
            inputSchema: {
              type: 'object',
              properties: {
                deviceId: { type: 'string' },
                bpm: { type: 'number' },
                timeSignature: { type: 'string' },
                quantizeGrid: { type: 'string' }
              },
              required: ['deviceId', 'bpm']
            }
          },
          {
            name: 'route_audio',
            description: 'Route audio between devices and samplers',
            inputSchema: {
              type: 'object',
              properties: {
                sourceDevice: { type: 'string' },
                targetDevice: { type: 'string' },
                routingType: { type: 'string' }
              },
              required: ['sourceDevice', 'targetDevice']
            }
          },
          {
            name: 'assign_sample_to_pad',
            description: 'Assign sample to MIDI controller pad',
            inputSchema: {
              type: 'object',
              properties: {
                controllerId: { type: 'string' },
                padNumber: { type: 'number' },
                sampleId: { type: 'string' },
                triggerMode: { type: 'string' }
              },
              required: ['controllerId', 'padNumber', 'sampleId']
            }
          },
          {
            name: 'sync_to_master_clock',
            description: 'Sync MIDI controller to master clock',
            inputSchema: {
              type: 'object',
              properties: {
                controllerId: { type: 'string' },
                bpm: { type: 'number' },
                syncMode: { type: 'string' }
              },
              required: ['controllerId', 'bpm']
            }
          },
          {
            name: 'search_samples',
            description: 'Search samples in database',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                filters: { type: 'object' },
                limit: { type: 'number' }
              },
              required: ['query']
            }
          },
          {
            name: 'tag_sample',
            description: 'Tag sample with metadata',
            inputSchema: {
              type: 'object',
              properties: {
                sampleId: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                metadata: { type: 'object' }
              },
              required: ['sampleId']
            }
          },
          {
            name: 'create_collection',
            description: 'Create sample collection',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                sampleIds: { type: 'array', items: { type: 'string' } },
                tags: { type: 'array', items: { type: 'string' } }
              },
              required: ['name', 'sampleIds']
            }
          },
          {
            name: 'analyze_audio',
            description: 'Analyze audio sample for BPM, key, and characteristics',
            inputSchema: {
              type: 'object',
              properties: {
                sampleId: { type: 'string' },
                analysisType: { type: 'string' }
              },
              required: ['sampleId']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'capture_sample':
            return await this.audioPeripheralServer.captureSample(args);
          case 'sync_quantize':
            return await this.audioPeripheralServer.syncQuantize(args);
          case 'route_audio':
            return await this.audioPeripheralServer.routeAudio(args);
          case 'assign_sample_to_pad':
            return await this.midiControllerServer.assignSampleToPad(args);
          case 'sync_to_master_clock':
            return await this.midiControllerServer.syncToMasterClock(args);
          case 'search_samples':
            return await this.sampleDatabaseServer.searchSamples(args);
          case 'tag_sample':
            return await this.sampleDatabaseServer.tagSample(args);
          case 'create_collection':
            return await this.sampleDatabaseServer.createCollection(args);
          case 'analyze_audio':
            return await this.sampleDatabaseServer.analyzeAudio(args);
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

  async start() {
    // Initialize device managers
    await this.usbDeviceManager.initialize();
    await this.networkManager.initialize();
    
    // Start quantize sync engine
    await this.quantizeSyncEngine.start();
    
    // Connect MCP transport
    const transport = new StdioServerTransport();
    this.server.connect(transport);
    
    console.log('DJ Sample MCP Host running...');
  }
}

// Start the MCP host
const djSampleMCPHost = new DJSampleMCPHost();
djSampleMCPHost.start();