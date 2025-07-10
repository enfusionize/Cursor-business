#!/usr/bin/env node

/**
 * ClickUp Integration Test Script
 * Validates API connection, tests basic functionality, and provides diagnostic information
 */

import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { config } from 'dotenv';
import { readFileSync, existsSync } from 'fs';

config();

class ClickUpTester {
  constructor() {
    this.apiKey = process.env.CLICKUP_API_KEY;
    this.teamId = process.env.CLICKUP_TEAM_ID;
    this.workspaceId = process.env.CLICKUP_WORKSPACE_ID;
    this.baseURL = 'https://api.clickup.com/api/v2';
    
    this.results = {
      tests: [],
      passed: 0,
      failed: 0,
      warnings: 0
    };
  }

  async runTests() {
    console.log(chalk.blue('\n🧪 ClickUp Integration Test Suite\n'));
    
    // Environment validation
    await this.testEnvironmentConfiguration();
    
    // API connection tests
    await this.testAPIConnection();
    
    // Workspace and team tests
    await this.testWorkspaceAccess();
    
    // MCP server tests
    await this.testMCPServer();
    
    // Integration features tests
    await this.testIntegrationFeatures();
    
    // Display results
    this.displayResults();
    
    // Recommendations
    await this.showRecommendations();
  }

  async testEnvironmentConfiguration() {
    console.log(chalk.yellow('📋 Testing Environment Configuration...'));
    
    const envTests = [
      {
        name: 'CLICKUP_API_KEY configured',
        test: () => !!this.apiKey,
        critical: true
      },
      {
        name: 'CLICKUP_TEAM_ID configured',
        test: () => !!this.teamId,
        critical: false
      },
      {
        name: 'CLICKUP_WORKSPACE_ID configured',
        test: () => !!this.workspaceId,
        critical: false
      },
      {
        name: '.env file exists',
        test: () => existsSync('.env'),
        critical: false
      },
      {
        name: 'MCP configuration includes ClickUp',
        test: () => {
          try {
            const config = JSON.parse(readFileSync('mcp-config.json', 'utf8'));
            return !!config.mcpServers?.clickup;
          } catch {
            return false;
          }
        },
        critical: false
      }
    ];

    for (const envTest of envTests) {
      const passed = envTest.test();
      this.recordResult(envTest.name, passed, envTest.critical);
      
      if (!passed && envTest.critical) {
        console.log(chalk.red(`❌ ${envTest.name} - CRITICAL FAILURE`));
        return false;
      }
    }

    return true;
  }

  async testAPIConnection() {
    console.log(chalk.yellow('🔌 Testing ClickUp API Connection...'));
    
    if (!this.apiKey) {
      this.recordResult('API Connection', false, true);
      console.log(chalk.red('❌ Cannot test API - No API key configured'));
      return false;
    }

    try {
      // Test basic authentication
      const userResponse = await this.makeRequest('GET', '/user');
      this.recordResult('API Authentication', true);
      console.log(chalk.green(`✅ Connected as: ${userResponse.user.username}`));
      
      // Test API rate limits
      await this.testRateLimits();
      
      return true;
    } catch (error) {
      this.recordResult('API Connection', false, true);
      console.log(chalk.red(`❌ API Connection failed: ${error.message}`));
      return false;
    }
  }

  async testRateLimits() {
    try {
      // Make a few quick requests to test rate limiting
      const promises = Array(3).fill().map(() => this.makeRequest('GET', '/user'));
      await Promise.all(promises);
      
      this.recordResult('API Rate Limits', true);
      console.log(chalk.green('✅ API rate limits OK'));
    } catch (error) {
      this.recordResult('API Rate Limits', false);
      console.log(chalk.yellow(`⚠️ Rate limit warning: ${error.message}`));
    }
  }

  async testWorkspaceAccess() {
    console.log(chalk.yellow('🏢 Testing Workspace Access...'));
    
    try {
      // Get user's teams
      const userResponse = await this.makeRequest('GET', '/user');
      const teams = userResponse.user.teams || [];
      
      this.recordResult('Teams Access', teams.length > 0);
      console.log(chalk.green(`✅ Found ${teams.length} team(s)`));
      
      // Test specific team if configured
      if (this.teamId) {
        const teamExists = teams.some(team => team.id === this.teamId);
        this.recordResult('Configured Team Access', teamExists);
        
        if (teamExists) {
          console.log(chalk.green(`✅ Team ${this.teamId} accessible`));
          
          // Test spaces in team
          await this.testSpacesAccess();
        } else {
          console.log(chalk.red(`❌ Team ${this.teamId} not accessible`));
        }
      }
      
    } catch (error) {
      this.recordResult('Workspace Access', false);
      console.log(chalk.red(`❌ Workspace access failed: ${error.message}`));
    }
  }

