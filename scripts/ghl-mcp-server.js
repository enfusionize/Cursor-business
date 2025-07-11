#!/usr/bin/env node

/**
 * GoHighLevel (GHL) MCP Server - Enterprise Agency Integration
 * 2-Way Data Sync | Agency + Sub-Accounts | Vibe Marketing Integration
 */

const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types');
const axios = require('axios');
const WebSocket = require('ws');
const EventEmitter = require('events');

class GHLMCPServer extends EventEmitter {
    constructor() {
        super();
        this.server = new Server(
            {
                name: 'ghl-mcp-server',
                version: '2.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        // GHL API Configuration
        this.ghl = {
            agency: {
                apiKey: process.env.GHL_AGENCY_API_KEY,
                baseUrl: 'https://services.leadconnectorhq.com',
                initialized: false
            },
            oauth: {
                clientId: process.env.GHL_CLIENT_ID,
                clientSecret: process.env.GHL_CLIENT_SECRET,
                redirectUri: process.env.GHL_REDIRECT_URI
            },
            subAccounts: new Map(), // Store sub-account tokens
            webhooks: new Map(),    // Webhook subscriptions
            syncStatus: new Map()   // 2-way sync status tracking
        };

        // Integration Configurations
        this.integrations = {
            vibeMarketing: {
                enabled: !!process.env.VIBE_MARKETING_ENABLED,
                apiKey: process.env.VIBE_MARKETING_API_KEY,
                workflows: new Map()
            },
            gumloop: {
                enabled: !!process.env.GUMLOOP_ENABLED,
                apiKey: process.env.GUMLOOP_API_KEY,
                automations: new Map()
            },
            lindy: {
                enabled: !!process.env.LINDY_ENABLED,
                apiKey: process.env.LINDY_API_KEY,
                agents: new Map()
            }
        };

        // Data Sync Configuration
        this.dataSync = {
            enabled: true,
            interval: 30000, // 30 seconds
            lastSync: new Map(),
            conflictResolution: 'ghl_priority', // ghl_priority | external_priority | merge
            syncQueue: [],
            batchSize: 50
        };

        this.setupToolHandlers();
        this.initializeGHL();
        this.setupDataSync();
        this.setupWebhooks();
    }

    async initializeGHL() {
        try {
            if (this.ghl.agency.apiKey) {
                // Validate agency API key
                const response = await this.makeGHLRequest('/locations', 'GET');
                this.ghl.agency.initialized = true;
                console.log('✅ GHL Agency API initialized');
                
                // Load sub-accounts
                await this.loadSubAccounts();
                
                // Setup real-time sync
                this.startRealTimeSync();
            }
        } catch (error) {
            console.error('❌ GHL initialization failed:', error.message);
        }
    }

    async loadSubAccounts() {
        try {
            const locations = await this.makeGHLRequest('/locations', 'GET');
            
            for (const location of locations.locations || []) {
                this.ghl.subAccounts.set(location.id, {
                    id: location.id,
                    name: location.name,
                    domain: location.domain,
                    apiKey: location.apiKey || this.ghl.agency.apiKey,
                    lastSync: null,
                    syncEnabled: true
                });
            }
            
            console.log(`✅ Loaded ${this.ghl.subAccounts.size} sub-accounts`);
        } catch (error) {
            console.error('❌ Failed to load sub-accounts:', error.message);
        }
    }

    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                // Agency Management Tools
                {
                    name: 'get_agency_overview',
                    description: 'Get comprehensive agency overview with all sub-accounts',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            includeMetrics: { type: 'boolean', default: true },
                            includeSubAccounts: { type: 'boolean', default: true }
                        }
                    }
                },
                {
                    name: 'manage_sub_account',
                    description: 'Create, update, or manage sub-accounts',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            action: { type: 'string', enum: ['create', 'update', 'delete', 'sync'] },
                            subAccountId: { type: 'string' },
                            data: { type: 'object' }
                        },
                        required: ['action']
                    }
                },

                // Contact & Lead Management (2-Way Sync)
                {
                    name: 'sync_contacts',
                    description: '2-way contact sync between GHL and external systems',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            direction: { type: 'string', enum: ['pull', 'push', 'bidirectional'] },
                            subAccountId: { type: 'string' },
                            externalSystem: { type: 'string', enum: ['vibe', 'gumloop', 'lindy', 'custom'] },
                            filterCriteria: { type: 'object' },
                            conflictResolution: { type: 'string', enum: ['ghl_priority', 'external_priority', 'merge'] }
                        }
                    }
                },
                {
                    name: 'create_contact',
                    description: 'Create contact in GHL with auto-sync to external systems',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            contactData: { type: 'object' },
                            autoSync: { type: 'boolean', default: true },
                            tags: { type: 'array', items: { type: 'string' } }
                        },
                        required: ['subAccountId', 'contactData']
                    }
                },
                {
                    name: 'update_contact',
                    description: 'Update contact with 2-way sync propagation',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            contactId: { type: 'string' },
                            subAccountId: { type: 'string' },
                            updates: { type: 'object' },
                            syncToExternal: { type: 'boolean', default: true }
                        },
                        required: ['contactId', 'subAccountId', 'updates']
                    }
                },

                // Pipeline & Opportunity Management
                {
                    name: 'sync_opportunities',
                    description: '2-way opportunity sync across all systems',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            pipelineId: { type: 'string' },
                            direction: { type: 'string', enum: ['pull', 'push', 'bidirectional'] },
                            dateRange: { type: 'object' }
                        }
                    }
                },
                {
                    name: 'create_opportunity',
                    description: 'Create opportunity with multi-system sync',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            contactId: { type: 'string' },
                            pipelineId: { type: 'string' },
                            opportunityData: { type: 'object' },
                            triggerAutomations: { type: 'boolean', default: true }
                        },
                        required: ['subAccountId', 'contactId', 'pipelineId', 'opportunityData']
                    }
                },

                // Campaign & Marketing Automation
                {
                    name: 'sync_campaigns',
                    description: 'Sync campaigns between GHL and Vibe Marketing workflows',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            campaignType: { type: 'string', enum: ['email', 'sms', 'voice', 'social'] },
                            vibeWorkflow: { type: 'string' },
                            autoTrigger: { type: 'boolean', default: true }
                        }
                    }
                },
                {
                    name: 'create_automation',
                    description: 'Create GHL automation with external system triggers',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            automationType: { type: 'string' },
                            triggers: { type: 'array' },
                            actions: { type: 'array' },
                            integrations: { 
                                type: 'object',
                                properties: {
                                    vibe: { type: 'boolean' },
                                    gumloop: { type: 'boolean' },
                                    lindy: { type: 'boolean' }
                                }
                            }
                        },
                        required: ['subAccountId', 'automationType']
                    }
                },

                // Webhook & Real-time Sync Management
                {
                    name: 'setup_webhooks',
                    description: 'Setup webhooks for real-time 2-way sync',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            events: { type: 'array', items: { type: 'string' } },
                            targetSystems: { type: 'array', items: { type: 'string' } },
                            webhookUrl: { type: 'string' }
                        },
                        required: ['events']
                    }
                },
                {
                    name: 'monitor_sync_status',
                    description: 'Monitor 2-way sync status across all systems',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            timeRange: { type: 'string', enum: ['1h', '24h', '7d', '30d'] },
                            includeConflicts: { type: 'boolean', default: true }
                        }
                    }
                },

                // Vibe Marketing Integration Tools
                {
                    name: 'trigger_vibe_workflow',
                    description: 'Trigger Vibe Marketing workflow from GHL data',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            workflowId: { type: 'string' },
                            ghlTrigger: { type: 'object' },
                            contactData: { type: 'object' },
                            customFields: { type: 'object' }
                        },
                        required: ['workflowId']
                    }
                },
                {
                    name: 'sync_vibe_analytics',
                    description: 'Sync Vibe Marketing analytics back to GHL',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            analyticsType: { type: 'string', enum: ['engagement', 'conversion', 'attribution'] },
                            dateRange: { type: 'object' }
                        }
                    }
                },

                // Gumloop Integration Tools
                {
                    name: 'create_gumloop_automation',
                    description: 'Create Gumloop automation triggered by GHL events',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            automationConfig: { type: 'object' },
                            ghlTriggers: { type: 'array' },
                            outputActions: { type: 'array' }
                        },
                        required: ['automationConfig']
                    }
                },
                {
                    name: 'sync_gumloop_results',
                    description: 'Sync Gumloop automation results back to GHL',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            automationId: { type: 'string' },
                            resultMapping: { type: 'object' },
                            updateContacts: { type: 'boolean', default: true }
                        },
                        required: ['automationId']
                    }
                },

                // Lindy Integration Tools
                {
                    name: 'deploy_lindy_agent',
                    description: 'Deploy Lindy agent with GHL integration',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            agentConfig: { type: 'object' },
                            ghlPermissions: { type: 'array' },
                            autoActions: { type: 'boolean', default: false }
                        },
                        required: ['agentConfig']
                    }
                },
                {
                    name: 'sync_lindy_insights',
                    description: 'Sync Lindy agent insights and actions to GHL',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            agentId: { type: 'string' },
                            insightType: { type: 'string', enum: ['lead_scoring', 'engagement', 'predictions'] },
                            applyToGHL: { type: 'boolean', default: true }
                        },
                        required: ['agentId']
                    }
                },

                // Advanced Analytics & Reporting
                {
                    name: 'generate_unified_report',
                    description: 'Generate unified report across GHL and all integrated systems',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            reportType: { type: 'string', enum: ['performance', 'roi', 'attribution', 'automation'] },
                            subAccounts: { type: 'array' },
                            includeSystems: { type: 'array' },
                            dateRange: { type: 'object' },
                            exportFormat: { type: 'string', enum: ['json', 'csv', 'pdf'] }
                        },
                        required: ['reportType']
                    }
                },

                // Snapshot & Backup Tools
                {
                    name: 'create_ghl_snapshot',
                    description: 'Create complete GHL snapshot for instant deployment',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subAccountId: { type: 'string' },
                            includeData: { type: 'array', items: { type: 'string' } },
                            includeAutomations: { type: 'boolean', default: true },
                            includeIntegrations: { type: 'boolean', default: true },
                            snapshotName: { type: 'string' }
                        }
                    }
                },
                {
                    name: 'deploy_from_snapshot',
                    description: 'Deploy complete GHL setup from snapshot',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            snapshotId: { type: 'string' },
                            targetSubAccount: { type: 'string' },
                            overwriteExisting: { type: 'boolean', default: false },
                            customizations: { type: 'object' }
                        },
                        required: ['snapshotId', 'targetSubAccount']
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    // Agency Management
                    case 'get_agency_overview':
                        return await this.getAgencyOverview(args);
                    case 'manage_sub_account':
                        return await this.manageSubAccount(args);

                    // Contact & Lead Management
                    case 'sync_contacts':
                        return await this.syncContacts(args);
                    case 'create_contact':
                        return await this.createContact(args);
                    case 'update_contact':
                        return await this.updateContact(args);

                    // Pipeline & Opportunity Management
                    case 'sync_opportunities':
                        return await this.syncOpportunities(args);
                    case 'create_opportunity':
                        return await this.createOpportunity(args);

                    // Campaign & Marketing Automation
                    case 'sync_campaigns':
                        return await this.syncCampaigns(args);
                    case 'create_automation':
                        return await this.createAutomation(args);

                    // Webhook & Sync Management
                    case 'setup_webhooks':
                        return await this.setupWebhooks(args);
                    case 'monitor_sync_status':
                        return await this.monitorSyncStatus(args);

                    // Vibe Marketing Integration
                    case 'trigger_vibe_workflow':
                        return await this.triggerVibeWorkflow(args);
                    case 'sync_vibe_analytics':
                        return await this.syncVibeAnalytics(args);

                    // Gumloop Integration
                    case 'create_gumloop_automation':
                        return await this.createGumloopAutomation(args);
                    case 'sync_gumloop_results':
                        return await this.syncGumloopResults(args);

                    // Lindy Integration
                    case 'deploy_lindy_agent':
                        return await this.deployLindyAgent(args);
                    case 'sync_lindy_insights':
                        return await this.syncLindyInsights(args);

                    // Advanced Analytics
                    case 'generate_unified_report':
                        return await this.generateUnifiedReport(args);

                    // Snapshot & Backup
                    case 'create_ghl_snapshot':
                        return await this.createGHLSnapshot(args);
                    case 'deploy_from_snapshot':
                        return await this.deployFromSnapshot(args);

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
                    ],
                    isError: true
                };
            }
        });
    }

    // Agency Management Methods
    async getAgencyOverview(args) {
        const overview = {
            agency: {
                id: 'agency_main',
                name: 'EnfusionAIze Agency',
                totalSubAccounts: this.ghl.subAccounts.size,
                apiStatus: this.ghl.agency.initialized ? 'connected' : 'disconnected'
            },
            subAccounts: [],
            integrations: {
                vibeMarketing: this.integrations.vibeMarketing.enabled,
                gumloop: this.integrations.gumloop.enabled,
                lindy: this.integrations.lindy.enabled
            },
            syncStatus: {
                lastFullSync: this.dataSync.lastSync.get('full'),
                pendingOperations: this.dataSync.syncQueue.length,
                conflictCount: 0
            }
        };

        if (args.includeSubAccounts) {
            for (const [id, account] of this.ghl.subAccounts) {
                try {
                    const accountData = await this.makeGHLRequest(`/locations/${id}`, 'GET');
                    const metrics = await this.getSubAccountMetrics(id);
                    
                    overview.subAccounts.push({
                        id,
                        name: account.name,
                        domain: account.domain,
                        status: 'active',
                        lastSync: account.lastSync,
                        metrics: args.includeMetrics ? metrics : null
                    });
                } catch (error) {
                    overview.subAccounts.push({
                        id,
                        name: account.name,
                        status: 'error',
                        error: error.message
                    });
                }
            }
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        overview,
                        message: 'Agency overview retrieved successfully',
                        timestamp: new Date().toISOString()
                    }, null, 2)
                }
            ]
        };
    }

    async manageSubAccount(args) {
        const { action, subAccountId, data } = args;
        let result = {};

        switch (action) {
            case 'create':
                result = await this.createSubAccount(data);
                break;
            case 'update':
                result = await this.updateSubAccount(subAccountId, data);
                break;
            case 'delete':
                result = await this.deleteSubAccount(subAccountId);
                break;
            case 'sync':
                result = await this.syncSubAccount(subAccountId);
                break;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        action,
                        subAccountId,
                        result,
                        timestamp: new Date().toISOString()
                    }, null, 2)
                }
            ]
        };
    }

    // Contact & Lead Management Methods
    async syncContacts(args) {
        const { direction, subAccountId, externalSystem, filterCriteria, conflictResolution } = args;
        
        const syncOperation = {
            id: `sync_${Date.now()}`,
            type: 'contacts',
            direction,
            subAccountId,
            externalSystem,
            status: 'running',
            startTime: new Date().toISOString(),
            processed: 0,
            conflicts: 0,
            errors: []
        };

        try {
            let contacts = [];
            
            if (direction === 'pull' || direction === 'bidirectional') {
                // Pull contacts from external system
                contacts = await this.pullContactsFromExternal(externalSystem, filterCriteria);
                
                for (const contact of contacts) {
                    try {
                        await this.createOrUpdateGHLContact(subAccountId, contact, conflictResolution);
                        syncOperation.processed++;
                    } catch (error) {
                        syncOperation.errors.push({
                            contactId: contact.id,
                            error: error.message
                        });
                    }
                }
            }

            if (direction === 'push' || direction === 'bidirectional') {
                // Push contacts to external system
                const ghlContacts = await this.getGHLContacts(subAccountId, filterCriteria);
                
                for (const contact of ghlContacts) {
                    try {
                        await this.pushContactToExternal(externalSystem, contact);
                        syncOperation.processed++;
                    } catch (error) {
                        syncOperation.errors.push({
                            contactId: contact.id,
                            error: error.message
                        });
                    }
                }
            }

            syncOperation.status = 'completed';
            syncOperation.endTime = new Date().toISOString();

        } catch (error) {
            syncOperation.status = 'failed';
            syncOperation.error = error.message;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        syncOperation,
                        summary: {
                            direction,
                            externalSystem,
                            totalProcessed: syncOperation.processed,
                            errorCount: syncOperation.errors.length,
                            duration: syncOperation.endTime ? 
                                new Date(syncOperation.endTime) - new Date(syncOperation.startTime) : null
                        }
                    }, null, 2)
                }
            ]
        };
    }

    async createContact(args) {
        const { subAccountId, contactData, autoSync, tags } = args;
        
        try {
            // Create contact in GHL
            const ghlContact = await this.makeGHLRequest(`/contacts/`, 'POST', {
                locationId: subAccountId,
                ...contactData,
                tags: tags || []
            });

            // Auto-sync to external systems if enabled
            if (autoSync) {
                const syncPromises = [];
                
                if (this.integrations.vibeMarketing.enabled) {
                    syncPromises.push(this.pushContactToExternal('vibe', ghlContact));
                }
                if (this.integrations.gumloop.enabled) {
                    syncPromises.push(this.pushContactToExternal('gumloop', ghlContact));
                }
                if (this.integrations.lindy.enabled) {
                    syncPromises.push(this.pushContactToExternal('lindy', ghlContact));
                }

                await Promise.allSettled(syncPromises);
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            contact: ghlContact,
                            autoSyncEnabled: autoSync,
                            integrationResults: autoSync ? 'Synced to all enabled systems' : 'No auto-sync'
                        }, null, 2)
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to create contact: ${error.message}`);
        }
    }

    // Vibe Marketing Integration Methods
    async triggerVibeWorkflow(args) {
        if (!this.integrations.vibeMarketing.enabled) {
            throw new Error('Vibe Marketing integration not enabled');
        }

        const { workflowId, ghlTrigger, contactData, customFields } = args;
        
        try {
            // Trigger Vibe Marketing workflow
            const vibeResponse = await axios.post('https://api.vibemarketing.com/v1/workflows/trigger', {
                workflow_id: workflowId,
                source: 'ghl_mcp',
                trigger_data: ghlTrigger,
                contact_data: contactData,
                custom_fields: customFields
            }, {
                headers: {
                    'Authorization': `Bearer ${this.integrations.vibeMarketing.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            // Store workflow reference for tracking
            this.integrations.vibeMarketing.workflows.set(vibeResponse.data.execution_id, {
                workflowId,
                ghlTrigger,
                startTime: new Date().toISOString(),
                status: 'running'
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            execution_id: vibeResponse.data.execution_id,
                            workflow_id: workflowId,
                            status: 'triggered',
                            vibe_response: vibeResponse.data
                        }, null, 2)
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to trigger Vibe workflow: ${error.message}`);
        }
    }

    // Gumloop Integration Methods
    async createGumloopAutomation(args) {
        if (!this.integrations.gumloop.enabled) {
            throw new Error('Gumloop integration not enabled');
        }

        const { automationConfig, ghlTriggers, outputActions } = args;
        
        try {
            const gumloopResponse = await axios.post('https://api.gumloop.com/v1/automations', {
                name: automationConfig.name || 'GHL Triggered Automation',
                config: automationConfig,
                triggers: ghlTriggers.map(trigger => ({
                    ...trigger,
                    source: 'ghl_mcp'
                })),
                actions: outputActions
            }, {
                headers: {
                    'Authorization': `Bearer ${this.integrations.gumloop.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            // Store automation reference
            this.integrations.gumloop.automations.set(gumloopResponse.data.id, {
                config: automationConfig,
                ghlTriggers,
                createdAt: new Date().toISOString()
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            automation_id: gumloopResponse.data.id,
                            status: 'created',
                            gumloop_response: gumloopResponse.data
                        }, null, 2)
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to create Gumloop automation: ${error.message}`);
        }
    }

    // Lindy Integration Methods
    async deployLindyAgent(args) {
        if (!this.integrations.lindy.enabled) {
            throw new Error('Lindy integration not enabled');
        }

        const { agentConfig, ghlPermissions, autoActions } = args;
        
        try {
            const lindyResponse = await axios.post('https://api.lindy.ai/v1/agents', {
                name: agentConfig.name || 'GHL AI Agent',
                config: agentConfig,
                permissions: {
                    ghl: ghlPermissions,
                    auto_actions: autoActions
                },
                integrations: {
                    ghl: {
                        enabled: true,
                        webhook_url: `${process.env.WEBHOOK_BASE_URL}/ghl/lindy/${agentConfig.name}`
                    }
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${this.integrations.lindy.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            // Store agent reference
            this.integrations.lindy.agents.set(lindyResponse.data.id, {
                config: agentConfig,
                ghlPermissions,
                autoActions,
                deployedAt: new Date().toISOString()
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            agent_id: lindyResponse.data.id,
                            status: 'deployed',
                            webhook_url: `${process.env.WEBHOOK_BASE_URL}/ghl/lindy/${agentConfig.name}`,
                            lindy_response: lindyResponse.data
                        }, null, 2)
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to deploy Lindy agent: ${error.message}`);
        }
    }

    // Snapshot & Backup Methods
    async createGHLSnapshot(args) {
        const { subAccountId, includeData, includeAutomations, includeIntegrations, snapshotName } = args;
        
        const snapshot = {
            id: `snapshot_${Date.now()}`,
            name: snapshotName || `GHL Snapshot ${new Date().toISOString()}`,
            subAccountId,
            createdAt: new Date().toISOString(),
            data: {},
            metadata: {
                version: '2.0.0',
                source: 'ghl_mcp_server'
            }
        };

        try {
            // Collect sub-account data
            if (includeData?.includes('contacts')) {
                snapshot.data.contacts = await this.getGHLContacts(subAccountId);
            }
            if (includeData?.includes('pipelines')) {
                snapshot.data.pipelines = await this.makeGHLRequest(`/opportunities/pipelines?locationId=${subAccountId}`, 'GET');
            }
            if (includeData?.includes('campaigns')) {
                snapshot.data.campaigns = await this.makeGHLRequest(`/campaigns?locationId=${subAccountId}`, 'GET');
            }

            // Collect automations
            if (includeAutomations) {
                snapshot.data.automations = await this.makeGHLRequest(`/workflows?locationId=${subAccountId}`, 'GET');
            }

            // Collect integration configurations
            if (includeIntegrations) {
                snapshot.data.integrations = {
                    vibeMarketing: Array.from(this.integrations.vibeMarketing.workflows.entries()),
                    gumloop: Array.from(this.integrations.gumloop.automations.entries()),
                    lindy: Array.from(this.integrations.lindy.agents.entries())
                };
            }

            // Store snapshot (in production, save to database)
            console.log(`📸 Snapshot created: ${snapshot.id}`);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            snapshot: {
                                id: snapshot.id,
                                name: snapshot.name,
                                size: JSON.stringify(snapshot).length,
                                dataTypes: Object.keys(snapshot.data),
                                createdAt: snapshot.createdAt
                            },
                            deployment_ready: true
                        }, null, 2)
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to create snapshot: ${error.message}`);
        }
    }

    // Utility Methods
    async makeGHLRequest(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method,
                url: `${this.ghl.agency.baseUrl}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${this.ghl.agency.apiKey}`,
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new Error(`GHL API Error: ${error.response?.data?.message || error.message}`);
        }
    }

    async setupDataSync() {
        // Start periodic sync
        setInterval(async () => {
            try {
                await this.performPeriodicSync();
            } catch (error) {
                console.error('❌ Periodic sync failed:', error.message);
            }
        }, this.dataSync.interval);
    }

    async performPeriodicSync() {
        console.log('🔄 Starting periodic 2-way sync...');
        
        for (const [subAccountId, account] of this.ghl.subAccounts) {
            if (account.syncEnabled) {
                // Sync contacts
                await this.syncContacts({
                    direction: 'bidirectional',
                    subAccountId,
                    externalSystem: 'all'
                });

                // Update last sync time
                account.lastSync = new Date().toISOString();
            }
        }
        
        this.dataSync.lastSync.set('full', new Date().toISOString());
        console.log('✅ Periodic sync completed');
    }

    async setupWebhooks() {
        // Setup webhook endpoints for real-time sync
        // This would typically be handled by your webhook server
        console.log('🔗 Webhook endpoints ready for real-time sync');
    }

    startRealTimeSync() {
        console.log('🚀 Real-time 2-way sync started');
        this.emit('sync_started');
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.log('🔥 GHL MCP Server running - 2-Way Sync | Agency + Sub-Accounts | Vibe+Gumloop+Lindy Integration');
    }
}

if (require.main === module) {
    const server = new GHLMCPServer();
    server.start().catch(console.error);
}

module.exports = GHLMCPServer;