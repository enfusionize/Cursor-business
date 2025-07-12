#!/usr/bin/env node

/**
 * Figma to Framer Converter MCP
 * Converts Figma designs to Framer sites with automated component organization
 * Integrates with official "Figma to HTML with Framer" plugin workflow
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class FigmaFramerConverter {
  constructor() {
    this.server = new Server(
      {
        name: 'figma-framer-converter',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.figmaConfig = {
      apiKey: process.env.FIGMA_API_KEY,
      baseUrl: 'https://api.figma.com/v1'
    };

    this.framerConfig = {
      apiUrl: 'https://api.framer.com/v1',
      accessToken: process.env.FRAMER_ACCESS_TOKEN
    };

    this.pageTemplates = {
      landing: {
        sections: ['hero', 'features', 'testimonials', 'cta', 'footer'],
        description: 'High-converting landing page'
      },
      sales: {
        sections: ['headline', 'problem', 'solution', 'benefits', 'pricing', 'guarantee', 'faq', 'cta'],
        description: 'Sales page optimized for conversions'
      },
      web: {
        sections: ['header', 'navigation', 'main-content', 'sidebar', 'footer'],
        description: 'Standard website layout'
      },
      portfolio: {
        sections: ['header', 'about', 'projects', 'skills', 'contact'],
        description: 'Portfolio showcase'
      },
      blog: {
        sections: ['header', 'article-list', 'featured', 'sidebar', 'footer'],
        description: 'Blog layout'
      },
      ecommerce: {
        sections: ['header', 'product-grid', 'filters', 'cart', 'checkout', 'footer'],
        description: 'E-commerce store layout'
      }
    };

    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'figma://projects',
          name: 'Figma Projects',
          description: 'List all accessible Figma projects',
          mimeType: 'application/json',
        },
        {
          uri: 'framer://sites',
          name: 'Framer Sites',
          description: 'List all Framer sites',
          mimeType: 'application/json',
        },
        {
          uri: 'converter://templates',
          name: 'Page Templates',
          description: 'Available page templates for conversion',
          mimeType: 'application/json',
        }
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === 'figma://projects') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(await this.getFigmaProjects(), null, 2),
            },
          ],
        };
      }

      if (uri === 'framer://sites') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(await this.getFramerSites(), null, 2),
            },
          ],
        };
      }

      if (uri === 'converter://templates') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.pageTemplates, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'convert_figma_to_framer',
          description: 'Convert Figma design to Framer site with automated organization',
          inputSchema: {
            type: 'object',
            properties: {
              figmaFileId: {
                type: 'string',
                description: 'Figma file ID to convert'
              },
              pageType: {
                type: 'string',
                enum: Object.keys(this.pageTemplates),
                description: 'Type of page to create'
              },
              projectName: {
                type: 'string',
                description: 'Name for the Framer project'
              },
              autoLayout: {
                type: 'boolean',
                description: 'Convert to auto layout before import',
                default: true
              },
              optimizeAssets: {
                type: 'boolean',
                description: 'Optimize images and assets',
                default: true
              }
            },
            required: ['figmaFileId', 'pageType', 'projectName']
          }
        },
        {
          name: 'batch_convert_figma_pages',
          description: 'Convert multiple Figma pages/frames to different Framer page types',
          inputSchema: {
            type: 'object',
            properties: {
              conversions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    figmaFileId: { type: 'string' },
                    frameId: { type: 'string' },
                    pageType: { type: 'string', enum: Object.keys(this.pageTemplates) },
                    pageName: { type: 'string' }
                  },
                  required: ['figmaFileId', 'frameId', 'pageType', 'pageName']
                }
              },
              framerProjectId: {
                type: 'string',
                description: 'Target Framer project ID'
              }
            },
            required: ['conversions']
          }
        },
        {
          name: 'analyze_figma_design',
          description: 'Analyze Figma design structure and suggest optimal page type',
          inputSchema: {
            type: 'object',
            properties: {
              figmaFileId: {
                type: 'string',
                description: 'Figma file ID to analyze'
              },
              frameId: {
                type: 'string',
                description: 'Specific frame to analyze (optional)'
              }
            },
            required: ['figmaFileId']
          }
        },
        {
          name: 'setup_framer_components',
          description: 'Organize converted components into reusable Framer components',
          inputSchema: {
            type: 'object',
            properties: {
              framerProjectId: {
                type: 'string',
                description: 'Framer project ID'
              },
              componentMapping: {
                type: 'object',
                description: 'Mapping of Figma components to Framer components'
              }
            },
            required: ['framerProjectId']
          }
        },
        {
          name: 'optimize_for_responsive',
          description: 'Optimize Framer site for responsive design across devices',
          inputSchema: {
            type: 'object',
            properties: {
              framerProjectId: {
                type: 'string',
                description: 'Framer project ID'
              },
              breakpoints: {
                type: 'array',
                items: { type: 'string' },
                description: 'Responsive breakpoints to optimize for',
                default: ['mobile', 'tablet', 'desktop']
              }
            },
            required: ['framerProjectId']
          }
        },
        {
          name: 'create_framer_cms_structure',
          description: 'Create CMS structure in Framer based on design content',
          inputSchema: {
            type: 'object',
            properties: {
              framerProjectId: {
                type: 'string',
                description: 'Framer project ID'
              },
              contentTypes: {
                type: 'array',
                items: { type: 'string' },
                description: 'Content types to create'
              }
            },
            required: ['framerProjectId', 'contentTypes']
          }
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'convert_figma_to_framer':
            return await this.convertFigmaToFramer(args);
          case 'batch_convert_figma_pages':
            return await this.batchConvertFigmaPages(args);
          case 'analyze_figma_design':
            return await this.analyzeFigmaDesign(args);
          case 'setup_framer_components':
            return await this.setupFramerComponents(args);
          case 'optimize_for_responsive':
            return await this.optimizeForResponsive(args);
          case 'create_framer_cms_structure':
            return await this.createFramerCMSStructure(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async getFigmaProjects() {
    if (!this.figmaConfig.apiKey) {
      return { error: 'Figma API key not configured' };
    }

    try {
      const response = await axios.get(`${this.figmaConfig.baseUrl}/me`, {
        headers: {
          'X-Figma-Token': this.figmaConfig.apiKey
        }
      });

      const teams = await axios.get(`${this.figmaConfig.baseUrl}/teams/${response.data.id}/projects`, {
        headers: {
          'X-Figma-Token': this.figmaConfig.apiKey
        }
      });

      return {
        user: response.data,
        projects: teams.data.projects || []
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async getFramerSites() {
    // Mock implementation - Framer API details would need to be confirmed
    return {
      sites: [
        { id: 'site-1', name: 'Marketing Site', url: 'https://example.framer.website' },
        { id: 'site-2', name: 'Portfolio', url: 'https://portfolio.framer.website' }
      ]
    };
  }

  async convertFigmaToFramer(args) {
    const { figmaFileId, pageType, projectName, autoLayout = true, optimizeAssets = true } = args;

    // Step 1: Analyze Figma file
    const analysis = await this.analyzeFigmaDesign({ figmaFileId });
    
    // Step 2: Prepare conversion strategy
    const template = this.pageTemplates[pageType];
    const conversionPlan = {
      figmaFileId,
      pageType,
      template,
      projectName,
      sections: template.sections,
      autoLayout,
      optimizeAssets,
      timestamp: new Date().toISOString()
    };

    // Step 3: Generate conversion instructions
    const instructions = this.generateConversionInstructions(conversionPlan, analysis);

    // Step 4: Create Framer project structure
    const framerProject = await this.createFramerProject(projectName, pageType);

    return {
      content: [
        {
          type: 'text',
          text: `🎨 **Figma to Framer Conversion Initiated**

**Project**: ${projectName}
**Page Type**: ${pageType} (${template.description})
**Figma File**: ${figmaFileId}

## Conversion Plan
${template.sections.map(section => `✅ ${section}`).join('\n')}

## Auto-Generated Instructions

### Phase 1: Figma Preparation
${autoLayout ? '1. Convert design to Auto Layout' : '1. Use existing layout structure'}
2. Optimize layer naming and organization
3. ${optimizeAssets ? 'Compress and optimize images' : 'Use original image assets'}

### Phase 2: Framer Import
1. Install "Figma to HTML with Framer" plugin in Figma
2. Select design sections matching ${pageType} template
3. Copy layers using plugin (⌥⌘P shortcut)
4. Paste into Framer project: ${framerProject.id}

### Phase 3: Component Organization
${instructions.componentInstructions}

### Phase 4: Responsive Optimization
${instructions.responsiveInstructions}

### Phase 5: Interactive Features
${instructions.interactiveInstructions}

## Next Steps
1. Open Figma file: https://figma.com/file/${figmaFileId}
2. Open Framer project: ${framerProject.url}
3. Follow the conversion instructions above
4. Use "setup_framer_components" tool for automated organization

**Conversion ID**: ${conversionPlan.timestamp}`,
        },
      ],
    };
  }

  async batchConvertFigmaPages(args) {
    const { conversions, framerProjectId } = args;
    
    const results = [];
    
    for (const conversion of conversions) {
      try {
        const result = await this.convertFigmaToFramer({
          ...conversion,
          projectName: conversion.pageName
        });
        
        results.push({
          pageType: conversion.pageType,
          pageName: conversion.pageName,
          status: 'success',
          result
        });
      } catch (error) {
        results.push({
          pageType: conversion.pageType,
          pageName: conversion.pageName,
          status: 'error',
          error: error.message
        });
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `🔄 **Batch Conversion Results**

**Total Conversions**: ${conversions.length}
**Successful**: ${results.filter(r => r.status === 'success').length}
**Failed**: ${results.filter(r => r.status === 'error').length}

## Conversion Details
${results.map(r => 
  `${r.status === 'success' ? '✅' : '❌'} **${r.pageName}** (${r.pageType})${r.error ? ': ' + r.error : ''}`
).join('\n')}

## Framer Project
All pages have been prepared for import into Framer project: ${framerProjectId}

Use the generated instructions for each page type to complete the conversion process.`,
        },
      ],
    };
  }

  async analyzeFigmaDesign(args) {
    const { figmaFileId, frameId } = args;

    try {
      // Get file data from Figma API
      const response = await axios.get(`${this.figmaConfig.baseUrl}/files/${figmaFileId}`, {
        headers: {
          'X-Figma-Token': this.figmaConfig.apiKey
        }
      });

      const file = response.data;
      const analysis = this.performDesignAnalysis(file, frameId);

      return {
        content: [
          {
            type: 'text',
            text: `🔍 **Figma Design Analysis**

**File**: ${file.name}
**Last Modified**: ${new Date(file.lastModified).toLocaleString()}

## Design Structure Analysis
**Total Pages**: ${file.document.children.length}
**Components**: ${analysis.componentCount}
**Text Layers**: ${analysis.textLayers}
**Image Layers**: ${analysis.imageLayers}

## Recommended Page Types
${analysis.recommendedPageTypes.map(type => 
  `✅ **${type.type}** (${type.confidence}% confidence) - ${type.reason}`
).join('\n')}

## Layout Analysis
- **Auto Layout Usage**: ${analysis.autoLayoutUsage}%
- **Responsive Ready**: ${analysis.responsiveReady ? 'Yes' : 'Needs optimization'}
- **Component Structure**: ${analysis.componentStructure}

## Conversion Recommendations
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

## Optimization Suggestions
${analysis.optimizations.map(opt => `• ${opt}`).join('\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to analyze Figma design: ${error.message}`);
    }
  }

  performDesignAnalysis(file, frameId) {
    // Analyze the design structure and recommend page types
    const analysis = {
      componentCount: 0,
      textLayers: 0,
      imageLayers: 0,
      autoLayoutUsage: 0,
      responsiveReady: false,
      componentStructure: 'Basic',
      recommendedPageTypes: [],
      recommendations: [],
      optimizations: []
    };

    // Recursive function to analyze nodes
    const analyzeNode = (node) => {
      if (node.type === 'COMPONENT') analysis.componentCount++;
      if (node.type === 'TEXT') analysis.textLayers++;
      if (node.type === 'RECTANGLE' && node.fills?.some(fill => fill.type === 'IMAGE')) {
        analysis.imageLayers++;
      }

      if (node.children) {
        node.children.forEach(analyzeNode);
      }
    };

    // Analyze document structure
    file.document.children.forEach(page => {
      if (page.children) {
        page.children.forEach(analyzeNode);
      }
    });

    // Determine recommended page types based on content
    this.determinePageTypes(analysis);
    this.generateRecommendations(analysis);

    return analysis;
  }

  determinePageTypes(analysis) {
    // Logic to determine best page type based on design analysis
    const types = [];

    if (analysis.textLayers > 20 && analysis.componentCount < 5) {
      types.push({
        type: 'blog',
        confidence: 85,
        reason: 'High text content, low component complexity'
      });
    }

    if (analysis.componentCount > 10 && analysis.imageLayers > 5) {
      types.push({
        type: 'ecommerce',
        confidence: 80,
        reason: 'Multiple components and product images detected'
      });
    }

    if (analysis.componentCount <= 8 && analysis.textLayers <= 15) {
      types.push({
        type: 'landing',
        confidence: 90,
        reason: 'Optimal structure for conversion-focused landing page'
      });
    }

    analysis.recommendedPageTypes = types.length > 0 ? types : [
      { type: 'web', confidence: 70, reason: 'General website structure' }
    ];
  }

  generateRecommendations(analysis) {
    analysis.recommendations = [
      'Use Auto Layout for responsive design',
      'Organize components into reusable elements',
      'Optimize image assets for web performance',
      'Ensure consistent spacing and typography'
    ];

    analysis.optimizations = [
      'Convert text layers to styles',
      'Create component variants for different states',
      'Implement proper naming conventions',
      'Setup responsive breakpoints'
    ];
  }

  generateConversionInstructions(plan, analysis) {
    const pageType = plan.pageType;
    const template = plan.template;

    return {
      componentInstructions: `
Create components for each section:
${template.sections.map(section => `• ${section.replace('-', ' ').toUpperCase()} component`).join('\n')}

Component organization strategy:
- Group related elements into reusable components
- Create variants for different states (hover, active, etc.)
- Setup component properties for easy customization`,

      responsiveInstructions: `
Responsive design setup:
- Desktop: 1440px+ (primary breakpoint)
- Tablet: 768px - 1439px
- Mobile: 320px - 767px

Auto Layout configuration:
- Use Stacks for flexible layouts
- Set appropriate padding and gaps
- Enable auto-sizing where needed`,

      interactiveInstructions: `
Interactive features for ${pageType}:
${this.getInteractiveFeatures(pageType).map(feature => `• ${feature}`).join('\n')}

Animation recommendations:
- Smooth scroll between sections
- Hover effects on interactive elements
- Loading animations for images
- Micro-interactions for buttons and forms`
    };
  }

  getInteractiveFeatures(pageType) {
    const features = {
      landing: [
        'Scroll-triggered animations',
        'CTA button hover effects',
        'Form validation and submission',
        'Video/image galleries'
      ],
      sales: [
        'Progressive disclosure of content',
        'Pricing calculator interactions',
        'Testimonial carousel',
        'FAQ accordion sections'
      ],
      ecommerce: [
        'Product image zoom and gallery',
        'Shopping cart interactions',
        'Filter and search functionality',
        'Checkout process flow'
      ],
      portfolio: [
        'Project showcase animations',
        'Image lightbox interactions',
        'Contact form with validation',
        'Smooth page transitions'
      ],
      blog: [
        'Article search and filtering',
        'Category navigation',
        'Reading progress indicator',
        'Related posts suggestions'
      ],
      web: [
        'Navigation menu interactions',
        'Page transitions',
        'Contact forms',
        'Social media integrations'
      ]
    };

    return features[pageType] || features.web;
  }

  async createFramerProject(projectName, pageType) {
    // Mock implementation - would integrate with actual Framer API
    const projectId = `framer_${Date.now()}`;
    
    return {
      id: projectId,
      name: projectName,
      type: pageType,
      url: `https://framer.com/projects/${projectId}`,
      created: new Date().toISOString()
    };
  }

  async setupFramerComponents(args) {
    const { framerProjectId, componentMapping = {} } = args;

    const componentSetup = {
      project: framerProjectId,
      components: this.generateComponentLibrary(),
      setup: this.generateSetupInstructions()
    };

    return {
      content: [
        {
          type: 'text',
          text: `🔧 **Framer Component Setup**

**Project**: ${framerProjectId}

## Component Library Structure
${componentSetup.components.map(comp => 
  `### ${comp.name}
- **Purpose**: ${comp.purpose}
- **Properties**: ${comp.properties.join(', ')}
- **Variants**: ${comp.variants.join(', ')}`
).join('\n\n')}

## Setup Instructions
${componentSetup.setup.map(step => `${step.order}. ${step.instruction}`).join('\n')}

## Best Practices
- Use meaningful component names
- Create variants for different states
- Set up proper property controls
- Organize components in logical groups
- Document component usage and properties`,
        },
      ],
    };
  }

  generateComponentLibrary() {
    return [
      {
        name: 'Button Component',
        purpose: 'Reusable button with multiple variants',
        properties: ['text', 'variant', 'size', 'disabled'],
        variants: ['primary', 'secondary', 'ghost', 'danger']
      },
      {
        name: 'Card Component',
        purpose: 'Content card with image and text',
        properties: ['title', 'description', 'image', 'link'],
        variants: ['horizontal', 'vertical', 'minimal']
      },
      {
        name: 'Navigation Component',
        purpose: 'Site navigation with responsive behavior',
        properties: ['items', 'logo', 'style'],
        variants: ['horizontal', 'vertical', 'mobile']
      },
      {
        name: 'Hero Section',
        purpose: 'Landing page hero with customizable content',
        properties: ['headline', 'subtitle', 'cta', 'background'],
        variants: ['centered', 'left-aligned', 'with-image']
      }
    ];
  }

  generateSetupInstructions() {
    return [
      { order: 1, instruction: 'Import converted designs from Figma' },
      { order: 2, instruction: 'Identify repeating elements for componentization' },
      { order: 3, instruction: 'Create master components for each element type' },
      { order: 4, instruction: 'Set up component properties and variants' },
      { order: 5, instruction: 'Replace instances with component references' },
      { order: 6, instruction: 'Test responsive behavior across breakpoints' },
      { order: 7, instruction: 'Add interactive states and animations' },
      { order: 8, instruction: 'Organize components in library structure' }
    ];
  }

  async optimizeForResponsive(args) {
    const { framerProjectId, breakpoints = ['mobile', 'tablet', 'desktop'] } = args;

    return {
      content: [
        {
          type: 'text',
          text: `📱 **Responsive Optimization for Framer**

**Project**: ${framerProjectId}
**Target Breakpoints**: ${breakpoints.join(', ')}

## Responsive Strategy

### Desktop (1440px+)
- Primary design layout
- Full navigation and sidebar content
- Optimal spacing and typography
- Advanced interactive elements

### Tablet (768px - 1439px)
- Simplified navigation (burger menu)
- Adjusted grid layouts (2-3 columns to 2 columns)
- Touch-friendly button sizes (min 44px)
- Optimized image sizes

### Mobile (320px - 767px)
- Single column layouts
- Stacked navigation
- Larger touch targets
- Simplified interactions
- Optimized font sizes (16px+ for body text)

## Implementation Checklist
✅ Convert layouts to Framer Stacks
✅ Set up auto-sizing for flexible components
✅ Configure responsive images with proper aspect ratios
✅ Test navigation and interactions on all breakpoints
✅ Optimize form layouts for mobile input
✅ Ensure readable typography across devices
✅ Test loading performance on mobile networks

## Framer-Specific Optimizations
- Use Framer's built-in responsive preview
- Leverage Smart Components for dynamic content
- Implement smooth transitions between breakpoints
- Utilize Framer's gesture recognition for mobile
- Set up proper focus states for accessibility`,
        },
      ],
    };
  }

  async createFramerCMSStructure(args) {
    const { framerProjectId, contentTypes } = args;

    const cmsStructure = contentTypes.map(type => ({
      name: type,
      fields: this.generateCMSFields(type),
      collections: this.generateCollections(type)
    }));

    return {
      content: [
        {
          type: 'text',
          text: `📚 **Framer CMS Structure Setup**

**Project**: ${framerProjectId}

## Content Types Configuration
${cmsStructure.map(type => `
### ${type.name.toUpperCase()}
**Fields**:
${type.fields.map(field => `- ${field.name} (${field.type}): ${field.description}`).join('\n')}

**Collections**:
${type.collections.map(col => `- ${col.name}: ${col.purpose}`).join('\n')}
`).join('\n')}

## Implementation Steps
1. Go to Framer CMS panel in your project
2. Create each content type with specified fields
3. Set up collections for dynamic content
4. Connect CMS fields to design components
5. Create sample content for testing
6. Configure content relationships if needed

## CMS Best Practices
- Use descriptive field names
- Set appropriate field validation
- Create reusable content components
- Plan for scalable content structure
- Set up proper SEO fields for each content type`,
        },
      ],
    };
  }

  generateCMSFields(contentType) {
    const fieldMap = {
      blog: [
        { name: 'title', type: 'text', description: 'Article title' },
        { name: 'slug', type: 'text', description: 'URL slug' },
        { name: 'content', type: 'rich-text', description: 'Article content' },
        { name: 'excerpt', type: 'text', description: 'Short description' },
        { name: 'featured_image', type: 'image', description: 'Main article image' },
        { name: 'author', type: 'text', description: 'Author name' },
        { name: 'publish_date', type: 'date', description: 'Publication date' },
        { name: 'categories', type: 'text', description: 'Article categories' }
      ],
      portfolio: [
        { name: 'project_title', type: 'text', description: 'Project name' },
        { name: 'description', type: 'rich-text', description: 'Project description' },
        { name: 'images', type: 'image', description: 'Project images' },
        { name: 'tech_stack', type: 'text', description: 'Technologies used' },
        { name: 'live_url', type: 'url', description: 'Live project URL' },
        { name: 'github_url', type: 'url', description: 'GitHub repository' },
        { name: 'completion_date', type: 'date', description: 'Project completion' }
      ],
      products: [
        { name: 'name', type: 'text', description: 'Product name' },
        { name: 'price', type: 'number', description: 'Product price' },
        { name: 'description', type: 'rich-text', description: 'Product description' },
        { name: 'images', type: 'image', description: 'Product images' },
        { name: 'category', type: 'text', description: 'Product category' },
        { name: 'stock', type: 'number', description: 'Stock quantity' },
        { name: 'sku', type: 'text', description: 'Product SKU' }
      ]
    };

    return fieldMap[contentType] || [
      { name: 'title', type: 'text', description: 'Content title' },
      { name: 'content', type: 'rich-text', description: 'Main content' }
    ];
  }

  generateCollections(contentType) {
    const collectionMap = {
      blog: [
        { name: 'Featured Posts', purpose: 'Highlight important articles' },
        { name: 'Recent Posts', purpose: 'Show latest content' },
        { name: 'Category Archives', purpose: 'Organize by topic' }
      ],
      portfolio: [
        { name: 'Featured Projects', purpose: 'Showcase best work' },
        { name: 'All Projects', purpose: 'Complete portfolio' },
        { name: 'Client Work', purpose: 'Professional projects' }
      ],
      products: [
        { name: 'Featured Products', purpose: 'Highlight top items' },
        { name: 'New Arrivals', purpose: 'Show latest products' },
        { name: 'Best Sellers', purpose: 'Popular items' }
      ]
    };

    return collectionMap[contentType] || [
      { name: 'All Items', purpose: 'Complete content collection' }
    ];
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Figma to Framer Converter MCP server running on stdio');
  }
}

const server = new FigmaFramerConverter();
server.run().catch(console.error);