#!/usr/bin/env node

/**
 * Frontend-Backend Integration Bridge
 * Deep integration pipeline connecting MCP backend tools with features dashboard frontend
 */

const express = require('express');
const WebSocket = require('ws');
const { EventEmitter } = require('events');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class FrontendBackendBridge extends EventEmitter {
    constructor() {
        super();
        this.app = express();
        this.port = process.env.BRIDGE_PORT || 3006;
        this.wss = null;
        this.connections = new Map();
        this.toolStates = new Map();
        this.featureToggles = new Map();
        this.tagSystem = new Map();
        
        // Backend service endpoints
        this.services = {
            dashboard: 'http://localhost:3001',
            admin: 'http://localhost:3002',
            analytics: 'http://localhost:3003',
            demo: 'http://localhost:3004',
            website: 'http://localhost:3005'
        };

        this.setupMiddleware();
        this.setupRoutes();
        this.initializeTagSystem();
    }

    setupMiddleware() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.static(path.join(__dirname, '../dashboard')));
        
        // CORS for cross-origin requests
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            next();
        });
    }

    setupRoutes() {
        // Health check for integration bridge
        this.app.get('/api/bridge/health', (req, res) => {
            res.json({
                status: 'healthy',
                services: this.getServiceHealth(),
                connections: this.connections.size,
                tools: this.toolStates.size,
                timestamp: new Date().toISOString()
            });
        });

        // Frontend-Backend Tool Registry
        this.app.get('/api/bridge/tools', (req, res) => {
            res.json(this.getToolRegistry());
        });

        // Feature Toggle Management
        this.app.get('/api/bridge/features', (req, res) => {
            res.json(this.getFeatureToggles());
        });

        this.app.post('/api/bridge/features', (req, res) => {
            this.updateFeatureToggles(req.body);
            res.json({ success: true, features: this.getFeatureToggles() });
        });

        // Tool State Management
        this.app.get('/api/bridge/tools/:toolId/state', (req, res) => {
            const { toolId } = req.params;
            const state = this.toolStates.get(toolId);
            res.json(state || { status: 'unknown', data: null });
        });

        this.app.post('/api/bridge/tools/:toolId/action', async (req, res) => {
            try {
                const { toolId } = req.params;
                const { action, params } = req.body;
                const result = await this.executeToolAction(toolId, action, params);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Real-time Data Sync
        this.app.post('/api/bridge/sync', async (req, res) => {
            try {
                const { type, data, target } = req.body;
                await this.syncData(type, data, target);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Tag System Management
        this.app.get('/api/bridge/tags', (req, res) => {
            res.json(this.getAllTags());
        });

        this.app.post('/api/bridge/tags', (req, res) => {
            const { entity, entityId, tags } = req.body;
            this.updateTags(entity, entityId, tags);
            res.json({ success: true });
        });

        // Frontend Component Registration
        this.app.post('/api/bridge/components/register', (req, res) => {
            const { componentId, type, config, dependencies } = req.body;
            this.registerFrontendComponent(componentId, type, config, dependencies);
            res.json({ success: true, componentId });
        });

        // Data Pipeline Endpoints
        this.app.post('/api/bridge/pipeline/analytics', async (req, res) => {
            try {
                const result = await this.processAnalyticsPipeline(req.body);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        this.app.post('/api/bridge/pipeline/automation', async (req, res) => {
            try {
                const result = await this.processAutomationPipeline(req.body);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Frontend Dashboard Proxy
        this.app.get('/api/bridge/dashboard/:page', async (req, res) => {
            try {
                const dashboardData = await this.getFrontendDashboardData(req.params.page, req.query);
                res.json(dashboardData);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Integration Status
        this.app.get('/api/bridge/integration/status', (req, res) => {
            res.json({
                bridge: 'active',
                frontend: this.checkFrontendConnection(),
                backend: this.checkBackendServices(),
                websocket: this.wss ? 'connected' : 'disconnected',
                lastSync: new Date().toISOString()
            });
        });
    }

    initializeTagSystem() {
        this.tagSystem.set('tools', new Map());
        this.tagSystem.set('components', new Map());
        this.tagSystem.set('users', new Map());
        this.tagSystem.set('integrations', new Map());
        this.tagSystem.set('analytics', new Map());
    }

    getToolRegistry() {
        return {
            mcpServers: [
                {
                    id: 'playwright-mcp',
                    name: 'Playwright MCP',
                    category: 'automation',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['browser-automation'],
                    endpoints: ['/api/playwright/execute', '/api/playwright/status'],
                    tags: ['automation', 'testing', 'web-scraping']
                },
                {
                    id: 'firecrawl-mcp',
                    name: 'Firecrawl MCP', 
                    category: 'data-extraction',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['web-crawler'],
                    endpoints: ['/api/firecrawl/crawl', '/api/firecrawl/extract'],
                    tags: ['data-extraction', 'web-scraping', 'content-analysis']
                },
                {
                    id: 'perplexity-mcp',
                    name: 'Perplexity MCP',
                    category: 'ai-research',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['ai-api'],
                    endpoints: ['/api/perplexity/search', '/api/perplexity/analyze'],
                    tags: ['ai', 'research', 'analysis']
                },
                {
                    id: 'clickup-mcp',
                    name: 'ClickUp MCP',
                    category: 'project-management',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['clickup-api'],
                    endpoints: ['/api/clickup/tasks', '/api/clickup/projects'],
                    tags: ['project-management', 'tasks', 'collaboration']
                },
                {
                    id: 'figma-mcp',
                    name: 'Figma MCP',
                    category: 'design',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['figma-api'],
                    endpoints: ['/api/figma/designs', '/api/figma/export'],
                    tags: ['design', 'ui-ux', 'collaboration']
                }
            ],
            automationTools: [
                {
                    id: 'string-automation',
                    name: 'String Automation Engine',
                    category: 'nlp-automation',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['nlp-engine'],
                    endpoints: ['/api/automation/create', '/api/automation/execute'],
                    tags: ['automation', 'nlp', 'workflows']
                },
                {
                    id: 'clickup-daemon',
                    name: 'ClickUp Automation Daemon',
                    category: 'background-automation',
                    frontendVisible: false,
                    adminOnly: true,
                    dependencies: ['clickup-api', 'scheduler'],
                    endpoints: ['/api/daemon/status', '/api/daemon/configure'],
                    tags: ['automation', 'background-tasks', 'clickup']
                },
                {
                    id: 'learning-daemon',
                    name: 'Automated Learning Daemon',
                    category: 'ml-automation',
                    frontendVisible: false,
                    adminOnly: true,
                    dependencies: ['ml-engine', 'data-pipeline'],
                    endpoints: ['/api/learning/status', '/api/learning/insights'],
                    tags: ['machine-learning', 'automation', 'insights']
                }
            ],
            monitoringTools: [
                {
                    id: 'health-monitor',
                    name: 'Health Monitor',
                    category: 'system-monitoring',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['monitoring-agent'],
                    endpoints: ['/api/health/status', '/api/health/metrics'],
                    tags: ['monitoring', 'health', 'system-status']
                },
                {
                    id: 'auto-fix-engine',
                    name: 'Auto-Fix Engine',
                    category: 'automated-remediation',
                    frontendVisible: true,
                    adminOnly: true,
                    dependencies: ['diagnostic-engine'],
                    endpoints: ['/api/autofix/scan', '/api/autofix/execute'],
                    tags: ['automation', 'fixes', 'remediation']
                },
                {
                    id: 'performance-analytics',
                    name: 'Performance Analytics',
                    category: 'analytics',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['analytics-engine'],
                    endpoints: ['/api/performance/metrics', '/api/performance/reports'],
                    tags: ['analytics', 'performance', 'metrics']
                }
            ],
            developmentTools: [
                {
                    id: 'multi-model-test',
                    name: 'Multi-Model Testing',
                    category: 'ai-testing',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['ai-models', 'testing-framework'],
                    endpoints: ['/api/testing/compare', '/api/testing/results'],
                    tags: ['testing', 'ai-models', 'comparison']
                },
                {
                    id: 'claude-workflow',
                    name: 'Claude Code Workflow',
                    category: 'ai-development',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['claude-api', 'code-analysis'],
                    endpoints: ['/api/claude/workflow', '/api/claude/generate'],
                    tags: ['ai', 'code-generation', 'workflows']
                },
                {
                    id: 'figma-plugin',
                    name: 'Figma Plugin Creator',
                    category: 'plugin-development',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['figma-api', 'plugin-framework'],
                    endpoints: ['/api/figma-plugin/create', '/api/figma-plugin/deploy'],
                    tags: ['figma', 'plugins', 'development']
                }
            ],
            businessTools: [
                {
                    id: 'knowledge-engine',
                    name: 'Knowledge Base Engine',
                    category: 'knowledge-management',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['search-engine', 'content-indexer'],
                    endpoints: ['/api/knowledge/search', '/api/knowledge/index'],
                    tags: ['knowledge-management', 'search', 'content']
                },
                {
                    id: 'business-intelligence',
                    name: 'Business Intelligence',
                    category: 'analytics',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['analytics-engine', 'data-warehouse'],
                    endpoints: ['/api/bi/reports', '/api/bi/insights'],
                    tags: ['business-intelligence', 'analytics', 'insights']
                },
                {
                    id: 'miro-dashboard',
                    name: 'Miro Dashboard',
                    category: 'visualization',
                    frontendVisible: true,
                    adminOnly: false,
                    dependencies: ['miro-api', 'visualization-engine'],
                    endpoints: ['/api/miro/boards', '/api/miro/create'],
                    tags: ['visualization', 'collaboration', 'dashboards']
                }
            ]
        };
    }

    getFeatureToggles() {
        return {
            dashboard: {
                canEditComponentLibrary: true,
                canEditComponentsOnDashboard: true,
                canUseComponentLibrary: true,
                canCreateStandaloneComponents: true,
                canRemoveComponentsFromDashboard: true,
                disableAutoSave: false,
                canAddNewRows: true,
                canAddNewCells: true,
                showSavingIndicator: true,
                parameters: true,
                forceMobile: false
            },
            filters: {
                showGlobalFilters: true,
                disablePersistingGlobalFiltersLocally: false,
                canConfigureLocalFilters: true
            },
            editing: {
                canEditCustomMetrics: true,
                allowSimpleMathsCustomField: true,
                allowPercentagesCustomField: true,
                allowRulesCustomField: true
            },
            exports: {
                canDownloadComponentData: true,
                canDownloadPDF: true,
                canDownloadViewData: true,
                canDownloadViewAsPNG: true,
                canDownloadDataSet: true
            },
            performance: {
                unloadOffScreenViews: false
            },
            enfusionAIze: {
                showMCPTools: true,
                enableAutomation: true,
                showAnalytics: true,
                enableDemoMode: true,
                websiteIntegration: true,
                adminAccess: false
            }
        };
    }

    updateFeatureToggles(updates) {
        const currentToggles = this.getFeatureToggles();
        const mergedToggles = this.deepMerge(currentToggles, updates);
        
        // Store updated toggles
        this.featureToggles.set('current', mergedToggles);
        
        // Broadcast to connected frontends
        this.broadcastToFrontends('feature-toggles-updated', mergedToggles);
        
        return mergedToggles;
    }

    async executeToolAction(toolId, action, params) {
        const tool = this.findToolById(toolId);
        if (!tool) {
            throw new Error(`Tool ${toolId} not found`);
        }

        // Route to appropriate backend service
        const serviceEndpoint = this.getServiceEndpointForTool(toolId);
        
        try {
            const response = await axios.post(`${serviceEndpoint}/api/tools/${toolId}/${action}`, params);
            
            // Update tool state
            this.toolStates.set(toolId, {
                status: 'active',
                lastAction: action,
                lastUpdate: new Date().toISOString(),
                data: response.data
            });

            // Broadcast state change to frontends
            this.broadcastToFrontends('tool-state-changed', {
                toolId,
                state: this.toolStates.get(toolId)
            });

            return response.data;
        } catch (error) {
            this.toolStates.set(toolId, {
                status: 'error',
                error: error.message,
                lastUpdate: new Date().toISOString()
            });
            
            throw error;
        }
    }

    async syncData(type, data, target) {
        switch (type) {
            case 'analytics':
                return await this.syncAnalyticsData(data, target);
            case 'tools':
                return await this.syncToolData(data, target);
            case 'users':
                return await this.syncUserData(data, target);
            case 'dashboard':
                return await this.syncDashboardData(data, target);
            default:
                throw new Error(`Unknown sync type: ${type}`);
        }
    }

    async syncAnalyticsData(data, target) {
        // Sync analytics data between backend and frontend
        const targets = target === 'all' ? ['frontend', 'backend'] : [target];
        
        for (const t of targets) {
            if (t === 'frontend') {
                this.broadcastToFrontends('analytics-data-updated', data);
            } else if (t === 'backend') {
                await axios.post(`${this.services.analytics}/api/sync`, data);
            }
        }
    }

    async syncToolData(data, target) {
        // Sync tool states and configurations
        const { toolId, state, config } = data;
        
        this.toolStates.set(toolId, state);
        
        if (target === 'frontend' || target === 'all') {
            this.broadcastToFrontends('tool-data-updated', { toolId, state, config });
        }
        
        if (target === 'backend' || target === 'all') {
            const serviceEndpoint = this.getServiceEndpointForTool(toolId);
            await axios.post(`${serviceEndpoint}/api/sync/tool`, { toolId, state, config });
        }
    }

    async getFrontendDashboardData(page, query) {
        // Compile data for frontend dashboard from multiple backend sources
        const dashboardData = {
            page,
            timestamp: new Date().toISOString(),
            data: {}
        };

        switch (page) {
            case 'overview':
                dashboardData.data = await this.getOverviewData(query);
                break;
            case 'analytics':
                dashboardData.data = await this.getAnalyticsData(query);
                break;
            case 'tools':
                dashboardData.data = await this.getToolsData(query);
                break;
            case 'admin':
                dashboardData.data = await this.getAdminData(query);
                break;
            default:
                dashboardData.data = await this.getDefaultData(query);
        }

        return dashboardData;
    }

    async getOverviewData(query) {
        const [toolStates, metrics, alerts] = await Promise.all([
            this.getAllToolStates(),
            this.getSystemMetrics(),
            this.getSystemAlerts()
        ]);

        return {
            tools: toolStates,
            metrics,
            alerts,
            activeUsers: this.connections.size,
            systemHealth: this.calculateSystemHealth()
        };
    }

    async getAnalyticsData(query) {
        try {
            const response = await axios.get(`${this.services.analytics}/api/dashboard/analytics`, {
                params: query
            });
            return response.data;
        } catch (error) {
            return { error: 'Analytics service unavailable' };
        }
    }

    async getToolsData(query) {
        const registry = this.getToolRegistry();
        const states = {};
        
        // Get current states for all tools
        for (const category of Object.keys(registry)) {
            for (const tool of registry[category]) {
                states[tool.id] = this.toolStates.get(tool.id) || { status: 'unknown' };
            }
        }

        return {
            registry,
            states,
            featureToggles: this.getFeatureToggles()
        };
    }

    updateTags(entity, entityId, tags) {
        if (!this.tagSystem.has(entity)) {
            this.tagSystem.set(entity, new Map());
        }
        
        const entityTags = this.tagSystem.get(entity);
        entityTags.set(entityId, tags);
        
        // Broadcast tag update
        this.broadcastToFrontends('tags-updated', { entity, entityId, tags });
    }

    getAllTags() {
        const allTags = {};
        for (const [entity, entityMap] of this.tagSystem.entries()) {
            allTags[entity] = Object.fromEntries(entityMap);
        }
        return allTags;
    }

    registerFrontendComponent(componentId, type, config, dependencies) {
        const component = {
            id: componentId,
            type,
            config,
            dependencies,
            registered: new Date().toISOString()
        };

        // Store component registration
        if (!this.tagSystem.has('components')) {
            this.tagSystem.set('components', new Map());
        }
        
        this.tagSystem.get('components').set(componentId, component);
        
        // Check dependencies
        this.validateComponentDependencies(component);
        
        return component;
    }

    validateComponentDependencies(component) {
        const registry = this.getToolRegistry();
        const allTools = [
            ...registry.mcpServers,
            ...registry.automationTools,
            ...registry.monitoringTools,
            ...registry.developmentTools,
            ...registry.businessTools
        ];

        const missingDeps = component.dependencies.filter(dep => 
            !allTools.some(tool => tool.dependencies.includes(dep))
        );

        if (missingDeps.length > 0) {
            console.warn(`Component ${component.id} has missing dependencies:`, missingDeps);
        }
    }

    findToolById(toolId) {
        const registry = this.getToolRegistry();
        for (const category of Object.values(registry)) {
            const tool = category.find(t => t.id === toolId);
            if (tool) return tool;
        }
        return null;
    }

    getServiceEndpointForTool(toolId) {
        // Map tools to their respective service endpoints
        const toolServiceMap = {
            'playwright-mcp': this.services.dashboard,
            'firecrawl-mcp': this.services.dashboard,
            'perplexity-mcp': this.services.dashboard,
            'clickup-mcp': this.services.dashboard,
            'figma-mcp': this.services.dashboard,
            'string-automation': this.services.dashboard,
            'clickup-daemon': this.services.dashboard,
            'learning-daemon': this.services.dashboard,
            'health-monitor': this.services.dashboard,
            'auto-fix-engine': this.services.dashboard,
            'performance-analytics': this.services.analytics,
            'multi-model-test': this.services.dashboard,
            'claude-workflow': this.services.dashboard,
            'figma-plugin': this.services.dashboard,
            'knowledge-engine': this.services.dashboard,
            'business-intelligence': this.services.analytics,
            'miro-dashboard': this.services.dashboard
        };

        return toolServiceMap[toolId] || this.services.dashboard;
    }

    checkFrontendConnection() {
        return this.connections.size > 0 ? 'connected' : 'disconnected';
    }

    async checkBackendServices() {
        const serviceStatus = {};
        
        for (const [name, url] of Object.entries(this.services)) {
            try {
                await axios.get(`${url}/health`, { timeout: 2000 });
                serviceStatus[name] = 'healthy';
            } catch (error) {
                serviceStatus[name] = 'unhealthy';
            }
        }
        
        return serviceStatus;
    }

    setupWebSocketServer() {
        const server = require('http').createServer(this.app);
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws, req) => {
            const connectionId = this.generateConnectionId();
            this.connections.set(connectionId, {
                ws,
                connectedAt: new Date().toISOString(),
                lastPing: new Date().toISOString()
            });

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleWebSocketMessage(connectionId, data);
                } catch (error) {
                    console.error('WebSocket message error:', error);
                }
            });

            ws.on('close', () => {
                this.connections.delete(connectionId);
            });

            // Send initial state
            ws.send(JSON.stringify({
                type: 'connection-established',
                connectionId,
                toolRegistry: this.getToolRegistry(),
                featureToggles: this.getFeatureToggles()
            }));
        });

        return server;
    }

    handleWebSocketMessage(connectionId, data) {
        const { type, payload } = data;

        switch (type) {
            case 'ping':
                this.sendToConnection(connectionId, { type: 'pong', timestamp: new Date().toISOString() });
                break;
            case 'subscribe-tool':
                this.subscribeToTool(connectionId, payload.toolId);
                break;
            case 'unsubscribe-tool':
                this.unsubscribeFromTool(connectionId, payload.toolId);
                break;
            case 'execute-tool-action':
                this.executeToolAction(payload.toolId, payload.action, payload.params)
                    .then(result => this.sendToConnection(connectionId, {
                        type: 'tool-action-result',
                        toolId: payload.toolId,
                        action: payload.action,
                        result
                    }))
                    .catch(error => this.sendToConnection(connectionId, {
                        type: 'tool-action-error',
                        toolId: payload.toolId,
                        action: payload.action,
                        error: error.message
                    }));
                break;
        }
    }

    broadcastToFrontends(type, data) {
        const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
        
        for (const [connectionId, connection] of this.connections.entries()) {
            try {
                connection.ws.send(message);
            } catch (error) {
                console.error(`Failed to send to connection ${connectionId}:`, error);
                this.connections.delete(connectionId);
            }
        }
    }

    sendToConnection(connectionId, data) {
        const connection = this.connections.get(connectionId);
        if (connection) {
            try {
                connection.ws.send(JSON.stringify(data));
            } catch (error) {
                console.error(`Failed to send to connection ${connectionId}:`, error);
                this.connections.delete(connectionId);
            }
        }
    }

    generateConnectionId() {
        return 'conn_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    async start() {
        const server = this.setupWebSocketServer();
        
        return new Promise((resolve) => {
            server.listen(this.port, () => {
                console.log('\n🌉 Frontend-Backend Integration Bridge Started');
                console.log('===============================================');
                console.log(`🔗 Bridge URL: http://localhost:${this.port}`);
                console.log(`🔌 WebSocket: ws://localhost:${this.port}`);
                console.log(`📊 Tool Registry: http://localhost:${this.port}/api/bridge/tools`);
                console.log(`⚙️ Feature Toggles: http://localhost:${this.port}/api/bridge/features`);
                console.log(`🏷️ Tag System: http://localhost:${this.port}/api/bridge/tags`);
                
                console.log('\n🔧 Integration Features:');
                console.log('   • Real-time tool state synchronization');
                console.log('   • Frontend-backend data pipeline');
                console.log('   • Feature toggle management');
                console.log('   • Comprehensive tag system');
                console.log('   • WebSocket real-time communication');
                console.log('   • Cross-service orchestration');
                
                console.log('\n📋 Connected Services:');
                Object.entries(this.services).forEach(([name, url]) => {
                    console.log(`   • ${name}: ${url}`);
                });
                
                resolve(server);
            });
        });
    }

    stop() {
        if (this.wss) {
            this.wss.close();
        }
        console.log('\n🛑 Frontend-Backend Bridge Stopped');
    }
}

// Run if called directly
if (require.main === module) {
    const bridge = new FrontendBackendBridge();
    
    bridge.start().then(() => {
        console.log('\n✅ Integration bridge is running!');
        
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down integration bridge...');
            bridge.stop();
            process.exit(0);
        });
    }).catch(error => {
        console.error('❌ Failed to start integration bridge:', error);
        process.exit(1);
    });
}

module.exports = FrontendBackendBridge;