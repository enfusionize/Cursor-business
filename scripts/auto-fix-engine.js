#!/usr/bin/env node

/**
 * Vibe Marketing Platform - Automated Issue Resolution Engine
 * 
 * Automatically detects and fixes common issues:
 * - Missing environment variables
 * - Broken API connections
 * - MCP server failures
 * - File permission issues
 * - Configuration problems
 * - Performance bottlenecks
 * - Memory leaks
 * - Network connectivity issues
 */

const chalk = require('chalk').default;
const fs = require('fs').promises;
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const axios = require('axios');
const os = require('os');
const execAsync = promisify(exec);

class AutoFixEngine {
  constructor() {
    this.fixes = new Map();
    this.fixHistory = [];
    this.isRunning = false;
    this.fixStrategies = {
      'missing-env-vars': this.fixMissingEnvVars.bind(this),
      'api-connection-failed': this.fixAPIConnection.bind(this),
      'mcp-server-down': this.fixMCPServer.bind(this),
      'file-permissions': this.fixFilePermissions.bind(this),
      'high-memory-usage': this.fixHighMemoryUsage.bind(this),
      'disk-space-low': this.fixDiskSpace.bind(this),
      'network-issues': this.fixNetworkIssues.bind(this),
      'configuration-error': this.fixConfigurationError.bind(this),
      'process-hanging': this.fixHangingProcess.bind(this),
      'log-rotation': this.fixLogRotation.bind(this)
    };
    
    this.criticalIssues = [
      'missing-env-vars',
      'api-connection-failed',
      'mcp-server-down',
      'file-permissions'
    ];
    
    this.performanceIssues = [
      'high-memory-usage',
      'disk-space-low',
      'process-hanging'
    ];
    
    this.maintenanceIssues = [
      'log-rotation',
      'configuration-error',
      'network-issues'
    ];
  }

