#!/usr/bin/env node

/**
 * ClickUp Automation Daemon
 * Handles continuous synchronization, webhook processing, and automated management
 * between ClickUp and Cursor development environment
 */

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ClickUpAutomationDaemon {
  constructor() {
    this.apiKey = process.env.CLICKUP_API_KEY;
    this.baseURL = 'https://api.clickup.com/api/v2';
    this.projectDocsPath = process.env.CLICKUP_DOCS_PATH || './project-docs';
    this.webhookPort = process.env.CLICKUP_WEBHOOK_PORT || 3001;
    this.syncInterval = parseInt(process.env.CLICKUP_SYNC_INTERVAL) || 300000; // 5 minutes
    
    this.automationRules = [];
    this.activeProjects = new Map();
    this.syncQueue = new Set();
    this.isRunning = false;
    
    this.app = express();
    this.setupWebhookServer();
    this.setupErrorHandling();
  }

  async initialize() {
    console.log('🚀 Initializing ClickUp Automation Daemon...');
    
    try {
      // Load existing automation rules
      await this.loadAutomationRules();
      
      // Load active projects
      await this.loadActiveProjects();
      
      // Verify ClickUp connection
      await this.verifyClickUpConnection();
      
      // Start webhook server
      await this.startWebhookServer();
      
      // Start sync daemon
      this.startSyncDaemon();
      
      console.log('✅ ClickUp Automation Daemon initialized successfully');
      this.isRunning = true;
      
    } catch (error) {
      console.error('❌ Failed to initialize ClickUp Automation Daemon:', error);
      throw error;
    }
  }

  setupWebhookServer() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Webhook endpoint for ClickUp events
    this.app.post('/clickup/webhook', async (req, res) => {
      try {
        await this.processWebhookEvent(req.body, req.headers);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'running',
        uptime: process.uptime(),
        active_projects: this.activeProjects.size,
        automation_rules: this.automationRules.length,
        sync_queue_size: this.syncQueue.size
      });
    });

    // Manual sync trigger endpoint
    this.app.post('/sync/trigger', async (req, res) => {
      try {
        const { project_id, sync_type } = req.body;
        await this.triggerManualSync(project_id, sync_type);
        res.json({ success: true, message: 'Sync triggered' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  async startWebhookServer() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.webhookPort, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`🌐 ClickUp webhook server running on port ${this.webhookPort}`);
          resolve();
        }
      });
    });
  }

  async verifyClickUpConnection() {
    try {
      const response = await this.makeClickUpRequest('GET', '/user');
      console.log(`✅ Connected to ClickUp as: ${response.user.username}`);
      return true;
    } catch (error) {
      console.error('❌ ClickUp connection failed:', error.message);
      throw new Error('Unable to connect to ClickUp API');
    }
  }

  async loadAutomationRules() {
    try {
      const rulesPath = path.join(this.projectDocsPath, 'automation-rules.json');
      const rulesContent = await fs.readFile(rulesPath, 'utf8');
      this.automationRules = JSON.parse(rulesContent);
      console.log(`📋 Loaded ${this.automationRules.length} automation rules`);
    } catch (error) {
      console.log('📋 No existing automation rules found, starting fresh');
      this.automationRules = [];
    }
  }

  async loadActiveProjects() {
    try {
      const projectsPath = path.join(this.projectDocsPath, 'active-projects.json');
      const projectsContent = await fs.readFile(projectsPath, 'utf8');
      const projects = JSON.parse(projectsContent);
      
      projects.forEach(project => {
        this.activeProjects.set(project.id, project);
      });
      
      console.log(`📁 Loaded ${this.activeProjects.size} active projects`);
    } catch (error) {
      console.log('📁 No active projects found, starting fresh');
    }
  }

  async saveActiveProjects() {
    try {
      const projectsPath = path.join(this.projectDocsPath, 'active-projects.json');
      const projects = Array.from(this.activeProjects.values());
      
      await fs.mkdir(path.dirname(projectsPath), { recursive: true });
      await fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save active projects:', error);
    }
  }

  startSyncDaemon() {
    console.log(`🔄 Starting sync daemon (interval: ${this.syncInterval}ms)`);
    
    this.syncTimer = setInterval(async () => {
      if (this.syncQueue.size > 0) {
        await this.processSyncQueue();
      }
      await this.performScheduledTasks();
    }, this.syncInterval);

    // Initial sync
    setTimeout(() => this.performScheduledTasks(), 5000);
  }

  async processSyncQueue() {
    const tasks = Array.from(this.syncQueue);
    this.syncQueue.clear();

    console.log(`🔄 Processing ${tasks.length} sync tasks...`);

    for (const task of tasks) {
      try {
        await this.processSyncTask(task);
      } catch (error) {
        console.error(`Sync task failed:`, error);
        // Re-queue failed tasks with exponential backoff
        setTimeout(() => this.syncQueue.add(task), 60000);
      }
    }
  }

  async processSyncTask(task) {
    switch (task.type) {
      case 'project_sync':
        await this.syncProject(task.project_id);
        break;
      case 'doc_sync':
        await this.syncDocuments(task.project_id, task.doc_ids);
        break;
      case 'task_analysis':
        await this.analyzeProjectTasks(task.project_id);
        break;
      case 'file_upload':
        await this.uploadProjectFiles(task.project_id, task.files);
        break;
      default:
        console.warn(`Unknown sync task type: ${task.type}`);
    }
  }

  async performScheduledTasks() {
    const now = new Date();
    console.log(`⏰ Performing scheduled tasks at ${now.toISOString()}`);

    // Auto-manage tasks for active projects
    for (const [projectId, project] of this.activeProjects) {
      try {
        await this.autoManageProjectTasks(projectId, project);
      } catch (error) {
        console.error(`Failed to auto-manage project ${projectId}:`, error);
      }
    }

    // Process automation rules
    for (const rule of this.automationRules) {
      try {
        if (this.shouldTriggerRule(rule, now)) {
          await this.executeAutomationRule(rule);
        }
      } catch (error) {
        console.error(`Failed to execute automation rule ${rule.id}:`, error);
      }
    }

    // Generate insights for active projects
    if (now.getHours() === 9 && now.getMinutes() < 5) { // Daily at 9 AM
      await this.generateDailyInsights();
    }
  }

  async processWebhookEvent(event, headers) {
    console.log(`📨 Received webhook event: ${event.event}`);

    // Verify webhook signature if configured
    if (process.env.CLICKUP_WEBHOOK_SECRET) {
      if (!this.verifyWebhookSignature(event, headers)) {
        throw new Error('Invalid webhook signature');
      }
    }

    switch (event.event) {
      case 'taskCreated':
        await this.handleTaskCreated(event);
        break;
      case 'taskUpdated':
        await this.handleTaskUpdated(event);
        break;
      case 'taskDeleted':
        await this.handleTaskDeleted(event);
        break;
      case 'taskCommentPosted':
        await this.handleTaskCommentPosted(event);
        break;
      case 'folderCreated':
        await this.handleFolderCreated(event);
        break;
      case 'folderUpdated':
        await this.handleFolderUpdated(event);
        break;
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    // Check if event triggers any automation rules
    await this.checkAutomationTriggers(event);
  }

  async handleTaskCreated(event) {
    const task = event.task_id;
    console.log(`✨ New task created: ${task}`);

    // Add to sync queue for analysis
    this.syncQueue.add({
      type: 'task_analysis',
      task_id: task,
      timestamp: Date.now()
    });

    // Check if task is part of tracked project
    const projectId = await this.getProjectIdFromTask(task);
    if (projectId && this.activeProjects.has(projectId)) {
      // Trigger project sync
      this.syncQueue.add({
        type: 'project_sync',
        project_id: projectId,
        timestamp: Date.now()
      });
    }
  }

  async handleTaskUpdated(event) {
    const task = event.task_id;
    console.log(`🔄 Task updated: ${task}`);

    // Analyze task status changes for automation
    await this.analyzeTaskStatusChange(event);

    // Update Cursor files if configured
    const projectId = await this.getProjectIdFromTask(task);
    if (projectId && this.activeProjects.has(projectId)) {
      const project = this.activeProjects.get(projectId);
      if (project.auto_sync_enabled) {
        this.syncQueue.add({
          type: 'doc_sync',
          project_id: projectId,
          task_id: task,
          timestamp: Date.now()
        });
      }
    }
  }

  async handleTaskCommentPosted(event) {
    console.log(`💬 Comment posted on task: ${event.task_id}`);

    // Analyze comment for AI insights
    await this.analyzeTaskComment(event);
  }

  async autoManageProjectTasks(projectId, project) {
    try {
      // Get all tasks for the project
      const tasks = await this.getProjectTasks(projectId);

      const management = {
        priority_updates: 0,
        status_updates: 0,
        deadline_extensions: 0,
        assignments: 0
      };

      for (const task of tasks) {
        // Priority optimization
        if (await this.shouldUpdateTaskPriority(task)) {
          await this.updateTaskPriority(task);
          management.priority_updates++;
        }

        // Deadline management
        if (await this.shouldExtendDeadline(task)) {
          await this.extendTaskDeadline(task);
          management.deadline_extensions++;
        }

        // Auto-assignment based on workload
        if (await this.shouldReassignTask(task)) {
          await this.reassignTask(task);
          management.assignments++;
        }

        // Status progression
        if (await this.shouldUpdateTaskStatus(task)) {
          await this.updateTaskStatus(task);
          management.status_updates++;
        }
      }

      if (Object.values(management).some(v => v > 0)) {
        console.log(`🤖 Auto-managed project ${projectId}:`, management);
        await this.logManagementAction(projectId, management);
      }

    } catch (error) {
      console.error(`Auto-management failed for project ${projectId}:`, error);
    }
  }

  async syncProject(projectId) {
    console.log(`🔄 Syncing project: ${projectId}`);

    const project = this.activeProjects.get(projectId);
    if (!project) {
      console.warn(`Project ${projectId} not found in active projects`);
      return;
    }

    try {
      // Sync tasks
      const tasks = await this.getProjectTasks(projectId);
      await this.syncTasksWithCursor(project, tasks);

      // Sync documents
      const docs = await this.getProjectDocs(projectId);
      await this.syncDocsWithCursor(project, docs);

      // Update project last sync time
      project.last_sync = new Date().toISOString();
      await this.saveActiveProjects();

      console.log(`✅ Project ${projectId} synced successfully`);

    } catch (error) {
      console.error(`Project sync failed for ${projectId}:`, error);
      throw error;
    }
  }

  async syncTasksWithCursor(project, tasks) {
    const cursorTasksPath = path.join(project.cursor_path, '.clickup', 'tasks.json');
    
    const taskData = {
      project_id: project.id,
      sync_timestamp: new Date().toISOString(),
      tasks: tasks.map(task => ({
        id: task.id,
        name: task.name,
        status: task.status?.status,
        priority: task.priority?.priority,
        due_date: task.due_date,
        assignees: task.assignees?.map(a => a.username),
        description: task.description,
        tags: task.tags?.map(t => t.name),
        url: task.url,
        time_tracked: task.time_tracked,
        time_estimate: task.time_estimate
      }))
    };

    await fs.mkdir(path.dirname(cursorTasksPath), { recursive: true });
    await fs.writeFile(cursorTasksPath, JSON.stringify(taskData, null, 2), 'utf8');
  }

  async syncDocsWithCursor(project, docs) {
    const cursorDocsPath = path.join(project.cursor_path, '.clickup', 'docs');
    await fs.mkdir(cursorDocsPath, { recursive: true });

    for (const doc of docs) {
      try {
        const docContent = await this.getDocumentContent(doc.id);
        const filename = `${doc.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.md`;
        const filepath = path.join(cursorDocsPath, filename);

        const formattedContent = this.formatDocumentForCursor(doc, docContent);
        await fs.writeFile(filepath, formattedContent, 'utf8');

      } catch (error) {
        console.error(`Failed to sync doc ${doc.id}:`, error);
      }
    }
  }

  formatDocumentForCursor(doc, content) {
    const header = `---
clickup_doc_id: ${doc.id}
doc_name: ${doc.name}
last_updated: ${new Date().toISOString()}
clickup_url: ${doc.url || 'N/A'}
---

`;

    return header + content;
  }

  async generateDailyInsights() {
    console.log('📊 Generating daily insights...');

    for (const [projectId, project] of this.activeProjects) {
      try {
        const insights = await this.generateProjectInsights(projectId);
        await this.saveInsightsReport(projectId, insights);
        
        // Send insights to configured channels (Slack, email, etc.)
        if (project.notifications_enabled) {
          await this.sendInsightsNotification(project, insights);
        }

      } catch (error) {
        console.error(`Failed to generate insights for project ${projectId}:`, error);
      }
    }
  }

  async generateProjectInsights(projectId) {
    const project = this.activeProjects.get(projectId);
    const tasks = await this.getProjectTasks(projectId);
    const timeRange = '24h';

    const insights = {
      project_id: projectId,
      generated_at: new Date().toISOString(),
      time_range: timeRange,
      metrics: {
        total_tasks: tasks.length,
        completed_tasks: tasks.filter(t => t.status?.status === 'complete').length,
        overdue_tasks: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length,
        high_priority_tasks: tasks.filter(t => t.priority?.priority === 1).length
      },
      productivity: {
        completion_rate: 0,
        average_task_duration: 0,
        team_velocity: 0
      },
      recommendations: []
    };

    // Calculate productivity metrics
    insights.productivity.completion_rate = 
      insights.metrics.total_tasks > 0 ? 
      (insights.metrics.completed_tasks / insights.metrics.total_tasks) * 100 : 0;

    // Generate AI-powered recommendations
    if (insights.metrics.overdue_tasks > 0) {
      insights.recommendations.push({
        type: 'deadline_management',
        priority: 'high',
        message: `${insights.metrics.overdue_tasks} tasks are overdue. Consider deadline adjustment or resource reallocation.`,
        actions: ['review_overdue_tasks', 'adjust_deadlines', 'reassign_tasks']
      });
    }

    if (insights.productivity.completion_rate < 70) {
      insights.recommendations.push({
        type: 'productivity_optimization',
        priority: 'medium',
        message: 'Task completion rate is below optimal threshold. Review task complexity and team capacity.',
        actions: ['analyze_bottlenecks', 'review_task_sizing', 'team_capacity_planning']
      });
    }

    return insights;
  }

  async saveInsightsReport(projectId, insights) {
    const reportsPath = path.join(this.projectDocsPath, 'insights', projectId);
    await fs.mkdir(reportsPath, { recursive: true });

    const reportFile = path.join(reportsPath, `daily-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify(insights, null, 2), 'utf8');

    // Also save latest report
    const latestFile = path.join(reportsPath, 'latest.json');
    await fs.writeFile(latestFile, JSON.stringify(insights, null, 2), 'utf8');
  }

  // Helper methods for ClickUp API interactions
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

  async getProjectTasks(projectId) {
    // This would be implemented based on your project structure
    // For now, return mock data
    return [];
  }

  async getProjectDocs(projectId) {
    // This would be implemented based on your project structure
    return [];
  }

  async getDocumentContent(docId) {
    const response = await this.makeClickUpRequest('GET', `/doc/${docId}`);
    return response.content || '';
  }

  setupErrorHandling() {
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.shutdown();
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('SIGINT', () => {
      console.log('Received SIGINT, shutting down gracefully...');
      this.shutdown();
    });

    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, shutting down gracefully...');
      this.shutdown();
    });
  }

  async shutdown() {
    console.log('🛑 Shutting down ClickUp Automation Daemon...');
    
    this.isRunning = false;

    // Clear timers
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    // Close webhook server
    if (this.server) {
      this.server.close();
    }

    // Save current state
    await this.saveActiveProjects();

    console.log('👋 ClickUp Automation Daemon shutdown complete');
    process.exit(0);
  }

  // Public API methods
  async addProject(projectConfig) {
    const projectId = projectConfig.id || `project_${Date.now()}`;
    projectConfig.id = projectId;
    projectConfig.added_at = new Date().toISOString();
    projectConfig.last_sync = null;

    this.activeProjects.set(projectId, projectConfig);
    await this.saveActiveProjects();

    console.log(`✅ Added project to tracking: ${projectId}`);
    return projectId;
  }

  async removeProject(projectId) {
    if (this.activeProjects.delete(projectId)) {
      await this.saveActiveProjects();
      console.log(`🗑️ Removed project from tracking: ${projectId}`);
      return true;
    }
    return false;
  }

  getStatus() {
    return {
      running: this.isRunning,
      uptime: process.uptime(),
      active_projects: this.activeProjects.size,
      automation_rules: this.automationRules.length,
      sync_queue_size: this.syncQueue.size,
      last_sync: new Date().toISOString()
    };
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const daemon = new ClickUpAutomationDaemon();

  const command = process.argv[2];

  switch (command) {
    case 'start':
      daemon.initialize().catch(console.error);
      break;
    
    case 'status':
      console.log(daemon.getStatus());
      break;
    
    case 'add-project':
      const config = JSON.parse(process.argv[3] || '{}');
      daemon.addProject(config).then(console.log).catch(console.error);
      break;
    
    default:
      console.log(`
ClickUp Automation Daemon

Usage:
  node clickup-automation-daemon.js start                    - Start the daemon
  node clickup-automation-daemon.js status                   - Show status
  node clickup-automation-daemon.js add-project <config>     - Add project

Environment Variables:
  CLICKUP_API_KEY              - ClickUp API key
  CLICKUP_WEBHOOK_PORT         - Webhook server port (default: 3001)
  CLICKUP_SYNC_INTERVAL        - Sync interval in ms (default: 300000)
  CLICKUP_DOCS_PATH            - Path for storing docs (default: ./project-docs)
  CLICKUP_WEBHOOK_SECRET       - Webhook verification secret (optional)
      `);
  }
}

export default ClickUpAutomationDaemon;