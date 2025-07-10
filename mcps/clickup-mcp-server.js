#!/usr/bin/env node

/**
 * ClickUp MCP Server
 * Comprehensive integration for task management, document sync, and project organization
 * Supports bidirectional data flow between ClickUp and Cursor
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ClickUpMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'clickup-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.CLICKUP_API_KEY;
    this.teamId = process.env.CLICKUP_TEAM_ID;
    this.workspaceId = process.env.CLICKUP_WORKSPACE_ID;
    this.baseURL = 'https://api.clickup.com/api/v2';
    this.projectDocsPath = process.env.CLICKUP_DOCS_PATH || './project-docs';
    
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[ClickUp MCP Server Error]:', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Task Management Tools
          {
            name: 'create_task',
            description: 'Create a new task in ClickUp with AI-enhanced details',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Task name' },
                description: { type: 'string', description: 'Task description' },
                list_id: { type: 'string', description: 'ClickUp list ID' },
                priority: { type: 'number', description: 'Priority (1-4, 1=urgent)' },
                due_date: { type: 'string', description: 'Due date (timestamp)' },
                assignees: { type: 'array', items: { type: 'string' }, description: 'User IDs to assign' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Task tags' },
                custom_fields: { type: 'object', description: 'Custom field values' },
                ai_context: { type: 'object', description: 'AI-generated context and suggestions' }
              },
              required: ['name', 'list_id']
            }
          },
          {
            name: 'auto_manage_tasks',
            description: 'Automatically manage and update tasks based on AI analysis',
            inputSchema: {
              type: 'object',
              properties: {
                list_id: { type: 'string', description: 'ClickUp list ID to manage' },
                management_type: { 
                  type: 'string', 
                  enum: ['priority_optimization', 'deadline_management', 'dependency_analysis', 'progress_tracking'],
                  description: 'Type of auto-management to perform'
                },
                ai_criteria: { type: 'object', description: 'AI criteria for task management' }
              },
              required: ['list_id', 'management_type']
            }
          },
          {
            name: 'sync_cursor_project',
            description: 'Sync entire Cursor project with ClickUp docs and sub-pages',
            inputSchema: {
              type: 'object',
              properties: {
                project_name: { type: 'string', description: 'Name of the project' },
                cursor_project_path: { type: 'string', description: 'Path to Cursor project' },
                clickup_space_id: { type: 'string', description: 'ClickUp space ID' },
                sync_type: { 
                  type: 'string', 
                  enum: ['full_sync', 'incremental', 'docs_only', 'code_only'],
                  description: 'Type of synchronization'
                },
                create_structure: { type: 'boolean', description: 'Create ClickUp folder structure' }
              },
              required: ['project_name', 'cursor_project_path', 'clickup_space_id']
            }
          },

          // Document Management Tools
          {
            name: 'create_project_docs',
            description: 'Create comprehensive project documentation in ClickUp',
            inputSchema: {
              type: 'object',
              properties: {
                project_name: { type: 'string', description: 'Project name' },
                space_id: { type: 'string', description: 'ClickUp space ID' },
                doc_structure: { type: 'object', description: 'Document structure and content' },
                include_sops: { type: 'boolean', description: 'Include SOPs and workflows' },
                ai_generated_content: { type: 'boolean', description: 'Use AI to enhance content' }
              },
              required: ['project_name', 'space_id']
            }
          },
          {
            name: 'sync_docs_to_cursor',
            description: 'Send ClickUp docs and SOPs to Cursor for AI processing',
            inputSchema: {
              type: 'object',
              properties: {
                doc_ids: { type: 'array', items: { type: 'string' }, description: 'ClickUp document IDs' },
                cursor_destination: { type: 'string', description: 'Cursor project destination path' },
                format_type: { 
                  type: 'string', 
                  enum: ['markdown', 'json', 'structured_data'],
                  description: 'Format for Cursor consumption'
                },
                include_metadata: { type: 'boolean', description: 'Include ClickUp metadata' }
              },
              required: ['doc_ids', 'cursor_destination']
            }
          },
          {
            name: 'send_files_to_clickup',
            description: 'Send all Cursor project files to unique ClickUp docs and sub-pages',
            inputSchema: {
              type: 'object',
              properties: {
                source_path: { type: 'string', description: 'Source path in Cursor project' },
                clickup_space_id: { type: 'string', description: 'Target ClickUp space' },
                organization_strategy: { 
                  type: 'string', 
                  enum: ['by_file_type', 'by_directory', 'by_feature', 'flat_structure'],
                  description: 'How to organize files in ClickUp'
                },
                create_index: { type: 'boolean', description: 'Create master index document' },
                preserve_structure: { type: 'boolean', description: 'Preserve directory structure' }
              },
              required: ['source_path', 'clickup_space_id']
            }
          },

          // Integration & Automation Tools
          {
            name: 'setup_automation_rules',
            description: 'Set up intelligent automation rules between ClickUp and Cursor',
            inputSchema: {
              type: 'object',
              properties: {
                rule_type: { 
                  type: 'string', 
                  enum: ['task_code_sync', 'doc_update_trigger', 'progress_automation', 'ai_enhancement'],
                  description: 'Type of automation rule'
                },
                trigger_conditions: { type: 'object', description: 'Conditions that trigger the automation' },
                actions: { type: 'array', items: { type: 'object' }, description: 'Actions to perform' },
                ai_processing: { type: 'boolean', description: 'Enable AI processing in automation' }
              },
              required: ['rule_type', 'trigger_conditions', 'actions']
            }
          },
          {
            name: 'generate_project_insights',
            description: 'Generate AI-powered insights from ClickUp data for Cursor optimization',
            inputSchema: {
              type: 'object',
              properties: {
                space_id: { type: 'string', description: 'ClickUp space to analyze' },
                insight_type: { 
                  type: 'string', 
                  enum: ['productivity_analysis', 'bottleneck_detection', 'resource_optimization', 'timeline_prediction'],
                  description: 'Type of insights to generate'
                },
                time_range: { type: 'string', description: 'Time range for analysis (e.g., "30d", "3m")' },
                output_format: { type: 'string', enum: ['dashboard', 'report', 'cursor_integration'] }
              },
              required: ['space_id', 'insight_type']
            }
          },

          // Search & Query Tools
          {
            name: 'search_clickup_data',
            description: 'Search across ClickUp tasks, docs, and comments with AI enhancement',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                search_scope: { 
                  type: 'array', 
                  items: { type: 'string', enum: ['tasks', 'docs', 'comments', 'attachments'] },
                  description: 'Scope of search'
                },
                space_ids: { type: 'array', items: { type: 'string' }, description: 'Spaces to search in' },
                ai_semantic_search: { type: 'boolean', description: 'Use AI semantic search' },
                result_limit: { type: 'number', description: 'Maximum number of results' }
              },
              required: ['query']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_task':
            return await this.createTask(args);
          case 'auto_manage_tasks':
            return await this.autoManageTasks(args);
          case 'sync_cursor_project':
            return await this.syncCursorProject(args);
          case 'create_project_docs':
            return await this.createProjectDocs(args);
          case 'sync_docs_to_cursor':
            return await this.syncDocsToCursor(args);
          case 'send_files_to_clickup':
            return await this.sendFilesToClickUp(args);
          case 'setup_automation_rules':
            return await this.setupAutomationRules(args);
          case 'generate_project_insights':
            return await this.generateProjectInsights(args);
          case 'search_clickup_data':
            return await this.searchClickUpData(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error in ${name}:`, error);
        throw new McpError(ErrorCode.InternalError, `Failed to execute ${name}: ${error.message}`);
      }
    });
  }

  async createTask(args) {
    const { 
      name, 
      description, 
      list_id, 
      priority, 
      due_date, 
      assignees, 
      tags, 
      custom_fields,
      ai_context 
    } = args;

    // Enhance task with AI context
    const enhancedDescription = await this.enhanceTaskDescription(description, ai_context);
    
    const taskData = {
      name,
      description: enhancedDescription,
      priority: priority || 3,
      due_date: due_date ? parseInt(due_date) : null,
      assignees: assignees || [],
      tags: tags || [],
      custom_fields: custom_fields || {}
    };

    const response = await this.makeClickUpRequest('POST', `/list/${list_id}/task`, taskData);
    
    // Auto-create related documentation
    if (ai_context?.create_docs) {
      await this.createTaskDocumentation(response.id, ai_context);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            task: response,
            ai_enhancements: {
              description_enhanced: description !== enhancedDescription,
              documentation_created: ai_context?.create_docs || false
            }
          }, null, 2)
        }
      ]
    };
  }

  async autoManageTasks(args) {
    const { list_id, management_type, ai_criteria } = args;

    // Get all tasks in the list
    const tasks = await this.makeClickUpRequest('GET', `/list/${list_id}/task`);
    
    const managementResults = {
      processed_tasks: 0,
      actions_taken: [],
      recommendations: []
    };

    for (const task of tasks.tasks) {
      const analysis = await this.analyzeTask(task, management_type, ai_criteria);
      
      if (analysis.actions.length > 0) {
        for (const action of analysis.actions) {
          await this.executeTaskAction(task.id, action);
          managementResults.actions_taken.push({
            task_id: task.id,
            task_name: task.name,
            action: action
          });
        }
      }

      if (analysis.recommendations.length > 0) {
        managementResults.recommendations.push({
          task_id: task.id,
          recommendations: analysis.recommendations
        });
      }

      managementResults.processed_tasks++;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(managementResults, null, 2)
        }
      ]
    };
  }

  async syncCursorProject(args) {
    const { 
      project_name, 
      cursor_project_path, 
      clickup_space_id, 
      sync_type = 'full_sync',
      create_structure = true 
    } = args;

    const syncResults = {
      project_name,
      sync_type,
      created_structure: {},
      synced_files: [],
      created_docs: [],
      errors: []
    };

    try {
      // Create project structure in ClickUp if requested
      if (create_structure) {
        syncResults.created_structure = await this.createProjectStructure(
          project_name, 
          clickup_space_id, 
          cursor_project_path
        );
      }

      // Analyze project files
      const projectFiles = await this.analyzeProjectFiles(cursor_project_path, sync_type);
      
      // Create organized documentation
      for (const fileGroup of projectFiles.groups) {
        const docResult = await this.createFileGroupDoc(
          fileGroup, 
          syncResults.created_structure.folders[fileGroup.type],
          project_name
        );
        syncResults.created_docs.push(docResult);
      }

      // Create master index
      const indexDoc = await this.createProjectIndex(
        project_name,
        syncResults,
        clickup_space_id
      );
      syncResults.master_index = indexDoc;

    } catch (error) {
      syncResults.errors.push(error.message);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(syncResults, null, 2)
        }
      ]
    };
  }

  async createProjectDocs(args) {
    const { 
      project_name, 
      space_id, 
      doc_structure, 
      include_sops = true, 
      ai_generated_content = true 
    } = args;

    const docResults = {
      project_name,
      created_docs: [],
      folder_structure: {},
      sop_docs: [],
      ai_enhanced: ai_generated_content
    };

    // Create main project folder
    const projectFolder = await this.createClickUpFolder(space_id, project_name);
    docResults.folder_structure.main = projectFolder;

    // Create standard project documentation structure
    const standardDocs = [
      { name: 'Project Overview', type: 'overview', template: 'project_overview' },
      { name: 'Technical Specifications', type: 'technical', template: 'tech_specs' },
      { name: 'Development Workflow', type: 'workflow', template: 'dev_workflow' },
      { name: 'API Documentation', type: 'api', template: 'api_docs' },
      { name: 'Deployment Guide', type: 'deployment', template: 'deployment' },
      { name: 'Testing Strategy', type: 'testing', template: 'testing' }
    ];

    for (const docConfig of standardDocs) {
      const docContent = ai_generated_content ? 
        await this.generateAIDocContent(docConfig, project_name, doc_structure) :
        await this.getDocTemplate(docConfig.template);

      const doc = await this.createClickUpDoc(
        space_id,
        docConfig.name,
        docContent,
        projectFolder.id
      );

      docResults.created_docs.push({
        name: docConfig.name,
        type: docConfig.type,
        id: doc.id,
        ai_generated: ai_generated_content
      });
    }

    // Create SOPs if requested
    if (include_sops) {
      const sopFolder = await this.createClickUpFolder(space_id, `${project_name} - SOPs`, projectFolder.id);
      docResults.folder_structure.sops = sopFolder;

      const sops = [
        'Code Review Process',
        'Deployment Checklist',
        'Bug Triage Workflow',
        'Feature Development Process',
        'Emergency Response Protocol'
      ];

      for (const sopName of sops) {
        const sopContent = await this.generateSOPContent(sopName, project_name);
        const sopDoc = await this.createClickUpDoc(
          space_id,
          sopName,
          sopContent,
          sopFolder.id
        );

        docResults.sop_docs.push({
          name: sopName,
          id: sopDoc.id
        });
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(docResults, null, 2)
        }
      ]
    };
  }

  async syncDocsToCursor(args) {
    const { 
      doc_ids, 
      cursor_destination, 
      format_type = 'markdown', 
      include_metadata = true 
    } = args;

    const syncResults = {
      processed_docs: 0,
      created_files: [],
      errors: []
    };

    // Ensure destination directory exists
    await fs.mkdir(cursor_destination, { recursive: true });

    for (const docId of doc_ids) {
      try {
        // Get document content from ClickUp
        const doc = await this.makeClickUpRequest('GET', `/doc/${docId}`);
        
        // Format content for Cursor
        const formattedContent = await this.formatDocForCursor(doc, format_type, include_metadata);
        
        // Generate filename
        const filename = this.generateCursorFilename(doc, format_type);
        const filepath = path.join(cursor_destination, filename);
        
        // Write file
        await fs.writeFile(filepath, formattedContent, 'utf8');
        
        syncResults.created_files.push({
          doc_id: docId,
          doc_name: doc.name,
          filepath: filepath,
          format: format_type
        });
        
        syncResults.processed_docs++;
        
      } catch (error) {
        syncResults.errors.push({
          doc_id: docId,
          error: error.message
        });
      }
    }

    // Create index file for Cursor
    if (syncResults.created_files.length > 0) {
      const indexContent = this.generateCursorIndex(syncResults.created_files);
      const indexPath = path.join(cursor_destination, 'clickup-docs-index.md');
      await fs.writeFile(indexPath, indexContent, 'utf8');
      syncResults.index_file = indexPath;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(syncResults, null, 2)
        }
      ]
    };
  }

  async sendFilesToClickUp(args) {
    const { 
      source_path, 
      clickup_space_id, 
      organization_strategy = 'by_directory',
      create_index = true,
      preserve_structure = true 
    } = args;

    const uploadResults = {
      processed_files: 0,
      created_docs: [],
      folder_structure: {},
      errors: [],
      master_index: null
    };

    try {
      // Analyze source files
      const fileAnalysis = await this.analyzeSourceFiles(source_path, organization_strategy);
      
      // Create folder structure in ClickUp
      if (preserve_structure) {
        uploadResults.folder_structure = await this.createFolderStructure(
          clickup_space_id, 
          fileAnalysis.structure
        );
      }

      // Process files by organization strategy
      for (const group of fileAnalysis.groups) {
        const targetFolderId = preserve_structure ? 
          uploadResults.folder_structure[group.path]?.id : 
          null;

        for (const file of group.files) {
          try {
            const fileContent = await fs.readFile(file.fullPath, 'utf8');
            const docContent = await this.formatFileForClickUp(file, fileContent);
            
            const doc = await this.createClickUpDoc(
              clickup_space_id,
              file.name,
              docContent,
              targetFolderId
            );

            uploadResults.created_docs.push({
              source_file: file.relativePath,
              doc_id: doc.id,
              doc_name: doc.name,
              folder_id: targetFolderId
            });

            uploadResults.processed_files++;

          } catch (fileError) {
            uploadResults.errors.push({
              file: file.relativePath,
              error: fileError.message
            });
          }
        }
      }

      // Create master index if requested
      if (create_index) {
        uploadResults.master_index = await this.createMasterIndex(
          clickup_space_id,
          uploadResults,
          path.basename(source_path)
        );
      }

    } catch (error) {
      uploadResults.errors.push({
        general_error: error.message
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(uploadResults, null, 2)
        }
      ]
    };
  }

  async setupAutomationRules(args) {
    const { rule_type, trigger_conditions, actions, ai_processing = false } = args;

    const automationConfig = {
      rule_type,
      trigger_conditions,
      actions,
      ai_processing,
      created_at: new Date().toISOString(),
      status: 'active'
    };

    // Store automation rule configuration
    const rulesPath = path.join(this.projectDocsPath, 'automation-rules.json');
    let existingRules = [];
    
    try {
      const rulesContent = await fs.readFile(rulesPath, 'utf8');
      existingRules = JSON.parse(rulesContent);
    } catch (error) {
      // File doesn't exist, start with empty array
    }

    const ruleId = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    automationConfig.id = ruleId;
    
    existingRules.push(automationConfig);
    
    await fs.mkdir(path.dirname(rulesPath), { recursive: true });
    await fs.writeFile(rulesPath, JSON.stringify(existingRules, null, 2), 'utf8');

    // Set up webhook listeners based on rule type
    const webhookConfig = await this.setupWebhookForRule(automationConfig);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            rule_id: ruleId,
            configuration: automationConfig,
            webhook_config: webhookConfig,
            message: `Automation rule '${rule_type}' has been created and activated`
          }, null, 2)
        }
      ]
    };
  }

  async generateProjectInsights(args) {
    const { 
      space_id, 
      insight_type, 
      time_range = '30d', 
      output_format = 'report' 
    } = args;

    const insights = {
      space_id,
      insight_type,
      time_range,
      generated_at: new Date().toISOString(),
      data: {},
      recommendations: [],
      visualizations: []
    };

    try {
      // Gather data based on insight type
      switch (insight_type) {
        case 'productivity_analysis':
          insights.data = await this.analyzeProductivity(space_id, time_range);
          break;
        case 'bottleneck_detection':
          insights.data = await this.detectBottlenecks(space_id, time_range);
          break;
        case 'resource_optimization':
          insights.data = await this.analyzeResourceOptimization(space_id, time_range);
          break;
        case 'timeline_prediction':
          insights.data = await this.predictTimelines(space_id, time_range);
          break;
      }

      // Generate AI-powered recommendations
      insights.recommendations = await this.generateAIRecommendations(insights.data, insight_type);

      // Format output based on requested format
      if (output_format === 'cursor_integration') {
        insights.cursor_integration = await this.formatForCursorIntegration(insights);
      }

    } catch (error) {
      insights.error = error.message;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(insights, null, 2)
        }
      ]
    };
  }

  async searchClickUpData(args) {
    const { 
      query, 
      search_scope = ['tasks', 'docs'], 
      space_ids, 
      ai_semantic_search = false, 
      result_limit = 50 
    } = args;

    const searchResults = {
      query,
      search_scope,
      ai_semantic_search,
      total_results: 0,
      results_by_type: {},
      semantic_analysis: null
    };

    try {
      // Search across different content types
      for (const scope of search_scope) {
        switch (scope) {
          case 'tasks':
            searchResults.results_by_type.tasks = await this.searchTasks(query, space_ids, result_limit);
            break;
          case 'docs':
            searchResults.results_by_type.docs = await this.searchDocs(query, space_ids, result_limit);
            break;
          case 'comments':
            searchResults.results_by_type.comments = await this.searchComments(query, space_ids, result_limit);
            break;
          case 'attachments':
            searchResults.results_by_type.attachments = await this.searchAttachments(query, space_ids, result_limit);
            break;
        }
      }

      // Calculate total results
      searchResults.total_results = Object.values(searchResults.results_by_type)
        .reduce((sum, results) => sum + (results?.length || 0), 0);

      // Perform AI semantic analysis if requested
      if (ai_semantic_search && searchResults.total_results > 0) {
        searchResults.semantic_analysis = await this.performSemanticAnalysis(
          query, 
          searchResults.results_by_type
        );
      }

    } catch (error) {
      searchResults.error = error.message;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(searchResults, null, 2)
        }
      ]
    };
  }

  // Helper Methods

  async makeClickUpRequest(method, endpoint, data = null) {
    if (!this.apiKey) {
      throw new Error('ClickUp API key not configured');
    }

    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  }

  async enhanceTaskDescription(description, aiContext) {
    if (!aiContext || !description) return description;

    // AI enhancement logic would go here
    // For now, return enhanced description with context
    let enhanced = description;
    
    if (aiContext.technical_context) {
      enhanced += `\n\n**Technical Context:**\n${aiContext.technical_context}`;
    }
    
    if (aiContext.acceptance_criteria) {
      enhanced += `\n\n**Acceptance Criteria:**\n${aiContext.acceptance_criteria.map(c => `- ${c}`).join('\n')}`;
    }
    
    if (aiContext.estimated_effort) {
      enhanced += `\n\n**Estimated Effort:** ${aiContext.estimated_effort}`;
    }

    return enhanced;
  }

  async analyzeTask(task, managementType, aiCriteria) {
    const analysis = {
      actions: [],
      recommendations: []
    };

    switch (managementType) {
      case 'priority_optimization':
        if (task.priority > 3 && task.due_date && new Date(task.due_date) < new Date(Date.now() + 86400000)) {
          analysis.actions.push({ type: 'update_priority', value: 1 });
        }
        break;
      
      case 'deadline_management':
        if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'complete') {
          analysis.actions.push({ type: 'extend_deadline', days: 3 });
          analysis.recommendations.push('Task is overdue - consider reassigning or breaking down');
        }
        break;
      
      case 'dependency_analysis':
        // Analyze task dependencies and suggest optimizations
        analysis.recommendations.push('Review task dependencies for optimization opportunities');
        break;
      
      case 'progress_tracking':
        if (task.time_tracked && task.time_estimate) {
          const progress = task.time_tracked / task.time_estimate;
          if (progress > 0.8 && task.status !== 'in progress') {
            analysis.actions.push({ type: 'update_status', value: 'in progress' });
          }
        }
        break;
    }

    return analysis;
  }

  async executeTaskAction(taskId, action) {
    const updateData = {};
    
    switch (action.type) {
      case 'update_priority':
        updateData.priority = action.value;
        break;
      case 'update_status':
        updateData.status = action.value;
        break;
      case 'extend_deadline':
        const newDate = new Date(Date.now() + (action.days * 86400000));
        updateData.due_date = newDate.getTime();
        break;
    }

    if (Object.keys(updateData).length > 0) {
      await this.makeClickUpRequest('PUT', `/task/${taskId}`, updateData);
    }
  }

  async createProjectStructure(projectName, spaceId, projectPath) {
    const structure = {
      main_folder: null,
      folders: {}
    };

    // Create main project folder
    structure.main_folder = await this.createClickUpFolder(spaceId, projectName);

    // Create standard subfolders
    const subfolders = [
      'Documentation',
      'Code Files',
      'Assets',
      'Configuration',
      'Tests',
      'Deployment'
    ];

    for (const folderName of subfolders) {
      structure.folders[folderName.toLowerCase().replace(' ', '_')] = 
        await this.createClickUpFolder(spaceId, folderName, structure.main_folder.id);
    }

    return structure;
  }

  async analyzeProjectFiles(projectPath, syncType) {
    const files = await this.getFilesRecursively(projectPath);
    
    const analysis = {
      total_files: files.length,
      groups: [],
      file_types: {}
    };

    // Group files by type
    const typeGroups = {};
    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      const type = this.getFileTypeCategory(ext);
      
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      typeGroups[type].push(file);
      
      analysis.file_types[ext] = (analysis.file_types[ext] || 0) + 1;
    });

    // Create groups based on sync type
    Object.entries(typeGroups).forEach(([type, files]) => {
      analysis.groups.push({
        type,
        files: files.map(f => ({
          name: path.basename(f),
          fullPath: f,
          relativePath: path.relative(projectPath, f)
        })),
        count: files.length
      });
    });

    return analysis;
  }

  async getFilesRecursively(dir) {
    const files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory() && !this.shouldIgnoreDirectory(item.name)) {
        files.push(...await this.getFilesRecursively(fullPath));
      } else if (item.isFile() && !this.shouldIgnoreFile(item.name)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  shouldIgnoreDirectory(name) {
    const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
    return ignoreDirs.includes(name) || name.startsWith('.');
  }

  shouldIgnoreFile(name) {
    const ignoreFiles = ['.DS_Store', 'Thumbs.db'];
    const ignoreExts = ['.log', '.tmp', '.cache'];
    
    return ignoreFiles.includes(name) || 
           ignoreExts.some(ext => name.endsWith(ext)) ||
           name.startsWith('.');
  }

  getFileTypeCategory(extension) {
    const categories = {
      code: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs'],
      styles: ['.css', '.scss', '.sass', '.less', '.stylus'],
      markup: ['.html', '.xml', '.jsx', '.tsx', '.vue', '.svelte'],
      config: ['.json', '.yaml', '.yml', '.toml', '.ini', '.env', '.config'],
      docs: ['.md', '.txt', '.rst', '.adoc'],
      images: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
      data: ['.csv', '.xlsx', '.sql', '.db']
    };

    for (const [category, extensions] of Object.entries(categories)) {
      if (extensions.includes(extension)) {
        return category;
      }
    }

    return 'other';
  }

  async createClickUpFolder(spaceId, name, parentId = null) {
    const folderData = { name };
    
    const endpoint = parentId ? 
      `/folder/${parentId}/folder` : 
      `/space/${spaceId}/folder`;
    
    return await this.makeClickUpRequest('POST', endpoint, folderData);
  }

  async createClickUpDoc(spaceId, name, content, folderId = null) {
    const docData = {
      name,
      content,
      parent: folderId || spaceId
    };

    return await this.makeClickUpRequest('POST', `/doc`, docData);
  }

  async generateAIDocContent(docConfig, projectName, docStructure) {
    // AI content generation logic would go here
    // For now, return template-based content
    
    const templates = {
      project_overview: `# ${projectName} - Project Overview\n\n## Description\n\n${docStructure?.description || 'Project description here'}\n\n## Goals\n\n## Stakeholders\n\n## Timeline`,
      tech_specs: `# ${projectName} - Technical Specifications\n\n## Architecture\n\n## Technologies\n\n## Requirements\n\n## Dependencies`,
      dev_workflow: `# ${projectName} - Development Workflow\n\n## Setup\n\n## Development Process\n\n## Code Review\n\n## Deployment`,
      api_docs: `# ${projectName} - API Documentation\n\n## Endpoints\n\n## Authentication\n\n## Examples`,
      deployment: `# ${projectName} - Deployment Guide\n\n## Prerequisites\n\n## Steps\n\n## Monitoring`,
      testing: `# ${projectName} - Testing Strategy\n\n## Unit Tests\n\n## Integration Tests\n\n## E2E Tests`
    };

    return templates[docConfig.template] || `# ${docConfig.name}\n\nContent for ${docConfig.name}`;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ClickUp MCP Server running on stdio');
  }
}

const server = new ClickUpMCPServer();
server.start().catch(console.error);