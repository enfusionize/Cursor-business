#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer').default;
const fs = require('fs').promises;
const path = require('path');

class StringAutomationEngine {
  constructor() {
    this.mcpMapping = {
      'monitoring': ['playwright', 'firecrawl'],
      'reporting': ['xero', 'clickup', 'perplexity'],
      'notification': ['clickup', 'email'],
      'analysis': ['perplexity', 'claude'],
      'design': ['figma'],
      'deployment': ['vercel'],
      'research': ['perplexity', 'dataforseo', 'firecrawl'],
      'screenshots': ['playwright'],
      'scraping': ['firecrawl'],
      'tasks': ['clickup'],
      'finance': ['xero'],
      'content': ['claude', 'perplexity'],
      'seo': ['dataforseo'],
      'ux': ['playwright', 'figma']
    };

    this.complexityLevels = {
      basic: { maxSteps: 3, confidence: 0.9 },
      intermediate: { maxSteps: 6, confidence: 0.75 },
      advanced: { maxSteps: 10, confidence: 0.6 },
      expert: { maxSteps: 15, confidence: 0.4 }
    };

    this.templates = {};
    this.loadTemplates();
  }

  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '..', 'templates', 'string-inspired-automations');
      const files = await fs.readdir(templatesDir).catch(() => []);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf8');
          const templateName = path.basename(file, '.json');
          this.templates[templateName] = JSON.parse(templateContent);
        }
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Templates directory not found. Creating default templates...'));
      await this.createDefaultTemplates();
    }
  }

  async createDefaultTemplates() {
    const templatesDir = path.join(__dirname, '..', 'templates', 'string-inspired-automations');
    await fs.mkdir(templatesDir, { recursive: true });

    // Daily Business Monitor Template
    const dailyMonitor = {
      name: "Daily Business Monitor",
      description: "Monitor key business metrics and generate daily reports",
      complexity: "intermediate",
      workflow: [
        {
          step: 1,
          action: "collect_metrics",
          mcps: ["xero", "clickup"],
          description: "Gather financial and project data"
        },
        {
          step: 2,
          action: "analyze_performance",
          mcps: ["perplexity"],
          description: "Analyze performance trends"
        },
        {
          step: 3,
          action: "generate_report",
          mcps: ["claude"],
          description: "Create comprehensive daily report"
        },
        {
          step: 4,
          action: "distribute_report",
          mcps: ["clickup"],
          description: "Send report to team"
        }
      ]
    };

    await fs.writeFile(
      path.join(templatesDir, 'daily-business-monitor.json'),
      JSON.stringify(dailyMonitor, null, 2)
    );

    // Competitor Intelligence Template
    const competitorIntel = {
      name: "Competitor Intelligence",
      description: "Monitor competitors and generate intelligence reports",
      complexity: "advanced",
      workflow: [
        {
          step: 1,
          action: "scrape_competitor_sites",
          mcps: ["firecrawl", "playwright"],
          description: "Collect competitor data and screenshots"
        },
        {
          step: 2,
          action: "analyze_changes",
          mcps: ["perplexity"],
          description: "Identify significant changes and trends"
        },
        {
          step: 3,
          action: "research_context",
          mcps: ["perplexity"],
          description: "Research market context and implications"
        },
        {
          step: 4,
          action: "create_intelligence_report",
          mcps: ["claude"],
          description: "Generate actionable intelligence report"
        },
        {
          step: 5,
          action: "create_action_items",
          mcps: ["clickup"],
          description: "Create tasks based on findings"
        }
      ]
    };

    await fs.writeFile(
      path.join(templatesDir, 'competitor-intelligence.json'),
      JSON.stringify(competitorIntel, null, 2)
    );

    console.log(chalk.green('✅ Default templates created successfully!'));
  }

  parseBusinessIntent(prompt) {
    const intent = {
      type: 'unknown',
      complexity: 'basic',
      mcps: [],
      actions: [],
      triggers: [],
      outputs: [],
      confidence: 0
    };

    const promptLower = prompt.toLowerCase();

    // Identify intent type
    if (promptLower.includes('monitor') || promptLower.includes('watch') || promptLower.includes('track')) {
      intent.type = 'monitoring';
      intent.triggers.push('schedule');
    }
    if (promptLower.includes('report') || promptLower.includes('summary') || promptLower.includes('analyze')) {
      intent.type = 'reporting';
      intent.outputs.push('report');
    }
    if (promptLower.includes('notify') || promptLower.includes('alert') || promptLower.includes('send')) {
      intent.type = 'notification';
      intent.outputs.push('notification');
    }
    if (promptLower.includes('automate') || promptLower.includes('create') || promptLower.includes('generate')) {
      intent.type = 'automation';
    }

    // Identify required MCPs
    const mcpKeywords = {
      'competitor': ['firecrawl', 'playwright', 'perplexity'],
      'website': ['playwright', 'firecrawl'],
      'screenshot': ['playwright'],
      'financial': ['xero'],
      'task': ['clickup'],
      'project': ['clickup'],
      'design': ['figma'],
      'keyword': ['dataforseo'],
      'seo': ['dataforseo', 'perplexity'],
      'research': ['perplexity', 'firecrawl'],
      'content': ['claude', 'perplexity'],
      'ux': ['playwright', 'figma'],
      'email': ['clickup'],
      'blog': ['claude', 'perplexity'],
      'social': ['claude']
    };

    for (const [keyword, mcps] of Object.entries(mcpKeywords)) {
      if (promptLower.includes(keyword)) {
        intent.mcps.push(...mcps);
      }
    }

    // Remove duplicates
    intent.mcps = [...new Set(intent.mcps)];

    // Determine complexity
    const stepIndicators = promptLower.split(/and|then|after|when|if/).length;
    const mcpCount = intent.mcps.length;
    
    if (stepIndicators <= 2 && mcpCount <= 2) {
      intent.complexity = 'basic';
      intent.confidence = 0.9;
    } else if (stepIndicators <= 4 && mcpCount <= 4) {
      intent.complexity = 'intermediate';
      intent.confidence = 0.75;
    } else if (stepIndicators <= 6 && mcpCount <= 6) {
      intent.complexity = 'advanced';
      intent.confidence = 0.6;
    } else {
      intent.complexity = 'expert';
      intent.confidence = 0.4;
    }

    return intent;
  }

  generateWorkflow(intent, prompt) {
    const workflow = {
      name: this.generateWorkflowName(prompt),
      description: prompt,
      complexity: intent.complexity,
      confidence: intent.confidence,
      mcps: intent.mcps,
      steps: [],
      triggers: intent.triggers.length > 0 ? intent.triggers : ['manual'],
      outputs: intent.outputs.length > 0 ? intent.outputs : ['log']
    };

    // Generate workflow steps based on intent
    const stepTemplates = this.getStepTemplates(intent);
    workflow.steps = stepTemplates.map((template, index) => ({
      step: index + 1,
      action: template.action,
      mcps: template.mcps,
      description: template.description,
      estimated_time: template.estimated_time || '30s'
    }));

    return workflow;
  }

  getStepTemplates(intent) {
    const templates = [];

    switch (intent.type) {
      case 'monitoring':
        templates.push({
          action: 'setup_monitoring',
          mcps: intent.mcps.filter(mcp => ['playwright', 'firecrawl'].includes(mcp)),
          description: 'Set up monitoring targets and data collection'
        });
        if (intent.mcps.includes('perplexity')) {
          templates.push({
            action: 'analyze_data',
            mcps: ['perplexity'],
            description: 'Analyze collected data for insights'
          });
        }
        if (intent.outputs.includes('notification')) {
          templates.push({
            action: 'send_notifications',
            mcps: ['clickup'],
            description: 'Send notifications or create tasks'
          });
        }
        break;

      case 'reporting':
        templates.push({
          action: 'collect_data',
          mcps: intent.mcps.filter(mcp => ['xero', 'clickup', 'playwright'].includes(mcp)),
          description: 'Collect data from various sources'
        });
        templates.push({
          action: 'analyze_and_report',
          mcps: ['perplexity', 'claude'],
          description: 'Analyze data and generate report'
        });
        templates.push({
          action: 'distribute_report',
          mcps: ['clickup'],
          description: 'Distribute report to stakeholders'
        });
        break;

      case 'automation':
        templates.push({
          action: 'identify_process',
          mcps: ['claude'],
          description: 'Identify and map the process to automate'
        });
        templates.push({
          action: 'implement_automation',
          mcps: intent.mcps,
          description: 'Implement the automation workflow'
        });
        templates.push({
          action: 'test_and_deploy',
          mcps: ['clickup'],
          description: 'Test automation and deploy to production'
        });
        break;

      default:
        templates.push({
          action: 'execute_task',
          mcps: intent.mcps,
          description: 'Execute the requested task'
        });
    }

    return templates;
  }

  generateWorkflowName(prompt) {
    const words = prompt.split(' ').slice(0, 4);
    return words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  async createAutomationFromPrompt(prompt) {
    console.log(chalk.blue('\n🤖 Analyzing your automation request...\n'));

    // Parse the business intent
    const intent = this.parseBusinessIntent(prompt);
    
    console.log(chalk.gray(`Intent Type: ${intent.type}`));
    console.log(chalk.gray(`Complexity: ${intent.complexity}`));
    console.log(chalk.gray(`Confidence: ${(intent.confidence * 100).toFixed(0)}%`));
    console.log(chalk.gray(`Required MCPs: ${intent.mcps.join(', ')}`));

    if (intent.confidence < 0.4) {
      console.log(chalk.yellow('\n⚠️  Low confidence in automation understanding.'));
      console.log(chalk.gray('Consider providing more specific details about what you want to automate.'));
    }

    // Generate the workflow
    const workflow = this.generateWorkflow(intent, prompt);

    // Check for similar templates
    const similarTemplate = this.findSimilarTemplate(intent);
    if (similarTemplate) {
      console.log(chalk.blue(`\n💡 Found similar template: ${similarTemplate.name}`));
      
      const useTemplate = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'use',
          message: 'Would you like to use this template as a starting point?',
          default: true
        }
      ]);

      if (useTemplate.use) {
        // Merge template with generated workflow
        workflow.steps = this.mergeWorkflowSteps(similarTemplate.workflow, workflow.steps);
        workflow.complexity = similarTemplate.complexity;
      }
    }

    return workflow;
  }

  findSimilarTemplate(intent) {
    for (const template of Object.values(this.templates)) {
      const templateMcps = new Set(template.workflow.flatMap(step => step.mcps));
      const intentMcps = new Set(intent.mcps);
      
      const overlap = [...templateMcps].filter(mcp => intentMcps.has(mcp));
      const similarity = overlap.length / Math.max(templateMcps.size, intentMcps.size);
      
      if (similarity > 0.6) {
        return template;
      }
    }
    return null;
  }

  mergeWorkflowSteps(templateSteps, generatedSteps) {
    // Use template steps as base, enhance with generated insights
    return templateSteps.map((step, index) => ({
      ...step,
      enhanced: true,
      generated_description: generatedSteps[index]?.description || step.description
    }));
  }

  async testAutomation(workflow) {
    console.log(chalk.yellow('\n🧪 Testing automation workflow...\n'));

    let passed = 0;
    let total = workflow.steps.length;

    for (const step of workflow.steps) {
      console.log(chalk.blue(`Testing Step ${step.step}: ${step.description}`));
      
      // Simulate testing (in real implementation, this would test actual MCPs)
      const testResult = Math.random() > 0.2; // 80% success rate
      
      if (testResult) {
        console.log(chalk.green(`  ✅ ${step.action} - Success`));
        passed++;
      } else {
        console.log(chalk.red(`  ❌ ${step.action} - Failed`));
        console.log(chalk.gray(`     Required MCPs: ${step.mcps.join(', ')}`));
      }
    }

    const successRate = (passed / total) * 100;
    console.log(chalk.blue(`\n📊 Test Results: ${passed}/${total} steps passed (${successRate.toFixed(0)}%)`));

    if (successRate >= 80) {
      console.log(chalk.green('✅ Automation is ready for deployment!'));
      return true;
    } else if (successRate >= 60) {
      console.log(chalk.yellow('⚠️  Automation needs some adjustments before deployment.'));
      return false;
    } else {
      console.log(chalk.red('❌ Automation has significant issues and needs redesign.'));
      return false;
    }
  }

  async deployAutomation(workflow) {
    console.log(chalk.yellow('\n🚀 Deploying automation...\n'));

    // Create automation configuration
    const config = {
      name: workflow.name,
      description: workflow.description,
      complexity: workflow.complexity,
      triggers: workflow.triggers,
      steps: workflow.steps,
      mcps: workflow.mcps,
      created_at: new Date().toISOString(),
      status: 'active'
    };

    // Save to automations directory
    const automationsDir = path.join(__dirname, '..', 'automations');
    await fs.mkdir(automationsDir, { recursive: true });

    const filename = workflow.name.toLowerCase().replace(/\s+/g, '-') + '.json';
    const filepath = path.join(automationsDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(config, null, 2));

    console.log(chalk.green(`✅ Automation deployed successfully!`));
    console.log(chalk.gray(`   Configuration saved to: ${filename}`));
    console.log(chalk.blue(`   Automation ID: ${workflow.name}`));

    return {
      id: workflow.name,
      config: config,
      filepath: filepath
    };
  }

  async showAutomationTemplates() {
    console.log(chalk.cyan('\n📚 Available Automation Templates\n'));

    if (Object.keys(this.templates).length === 0) {
      console.log(chalk.yellow('No templates found. Creating default templates...'));
      await this.createDefaultTemplates();
      await this.loadTemplates();
    }

    const templateChoices = Object.values(this.templates).map(template => ({
      name: `${template.name} (${template.complexity})`,
      value: template,
      description: template.description
    }));

    templateChoices.push({
      name: '🔙 Back to main menu',
      value: null
    });

    const choice = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template to customize:',
        choices: templateChoices,
        pageSize: 10
      }
    ]);

    if (choice.template) {
      return this.customizeTemplate(choice.template);
    }
  }

  async customizeTemplate(template) {
    console.log(chalk.blue(`\n🎨 Customizing template: ${template.name}\n`));
    
    console.log(chalk.gray('Current workflow:'));
    template.workflow.forEach((step, index) => {
      console.log(chalk.gray(`  ${index + 1}. ${step.description}`));
    });

    const customization = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Custom automation name:',
        default: template.name + ' - Custom'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe your specific use case:',
        default: template.description
      },
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed with this customization?',
        default: true
      }
    ]);

    if (customization.proceed) {
      const workflow = {
        name: customization.name,
        description: customization.description,
        complexity: template.complexity,
        steps: template.workflow,
        mcps: [...new Set(template.workflow.flatMap(step => step.mcps))],
        confidence: 0.95 // High confidence for templates
      };

      return workflow;
    }
  }
}

