#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer').default;
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');

console.log(chalk.cyan(figlet.textSync('MCP Business Setup', { horizontalLayout: 'full' })));
console.log(chalk.gray('Complete Business Operations Environment for Cursor\n'));

class MCPBusinessSetup {
  constructor() {
    this.cursorConfigPath = this.findCursorConfigPath();
    this.projectRoot = process.cwd();
    this.envPath = path.join(this.projectRoot, '.env');
  }

  findCursorConfigPath() {
    const possiblePaths = [
      path.join(process.env.HOME || process.env.USERPROFILE, '.cursor', 'settings.json'),
      path.join(process.env.HOME || process.env.USERPROFILE, 'Library', 'Application Support', 'Cursor', 'User', 'settings.json'),
      path.join(process.env.APPDATA, 'Cursor', 'User', 'settings.json'),
      path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'Cursor', 'User', 'settings.json')
    ];

    for (const configPath of possiblePaths) {
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }
    return null;
  }

  async run() {
    console.log(chalk.yellow('🚀 Starting MCP Business Operations Setup...\n'));

    try {
      await this.checkPrerequisites();
      await this.gatherUserInput();
      await this.setupEnvironment();
      await this.installDependencies();
      await this.configureCursor();
      await this.setupProject();
      await this.validateSetup();
      await this.showCompletionMessage();
    } catch (error) {
      console.error(chalk.red('\n❌ Setup failed:'), error.message);
      console.log(chalk.yellow('\n📞 Need help? Check the troubleshooting guide or create an issue.'));
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    const spinner = ora('Checking prerequisites...').start();

    const checks = [
      { cmd: 'node --version', name: 'Node.js', required: true },
      { cmd: 'npm --version', name: 'npm', required: true },
      { cmd: 'git --version', name: 'Git', required: false }
    ];

    for (const check of checks) {
      try {
        const result = execSync(check.cmd, { encoding: 'utf8' }).trim();
        spinner.text = `✅ ${check.name}: ${result}`;
      } catch (error) {
        if (check.required) {
          spinner.fail(`❌ ${check.name} is required but not installed`);
          throw new Error(`Please install ${check.name} and try again`);
        }
      }
    }

    spinner.succeed('Prerequisites check completed');
  }

  async gatherUserInput() {
    console.log(chalk.blue('\n📝 Let\'s configure your environment:\n'));

    this.config = await inquirer.prompt([
      {
        type: 'input',
        name: 'businessName',
        message: 'What\'s your business name?',
        default: 'My Business'
      },
      {
        type: 'input',
        name: 'businessDomain',
        message: 'What\'s your business domain? (e.g., example.com)',
        default: 'example.com'
      },
      {
        type: 'input',
        name: 'businessIndustry',
        message: 'What industry are you in?',
        default: 'Technology'
      },
      {
        type: 'checkbox',
        name: 'mcpServers',
        message: 'Which MCP servers do you want to install?',
        choices: [
          { name: 'Playwright (Browser automation) - FREE', value: 'playwright', checked: true },
          { name: 'Firecrawl (Web scraping) - FREE tier available', value: 'firecrawl', checked: true },
          { name: 'Perplexity (AI research) - Requires API key', value: 'perplexity', checked: true },
          { name: 'DataForSEO (Keyword research) - Requires API key', value: 'dataforseo', checked: true },
          { name: 'Xero (Accounting) - Requires setup', value: 'xero', checked: false }
        ]
      },
      {
        type: 'confirm',
        name: 'installClaudeCode',
        message: 'Install Claude Code for advanced development workflows?',
        default: true
      },
      {
        type: 'confirm',
        name: 'setupVercel',
        message: 'Setup Vercel for production deployment?',
        default: true
      },
      {
        type: 'confirm',
        name: 'createSampleProject',
        message: 'Create a sample comparison page project?',
        default: true
      }
    ]);
  }

  async setupEnvironment() {
    const spinner = ora('Setting up environment variables...').start();

    if (!fs.existsSync(this.envPath)) {
      const envContent = fs.readFileSync(path.join(this.projectRoot, '.env.example'), 'utf8');
      let personalizedEnv = envContent
        .replace('Your Business Name', this.config.businessName)
        .replace('yourdomain.com', this.config.businessDomain)
        .replace('your_industry_here', this.config.businessIndustry);

      fs.writeFileSync(this.envPath, personalizedEnv);
      spinner.succeed('Environment file created');
    } else {
      spinner.info('Environment file already exists');
    }
  }

  async installDependencies() {
    const spinner = ora('Installing dependencies...').start();

    try {
      execSync('npm install', { stdio: 'pipe' });
      spinner.succeed('Dependencies installed');

      if (this.config.installClaudeCode) {
        const claudeSpinner = ora('Installing Claude Code...').start();
        try {
          execSync('npm install -g @anthropic-ai/claude-dev', { stdio: 'pipe' });
          claudeSpinner.succeed('Claude Code installed globally');
        } catch (error) {
          claudeSpinner.warn('Claude Code installation failed - you can install it manually later');
        }
      }

      // Install Playwright browsers
      if (this.config.mcpServers.includes('playwright')) {
        const playwrightSpinner = ora('Installing Playwright browsers...').start();
        try {
          execSync('npx playwright install', { stdio: 'pipe' });
          playwrightSpinner.succeed('Playwright browsers installed');
        } catch (error) {
          playwrightSpinner.warn('Playwright browser installation failed - you can install them manually later');
        }
      }

    } catch (error) {
      spinner.fail('Dependency installation failed');
      throw error;
    }
  }

  async configureCursor() {
    const spinner = ora('Configuring Cursor MCP servers...').start();

    if (!this.cursorConfigPath) {
      spinner.warn('Cursor config file not found - you\'ll need to configure MCPs manually');
      return;
    }

    try {
      let cursorConfig = {};
      if (fs.existsSync(this.cursorConfigPath)) {
        const configContent = fs.readFileSync(this.cursorConfigPath, 'utf8');
        cursorConfig = JSON.parse(configContent);
      }

      // Generate MCP configuration
      const mcpConfig = this.generateMCPConfig();
      cursorConfig.mcpServers = mcpConfig.mcpServers;

      // Backup original config
      if (fs.existsSync(this.cursorConfigPath)) {
        fs.copyFileSync(this.cursorConfigPath, `${this.cursorConfigPath}.backup`);
      }

      // Write new config
      fs.writeFileSync(this.cursorConfigPath, JSON.stringify(cursorConfig, null, 2));
      spinner.succeed('Cursor MCP configuration updated');

    } catch (error) {
      spinner.fail('Failed to configure Cursor - you\'ll need to configure MCPs manually');
      console.log(chalk.yellow('Manual configuration instructions:'));
      console.log('1. Open Cursor → Preferences');
      console.log('2. Go to Features → MCP Servers');
      console.log('3. Copy the configuration from mcp-config-template.json');
    }
  }

  generateMCPConfig() {
    const config = { mcpServers: {} };

    if (this.config.mcpServers.includes('playwright')) {
      config.mcpServers.playwright = {
        command: 'npx',
        args: ['@playwright/mcp@latest'],
        description: 'Browser automation for screenshots, testing, and UX analysis'
      };
    }

    if (this.config.mcpServers.includes('firecrawl')) {
      config.mcpServers.firecrawl = {
        command: 'npx',
        args: ['-y', 'firecrawl-mcp'],
        env: { FIRECRAWL_API_KEY: '${FIRECRAWL_API_KEY}' },
        description: 'Web scraping and content extraction'
      };
    }

    if (this.config.mcpServers.includes('perplexity')) {
      config.mcpServers.perplexity = {
        command: 'npx',
        args: ['-y', 'perplexity-mcp'],
        env: { PERPLEXITY_API_KEY: '${PERPLEXITY_API_KEY}' },
        description: 'AI-powered research and search'
      };
    }

    if (this.config.mcpServers.includes('dataforseo')) {
      config.mcpServers.dataforseo = {
        command: 'npx',
        args: ['-y', 'dataforseo-mcp'],
        env: {
          DATAFORSEO_LOGIN: '${DATAFORSEO_LOGIN}',
          DATAFORSEO_PASSWORD: '${DATAFORSEO_PASSWORD}'
        },
        description: 'SEO keyword research and validation'
      };
    }

    if (this.config.mcpServers.includes('xero')) {
      config.mcpServers.xero = {
        command: 'npx',
        args: ['-y', 'mcp-server-xero'],
        env: {
          XERO_CLIENT_ID: '${XERO_CLIENT_ID}',
          XERO_CLIENT_SECRET: '${XERO_CLIENT_SECRET}',
          XERO_REDIRECT_URI: '${XERO_REDIRECT_URI}'
        },
        description: 'Accounting and financial data'
      };
    }

    return config;
  }

  async setupProject() {
    if (!this.config.createSampleProject) return;

    const spinner = ora('Setting up sample project...').start();

    // Create project structure
    const dirs = [
      'src/pages',
      'src/components',
      'src/lib',
      'public',
      'content/context',
      'workflows',
      'templates'
    ];

    dirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    // Create Next.js config
    this.createNextConfig();
    
    // Create Tailwind config
    this.createTailwindConfig();

    // Create sample pages
    this.createSamplePages();

    // Create business context file
    this.createBusinessContext();

    spinner.succeed('Sample project structure created');
  }

  createNextConfig() {
    const config = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    BUSINESS_NAME: process.env.BUSINESS_NAME,
    BUSINESS_DOMAIN: process.env.BUSINESS_DOMAIN,
  },
}

