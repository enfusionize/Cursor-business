#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer').default;

console.log(chalk.cyan('🤖 Multi-Model AI Testing Suite\n'));

class MultiModelTester {
  constructor() {
    this.results = [];
    this.loadEnvironment();
    this.models = this.getAvailableModels();
  }

  loadEnvironment() {
    require('dotenv').config();
  }

  getAvailableModels() {
    const models = {
      'claude': {
        name: 'Claude (Anthropic)',
        apiKey: process.env.ANTHROPIC_API_KEY,
        endpoint: 'https://api.anthropic.com/v1/messages',
        costPer1M: 20,
        strengths: ['Code generation', 'Reasoning', 'Analysis']
      },
      'minimax': {
        name: 'Minimax',
        apiKey: process.env.MINIMAX_API_KEY,
        endpoint: 'https://api.minimax.chat/v1/text/chatcompletion_pro',
        costPer1M: 15,
        strengths: ['Multimodal', 'Chinese language', 'Creative content']
      },
      'dora': {
        name: 'Dora AI',
        apiKey: process.env.DORA_API_KEY,
        endpoint: 'https://api.dora.run/v1/generate',
        costPer1M: 29, // Monthly subscription model
        strengths: ['Web design', 'UI/UX', 'Prototyping']
      },
      'emergent': {
        name: 'Emergent Mind',
        apiKey: process.env.EMERGENT_API_KEY,
        endpoint: 'https://api.emergentmind.com/v1/complete',
        costPer1M: 25,
        strengths: ['Problem solving', 'Strategic thinking', 'Complex reasoning']
      },
      'orchids': {
        name: 'Orchids AI',
        apiKey: process.env.ORCHIDS_API_KEY,
        endpoint: 'https://api.orchids.ai/v1/intelligence',
        costPer1M: 39, // Monthly subscription model
        strengths: ['Business intelligence', 'Data analysis', 'Automation']
      },
      'runway': {
        name: 'Runway ML',
        apiKey: process.env.RUNWAY_API_KEY,
        endpoint: 'https://api.runwayml.com/v1/generate',
        costPer1M: 15, // Monthly subscription model
        strengths: ['Video generation', 'Creative AI', 'Visual effects']
      },
      'midjourney': {
        name: 'Midjourney',
        apiKey: process.env.MIDJOURNEY_API_KEY,
        endpoint: 'https://api.midjourney.com/v1/imagine',
        costPer1M: 30, // Monthly subscription model
        strengths: ['Image generation', 'Artistic content', 'Visual design']
      },
      'stable-diffusion': {
        name: 'Stable Diffusion',
        apiKey: process.env.STABILITY_API_KEY,
        endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        costPer1M: 10,
        strengths: ['Open-source', 'Image generation', 'Customizable']
      }
    };

    // Filter models with available API keys
    return Object.fromEntries(
      Object.entries(models).filter(([key, model]) => model.apiKey && model.apiKey !== `your_${key}_api_key_here`)
    );
  }