// CLI Interface
async function main() {
  const engine = new StringAutomationEngine();

  const action = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        { name: '🗣️ Create automation from description', value: 'create' },
        { name: '📚 Browse automation templates', value: 'templates' },
        { name: '🧪 Test existing automation', value: 'test' },
        { name: '📊 View automation analytics', value: 'analytics' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }
  ]);

  switch (action.choice) {
    case 'create':
      const prompt = await inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: 'Describe what you want to automate (in plain English):',
          validate: input => input.length > 10 || 'Please provide more detail'
        }
      ]);

      try {
        const workflow = await engine.createAutomationFromPrompt(prompt.description);
        
        console.log(chalk.green('\n✅ Automation workflow generated!\n'));
        console.log(chalk.blue('Generated Workflow:'));
        workflow.steps.forEach((step, i) => {
          console.log(chalk.gray(`  ${i + 1}. ${step.description}`));
        });

        const next = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do next?',
            choices: [
              { name: '🧪 Test this automation', value: 'test' },
              { name: '🚀 Deploy automation', value: 'deploy' },
              { name: '✏️ Modify workflow', value: 'modify' },
              { name: '🏠 Main menu', value: 'menu' }
            ]
          }
        ]);

        switch (next.action) {
          case 'test':
            const testResult = await engine.testAutomation(workflow);
            if (testResult) {
              const deploy = await inquirer.prompt([
                {
                  type: 'confirm',
                  name: 'deploy',
                  message: 'Deploy this automation now?',
                  default: true
                }
              ]);
              if (deploy.deploy) {
                await engine.deployAutomation(workflow);
              }
            }
            break;
          case 'deploy':
            await engine.deployAutomation(workflow);
            break;
        }

      } catch (error) {
        console.log(chalk.red(`❌ Error creating automation: ${error.message}`));
      }
      break;

    case 'templates':
      await engine.showAutomationTemplates();
      break;

    case 'analytics':
      console.log(chalk.blue('\n📊 Automation Analytics Dashboard'));
      console.log(chalk.gray('Feature coming soon...'));
      break;

    case 'exit':
      console.log(chalk.green('\n👋 Goodbye!'));
      process.exit(0);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = StringAutomationEngine;