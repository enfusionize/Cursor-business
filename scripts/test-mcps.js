#!/usr/bin/env node

const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(chalk.cyan('🧪 Testing MCP Connections\n'));

class MCPTester {
  constructor() {
    this.results = [];
    this.envPath = path.join(process.cwd(), '.env');
    this.loadEnvironment();
  }

  loadEnvironment() {
    if (fs.existsSync(this.envPath)) {
      require('dotenv').config();
    }
  }

  async runAllTests() {
    console.log(chalk.yellow('Testing all configured MCP servers...\n'));

    const tests = [
      { name: 'Playwright MCP', test: () => this.testPlaywright() },
      { name: 'Firecrawl MCP', test: () => this.testFirecrawl() },
      { name: 'Perplexity MCP', test: () => this.testPerplexity() },
      { name: 'DataForSEO MCP', test: () => this.testDataForSEO() },
      { name: 'Xero MCP', test: () => this.testXero() },
    ];

    for (const test of tests) {
      await this.runTest(test.name, test.test);
    }

    this.showSummary();
  }

  async runTest(name, testFunction) {
    const spinner = ora(`Testing ${name}...`).start();
    
    try {
      const result = await testFunction();
      if (result.success) {
        spinner.succeed(`${name}: ${result.message}`);
        this.results.push({ name, status: 'success', message: result.message });
      } else {
        spinner.warn(`${name}: ${result.message}`);
        this.results.push({ name, status: 'warning', message: result.message });
      }
    } catch (error) {
      spinner.fail(`${name}: ${error.message}`);
      this.results.push({ name, status: 'error', message: error.message });
    }
  }

  async testPlaywright() {
    try {
      // Check if Playwright is installed
      execSync('npx playwright --version', { stdio: 'pipe' });
      
      // Check if browsers are installed
      try {
        execSync('npx playwright install --dry-run chromium', { stdio: 'pipe' });
        return { success: true, message: 'Ready for browser automation' };
      } catch (browserError) {
        return { success: false, message: 'Browsers not installed - run: npx playwright install' };
      }
    } catch (error) {
      return { success: false, message: 'Not installed - run: npm install @playwright/mcp' };
    }
  }

  async testFirecrawl() {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!apiKey || apiKey === 'your_firecrawl_api_key_here') {
      return { success: false, message: 'API key not configured in .env file' };
    }

    try {
      // Test API key format (basic validation)
      if (apiKey.startsWith('fc-')) {
        return { success: true, message: 'API key configured (format looks correct)' };
      } else {
        return { success: false, message: 'API key format may be incorrect' };
      }
    } catch (error) {
      return { success: false, message: 'Configuration error' };
    }
  }

  async testPerplexity() {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey || apiKey === 'your_perplexity_api_key_here') {
      return { success: false, message: 'API key not configured in .env file' };
    }

    try {
      // Test API key format (basic validation)
      if (apiKey.startsWith('pplx-')) {
        return { success: true, message: 'API key configured (format looks correct)' };
      } else {
        return { success: false, message: 'API key format may be incorrect' };
      }
    } catch (error) {
      return { success: false, message: 'Configuration error' };
    }
  }

  async testDataForSEO() {
    const login = process.env.DATAFORSEO_LOGIN;
    const password = process.env.DATAFORSEO_PASSWORD;
    
    if (!login || !password || login === 'your_dataforseo_login_here') {
      return { success: false, message: 'Credentials not configured in .env file' };
    }

    try {
      // Basic validation
      if (login.includes('@') && password.length > 5) {
        return { success: true, message: 'Credentials configured (format looks correct)' };
      } else {
        return { success: false, message: 'Credentials format may be incorrect' };
      }
    } catch (error) {
      return { success: false, message: 'Configuration error' };
    }
  }

  async testXero() {
    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;
    
    if (!clientId || !clientSecret || clientId === 'your_xero_client_id_here') {
      return { success: false, message: 'Credentials not configured in .env file' };
    }

    try {
      // Basic validation
      if (clientId.length > 10 && clientSecret.length > 10 && redirectUri) {
        return { success: true, message: 'Credentials configured (format looks correct)' };
      } else {
        return { success: false, message: 'Credentials format may be incorrect' };
      }
    } catch (error) {
      return { success: false, message: 'Configuration error' };
    }
  }

  showSummary() {
    console.log('\n' + chalk.cyan('📊 Test Summary:'));
    
    const successful = this.results.filter(r => r.status === 'success');
    const warnings = this.results.filter(r => r.status === 'warning');
    const errors = this.results.filter(r => r.status === 'error');

    console.log(chalk.green(`✅ ${successful.length} MCPs ready`));
    console.log(chalk.yellow(`⚠️  ${warnings.length} MCPs need configuration`));
    console.log(chalk.red(`❌ ${errors.length} MCPs have errors`));

    if (warnings.length > 0 || errors.length > 0) {
      console.log('\n' + chalk.cyan('🔧 Recommended Actions:'));
      
      [...warnings, ...errors].forEach(result => {
        console.log(`• ${result.name}: ${result.message}`);
      });

      console.log('\n' + chalk.blue('💡 Quick Fixes:'));
      console.log('1. Copy .env.example to .env and add your API keys');
      console.log('2. For free testing, Playwright works without API keys');
      console.log('3. Get Firecrawl free API key: https://firecrawl.dev');
      console.log('4. Get Perplexity API key: https://www.perplexity.ai/settings/api');
    }

    if (successful.length > 0) {
      console.log('\n' + chalk.green('🎉 Ready to test in Cursor!'));
      console.log('Try these prompts in Cursor Agent:');
      
      if (successful.some(r => r.name === 'Playwright MCP')) {
        console.log(chalk.gray('• "Use Playwright to take a screenshot of google.com"'));
      }
      
      if (successful.some(r => r.name === 'Firecrawl MCP')) {
        console.log(chalk.gray('• "Use Firecrawl to scrape the homepage of example.com"'));
      }
      
      if (successful.some(r => r.name === 'Perplexity MCP')) {
        console.log(chalk.gray('• "Use Perplexity to research AI trends in 2024"'));
      }
    }

    console.log('\n' + chalk.cyan('📚 Next Steps:'));
    console.log('1. Fix any configuration issues above');
    console.log('2. Restart Cursor to load MCP changes');
    console.log('3. Test with Cursor Agent (Cmd+L)');
    console.log('4. Try Claude Code in terminal: claude');
  }
}