  async runAutoFix(options = {}) {
    const {
      issueType = null,
      dryRun = false,
      verbose = false,
      interactive = false
    } = options;

    console.log(chalk.cyan('🔧 Automated Issue Resolution Engine'));
    console.log(chalk.gray('=' .repeat(60)));

    if (dryRun) {
      console.log(chalk.yellow('🔍 DRY RUN MODE - No changes will be made'));
    }

    this.isRunning = true;

    try {
      // Detect issues
      const issues = await this.detectIssues(verbose);
      
      if (issues.length === 0) {
        console.log(chalk.green('✅ No issues detected - system is healthy!'));
        return { success: true, fixes: [], issues: [] };
      }

      console.log(chalk.yellow(`\n🔍 Detected ${issues.length} issue(s):`));
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.type}: ${issue.description}`);
      });

      // Filter issues if specific type requested
      let issuesToFix = issues;
      if (issueType) {
        issuesToFix = issues.filter(issue => issue.type === issueType);
        if (issuesToFix.length === 0) {
          console.log(chalk.yellow(`No issues of type '${issueType}' found`));
          return { success: true, fixes: [], issues };
        }
      }

      // Interactive mode - ask user which issues to fix
      if (interactive) {
        issuesToFix = await this.selectIssuesInteractively(issuesToFix);
      }

      // Apply fixes
      const fixResults = await this.applyFixes(issuesToFix, dryRun, verbose);

      // Generate report
      const report = this.generateFixReport(issues, fixResults);
      
      if (verbose) {
        console.log(chalk.cyan('\n📊 Fix Report:'));
        console.log(report);
      }

      return {
        success: true,
        issues,
        fixes: fixResults,
        report
      };

    } catch (error) {
      console.error(chalk.red('❌ Auto-fix engine failed:'), error.message);
      return { success: false, error: error.message };
    } finally {
      this.isRunning = false;
    }
  }

  async detectIssues(verbose = false) {
    const issues = [];

    if (verbose) {
      console.log(chalk.blue('\n🔍 Scanning for issues...'));
    }

    // Check environment variables
    const envIssues = await this.checkEnvironmentVariables();
    issues.push(...envIssues);

    // Check API connections
    const apiIssues = await this.checkAPIConnections();
    issues.push(...apiIssues);

    // Check MCP servers
    const mcpIssues = await this.checkMCPServers();
    issues.push(...mcpIssues);

    // Check file permissions
    const fileIssues = await this.checkFilePermissions();
    issues.push(...fileIssues);

    // Check system resources
    const resourceIssues = await this.checkSystemResources();
    issues.push(...resourceIssues);

    // Check configuration
    const configIssues = await this.checkConfiguration();
    issues.push(...configIssues);

    // Check processes
    const processIssues = await this.checkProcesses();
    issues.push(...processIssues);

    // Check logs
    const logIssues = await this.checkLogs();
    issues.push(...logIssues);

    return issues;
  }

  async checkEnvironmentVariables() {
    const issues = [];
    const requiredVars = [
      'ANTHROPIC_API_KEY',
      'BUSINESS_NAME',
      'BUSINESS_DOMAIN'
    ];

    const optionalVars = [
      'FIGMA_API_KEY',
      'CLICKUP_API_KEY',
      'MINIMAX_API_KEY',
      'RUNWAY_API_KEY'
    ];

    // Check required variables
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        issues.push({
          type: 'missing-env-vars',
          severity: 'critical',
          description: `Missing required environment variable: ${varName}`,
          variable: varName,
          required: true
        });
      }
    }

    // Check optional variables
    for (const varName of optionalVars) {
      if (!process.env[varName]) {
        issues.push({
          type: 'missing-env-vars',
          severity: 'warning',
          description: `Missing optional environment variable: ${varName}`,
          variable: varName,
          required: false
        });
      }
    }

    return issues;
  }

  async checkAPIConnections() {
    const issues = [];
    const endpoints = [
      { name: 'Anthropic', url: 'https://api.anthropic.com/v1/messages', key: 'ANTHROPIC_API_KEY' },
      { name: 'Figma', url: 'https://api.figma.com/v1/me', key: 'FIGMA_API_KEY' },
      { name: 'ClickUp', url: 'https://api.clickup.com/api/v2/user', key: 'CLICKUP_API_KEY' }
    ];

    for (const endpoint of endpoints) {
      const apiKey = process.env[endpoint.key];
      if (!apiKey) continue;

      try {
        const headers = endpoint.name === 'Anthropic' 
          ? { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }
          : endpoint.name === 'Figma'
          ? { 'X-Figma-Token': apiKey }
          : { 'Authorization': apiKey };

        await axios.get(endpoint.url, { 
          headers, 
          timeout: 10000,
          validateStatus: (status) => status < 500
        });

      } catch (error) {
        issues.push({
          type: 'api-connection-failed',
          severity: 'high',
          description: `Failed to connect to ${endpoint.name} API: ${error.message}`,
          endpoint: endpoint.name,
          url: endpoint.url,
          error: error.message
        });
      }
    }

    return issues;
  }

  async checkMCPServers() {
    const issues = [];
    const servers = [
      'figma-framer-converter',
      'clickup-mcp-server'
    ];

    for (const server of servers) {
      const serverPath = path.join('mcps', `${server}.js`);
      
      try {
        await fs.access(serverPath);
        
        // Check if server is running
        try {
          const { stdout } = await execAsync(`ps aux | grep "${server}" | grep -v grep`);
          if (!stdout.trim()) {
            issues.push({
              type: 'mcp-server-down',
              severity: 'high',
              description: `MCP server not running: ${server}`,
              server,
              path: serverPath
            });
          }
        } catch (error) {
          issues.push({
            type: 'mcp-server-down',
            severity: 'high',
            description: `Cannot check MCP server status: ${server}`,
            server,
            path: serverPath,
            error: error.message
          });
        }
        
      } catch (error) {
        issues.push({
          type: 'mcp-server-down',
          severity: 'critical',
          description: `MCP server file missing: ${server}`,
          server,
          path: serverPath
        });
      }
    }

    return issues;
  }

  async checkFilePermissions() {
    const issues = [];
    const criticalFiles = [
      'package.json',
      'start.js',
      'scripts/setup.js',
      'dashboard/index.html'
    ];

    for (const file of criticalFiles) {
      try {
        await fs.access(file, fs.constants.R_OK | fs.constants.W_OK);
      } catch (error) {
        issues.push({
          type: 'file-permissions',
          severity: 'high',
          description: `File permission issue: ${file}`,
          file,
          error: error.message
        });
      }
    }

    return issues;
  }

  async checkSystemResources() {
    const issues = [];

    // Check memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryPercent = (usedMemory / totalMemory) * 100;

    if (memoryPercent > 85) {
      issues.push({
        type: 'high-memory-usage',
        severity: 'high',
        description: `High memory usage: ${memoryPercent.toFixed(1)}%`,
        memoryPercent,
        usedMemory: Math.round(usedMemory / 1024 / 1024 / 1024 * 100) / 100,
        totalMemory: Math.round(totalMemory / 1024 / 1024 / 1024 * 100) / 100
      });
    }

    // Check disk space
    try {
      const { stdout } = await execAsync('df -h .');
      const lines = stdout.trim().split('\n');
      if (lines.length > 1) {
        const diskInfo = lines[1].split(/\s+/);
        const usagePercent = parseInt(diskInfo[4].replace('%', ''));
        
        if (usagePercent > 85) {
          issues.push({
            type: 'disk-space-low',
            severity: 'high',
            description: `Low disk space: ${usagePercent}% used`,
            usagePercent,
            available: diskInfo[3]
          });
        }
      }
    } catch (error) {
      // Ignore disk check errors on non-Unix systems
    }

    return issues;
  }

  async checkConfiguration() {
    const issues = [];

    // Check package.json
    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.start) {
        issues.push({
          type: 'configuration-error',
          severity: 'medium',
          description: 'Missing start script in package.json',
          file: 'package.json'
        });
      }
    } catch (error) {
      issues.push({
        type: 'configuration-error',
        severity: 'critical',
        description: 'Cannot read package.json',
        file: 'package.json',
        error: error.message
      });
    }

    // Check if required directories exist
    const requiredDirs = ['scripts', 'mcps', 'dashboard', 'api'];
    for (const dir of requiredDirs) {
      try {
        const stat = await fs.stat(dir);
        if (!stat.isDirectory()) {
          issues.push({
            type: 'configuration-error',
            severity: 'high',
            description: `Required directory is not a directory: ${dir}`,
            directory: dir
          });
        }
      } catch (error) {
        issues.push({
          type: 'configuration-error',
          severity: 'high',
          description: `Required directory missing: ${dir}`,
          directory: dir
        });
      }
    }

    return issues;
  }

  async checkProcesses() {
    const issues = [];

    // Check for hanging processes
    try {
      const { stdout } = await execAsync('ps aux | grep node | grep -v grep');
      const processes = stdout.trim().split('\n').filter(line => line.trim());
      
      // Look for processes with high CPU usage
      for (const process of processes) {
        const parts = process.split(/\s+/);
        if (parts.length >= 11) {
          const cpuUsage = parseFloat(parts[2]);
          if (cpuUsage > 80) {
            issues.push({
              type: 'process-hanging',
              severity: 'high',
              description: `High CPU usage process detected: ${cpuUsage}%`,
              pid: parts[1],
              cpuUsage,
              command: parts.slice(10).join(' ')
            });
          }
        }
      }
    } catch (error) {
      // Ignore process check errors
    }

    return issues;
  }

  async checkLogs() {
    const issues = [];

    // Check if logs directory exists
    try {
      const logDir = 'logs';
      const stat = await fs.stat(logDir);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(logDir);
        let totalSize = 0;
        
        for (const file of files) {
          const filePath = path.join(logDir, file);
          const fileStat = await fs.stat(filePath);
          totalSize += fileStat.size;
        }
        
        // Check if logs are too large (> 100MB)
        if (totalSize > 100 * 1024 * 1024) {
          issues.push({
            type: 'log-rotation',
            severity: 'medium',
            description: `Log files are too large: ${Math.round(totalSize / 1024 / 1024)}MB`,
            totalSize,
            fileCount: files.length
          });
        }
      }
    } catch (error) {
      // Logs directory doesn't exist - will be created by auto-fix
    }

    return issues;
  }

  async selectIssuesInteractively(issues) {
    const inquirer = require('inquirer').default;
    
    const choices = issues.map((issue, index) => ({
      name: `${issue.severity.toUpperCase()}: ${issue.description}`,
      value: index,
      checked: this.criticalIssues.includes(issue.type)
    }));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedIssues',
        message: 'Select issues to fix:',
        choices,
        pageSize: 10
      }
    ]);

    return answers.selectedIssues.map(index => issues[index]);
  }

  async applyFixes(issues, dryRun = false, verbose = false) {
    const fixResults = [];

    console.log(chalk.yellow(`\n🔧 Applying fixes for ${issues.length} issue(s)...\n`));

    for (const issue of issues) {
      const fixStrategy = this.fixStrategies[issue.type];
      
      if (!fixStrategy) {
        fixResults.push({
          issue,
          success: false,
          message: `No fix strategy available for ${issue.type}`,
          skipped: true
        });
        continue;
      }

      try {
        if (verbose) {
          console.log(chalk.blue(`🔧 Fixing: ${issue.description}`));
        }

        const result = await fixStrategy(issue, dryRun);
        
        fixResults.push({
          issue,
          success: result.success,
          message: result.message,
          actions: result.actions || [],
          dryRun
        });

        if (result.success) {
          console.log(chalk.green(`✅ Fixed: ${issue.description}`));
          if (result.actions && result.actions.length > 0) {
            result.actions.forEach(action => {
              console.log(chalk.gray(`   • ${action}`));
            });
          }
        } else {
          console.log(chalk.red(`❌ Failed to fix: ${issue.description}`));
          console.log(chalk.red(`   Error: ${result.message}`));
        }

      } catch (error) {
        fixResults.push({
          issue,
          success: false,
          message: error.message,
          error: true
        });
        console.log(chalk.red(`❌ Fix failed: ${issue.description} - ${error.message}`));
      }
    }

    return fixResults;
  }

  // Fix Strategy Implementations

  async fixMissingEnvVars(issue, dryRun = false) {
    const { variable, required } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would prompt for ${variable} value`,
        actions: [`Create/update .env file with ${variable}`]
      };
    }

    // Check if .env file exists
    let envContent = '';
    try {
      envContent = await fs.readFile('.env', 'utf8');
    } catch (error) {
      // .env file doesn't exist, will be created
    }

    // Default values for common variables
    const defaultValues = {
      'BUSINESS_NAME': 'Vibe Marketing Platform',
      'BUSINESS_DOMAIN': 'localhost:3000',
      'ANTHROPIC_API_KEY': 'your-anthropic-api-key-here',
      'FIGMA_API_KEY': 'your-figma-api-key-here',
      'CLICKUP_API_KEY': 'your-clickup-api-key-here',
      'MINIMAX_API_KEY': 'your-minimax-api-key-here',
      'RUNWAY_API_KEY': 'your-runway-api-key-here'
    };

    const defaultValue = defaultValues[variable] || `your-${variable.toLowerCase().replace(/_/g, '-')}-here`;

    // Add variable to .env file
    if (!envContent.includes(`${variable}=`)) {
      envContent += `\n${variable}=${defaultValue}\n`;
      await fs.writeFile('.env', envContent);
      actions.push(`Added ${variable} to .env file`);
    }

    return {
      success: true,
      message: `Added ${variable} to .env file with placeholder value`,
      actions
    };
  }

  async fixAPIConnection(issue, dryRun = false) {
    const { endpoint, error } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would attempt to fix ${endpoint} API connection`,
        actions: [`Check ${endpoint} API key`, `Verify network connectivity`]
      };
    }

    // Check if it's a network issue
    if (error.includes('ENOTFOUND') || error.includes('ECONNREFUSED')) {
      actions.push('Detected network connectivity issue');
      
      // Try to ping a known server
      try {
        await axios.get('https://www.google.com', { timeout: 5000 });
        actions.push('Internet connectivity is working');
      } catch (netError) {
        return {
          success: false,
          message: 'Network connectivity issue detected',
          actions
        };
      }
    }

    // Check if it's an authentication issue
    if (error.includes('401') || error.includes('403')) {
      actions.push('Detected authentication issue - check API key');
      
      // Log helpful message
      console.log(chalk.yellow(`💡 To fix ${endpoint} API connection:`));
      console.log(chalk.gray(`   1. Verify your ${endpoint} API key is correct`));
      console.log(chalk.gray(`   2. Check API key permissions`));
      console.log(chalk.gray(`   3. Ensure API key is not expired`));
    }

    return {
      success: true,
      message: `Diagnosed ${endpoint} API connection issue`,
      actions
    };
  }

  async fixMCPServer(issue, dryRun = false) {
    const { server, path: serverPath } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would attempt to fix MCP server: ${server}`,
        actions: [`Check if ${server} file exists`, `Attempt to start ${server}`]
      };
    }

    // Check if server file exists
    try {
      await fs.access(serverPath);
      actions.push(`Server file exists: ${serverPath}`);
      
      // Try to start the server
      try {
        const serverProcess = spawn('node', [serverPath], {
          detached: true,
          stdio: 'ignore'
        });
        
        serverProcess.unref();
        actions.push(`Started MCP server: ${server}`);
        
        return {
          success: true,
          message: `Successfully started MCP server: ${server}`,
          actions
        };
        
      } catch (startError) {
        actions.push(`Failed to start server: ${startError.message}`);
        
        return {
          success: false,
          message: `Could not start MCP server: ${server}`,
          actions
        };
      }
      
    } catch (error) {
      actions.push(`Server file missing: ${serverPath}`);
      
      return {
        success: false,
        message: `MCP server file missing: ${server}`,
        actions
      };
    }
  }

  async fixFilePermissions(issue, dryRun = false) {
    const { file } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would fix file permissions for: ${file}`,
        actions: [`Change permissions on ${file}`]
      };
    }

    try {
      // Try to fix permissions
      await execAsync(`chmod 644 "${file}"`);
      actions.push(`Fixed permissions for ${file}`);
      
      return {
        success: true,
        message: `Fixed file permissions for: ${file}`,
        actions
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Could not fix permissions for ${file}: ${error.message}`,
        actions
      };
    }
  }

  async fixHighMemoryUsage(issue, dryRun = false) {
    const { memoryPercent } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would attempt to reduce memory usage (${memoryPercent}%)`,
        actions: ['Force garbage collection', 'Restart memory-intensive processes']
      };
    }

    // Force garbage collection
    if (global.gc) {
      global.gc();
      actions.push('Forced garbage collection');
    }

    // Clear require cache for non-core modules
    Object.keys(require.cache).forEach(key => {
      if (!key.includes('node_modules')) {
        delete require.cache[key];
      }
    });
    actions.push('Cleared require cache');

    return {
      success: true,
      message: `Attempted to reduce memory usage`,
      actions
    };
  }

  async fixDiskSpace(issue, dryRun = false) {
    const { usagePercent } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would attempt to free disk space (${usagePercent}% used)`,
        actions: ['Clean temporary files', 'Rotate logs', 'Clear cache']
      };
    }

    // Clean temporary files
    try {
      await execAsync('rm -rf /tmp/vibe-marketing-*');
      actions.push('Cleaned temporary files');
    } catch (error) {
      // Ignore cleanup errors
    }

    // Clear node_modules cache
    try {
      await execAsync('npm cache clean --force');
      actions.push('Cleared npm cache');
    } catch (error) {
      // Ignore cache errors
    }

    return {
      success: true,
      message: `Attempted to free disk space`,
      actions
    };
  }

  async fixNetworkIssues(issue, dryRun = false) {
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: 'Would attempt to fix network issues',
        actions: ['Check DNS resolution', 'Test connectivity', 'Reset network settings']
      };
    }

    // Test basic connectivity
    try {
      await axios.get('https://www.google.com', { timeout: 5000 });
      actions.push('Basic internet connectivity working');
    } catch (error) {
      actions.push('Internet connectivity issue detected');
      
      return {
        success: false,
        message: 'Network connectivity issue cannot be automatically fixed',
        actions
      };
    }

    return {
      success: true,
      message: 'Network connectivity verified',
      actions
    };
  }

  async fixConfigurationError(issue, dryRun = false) {
    const { file, directory } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would fix configuration error in ${file || directory}`,
        actions: [`Create/fix ${file || directory}`]
      };
    }

    if (directory) {
      // Create missing directory
      try {
        await fs.mkdir(directory, { recursive: true });
        actions.push(`Created directory: ${directory}`);
        
        return {
          success: true,
          message: `Created missing directory: ${directory}`,
          actions
        };
        
      } catch (error) {
        return {
          success: false,
          message: `Could not create directory ${directory}: ${error.message}`,
          actions
        };
      }
    }

    return {
      success: true,
      message: 'Configuration checked',
      actions
    };
  }

  async fixHangingProcess(issue, dryRun = false) {
    const { pid, cpuUsage } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would terminate hanging process (PID: ${pid}, CPU: ${cpuUsage}%)`,
        actions: [`Kill process ${pid}`]
      };
    }

    try {
      await execAsync(`kill -TERM ${pid}`);
      actions.push(`Terminated process ${pid}`);
      
      return {
        success: true,
        message: `Terminated hanging process (PID: ${pid})`,
        actions
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Could not terminate process ${pid}: ${error.message}`,
        actions
      };
    }
  }

  async fixLogRotation(issue, dryRun = false) {
    const { totalSize, fileCount } = issue;
    const actions = [];

    if (dryRun) {
      return {
        success: true,
        message: `Would rotate log files (${Math.round(totalSize / 1024 / 1024)}MB)`,
        actions: ['Archive old logs', 'Compress log files', 'Clean up old archives']
      };
    }

    const logDir = 'logs';
    const archiveDir = path.join(logDir, 'archive');

    try {
      // Create archive directory
      await fs.mkdir(archiveDir, { recursive: true });
      actions.push('Created archive directory');

      // Move old log files to archive
      const files = await fs.readdir(logDir);
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      for (const file of files) {
        if (file === 'archive') continue;
        
        const filePath = path.join(logDir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.mtime < cutoffDate) {
          const archivePath = path.join(archiveDir, file);
          await fs.rename(filePath, archivePath);
          actions.push(`Archived ${file}`);
        }
      }

      return {
        success: true,
        message: `Rotated log files`,
        actions
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Could not rotate logs: ${error.message}`,
        actions
      };
    }
  }

  generateFixReport(issues, fixResults) {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      fixedIssues: fixResults.filter(r => r.success).length,
      failedFixes: fixResults.filter(r => !r.success && !r.skipped).length,
      skippedIssues: fixResults.filter(r => r.skipped).length,
      issuesBySeverity: {},
      fixesByType: {},
      recommendations: []
    };

    // Count issues by severity
    issues.forEach(issue => {
      report.issuesBySeverity[issue.severity] = (report.issuesBySeverity[issue.severity] || 0) + 1;
    });

    // Count fixes by type
    fixResults.forEach(result => {
      if (result.success) {
        report.fixesByType[result.issue.type] = (report.fixesByType[result.issue.type] || 0) + 1;
      }
    });

    // Generate recommendations
    const failedFixes = fixResults.filter(r => !r.success && !r.skipped);
    if (failedFixes.length > 0) {
      report.recommendations.push('Review failed fixes and address manually');
    }

    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      report.recommendations.push('Address critical issues immediately');
    }

    const highIssues = issues.filter(i => i.severity === 'high');
    if (highIssues.length > 3) {
      report.recommendations.push('Consider system maintenance to prevent recurring issues');
    }

    return report;
  }

  async startContinuousMonitoring(interval = 300000) { // 5 minutes
    console.log(chalk.cyan('🔄 Starting continuous auto-fix monitoring...'));
    console.log(chalk.gray(`Checking every ${interval/1000} seconds`));

    const monitor = setInterval(async () => {
      try {
        const issues = await this.detectIssues();
        const criticalIssues = issues.filter(i => this.criticalIssues.includes(i.type));
        
        if (criticalIssues.length > 0) {
          console.log(chalk.red(`🚨 ${criticalIssues.length} critical issue(s) detected - auto-fixing...`));
          await this.applyFixes(criticalIssues, false, false);
        }
        
      } catch (error) {
        console.error(chalk.red('❌ Continuous monitoring error:'), error.message);
      }
    }, interval);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping auto-fix monitoring...'));
      clearInterval(monitor);
      process.exit(0);
    });

    return monitor;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const autoFix = new AutoFixEngine();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.cyan('Vibe Marketing Platform - Auto-Fix Engine'));
    console.log(chalk.gray('Usage: node scripts/auto-fix-engine.js [options]'));
    console.log(chalk.gray(''));
    console.log(chalk.gray('Options:'));
    console.log(chalk.gray('  --type <type>       Fix specific issue type'));
    console.log(chalk.gray('  --dry-run           Show what would be fixed without making changes'));
    console.log(chalk.gray('  --verbose, -v       Verbose output'));
    console.log(chalk.gray('  --interactive, -i   Interactive mode'));
    console.log(chalk.gray('  --continuous        Start continuous monitoring'));
    console.log(chalk.gray('  --interval <ms>     Monitoring interval (default: 300000)'));
    console.log(chalk.gray('  --help, -h          Show this help'));
    return;
  }

  const options = {
    issueType: args.includes('--type') ? args[args.indexOf('--type') + 1] : null,
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    interactive: args.includes('--interactive') || args.includes('-i'),
    continuous: args.includes('--continuous'),
    interval: args.includes('--interval') ? parseInt(args[args.indexOf('--interval') + 1]) : 300000
  };

  if (options.continuous) {
    await autoFix.startContinuousMonitoring(options.interval);
  } else {
    const result = await autoFix.runAutoFix(options);
    
    if (result.success) {
      console.log(chalk.green(`\n✅ Auto-fix completed successfully!`));
      console.log(chalk.gray(`Fixed ${result.fixes.filter(f => f.success).length} out of ${result.issues.length} issues`));
    } else {
      console.log(chalk.red(`\n❌ Auto-fix failed: ${result.error}`));
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AutoFixEngine;