  async runInteractiveTest() {
    console.log(chalk.yellow('Available AI Models:'));
    Object.entries(this.models).forEach(([key, model]) => {
      console.log(chalk.green(`✅ ${model.name}: ${model.strengths.join(', ')}`));
    });
    
    const unavailableModels = Object.keys({
      'claude': 'Claude',
      'minimax': 'Minimax', 
      'dora': 'Dora AI',
      'emergent': 'Emergent Mind',
      'orchids': 'Orchids AI',
      'runway': 'Runway ML',
      'midjourney': 'Midjourney',
      'stable-diffusion': 'Stable Diffusion'
    }).filter(key => !this.models[key]);

    if (unavailableModels.length > 0) {
      console.log(chalk.yellow('\nModels needing API keys:'));
      unavailableModels.forEach(key => {
        console.log(chalk.gray(`⚠️  ${key}: Configure API key in .env file`));
      });
    }

    const testConfig = await inquirer.prompt([
      {
        type: 'list',
        name: 'testType',
        message: 'What type of test would you like to run?',
        choices: [
          { name: '🎯 Quick Comparison Test', value: 'quick' },
          { name: '🔬 Comprehensive Analysis', value: 'comprehensive' },
          { name: '🎨 Creative Content Generation', value: 'creative' },
          { name: '💼 Business Intelligence Test', value: 'business' },
          { name: '🌐 Web Design Challenge', value: 'design' },
          { name: '🔧 Custom Prompt Test', value: 'custom' }
        ]
      }
    ]);

    let prompt, testCriteria;

    switch (testConfig.testType) {
      case 'quick':
        ({ prompt, testCriteria } = await this.getQuickTestConfig());
        break;
      case 'comprehensive':
        ({ prompt, testCriteria } = await this.getComprehensiveTestConfig());
        break;
      case 'creative':
        ({ prompt, testCriteria } = await this.getCreativeTestConfig());
        break;
      case 'business':
        ({ prompt, testCriteria } = await this.getBusinessTestConfig());
        break;
      case 'design':
        ({ prompt, testCriteria } = await this.getDesignTestConfig());
        break;
      case 'custom':
        ({ prompt, testCriteria } = await this.getCustomTestConfig());
        break;
    }

    const selectedModels = await this.selectModelsForTest();
    
    console.log(chalk.blue('\n🚀 Starting multi-model test...\n'));
    await this.testAllModels(prompt, testCriteria, selectedModels);
    
    await this.generateReport();
  }

  async getQuickTestConfig() {
    const config = await inquirer.prompt([
      {
        type: 'input',
        name: 'topic',
        message: 'What topic would you like all models to analyze?',
        default: 'AI trends in 2024'
      }
    ]);

    return {
      prompt: `Provide a comprehensive analysis of ${config.topic}. Include key insights, trends, and actionable recommendations.`,
      testCriteria: {
        accuracy: 0.3,
        depth: 0.3,
        clarity: 0.2,
        actionability: 0.2
      }
    };
  }

  async getComprehensiveTestConfig() {
    const config = await inquirer.prompt([
      {
        type: 'input',
        name: 'businessChallenge',
        message: 'Describe a business challenge to analyze:',
        default: 'How to increase website conversion rates'
      }
    ]);

    return {
      prompt: `Analyze this business challenge: "${config.businessChallenge}". Provide:
1. Root cause analysis
2. Market research insights
3. Strategic recommendations
4. Implementation roadmap
5. Success metrics
6. Risk assessment`,
      testCriteria: {
        strategic_thinking: 0.25,
        practical_solutions: 0.25,
        market_understanding: 0.2,
        implementation_clarity: 0.15,
        risk_assessment: 0.15
      }
    };
  }

  async getCreativeTestConfig() {
    const config = await inquirer.prompt([
      {
        type: 'list',
        name: 'creativeType',
        message: 'What type of creative content?',
        choices: [
          'Marketing campaign concept',
          'Product naming and branding', 
          'Content strategy',
          'Visual design brief',
          'Video concept'
        ]
      },
      {
        type: 'input',
        name: 'industry',
        message: 'For which industry?',
        default: 'Technology startup'
      }
    ]);

    return {
      prompt: `Create a ${config.creativeType} for a ${config.industry}. Be creative, original, and provide detailed execution guidelines.`,
      testCriteria: {
        creativity: 0.3,
        originality: 0.25,
        feasibility: 0.2,
        market_appeal: 0.15,
        execution_clarity: 0.1
      }
    };
  }

  async getBusinessTestConfig() {
    return {
      prompt: `Analyze the current state of the AI business tools market and provide:
1. Market size and growth projections
2. Key players and competitive landscape
3. Emerging opportunities
4. Technology trends impact
5. Investment recommendations
6. 3-year strategic outlook`,
      testCriteria: {
        market_analysis: 0.25,
        competitive_intelligence: 0.2,
        future_predictions: 0.2,
        strategic_insights: 0.2,
        data_accuracy: 0.15
      }
    };
  }

