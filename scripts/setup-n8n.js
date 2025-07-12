#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

class N8nSetup {
  constructor() {
    this.configPath = path.join(process.cwd(), 'mcp-config.json');
    this.templatePath = path.join(process.cwd(), 'mcp-config-template.json');
  }

  async run() {
    console.log(chalk.blue.bold('\n🚀 n8n MCP Integration Setup\n'));
    
    try {
      await this.checkPrerequisites();
      await this.configureN8n();
      await this.testConnection();
      await this.updateConfig();
      await this.createExampleWorkflows();
      
      console.log(chalk.green.bold('\n✅ n8n MCP integration setup completed successfully!\n'));
      this.printNextSteps();
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Setup failed:'), error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    const spinner = ora('Checking prerequisites...').start();
    
    // Check if n8n is running
    try {
      await axios.get('http://localhost:5678/api/v1/health', { timeout: 5000 });
      spinner.succeed('n8n instance is running');
    } catch (error) {
      spinner.fail('n8n instance not found at http://localhost:5678');
      console.log(chalk.yellow('\n📋 To start n8n, run:'));
      console.log(chalk.cyan('  npx n8n start'));
      console.log(chalk.cyan('  # or with Docker:'));
      console.log(chalk.cyan('  docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n'));
      throw new Error('n8n instance not accessible');
    }
  }

  async configureN8n() {
    console.log(chalk.blue('\n🔧 n8n Configuration\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'n8n Base URL:',
        default: 'http://localhost:5678',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'n8n API Key (optional - leave empty if not configured):',
        default: ''
      },
      {
        type: 'input',
        name: 'webhookUrl',
        message: 'n8n Webhook Base URL:',
        default: 'http://localhost:5678/webhook',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      }
    ]);

    this.n8nConfig = answers;
  }

