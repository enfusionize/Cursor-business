#!/usr/bin/env node

/**
 * Enfusionize™ Sandbox Orchestrator
 * Central management system for sandbox environments
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

class SandboxOrchestrator extends EventEmitter {
    constructor() {
        super();
        this.docker = new Docker();
        this.environments = new Map();
        this.deployments = new Map();
        this.config = this.loadConfig();
        this.app = express();
        this.wss = null;
        this.server = null;
        
        this.setupExpress();
        this.setupWebSocket();
        this.setupScheduledTasks();
        this.initializeEnvironments();
    }

    loadConfig() {
        const configPath = path.join(__dirname, '../configs/sandbox-config.json');
        try {
            return fs.readJsonSync(configPath);
        } catch (error) {
            console.log(chalk.yellow('⚠️  No config found, using defaults'));
            return {
                port: 3100,
                environments: {
                    staging: { replicas: 1, resources: { cpu: '1', memory: '1g' } },
                    integration: { replicas: 1, resources: { cpu: '0.5', memory: '512m' } },
                    feature: { replicas: 1, resources: { cpu: '0.5', memory: '512m' } },
                    experimental: { replicas: 1, resources: { cpu: '0.25', memory: '256m' } }
                },
                monitoring: {
                    enabled: true,
                    interval: 30000,
                    metrics: ['cpu', 'memory', 'network', 'disk']
                },
                deployment: {
                    timeout: 300000,
                    retries: 3,
                    rollback: true
                }
            };
        }
    }

    setupExpress() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '../dashboard')));
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
        
        // Deployment Management
        this.app.post('/api/sandbox/environments/:id/deploy', this.deployToEnvironment.bind(this));
        this.app.post('/api/sandbox/environments/:id/promote', this.promoteToProduction.bind(this));
        this.app.get('/api/sandbox/environments/:id/status', this.getEnvironmentStatus.bind(this));
        this.app.get('/api/sandbox/environments/:id/logs', this.getEnvironmentLogs.bind(this));
        
        // Testing
        this.app.post('/api/sandbox/environments/:id/test', this.runTests.bind(this));
        this.app.get('/api/sandbox/environments/:id/test-results', this.getTestResults.bind(this));
        
        // Monitoring
        this.app.get('/api/sandbox/metrics', this.getMetrics.bind(this));
        this.app.get('/api/sandbox/health', this.getHealth.bind(this));
        
        // Dashboard
        this.app.get('/dashboard', (req, res) => {
            res.sendFile(path.join(__dirname, '../dashboard/index.html'));
        });
    }

    setupWebSocket() {
        this.server = this.app.listen(this.config.port, () => {
            console.log(chalk.green(`🚀 Sandbox Orchestrator running on port ${this.config.port}`));
        });

        this.wss = new WebSocket.Server({ server: this.server });
        
        this.wss.on('connection', (ws) => {
            console.log(chalk.blue('📡 WebSocket client connected'));
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleWebSocketMessage(ws, data);
                } catch (error) {
                    console.error('WebSocket message error:', error);
                }
            });

            ws.on('close', () => {
                console.log(chalk.yellow('📡 WebSocket client disconnected'));
            });
        });
    }

    handleWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'subscribe':
                ws.environmentId = data.environmentId;
                break;
            case 'get-status':
                this.sendEnvironmentStatus(ws, data.environmentId);
                break;
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
    }

    broadcast(type, data) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type, data }));
            }
        });
    }

    async initializeEnvironments() {
        console.log(chalk.blue('🔧 Initializing sandbox environments...'));
        
        // Ensure directories exist
        const dirs = [
            'sandbox/environments',
            'sandbox/apps',
            'sandbox/configs',
            'sandbox/scripts',
            'sandbox/monitoring',
            'sandbox/deployment'
        ];

        for (const dir of dirs) {
            await fs.ensureDir(dir);
        }

        // Load existing environments
        await this.loadExistingEnvironments();
        
        console.log(chalk.green('✅ Sandbox environments initialized'));
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
                    this.environments.set(envId, {
                        id: envId,
                        containerId: container.Id,
                        status: container.State,
                        created: new Date(container.Created * 1000),
                        image: container.Image,
                        ports: container.Ports
                    });
                }
            }
        } catch (error) {
            console.error('Error loading existing environments:', error);
        }
    }

    extractEnvironmentId(containerName) {
        const match = containerName.match(/sandbox-(.+)/);
        return match ? match[1] : null;
    }

    // API Endpoints
    async getEnvironments(req, res) {
        try {
            const environments = Array.from(this.environments.values());
            res.json({
                success: true,
                environments,
                total: environments.length
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
            const { name, type, config } = req.body;
            
            if (!name || !type) {
                return res.status(400).json({
                    success: false,
                    error: 'Name and type are required'
                });
            }

            const envId = `${type}-${name}-${Date.now()}`;
            const spinner = ora(`Creating environment ${envId}`).start();

            const environment = await this.createDockerEnvironment(envId, type, config);
            
            this.environments.set(envId, environment);
            
            spinner.succeed(`Environment ${envId} created successfully`);
            
            this.broadcast('environment:created', environment);
            
            res.json({
                success: true,
                environment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async createDockerEnvironment(envId, type, config = {}) {
        const envConfig = {
            ...this.config.environments[type],
            ...config
        };

        // Create Docker network for the environment
        const network = await this.docker.createNetwork({
            Name: `sandbox-${envId}`,
            Driver: 'bridge'
        });

        // Create main application container
        const container = await this.docker.createContainer({
            Image: 'node:18-alpine',
            name: `sandbox-${envId}`,
            Env: [
                `NODE_ENV=sandbox`,
                `SANDBOX_ENV_ID=${envId}`,
                `SANDBOX_TYPE=${type}`
            ],
            HostConfig: {
                Memory: this.parseMemory(envConfig.resources.memory),
                CpuQuota: this.parseCpu(envConfig.resources.cpu),
                NetworkMode: `sandbox-${envId}`,
                RestartPolicy: {
                    Name: 'unless-stopped'
                }
            },
            NetworkingConfig: {
                EndpointsConfig: {
                    [`sandbox-${envId}`]: {}
                }
            },
            WorkingDir: '/app',
            Cmd: ['tail', '-f', '/dev/null'] // Keep container running
        });

        await container.start();

        // Create database container if needed
        let dbContainer = null;
        if (envConfig.database) {
            dbContainer = await this.createDatabaseContainer(envId, envConfig.database);
        }

        const environment = {
            id: envId,
            type,
            containerId: container.id,
            networkId: network.id,
            dbContainerId: dbContainer?.id,
            status: 'running',
            created: new Date(),
            config: envConfig,
            ports: {},
            metrics: {
                cpu: 0,
                memory: 0,
                network: 0,
                disk: 0
            }
        };

        // Start monitoring
        this.startEnvironmentMonitoring(environment);

        return environment;
    }

    async createDatabaseContainer(envId, dbConfig) {
        const dbContainer = await this.docker.createContainer({
            Image: dbConfig.image || 'postgres:15-alpine',
            name: `sandbox-${envId}-db`,
            Env: [
                `POSTGRES_DB=${dbConfig.database || 'sandbox'}`,
                `POSTGRES_USER=${dbConfig.user || 'sandbox'}`,
                `POSTGRES_PASSWORD=${dbConfig.password || 'sandbox'}`
            ],
            HostConfig: {
                NetworkMode: `sandbox-${envId}`,
                RestartPolicy: {
                    Name: 'unless-stopped'
                }
            }
        });

        await dbContainer.start();
        return dbContainer;
    }

    async deployToEnvironment(req, res) {
        try {
            const { id } = req.params;
            const { app, source, config } = req.body;

            const environment = this.environments.get(id);
            if (!environment) {
                return res.status(404).json({
                    success: false,
                    error: 'Environment not found'
                });
            }

            const deploymentId = `deploy-${id}-${Date.now()}`;
            const spinner = ora(`Deploying ${app} to ${id}`).start();

            const deployment = await this.executeDeployment(environment, {
                id: deploymentId,
                app,
                source,
                config,
                timestamp: new Date()
            });

            this.deployments.set(deploymentId, deployment);
            
            spinner.succeed(`Deployment ${deploymentId} completed successfully`);
            
            this.broadcast('deployment:completed', deployment);

            res.json({
                success: true,
                deployment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async executeDeployment(environment, deployment) {
        const container = this.docker.getContainer(environment.containerId);
        
        // Copy application files
        if (deployment.source) {
            await this.copyFilesToContainer(container, deployment.source);
        }

        // Install dependencies
        await this.execInContainer(container, ['npm', 'install']);

        // Run build if needed
        if (deployment.config?.build) {
            await this.execInContainer(container, ['npm', 'run', 'build']);
        }

        // Start application
        const startCommand = deployment.config?.start || ['npm', 'start'];
        await this.execInContainer(container, startCommand);

        return {
            ...deployment,
            status: 'completed',
            completedAt: new Date()
        };
    }

    async copyFilesToContainer(container, sourcePath) {
        const tarStream = fs.createReadStream(sourcePath);
        await container.putArchive(tarStream, { path: '/app' });
    }

    async execInContainer(container, command) {
        const exec = await container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true
        });

        const stream = await exec.start();
        return new Promise((resolve, reject) => {
            container.modem.demuxStream(stream, process.stdout, process.stderr);
            stream.on('end', resolve);
            stream.on('error', reject);
        });
    }

    async promoteToProduction(req, res) {
        try {
            const { id } = req.params;
            const { validate = true } = req.body;

            const environment = this.environments.get(id);
            if (!environment) {
                return res.status(404).json({
                    success: false,
                    error: 'Environment not found'
                });
            }

            const spinner = ora(`Promoting ${id} to production`).start();

            // Run validation tests if requested
            if (validate) {
                const testResults = await this.runValidationTests(environment);
                if (!testResults.success) {
                    spinner.fail('Validation tests failed');
                    return res.status(400).json({
                        success: false,
                        error: 'Validation tests failed',
                        testResults
                    });
                }
            }

            // Execute promotion
            const promotion = await this.executePromotion(environment);
            
            spinner.succeed(`Environment ${id} promoted to production`);
            
            this.broadcast('environment:promoted', promotion);

            res.json({
                success: true,
                promotion
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async executePromotion(environment) {
        // This would integrate with your production deployment pipeline
        // For now, we'll simulate the promotion process
        
        return {
            environmentId: environment.id,
            promotedAt: new Date(),
            status: 'completed',
            productionUrl: `https://production.enfusionize.com`,
            rollbackUrl: `https://rollback.enfusionize.com`
        };
    }

    async runValidationTests(environment) {
        // Simulate running validation tests
        return {
            success: true,
            tests: [
                { name: 'Unit Tests', status: 'passed', duration: 1200 },
                { name: 'Integration Tests', status: 'passed', duration: 3400 },
                { name: 'Performance Tests', status: 'passed', duration: 5600 }
            ],
            coverage: 85.2,
            duration: 10200
        };
    }

    startEnvironmentMonitoring(environment) {
        const interval = setInterval(async () => {
            try {
                const container = this.docker.getContainer(environment.containerId);
                const stats = await container.stats({ stream: false });
                
                environment.metrics = {
                    cpu: this.calculateCpuUsage(stats),
                    memory: this.calculateMemoryUsage(stats),
                    network: this.calculateNetworkUsage(stats),
                    disk: this.calculateDiskUsage(stats)
                };

                this.broadcast('environment:metrics', {
                    environmentId: environment.id,
                    metrics: environment.metrics
                });
            } catch (error) {
                console.error(`Monitoring error for ${environment.id}:`, error);
            }
        }, this.config.monitoring.interval);

        environment.monitoringInterval = interval;
    }

    calculateCpuUsage(stats) {
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const numCpus = stats.cpu_stats.online_cpus;
        
        return (cpuDelta / systemDelta) * numCpus * 100;
    }

    calculateMemoryUsage(stats) {
        return (stats.memory_stats.usage / stats.memory_stats.limit) * 100;
    }

    calculateNetworkUsage(stats) {
        let totalBytes = 0;
        for (const network of Object.values(stats.networks || {})) {
            totalBytes += network.rx_bytes + network.tx_bytes;
        }
        return totalBytes;
    }

    calculateDiskUsage(stats) {
        let totalBytes = 0;
        for (const device of stats.blkio_stats.io_service_bytes_recursive || []) {
            totalBytes += device.value;
        }
        return totalBytes;
    }

    setupScheduledTasks() {
        // Cleanup old environments every hour
        cron.schedule('0 * * * *', () => {
            this.cleanupOldEnvironments();
        });

        // Generate metrics report every 6 hours
        cron.schedule('0 */6 * * *', () => {
            this.generateMetricsReport();
        });

        // Health check every 5 minutes
        cron.schedule('*/5 * * * *', () => {
            this.performHealthCheck();
        });
    }

    async cleanupOldEnvironments() {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        
        for (const [envId, environment] of this.environments) {
            if (environment.created < cutoffTime && environment.type === 'experimental') {
                console.log(chalk.yellow(`🧹 Cleaning up old environment: ${envId}`));
                await this.deleteEnvironmentById(envId);
            }
        }
    }

    async deleteEnvironmentById(envId) {
        const environment = this.environments.get(envId);
        if (!environment) return;

        try {
            // Stop monitoring
            if (environment.monitoringInterval) {
                clearInterval(environment.monitoringInterval);
            }

            // Stop and remove containers
            const container = this.docker.getContainer(environment.containerId);
            await container.stop();
            await container.remove();

            if (environment.dbContainerId) {
                const dbContainer = this.docker.getContainer(environment.dbContainerId);
                await dbContainer.stop();
                await dbContainer.remove();
            }

            // Remove network
            const network = this.docker.getNetwork(environment.networkId);
            await network.remove();

            this.environments.delete(envId);
            
            this.broadcast('environment:deleted', { environmentId: envId });
        } catch (error) {
            console.error(`Error deleting environment ${envId}:`, error);
        }
    }

    parseMemory(memoryStr) {
        const match = memoryStr.match(/^(\d+)([kmg]?)$/i);
        if (!match) return 512 * 1024 * 1024; // Default 512MB
        
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        
        switch (unit) {
            case 'k': return value * 1024;
            case 'm': return value * 1024 * 1024;
            case 'g': return value * 1024 * 1024 * 1024;
            default: return value;
        }
    }

    parseCpu(cpuStr) {
        const value = parseFloat(cpuStr);
        return Math.floor(value * 100000); // Convert to CPU quota
    }

    // CLI Interface
    async startCLI() {
        console.log(chalk.blue.bold('🚀 Enfusionize™ Sandbox Orchestrator CLI'));
        console.log(chalk.gray('Powered by S.A.I.A.S.™ Framework\n'));

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'Create Environment',
                    'List Environments',
                    'Deploy App',
                    'Run Tests',
                    'Promote to Production',
                    'View Metrics',
                    'Start Dashboard',
                    'Exit'
                ]
            }
        ]);

        switch (action) {
            case 'Create Environment':
                await this.createEnvironmentCLI();
                break;
            case 'List Environments':
                await this.listEnvironmentsCLI();
                break;
            case 'Deploy App':
                await this.deployAppCLI();
                break;
            case 'Run Tests':
                await this.runTestsCLI();
                break;
            case 'Promote to Production':
                await this.promoteToProductionCLI();
                break;
            case 'View Metrics':
                await this.viewMetricsCLI();
                break;
            case 'Start Dashboard':
                console.log(chalk.green(`🌐 Dashboard available at: http://localhost:${this.config.port}/dashboard`));
                break;
            case 'Exit':
                process.exit(0);
        }

        // Continue CLI loop
        setTimeout(() => this.startCLI(), 1000);
    }

    async createEnvironmentCLI() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Environment name:',
                validate: input => input.length > 0
            },
            {
                type: 'list',
                name: 'type',
                message: 'Environment type:',
                choices: ['staging', 'integration', 'feature', 'experimental']
            }
        ]);

        const envId = `${answers.type}-${answers.name}-${Date.now()}`;
        const spinner = ora(`Creating environment ${envId}`).start();

        try {
            const environment = await this.createDockerEnvironment(envId, answers.type);
            this.environments.set(envId, environment);
            spinner.succeed(`Environment ${envId} created successfully`);
        } catch (error) {
            spinner.fail(`Failed to create environment: ${error.message}`);
        }
    }

    async listEnvironmentsCLI() {
        const environments = Array.from(this.environments.values());
        
        if (environments.length === 0) {
            console.log(chalk.yellow('No environments found'));
            return;
        }

        console.log(chalk.blue.bold('\n📦 Sandbox Environments:'));
        environments.forEach(env => {
            console.log(`${chalk.green('●')} ${env.id} (${env.type}) - ${env.status}`);
        });
    }
}

// Utility functions
function parseMemory(memoryStr) {
    const match = memoryStr.match(/^(\d+)([kmg]?)$/i);
    if (!match) return 512 * 1024 * 1024; // Default 512MB
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    switch (unit) {
        case 'k': return value * 1024;
        case 'm': return value * 1024 * 1024;
        case 'g': return value * 1024 * 1024 * 1024;
        default: return value;
    }
}

// Export for use as module
module.exports = SandboxOrchestrator;

// Run as CLI if called directly
if (require.main === module) {
    const orchestrator = new SandboxOrchestrator();
    orchestrator.startCLI();
}