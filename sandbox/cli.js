#!/usr/bin/env node

/**
 * Enfusionize™ Sandbox CLI
 * Command-line interface for sandbox management and one-click deployments
 * Powered by S.A.I.A.S.™ Framework
 */

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const Table = require('cli-table3');
const fs = require('fs-extra');
const path = require('path');
const AdvancedSandboxManager = require('./sandbox-manager');
const OneClickDeployment = require('./one-click-deployment');

const program = new Command();

class SandboxCLI {
    constructor() {
        this.sandboxManager = null;
        this.oneClickDeployment = null;
        this.setupCommands();
    }

    async initialize() {
        if (!this.sandboxManager) {
            console.log(chalk.blue('🔧 Initializing Sandbox Manager...'));
            this.sandboxManager = new AdvancedSandboxManager();
            this.oneClickDeployment = new OneClickDeployment(this.sandboxManager);
            
            // Wait for initialization
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    setupCommands() {
        program
            .name('sandbox')
            .description('Enfusionize™ Advanced Sandbox Management CLI')
            .version('1.0.0');

        // Environment Management Commands
        program
            .command('create')
            .description('Create a new sandbox environment')
            .option('-n, --name <name>', 'Environment name')
            .option('-t, --type <type>', 'Environment type (staging, integration, feature, experimental)')
            .option('-i, --interactive', 'Interactive mode')
            .action(this.createEnvironment.bind(this));

        program
            .command('list')
            .alias('ls')
            .description('List all sandbox environments')
            .option('-f, --format <format>', 'Output format (table, json, yaml)', 'table')
            .option('-s, --status <status>', 'Filter by status')
            .action(this.listEnvironments.bind(this));

        program
            .command('status <environmentId>')
            .description('Get detailed status of an environment')
            .option('-w, --watch', 'Watch mode (continuous updates)')
            .action(this.getEnvironmentStatus.bind(this));

        program
            .command('delete <environmentId>')
            .description('Delete a sandbox environment')
            .option('-f, --force', 'Force deletion without confirmation')
            .action(this.deleteEnvironment.bind(this));

        // Deployment Commands
        program
            .command('deploy <environmentId>')
            .description('Deploy application to sandbox environment')
            .option('-a, --app <app>', 'Application to deploy')
            .option('-s, --source <source>', 'Source path or URL')
            .option('-c, --config <config>', 'Configuration file')
            .action(this.deployToEnvironment.bind(this));

        program
            .command('promote <environmentId>')
            .description('One-click promotion to production')
            .option('-s, --strategy <strategy>', 'Deployment strategy (blue-green, canary, rolling)', 'blue-green')
            .option('-v, --validation <suite>', 'Validation suite (comprehensive, quick, security)', 'comprehensive')
            .option('--no-backup', 'Skip production backup')
            .option('--no-validate', 'Skip validation tests')
            .option('--traffic-split', 'Enable traffic splitting')
            .option('--split-ratio <ratio>', 'Traffic split ratio', '0.1')
            .action(this.promoteToProduction.bind(this));

        program
            .command('rollback <deploymentId>')
            .description('Rollback a deployment')
            .option('-f, --force', 'Force rollback without confirmation')
            .action(this.rollbackDeployment.bind(this));

        // Testing Commands
        program
            .command('test <environmentId>')
            .description('Run tests on sandbox environment')
            .option('-s, --suite <suite>', 'Test suite to run')
            .option('-t, --type <type>', 'Test type (unit, integration, e2e, performance, security)')
            .action(this.runTests.bind(this));

        program
            .command('validate <environmentId>')
            .description('Run validation suite on environment')
            .option('-s, --suite <suite>', 'Validation suite (comprehensive, quick, security)', 'comprehensive')
            .action(this.validateEnvironment.bind(this));

        // Monitoring Commands
        program
            .command('logs <environmentId>')
            .description('View environment logs')
            .option('-f, --follow', 'Follow log output')
            .option('-t, --tail <lines>', 'Number of lines to show', '100')
            .action(this.viewLogs.bind(this));

        program
            .command('metrics <environmentId>')
            .description('View environment metrics')
            .option('-w, --watch', 'Watch mode (continuous updates)')
            .option('-i, --interval <seconds>', 'Update interval in seconds', '5')
            .action(this.viewMetrics.bind(this));

        // Bulk Operations
        program
            .command('bulk-create')
            .description('Create multiple environments')
            .option('-c, --config <config>', 'Configuration file')
            .option('-i, --interactive', 'Interactive mode')
            .action(this.bulkCreateEnvironments.bind(this));

        program
            .command('bulk-deploy')
            .description('Deploy to multiple environments')
            .option('-e, --environments <environments>', 'Comma-separated environment IDs')
            .option('-a, --app <app>', 'Application to deploy')
            .action(this.bulkDeploy.bind(this));

        program
            .command('cleanup')
            .description('Clean up old or unused environments')
            .option('-d, --days <days>', 'Delete environments older than N days', '7')
            .option('-f, --force', 'Force cleanup without confirmation')
            .action(this.cleanupEnvironments.bind(this));

        // Configuration Commands
        program
            .command('config')
            .description('Manage sandbox configuration')
            .option('-s, --show', 'Show current configuration')
            .option('-e, --edit', 'Edit configuration')
            .option('-r, --reset', 'Reset to default configuration')
            .action(this.manageConfig.bind(this));

        // Interactive Mode
        program
            .command('interactive')
            .alias('i')
            .description('Start interactive mode')
            .action(this.interactiveMode.bind(this));

        // Dashboard
        program
            .command('dashboard')
            .description('Open web dashboard')
            .option('-p, --port <port>', 'Dashboard port', '3100')
            .action(this.openDashboard.bind(this));
    }

    async createEnvironment(options) {
        await this.initialize();

        let { name, type, interactive } = options;

        if (interactive || (!name || !type)) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Environment name:',
                    default: name,
                    validate: (input) => input.length > 0 || 'Name is required'
                },
                {
                    type: 'list',
                    name: 'type',
                    message: 'Environment type:',
                    choices: [
                        { name: 'Staging - Production-like environment', value: 'staging' },
                        { name: 'Integration - API integration testing', value: 'integration' },
                        { name: 'Feature - Individual feature testing', value: 'feature' },
                        { name: 'Experimental - Research and development', value: 'experimental' }
                    ],
                    default: type
                },
                {
                    type: 'confirm',
                    name: 'database',
                    message: 'Include database?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'redis',
                    message: 'Include Redis?',
                    default: false
                },
                {
                    type: 'confirm',
                    name: 'loadBalancer',
                    message: 'Include load balancer?',
                    default: false
                }
            ]);

