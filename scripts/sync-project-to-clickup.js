#!/usr/bin/env node

/**
 * Sync Project to ClickUp Script
 * Synchronizes current Cursor project files, documentation, and structure to ClickUp
 * Creates organized spaces, folders, and documents for comprehensive project management
 */

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProjectClickUpSync {
  constructor() {
    this.apiKey = process.env.CLICKUP_API_KEY;
    this.teamId = process.env.CLICKUP_TEAM_ID;
    this.baseURL = 'https://api.clickup.com/api/v2';
    this.projectRoot = process.cwd();
    this.projectName = path.basename(this.projectRoot);
    
    this.syncResults = {
      created_spaces: [],
      created_folders: [],
      created_docs: [],
      created_tasks: [],
      synced_files: [],
      errors: []
    };
  }

  async syncProject() {
    console.log(chalk.blue(`\n🔄 Syncing "${this.projectName}" to ClickUp\n`));
    
    try {
      // Verify connection
      await this.verifyConnection();
      
      // Get sync preferences
      const syncConfig = await this.getSyncConfiguration();
      
      // Create project structure
      const projectSpace = await this.createProjectStructure(syncConfig);
      
      // Sync based on configuration
      if (syncConfig.includeFiles) {
        await this.syncProjectFiles(projectSpace, syncConfig);
      }
      
      if (syncConfig.includeDocs) {
        await this.syncDocumentation(projectSpace, syncConfig);
      }
      
      if (syncConfig.createTasks) {
        await this.createProjectTasks(projectSpace, syncConfig);
      }
      
      if (syncConfig.setupAutomation) {
        await this.setupProjectAutomation(projectSpace, syncConfig);
      }
      
      // Display results
      this.displaySyncResults();
      
      // Setup ongoing sync
      if (syncConfig.enableOngoingSync) {
        await this.setupOngoingSync(projectSpace);
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Sync failed: ${error.message}`));
      console.error(error);
    }
  }

  async verifyConnection() {
    if (!this.apiKey) {
      throw new Error('ClickUp API key not configured. Add CLICKUP_API_KEY to your .env file.');
    }
    
    try {
      const user = await this.makeRequest('GET', '/user');
      console.log(chalk.green(`✅ Connected to ClickUp as: ${user.user.username}`));
      return user;
    } catch (error) {
      throw new Error(`ClickUp API connection failed: ${error.message}`);
    }
  }

  async getSyncConfiguration() {
    console.log(chalk.yellow('⚙️ Configure Project Sync\n'));
    
    const config = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name in ClickUp:',
        default: this.projectName
      },
      {
        type: 'list',
        name: 'spaceOption',
        message: 'Where should the project be created?',
        choices: [
          { name: '🆕 Create new space', value: 'new' },
          { name: '📁 Use existing space', value: 'existing' }
        ]
      },
      {
        type: 'checkbox',
        name: 'syncOptions',
        message: 'What should be synced?',
        choices: [
          { name: '📁 Project files and code', value: 'files', checked: true },
          { name: '📚 Documentation (README, guides)', value: 'docs', checked: true },
          { name: '✅ Create development tasks', value: 'tasks', checked: true },
          { name: '🤖 Setup automation rules', value: 'automation', checked: false },
          { name: '🔄 Enable ongoing sync', value: 'ongoing', checked: false }
        ]
      },
      {
        type: 'list',
        name: 'fileOrganization',
        message: 'How should files be organized?',
        choices: [
          { name: 'By file type (JS, CSS, etc.)', value: 'type' },
          { name: 'By directory structure', value: 'directory' },
          { name: 'By feature/component', value: 'feature' },
          { name: 'Flat structure', value: 'flat' }
        ],
        default: 'type'
      }
    ]);

    // Process sync options
    const syncConfig = {
      projectName: config.projectName,
      createNewSpace: config.spaceOption === 'new',
      includeFiles: config.syncOptions.includes('files'),
      includeDocs: config.syncOptions.includes('docs'),
      createTasks: config.syncOptions.includes('tasks'),
      setupAutomation: config.syncOptions.includes('automation'),
      enableOngoingSync: config.syncOptions.includes('ongoing'),
      fileOrganization: config.fileOrganization
    };

    // Get existing space if needed
    if (!syncConfig.createNewSpace) {
      const spaces = await this.getAvailableSpaces();
      if (spaces.length === 0) {
        console.log(chalk.yellow('No spaces found. Creating new space instead.'));
        syncConfig.createNewSpace = true;
      } else {
        const spaceChoice = await inquirer.prompt([
          {
            type: 'list',
            name: 'spaceId',
            message: 'Select target space:',
            choices: spaces.map(space => ({
              name: `${space.name} (${space.id})`,
              value: space.id
            }))
          }
        ]);
        syncConfig.targetSpaceId = spaceChoice.spaceId;
      }
    }

    return syncConfig;
  }

  async getAvailableSpaces() {
    try {
      if (!this.teamId) {
        const user = await this.makeRequest('GET', '/user');
        this.teamId = user.user.teams[0]?.id;
      }
      
      if (!this.teamId) {
        throw new Error('No team ID available');
      }
      
      const response = await this.makeRequest('GET', `/team/${this.teamId}/space`);
      return response.spaces || [];
    } catch (error) {
      console.log(chalk.yellow('⚠️ Could not fetch spaces:', error.message));
      return [];
    }
  }

  async createProjectStructure(config) {
    console.log(chalk.yellow('🏗️ Creating project structure...\n'));
    
    let projectSpace;
    
    if (config.createNewSpace) {
      // Create new space
      try {
        projectSpace = await this.createSpace(config.projectName);
        console.log(chalk.green(`✅ Created space: ${projectSpace.name}`));
        this.syncResults.created_spaces.push(projectSpace);
      } catch (error) {
        throw new Error(`Failed to create space: ${error.message}`);
      }
    } else {
      // Use existing space
      projectSpace = { id: config.targetSpaceId };
    }

    // Create folder structure
    const folders = await this.createFolderStructure(projectSpace.id, config);
    this.syncResults.created_folders.push(...folders);
    
    return { ...projectSpace, folders };
  }

  async createSpace(name) {
    const spaceData = {
      name: name,
      multiple_assignees: true,
      features: {
        due_dates: { enabled: true },
        time_tracking: { enabled: true },
        tags: { enabled: true },
        time_estimates: { enabled: true },
        checklists: { enabled: true },
        custom_fields: { enabled: true },
        dependency_warning: { enabled: true },
        portfolios: { enabled: true }
      }
    };

    return await this.makeRequest('POST', `/team/${this.teamId}/space`, spaceData);
  }

  async createFolderStructure(spaceId, config) {
    const folders = [];
    
    const folderStructure = [
      { name: '📁 Source Code', key: 'source' },
      { name: '📚 Documentation', key: 'docs' },
      { name: '🎨 Assets & Design', key: 'assets' },
      { name: '⚙️ Configuration', key: 'config' },
      { name: '🧪 Tests', key: 'tests' },
      { name: '🚀 Deployment', key: 'deployment' },
      { name: '📋 Project Management', key: 'management' }
    ];

    for (const folder of folderStructure) {
      try {
        const createdFolder = await this.createFolder(spaceId, folder.name);
        folders.push({ ...createdFolder, key: folder.key });
        console.log(chalk.green(`✅ Created folder: ${folder.name}`));
      } catch (error) {
        console.log(chalk.red(`❌ Failed to create folder ${folder.name}: ${error.message}`));
        this.syncResults.errors.push({ type: 'folder', name: folder.name, error: error.message });
      }
    }

    return folders;
  }

  async createFolder(spaceId, name) {
    const folderData = { name };
    return await this.makeRequest('POST', `/space/${spaceId}/folder`, folderData);
  }

  async syncProjectFiles(projectSpace, config) {
    console.log(chalk.yellow('📁 Syncing project files...\n'));
    
    try {
      const files = await this.analyzeProjectFiles();
      const sourceFolder = projectSpace.folders.find(f => f.key === 'source');
      
      if (!sourceFolder) {
        throw new Error('Source code folder not found');
      }

      const organizedFiles = this.organizeFiles(files, config.fileOrganization);
      
      for (const group of organizedFiles) {
        // Create sub-folder for each group
        const subFolder = await this.createFolder(sourceFolder.id, group.name);
        console.log(chalk.blue(`📂 Created: ${group.name}`));
        
        // Create documents for each file in the group
        for (const file of group.files) {
          try {
            const doc = await this.createFileDocument(subFolder.id, file);
            this.syncResults.created_docs.push(doc);
            this.syncResults.synced_files.push(file.path);
            console.log(chalk.gray(`  📄 ${file.name}`));
          } catch (error) {
            console.log(chalk.red(`  ❌ Failed: ${file.name}`));
            this.syncResults.errors.push({ type: 'file', name: file.name, error: error.message });
          }
        }
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ File sync failed: ${error.message}`));
      this.syncResults.errors.push({ type: 'files', error: error.message });
    }
  }

  async analyzeProjectFiles() {
    const files = [];
    
    const walkDir = async (dir, basePath = '') => {
      const items = await fs.readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.join(basePath, item.name);
        
        // Skip common ignore patterns
        if (this.shouldIgnore(item.name)) continue;
        
        if (item.isDirectory()) {
          await walkDir(fullPath, relativePath);
        } else if (item.isFile()) {
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const stats = await fs.stat(fullPath);
            
            files.push({
              name: item.name,
              path: relativePath,
              fullPath,
              extension: path.extname(item.name),
              size: stats.size,
              content: content.substring(0, 50000), // Limit content size
              type: this.getFileType(item.name)
            });
          } catch (error) {
            // Skip files that can't be read as text
          }
        }
      }
    };
    
    await walkDir(this.projectRoot);
    return files;
  }

  shouldIgnore(name) {
    const ignorePatterns = [
      'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
      '.DS_Store', 'Thumbs.db', '.env', '.env.local'
    ];
    
    return ignorePatterns.some(pattern => name.includes(pattern)) || name.startsWith('.');
  }

  getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript', 
      '.jsx': 'React JSX',
      '.tsx': 'React TSX',
      '.css': 'Stylesheet',
      '.scss': 'Sass',
      '.html': 'HTML',
      '.json': 'Configuration',
      '.md': 'Documentation',
      '.yml': 'Configuration',
      '.yaml': 'Configuration',
      '.py': 'Python',
      '.java': 'Java',
      '.cpp': 'C++',
      '.c': 'C'
    };
    
    return typeMap[ext] || 'Other';
  }

  organizeFiles(files, organization) {
    switch (organization) {
      case 'type':
        return this.organizeByType(files);
      case 'directory':
        return this.organizeByDirectory(files);
      case 'feature':
        return this.organizeByFeature(files);
      default:
        return [{ name: 'All Files', files }];
    }
  }

  organizeByType(files) {
    const groups = {};
    
    files.forEach(file => {
      const type = file.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(file);
    });
    
    return Object.entries(groups).map(([type, files]) => ({
      name: `${type} Files`,
      files
    }));
  }

  organizeByDirectory(files) {
    const groups = {};
    
    files.forEach(file => {
      const dir = path.dirname(file.path) || 'Root';
      if (!groups[dir]) {
        groups[dir] = [];
      }
      groups[dir].push(file);
    });
    
    return Object.entries(groups).map(([dir, files]) => ({
      name: dir,
      files
    }));
  }

  organizeByFeature(files) {
    // Simple feature detection based on directory names
    const featurePatterns = ['components', 'pages', 'api', 'utils', 'hooks', 'services'];
    const groups = { 'Core': [] };
    
    files.forEach(file => {
      const pathParts = file.path.split('/');
      const feature = pathParts.find(part => featurePatterns.includes(part.toLowerCase()));
      
      const groupName = feature ? feature.charAt(0).toUpperCase() + feature.slice(1) : 'Core';
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(file);
    });
    
    return Object.entries(groups).map(([feature, files]) => ({
      name: feature,
      files
    }));
  }

  async createFileDocument(folderId, file) {
    const docContent = this.formatFileForClickUp(file);
    
    const docData = {
      name: file.name,
      content: docContent,
      parent: folderId
    };
    
    return await this.makeRequest('POST', '/doc', docData);
  }

  formatFileForClickUp(file) {
    const header = `# ${file.name}

**File Path:** \`${file.path}\`  
**Type:** ${file.type}  
**Size:** ${(file.size / 1024).toFixed(2)} KB  
**Last Synced:** ${new Date().toISOString()}

---

`;

    const codeBlock = file.content ? `
\`\`\`${this.getLanguageFromExtension(file.extension)}
${file.content}
\`\`\`
` : '*Binary file or content not available*';

    return header + codeBlock;
  }

  getLanguageFromExtension(ext) {
    const langMap = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'jsx',
      '.tsx': 'tsx',
      '.css': 'css',
      '.scss': 'scss',
      '.html': 'html',
      '.json': 'json',
      '.md': 'markdown',
      '.py': 'python',
      '.java': 'java'
    };
    
    return langMap[ext] || 'text';
  }

  async syncDocumentation(projectSpace, config) {
    console.log(chalk.yellow('📚 Syncing documentation...\n'));
    
    try {
      const docsFolder = projectSpace.folders.find(f => f.key === 'docs');
      if (!docsFolder) {
        throw new Error('Documentation folder not found');
      }

      // Find documentation files
      const docFiles = [
        'README.md',
        'SETUP-GUIDE.md',
        'DEVELOPMENT-SUMMARY.md',
        'comprehensive-platform-knowledge-base.md',
        'advanced-ai-model-testing-workflow.md'
      ];

      for (const docFile of docFiles) {
        try {
          const filePath = path.join(this.projectRoot, docFile);
          const content = await fs.readFile(filePath, 'utf8');
          
          const doc = await this.createDocumentFromMarkdown(docsFolder.id, docFile, content);
          this.syncResults.created_docs.push(doc);
          console.log(chalk.green(`✅ Synced: ${docFile}`));
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.log(chalk.yellow(`⚠️ Skipped: ${docFile} - ${error.message}`));
          }
        }
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Documentation sync failed: ${error.message}`));
      this.syncResults.errors.push({ type: 'docs', error: error.message });
    }
  }

  async createDocumentFromMarkdown(folderId, filename, content) {
    const docData = {
      name: path.basename(filename, '.md'),
      content: content,
      parent: folderId
    };
    
    return await this.makeRequest('POST', '/doc', docData);
  }

  async createProjectTasks(projectSpace, config) {
    console.log(chalk.yellow('✅ Creating project tasks...\n'));
    
    try {
      const managementFolder = projectSpace.folders.find(f => f.key === 'management');
      if (!managementFolder) {
        throw new Error('Management folder not found');
      }

      // Create a list for tasks
      const taskList = await this.createTaskList(managementFolder.id, 'Development Tasks');
      
      // Create standard development tasks
      const standardTasks = [
        {
          name: 'Project Setup & Configuration',
          description: 'Initial project setup, environment configuration, and dependency installation',
          priority: 1,
          tags: ['setup', 'configuration']
        },
        {
          name: 'Code Review & Quality Assurance',
          description: 'Review existing code, establish coding standards, and setup quality gates',
          priority: 2,
          tags: ['code-review', 'quality']
        },
        {
          name: 'Documentation Update',
          description: 'Update project documentation, API docs, and user guides',
          priority: 3,
          tags: ['documentation']
        },
        {
          name: 'Testing Strategy Implementation',
          description: 'Setup testing framework, write unit tests, and integration tests',
          priority: 2,
          tags: ['testing', 'quality']
        },
        {
          name: 'Performance Optimization',
          description: 'Analyze and optimize application performance',
          priority: 3,
          tags: ['performance', 'optimization']
        },
        {
          name: 'Security Review',
          description: 'Conduct security audit and implement security best practices',
          priority: 1,
          tags: ['security', 'audit']
        }
      ];

      for (const taskData of standardTasks) {
        try {
          const task = await this.createTask(taskList.id, taskData);
          this.syncResults.created_tasks.push(task);
          console.log(chalk.green(`✅ Created task: ${taskData.name}`));
        } catch (error) {
          console.log(chalk.red(`❌ Failed to create task: ${taskData.name}`));
          this.syncResults.errors.push({ type: 'task', name: taskData.name, error: error.message });
        }
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Task creation failed: ${error.message}`));
      this.syncResults.errors.push({ type: 'tasks', error: error.message });
    }
  }

  async createTaskList(folderId, name) {
    const listData = {
      name: name,
      content: 'Development tasks for ' + this.projectName
    };
    
    return await this.makeRequest('POST', `/folder/${folderId}/list`, listData);
  }

  async createTask(listId, taskData) {
    const task = {
      name: taskData.name,
      description: taskData.description,
      priority: taskData.priority,
      tags: taskData.tags || []
    };
    
    return await this.makeRequest('POST', `/list/${listId}/task`, task);
  }

  async setupProjectAutomation(projectSpace, config) {
    console.log(chalk.yellow('🤖 Setting up automation...\n'));
    
    // This would integrate with the ClickUp automation daemon
    // For now, just save configuration for later use
    
    const automationConfig = {
      project_id: projectSpace.id,
      project_name: config.projectName,
      cursor_path: this.projectRoot,
      auto_sync_enabled: true,
      sync_interval: 300000, // 5 minutes
      webhook_enabled: true,
      created_at: new Date().toISOString()
    };
    
    // Save to project docs for daemon pickup
    const configPath = path.join(this.projectRoot, '.clickup', 'automation-config.json');
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(automationConfig, null, 2), 'utf8');
    
    console.log(chalk.green('✅ Automation configuration saved'));
    console.log(chalk.blue('💡 Start the ClickUp daemon to enable real-time sync'));
  }

  async setupOngoingSync(projectSpace) {
    console.log(chalk.yellow('🔄 Setting up ongoing sync...\n'));
    
    const syncConfig = {
      project_id: projectSpace.id,
      project_path: this.projectRoot,
      last_sync: new Date().toISOString(),
      auto_sync: true,
      sync_folders: projectSpace.folders.map(f => ({
        id: f.id,
        key: f.key,
        name: f.name
      }))
    };
    
    const configPath = path.join(this.projectRoot, '.clickup', 'sync-config.json');
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(syncConfig, null, 2), 'utf8');
    
    console.log(chalk.green('✅ Ongoing sync configuration saved'));
  }

  displaySyncResults() {
    console.log(chalk.blue('\n📊 Sync Results Summary\n'));
    
    console.log(chalk.green(`✅ Spaces created: ${this.syncResults.created_spaces.length}`));
    console.log(chalk.green(`✅ Folders created: ${this.syncResults.created_folders.length}`));
    console.log(chalk.green(`✅ Documents created: ${this.syncResults.created_docs.length}`));
    console.log(chalk.green(`✅ Tasks created: ${this.syncResults.created_tasks.length}`));
    console.log(chalk.green(`✅ Files synced: ${this.syncResults.synced_files.length}`));
    
    if (this.syncResults.errors.length > 0) {
      console.log(chalk.red(`❌ Errors: ${this.syncResults.errors.length}`));
      
      console.log(chalk.yellow('\nError Details:'));
      this.syncResults.errors.forEach(error => {
        console.log(chalk.red(`  • ${error.type}: ${error.name || ''} - ${error.error}`));
      });
    }
    
    if (this.syncResults.created_spaces.length > 0) {
      const space = this.syncResults.created_spaces[0];
      console.log(chalk.blue(`\n🔗 ClickUp Space: https://app.clickup.com/${this.teamId}/spaces/${space.id}`));
    }
    
    console.log(chalk.green('\n🎉 Project sync completed!'));
  }

  async makeRequest(method, endpoint, data = null) {
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
}

// Run sync if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const sync = new ProjectClickUpSync();
  sync.syncProject().catch(console.error);
}

export default ProjectClickUpSync;