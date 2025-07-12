#!/usr/bin/env node

/**
 * Interactive Learning Manager
 * Manages tooltips, context pop-ups, iframe integration, and Layer Prompting tools
 * Provides dynamic learning experience with demo synchronization
 */

const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');

class InteractiveLearningManager extends EventEmitter {
    constructor() {
        super();
        this.tooltipConfig = new Map();
        this.contextContent = new Map();
        this.demoSequences = new Map();
        this.learningState = new Map();
        this.interactionTracking = new Map();
        
        this.initializeSystem();
    }

    async initializeSystem() {
        console.log('🎓 Initializing Interactive Learning Manager...');
        
        try {
            await this.loadTooltipConfigurations();
            await this.loadContextContent();
            await this.loadDemoSequences();
            await this.initializeLearningTracking();
            
            console.log('✅ Interactive Learning Manager ready');
            this.emit('system-ready');
        } catch (error) {
            console.error('❌ Failed to initialize learning manager:', error);
            this.emit('system-error', error);
        }
    }

    // ===== TOOLTIP SYSTEM =====
    async loadTooltipConfigurations() {
        console.log('💡 Loading tooltip configurations...');

        const tooltipConfigs = {
            // Week 1 - Foundation
            'layer-prompting': {
                text: 'Our proprietary 7-layer AI interaction methodology',
                type: 'definition',
                category: 'methodology',
                relatedContent: ['layer-prompting-intro', 'seven-layers-overview'],
                interactionLevel: 'beginner',
                triggerEvents: ['hover', 'focus'],
                position: 'top',
                delay: 500,
                duration: 'persistent'
            },

            'productivity-gains': {
                text: 'Measured across 200+ course participants with verified business impact',
                type: 'statistic',
                category: 'results',
                relatedContent: ['productivity-case-studies', 'measurement-methodology'],
                interactionLevel: 'beginner',
                triggerEvents: ['hover'],
                position: 'bottom',
                delay: 300,
                duration: 3000
            },

            'context-layer': {
                text: 'Establish situational context and background information for AI',
                type: 'layer-explanation',
                category: 'layer-prompting',
                relatedContent: ['context-layer-details', 'context-examples'],
                interactionLevel: 'foundation',
                triggerEvents: ['hover', 'click'],
                position: 'right',
                delay: 200,
                duration: 'persistent'
            },

            'objective-layer': {
                text: 'Clear, measurable outcomes and success criteria definition',
                type: 'layer-explanation',
                category: 'layer-prompting',
                relatedContent: ['objective-layer-details', 'smart-goals'],
                interactionLevel: 'foundation',
                triggerEvents: ['hover', 'click'],
                position: 'right',
                delay: 200,
                duration: 'persistent'
            },

            'constraint-layer': {
                text: 'Resource, technical, and business constraints and boundaries',
                type: 'layer-explanation',
                category: 'layer-prompting',
                relatedContent: ['constraint-layer-details', 'constraint-examples'],
                interactionLevel: 'foundation',
                triggerEvents: ['hover', 'click'],
                position: 'right',
                delay: 200,
                duration: 'persistent'
            },

            'data-layer': {
                text: 'Relevant data, examples, and reference materials for context',
                type: 'layer-explanation',
                category: 'layer-prompting',
                relatedContent: ['data-layer-details', 'data-examples'],
                interactionLevel: 'foundation',
                triggerEvents: ['hover', 'click'],
                position: 'right',
                delay: 200,
                duration: 'persistent'
            },

            'process-layer': {
                text: 'Systematic methodology and execution process workflow',
                type: 'layer-explanation',
                category: 'layer-prompting',
                relatedContent: ['process-layer-details', 'workflow-examples'],
                interactionLevel: 'foundation',
                triggerEvents: ['hover', 'click'],
                position: 'right',
                delay: 200,
                duration: 'persistent'
            },

            'output-layer': {
                text: 'Desired structure, format, and presentation requirements',
                type: 'layer-explanation',
                category: 'layer-prompting',
                relatedContent: ['output-layer-details', 'format-examples'],
                interactionLevel: 'foundation',
                triggerEvents: ['hover', 'click'],
                position: 'right',
                delay: 200,
                duration: 'persistent'
            },

            'validation-layer': {
                text: 'Quality checks and success verification protocols',
                type: 'layer-explanation',
                category: 'layer-prompting',
                relatedContent: ['validation-layer-details', 'quality-examples'],
                interactionLevel: 'foundation',
                triggerEvents: ['hover', 'click'],
                position: 'right',
                delay: 200,
                duration: 'persistent'
            },

            // Advanced concepts
            'ai-model-orchestration': {
                text: 'Coordinating multiple AI models for complex business workflows',
                type: 'advanced-concept',
                category: 'specialization',
                relatedContent: ['orchestration-patterns', 'model-selection'],
                interactionLevel: 'specialization',
                triggerEvents: ['hover', 'click'],
                position: 'top',
                delay: 400,
                duration: 'persistent'
            },

            'business-automation': {
                text: 'End-to-end automation of business processes using Layer Prompting',
                type: 'application',
                category: 'business',
                relatedContent: ['automation-examples', 'implementation-guide'],
                interactionLevel: 'specialization',
                triggerEvents: ['hover'],
                position: 'bottom',
                delay: 300,
                duration: 4000
            },

            'roi-measurement': {
                text: 'Systematic approach to measuring return on investment from AI implementations',
                type: 'methodology',
                category: 'business',
                relatedContent: ['roi-framework', 'measurement-tools'],
                interactionLevel: 'mastery',
                triggerEvents: ['hover', 'click'],
                position: 'left',
                delay: 200,
                duration: 'persistent'
            }
        };

        this.tooltipConfig.set('configurations', tooltipConfigs);
        console.log('  ✅ Tooltip configurations loaded');
    }