// Additional utility functions
function checkCursorConfig() {
  const possiblePaths = [
    path.join(process.env.HOME || process.env.USERPROFILE, '.cursor', 'settings.json'),
    path.join(process.env.HOME || process.env.USERPROFILE, 'Library', 'Application Support', 'Cursor', 'User', 'settings.json'),
    path.join(process.env.APPDATA, 'Cursor', 'User', 'settings.json'),
    path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'Cursor', 'User', 'settings.json')
  ];

  console.log(chalk.cyan('\n🔍 Checking Cursor Configuration...\n'));

  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      console.log(chalk.green(`✅ Found Cursor config: ${configPath}`));
      
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.mcpServers) {
          const mcpCount = Object.keys(config.mcpServers).length;
          console.log(chalk.green(`✅ ${mcpCount} MCP servers configured in Cursor`));
          
          Object.keys(config.mcpServers).forEach(server => {
            console.log(chalk.gray(`   • ${server}`));
          });
        } else {
          console.log(chalk.yellow('⚠️  No MCP servers configured in Cursor'));
          console.log(chalk.blue('💡 Add MCP configuration manually:'));
          console.log('   1. Open Cursor → Preferences');
          console.log('   2. Go to Features → MCP Servers');
          console.log('   3. Copy config from mcp-config-template.json');
        }
      } catch (error) {
        console.log(chalk.red('❌ Error reading Cursor config'));
      }
      return;
    }
  }
  
  console.log(chalk.yellow('⚠️  Cursor config file not found'));
  console.log(chalk.blue('💡 Make sure Cursor is installed and has been run at least once'));
}

function testClaudeCode() {
  console.log(chalk.cyan('\n⚡ Testing Claude Code...\n'));
  
  try {
    const result = execSync('claude --version', { encoding: 'utf8', stdio: 'pipe' });
    console.log(chalk.green(`✅ Claude Code installed: ${result.trim()}`));
    console.log(chalk.blue('💡 Test in terminal: claude'));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Claude Code not installed'));
    console.log(chalk.blue('💡 Install with: npm install -g @anthropic-ai/claude-dev'));
  }
}

// Run all tests
async function main() {
  const tester = new MCPTester();
  await tester.runAllTests();
  checkCursorConfig();
  testClaudeCode();
  
  console.log('\n' + chalk.green('🎯 Testing complete! Check the summary above for next steps.'));
}

main().catch(console.error);