#!/usr/bin/env node

const inquirer = require('inquirer').default;
const chalk = require('chalk');
const { execSync, spawn } = require('child_process');
const figlet = require('figlet');

console.log(chalk.cyan(figlet.textSync('MCP Business Ops', { horizontalLayout: 'full' })));
console.log(chalk.gray('Complete Business Operations Environment for Cursor\n'));

class MCPLauncher {
  constructor() {
    this.processes = new Map();
    this.stringEngine = null;
  }

  async initStringEngine() {
    if (!this.stringEngine) {
      const StringAutomationEngine = require('./scripts/string-automation-engine.js');
      this.stringEngine = new StringAutomationEngine();
    }
    return this.stringEngine;
  }

  async showMainMenu() {
    const choices = [
      {
        name: '🚀 Complete Setup (First Time)',
        value: 'setup',
        description: 'Run automated setup and configuration'
      },
      {
        name: '🔍 Validate Setup',
        value: 'validate',
        description: 'Check if everything is configured correctly'
      },
      {
        name: '🧪 Test MCP Connections',
        value: 'test-mcps',
        description: 'Test all MCP server connections'
      },
      {
        name: '💻 Start Development Environment',
        value: 'dev',
        description: 'Launch Next.js dev server'
      },
      {
        name: '🐳 Start Docker Environment',
        value: 'docker',
        description: 'Launch with Docker Compose'
      },
      {
        name: '⚡ Start Claude Code',
        value: 'claude',
        description: 'Open Claude Code in terminal'
      },
      {
        name: '🤖 Multi-Model AI Testing',
        value: 'ai-testing',
        description: 'Test and compare multiple AI models'
      },
      {
        name: '🎨 Figma Design Sync',
        value: 'figma-sync',
        description: 'Sync designs between Figma and code'
      },
      {
        name: '🧠 Knowledge Base Engine',
        value: 'knowledge-engine',
        description: 'Manage dynamic learning and optimization'
      },
      {
        name: '🤖 Automated Learning Daemon',
        value: 'learning-daemon',
        description: 'Continuous background learning system'
      },
      {
        name: '📋 ClickUp Integration',
        value: 'clickup',
        description: 'Task management, docs sync, and project automation'
      },
      {
        name: '🎯 Quick Demo',
        value: 'demo',
        description: 'Run through basic functionality demo'
      },
      {
        name: '📚 View Documentation',
        value: 'docs',
        description: 'Open guides and documentation'
      },
      {
        name: '�️ Create Automation (Natural Language)',
        value: 'string-automation',
        description: 'Describe what you want to automate in plain English'
      },
      {
        name: '📚 Automation Templates Library',
        value: 'automation-templates',
        description: 'Browse pre-built String.com-inspired automations'
      },
      {
        name: '🎯 Business Intelligence Generator',
        value: 'business-intelligence',
        description: 'Create comprehensive business monitoring systems'
      },
      {
        name: '🏥 Health Monitor & Debugging',
        value: 'health-debug',
        description: 'System health monitoring and automated debugging'
      },
      {
        name: '� Utilities',
        value: 'utils',
        description: 'Backup, restore, and maintenance tools'
      },
      {
        name: '❌ Exit',
        value: 'exit'
      }
    ];

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices,
        pageSize: 12
      }
    ]);

    await this.handleAction(answer.action);
  }

  async handleAction(action) {
    switch (action) {
      case 'setup':
        await this.runSetup();
        break;
      case 'validate':
        await this.runValidation();
        break;
      case 'test-mcps':
        await this.testMCPs();
        break;
      case 'dev':
        await this.startDevelopment();
        break;
      case 'docker':
        await this.startDocker();
        break;
      case 'claude':
        await this.startClaude();
        break;
      case 'ai-testing':
        await this.runAITesting();
        break;
      case 'figma-sync':
        await this.runFigmaSync();
        break;
      case 'knowledge-engine':
        await this.runKnowledgeEngine();
        break;
      case 'learning-daemon':
        await this.runLearningDaemon();
        break;
      case 'clickup':
        await this.runClickUpIntegration();
        break;
      case 'demo':
        await this.runDemo();
        break;
      case 'docs':
        await this.showDocumentation();
        break;
      case 'string-automation':
        await this.runStringAutomation();
        break;
      case 'automation-templates':
        await this.runAutomationTemplates();
        break;
      case 'business-intelligence':
        await this.runBusinessIntelligence();
        break;
      case 'health-debug':
        await this.runHealthDebug();
        break;
      case 'utils':
        await this.showUtilities();
        break;
      case 'exit':
        console.log(chalk.green('\n👋 Goodbye! Happy building!'));
        process.exit(0);
      default:
        console.log(chalk.red('Unknown action'));
        await this.showMainMenu();
    }
  }

  async runSetup() {
    console.log(chalk.yellow('\n🚀 Starting complete setup...\n'));
    
    try {
      execSync('npm run setup', { stdio: 'inherit' });
      console.log(chalk.green('\n✅ Setup completed successfully!'));
      
      const nextAction = await inquirer.prompt([
        {
          type: 'list',
          name: 'next',
          message: 'What would you like to do next?',
          choices: [
            { name: '🔍 Validate setup', value: 'validate' },
            { name: '💻 Start development', value: 'dev' },
            { name: '🧪 Test MCPs', value: 'test-mcps' },
            { name: '📚 View documentation', value: 'docs' },
            { name: '🏠 Back to main menu', value: 'menu' }
          ]
        }
      ]);

      if (nextAction.next === 'menu') {
        await this.showMainMenu();
      } else {
        await this.handleAction(nextAction.next);
      }
    } catch (error) {
      console.log(chalk.red('\n❌ Setup failed. Check the error above and try again.'));
      await this.showMainMenu();
    }
  }

  async runValidation() {
    console.log(chalk.yellow('\n🔍 Validating setup...\n'));
    
    try {
      execSync('npm run validate-setup', { stdio: 'inherit' });
      await this.promptReturn();
    } catch (error) {
      console.log(chalk.red('\n❌ Validation found issues. Follow the recommendations above.'));
      await this.promptReturn();
    }
  }

  async testMCPs() {
    console.log(chalk.yellow('\n🧪 Testing MCP connections...\n'));
    
    try {
      execSync('npm run test-mcps', { stdio: 'inherit' });
      await this.promptReturn();
    } catch (error) {
      console.log(chalk.red('\n❌ MCP testing failed. Check configuration and try again.'));
      await this.promptReturn();
    }
  }

  async startDevelopment() {
    console.log(chalk.yellow('\n💻 Starting development environment...\n'));
    
    const devChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'How would you like to start development?',
        choices: [
          { name: '🚀 Standard (npm run dev)', value: 'standard' },
          { name: '🔧 With validation first', value: 'validate-first' },
          { name: '⚡ Background mode', value: 'background' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (devChoice.mode === 'menu') {
      await this.showMainMenu();
      return;
    }

    if (devChoice.mode === 'validate-first') {
      console.log(chalk.blue('Running validation first...'));
      try {
        execSync('npm run validate-setup', { stdio: 'inherit' });
      } catch (error) {
        const proceed = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Validation found issues. Continue anyway?',
            default: false
          }
        ]);
        if (!proceed.continue) {
          await this.showMainMenu();
          return;
        }
      }
    }

    console.log(chalk.green('\n🎯 Development server starting...'));
    console.log(chalk.blue('Access your app at: http://localhost:3000'));
    console.log(chalk.gray('Press Ctrl+C to stop the server\n'));

    if (devChoice.mode === 'background') {
      const devProcess = spawn('npm', ['run', 'dev'], { 
        stdio: 'inherit',
        detached: true 
      });
      this.processes.set('dev', devProcess);
      console.log(chalk.green('✅ Development server started in background'));
      await this.promptReturn();
    } else {
      execSync('npm run dev', { stdio: 'inherit' });
      await this.promptReturn();
    }
  }

  async startDocker() {
    console.log(chalk.yellow('\n🐳 Docker Environment Options\n'));
    
    const dockerChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'profile',
        message: 'Which Docker profile do you want to start?',
        choices: [
          { name: '🚀 Basic (App + Redis)', value: 'basic' },
          { name: '💾 Full Stack (+ PostgreSQL)', value: 'full' },
          { name: '📊 With Monitoring (+ Prometheus + Grafana)', value: 'monitoring' },
          { name: '🎯 Everything (All services)', value: 'all' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (dockerChoice.profile === 'menu') {
      await this.showMainMenu();
      return;
    }

    let command = 'docker-compose up -d';
    
    switch (dockerChoice.profile) {
      case 'full':
        command = 'docker-compose --profile full up -d';
        break;
      case 'monitoring':
        command = 'docker-compose --profile monitoring up -d';
        break;
      case 'all':
        command = 'docker-compose --profile full --profile monitoring up -d';
        break;
    }

    console.log(chalk.blue(`\nRunning: ${command}\n`));
    
    try {
      execSync(command, { stdio: 'inherit' });
      console.log(chalk.green('\n✅ Docker environment started successfully!'));
      console.log(chalk.blue('🌐 App: http://localhost:3000'));
      if (dockerChoice.profile.includes('monitoring') || dockerChoice.profile === 'all') {
        console.log(chalk.blue('📊 Grafana: http://localhost:3001 (admin/admin)'));
        console.log(chalk.blue('📈 Prometheus: http://localhost:9090'));
      }
      await this.promptReturn();
    } catch (error) {
      console.log(chalk.red('\n❌ Docker start failed. Make sure Docker is running.'));
      await this.promptReturn();
    }
  }

  async startClaude() {
    console.log(chalk.yellow('\n⚡ Starting Claude Code...\n'));
    
    try {
      // Check if Claude Code is installed
      execSync('claude --version', { stdio: 'pipe' });
      
      console.log(chalk.green('🎯 Claude Code is ready!'));
      console.log(chalk.blue('💡 Tips:'));
      console.log('  • Type "claude" in your terminal to start');
      console.log('  • Use it for building complete applications');
      console.log('  • It can read your project files and deploy to Vercel');
      console.log(chalk.gray('\nPress Ctrl+C to return to this menu\n'));
      
      execSync('claude', { stdio: 'inherit' });
      await this.promptReturn();
    } catch (error) {
      console.log(chalk.red('❌ Claude Code not installed.'));
      
      const install = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'install',
          message: 'Install Claude Code now?',
          default: true
        }
      ]);

      if (install.install) {
        try {
          console.log(chalk.blue('Installing Claude Code...'));
          execSync('npm install -g @anthropic-ai/claude-dev', { stdio: 'inherit' });
          console.log(chalk.green('✅ Claude Code installed! Try starting it again.'));
        } catch (installError) {
          console.log(chalk.red('❌ Installation failed. You may need to run with sudo or as administrator.'));
        }
      }
      
      await this.promptReturn();
    }
  }

  async runAITesting() {
    console.log(chalk.yellow('\n🤖 Multi-Model AI Testing\n'));
    
    const testChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'testType',
        message: 'What would you like to do?',
        choices: [
          { name: '🚀 Interactive Model Comparison', value: 'interactive' },
          { name: '📊 Performance Analytics Dashboard', value: 'analytics' },
          { name: '🔧 Setup Advanced Models', value: 'setup-models' },
          { name: '✅ Test All Configured Models', value: 'test-all' },
          { name: '📚 View Advanced AI Workflow Guide', value: 'guide' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (testChoice.testType === 'menu') {
      await this.showMainMenu();
      return;
    }

    switch (testChoice.testType) {
      case 'interactive':
        try {
          execSync('npm run test-ai-models', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ AI testing failed. Make sure to configure API keys first.'));
        }
        break;
      case 'analytics':
        try {
          execSync('npm run performance-analytics', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Analytics failed. Run some tests first.'));
        }
        break;
      case 'setup-models':
        try {
          execSync('npm run setup-advanced-models', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Setup failed. Check the error above.'));
        }
        break;
      case 'test-all':
        try {
          execSync('npm run test-advanced-mcps', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Testing failed. Check configuration.'));
        }
        break;
      case 'guide':
        console.log(chalk.blue('\nOpening Advanced AI Model Testing guide...\n'));
        try {
          const command = process.platform === 'darwin' ? 'open' : 
                        process.platform === 'win32' ? 'start' : 'xdg-open';
          execSync(`${command} advanced-ai-model-testing-workflow.md`, { stdio: 'pipe' });
        } catch (error) {
          console.log(chalk.yellow('Could not open file automatically.'));
          console.log(chalk.gray('File: advanced-ai-model-testing-workflow.md'));
        }
        break;
    }

    await this.promptReturn();
  }

  async runFigmaSync() {
    console.log(chalk.yellow('\n🎨 Figma Design Sync\n'));
    
    const syncChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'syncType',
        message: 'What would you like to do?',
        choices: [
          { name: '📥 Import Design from Figma', value: 'import' },
          { name: '📤 Export Code to Figma', value: 'export' },
          { name: '🔄 Setup Bidirectional Sync', value: 'setup' },
          { name: '🎯 One-Click Design-to-Deployment', value: 'pipeline' },
          { name: '🔧 Configure Figma Integration', value: 'configure' },
          { name: '📚 View Figma Integration Guide', value: 'guide' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (syncChoice.syncType === 'menu') {
      await this.showMainMenu();
      return;
    }

    // Check if Figma token is configured
    require('dotenv').config();
    if (!process.env.FIGMA_ACCESS_TOKEN && syncChoice.syncType !== 'guide' && syncChoice.syncType !== 'configure') {
      console.log(chalk.red('❌ Figma access token not configured.'));
      console.log(chalk.yellow('💡 Add FIGMA_ACCESS_TOKEN to your .env file first.'));
      console.log(chalk.blue('📚 See the Figma Integration Guide for setup instructions.'));
      await this.promptReturn();
      return;
    }

    switch (syncChoice.syncType) {
      case 'import':
      case 'export':
      case 'setup':
      case 'pipeline':
        try {
          execSync('npm run sync-figma-design', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Figma sync failed. Check configuration and try again.'));
        }
        break;
      case 'configure':
        try {
          execSync('npm run configure-figma-webhooks', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Configuration failed. Check your Figma API keys.'));
        }
        break;
      case 'guide':
        console.log(chalk.blue('\nOpening Figma Integration guide...\n'));
        try {
          const command = process.platform === 'darwin' ? 'open' : 
                        process.platform === 'win32' ? 'start' : 'xdg-open';
          execSync(`${command} advanced-ai-model-testing-workflow.md`, { stdio: 'pipe' });
        } catch (error) {
          console.log(chalk.yellow('Could not open file automatically.'));
          console.log(chalk.gray('File: advanced-ai-model-testing-workflow.md'));
        }
        break;
    }

    await this.promptReturn();
  }

  async runKnowledgeEngine() {
    console.log(chalk.yellow('\n🧠 Knowledge Base Engine\n'));
    
    const engineChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'engineAction',
        message: 'Knowledge Base Engine - What would you like to do?',
        choices: [
          { name: '🔄 Process New Information', value: 'process' },
          { name: '📊 Analyze Performance Trends', value: 'trends' },
          { name: '🎯 Generate Optimizations', value: 'optimize' },
          { name: '📈 View System Status', value: 'status' },
          { name: '🔧 Run Maintenance', value: 'maintenance' },
          { name: '📡 Sync to MCP Pipeline', value: 'sync' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (engineChoice.engineAction === 'menu') {
      await this.showMainMenu();
      return;
    }

    try {
      execSync('npm run knowledge-engine', { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.red('❌ Knowledge Base Engine failed. Check configuration.'));
    }

    await this.promptReturn();
  }

  async runLearningDaemon() {
    console.log(chalk.yellow('\n🤖 Automated Learning Daemon\n'));
    
    const daemonChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'daemonAction',
        message: 'Learning Daemon - What would you like to do?',
        choices: [
          { name: '🚀 Start Daemon (Background Learning)', value: 'start' },
          { name: '🛑 Stop Daemon', value: 'stop' },
          { name: '📊 View Daemon Status', value: 'status' },
          { name: '🔄 Restart Daemon', value: 'restart' },
          { name: '⚙️ Configure Learning Settings', value: 'configure' },
          { name: '📈 View Learning Analytics', value: 'analytics' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (daemonChoice.daemonAction === 'menu') {
      await this.showMainMenu();
      return;
    }

    switch (daemonChoice.daemonAction) {
      case 'start':
        try {
          console.log(chalk.blue('\n🚀 Starting Automated Learning Daemon...'));
          console.log(chalk.yellow('💡 The daemon will run in the background and continuously optimize your system.'));
          console.log(chalk.gray('Press Ctrl+C to stop the daemon when needed.\n'));
          execSync('npm run start-daemon', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Failed to start daemon. Check configuration.'));
        }
        break;
      case 'stop':
        try {
          execSync('npm run stop-daemon', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Failed to stop daemon.'));
        }
        break;
      case 'status':
        try {
          execSync('npm run daemon-status', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Failed to get daemon status.'));
        }
        break;
      case 'restart':
        try {
          console.log(chalk.blue('🔄 Restarting Learning Daemon...'));
          execSync('npm run stop-daemon', { stdio: 'pipe' });
          setTimeout(() => {
            execSync('npm run start-daemon', { stdio: 'inherit' });
          }, 2000);
        } catch (error) {
          console.log(chalk.red('❌ Failed to restart daemon.'));
        }
        break;
      case 'configure':
        console.log(chalk.blue('\n⚙️ Daemon Configuration:'));
        console.log(chalk.gray('Edit the following environment variables in your .env file:'));
        console.log(chalk.yellow('• LEARNING_PERFORMANCE_INTERVAL - How often to monitor performance'));
        console.log(chalk.yellow('• LEARNING_KNOWLEDGE_INTERVAL - How often to process knowledge'));
        console.log(chalk.yellow('• ENABLE_AUTO_OPTIMIZATION - Enable automatic optimizations'));
        console.log(chalk.yellow('• ENABLE_PREDICTIVE_ANALYSIS - Enable predictive analytics'));
        console.log(chalk.gray('\nSee .env.example for all available configuration options.'));
        break;
      case 'analytics':
        try {
          execSync('npm run performance-analytics', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Failed to load analytics.'));
        }
        break;
    }

    await this.promptReturn();
  }

  async runClickUpIntegration() {
    console.log(chalk.yellow('\n📋 ClickUp Integration & Automation\n'));
    
    const clickupChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'clickupAction',
        message: 'ClickUp Integration - What would you like to do?',
        choices: [
          { name: '🚀 Start ClickUp Automation Daemon', value: 'start-daemon' },
          { name: '📊 View ClickUp Status & Analytics', value: 'status' },
          { name: '🔄 Sync Current Project to ClickUp', value: 'sync-project' },
          { name: '📥 Import ClickUp Tasks & Docs', value: 'import' },
          { name: '📤 Export Code Files to ClickUp Docs', value: 'export' },
          { name: '⚙️ Setup Project Automation Rules', value: 'setup-automation' },
          { name: '🧪 Test ClickUp API Connection', value: 'test-connection' },
          { name: '🔧 Configure ClickUp Integration', value: 'configure' },
          { name: '📚 View ClickUp Integration Guide', value: 'guide' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (clickupChoice.clickupAction === 'menu') {
      await this.showMainMenu();
      return;
    }

    // Check if ClickUp API key is configured
    require('dotenv').config();
    if (!process.env.CLICKUP_API_KEY && clickupChoice.clickupAction !== 'guide' && clickupChoice.clickupAction !== 'configure') {
      console.log(chalk.red('❌ ClickUp API key not configured.'));
      console.log(chalk.yellow('💡 Add CLICKUP_API_KEY to your .env file first.'));
      console.log(chalk.blue('📚 See the ClickUp Integration Guide for setup instructions.'));
      await this.promptReturn();
      return;
    }

    switch (clickupChoice.clickupAction) {
      case 'start-daemon':
        console.log(chalk.blue('🚀 Starting ClickUp Automation Daemon...'));
        try {
          execSync('npm run start-clickup', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Failed to start ClickUp daemon. Check configuration.'));
        }
        break;
      
      case 'status':
        try {
          execSync('npm run clickup-status', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Failed to get ClickUp status. Is the daemon running?'));
        }
        break;
      
      case 'sync-project':
        console.log(chalk.blue('🔄 Syncing current project to ClickUp...'));
        try {
          execSync('npm run sync-clickup', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ Project sync failed. Check ClickUp configuration.'));
        }
        break;
      
      case 'import':
        console.log(chalk.blue('📥 Importing from ClickUp...'));
        try {
          // This would use the MCP server to import data
          console.log(chalk.yellow('💡 Use the ClickUp MCP in Cursor to import tasks and docs:'));
          console.log(chalk.gray('  sync_docs_to_cursor'));
          console.log(chalk.gray('  search_clickup_data'));
        } catch (error) {
          console.log(chalk.red('❌ Import failed.'));
        }
        break;
      
      case 'export':
        console.log(chalk.blue('📤 Exporting to ClickUp...'));
        try {
          console.log(chalk.yellow('💡 Use the ClickUp MCP in Cursor to export files:'));
          console.log(chalk.gray('  send_files_to_clickup'));
          console.log(chalk.gray('  sync_cursor_project'));
        } catch (error) {
          console.log(chalk.red('❌ Export failed.'));
        }
        break;
      
      case 'setup-automation':
        console.log(chalk.blue('⚙️ Setting up automation rules...'));
        try {
          console.log(chalk.yellow('💡 Use the ClickUp MCP in Cursor to setup automation:'));
          console.log(chalk.gray('  setup_automation_rules'));
          console.log(chalk.gray('  auto_manage_tasks'));
        } catch (error) {
          console.log(chalk.red('❌ Automation setup failed.'));
        }
        break;
      
      case 'test-connection':
        try {
          execSync('npm run test-clickup', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('❌ ClickUp connection test failed. Check API configuration.'));
        }
        break;
      
      case 'configure':
        console.log(chalk.blue('\n🔧 ClickUp Configuration Guide:'));
        console.log(chalk.yellow('\n1. Get your ClickUp API key:'));
        console.log(chalk.gray('   • Go to ClickUp > Settings > Apps'));
        console.log(chalk.gray('   • Generate API Key'));
        console.log(chalk.yellow('\n2. Find your Team & Workspace IDs:'));
        console.log(chalk.gray('   • Check the URL: https://app.clickup.com/{team_id}/'));
        console.log(chalk.yellow('\n3. Add to your .env file:'));
        console.log(chalk.gray('   CLICKUP_API_KEY=your-api-key'));
        console.log(chalk.gray('   CLICKUP_TEAM_ID=your-team-id'));
        console.log(chalk.gray('   CLICKUP_WORKSPACE_ID=your-workspace-id'));
        break;
      
      case 'guide':
        console.log(chalk.blue('\nOpening ClickUp Integration guide...\n'));
        try {
          const command = process.platform === 'darwin' ? 'open' : 
                        process.platform === 'win32' ? 'start' : 'xdg-open';
          execSync(`${command} comprehensive-platform-knowledge-base.md`, { stdio: 'pipe' });
        } catch (error) {
          console.log(chalk.yellow('Could not open file automatically.'));
          console.log(chalk.gray('File: comprehensive-platform-knowledge-base.md'));
        }
        break;
    }

    await this.promptReturn();
  }

  async runDemo() {
    console.log(chalk.yellow('\n🎯 Quick Demo - MCP Business Operations\n'));
    
    const demoSteps = [
      {
        name: '1. Project Structure',
        action: () => this.showProjectStructure()
      },
      {
        name: '2. Environment Check',
        action: () => this.checkEnvironment()
      },
      {
        name: '3. MCP Status',
        action: () => this.showMCPStatus()
      },
      {
        name: '4. Sample Prompts',
        action: () => this.showSamplePrompts()
      },
      {
        name: '5. Next Steps',
        action: () => this.showNextSteps()
      }
    ];

    for (const step of demoSteps) {
      console.log(chalk.cyan(`\n${step.name}`));
      console.log('─'.repeat(50));
      await step.action();
      
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...'
        }
      ]);
    }

    await this.promptReturn();
  }

  showProjectStructure() {
    console.log(chalk.green('📁 Project Structure:'));
    const structure = [
      '├── 📚 README.md - Main overview',
      '├── ⚙️ SETUP-GUIDE.md - Complete setup instructions',
      '├── 🚀 advanced-claude-code-workflow.md - James\'s method',
      '├── 💰 cost-analysis-and-roi.md - Economics and ROI',
      '├── 📝 example-prompts.md - Ready-to-use prompts',
      '├── 🔧 package.json - Dependencies and scripts',
      '├── 🌍 .env.example - Environment template',
      '├── 🐳 docker-compose.yml - Container setup',
      '└── 📂 scripts/ - Automation tools'
    ];
    structure.forEach(item => console.log(chalk.gray(`   ${item}`)));
  }

  checkEnvironment() {
    console.log(chalk.green('🔍 Environment Status:'));
    
    const checks = [
      { name: 'Node.js', cmd: 'node --version' },
      { name: 'npm', cmd: 'npm --version' },
      { name: 'Claude Code', cmd: 'claude --version' },
      { name: 'Docker', cmd: 'docker --version' }
    ];

    checks.forEach(check => {
      try {
        const version = execSync(check.cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
        console.log(chalk.green(`   ✅ ${check.name}: ${version}`));
      } catch (error) {
        console.log(chalk.yellow(`   ⚠️  ${check.name}: Not installed`));
      }
    });
  }

  showMCPStatus() {
    console.log(chalk.green('🔌 Available MCP Servers:'));
    const mcps = [
      { name: 'Playwright', desc: 'Browser automation (FREE)' },
      { name: 'Firecrawl', desc: 'Web scraping (API key required)' },
      { name: 'Perplexity', desc: 'AI research (API key required)' },
      { name: 'DataForSEO', desc: 'Keyword research (API key required)' },
      { name: 'Xero', desc: 'Accounting integration (Setup required)' }
    ];
    
    mcps.forEach(mcp => {
      console.log(chalk.gray(`   • ${mcp.name}: ${mcp.desc}`));
    });
  }

  showSamplePrompts() {
    console.log(chalk.green('💬 Sample Prompts to Try in Cursor:'));
    const prompts = [
      'Use Playwright to take a screenshot of google.com',
      'Use Firecrawl to scrape the homepage of stripe.com',
      'Use Perplexity to research AI trends in 2024',
      'Create a PRD for building comparison pages'
    ];
    
    prompts.forEach(prompt => {
      console.log(chalk.blue(`   "${prompt}"`));
    });
  }

  showNextSteps() {
    console.log(chalk.green('🎯 Next Steps:'));
    const steps = [
      '1. Configure API keys in .env file',
      '2. Restart Cursor to load MCP configuration',
      '3. Test with: npm run test-mcps',
      '4. Start development: npm run dev',
      '5. Try Claude Code: claude',
      '6. Build your first comparison page!'
    ];
    
    steps.forEach(step => {
      console.log(chalk.gray(`   ${step}`));
    });
  }

  async showDocumentation() {
    console.log(chalk.yellow('\n📚 Documentation & Guides\n'));
    
    const docs = [
      { name: '📖 Main README', file: 'README.md' },
      { name: '🚀 Setup Guide', file: 'SETUP-GUIDE.md' },
      { name: '⚡ Advanced Workflow', file: 'advanced-claude-code-workflow.md' },
      { name: '💰 Cost Analysis', file: 'cost-analysis-and-roi.md' },
      { name: '📝 Example Prompts', file: 'example-prompts.md' },
      { name: '🔧 Quick Start', file: 'quick-start-mcp-setup.md' }
    ];

    const docChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'doc',
        message: 'Which guide would you like to view?',
        choices: [
          ...docs.map(doc => ({ name: doc.name, value: doc.file })),
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (docChoice.doc === 'menu') {
      await this.showMainMenu();
      return;
    }

    console.log(chalk.blue(`\nOpening ${docChoice.doc}...\n`));
    
    // Try to open with the default system editor
    try {
      const command = process.platform === 'darwin' ? 'open' : 
                    process.platform === 'win32' ? 'start' : 'xdg-open';
      execSync(`${command} ${docChoice.doc}`, { stdio: 'pipe' });
    } catch (error) {
      console.log(chalk.yellow('Could not open file automatically. Please open it manually:'));
      console.log(chalk.gray(`File: ${docChoice.doc}`));
    }

    await this.promptReturn();
  }

  async showUtilities() {
    console.log(chalk.yellow('\n🔧 Utility Tools\n'));
    
    const utilChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'util',
        message: 'Which utility would you like to run?',
        choices: [
          { name: '💾 Backup Cursor configuration', value: 'backup' },
          { name: '🔄 Restore Cursor configuration', value: 'restore' },
          { name: '🧹 Clean node_modules and reinstall', value: 'clean' },
          { name: '📊 Show environment info', value: 'info' },
          { name: '🔄 Update all MCP servers', value: 'update-mcps' },
          { name: '🐳 Docker cleanup', value: 'docker-cleanup' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    switch (utilChoice.util) {
      case 'backup':
        try {
          execSync('npm run backup-config', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('Backup failed.'));
        }
        break;
      case 'restore':
        try {
          execSync('npm run restore-config', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('Restore failed.'));
        }
        break;
      case 'clean':
        console.log(chalk.blue('Cleaning and reinstalling dependencies...'));
        try {
          execSync('rm -rf node_modules package-lock.json && npm install', { stdio: 'inherit' });
          console.log(chalk.green('✅ Clean install completed'));
        } catch (error) {
          console.log(chalk.red('Clean install failed.'));
        }
        break;
      case 'info':
        this.showSystemInfo();
        break;
      case 'update-mcps':
        try {
          execSync('npm run install-mcps', { stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.red('MCP update failed.'));
        }
        break;
      case 'docker-cleanup':
        console.log(chalk.blue('Cleaning Docker containers and volumes...'));
        try {
          execSync('docker-compose down -v --remove-orphans', { stdio: 'inherit' });
          console.log(chalk.green('✅ Docker cleanup completed'));
        } catch (error) {
          console.log(chalk.red('Docker cleanup failed.'));
        }
        break;
      case 'menu':
        await this.showMainMenu();
        return;
    }

    await this.promptReturn();
  }

  showSystemInfo() {
    console.log(chalk.green('\n💻 System Information:'));
    console.log(chalk.gray(`OS: ${process.platform} ${process.arch}`));
    console.log(chalk.gray(`Node.js: ${process.version}`));
    console.log(chalk.gray(`Working Directory: ${process.cwd()}`));
    
    try {
      const packageJson = require('./package.json');
      console.log(chalk.gray(`Project Version: ${packageJson.version}`));
    } catch (error) {
      // Package.json not found or invalid
    }
  }

  async runStringAutomation() {
    console.log(chalk.yellow('\n🗣️ Natural Language Automation Builder\n'));
    console.log(chalk.blue('Inspired by String.com - Create automations using plain English!\n'));
    
    try {
      const engine = await this.initStringEngine();
      
      const prompt = await inquirer.prompt([
        {
          type: 'input',
          name: 'automation',
          message: 'Describe what you want to automate (in plain English):',
          validate: input => input.length > 10 || 'Please provide more detail'
        }
      ]);

      console.log(chalk.blue('\n🤖 Analyzing your request...\n'));
      
      const automation = await engine.createAutomationFromPrompt(prompt.automation);
      console.log(chalk.green('✅ Automation created successfully!'));
      
      // Show generated workflow
      console.log(chalk.blue('\n📋 Generated Workflow:'));
      automation.steps.forEach((step, i) => {
        console.log(chalk.gray(`  ${i + 1}. ${step.description}`));
      });
      
      // Offer to test or deploy
      const action = await inquirer.prompt([
        {
          type: 'list',
          name: 'next',
          message: 'What would you like to do?',
          choices: [
            { name: '🧪 Test automation', value: 'test' },
            { name: '🚀 Deploy automation', value: 'deploy' },
            { name: '✏️ Modify workflow', value: 'modify' },
            { name: '🏠 Back to main menu', value: 'menu' }
          ]
        }
      ]);
      
      await this.handleAutomationAction(action.next, automation);
      
    } catch (error) {
      console.log(chalk.red('❌ Failed to create automation. Please try rephrasing.'));
      console.log(chalk.gray(`Error: ${error.message}`));
      await this.promptReturn();
    }
  }

  async runAutomationTemplates() {
    console.log(chalk.yellow('\n📚 Automation Templates Library\n'));
    console.log(chalk.blue('Pre-built templates inspired by String.com use cases\n'));
    
    try {
      const engine = await this.initStringEngine();
      const workflow = await engine.showAutomationTemplates();
      
      if (workflow) {
        console.log(chalk.green('\n✅ Template customized successfully!'));
        
        const action = await inquirer.prompt([
          {
            type: 'list',
            name: 'next',
            message: 'What would you like to do?',
            choices: [
              { name: '🧪 Test automation', value: 'test' },
              { name: '🚀 Deploy automation', value: 'deploy' },
              { name: '🏠 Back to main menu', value: 'menu' }
            ]
          }
        ]);
        
        await this.handleAutomationAction(action.next, workflow);
      } else {
        await this.promptReturn();
      }
      
    } catch (error) {
      console.log(chalk.red('❌ Failed to load templates.'));
      console.log(chalk.gray(`Error: ${error.message}`));
      await this.promptReturn();
    }
  }

  async runBusinessIntelligence() {
    console.log(chalk.yellow('\n🎯 Business Intelligence Generator\n'));
    console.log(chalk.blue('Create comprehensive business monitoring systems\n'));
    
    const biChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What type of business intelligence would you like to create?',
        choices: [
          { name: '📊 Daily Business Dashboard', value: 'dashboard' },
          { name: '🕵️ Competitor Intelligence Hub', value: 'competitor' },
          { name: '📈 Content Performance Tracker', value: 'content' },
          { name: '💰 Financial Optimization Engine', value: 'financial' },
          { name: '🎯 Custom Business Intelligence', value: 'custom' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (biChoice.type === 'menu') {
      await this.showMainMenu();
      return;
    }

    try {
      const engine = await this.initStringEngine();
      let automationPrompt = '';

      switch (biChoice.type) {
        case 'dashboard':
          automationPrompt = 'Monitor daily business metrics from Xero and ClickUp, analyze trends, and create comprehensive dashboard reports';
          break;
        case 'competitor':
          automationPrompt = 'Monitor competitor websites, analyze changes, research market context, and generate intelligence reports with actionable insights';
          break;
        case 'content':
          automationPrompt = 'Track content performance, monitor SEO rankings, analyze competitor content, and generate optimization recommendations';
          break;
        case 'financial':
          automationPrompt = 'Analyze financial data from Xero, identify cost optimization opportunities, track KPIs, and generate budget recommendations';
          break;
        case 'custom':
          const custom = await inquirer.prompt([
            {
              type: 'input',
              name: 'description',
              message: 'Describe your business intelligence needs:',
              validate: input => input.length > 10 || 'Please provide more detail'
            }
          ]);
          automationPrompt = custom.description;
          break;
      }

      console.log(chalk.blue('\n🤖 Creating business intelligence automation...\n'));
      
      const automation = await engine.createAutomationFromPrompt(automationPrompt);
      console.log(chalk.green('✅ Business intelligence system created!'));
      
      console.log(chalk.blue('\n📋 Generated Intelligence Workflow:'));
      automation.steps.forEach((step, i) => {
        console.log(chalk.gray(`  ${i + 1}. ${step.description}`));
      });
      
      const action = await inquirer.prompt([
        {
          type: 'list',
          name: 'next',
          message: 'What would you like to do?',
          choices: [
            { name: '🧪 Test intelligence system', value: 'test' },
            { name: '🚀 Deploy to production', value: 'deploy' },
            { name: '📊 View analytics setup', value: 'analytics' },
            { name: '🏠 Back to main menu', value: 'menu' }
          ]
        }
      ]);
      
      await this.handleAutomationAction(action.next, automation);
      
    } catch (error) {
      console.log(chalk.red('❌ Failed to create business intelligence system.'));
      console.log(chalk.gray(`Error: ${error.message}`));
      await this.promptReturn();
    }
  }

  async handleAutomationAction(action, automation) {
    const engine = await this.initStringEngine();
    
    switch (action) {
      case 'test':
        const testResult = await engine.testAutomation(automation);
        if (testResult) {
          const deploy = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'deploy',
              message: 'Automation tested successfully! Deploy now?',
              default: true
            }
          ]);
          if (deploy.deploy) {
            await engine.deployAutomation(automation);
            console.log(chalk.green('\n🎉 Automation is now live and running!'));
          }
        } else {
          console.log(chalk.yellow('\n🔧 Automation needs adjustments before deployment.'));
        }
        await this.promptReturn();
        break;
        
      case 'deploy':
        const deployed = await engine.deployAutomation(automation);
        console.log(chalk.green('\n🎉 Automation deployed successfully!'));
        console.log(chalk.blue(`Automation ID: ${deployed.id}`));
        await this.promptReturn();
        break;
        
      case 'analytics':
        console.log(chalk.blue('\n📊 Analytics Setup'));
        console.log(chalk.gray('Automation will track:'));
        console.log(chalk.gray('  • Execution success rates'));
        console.log(chalk.gray('  • Performance metrics'));
        console.log(chalk.gray('  • Business impact measures'));
        console.log(chalk.gray('  • Cost optimization opportunities'));
        await this.promptReturn();
        break;
        
      case 'modify':
        console.log(chalk.blue('\n✏️ Workflow Modification'));
        console.log(chalk.gray('Feature coming soon - workflow editor with visual interface'));
        await this.promptReturn();
        break;
        
      case 'menu':
      default:
        await this.showMainMenu();
        break;
    }
  }

  async runHealthDebug() {
    console.log(chalk.yellow('\n🏥 Health Monitor & Debugging System\n'));
    
    const healthChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'healthAction',
        message: 'Health & Debug - What would you like to do?',
        choices: [
          { name: '🔍 Run Health Check', value: 'health-check' },
          { name: '📊 Open Debug Dashboard', value: 'debug-dashboard' },
          { name: '🔧 Auto-Fix Issues', value: 'auto-fix' },
          { name: '🔄 Continuous Monitoring', value: 'continuous' },
          { name: '🧪 System Diagnostics', value: 'diagnostics' },
          { name: '📈 Performance Monitor', value: 'performance' },
          { name: '🚨 Emergency Recovery', value: 'emergency' },
          { name: '📋 Generate Health Report', value: 'report' },
          { name: '🏠 Back to main menu', value: 'menu' }
        ]
      }
    ]);

    if (healthChoice.healthAction === 'menu') {
      await this.showMainMenu();
      return;
    }

    try {
      switch (healthChoice.healthAction) {
        case 'health-check':
          console.log(chalk.blue('🔍 Running comprehensive health check...'));
          execSync('npm run health-check', { stdio: 'inherit' });
          break;
          
        case 'debug-dashboard':
          console.log(chalk.blue('📊 Opening debug dashboard...'));
          console.log(chalk.green('🌐 Debug Dashboard: http://localhost:3000/dashboard/debug-dashboard.html'));
          console.log(chalk.gray('💡 Make sure your development server is running (npm run dev)'));
          
          const openDashboard = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'open',
              message: 'Open debug dashboard in browser?',
              default: true
            }
          ]);
          
          if (openDashboard.open) {
            try {
              const command = process.platform === 'darwin' ? 'open' : 
                            process.platform === 'win32' ? 'start' : 'xdg-open';
              execSync(`${command} http://localhost:3000/dashboard/debug-dashboard.html`, { stdio: 'pipe' });
            } catch (error) {
              console.log(chalk.yellow('Could not open browser automatically.'));
              console.log(chalk.gray('Please open: http://localhost:3000/dashboard/debug-dashboard.html'));
            }
          }
          break;
          
        case 'auto-fix':
          const fixChoice = await inquirer.prompt([
            {
              type: 'list',
              name: 'fixType',
              message: 'Auto-fix options:',
              choices: [
                { name: '🔍 Dry Run (Show what would be fixed)', value: 'dry-run' },
                { name: '🔧 Interactive Fix (Choose issues to fix)', value: 'interactive' },
                { name: '⚡ Auto Fix All Issues', value: 'auto' },
                { name: '🔄 Continuous Auto-Fix', value: 'continuous' }
              ]
            }
          ]);
          
          console.log(chalk.blue('🔧 Running auto-fix engine...'));
          switch (fixChoice.fixType) {
            case 'dry-run':
              execSync('npm run auto-fix-dry-run', { stdio: 'inherit' });
              break;
            case 'interactive':
              execSync('npm run auto-fix-interactive', { stdio: 'inherit' });
              break;
            case 'auto':
              execSync('npm run auto-fix', { stdio: 'inherit' });
              break;
            case 'continuous':
              execSync('npm run auto-fix-continuous', { stdio: 'inherit' });
              break;
          }
          break;
          
        case 'continuous':
          console.log(chalk.blue('🔄 Starting continuous health monitoring...'));
          console.log(chalk.yellow('⚠️  This will run in the background. Press Ctrl+C to stop.'));
          execSync('npm run health-continuous', { stdio: 'inherit' });
          break;
          
        case 'diagnostics':
          console.log(chalk.blue('🧪 Running system diagnostics...'));
          execSync('npm run system-diagnostics', { stdio: 'inherit' });
          break;
          
        case 'performance':
          console.log(chalk.blue('📈 Starting performance monitoring...'));
          execSync('npm run health-monitor', { stdio: 'inherit' });
          break;
          
        case 'emergency':
          console.log(chalk.red('🚨 Emergency Recovery Mode'));
          console.log(chalk.yellow('This will attempt to fix critical system issues automatically.'));
          
          const confirmEmergency = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: 'Proceed with emergency recovery?',
              default: false
            }
          ]);
          
          if (confirmEmergency.proceed) {
            console.log(chalk.blue('🔧 Running emergency recovery...'));
            execSync('node scripts/auto-fix-engine.js --type missing-env-vars --type api-connection-failed --type mcp-server-down', { stdio: 'inherit' });
          }
          break;
          
        case 'report':
          console.log(chalk.blue('📋 Generating comprehensive health report...'));
          execSync('node scripts/health-monitor.js --verbose --auto-fix', { stdio: 'inherit' });
          console.log(chalk.green('📄 Health report saved to logs/health-report-*.json'));
          break;
      }
      
    } catch (error) {
      console.log(chalk.red('❌ Health monitoring failed:'), error.message);
    }

    await this.promptReturn();
  }

  async promptReturn() {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'return',
        message: 'Press Enter to return to main menu...'
      }
    ]);
    await this.showMainMenu();
  }

  cleanup() {
    console.log(chalk.blue('\nCleaning up background processes...'));
    this.processes.forEach((process, name) => {
      try {
        process.kill();
        console.log(chalk.gray(`Stopped ${name}`));
      } catch (error) {
        // Process already stopped or doesn't exist
      }
    });
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Goodbye!'));
  process.exit(0);
});

// Start the launcher
const launcher = new MCPLauncher();
launcher.showMainMenu().catch(console.error);