    // ===== CONTEXT CONTENT SYSTEM =====
    async loadContextContent() {
        console.log('📋 Loading context content library...');

        const contextLibrary = {
            // Layer Prompting Core Content
            'layer-prompting-intro': {
                title: 'Layer Prompting Methodology',
                category: 'methodology',
                difficulty: 'foundation',
                estimatedReadTime: '3 minutes',
                content: `
                    <div class="context-content">
                        <h4>What is Layer Prompting?</h4>
                        <p>Layer Prompting is EnfusionAIze's proprietary methodology for structuring AI interactions across multiple cognitive layers to achieve optimal business outcomes.</p>
                        
                        <div class="highlight-box">
                            <h5>🧠 Cognitive Science Foundation</h5>
                            <p>Our 7-layer framework mirrors how humans naturally approach complex problem-solving, ensuring AI interactions feel intuitive and produce superior results.</p>
                        </div>
                        
                        <h4>Why 7 Layers?</h4>
                        <ul>
                            <li><strong>Cognitive Alignment:</strong> Mirrors human problem-solving processes</li>
                            <li><strong>Systematic Structure:</strong> Ensures consistency and reproducibility</li>
                            <li><strong>Context Preservation:</strong> Maintains information across interactions</li>
                            <li><strong>Quality Assurance:</strong> Built-in validation and error checking</li>
                            <li><strong>Scalable Implementation:</strong> Works across all AI models and use cases</li>
                        </ul>
                        
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number">425%</div>
                                <div class="stat-label">Avg Productivity Increase</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">60%</div>
                                <div class="stat-label">Cost Reduction</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">95%</div>
                                <div class="stat-label">Quality Consistency</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">200+</div>
                                <div class="stat-label">Successful Implementations</div>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="startLayerPromptingDemo()">Try Interactive Demo</button>
                            <button class="btn btn-secondary" onclick="downloadFrameworkGuide()">Download Framework Guide</button>
                        </div>
                    </div>
                `,
                relatedTopics: ['seven-layers-overview', 'implementation-guide', 'case-studies'],
                interactionTracking: true
            },

            'context-layer-details': {
                title: 'Context Layer - Deep Dive',
                category: 'layer-details',
                difficulty: 'foundation',
                estimatedReadTime: '4 minutes',
                content: `
                    <div class="context-content">
                        <h4>Context Layer: Environmental Awareness</h4>
                        <p>The Context Layer establishes the foundational understanding that guides all subsequent AI interactions.</p>
                        
                        <div class="layer-components">
                            <div class="component">
                                <h5>🌍 Environmental Context</h5>
                                <ul>
                                    <li>Current business situation and market conditions</li>
                                    <li>Organizational structure and team dynamics</li>
                                    <li>External constraints and opportunities</li>
                                    <li>Competitive landscape and positioning</li>
                                </ul>
                            </div>
                            
                            <div class="component">
                                <h5>📚 Historical Context</h5>
                                <ul>
                                    <li>Relevant past events and decisions</li>
                                    <li>Previous outcomes and lessons learned</li>
                                    <li>Historical performance and trends</li>
                                    <li>Evolution of strategies and approaches</li>
                                </ul>
                            </div>
                            
                            <div class="component">
                                <h5>🏢 Organizational Context</h5>
                                <ul>
                                    <li>Company culture and values</li>
                                    <li>Strategic goals and objectives</li>
                                    <li>Operational processes and workflows</li>
                                    <li>Resource availability and constraints</li>
                                </ul>
                            </div>
                            
                            <div class="component">
                                <h5>⚙️ Technical Context</h5>
                                <ul>
                                    <li>Available tools and systems</li>
                                    <li>Technical capabilities and limitations</li>
                                    <li>Integration requirements and possibilities</li>
                                    <li>Data sources and accessibility</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="example-section">
                            <h5>📝 Context Layer Example</h5>
                            <div class="code-example">
                                <pre>CONTEXT LAYER:
Environment: Mid-sized B2B SaaS company (150 employees), competitive market, growth stage
History: Previous strategies focused on feature development, limited market analysis
Organization: Product-focused culture, expanding sales team, strong technical foundation
Technology: EnfusionAIze platform, CRM integration, analytics capabilities, cloud infrastructure</pre>
                            </div>
                        </div>
                        
                        <div class="best-practices">
                            <h5>✅ Best Practices</h5>
                            <ul>
                                <li>Be specific and concrete rather than vague</li>
                                <li>Include both positive and challenging aspects</li>
                                <li>Consider multiple perspectives and stakeholders</li>
                                <li>Update context as situations evolve</li>
                                <li>Balance comprehensiveness with relevance</li>
                            </ul>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="practiceContextLayer()">Practice Exercise</button>
                            <button class="btn btn-secondary" onclick="viewContextTemplates()">View Templates</button>
                        </div>
                    </div>
                `,
                relatedTopics: ['objective-layer-details', 'context-examples', 'layer-interactions'],
                interactionTracking: true
            },

            'demo-walkthrough': {
                title: 'Interactive Demo Walkthrough',
                category: 'demonstration',
                difficulty: 'foundation',
                estimatedReadTime: '8 minutes',
                content: `
                    <div class="context-content">
                        <h4>Email Campaign Strategy Demo</h4>
                        <p>This guided walkthrough demonstrates how to apply Layer Prompting to a real business scenario.</p>
                        
                        <div class="demo-overview">
                            <h5>🎯 Learning Objectives</h5>
                            <ul>
                                <li>Apply all 7 layers to a practical business challenge</li>
                                <li>See how layers interact and build upon each other</li>
                                <li>Generate actionable business outputs</li>
                                <li>Practice quality validation techniques</li>
                            </ul>
                        </div>
                        
                        <div class="demo-scenario">
                            <h5>📋 Scenario: Product Launch Email Campaign</h5>
                            <div class="scenario-details">
                                <p><strong>Company:</strong> EcoTech Solutions</p>
                                <p><strong>Product:</strong> Smart Water Bottles with IoT sensors</p>
                                <p><strong>Goal:</strong> Generate 1000 qualified leads in 30 days</p>
                                <p><strong>Budget:</strong> $50,000 marketing spend</p>
                                <p><strong>Timeline:</strong> 2 weeks to launch, 4 weeks to execute</p>
                            </div>
                        </div>
                        
                        <div class="demo-layers">
                            <div class="layer-step">
                                <h6>Layer 1: Context</h6>
                                <p>Eco-friendly consumer goods market, sustainability-focused audience, Q4 launch timing, competitive landscape analysis</p>
                                <button class="btn btn-sm btn-primary" onclick="exploreLayer('context', 'demo')">Explore Context</button>
                            </div>
                            
                            <div class="layer-step">
                                <h6>Layer 2: Objective</h6>
                                <p>Generate 1000 qualified leads, 20% open rate, 5% CTR, 2% conversion rate, build brand awareness</p>
                                <button class="btn btn-sm btn-primary" onclick="exploreLayer('objective', 'demo')">Explore Objectives</button>
                            </div>
                            
                            <div class="layer-step">
                                <h6>Layer 3: Constraints</h6>
                                <p>$50K budget, 6-week timeline, email platform limitations, compliance requirements</p>
                                <button class="btn btn-sm btn-primary" onclick="exploreLayer('constraints', 'demo')">Explore Constraints</button>
                            </div>
                        </div>
                        
                        <div class="demo-progression">
                            <h5>🚀 Demo Components</h5>
                            <ol>
                                <li><strong>Scenario Setup:</strong> Real business context and requirements</li>
                                <li><strong>Layer-by-Layer Construction:</strong> Step-by-step prompt building</li>
                                <li><strong>AI Interaction:</strong> Live AI response generation</li>
                                <li><strong>Output Analysis:</strong> Quality assessment and optimization</li>
                                <li><strong>Implementation Planning:</strong> Next steps and action items</li>
                            </ol>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn btn-success" onclick="startFullDemo()">
                                <i class="fas fa-play"></i>
                                Start Interactive Demo
                            </button>
                            <button class="btn btn-primary" onclick="skipToLayerBuilder()">
                                <i class="fas fa-tools"></i>
                                Open Layer Builder
                            </button>
                        </div>
                    </div>
                `,
                relatedTopics: ['layer-builder', 'demo-scenarios', 'practice-exercises'],
                interactionTracking: true
            },

            'platform-integration': {
                title: 'Platform Integration Guide',
                category: 'technical',
                difficulty: 'specialization',
                estimatedReadTime: '6 minutes',
                content: `
                    <div class="context-content">
                        <h4>EnfusionAIze Platform Integration</h4>
                        <p>Comprehensive guide to integrating Layer Prompting with the complete EnfusionAIze ecosystem.</p>
                        
                        <div class="integration-overview">
                            <h5>🔧 Core Integrations</h5>
                            <div class="integration-grid">
                                <div class="integration-item">
                                    <h6>Cursor Build Stack</h6>
                                    <p>6 AI models orchestration for development workflows</p>
                                    <ul>
                                        <li>Claude for strategic reasoning</li>
                                        <li>Minimax for content generation</li>
                                        <li>Dora AI for design automation</li>
                                        <li>Cross-model workflow coordination</li>
                                    </ul>
                                </div>
                                
                                <div class="integration-item">
                                    <h6>MCP Ecosystem</h6>
                                    <p>5 MCP integrations for business automation</p>
                                    <ul>
                                        <li>Xero for financial operations</li>
                                        <li>Playwright for QA automation</li>
                                        <li>Perplexity for research</li>
                                        <li>Firecrawl for data extraction</li>
                                        <li>Humblytics for privacy-first analytics</li>
                                    </ul>
                                </div>
                                
                                <div class="integration-item">
                                    <h6>Analytics Dashboard</h6>
                                    <p>Real-time monitoring and optimization</p>
                                    <ul>
                                        <li>Performance tracking</li>
                                        <li>Usage analytics</li>
                                        <li>ROI measurement</li>
                                        <li>Quality metrics</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="setup-guide">
                            <h5>⚙️ Setup Process</h5>
                            <ol>
                                <li><strong>Platform Access:</strong> Activate your EnfusionAIze account</li>
                                <li><strong>API Configuration:</strong> Configure integration keys and endpoints</li>
                                <li><strong>Tool Selection:</strong> Choose relevant tools for your use case</li>
                                <li><strong>Workflow Setup:</strong> Create automated Layer Prompting workflows</li>
                                <li><strong>Testing & Validation:</strong> Verify integrations and performance</li>
                            </ol>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="startPlatformSetup()">Start Platform Setup</button>
                            <button class="btn btn-secondary" onclick="viewIntegrationDocs()">View Documentation</button>
                        </div>
                    </div>
                `,
                relatedTopics: ['api-documentation', 'workflow-examples', 'troubleshooting'],
                interactionTracking: true
            }
        };

        this.contextContent.set('library', contextLibrary);
        console.log('  ✅ Context content library loaded');
    }