  async testSpacesAccess() {
    try {
      const spacesResponse = await this.makeRequest('GET', `/team/${this.teamId}/space`);
      const spaces = spacesResponse.spaces || [];
      
      this.recordResult('Spaces Access', spaces.length > 0);
      console.log(chalk.green(`✅ Found ${spaces.length} space(s) in team`));
      
      // Test configured workspace/space
      if (this.workspaceId) {
        const spaceExists = spaces.some(space => space.id === this.workspaceId);
        this.recordResult('Configured Space Access', spaceExists);
        
        if (spaceExists) {
          console.log(chalk.green(`✅ Space ${this.workspaceId} accessible`));
        } else {
          console.log(chalk.red(`❌ Space ${this.workspaceId} not accessible`));
        }
      }
      
    } catch (error) {
      this.recordResult('Spaces Access', false);
      console.log(chalk.yellow(`⚠️ Spaces access warning: ${error.message}`));
    }
  }

  async testMCPServer() {
    console.log(chalk.yellow('🔧 Testing MCP Server Configuration...'));
    
    try {
      // Check if MCP server file exists
      const mcpExists = existsSync('./mcps/clickup-mcp-server.js');
      this.recordResult('MCP Server File', mcpExists);
      
      if (mcpExists) {
        console.log(chalk.green('✅ ClickUp MCP server file found'));
      } else {
        console.log(chalk.red('❌ ClickUp MCP server file missing'));
      }
      
      // Check MCP configuration
      try {
        const configExists = existsSync('mcp-config.json') || existsSync('mcp-config-template.json');
        this.recordResult('MCP Configuration', configExists);
        
        if (configExists) {
          const configFile = existsSync('mcp-config.json') ? 'mcp-config.json' : 'mcp-config-template.json';
          const config = JSON.parse(readFileSync(configFile, 'utf8'));
          const hasClickUp = !!config.mcpServers?.clickup;
          
          this.recordResult('ClickUp in MCP Config', hasClickUp);
          
          if (hasClickUp) {
            console.log(chalk.green('✅ ClickUp configured in MCP'));
          } else {
            console.log(chalk.yellow('⚠️ ClickUp not found in MCP configuration'));
          }
        }
      } catch (error) {
        this.recordResult('MCP Configuration', false);
        console.log(chalk.red(`❌ MCP configuration error: ${error.message}`));
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ MCP server test failed: ${error.message}`));
    }
  }

  async testIntegrationFeatures() {
    console.log(chalk.yellow('🚀 Testing Integration Features...'));
    
    // Test webhook capabilities
    try {
      const webhookPort = process.env.CLICKUP_WEBHOOK_PORT || 3001;
      this.recordResult('Webhook Port Configuration', !!webhookPort);
      console.log(chalk.green(`✅ Webhook port configured: ${webhookPort}`));
    } catch (error) {
      this.recordResult('Webhook Configuration', false);
    }
    
    // Test automation daemon
    try {
      const daemonExists = existsSync('./scripts/clickup-automation-daemon.js');
      this.recordResult('Automation Daemon', daemonExists);
      
      if (daemonExists) {
        console.log(chalk.green('✅ ClickUp automation daemon available'));
      } else {
        console.log(chalk.red('❌ ClickUp automation daemon missing'));
      }
    } catch (error) {
      this.recordResult('Automation Daemon', false);
    }
    
    // Test project docs directory
    try {
      const docsPath = process.env.CLICKUP_DOCS_PATH || './project-docs';
      this.recordResult('Docs Path Configuration', !!docsPath);
      console.log(chalk.green(`✅ Project docs path: ${docsPath}`));
    } catch (error) {
      this.recordResult('Project Docs', false);
    }
  }

  async makeRequest(method, endpoint, data = null) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  }

  recordResult(testName, passed, critical = false) {
    this.results.tests.push({
      name: testName,
      passed,
      critical
    });

    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
      if (!critical) {
        this.results.warnings++;
      }
    }
  }

  displayResults() {
    console.log(chalk.blue('\n📊 Test Results Summary\n'));
    
    const totalTests = this.results.tests.length;
    const passRate = ((this.results.passed / totalTests) * 100).toFixed(1);
    
    console.log(chalk.green(`✅ Passed: ${this.results.passed}/${totalTests} (${passRate}%)`));
    console.log(chalk.red(`❌ Failed: ${this.results.failed}`));
    console.log(chalk.yellow(`⚠️  Warnings: ${this.results.warnings}`));
    
    // Show failed tests
    const failedTests = this.results.tests.filter(test => !test.passed);
    if (failedTests.length > 0) {
      console.log(chalk.red('\n❌ Failed Tests:'));
      failedTests.forEach(test => {
        const symbol = test.critical ? '🚨' : '⚠️';
        console.log(chalk.red(`${symbol} ${test.name}`));
      });
    }
  }

  async showRecommendations() {
    console.log(chalk.blue('\n💡 Recommendations\n'));
    
    const criticalFailures = this.results.tests.filter(test => !test.passed && test.critical);
    
    if (criticalFailures.length > 0) {
      console.log(chalk.red('🚨 Critical Issues to Fix:'));
      
      if (!this.apiKey) {
        console.log(chalk.yellow('1. Configure ClickUp API Key:'));
        console.log(chalk.gray('   • Go to ClickUp > Settings > Apps > API'));
        console.log(chalk.gray('   • Generate a personal API token'));
        console.log(chalk.gray('   • Add CLICKUP_API_KEY=your-token to .env file'));
      }
      
      if (!this.teamId) {
        console.log(chalk.yellow('2. Configure Team ID:'));
        console.log(chalk.gray('   • Check your ClickUp URL: https://app.clickup.com/{team_id}/'));
        console.log(chalk.gray('   • Add CLICKUP_TEAM_ID=your-team-id to .env file'));
      }
      
    } else {
      console.log(chalk.green('✅ Core integration is working!'));
      
      if (this.results.warnings > 0) {
        console.log(chalk.yellow('\n⚠️ Optional Improvements:'));
        
        if (!this.workspaceId) {
          console.log(chalk.gray('• Configure CLICKUP_WORKSPACE_ID for better space targeting'));
        }
        
        if (!existsSync('mcp-config.json')) {
          console.log(chalk.gray('• Copy mcp-config-template.json to mcp-config.json and customize'));
        }
      }
      
      console.log(chalk.blue('\n🚀 Next Steps:'));
      console.log(chalk.gray('• Start the ClickUp automation daemon: npm run start-clickup'));
      console.log(chalk.gray('• Use ClickUp MCP tools in Cursor for task management'));
      console.log(chalk.gray('• Set up project sync: sync_cursor_project'));
      console.log(chalk.gray('• Configure automation rules: setup_automation_rules'));
    }
    
    // Ask if user wants to see detailed guide
    const showGuide = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'guide',
        message: 'Would you like to see the detailed ClickUp integration guide?',
        default: false
      }
    ]);
    
    if (showGuide.guide) {
      this.showDetailedGuide();
    }
  }

  showDetailedGuide() {
    console.log(chalk.blue('\n📚 ClickUp Integration Setup Guide\n'));
    
    console.log(chalk.yellow('🔑 API Key Setup:'));
    console.log('1. Go to ClickUp Settings > Apps');
    console.log('2. Click on "API" in the left sidebar');
    console.log('3. Click "Generate API Key"');
    console.log('4. Copy the generated key to your .env file\n');
    
    console.log(chalk.yellow('🏢 Team & Workspace Setup:'));
    console.log('1. Check your ClickUp URL when logged in');
    console.log('2. The URL format is: https://app.clickup.com/{team_id}/');
    console.log('3. Note the team_id from the URL');
    console.log('4. Go to a specific space and note the space_id from URL\n');
    
    console.log(chalk.yellow('🔧 Configuration:'));
    console.log('Add these to your .env file:');
    console.log(chalk.gray('CLICKUP_API_KEY=your-api-key-here'));
    console.log(chalk.gray('CLICKUP_TEAM_ID=your-team-id-here'));
    console.log(chalk.gray('CLICKUP_WORKSPACE_ID=your-workspace-id-here\n'));
    
    console.log(chalk.yellow('🚀 Usage:'));
    console.log('1. Start automation daemon: npm run start-clickup');
    console.log('2. In Cursor, use ClickUp MCP tools:');
    console.log('   • create_task - Create tasks with AI context');
    console.log('   • sync_cursor_project - Sync entire project');
    console.log('   • auto_manage_tasks - AI task management');
    console.log('   • generate_project_insights - Analytics & insights\n');
    
    console.log(chalk.green('✅ You\'re all set! Run this test again after configuration.'));
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new ClickUpTester();
  tester.runTests().catch(console.error);
}

export default ClickUpTester;