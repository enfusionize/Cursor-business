#!/usr/bin/env node

/**
 * Enfusionize™ Advanced Sandbox Manager
 * Complete sandbox environment management with one-click deployment
 * Powered by S.A.I.A.S.™ Framework
 */

const express = require('express');
const Docker = require('dockerode');
const fs = require('fs-extra');
const path = require('path');
const { EventEmitter } = require('events');
const WebSocket = require('ws');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const cron = require('node-cron');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

class AdvancedSandboxManager extends EventEmitter {
    constructor() {
        super();
        this.docker = new Docker();
        this.environments = new Map();
        this.deployments = new Map();
        this.liveSystemState = new Map();
        this.config = this.loadConfig();
        this.app = express();
        this.wss = null;
        this.server = null;
        this.testSuites = new Map();
        this.promotionQueue = [];
        
        this.setupExpress();
        this.setupWebSocket();
        this.setupScheduledTasks();
        this.initializeSystem();
    }

    loadConfig() {
        const configPath = path.join(__dirname, 'configs/sandbox-config.json');
        try {
            return fs.readJsonSync(configPath);
        } catch (error) {
            console.log(chalk.yellow('⚠️  No config found, creating default config'));
            const defaultConfig = this.createDefaultConfig();
            fs.ensureDirSync(path.dirname(configPath));
            fs.writeJsonSync(configPath, defaultConfig, { spaces: 2 });
            return defaultConfig;
        }
    }

    createDefaultConfig() {
        return {
            port: 3100,
            environments: {
                staging: {
                    replicas: 1,
                    resources: { cpu: '2', memory: '2g' },
                    autoScale: true,
                    maxReplicas: 3,
                    database: true,
                    redis: true,
                    loadBalancer: true
                },
                integration: {
                    replicas: 1,
                    resources: { cpu: '1', memory: '1g' },
                    autoScale: false,
                    database: true,
                    redis: false,
                    loadBalancer: false
                },
                feature: {
                    replicas: 1,
                    resources: { cpu: '0.5', memory: '512m' },
                    autoScale: false,
                    database: false,
                    redis: false,
                    loadBalancer: false
                },
                experimental: {
                    replicas: 1,
                    resources: { cpu: '0.25', memory: '256m' },
                    autoScale: false,
                    database: false,
                    redis: false,
                    loadBalancer: false
                }
            },
            monitoring: {
                enabled: true,
                interval: 15000,
                metrics: ['cpu', 'memory', 'network', 'disk', 'requests', 'errors'],
                alerts: {
                    cpu: 80,
                    memory: 85,
                    errorRate: 5
                }
            },
            deployment: {
                timeout: 600000,
                retries: 3,
                rollback: true,
                validation: {
                    healthCheck: true,
                    loadTest: true,
                    securityScan: true,
                    performanceTest: true
                }
            },
            liveSystem: {
                syncInterval: 30000,
                backupBeforePromotion: true,
                rollbackTimeout: 300000,
                trafficSplitRatio: 0.1
            },
            security: {
                isolation: true,
                networkPolicies: true,
                secretManagement: true,
                accessControl: true
            }
        };
    }

    setupExpress() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(express.static(path.join(__dirname, 'dashboard')));
        