module.exports = nextConfig`;

    fs.writeFileSync(path.join(this.projectRoot, 'next.config.js'), config);
  }

  createTailwindConfig() {
    const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}`;

    fs.writeFileSync(path.join(this.projectRoot, 'tailwind.config.js'), config);
  }

  createSamplePages() {
    // Create a sample comparison page component
    const samplePage = `import { useState } from 'react';
import Head from 'next/head';

export default function ToolComparison() {
  const [selectedTool, setSelectedTool] = useState('tool1');

  return (
    <>
      <Head>
        <title>AI Tool Comparison - ${this.config.businessName}</title>
        <meta name="description" content="Compare the best AI tools for your business needs" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            AI Tool Comparison
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Find the Perfect AI Tool for Your Business
            </h2>
            
            <p className="text-gray-600 mb-6">
              This is a sample comparison page created by your MCP Business Operations setup.
              Use Claude Code to build real comparison pages based on your research.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Tool A</h3>
                <p className="text-gray-600">Features and benefits...</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Tool B</h3>
                <p className="text-gray-600">Features and benefits...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}`;

    fs.writeFileSync(path.join(this.projectRoot, 'src/pages/comparison.js'), samplePage);
  }

  createBusinessContext() {
    const context = `# ${this.config.businessName} Business Context

## Company Overview
- **Name**: ${this.config.businessName}
- **Domain**: ${this.config.businessDomain}
- **Industry**: ${this.config.businessIndustry}

## Target Keywords
- Add your target keywords here
- Use these in your content strategy

## Brand Voice & Messaging
- Professional and helpful
- Focus on practical solutions
- Data-driven insights

## Content Strategy
- Tool comparisons and reviews
- Industry insights and trends
- Practical guides and tutorials

## Programmatic SEO Strategy
- Focus on [industry] tool comparisons
- Target long-tail keywords
- Create comprehensive comparison pages
- Build topical authority in your niche

## Call-to-Actions
- Newsletter signup
- Free consultation
- Product demo request
- Community membership

Use this context file in your MCP prompts to ensure consistent messaging and strategy.`;

    fs.writeFileSync(path.join(this.projectRoot, 'content/context/business-context.md'), context);
  }

  async validateSetup() {
    const spinner = ora('Validating setup...').start();

    const validations = [
      { check: () => fs.existsSync(this.envPath), message: 'Environment file exists' },
      { check: () => fs.existsSync(path.join(this.projectRoot, 'node_modules')), message: 'Dependencies installed' },
      { check: () => fs.existsSync(path.join(this.projectRoot, 'src')), message: 'Project structure created' },
    ];

    for (const validation of validations) {
      if (validation.check()) {
        spinner.text = `✅ ${validation.message}`;
      } else {
        spinner.fail(`❌ ${validation.message}`);
        return;
      }
    }

    spinner.succeed('Setup validation completed');
  }

  async showCompletionMessage() {
    console.log(chalk.green('\n🎉 Setup completed successfully!\n'));
    
    console.log(chalk.cyan('📋 Next Steps:'));
    console.log('1. Add your API keys to .env file');
    console.log('2. Restart Cursor to load MCP configuration');
    console.log('3. Test MCPs with: npm run test-mcps');
    console.log('4. Start development server: npm run dev');
    
    if (this.config.installClaudeCode) {
      console.log('5. Test Claude Code in terminal: claude');
    }
    
    console.log('\n📚 Quick Start Commands:');
    console.log(chalk.yellow('npm run dev          ') + '# Start development server');
    console.log(chalk.yellow('npm run test-mcps    ') + '# Test MCP connections');
    console.log(chalk.yellow('npm run validate-setup') + '# Validate configuration');
    
    console.log('\n📖 Documentation:');
    console.log('• README.md - Overview and getting started');
    console.log('• advanced-claude-code-workflow.md - Development workflow');
    console.log('• example-prompts.md - Ready-to-use prompts');
    
    console.log(chalk.green('\n✨ Happy building with MCP Business Operations!'));
  }
}

// Run setup
const setup = new MCPBusinessSetup();
setup.run().catch(console.error);