            name = answers.name;
            type = answers.type;
            options = { ...options, ...answers };
        }

        const spinner = ora(`Creating ${type} environment: ${name}`).start();

        try {
            const environment = await this.sandboxManager.createAdvancedEnvironment(
                `${type}-${name}-${Date.now()}`,
                type,
                options
            );

            spinner.succeed(`Environment created successfully: ${environment.id}`);
            
            console.log(chalk.green('\n✅ Environment Details:'));
            console.log(`   ID: ${environment.id}`);
            console.log(`   Type: ${environment.type}`);
            console.log(`   Status: ${environment.status}`);
            console.log(`   Dashboard: http://localhost:3100/dashboard?env=${environment.id}`);
            
            if (environment.ports && Object.keys(environment.ports).length > 0) {
                console.log(`   Ports: ${Object.entries(environment.ports).map(([port, bindings]) => 
                    `${port} -> ${bindings[0]?.HostPort}`).join(', ')}`);
            }

        } catch (error) {
            spinner.fail(`Failed to create environment: ${error.message}`);
            process.exit(1);
        }
    }

    async listEnvironments(options) {
        await this.initialize();

        const spinner = ora('Fetching environments').start();

        try {
            const environments = Array.from(this.sandboxManager.environments.values());
            
            if (options.status) {
                environments = environments.filter(env => env.status === options.status);
            }

            spinner.stop();

            if (environments.length === 0) {
                console.log(chalk.yellow('No environments found'));
                return;
            }

            switch (options.format) {
                case 'json':
                    console.log(JSON.stringify(environments, null, 2));
                    break;
                case 'yaml':
                    const yaml = require('js-yaml');
                    console.log(yaml.dump(environments));
                    break;
                default:
                    this.displayEnvironmentsTable(environments);
            }

        } catch (error) {
            spinner.fail(`Failed to list environments: ${error.message}`);
            process.exit(1);
        }
    }

    displayEnvironmentsTable(environments) {
        const table = new Table({
            head: ['ID', 'Type', 'Status', 'Created', 'CPU', 'Memory', 'Health'],
            colWidths: [30, 12, 10, 12, 8, 8, 10]
        });

        environments.forEach(env => {
            const age = this.getRelativeTime(env.created);
            const cpu = env.metrics?.cpu ? `${env.metrics.cpu.toFixed(1)}%` : 'N/A';
            const memory = env.metrics?.memory ? `${env.metrics.memory.toFixed(1)}%` : 'N/A';
            const health = this.getHealthIcon(env.health);

            table.push([
                env.id,
                env.type,
                this.getStatusIcon(env.status),
                age,
                cpu,
                memory,
                health
            ]);
        });

        console.log(table.toString());
    }

    async getEnvironmentStatus(environmentId, options) {
        await this.initialize();

        const environment = this.sandboxManager.environments.get(environmentId);
        if (!environment) {
            console.log(chalk.red(`Environment ${environmentId} not found`));
            process.exit(1);
        }

        if (options.watch) {
            console.log(chalk.blue(`Watching environment ${environmentId} (Press Ctrl+C to stop)`));
            
            const displayStatus = () => {
                console.clear();
                this.displayEnvironmentStatus(environment);
            };

            displayStatus();
            const interval = setInterval(displayStatus, 2000);

            process.on('SIGINT', () => {
                clearInterval(interval);
                console.log(chalk.yellow('\nStopped watching'));
                process.exit(0);
            });
        } else {
            this.displayEnvironmentStatus(environment);
        }
    }

    displayEnvironmentStatus(environment) {
        console.log(chalk.blue(`\n📊 Environment Status: ${environment.id}`));
        console.log('─'.repeat(60));
        
        const table = new Table({
            colWidths: [20, 40]
        });

        table.push(
            ['ID', environment.id],
            ['Type', environment.type],
            ['Status', this.getStatusIcon(environment.status)],
            ['Health', this.getHealthIcon(environment.health)],
            ['Created', environment.created.toLocaleString()],
            ['CPU Usage', environment.metrics?.cpu ? `${environment.metrics.cpu.toFixed(1)}%` : 'N/A'],
            ['Memory Usage', environment.metrics?.memory ? `${environment.metrics.memory.toFixed(1)}%` : 'N/A'],
            ['Network I/O', environment.metrics?.network ? this.formatBytes(environment.metrics.network) : 'N/A'],
            ['Disk I/O', environment.metrics?.disk ? this.formatBytes(environment.metrics.disk) : 'N/A']
        );

        console.log(table.toString());

        if (environment.services && Object.keys(environment.services).length > 0) {
            console.log(chalk.blue('\n🔧 Services:'));
            Object.entries(environment.services).forEach(([name, service]) => {
                console.log(`   ${name}: ${service.type}`);
            });
        }

        if (environment.ports && Object.keys(environment.ports).length > 0) {
            console.log(chalk.blue('\n🌐 Port Mappings:'));
            Object.entries(environment.ports).forEach(([port, bindings]) => {
                if (bindings && bindings.length > 0) {
                    console.log(`   ${port} -> localhost:${bindings[0].HostPort}`);
                }
            });
        }
    }

    async promoteToProduction(environmentId, options) {
        await this.initialize();

        const environment = this.sandboxManager.environments.get(environmentId);
        if (!environment) {
            console.log(chalk.red(`Environment ${environmentId} not found`));
            process.exit(1);
        }

        console.log(chalk.blue(`\n🚀 Promoting ${environmentId} to Production`));
        console.log('─'.repeat(60));
        
        const deploymentOptions = {
            strategy: options.strategy,
            validationSuite: options.validation,
            backup: options.backup,
            validate: options.validate,
            trafficSplit: options.trafficSplit,
            splitRatio: parseFloat(options.splitRatio)
        };

        console.log(chalk.blue('Deployment Configuration:'));
        console.log(`   Strategy: ${deploymentOptions.strategy}`);
        console.log(`   Validation: ${deploymentOptions.validationSuite}`);
        console.log(`   Backup: ${deploymentOptions.backup ? 'Yes' : 'No'}`);
        console.log(`   Validate: ${deploymentOptions.validate ? 'Yes' : 'No'}`);
        
        if (deploymentOptions.trafficSplit) {
            console.log(`   Traffic Split: ${(deploymentOptions.splitRatio * 100).toFixed(1)}%`);
        }

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Proceed with promotion?',
                default: false
            }
        ]);

        if (!confirm) {
            console.log(chalk.yellow('Promotion cancelled'));
            return;
        }

        try {
            const deployment = await this.oneClickDeployment.deployEnvironment(environmentId, deploymentOptions);
            
            console.log(chalk.green(`\n✅ Promotion completed successfully!`));
            console.log(`   Deployment ID: ${deployment.id}`);
            console.log(`   Duration: ${deployment.duration}ms`);
            console.log(`   Dashboard: http://localhost:3100/dashboard?promotion=${deployment.id}`);
            
            if (deployment.productionUrl) {
                console.log(`   Production URL: ${deployment.productionUrl}`);
            }

        } catch (error) {
            console.log(chalk.red(`❌ Promotion failed: ${error.message}`));
            process.exit(1);
        }
    }

    async interactiveMode() {
        await this.initialize();

        console.log(chalk.blue('🎛️  Enfusionize™ Sandbox Interactive Mode'));
        console.log(chalk.gray('Select an operation to perform:'));

        while (true) {
            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        { name: '📦 Create Environment', value: 'create' },
                        { name: '📋 List Environments', value: 'list' },
                        { name: '📊 View Environment Status', value: 'status' },
                        { name: '🚀 Deploy Application', value: 'deploy' },
                        { name: '⬆️  Promote to Production', value: 'promote' },
                        { name: '🧪 Run Tests', value: 'test' },
                        { name: '📈 View Metrics', value: 'metrics' },
                        { name: '🗑️  Delete Environment', value: 'delete' },
                        { name: '🔧 Manage Configuration', value: 'config' },
                        { name: '🌐 Open Dashboard', value: 'dashboard' },
                        new inquirer.Separator(),
                        { name: '❌ Exit', value: 'exit' }
                    ]
                }
            ]);

            if (action === 'exit') {
                console.log(chalk.yellow('Goodbye!'));
                break;
            }

            try {
                await this.handleInteractiveAction(action);
            } catch (error) {
                console.log(chalk.red(`Error: ${error.message}`));
            }

            console.log(); // Add spacing
        }
    }

    async handleInteractiveAction(action) {
        switch (action) {
            case 'create':
                await this.createEnvironment({ interactive: true });
                break;
            case 'list':
                await this.listEnvironments({ format: 'table' });
                break;
            case 'status':
                const environments = Array.from(this.sandboxManager.environments.keys());
                if (environments.length === 0) {
                    console.log(chalk.yellow('No environments found'));
                    return;
                }
                const { envId } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'envId',
                        message: 'Select environment:',
                        choices: environments
                    }
                ]);
                await this.getEnvironmentStatus(envId, {});
                break;
            case 'dashboard':
                await this.openDashboard({});
                break;
            default:
                console.log(chalk.yellow(`Action ${action} not implemented yet`));
        }
    }

    async openDashboard(options) {
        await this.initialize();

        const port = options.port || 3100;
        const url = `http://localhost:${port}/dashboard`;
        
        console.log(chalk.blue(`Opening dashboard at ${url}`));
        
        const open = require('open');
        await open(url);
    }

    // Utility methods
    getStatusIcon(status) {
        const icons = {
            'running': chalk.green('●'),
            'stopped': chalk.red('●'),
            'exited': chalk.gray('●'),
            'paused': chalk.yellow('●'),
            'restarting': chalk.blue('●')
        };
        return icons[status] || chalk.gray('●');
    }

    getHealthIcon(health) {
        const icons = {
            'healthy': chalk.green('✓'),
            'unhealthy': chalk.red('✗'),
            'degraded': chalk.yellow('⚠'),
            'unknown': chalk.gray('?')
        };
        return icons[health] || chalk.gray('?');
    }

    getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return 'now';
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Create CLI instance and parse arguments
const cli = new SandboxCLI();

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}