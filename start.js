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
        name: '🔧 Utilities',
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
      case 'demo':
        await this.runDemo();
        break;
      case 'docs':
        await this.showDocumentation();
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