    // ===== DEMO SEQUENCES =====
    async loadDemoSequences() {
        console.log('🎬 Loading demo sequences...');

        const demoSequences = {
            'email-campaign-demo': {
                title: 'Email Campaign Strategy Demo',
                duration: '12 minutes',
                difficulty: 'foundation',
                prerequisites: ['layer-prompting-basics'],
                sequence: [
                    {
                        step: 1,
                        title: 'Scenario Introduction',
                        duration: '2 minutes',
                        content: 'Introduction to EcoTech Solutions and their product launch challenge',
                        interactiveElements: ['company-overview', 'market-analysis'],
                        tooltips: ['market-research', 'target-audience'],
                        demoActions: ['loadCompanyProfile', 'showMarketData']
                    },
                    {
                        step: 2,
                        title: 'Context Layer Construction',
                        duration: '2 minutes',
                        content: 'Building the environmental, historical, organizational, and technical context',
                        interactiveElements: ['context-builder', 'stakeholder-map'],
                        tooltips: ['environmental-factors', 'organizational-culture'],
                        demoActions: ['buildContextLayer', 'validateContext']
                    },
                    {
                        step: 3,
                        title: 'Objective Layer Definition',
                        duration: '2 minutes',
                        content: 'Defining clear, measurable goals and success metrics',
                        interactiveElements: ['smart-goals-builder', 'metrics-calculator'],
                        tooltips: ['smart-criteria', 'kpi-selection'],
                        demoActions: ['defineObjectives', 'setMetrics']
                    },
                    {
                        step: 4,
                        title: 'Constraint & Data Layers',
                        duration: '2 minutes',
                        content: 'Identifying limitations and gathering relevant information',
                        interactiveElements: ['constraint-mapper', 'data-collector'],
                        tooltips: ['resource-constraints', 'data-quality'],
                        demoActions: ['mapConstraints', 'gatherData']
                    },
                    {
                        step: 5,
                        title: 'Process & Output Layers',
                        duration: '2 minutes',
                        content: 'Designing the workflow and defining desired outcomes',
                        interactiveElements: ['process-designer', 'output-formatter'],
                        tooltips: ['workflow-optimization', 'output-formats'],
                        demoActions: ['designProcess', 'formatOutput']
                    },
                    {
                        step: 6,
                        title: 'Validation & Implementation',
                        duration: '2 minutes',
                        content: 'Quality assurance and implementation planning',
                        interactiveElements: ['quality-checker', 'implementation-planner'],
                        tooltips: ['quality-metrics', 'implementation-strategy'],
                        demoActions: ['validateOutput', 'planImplementation']
                    }
                ],
                learningOutcomes: [
                    'Complete Layer Prompting framework application',
                    'Real-world business scenario handling',
                    'Quality validation techniques',
                    'Implementation planning skills'
                ],
                relatedExercises: ['email-campaign-exercise', 'campaign-optimization'],
                assessmentQuestions: [
                    'Which layer is most critical for campaign success?',
                    'How would you modify this approach for B2B vs B2C?',
                    'What quality metrics would you track?'
                ]
            },

            'platform-integration-demo': {
                title: 'Platform Integration Walkthrough',
                duration: '15 minutes',
                difficulty: 'specialization',
                prerequisites: ['layer-prompting-proficiency', 'api-basics'],
                sequence: [
                    {
                        step: 1,
                        title: 'Platform Overview',
                        duration: '3 minutes',
                        content: 'EnfusionAIze ecosystem tour and capabilities overview',
                        interactiveElements: ['platform-tour', 'feature-showcase'],
                        tooltips: ['ai-models', 'mcp-tools', 'analytics'],
                        demoActions: ['tourPlatform', 'showcaseFeatures']
                    },
                    {
                        step: 2,
                        title: 'Cursor Build Stack Setup',
                        duration: '4 minutes',
                        content: 'Configuring 6 AI models for development workflows',
                        interactiveElements: ['model-configurator', 'workflow-builder'],
                        tooltips: ['model-selection', 'workflow-optimization'],
                        demoActions: ['configureModels', 'buildWorkflow']
                    },
                    {
                        step: 3,
                        title: 'MCP Integration Configuration',
                        duration: '4 minutes',
                        content: 'Setting up business tool integrations',
                        interactiveElements: ['mcp-configurator', 'connection-tester'],
                        tooltips: ['api-keys', 'permissions', 'data-flow'],
                        demoActions: ['configureMCPs', 'testConnections']
                    },
                    {
                        step: 4,
                        title: 'Layer Prompting Integration',
                        duration: '4 minutes',
                        content: 'Connecting Layer Prompting with platform tools',
                        interactiveElements: ['integration-mapper', 'automation-builder'],
                        tooltips: ['prompt-automation', 'tool-orchestration'],
                        demoActions: ['mapIntegrations', 'buildAutomation']
                    }
                ],
                learningOutcomes: [
                    'Complete platform integration setup',
                    'Multi-tool workflow creation',
                    'Automation implementation',
                    'Performance optimization'
                ]
            }
        };

        this.demoSequences.set('sequences', demoSequences);
        console.log('  ✅ Demo sequences loaded');
    }