        // Enhanced CORS and security middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Sandbox-Token');
            res.header('X-Sandbox-Manager', 'Enfusionize-Advanced');
            
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        this.setupRoutes();
    }

    setupRoutes() {
        // Environment Management
        this.app.get('/api/sandbox/environments', this.getEnvironments.bind(this));
        this.app.post('/api/sandbox/environments', this.createEnvironment.bind(this));
        this.app.get('/api/sandbox/environments/:id', this.getEnvironment.bind(this));
        this.app.put('/api/sandbox/environments/:id', this.updateEnvironment.bind(this));
        this.app.delete('/api/sandbox/environments/:id', this.deleteEnvironment.bind(this));
        
        // Advanced Deployment
        this.app.post('/api/sandbox/environments/:id/deploy', this.deployToEnvironment.bind(this));
        this.app.post('/api/sandbox/environments/:id/quick-deploy', this.quickDeploy.bind(this));
        this.app.post('/api/sandbox/environments/:id/rollback', this.rollbackDeployment.bind(this));
        
        // One-Click Promotion System
        this.app.post('/api/sandbox/environments/:id/promote', this.promoteToProduction.bind(this));
        this.app.post('/api/sandbox/environments/:id/promote-with-validation', this.promoteWithValidation.bind(this));
        this.app.post('/api/sandbox/environments/:id/canary-promote', this.canaryPromote.bind(this));
        
        // Live System Integration
        this.app.post('/api/sandbox/environments/:id/sync-live', this.syncWithLiveSystem.bind(this));
        this.app.post('/api/sandbox/environments/:id/switch-traffic', this.switchTraffic.bind(this));
        this.app.get('/api/sandbox/live-system/state', this.getLiveSystemState.bind(this));
        
        // Testing Framework
        this.app.post('/api/sandbox/environments/:id/test', this.runTests.bind(this));
        this.app.get('/api/sandbox/environments/:id/test-results', this.getTestResults.bind(this));
        this.app.post('/api/sandbox/environments/:id/load-test', this.runLoadTest.bind(this));
        this.app.post('/api/sandbox/environments/:id/security-scan', this.runSecurityScan.bind(this));
        
        // Monitoring and Analytics
        this.app.get('/api/sandbox/environments/:id/metrics', this.getEnvironmentMetrics.bind(this));
        this.app.get('/api/sandbox/environments/:id/logs', this.getEnvironmentLogs.bind(this));
        this.app.get('/api/sandbox/environments/:id/health', this.getEnvironmentHealth.bind(this));
        
        // Bulk Operations
        this.app.post('/api/sandbox/bulk/create', this.bulkCreateEnvironments.bind(this));
        this.app.post('/api/sandbox/bulk/deploy', this.bulkDeploy.bind(this));
        this.app.post('/api/sandbox/bulk/test', this.bulkTest.bind(this));
        this.app.delete('/api/sandbox/bulk/cleanup', this.bulkCleanup.bind(this));
        
        // Configuration Management
        this.app.get('/api/sandbox/config', this.getConfig.bind(this));
        this.app.put('/api/sandbox/config', this.updateConfig.bind(this));
        this.app.post('/api/sandbox/config/backup', this.backupConfig.bind(this));
        this.app.post('/api/sandbox/config/restore', this.restoreConfig.bind(this));
        
        // Dashboard and UI
        this.app.get('/dashboard', (req, res) => {
            res.sendFile(path.join(__dirname, 'dashboard/index.html'));
        });
        this.app.get('/dashboard/advanced', (req, res) => {
            res.sendFile(path.join(__dirname, 'dashboard/advanced.html'));
        });
    }

    setupWebSocket() {
        this.server = this.app.listen(this.config.port, () => {
            console.log(chalk.green(`🚀 Advanced Sandbox Manager running on port ${this.config.port}`));
            console.log(chalk.blue(`📊 Dashboard: http://localhost:${this.config.port}/dashboard`));
        });

        this.wss = new WebSocket.Server({ server: this.server });
        
        this.wss.on('connection', (ws, req) => {
            console.log(chalk.blue('📡 WebSocket client connected'));
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleWebSocketMessage(ws, data);
                } catch (error) {
                    console.error('WebSocket message error:', error);
                    ws.send(JSON.stringify({ type: 'error', message: error.message }));
                }
            });

            ws.on('close', () => {
                console.log(chalk.yellow('📡 WebSocket client disconnected'));
            });

            // Send initial state
            ws.send(JSON.stringify({
                type: 'initial-state',
                environments: Array.from(this.environments.values()),
                deployments: Array.from(this.deployments.values()),
                liveSystemState: Array.from(this.liveSystemState.entries())
            }));
        });
    }

    handleWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'subscribe':
                ws.environmentId = data.environmentId;
                ws.subscriptions = data.subscriptions || ['status', 'metrics', 'logs'];
                break;
            case 'get-status':
                this.sendEnvironmentStatus(ws, data.environmentId);
                break;
            case 'get-metrics':
                this.sendEnvironmentMetrics(ws, data.environmentId);
                break;
            case 'stream-logs':
                this.startLogStream(ws, data.environmentId);
                break;
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    }

    broadcast(type, data, filter = null) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (!filter || filter(client)) {
                    client.send(JSON.stringify({ type, data, timestamp: new Date() }));
                }
            }
        });
    }

    async initializeSystem() {
        console.log(chalk.blue('🔧 Initializing Advanced Sandbox System...'));
        
        // Ensure all required directories exist
        const dirs = [
            'sandbox/environments',
            'sandbox/apps',
            'sandbox/configs',
            'sandbox/scripts',
            'sandbox/monitoring',
            'sandbox/deployment',
            'sandbox/tests',
            'sandbox/backups',
            'sandbox/logs',
            'sandbox/dashboard'
        ];

        for (const dir of dirs) {
            await fs.ensureDir(dir);
        }

        // Initialize system components
        await this.initializeDocker();
        await this.loadExistingEnvironments();
        await this.syncLiveSystemState();
        await this.setupTestSuites();
        await this.createDashboard();
        
        console.log(chalk.green('✅ Advanced Sandbox System initialized'));
    }

    async initializeDocker() {
        try {
            // Create sandbox network if it doesn't exist
            const networks = await this.docker.listNetworks();
            const sandboxNetwork = networks.find(net => net.Name === 'sandbox-network');
            
            if (!sandboxNetwork) {
                await this.docker.createNetwork({
                    Name: 'sandbox-network',
                    Driver: 'bridge',
                    IPAM: {
                        Config: [{
                            Subnet: '172.30.0.0/16',
                            Gateway: '172.30.0.1'
                        }]
                    }
                });
                console.log(chalk.green('✅ Sandbox network created'));
            }

            // Create shared volumes
            const volumes = await this.docker.listVolumes();
            const requiredVolumes = ['sandbox-shared', 'sandbox-logs', 'sandbox-backups'];
            
            for (const volumeName of requiredVolumes) {
                const exists = volumes.Volumes?.some(vol => vol.Name === volumeName);
                if (!exists) {
                    await this.docker.createVolume({ Name: volumeName });
                    console.log(chalk.green(`✅ Volume ${volumeName} created`));
                }
            }
        } catch (error) {
            console.error('Docker initialization error:', error);
        }
    }

    async loadExistingEnvironments() {
        try {
            const containers = await this.docker.listContainers({ all: true });
            const sandboxContainers = containers.filter(container => 
                container.Names.some(name => name.includes('sandbox-'))
            );

            for (const container of sandboxContainers) {
                const envId = this.extractEnvironmentId(container.Names[0]);
                if (envId) {
                    const environment = await this.reconstructEnvironment(container, envId);
                    this.environments.set(envId, environment);
                    
                    // Start monitoring if container is running
                    if (container.State === 'running') {
                        this.startEnvironmentMonitoring(environment);
                    }
                }
            }
            
            console.log(chalk.green(`✅ Loaded ${this.environments.size} existing environments`));
        } catch (error) {
            console.error('Error loading existing environments:', error);
        }
    }

    async reconstructEnvironment(container, envId) {
        const containerInfo = await this.docker.getContainer(container.Id).inspect();
        
        return {
            id: envId,
            type: this.extractEnvironmentType(envId),
            containerId: container.Id,
            status: container.State,
            created: new Date(container.Created * 1000),
            image: container.Image,
            ports: container.Ports,
            config: containerInfo.Config,
            networkSettings: containerInfo.NetworkSettings,
            metrics: {
                cpu: 0,
                memory: 0,
                network: 0,
                disk: 0,
                requests: 0,
                errors: 0
            },
            health: 'unknown',
            lastSync: null,
            deployments: [],
            tests: []
        };
    }

    extractEnvironmentId(containerName) {
        const match = containerName.match(/sandbox-(.+)/);
        return match ? match[1] : null;
    }

    extractEnvironmentType(envId) {
        const parts = envId.split('-');
        return parts[0] || 'unknown';
    }

    async syncLiveSystemState() {
        try {
            // This would integrate with your live system monitoring
            // For now, we'll simulate the live system state
            this.liveSystemState.set('production', {
                status: 'healthy',
                version: '1.0.0',
                uptime: Date.now(),
                cpu: 45,
                memory: 60,
                requests: 1250,
                errors: 0,
                lastDeployment: new Date(Date.now() - 86400000) // 24 hours ago
            });
            
            console.log(chalk.green('✅ Live system state synchronized'));
        } catch (error) {
            console.error('Error syncing live system state:', error);
        }
    }

    // API Implementation Methods
    async getEnvironments(req, res) {
        try {
            const environments = Array.from(this.environments.values());
            const enrichedEnvironments = await Promise.all(
                environments.map(async (env) => {
                    const metrics = await this.getEnvironmentMetricsData(env.id);
                    const health = await this.getEnvironmentHealthData(env.id);
                    return { ...env, metrics, health };
                })
            );

            res.json({
                success: true,
                environments: enrichedEnvironments,
                total: environments.length,
                summary: {
                    running: environments.filter(env => env.status === 'running').length,
                    stopped: environments.filter(env => env.status === 'exited').length,
                    healthy: environments.filter(env => env.health === 'healthy').length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async createEnvironment(req, res) {
        try {
            const { name, type, config = {}, apps = [] } = req.body;
            
            if (!name || !type) {
                return res.status(400).json({
                    success: false,
                    error: 'Name and type are required'
                });
            }

            const envId = `${type}-${name}-${Date.now()}`;
            const spinner = ora(`Creating environment ${envId}`).start();

            // Validate environment type
            if (!this.config.environments[type]) {
                spinner.fail(`Invalid environment type: ${type}`);
                return res.status(400).json({
                    success: false,
                    error: `Invalid environment type: ${type}`
                });
            }

            const environment = await this.createAdvancedEnvironment(envId, type, config, apps);
            
            this.environments.set(envId, environment);
            
            spinner.succeed(`Environment ${envId} created successfully`);
            
            this.broadcast('environment:created', environment);
            
            res.json({
                success: true,
                environment,
                dashboardUrl: `http://localhost:${this.config.port}/dashboard?env=${envId}`,
                apiEndpoint: `http://localhost:${this.config.port}/api/sandbox/environments/${envId}`
            });
        } catch (error) {
            console.error('Environment creation error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async createAdvancedEnvironment(envId, type, config = {}, apps = []) {
        const envConfig = {
            ...this.config.environments[type],
            ...config
        };

        // Create isolated network for the environment
        const network = await this.docker.createNetwork({
            Name: `sandbox-${envId}`,
            Driver: 'bridge',
            Internal: envConfig.isolated || false,
            IPAM: {
                Config: [{
                    Subnet: this.generateSubnet(),
                    Gateway: this.generateGateway()
                }]
            }
        });

        // Create main application container
        const container = await this.docker.createContainer({
            Image: config.image || 'node:18-alpine',
            name: `sandbox-${envId}`,
            Env: [
                `NODE_ENV=sandbox`,
                `SANDBOX_ENV_ID=${envId}`,
                `SANDBOX_TYPE=${type}`,
                `PORT=${config.port || 3000}`,
                ...this.generateEnvironmentVariables(envConfig)
            ],
            ExposedPorts: {
                [`${config.port || 3000}/tcp`]: {}
            },
            HostConfig: {
                Memory: this.parseMemory(envConfig.resources.memory),
                CpuQuota: this.parseCpu(envConfig.resources.cpu),
                PortBindings: {
                    [`${config.port || 3000}/tcp`]: [{
                        HostPort: String(await this.findAvailablePort())
                    }]
                },
                RestartPolicy: {
                    Name: 'unless-stopped'
                },
                Binds: [
                    `sandbox-shared:/shared`,
                    `sandbox-logs:/logs`,
                    `${process.cwd()}:/workspace:ro`
                ]
            },
            NetworkingConfig: {
                EndpointsConfig: {
                    [`sandbox-${envId}`]: {}
                }
            },
            WorkingDir: '/app',
            Cmd: config.command || ['tail', '-f', '/dev/null'],
            Labels: {
                'sandbox.environment': envId,
                'sandbox.type': type,
                'sandbox.created': new Date().toISOString()
            }
        });

        await container.start();

        // Create additional services
        const services = await this.createEnvironmentServices(envId, envConfig);

        const environment = {
            id: envId,
            type,
            containerId: container.id,
            networkId: network.id,
            services,
            status: 'running',
            created: new Date(),
            config: envConfig,
            apps: apps,
            ports: await this.getContainerPorts(container.id),
            metrics: {
                cpu: 0,
                memory: 0,
                network: 0,
                disk: 0,
                requests: 0,
                errors: 0
            },
            health: 'initializing',
            lastSync: null,
            deployments: [],
            tests: []
        };

        // Deploy initial apps if provided
        if (apps.length > 0) {
            for (const app of apps) {
                await this.deployAppToEnvironment(environment, app);
            }
        }

        // Start monitoring and health checks
        this.startEnvironmentMonitoring(environment);
        this.startHealthChecks(environment);

        return environment;
    }

    async createEnvironmentServices(envId, envConfig) {
        const services = {};

        // Create database if needed
        if (envConfig.database) {
            services.database = await this.createDatabaseService(envId, envConfig.database);
        }

        // Create Redis if needed
        if (envConfig.redis) {
            services.redis = await this.createRedisService(envId);
        }

        // Create load balancer if needed
        if (envConfig.loadBalancer) {
            services.loadBalancer = await this.createLoadBalancerService(envId);
        }

        return services;
    }

    async createDatabaseService(envId, dbConfig) {
        const dbContainer = await this.docker.createContainer({
            Image: dbConfig.image || 'postgres:15-alpine',
            name: `sandbox-${envId}-db`,
            Env: [
                `POSTGRES_DB=${dbConfig.database || 'sandbox'}`,
                `POSTGRES_USER=${dbConfig.user || 'sandbox'}`,
                `POSTGRES_PASSWORD=${dbConfig.password || 'sandbox123'}`
            ],
            HostConfig: {
                NetworkMode: `sandbox-${envId}`,
                RestartPolicy: { Name: 'unless-stopped' },
                Binds: [`sandbox-${envId}-db:/var/lib/postgresql/data`]
            },
            Labels: {
                'sandbox.environment': envId,
                'sandbox.service': 'database'
            }
        });

        await dbContainer.start();
        return { containerId: dbContainer.id, type: 'database' };
    }

    async createRedisService(envId) {
        const redisContainer = await this.docker.createContainer({
            Image: 'redis:7-alpine',
            name: `sandbox-${envId}-redis`,
            HostConfig: {
                NetworkMode: `sandbox-${envId}`,
                RestartPolicy: { Name: 'unless-stopped' },
                Binds: [`sandbox-${envId}-redis:/data`]
            },
            Labels: {
                'sandbox.environment': envId,
                'sandbox.service': 'redis'
            }
        });

        await redisContainer.start();
        return { containerId: redisContainer.id, type: 'redis' };
    }

    async createLoadBalancerService(envId) {
        const lbContainer = await this.docker.createContainer({
            Image: 'nginx:alpine',
            name: `sandbox-${envId}-lb`,
            HostConfig: {
                NetworkMode: `sandbox-${envId}`,
                RestartPolicy: { Name: 'unless-stopped' },
                PortBindings: {
                    '80/tcp': [{ HostPort: String(await this.findAvailablePort()) }]
                }
            },
            Labels: {
                'sandbox.environment': envId,
                'sandbox.service': 'loadbalancer'
            }
        });

        await container.start();
        return { containerId: lbContainer.id, type: 'loadbalancer' };
    }

    // One-Click Deployment Methods
    async promoteToProduction(req, res) {
        try {
            const { id } = req.params;
            const { 
                validate = true, 
                backup = true, 
                rollbackOnFailure = true,
                trafficSplit = false,
                splitRatio = 0.1
            } = req.body;

            const environment = this.environments.get(id);
            if (!environment) {
                return res.status(404).json({
                    success: false,
                    error: 'Environment not found'
                });
            }

            const promotionId = `promotion-${id}-${Date.now()}`;
            const spinner = ora(`Promoting ${id} to production`).start();

            // Step 1: Backup current production if requested
            let backupId = null;
            if (backup) {
                backupId = await this.backupProduction();
                spinner.text = 'Production backup completed';
            }

            // Step 2: Run validation tests if requested
            if (validate) {
                spinner.text = 'Running validation tests...';
                const validationResults = await this.runComprehensiveValidation(environment);
                if (!validationResults.success) {
                    spinner.fail('Validation tests failed');
                    return res.status(400).json({
                        success: false,
                        error: 'Validation tests failed',
                        validationResults
                    });
                }
            }

            // Step 3: Execute promotion
            spinner.text = 'Executing promotion...';
            const promotion = await this.executePromotion(environment, {
                promotionId,
                backupId,
                trafficSplit,
                splitRatio,
                rollbackOnFailure
            });

            // Step 4: Monitor promotion
            this.monitorPromotion(promotion);

            spinner.succeed(`Environment ${id} promoted to production`);
            
            this.broadcast('environment:promoted', promotion);

            res.json({
                success: true,
                promotion,
                dashboardUrl: `http://localhost:${this.config.port}/dashboard?promotion=${promotionId}`,
                rollbackUrl: `http://localhost:${this.config.port}/api/sandbox/promotions/${promotionId}/rollback`
            });
        } catch (error) {
            console.error('Promotion error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async executePromotion(environment, options) {
        const { promotionId, backupId, trafficSplit, splitRatio } = options;

        // Create promotion record
        const promotion = {
            id: promotionId,
            environmentId: environment.id,
            backupId,
            status: 'in-progress',
            startTime: new Date(),
            steps: [],
            trafficSplit,
            splitRatio
        };

        try {
            // Step 1: Prepare production environment
            promotion.steps.push({
                name: 'prepare-production',
                status: 'in-progress',
                startTime: new Date()
            });

            await this.prepareProductionEnvironment(environment);
            
            promotion.steps[promotion.steps.length - 1].status = 'completed';
            promotion.steps[promotion.steps.length - 1].endTime = new Date();

            // Step 2: Deploy to production
            promotion.steps.push({
                name: 'deploy-production',
                status: 'in-progress',
                startTime: new Date()
            });

            const deploymentResult = await this.deployToProduction(environment);
            
            promotion.steps[promotion.steps.length - 1].status = 'completed';
            promotion.steps[promotion.steps.length - 1].endTime = new Date();
            promotion.steps[promotion.steps.length - 1].result = deploymentResult;

            // Step 3: Configure traffic routing
            if (trafficSplit) {
                promotion.steps.push({
                    name: 'configure-traffic-split',
                    status: 'in-progress',
                    startTime: new Date()
                });

                await this.configureTrafficSplit(splitRatio);
                
                promotion.steps[promotion.steps.length - 1].status = 'completed';
                promotion.steps[promotion.steps.length - 1].endTime = new Date();
            }

            // Step 4: Update live system state
            this.updateLiveSystemState(environment);

            promotion.status = 'completed';
            promotion.endTime = new Date();
            promotion.productionUrl = deploymentResult.url;

        } catch (error) {
            promotion.status = 'failed';
            promotion.error = error.message;
            promotion.endTime = new Date();
            
            // Attempt rollback if enabled
            if (options.rollbackOnFailure) {
                await this.rollbackPromotion(promotion);
            }
        }

        return promotion;
    }

    // Utility Methods
    generateSubnet() {
        const baseSubnet = '172.30';
        const randomSubnet = Math.floor(Math.random() * 254) + 1;
        return `${baseSubnet}.${randomSubnet}.0/24`;
    }

    generateGateway() {
        const baseGateway = '172.30';
        const randomGateway = Math.floor(Math.random() * 254) + 1;
        return `${baseGateway}.${randomGateway}.1`;
    }

    generateEnvironmentVariables(envConfig) {
        const vars = [];
        
        if (envConfig.database) {
            vars.push('DATABASE_URL=postgresql://sandbox:sandbox123@db:5432/sandbox');
        }
        
        if (envConfig.redis) {
            vars.push('REDIS_URL=redis://redis:6379');
        }
        
        return vars;
    }

    async findAvailablePort() {
        const net = require('net');
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            server.listen(0, () => {
                const port = server.address().port;
                server.close(() => resolve(port));
            });
            server.on('error', reject);
        });
    }

    parseMemory(memoryStr) {
        const units = { 'b': 1, 'k': 1024, 'm': 1024 * 1024, 'g': 1024 * 1024 * 1024 };
        const match = memoryStr.toLowerCase().match(/^(\d+)([bkmg]?)$/);
        if (!match) return 512 * 1024 * 1024; // Default 512MB
        return parseInt(match[1]) * (units[match[2]] || 1);
    }

    parseCpu(cpuStr) {
        const cpuFloat = parseFloat(cpuStr);
        return Math.floor(cpuFloat * 100000); // Convert to CPU quota
    }

    async getContainerPorts(containerId) {
        try {
            const container = this.docker.getContainer(containerId);
            const info = await container.inspect();
            return info.NetworkSettings.Ports || {};
        } catch (error) {
            return {};
        }
    }

    // Monitoring Methods
    startEnvironmentMonitoring(environment) {
        const monitoringInterval = setInterval(async () => {
            try {
                const metrics = await this.collectEnvironmentMetrics(environment);
                environment.metrics = metrics;
                
                // Broadcast metrics to connected clients
                this.broadcast('environment:metrics', {
                    environmentId: environment.id,
                    metrics,
                    timestamp: new Date()
                });
                
                // Check for alerts
                this.checkAlerts(environment, metrics);
                
            } catch (error) {
                console.error(`Monitoring error for ${environment.id}:`, error);
            }
        }, this.config.monitoring.interval);

        environment.monitoringInterval = monitoringInterval;
    }

    async collectEnvironmentMetrics(environment) {
        try {
            const container = this.docker.getContainer(environment.containerId);
            const stats = await container.stats({ stream: false });
            
            return {
                cpu: this.calculateCpuUsage(stats),
                memory: this.calculateMemoryUsage(stats),
                network: this.calculateNetworkUsage(stats),
                disk: this.calculateDiskUsage(stats),
                requests: environment.metrics.requests || 0,
                errors: environment.metrics.errors || 0,
                timestamp: new Date()
            };
        } catch (error) {
            return environment.metrics;
        }
    }

    calculateCpuUsage(stats) {
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.cpu_usage.percpu_usage.length * 100;
        return Math.round(cpuPercent * 100) / 100;
    }

    calculateMemoryUsage(stats) {
        const memoryUsage = stats.memory_stats.usage;
        const memoryLimit = stats.memory_stats.limit;
        return Math.round((memoryUsage / memoryLimit) * 100 * 100) / 100;
    }

    calculateNetworkUsage(stats) {
        let totalBytes = 0;
        if (stats.networks) {
            Object.values(stats.networks).forEach(network => {
                totalBytes += network.rx_bytes + network.tx_bytes;
            });
        }
        return totalBytes;
    }

    calculateDiskUsage(stats) {
        let totalBytes = 0;
        if (stats.blkio_stats && stats.blkio_stats.io_service_bytes_recursive) {
            stats.blkio_stats.io_service_bytes_recursive.forEach(stat => {
                totalBytes += stat.value;
            });
        }
        return totalBytes;
    }

    checkAlerts(environment, metrics) {
        const alerts = [];
        
        if (metrics.cpu > this.config.monitoring.alerts.cpu) {
            alerts.push({
                type: 'cpu',
                level: 'warning',
                message: `High CPU usage: ${metrics.cpu}%`,
                threshold: this.config.monitoring.alerts.cpu
            });
        }
        
        if (metrics.memory > this.config.monitoring.alerts.memory) {
            alerts.push({
                type: 'memory',
                level: 'warning',
                message: `High memory usage: ${metrics.memory}%`,
                threshold: this.config.monitoring.alerts.memory
            });
        }
        
        if (alerts.length > 0) {
            this.broadcast('environment:alerts', {
                environmentId: environment.id,
                alerts,
                timestamp: new Date()
            });
        }
    }

    // Cleanup and shutdown
    async shutdown() {
        console.log(chalk.yellow('🔄 Shutting down Sandbox Manager...'));
        
        // Clear all monitoring intervals
        this.environments.forEach(env => {
            if (env.monitoringInterval) {
                clearInterval(env.monitoringInterval);
            }
        });
        
        // Close WebSocket server
        if (this.wss) {
            this.wss.close();
        }
        
        // Close HTTP server
        if (this.server) {
            this.server.close();
        }
        
        console.log(chalk.green('✅ Sandbox Manager shutdown complete'));
    }
}

// CLI Interface
if (require.main === module) {
    const manager = new AdvancedSandboxManager();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        await manager.shutdown();
        process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
        await manager.shutdown();
        process.exit(0);
    });
}

module.exports = AdvancedSandboxManager;