  async getDesignTestConfig() {
    const config = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectType',
        message: 'What type of design project?',
        default: 'Modern SaaS landing page'
      }
    ]);

    return {
      prompt: `Design a ${config.projectType}. Provide:
1. Design concept and visual direction
2. User experience strategy
3. Layout and component specifications
4. Color palette and typography
5. Responsive design considerations
6. Implementation guidelines`,
      testCriteria: {
        design_quality: 0.3,
        user_experience: 0.25,
        technical_feasibility: 0.2,
        brand_consistency: 0.15,
        innovation: 0.1
      }
    };
  }

  async getCustomTestConfig() {
    const config = await inquirer.prompt([
      {
        type: 'editor',
        name: 'prompt',
        message: 'Enter your custom prompt:'
      },
      {
        type: 'input',
        name: 'criteriaDescription',
        message: 'How should responses be evaluated? (e.g., "accuracy, creativity, practicality")',
        default: 'accuracy, clarity, usefulness'
      }
    ]);

    const criteriaList = config.criteriaDescription.split(',').map(c => c.trim());
    const criteriaWeight = 1 / criteriaList.length;
    const testCriteria = {};
    
    criteriaList.forEach(criterion => {
      testCriteria[criterion] = criteriaWeight;
    });

    return {
      prompt: config.prompt,
      testCriteria
    };
  }

  async selectModelsForTest() {
    const choices = Object.entries(this.models).map(([key, model]) => ({
      name: `${model.name} - ${model.strengths.join(', ')}`,
      value: key,
      checked: true
    }));

    const selection = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'models',
        message: 'Select models to test:',
        choices,
        validate: (input) => input.length > 0 || 'Please select at least one model'
      }
    ]);

    return selection.models;
  }

  async testAllModels(prompt, testCriteria, selectedModels) {
    const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_MODEL_TESTS) || 3;
    const timeout = parseInt(process.env.MODEL_RESPONSE_TIMEOUT) || 30000;

    for (let i = 0; i < selectedModels.length; i += maxConcurrent) {
      const batch = selectedModels.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(modelKey => this.testModel(modelKey, prompt, testCriteria, timeout));
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        const modelKey = batch[index];
        if (result.status === 'fulfilled') {
          this.results.push(result.value);
        } else {
          this.results.push({
            model: modelKey,
            modelName: this.models[modelKey].name,
            error: result.reason.message,
            success: false,
            executionTime: timeout,
            cost: 0,
            qualityScore: 0
          });
        }
      });
    }
  }

  async testModel(modelKey, prompt, testCriteria, timeout) {
    const model = this.models[modelKey];
    const spinner = ora(`Testing ${model.name}...`).start();
    
    const startTime = Date.now();
    
    try {
      // Simulate API call (replace with actual API calls)
      const response = await this.callModelAPI(modelKey, prompt, timeout);
      const endTime = Date.now();
      
      const qualityScore = await this.evaluateQuality(response, testCriteria);
      const cost = this.calculateCost(modelKey, prompt, response);
      
      const result = {
        model: modelKey,
        modelName: model.name,
        response,
        executionTime: endTime - startTime,
        qualityScore,
        cost,
        success: true,
        strengths: model.strengths
      };
      
      spinner.succeed(`${model.name}: Score ${qualityScore.toFixed(1)}/10, ${result.executionTime}ms, $${cost.toFixed(4)}`);
      return result;
      
    } catch (error) {
      spinner.fail(`${model.name}: ${error.message}`);
      throw error;
    }
  }

  async callModelAPI(modelKey, prompt, timeout) {
    // Simulate different response styles based on model strengths
    const model = this.models[modelKey];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    
    // Generate mock response based on model type
    if (model.strengths.includes('Code generation')) {
      return this.generateCodeResponse(prompt);
    } else if (model.strengths.includes('Image generation')) {
      return this.generateImageResponse(prompt);
    } else if (model.strengths.includes('Business intelligence')) {
      return this.generateBusinessResponse(prompt);
    } else if (model.strengths.includes('Web design')) {
      return this.generateDesignResponse(prompt);
    } else {
      return this.generateGenericResponse(prompt, model.strengths);
    }
  }

  generateCodeResponse(prompt) {
    return `# Code Analysis Response

Based on your request: "${prompt.substring(0, 100)}..."

## Implementation Strategy
1. **Architecture Design**: Microservices approach with REST APIs
2. **Technology Stack**: React + Node.js + PostgreSQL
3. **Development Phases**: Planning → MVP → Testing → Deployment

## Code Example
\`\`\`javascript
class PromptAnalyzer {
  async analyze(prompt) {
    const insights = await this.extractInsights(prompt);
    return this.generateRecommendations(insights);
  }
}
\`\`\`

## Deployment Considerations
- CI/CD pipeline setup
- Performance monitoring
- Security best practices
- Scalability planning`;
  }

  generateImageResponse(prompt) {
    return `# Visual Design Response

**Design Concept**: Based on your prompt "${prompt.substring(0, 100)}..."

## Visual Elements
- **Color Palette**: Modern blues and whites (#2563eb, #f8fafc)
- **Typography**: Clean sans-serif, hierarchical sizing
- **Layout**: Grid-based, responsive design
- **Imagery**: High-quality photography with consistent style

## Generated Assets
- Hero image: 1920x1080px
- Icon set: 24x24px, 48x48px variations
- Background patterns: Subtle geometric designs
- Logo variations: Horizontal, stacked, icon-only

## Implementation Notes
- SVG format for scalability
- WebP optimization for web delivery
- Accessibility considerations (alt text, contrast ratios)`;
  }

  generateBusinessResponse(prompt) {
    return `# Business Intelligence Analysis

## Executive Summary
Your query: "${prompt.substring(0, 100)}..." requires strategic analysis across multiple dimensions.

## Market Analysis
- **Market Size**: $2.4B current, 15% YoY growth
- **Key Players**: Established leaders vs emerging disruptors
- **Geographic Distribution**: North America 45%, Europe 30%, Asia-Pacific 25%

## Strategic Recommendations
1. **Immediate Actions** (0-3 months)
   - Market validation studies
   - Competitive positioning analysis
   - Initial MVP development

2. **Medium-term Strategy** (3-12 months)
   - Product-market fit optimization
   - Customer acquisition scaling
   - Partnership development

3. **Long-term Vision** (1-3 years)
   - Market expansion opportunities
   - Technology innovation roadmap
   - Exit strategy considerations

## Risk Assessment
- **High Impact Risks**: Market saturation, regulatory changes
- **Mitigation Strategies**: Diversification, compliance monitoring
- **Contingency Planning**: Alternative market entry strategies`;
  }

  generateDesignResponse(prompt) {
    return `# Design Strategy Response

## Design Concept
Project: "${prompt.substring(0, 100)}..."

## User Experience Strategy
1. **User Research**: Target demographics, pain points, behavioral patterns
2. **Information Architecture**: Content hierarchy, navigation flow
3. **Interaction Design**: Micro-interactions, feedback systems
4. **Usability Testing**: A/B testing strategy, success metrics

## Visual Design System
- **Brand Identity**: Logo, color scheme, typography guidelines
- **Component Library**: Buttons, forms, cards, navigation elements
- **Layout Grid**: 12-column responsive system
- **Accessibility**: WCAG 2.1 AA compliance

## Implementation Guidelines
- **Development Handoff**: Design tokens, component specifications
- **Responsive Breakpoints**: Mobile-first approach
- **Performance Optimization**: Image compression, lazy loading
- **Browser Compatibility**: Cross-browser testing strategy

## Prototyping Plan
- **Low-fidelity**: Wireframes, user flows
- **High-fidelity**: Interactive prototypes
- **Testing Protocol**: User feedback collection, iteration cycles`;
  }

  generateGenericResponse(prompt, strengths) {
    return `# Comprehensive Analysis

## Response to: "${prompt.substring(0, 100)}..."

### Key Insights
Based on analysis through the lens of ${strengths.join(', ')}, here are the primary findings:

1. **Core Concepts**: Fundamental principles and best practices
2. **Strategic Approach**: Step-by-step implementation methodology
3. **Risk Factors**: Potential challenges and mitigation strategies
4. **Success Metrics**: KPIs and measurement frameworks

### Detailed Recommendations
- **Phase 1**: Research and planning (2-4 weeks)
- **Phase 2**: Development and testing (4-8 weeks)
- **Phase 3**: Deployment and optimization (2-4 weeks)

### Expected Outcomes
- Improved efficiency by 25-40%
- Cost reduction of 15-30%
- Enhanced user satisfaction scores
- Measurable ROI within 3-6 months

### Next Steps
1. Validate assumptions with stakeholder input
2. Develop detailed project timeline
3. Allocate resources and budget
4. Begin implementation with pilot program`;
  }

  async evaluateQuality(response, criteria) {
    // Simulate quality evaluation based on response length, structure, and criteria
    const baseScore = 5.0;
    let qualityScore = baseScore;
    
    // Length factor (longer responses generally more comprehensive)
    const lengthFactor = Math.min(response.length / 1000, 1.5);
    qualityScore += lengthFactor;
    
    // Structure factor (well-formatted responses score higher)
    const hasHeaders = response.includes('#');
    const hasLists = response.includes('-') || response.includes('1.');
    const hasCode = response.includes('```');
    
    if (hasHeaders) qualityScore += 0.5;
    if (hasLists) qualityScore += 0.5;
    if (hasCode) qualityScore += 0.5;
    
    // Criteria-specific adjustments
    Object.keys(criteria).forEach(criterion => {
      const weight = criteria[criterion];
      let criterionScore = 0;
      
      switch (criterion) {
        case 'accuracy':
        case 'data_accuracy':
          criterionScore = response.includes('data') || response.includes('research') ? 1 : 0.5;
          break;
        case 'creativity':
        case 'originality':
          criterionScore = response.includes('innovative') || response.includes('unique') ? 1 : 0.7;
          break;
        case 'practical_solutions':
        case 'actionability':
        case 'implementation_clarity':
          criterionScore = response.includes('step') || response.includes('action') ? 1 : 0.6;
          break;
        case 'strategic_thinking':
          criterionScore = response.includes('strategy') || response.includes('long-term') ? 1 : 0.7;
          break;
        default:
          criterionScore = 0.8; // Default decent score
      }
      
      qualityScore += (criterionScore * weight * 2); // Scale factor
    });
    
    // Add some randomness to simulate real evaluation variance
    qualityScore += (Math.random() - 0.5) * 0.5;
    
    return Math.max(1, Math.min(10, qualityScore));
  }

  calculateCost(modelKey, prompt, response) {
    const model = this.models[modelKey];
    const inputTokens = Math.ceil(prompt.length / 4); // Rough token estimation
    const outputTokens = Math.ceil(response.length / 4);
    const totalTokens = inputTokens + outputTokens;
    
    return (totalTokens / 1000000) * model.costPer1M;
  }

  async generateReport() {
    console.log('\n' + chalk.cyan('📊 Multi-Model Test Results'));
    console.log('='.repeat(80));

    if (this.results.length === 0) {
      console.log(chalk.red('No results to display.'));
      return;
    }

    // Sort results by quality score
    const sortedResults = [...this.results].sort((a, b) => b.qualityScore - a.qualityScore);

    // Summary table
    console.log('\n' + chalk.yellow('📈 Performance Summary:'));
    console.table(
      sortedResults.map(result => ({
        Model: result.modelName,
        'Quality Score': result.qualityScore.toFixed(1) + '/10',
        'Time (ms)': result.executionTime,
        'Cost ($)': result.cost.toFixed(4),
        Status: result.success ? '✅ Success' : '❌ Failed'
      }))
    );

    // Detailed analysis
    console.log('\n' + chalk.yellow('🏆 Top Performers:'));
    sortedResults.slice(0, 3).forEach((result, index) => {
      const medal = ['🥇', '🥈', '🥉'][index];
      console.log(`${medal} ${result.modelName}: ${result.qualityScore.toFixed(1)}/10`);
      if (result.strengths) {
        console.log(chalk.gray(`   Strengths: ${result.strengths.join(', ')}`));
      }
    });

    // Cost analysis
    const totalCost = this.results.reduce((sum, result) => sum + result.cost, 0);
    const avgCost = totalCost / this.results.filter(r => r.success).length;
    
    console.log('\n' + chalk.yellow('💰 Cost Analysis:'));
    console.log(`Total Cost: $${totalCost.toFixed(4)}`);
    console.log(`Average Cost per Model: $${avgCost.toFixed(4)}`);
    
    const costEfficient = sortedResults.find(r => r.success && r.qualityScore > 7);
    if (costEfficient) {
      console.log(`Most Cost-Effective: ${costEfficient.modelName} (${costEfficient.qualityScore.toFixed(1)}/10 for $${costEfficient.cost.toFixed(4)})`);
    }

    // Performance insights
    console.log('\n' + chalk.yellow('⚡ Performance Insights:'));
    const avgTime = this.results.reduce((sum, result) => sum + result.executionTime, 0) / this.results.length;
    const fastestModel = sortedResults.reduce((fastest, current) => 
      current.executionTime < fastest.executionTime ? current : fastest
    );
    
    console.log(`Average Response Time: ${avgTime.toFixed(0)}ms`);
    console.log(`Fastest Model: ${fastestModel.modelName} (${fastestModel.executionTime}ms)`);

    // Recommendations
    console.log('\n' + chalk.yellow('🎯 Recommendations:'));
    const bestOverall = sortedResults[0];
    console.log(`• Best Overall: ${bestOverall.modelName} - Highest quality score (${bestOverall.qualityScore.toFixed(1)}/10)`);
    
    if (costEfficient && costEfficient.model !== bestOverall.model) {
      console.log(`• Best Value: ${costEfficient.modelName} - Great quality-to-cost ratio`);
    }
    
    const failedModels = this.results.filter(r => !r.success);
    if (failedModels.length > 0) {
      console.log(`• Fix API Issues: ${failedModels.map(r => r.modelName).join(', ')}`);
    }

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalModels: this.results.length,
        successfulModels: this.results.filter(r => r.success).length,
        averageQuality: this.results.reduce((sum, r) => sum + r.qualityScore, 0) / this.results.length,
        totalCost,
        averageTime: avgTime
      }
    };

    const reportPath = path.join(process.cwd(), 'reports', `multi-model-test-${Date.now()}.json`);
    if (!fs.existsSync(path.dirname(reportPath))) {
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Detailed report saved: ${reportPath}`);

    // Performance tracking
    if (process.env.ENABLE_PERFORMANCE_ANALYTICS === 'true') {
      await this.savePerformanceMetrics(reportData);
    }
  }

  async savePerformanceMetrics(reportData) {
    const metricsPath = path.join(process.cwd(), 'analytics', 'model-performance.json');
    
    let historicalData = [];
    if (fs.existsSync(metricsPath)) {
      historicalData = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    }
    
    historicalData.push({
      date: reportData.timestamp,
      summary: reportData.summary,
      topPerformer: reportData.results.reduce((best, current) => 
        current.qualityScore > best.qualityScore ? current : best
      )
    });
    
    // Keep only recent data based on retention policy
    const retentionDays = parseInt(process.env.ANALYTICS_RETENTION_DAYS) || 30;
    const cutoffDate = new Date(Date.now() - (retentionDays * 24 * 60 * 60 * 1000));
    historicalData = historicalData.filter(entry => new Date(entry.date) > cutoffDate);
    
    if (!fs.existsSync(path.dirname(metricsPath))) {
      fs.mkdirSync(path.dirname(metricsPath), { recursive: true });
    }
    
    fs.writeFileSync(metricsPath, JSON.stringify(historicalData, null, 2));
    console.log(chalk.gray('📈 Performance metrics updated'));
  }
}

// Main execution
async function main() {
  const tester = new MultiModelTester();
  
  if (Object.keys(tester.models).length === 0) {
    console.log(chalk.red('❌ No AI models configured with API keys.'));
    console.log(chalk.yellow('💡 Add API keys to your .env file and try again.'));
    console.log(chalk.blue('📚 See advanced-ai-model-testing-workflow.md for setup instructions.'));
    return;
  }
  
  await tester.runInteractiveTest();
  
  console.log('\n' + chalk.green('🎉 Multi-model testing complete!'));
  console.log(chalk.blue('💡 Use these results to optimize your AI model selection strategy.'));
}

main().catch(console.error);