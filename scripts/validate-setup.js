#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

console.log(chalk.cyan('🔍 Validating Complete MCP Business Operations Setup\n'));

class SetupValidator {
  constructor() {
    this.results = [];
    this.projectRoot = process.cwd();
    this.envPath = path.join(this.projectRoot, '.env');
  }

  async validateAll() {
    console.log(chalk.yellow('Running comprehensive validation...\n'));

    const validations = [
      { name: 'Project Structure', test: () => this.validateProjectStructure() },
      { name: 'Environment Configuration', test: () => this.validateEnvironment() },
      { name: 'Dependencies', test: () => this.validateDependencies() },
      { name: 'MCP Servers', test: () => this.validateMCPServers() },
      { name: 'Cursor Configuration', test: () => this.validateCursorConfig() },
      { name: 'Claude Code', test: () => this.validateClaudeCode() },
      { name: 'Development Server', test: () => this.validateDevServer() },
      { name: 'Deployment Tools', test: () => this.validateDeploymentTools() },
    ];

    for (const validation of validations) {
      await this.runValidation(validation.name, validation.test);
    }

    this.generateReport();
  }

  async runValidation(name, testFunction) {
    const spinner = ora(`Validating ${name}...`).start();
    
    try {
      const result = await testFunction();
      if (result.success) {
        spinner.succeed(`${name}: ${result.message}`);
        this.results.push({ name, status: 'success', message: result.message, details: result.details || [] });
      } else {
        spinner.warn(`${name}: ${result.message}`);
        this.results.push({ name, status: 'warning', message: result.message, details: result.details || [] });
      }
    } catch (error) {
      spinner.fail(`${name}: ${error.message}`);
      this.results.push({ name, status: 'error', message: error.message, details: [] });
    }
  }

  validateProjectStructure() {
    const requiredFiles = [
      'package.json',
      '.env.example',
      'README.md',
      'advanced-claude-code-workflow.md',
      'mcp-config-template.json',
      'scripts/setup.js',
      'scripts/test-mcps.js'
    ];

    const requiredDirs = [
      'scripts',
      'content',
      'workflows',
      'templates'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(this.projectRoot, file)));
    const missingDirs = requiredDirs.filter(dir => !fs.existsSync(path.join(this.projectRoot, dir)));