    // ===== LEARNING STATE TRACKING =====
    async initializeLearningTracking() {
        console.log('📊 Initializing learning state tracking...');

        this.learningState.set('user-progress', {
            currentWeek: 1,
            completedLessons: [],
            skillLevels: {
                'layer-prompting': 'beginner',
                'platform-integration': 'beginner',
                'business-automation': 'beginner',
                'ai-orchestration': 'beginner'
            },
            interactionHistory: [],
            preferredLearningStyle: 'mixed',
            adaptiveSettings: {
                tooltipDuration: 'medium',
                contextDepth: 'detailed',
                demoSpeed: 'normal',
                exerciseDifficulty: 'progressive'
            }
        });

        this.interactionTracking.set('metrics', {
            tooltipViews: new Map(),
            contextPopupOpens: new Map(),
            demoCompletions: new Map(),
            exerciseAttempts: new Map(),
            layerPromptCreations: new Map(),
            timeSpentPerSection: new Map()
        });

        console.log('  ✅ Learning tracking initialized');
    }

    // ===== TOOLTIP MANAGEMENT =====
    generateTooltipHTML(tooltipKey, context = {}) {
        const config = this.tooltipConfig.get('configurations')[tooltipKey];
        if (!config) return null;

        const userProgress = this.learningState.get('user-progress');
        const isAppropriateLevel = this.checkInteractionLevel(config.interactionLevel, userProgress.skillLevels);

        if (!isAppropriateLevel) {
            return null; // Don't show advanced tooltips to beginners
        }

        const tooltipHTML = `
            <div class="enhanced-tooltip" 
                 data-key="${tooltipKey}"
                 data-type="${config.type}"
                 data-category="${config.category}"
                 data-position="${config.position}"
                 data-delay="${config.delay}"
                 data-duration="${config.duration}">
                <div class="tooltip-content">
                    <div class="tooltip-text">${config.text}</div>
                    ${config.relatedContent.length > 0 ? `
                        <div class="tooltip-actions">
                            <button class="tooltip-btn" onclick="showRelatedContent('${tooltipKey}')">
                                <i class="fas fa-info-circle"></i>
                                Learn More
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="tooltip-arrow"></div>
            </div>
        `;

        // Track tooltip view
        this.trackTooltipView(tooltipKey, context);

        return tooltipHTML;
    }

    checkInteractionLevel(requiredLevel, userSkills) {
        const levelHierarchy = {
            'beginner': 0,
            'foundation': 1,
            'specialization': 2,
            'mastery': 3
        };

        const userLevel = Math.max(...Object.values(userSkills).map(skill => levelHierarchy[skill] || 0));
        const requiredLevelValue = levelHierarchy[requiredLevel] || 0;

        return userLevel >= requiredLevelValue;
    }

    trackTooltipView(tooltipKey, context) {
        const metrics = this.interactionTracking.get('metrics');
        if (!metrics.tooltipViews.has(tooltipKey)) {
            metrics.tooltipViews.set(tooltipKey, []);
        }
        
        metrics.tooltipViews.get(tooltipKey).push({
            timestamp: new Date().toISOString(),
            context,
            userProgress: this.learningState.get('user-progress').currentWeek
        });
    }

    // ===== CONTEXT POPUP MANAGEMENT =====
    generateContextPopup(contentKey, additionalData = {}) {
        const content = this.contextContent.get('library')[contentKey];
        if (!content) return null;

        const popupHTML = `
            <div class="enhanced-popup" data-content-key="${contentKey}">
                <div class="popup-header">
                    <h3 class="popup-title">${content.title}</h3>
                    <div class="popup-meta">
                        <span class="difficulty-badge ${content.difficulty}">${content.difficulty}</span>
                        <span class="read-time">
                            <i class="fas fa-clock"></i>
                            ${content.estimatedReadTime}
                        </span>
                    </div>
                    <button class="popup-close" onclick="closeEnhancedPopup()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-body">
                    ${content.content}
                    ${content.relatedTopics.length > 0 ? `
                        <div class="related-topics">
                            <h5>Related Topics</h5>
                            <div class="topic-links">
                                ${content.relatedTopics.map(topic => `
                                    <button class="topic-link" onclick="navigateToTopic('${topic}')">
                                        ${this.formatTopicName(topic)}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="popup-footer">
                    <div class="interaction-buttons">
                        <button class="btn btn-secondary" onclick="markAsHelpful('${contentKey}')">
                            <i class="fas fa-thumbs-up"></i>
                            Helpful
                        </button>
                        <button class="btn btn-secondary" onclick="requestMoreInfo('${contentKey}')">
                            <i class="fas fa-question-circle"></i>
                            Need More Info
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Track popup open
        this.trackContextPopupOpen(contentKey, additionalData);

        return popupHTML;
    }

    formatTopicName(topicKey) {
        return topicKey.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    trackContextPopupOpen(contentKey, additionalData) {
        const metrics = this.interactionTracking.get('metrics');
        if (!metrics.contextPopupOpens.has(contentKey)) {
            metrics.contextPopupOpens.set(contentKey, []);
        }
        
        metrics.contextPopupOpens.get(contentKey).push({
            timestamp: new Date().toISOString(),
            additionalData,
            userProgress: this.learningState.get('user-progress').currentWeek,
            sessionId: this.generateSessionId()
        });
    }

    // ===== DEMO SYNCHRONIZATION =====
    async synchronizeDemoWithClient(demoKey, clientDemoState) {
        console.log(`🔄 Synchronizing demo: ${demoKey}...`);

        const demoSequence = this.demoSequences.get('sequences')[demoKey];
        if (!demoSequence) {
            throw new Error(`Demo sequence ${demoKey} not found`);
        }

        const synchronizationData = {
            demoKey,
            clientState: clientDemoState,
            serverSequence: demoSequence,
            synchronizedAt: new Date().toISOString(),
            
            // Current step and progress
            currentStep: clientDemoState.currentStep || 1,
            completedSteps: clientDemoState.completedSteps || [],
            
            // User-specific adaptations
            adaptations: this.generateDemoAdaptations(demoSequence, clientDemoState),
            
            // Interactive elements for current step
            currentStepData: this.getCurrentStepData(demoSequence, clientDemoState.currentStep || 1),
            
            // Progress tracking
            progressPercentage: ((clientDemoState.completedSteps?.length || 0) / demoSequence.sequence.length) * 100,
            
            // Next actions
            nextActions: this.getNextActions(demoSequence, clientDemoState.currentStep || 1)
        };

        // Track demo interaction
        this.trackDemoInteraction(demoKey, 'synchronize', synchronizationData);

        console.log(`  ✅ Demo synchronized: ${synchronizationData.progressPercentage.toFixed(1)}% complete`);
        return synchronizationData;
    }

    generateDemoAdaptations(demoSequence, clientState) {
        const userProgress = this.learningState.get('user-progress');
        const adaptations = {
            speed: userProgress.adaptiveSettings.demoSpeed,
            depth: userProgress.adaptiveSettings.contextDepth,
            interactivity: this.calculateOptimalInteractivity(userProgress),
            tooltipDensity: this.calculateTooltipDensity(userProgress),
            examples: this.selectRelevantExamples(demoSequence, userProgress)
        };

        return adaptations;
    }

    getCurrentStepData(demoSequence, currentStep) {
        const step = demoSequence.sequence.find(s => s.step === currentStep);
        if (!step) return null;

        return {
            step: step.step,
            title: step.title,
            duration: step.duration,
            content: step.content,
            interactiveElements: step.interactiveElements,
            tooltips: step.tooltips.map(tooltipKey => ({
                key: tooltipKey,
                config: this.tooltipConfig.get('configurations')[tooltipKey]
            })),
            demoActions: step.demoActions
        };
    }

    getNextActions(demoSequence, currentStep) {
        const nextStep = demoSequence.sequence.find(s => s.step === currentStep + 1);
        
        return {
            canProceed: !!nextStep,
            nextStepTitle: nextStep?.title,
            completionActions: currentStep === demoSequence.sequence.length ? [
                'Complete assessment',
                'Try related exercises',
                'Explore advanced topics'
            ] : null,
            recommendedActions: [
                'Review current step',
                'Practice with tools',
                'Ask questions'
            ]
        };
    }

    // ===== IFRAME INTEGRATION =====
    generateIframeContent(contentType, weekNumber, options = {}) {
        const baseContent = {
            courseMaterials: this.generateCourseMaterialsContent(weekNumber),
            interactiveExercises: this.generateInteractiveExercisesContent(weekNumber),
            layerPromptBuilder: this.generateLayerPromptBuilderContent(options),
            progressTracking: this.generateProgressTrackingContent(),
            communityForum: this.generateCommunityForumContent(weekNumber)
        };

        const content = baseContent[contentType] || baseContent.courseMaterials;
        
        return this.wrapIframeContent(content, {
            contentType,
            weekNumber,
            options,
            generatedAt: new Date().toISOString()
        });
    }

    generateCourseMaterialsContent(weekNumber) {
        const userProgress = this.learningState.get('user-progress');
        
        return `
            <div class="iframe-course-content">
                <div class="content-header">
                    <h2>Week ${weekNumber} Course Materials</h2>
                    <div class="progress-indicator">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(weekNumber / 13) * 100}%"></div>
                        </div>
                        <span class="progress-text">${weekNumber} of 13 weeks</span>
                    </div>
                </div>
                
                <div class="content-sections">
                    <div class="section-card">
                        <h3>📹 Video Lessons</h3>
                        <ul>
                            <li><span class="video-icon">▶️</span> Layer Prompting Introduction (8 min)</li>
                            <li><span class="video-icon">▶️</span> Platform Walkthrough (12 min)</li>
                            <li><span class="video-icon">▶️</span> First Prompt Creation (6 min)</li>
                        </ul>
                    </div>
                    
                    <div class="section-card">
                        <h3>📚 Reading Materials</h3>
                        <ul>
                            <li>Layer Prompting Framework Guide</li>
                            <li>7 Layers Reference Sheet</li>
                            <li>Best Practices Checklist</li>
                        </ul>
                    </div>
                    
                    <div class="section-card">
                        <h3>🛠️ Interactive Tools</h3>
                        <ul>
                            <li>Layer Prompt Builder</li>
                            <li>Template Library</li>
                            <li>Practice Exercises</li>
                        </ul>
                    </div>
                    
                    <div class="section-card">
                        <h3>✅ Assessments</h3>
                        <ul>
                            <li>Knowledge Check Quiz</li>
                            <li>Practical Application Exercise</li>
                            <li>Peer Review Assignment</li>
                        </ul>
                    </div>
                </div>
                
                <div class="content-actions">
                    <button class="btn btn-primary" onclick="parent.startWeekContent(${weekNumber})">
                        Start Week ${weekNumber}
                    </button>
                    <button class="btn btn-secondary" onclick="parent.downloadResources(${weekNumber})">
                        Download Resources
                    </button>
                </div>
            </div>
        `;
    }

    generateLayerPromptBuilderContent(options) {
        return `
            <div class="iframe-prompt-builder">
                <div class="builder-header">
                    <h2>🤖 Layer Prompt Builder</h2>
                    <div class="builder-controls">
                        <button class="btn btn-sm btn-secondary" onclick="parent.loadPromptTemplate()">
                            Load Template
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="parent.savePromptDraft()">
                            Save Draft
                        </button>
                    </div>
                </div>
                
                <div class="builder-content">
                    <div class="layer-builder-form">
                        <div class="layer-group">
                            <label class="layer-label">
                                <span class="layer-number">1</span>
                                Context Layer
                                <span class="help-icon" onclick="parent.showLayerHelp('context')">❓</span>
                            </label>
                            <textarea class="layer-input" placeholder="Describe the environment, situation, and background..."></textarea>
                        </div>
                        
                        <div class="layer-group">
                            <label class="layer-label">
                                <span class="layer-number">2</span>
                                Objective Layer
                                <span class="help-icon" onclick="parent.showLayerHelp('objective')">❓</span>
                            </label>
                            <textarea class="layer-input" placeholder="Define clear goals and success metrics..."></textarea>
                        </div>
                        
                        <div class="layer-group">
                            <label class="layer-label">
                                <span class="layer-number">3</span>
                                Constraint Layer
                                <span class="help-icon" onclick="parent.showLayerHelp('constraint')">❓</span>
                            </label>
                            <textarea class="layer-input" placeholder="Specify limitations and boundaries..."></textarea>
                        </div>
                        
                        <div class="layer-actions">
                            <button class="btn btn-success" onclick="parent.generatePrompt()">
                                <i class="fas fa-magic"></i>
                                Generate Prompt
                            </button>
                            <button class="btn btn-secondary" onclick="parent.validatePrompt()">
                                <i class="fas fa-check-circle"></i>
                                Validate
                            </button>
                        </div>
                    </div>
                    
                    <div class="builder-output">
                        <h4>Generated Prompt</h4>
                        <div class="prompt-output-area">
                            <em>Your generated Layer Prompt will appear here...</em>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    wrapIframeContent(content, metadata) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>EnfusionAIze Course Content</title>
                <style>
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        background: #1e293b;
                        color: #f8fafc;
                        margin: 0;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .iframe-course-content,
                    .iframe-prompt-builder {
                        max-width: 100%;
                    }
                    .content-header {
                        margin-bottom: 24px;
                        border-bottom: 1px solid #334155;
                        padding-bottom: 16px;
                    }
                    .content-header h2 {
                        color: #1e40af;
                        margin: 0 0 8px 0;
                    }
                    .progress-indicator {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .progress-bar {
                        flex: 1;
                        height: 8px;
                        background: #334155;
                        border-radius: 4px;
                        overflow: hidden;
                    }
                    .progress-fill {
                        height: 100%;
                        background: linear-gradient(135deg, #1e40af, #06b6d4);
                        transition: width 0.3s ease;
                    }
                    .progress-text {
                        font-size: 0.9rem;
                        color: #cbd5e1;
                    }
                    .content-sections {
                        display: grid;
                        gap: 16px;
                        margin-bottom: 24px;
                    }
                    .section-card {
                        background: #374151;
                        border: 1px solid #4b5563;
                        border-radius: 8px;
                        padding: 16px;
                    }
                    .section-card h3 {
                        margin: 0 0 12px 0;
                        color: #f8fafc;
                    }
                    .section-card ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    .section-card li {
                        padding: 6px 0;
                        color: #cbd5e1;
                    }
                    .video-icon {
                        margin-right: 8px;
                    }
                    .content-actions {
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                    }
                    .btn {
                        padding: 8px 16px;
                        border: none;
                        border-radius: 6px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .btn-primary {
                        background: linear-gradient(135deg, #1e40af, #06b6d4);
                        color: white;
                    }
                    .btn-secondary {
                        background: #4b5563;
                        color: #f8fafc;
                    }
                    .btn:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    }
                    
                    /* Layer Builder Styles */
                    .builder-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 24px;
                        border-bottom: 1px solid #334155;
                        padding-bottom: 16px;
                    }
                    .builder-controls {
                        display: flex;
                        gap: 8px;
                    }
                    .btn-sm {
                        padding: 6px 12px;
                        font-size: 0.875rem;
                    }
                    .layer-builder-form {
                        margin-bottom: 24px;
                    }
                    .layer-group {
                        margin-bottom: 20px;
                    }
                    .layer-label {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 8px;
                        font-weight: 600;
                        color: #f8fafc;
                    }
                    .layer-number {
                        background: #1e40af;
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.875rem;
                    }
                    .help-icon {
                        margin-left: auto;
                        cursor: pointer;
                        opacity: 0.7;
                    }
                    .help-icon:hover {
                        opacity: 1;
                    }
                    .layer-input {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #4b5563;
                        border-radius: 6px;
                        background: #374151;
                        color: #f8fafc;
                        font-family: inherit;
                        font-size: 0.9rem;
                        resize: vertical;
                        min-height: 80px;
                    }
                    .layer-input:focus {
                        outline: none;
                        border-color: #1e40af;
                        box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
                    }
                    .layer-actions {
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                        margin: 24px 0;
                    }
                    .builder-output {
                        background: #374151;
                        border: 1px solid #4b5563;
                        border-radius: 8px;
                        padding: 16px;
                    }
                    .builder-output h4 {
                        margin: 0 0 12px 0;
                        color: #10b981;
                    }
                    .prompt-output-area {
                        background: #1f2937;
                        border: 1px solid #374151;
                        border-radius: 6px;
                        padding: 12px;
                        min-height: 120px;
                        font-family: monospace;
                        font-size: 0.9rem;
                        color: #cbd5e1;
                    }
                </style>
            </head>
            <body>
                ${content}
                <script>
                    // Communication with parent window
                    window.addEventListener('message', function(event) {
                        if (event.origin !== window.location.origin) return;
                        
                        // Handle messages from parent
                        const { type, data } = event.data;
                        switch (type) {
                            case 'updateContent':
                                updateContent(data);
                                break;
                            case 'highlightElement':
                                highlightElement(data.selector);
                                break;
                            case 'scrollToElement':
                                scrollToElement(data.selector);
                                break;
                        }
                    });
                    
                    function updateContent(data) {
                        // Update iframe content dynamically
                        console.log('Updating content:', data);
                    }
                    
                    function highlightElement(selector) {
                        const element = document.querySelector(selector);
                        if (element) {
                            element.style.animation = 'highlight 2s ease-in-out';
                        }
                    }
                    
                    function scrollToElement(selector) {
                        const element = document.querySelector(selector);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                </script>
                <style>
                    @keyframes highlight {
                        0%, 100% { background-color: transparent; }
                        50% { background-color: rgba(30, 64, 175, 0.2); }
                    }
                </style>
            </body>
            </html>
        `;
    }

    // ===== ANALYTICS & REPORTING =====
    generateInteractionReport() {
        const metrics = this.interactionTracking.get('metrics');
        const userProgress = this.learningState.get('user-progress');
        
        return {
            timestamp: new Date().toISOString(),
            userProgress,
            
            tooltipMetrics: {
                totalViews: Array.from(metrics.tooltipViews.values()).reduce((sum, views) => sum + views.length, 0),
                uniqueTooltips: metrics.tooltipViews.size,
                topTooltips: this.getTopTooltips(metrics.tooltipViews),
                avgViewsPerTooltip: Array.from(metrics.tooltipViews.values()).reduce((sum, views) => sum + views.length, 0) / metrics.tooltipViews.size
            },
            
            contextMetrics: {
                totalOpens: Array.from(metrics.contextPopupOpens.values()).reduce((sum, opens) => sum + opens.length, 0),
                uniqueContent: metrics.contextPopupOpens.size,
                topContent: this.getTopContent(metrics.contextPopupOpens),
                avgOpensPerContent: Array.from(metrics.contextPopupOpens.values()).reduce((sum, opens) => sum + opens.length, 0) / metrics.contextPopupOpens.size
            },
            
            demoMetrics: {
                totalCompletions: Array.from(metrics.demoCompletions.values()).reduce((sum, completions) => sum + completions.length, 0),
                completionRate: this.calculateDemoCompletionRate(metrics.demoCompletions),
                avgTimePerDemo: this.calculateAvgDemoTime(metrics.demoCompletions)
            },
            
            learningEffectiveness: {
                engagementScore: this.calculateEngagementScore(metrics),
                comprehensionScore: this.calculateComprehensionScore(userProgress),
                progressionRate: this.calculateProgressionRate(userProgress)
            }
        };
    }

    getTopTooltips(tooltipViews) {
        return Array.from(tooltipViews.entries())
            .sort(([,a], [,b]) => b.length - a.length)
            .slice(0, 5)
            .map(([key, views]) => ({ key, views: views.length }));
    }

    getTopContent(contextOpens) {
        return Array.from(contextOpens.entries())
            .sort(([,a], [,b]) => b.length - a.length)
            .slice(0, 5)
            .map(([key, opens]) => ({ key, opens: opens.length }));
    }

    calculateEngagementScore(metrics) {
        const tooltipEngagement = metrics.tooltipViews.size * 0.3;
        const contextEngagement = metrics.contextPopupOpens.size * 0.4;
        const demoEngagement = metrics.demoCompletions.size * 0.3;
        
        return Math.min(100, (tooltipEngagement + contextEngagement + demoEngagement) * 10);
    }

    // ===== UTILITIES =====
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    trackDemoInteraction(demoKey, action, data) {
        const metrics = this.interactionTracking.get('metrics');
        if (!metrics.demoCompletions.has(demoKey)) {
            metrics.demoCompletions.set(demoKey, []);
        }
        
        metrics.demoCompletions.get(demoKey).push({
            action,
            data,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId()
        });
    }

    async exportLearningData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            
            tooltipConfigurations: this.tooltipConfig.get('configurations'),
            contextContent: this.contextContent.get('library'),
            demoSequences: this.demoSequences.get('sequences'),
            learningState: this.learningState.get('user-progress'),
            interactionMetrics: Object.fromEntries(this.interactionTracking.get('metrics')),
            
            analyticsReport: this.generateInteractionReport()
        };

        const exportPath = path.join(__dirname, '../exports/learning-data', `learning-export-${Date.now()}.json`);
        await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));
        
        console.log(`📊 Learning data exported to ${exportPath}`);
        return exportPath;
    }
}