  async testConnection() {
    const spinner = ora('Testing n8n connection...').start();
    
    try {
      const config = {
        headers: {}
      };
      
      if (this.n8nConfig.apiKey) {
        config.headers['X-N8N-API-KEY'] = this.n8nConfig.apiKey;
      }

      const response = await axios.get(`${this.n8nConfig.baseUrl}/api/v1/health`, config);
      
      if (response.status === 200) {
        spinner.succeed('n8n connection successful');
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    } catch (error) {
      spinner.fail('n8n connection failed');
      console.log(chalk.yellow('\n💡 Troubleshooting tips:'));
      console.log(chalk.cyan('  1. Ensure n8n is running'));
      console.log(chalk.cyan('  2. Check if API key is required'));
      console.log(chalk.cyan('  3. Verify the base URL is correct'));
      throw new Error(`Connection failed: ${error.message}`);
    }
  }

  async updateConfig() {
    const spinner = ora('Updating MCP configuration...').start();
    
    try {
      let config;
      
      if (fs.existsSync(this.configPath)) {
        config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      } else if (fs.existsSync(this.templatePath)) {
        config = JSON.parse(fs.readFileSync(this.templatePath, 'utf8'));
      } else {
        throw new Error('No MCP configuration file found');
      }

      // Update n8n configuration
      if (!config.mcpServers) {
        config.mcpServers = {};
      }

      config.mcpServers.n8n = {
        command: 'node',
        args: ['./mcps/n8n-mcp-server.js'],
        env: {
          N8N_BASE_URL: this.n8nConfig.baseUrl,
          N8N_API_KEY: this.n8nConfig.apiKey,
          N8N_WEBHOOK_URL: this.n8nConfig.webhookUrl
        },
        description: 'n8n workflow automation and orchestration integration'
      };

      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      spinner.succeed('MCP configuration updated');
    } catch (error) {
      spinner.fail('Failed to update configuration');
      throw error;
    }
  }

  async createExampleWorkflows() {
    console.log(chalk.blue('\n📝 Creating example workflows...\n'));
    
    const examplesDir = path.join(process.cwd(), 'examples', 'n8n-workflows');
    if (!fs.existsSync(examplesDir)) {
      fs.mkdirSync(examplesDir, { recursive: true });
    }

    // Create example workflow files
    const examples = [
      {
        name: 'simple-webhook-trigger.json',
        content: this.getSimpleWebhookWorkflow()
      },
      {
        name: 'data-processing-workflow.json',
        content: this.getDataProcessingWorkflow()
      },
      {
        name: 'email-notification-workflow.json',
        content: this.getEmailNotificationWorkflow()
      }
    ];

    for (const example of examples) {
      const filePath = path.join(examplesDir, example.name);
      fs.writeFileSync(filePath, JSON.stringify(example.content, null, 2));
      console.log(chalk.green(`  ✅ Created ${example.name}`));
    }
  }

  getSimpleWebhookWorkflow() {
    return {
      name: 'Simple Webhook Trigger',
      nodes: [
        {
          id: 'webhook-trigger',
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300],
          parameters: {
            httpMethod: 'POST',
            path: 'simple-trigger',
            responseMode: 'responseNode',
            options: {}
          }
        },
        {
          id: 'respond',
          name: 'Respond to Webhook',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [460, 300],
          parameters: {
            respondWith: 'json',
            responseBody: '={{ { "message": "Workflow executed successfully", "data": $json } }}'
          }
        }
      ],
      connections: {
        'Webhook': {
          main: [
            [
              {
                node: 'Respond to Webhook',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      active: true
    };
  }

  getDataProcessingWorkflow() {
    return {
      name: 'Data Processing Workflow',
      nodes: [
        {
          id: 'manual-trigger',
          name: 'Manual Trigger',
          type: 'n8n-nodes-base.manualTrigger',
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
        {
          id: 'set-data',
          name: 'Set Data',
          type: 'n8n-nodes-base.set',
          typeVersion: 2,
          position: [460, 300],
          parameters: {
            values: {
              string: [
                {
                  name: 'processed_at',
                  value: '={{ new Date().toISOString() }}'
                }
              ]
            }
          }
        },
        {
          id: 'http-request',
          name: 'HTTP Request',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.1,
          position: [680, 300],
          parameters: {
            url: 'https://api.example.com/data',
            method: 'GET',
            options: {}
          }
        }
      ],
      connections: {
        'Manual Trigger': {
          main: [
            [
              {
                node: 'Set Data',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Set Data': {
          main: [
            [
              {
                node: 'HTTP Request',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      active: false
    };
  }

  getEmailNotificationWorkflow() {
    return {
      name: 'Email Notification Workflow',
      nodes: [
        {
          id: 'webhook-trigger',
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300],
          parameters: {
            httpMethod: 'POST',
            path: 'email-notification',
            responseMode: 'responseNode',
            options: {}
          }
        },
        {
          id: 'email-send',
          name: 'Send Email',
          type: 'n8n-nodes-base.emailSend',
          typeVersion: 2,
          position: [460, 300],
          parameters: {
            toEmail: '={{ $json.email }}',
            subject: '={{ $json.subject }}',
            text: '={{ $json.message }}',
            options: {}
          }
        },
        {
          id: 'respond',
          name: 'Respond to Webhook',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [680, 300],
          parameters: {
            respondWith: 'json',
            responseBody: '={{ { "status": "email_sent", "to": $json.email } }}'
          }
        }
      ],
      connections: {
        'Webhook': {
          main: [
            [
              {
                node: 'Send Email',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Send Email': {
          main: [
            [
              {
                node: 'Respond to Webhook',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      active: false
    };
  }

  printNextSteps() {
    console.log(chalk.blue.bold('\n📋 Next Steps:\n'));
    console.log(chalk.cyan('1. Start your MCP client with the updated configuration'));
    console.log(chalk.cyan('2. Test the n8n integration with:'));
    console.log(chalk.gray('   - List workflows: list_workflows'));
    console.log(chalk.gray('   - Execute workflow: execute_workflow'));
    console.log(chalk.gray('   - Trigger webhook: trigger_webhook'));
    console.log(chalk.cyan('3. Import example workflows from: examples/n8n-workflows/'));
    console.log(chalk.cyan('4. Configure your n8n workflows to work with the MCP tools'));
    console.log(chalk.cyan('5. Set up webhook endpoints for automated triggers'));
    
    console.log(chalk.blue.bold('\n🔗 Useful Commands:\n'));
    console.log(chalk.gray('• Test n8n connection: curl http://localhost:5678/api/v1/health'));
    console.log(chalk.gray('• Start n8n: npx n8n start'));
    console.log(chalk.gray('• View n8n UI: http://localhost:5678'));
    console.log(chalk.gray('• Check MCP config: cat mcp-config.json'));
  }
}

if (require.main === module) {
  const setup = new N8nSetup();
  setup.run().catch(console.error);
}

module.exports = N8nSetup;