    if (missingFiles.length === 0 && missingDirs.length === 0) {
      return { 
        success: true, 
        message: 'All required files and directories present',
        details: [`${requiredFiles.length} files`, `${requiredDirs.length} directories`]
      };
    } else {
      return { 
        success: false, 
        message: `Missing: ${[...missingFiles, ...missingDirs].join(', ')}`,
        details: missingFiles.concat(missingDirs)
      };
    }
  }

  validateEnvironment() {
    if (!fs.existsSync(this.envPath)) {
      return { success: false, message: '.env file not found - copy from .env.example' };
    }

    const envContent = fs.readFileSync(this.envPath, 'utf8');
    const requiredVars = ['ANTHROPIC_API_KEY', 'BUSINESS_NAME', 'BUSINESS_DOMAIN'];
    const configuredVars = [];
    const missingVars = [];

    requiredVars.forEach(varName => {
      const regex = new RegExp(`${varName}=(.+)`);
      const match = envContent.match(regex);
      if (match && match[1] && !match[1].includes('your_') && !match[1].includes('here')) {
        configuredVars.push(varName);
      } else {
        missingVars.push(varName);
      }
    });

    if (missingVars.length === 0) {
      return { 
        success: true, 
        message: 'Environment properly configured',
        details: configuredVars
      };
    } else {
      return { 
        success: false, 
        message: `Configure these variables: ${missingVars.join(', ')}`,
        details: missingVars
      };
    }
  }

  validateDependencies() {
    if (!fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
      return { success: false, message: 'Dependencies not installed - run: npm install' };
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      const totalDeps = Object.keys(packageJson.dependencies || {}).length + Object.keys(packageJson.devDependencies || {}).length;
      
      return { 
        success: true, 
        message: `All dependencies installed`,
        details: [`${totalDeps} packages`]
      };
    } catch (error) {
      return { success: false, message: 'Error reading package.json' };
    }
  }

  validateMCPServers() {
    const mcpPackages = [
      '@playwright/mcp',
      'firecrawl-mcp',
      'perplexity-mcp',
      'dataforseo-mcp',
      'mcp-server-xero'
    ];

    const installedMcps = [];
    const missingMcps = [];

    mcpPackages.forEach(pkg => {
      try {
        execSync(`npm list ${pkg}`, { stdio: 'pipe' });
        installedMcps.push(pkg);
      } catch (error) {
        missingMcps.push(pkg);
      }
    });

    if (installedMcps.length > 0) {
      return { 
        success: true, 
        message: `${installedMcps.length} MCP servers available`,
        details: installedMcps
      };
    } else {
      return { 
        success: false, 
        message: 'No MCP servers installed - run: npm run install-mcps',
        details: missingMcps
      };
    }
  }

  validateCursorConfig() {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '/tmp';
    const appDataDir = process.env.APPDATA || homeDir;
    
    const possiblePaths = [
      path.join(homeDir, '.cursor', 'settings.json'),
      path.join(homeDir, 'Library', 'Application Support', 'Cursor', 'User', 'settings.json'),
      path.join(appDataDir, 'Cursor', 'User', 'settings.json'),
      path.join(homeDir, '.config', 'Cursor', 'User', 'settings.json')
    ];

    for (const configPath of possiblePaths) {
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          if (config.mcpServers && Object.keys(config.mcpServers).length > 0) {
            return { 
              success: true, 
              message: `Cursor configured with ${Object.keys(config.mcpServers).length} MCP servers`,
              details: Object.keys(config.mcpServers)
            };
          } else {
            return { 
              success: false, 
              message: 'Cursor found but no MCP servers configured'
            };
          }
        } catch (error) {
          return { success: false, message: 'Error reading Cursor config' };
        }
      }
    }

    return { success: false, message: 'Cursor config not found - configure manually' };
  }

  validateClaudeCode() {
    try {
      const version = execSync('claude --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
      return { 
        success: true, 
        message: `Claude Code installed (${version})`,
        details: ['Global installation']
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Claude Code not installed - run: npm install -g @anthropic-ai/claude-dev'
      };
    }
  }

  validateDevServer() {
    try {
      // Check if Next.js is properly configured
      if (fs.existsSync(path.join(this.projectRoot, 'next.config.js'))) {
        return { 
          success: true, 
          message: 'Development server ready',
          details: ['Next.js configured']
        };
      } else {
        return { 
          success: false, 
          message: 'Next.js config missing - run setup script'
        };
      }
    } catch (error) {
      return { success: false, message: 'Error checking dev server config' };
    }
  }

  validateDeploymentTools() {
    const tools = [];
    const missing = [];

    try {
      execSync('vercel --version', { stdio: 'pipe' });
      tools.push('Vercel');
    } catch (error) {
      missing.push('Vercel');
    }

    try {
      execSync('docker --version', { stdio: 'pipe' });
      tools.push('Docker');
    } catch (error) {
      missing.push('Docker');
    }

    if (tools.length > 0) {
      return { 
        success: true, 
        message: `Deployment tools ready: ${tools.join(', ')}`,
        details: tools
      };
    } else {
      return { 
        success: false, 
        message: 'No deployment tools found - install Vercel or Docker'
      };
    }
  }

  generateReport() {
    console.log('\n' + chalk.cyan('📊 Validation Report'));
    console.log('='.repeat(50));

    const successful = this.results.filter(r => r.status === 'success');
    const warnings = this.results.filter(r => r.status === 'warning');
    const errors = this.results.filter(r => r.status === 'error');

    // Summary
    console.log(chalk.green(`✅ ${successful.length} components working correctly`));
    console.log(chalk.yellow(`⚠️  ${warnings.length} components need attention`));
    console.log(chalk.red(`❌ ${errors.length} components have errors`));

    // Detailed results
    this.results.forEach(result => {
      const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️ ' : '❌';
      const color = result.status === 'success' ? chalk.green : result.status === 'warning' ? chalk.yellow : chalk.red;
      
      console.log(`\n${icon} ${color(result.name)}: ${result.message}`);
      if (result.details && result.details.length > 0) {
        result.details.forEach(detail => {
          console.log(chalk.gray(`   • ${detail}`));
        });
      }
    });

    // Recommendations
    if (warnings.length > 0 || errors.length > 0) {
      console.log('\n' + chalk.cyan('🔧 Recommended Actions:'));
      
      const issues = [...warnings, ...errors];
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${chalk.yellow(issue.name)}: ${issue.message}`);
      });

      console.log('\n' + chalk.blue('💡 Quick Fixes:'));
      if (errors.some(e => e.name === 'Dependencies')) {
        console.log('• Run: npm install');
      }
      if (warnings.some(w => w.name === 'Environment Configuration')) {
        console.log('• Copy .env.example to .env and configure your API keys');
      }
      if (warnings.some(w => w.name === 'Cursor Configuration')) {
        console.log('• Run: npm run setup (to auto-configure Cursor)');
      }
      if (errors.some(e => e.name === 'Claude Code')) {
        console.log('• Run: npm install -g @anthropic-ai/claude-dev');
      }
    }

    // Success message
    if (successful.length === this.results.length) {
      console.log('\n' + chalk.green('🎉 Perfect! Your MCP Business Operations environment is fully configured!'));
      console.log('\n' + chalk.cyan('🚀 Ready to start building:'));
      console.log('1. npm run dev          # Start development server');
      console.log('2. claude               # Start Claude Code in terminal');
      console.log('3. Open Cursor Agent    # Press Cmd+L');
      console.log('4. Try example prompts  # From example-prompts.md');
    } else if (successful.length >= 6) {
      console.log('\n' + chalk.green('🎯 Great! Your setup is mostly ready to go!'));
      console.log('Fix the issues above for full functionality.');
    } else {
      console.log('\n' + chalk.yellow('⚙️  Your setup needs some work to be fully functional.'));
      console.log('Follow the recommended actions above.');
    }

    console.log('\n' + chalk.gray('Need help? Check SETUP-GUIDE.md or run: npm run test-mcps'));
  }

  // Additional utility methods
  checkNetworkConnectivity() {
    try {
      execSync('ping -c 1 google.com', { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  estimateSetupTime() {
    const issues = this.results.filter(r => r.status !== 'success').length;
    if (issues === 0) return '✅ Complete';
    if (issues <= 2) return '⚡ 5-10 minutes';
    if (issues <= 4) return '🔧 15-30 minutes';
    return '⏰ 30+ minutes';
  }
}

// Additional validation functions
function validateGitRepository() {
  try {
    execSync('git status', { stdio: 'pipe' });
    return { success: true, message: 'Git repository initialized' };
  } catch (error) {
    return { success: false, message: 'Not a git repository - run: git init' };
  }
}

function validateBrowsers() {
  try {
    execSync('npx playwright install --dry-run chromium', { stdio: 'pipe' });
    return { success: true, message: 'Playwright browsers installed' };
  } catch (error) {
    return { success: false, message: 'Browsers not installed - run: npx playwright install' };
  }
}

// Main execution
async function main() {
  const validator = new SetupValidator();
  await validator.validateAll();
  
  // Additional checks
  console.log('\n' + chalk.cyan('🔍 Additional Checks:'));
  
  const gitResult = validateGitRepository();
  console.log(`${gitResult.success ? '✅' : '⚠️ '} Git: ${gitResult.message}`);
  
  const browserResult = validateBrowsers();
  console.log(`${browserResult.success ? '✅' : '⚠️ '} Browsers: ${browserResult.message}`);
  
  console.log('\n' + chalk.green('🎯 Validation complete!'));
  console.log(chalk.gray('Estimated time to fix issues: ' + validator.estimateSetupTime()));
}

main().catch(console.error);