// ===== CLI INTERFACE =====

if (require.main === module) {
    const manager = new InteractiveLearningManager();

    const command = process.argv[2];
    const args = process.argv.slice(3);

    manager.on('system-ready', async () => {
        try {
            switch (command) {
                case 'generate-tooltip':
                    const tooltipKey = args[0];
                    if (!tooltipKey) {
                        console.error('❌ Tooltip key required');
                        process.exit(1);
                    }
                    const tooltipHTML = manager.generateTooltipHTML(tooltipKey);
                    console.log('\n💡 Generated Tooltip:', tooltipHTML);
                    break;

                case 'generate-popup':
                    const contentKey = args[0];
                    if (!contentKey) {
                        console.error('❌ Content key required');
                        process.exit(1);
                    }
                    const popupHTML = manager.generateContextPopup(contentKey);
                    console.log('\n📋 Generated Popup:', popupHTML);
                    break;

                case 'sync-demo':
                    const demoKey = args[0];
                    const clientState = args[1] ? JSON.parse(args[1]) : { currentStep: 1 };
                    if (!demoKey) {
                        console.error('❌ Demo key required');
                        process.exit(1);
                    }
                    const syncData = await manager.synchronizeDemoWithClient(demoKey, clientState);
                    console.log('\n🎬 Demo Synchronization:', JSON.stringify(syncData, null, 2));
                    break;

                case 'generate-iframe':
                    const contentType = args[0] || 'courseMaterials';
                    const weekNumber = parseInt(args[1]) || 1;
                    const iframeContent = manager.generateIframeContent(contentType, weekNumber);
                    console.log('\n🖼️ Generated Iframe Content:', iframeContent.substring(0, 500) + '...');
                    break;

                case 'report':
                    const report = manager.generateInteractionReport();
                    console.log('\n📊 Interaction Report:', JSON.stringify(report, null, 2));
                    break;

                case 'export':
                    const exportPath = await manager.exportLearningData();
                    console.log(`\n📦 Learning data exported to: ${exportPath}`);
                    break;

                default:
                    console.log(`
🎓 Interactive Learning Manager

Available commands:
  generate-tooltip    - Generate tooltip HTML for a key
  generate-popup      - Generate context popup HTML
  sync-demo          - Synchronize demo with client state
  generate-iframe    - Generate iframe content
  report             - Generate interaction analytics report
  export             - Export complete learning data

Examples:
  node interactive-learning-manager.js generate-tooltip "layer-prompting"
  node interactive-learning-manager.js generate-popup "context-layer-details"
  node interactive-learning-manager.js sync-demo "email-campaign-demo" '{"currentStep": 3}'
  node interactive-learning-manager.js generate-iframe "layerPromptBuilder" 1
  node interactive-learning-manager.js report
`);
            }

            process.exit(0);
        } catch (error) {
            console.error('❌ Command failed:', error);
            process.exit(1);
        }
    });

    manager.on('system-error', (error) => {
        console.error('❌ System initialization failed:', error);
        process.exit(1);
    });
}

module.exports = InteractiveLearningManager;