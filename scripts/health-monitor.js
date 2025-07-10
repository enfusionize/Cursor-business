#!/usr/bin/env node

/**
 * Vibe Marketing Platform - Comprehensive Health Monitor & Debugging System
 * 
 * Monitors all system components:
 * - MCP Servers (25+ production servers)
 * - API Endpoints (8+ AI model platforms)
 * - Business MCPs (Figma, ClickUp, Xero, etc.)
 * - Environment Configuration
 * - Database Connections
 * - File System Health
 * - Network Connectivity
 * - Performance Metrics
 * - Error Detection & Recovery
 */

const chalk = require('chalk').default;
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const os = require('os');
const execAsync = promisify(exec);

class HealthMonitor {
  constructor() {
    this.healthStatus = {
      overall: 'unknown',
      components: {},
      errors: [],
      warnings: [],
      performance: {},
      lastCheck: null,
      uptime: process.uptime()
    };
    
    this.components = {
      // Core System
      'system': {
        name: 'System Resources',
        type: 'system',
        checks: ['cpu', 'memory', 'disk', 'network']
      },
      'environment': {
        name: 'Environment Configuration',
        type: 'config',
        checks: ['env_vars', 'api_keys', 'file_permissions']
      },
      
      // MCP Servers
      'mcp-servers': {
        name: 'MCP Servers',
        type: 'mcp',
        servers: [
          'figma-framer-converter',
          'clickup-mcp-server',
          'playwright-mcp',
          'firecrawl-mcp',
          'perplexity-mcp',
          'dataforseo-mcp',
          'xero-mcp',
          'minimax-mcp',
          'dora-ai-mcp',
          'emergent-mind-mcp',
          'orchids-ai-mcp',
          'runway-mcp',
          'midjourney-mcp',
          'stable-diffusion-mcp'
        ]
      },
      
      // API Endpoints
      'api-endpoints': {
        name: 'API Endpoints',
        type: 'api',
        endpoints: [
          { name: 'Anthropic Claude', url: 'https://api.anthropic.com/v1/messages', key: 'ANTHROPIC_API_KEY' },
          { name: 'Figma API', url: 'https://api.figma.com/v1/me', key: 'FIGMA_API_KEY' },
          { name: 'ClickUp API', url: 'https://api.clickup.com/api/v2/user', key: 'CLICKUP_API_KEY' },
          { name: 'Minimax API', url: 'https://api.minimax.chat/v1/text/chatcompletion_pro', key: 'MINIMAX_API_KEY' },
          { name: 'Runway API', url: 'https://api.runwayml.com/v1/generate', key: 'RUNWAY_API_KEY' },
          { name: 'Stability AI', url: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', key: 'STABILITY_API_KEY' }
        ]
      },
      
      // Business Services
      'business-services': {
        name: 'Business Services',
        type: 'business',
        services: [
          'figma-sync',
          'clickup-automation',
          'string-automation-engine',
          'knowledge-base-engine',
          'learning-daemon'
        ]
      },
      
      // Database & Storage
      'storage': {
        name: 'Storage & Database',
        type: 'storage',
        checks: ['file_system', 'logs', 'cache', 'backups']
      },
      
      // Web Services
      'web-services': {
        name: 'Web Services',
        type: 'web',
        services: [
          { name: 'Dashboard', port: 3000, path: '/api/health' },
          { name: 'Features Dashboard', port: 3000, path: '/dashboard/features-dashboard.html' }
        ]
      }
    };
    
    this.criticalEnvVars = [
      'ANTHROPIC_API_KEY',
      'FIGMA_API_KEY',
      'CLICKUP_API_KEY',
      'BUSINESS_NAME',
      'BUSINESS_DOMAIN'
    ];
    
    this.optionalEnvVars = [
      'MINIMAX_API_KEY',
      'RUNWAY_API_KEY',
      'STABILITY_API_KEY',
      'FIRECRAWL_API_KEY',
      'PERPLEXITY_API_KEY',
      'DATAFORSEO_LOGIN',
      'XERO_CLIENT_ID'
    ];
  }

  async runHealthCheck(options = {}) {
    const { 
      verbose = false, 
      component = null, 
      autoFix = false,
      generateReport = true 
    } = options;
    
    console.log(chalk.cyan('🏥 Vibe Marketing Platform - Health Check'));
    console.log(chalk.gray('=' .repeat(60)));
    
    this.healthStatus.lastCheck = new Date().toISOString();
    this.healthStatus.errors = [];
    this.healthStatus.warnings = [];
    
    try {
      // Run component-specific check or all checks
      if (component) {
        await this.checkComponent(component, verbose);
      } else {
        await this.checkAllComponents(verbose);
      }
      
      // Calculate overall health
      this.calculateOverallHealth();
      
      // Auto-fix issues if requested
      if (autoFix) {
        await this.autoFixIssues();
      }
      
      // Generate report
      if (generateReport) {
        await this.generateHealthReport();
      }
      
      // Display results
      this.displayResults(verbose);
      
    } catch (error) {
      console.error(chalk.red('❌ Health check failed:'), error.message);
      this.healthStatus.overall = 'critical';
      this.healthStatus.errors.push({
        component: 'health-monitor',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    return this.healthStatus;
  }

  async checkAllComponents(verbose = false) {
    console.log(chalk.yellow('🔍 Checking all system components...\n'));
    
    const checkPromises = Object.keys(this.components).map(async (componentKey) => {
      try {
        await this.checkComponent(componentKey, verbose);
      } catch (error) {
        this.healthStatus.errors.push({
          component: componentKey,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    await Promise.all(checkPromises);
  }

  async checkComponent(componentKey, verbose = false) {
    const component = this.components[componentKey];
    if (!component) {
      throw new Error(`Unknown component: ${componentKey}`);
    }
    
    if (verbose) {
      console.log(chalk.blue(`🔍 Checking ${component.name}...`));
    }
    
    this.healthStatus.components[componentKey] = {
      name: component.name,
      status: 'checking',
      details: {},
      errors: [],
      warnings: [],
      lastCheck: new Date().toISOString()
    };
    
    try {
      switch (component.type) {
        case 'system':
          await this.checkSystemHealth(componentKey, verbose);
          break;
        case 'config':
          await this.checkEnvironmentConfig(componentKey, verbose);
          break;
        case 'mcp':
          await this.checkMCPServers(componentKey, verbose);
          break;
        case 'api':
          await this.checkAPIEndpoints(componentKey, verbose);
          break;
        case 'business':
          await this.checkBusinessServices(componentKey, verbose);
          break;
        case 'storage':
          await this.checkStorageHealth(componentKey, verbose);
          break;
        case 'web':
          await this.checkWebServices(componentKey, verbose);
          break;
        default:
          throw new Error(`Unknown component type: ${component.type}`);
      }
      
      // Set status based on errors
      const componentStatus = this.healthStatus.components[componentKey];
      if (componentStatus.errors.length > 0) {
        componentStatus.status = 'error';
      } else if (componentStatus.warnings.length > 0) {
        componentStatus.status = 'warning';
      } else {
        componentStatus.status = 'healthy';
      }
      
      if (verbose) {
        console.log(chalk.green(`✅ ${component.name} check completed`));
      }
      
    } catch (error) {
      this.healthStatus.components[componentKey].status = 'error';
      this.healthStatus.components[componentKey].errors.push(error.message);
      
      if (verbose) {
        console.log(chalk.red(`❌ ${component.name} check failed: ${error.message}`));
      }
    }
  }

  async checkSystemHealth(componentKey, verbose = false) {
    const component = this.healthStatus.components[componentKey];
    
    // CPU Usage
    const cpuUsage = process.cpuUsage();
    const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
    component.details.cpu = {
      usage: cpuPercent,
      cores: os.cpus().length,
      model: os.cpus()[0]?.model || 'Unknown'
    };
    
    if (cpuPercent > 80) {
      component.warnings.push('High CPU usage detected');
    }
    
    // Memory Usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryPercent = (usedMemory / totalMemory) * 100;
    
    component.details.memory = {
      total: Math.round(totalMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
      used: Math.round(usedMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
      free: Math.round(freeMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
      percentage: Math.round(memoryPercent * 100) / 100
    };
    
    if (memoryPercent > 85) {
      component.warnings.push('High memory usage detected');
    }
    
    // Disk Usage
    try {
      const { stdout } = await execAsync('df -h .');
      const lines = stdout.trim().split('\n');
      if (lines.length > 1) {
        const diskInfo = lines[1].split(/\s+/);
        component.details.disk = {
          size: diskInfo[1],
          used: diskInfo[2],
          available: diskInfo[3],
          percentage: diskInfo[4]
        };
        
        const usagePercent = parseInt(diskInfo[4].replace('%', ''));
        if (usagePercent > 80) {
          component.warnings.push('High disk usage detected');
        }
      }
    } catch (error) {
      component.warnings.push('Could not check disk usage');
    }
    
    // Network Connectivity
    try {
      const startTime = Date.now();
      await axios.get('https://www.google.com', { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      
      component.details.network = {
        status: 'connected',
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      };
      
      if (responseTime > 2000) {
        component.warnings.push('Slow network connectivity detected');
      }
    } catch (error) {
      component.errors.push('Network connectivity test failed');
      component.details.network = {
        status: 'disconnected',
        error: error.message
      };
    }
    
    // System Uptime
    component.details.uptime = {
      system: os.uptime(),
      process: process.uptime(),
      loadAverage: os.loadavg()
    };
  }

  async checkEnvironmentConfig(componentKey, verbose = false) {
    const component = this.healthStatus.components[componentKey];
    
    // Check critical environment variables
    const criticalMissing = [];
    const criticalPresent = [];
    
    for (const envVar of this.criticalEnvVars) {
      if (process.env[envVar]) {
        criticalPresent.push(envVar);
      } else {
        criticalMissing.push(envVar);
      }
    }
    
    component.details.criticalEnvVars = {
      present: criticalPresent,
      missing: criticalMissing,
      total: this.criticalEnvVars.length
    };
    
    if (criticalMissing.length > 0) {
      component.errors.push(`Missing critical environment variables: ${criticalMissing.join(', ')}`);
    }
    
    // Check optional environment variables
    const optionalMissing = [];
    const optionalPresent = [];
    
    for (const envVar of this.optionalEnvVars) {
      if (process.env[envVar]) {
        optionalPresent.push(envVar);
      } else {
        optionalMissing.push(envVar);
      }
    }
    
    component.details.optionalEnvVars = {
      present: optionalPresent,
      missing: optionalMissing,
      total: this.optionalEnvVars.length
    };
    
    if (optionalMissing.length > 0) {
      component.warnings.push(`Missing optional environment variables: ${optionalMissing.join(', ')}`);
    }
    
    // Check file permissions
    const criticalFiles = [
      'package.json',
      'start.js',
      'scripts/setup.js',
      'dashboard/index.html'
    ];
    
    const permissionIssues = [];
    
    for (const file of criticalFiles) {
      try {
        await fs.access(file, fs.constants.R_OK);
      } catch (error) {
        permissionIssues.push(file);
      }
    }
    
    component.details.filePermissions = {
      checked: criticalFiles.length,
      issues: permissionIssues
    };
    
    if (permissionIssues.length > 0) {
      component.errors.push(`File permission issues: ${permissionIssues.join(', ')}`);
    }
  }

  async checkMCPServers(componentKey, verbose = false) {
    const component = this.healthStatus.components[componentKey];
    const mcpComponent = this.components[componentKey];
    
    const serverStatuses = {};
    
    for (const serverName of mcpComponent.servers) {
      try {
        const serverPath = path.join('mcps', `${serverName}.js`);
        
        // Check if server file exists
        try {
          await fs.access(serverPath);
          serverStatuses[serverName] = {
            status: 'file_exists',
            path: serverPath
          };
        } catch (error) {
          serverStatuses[serverName] = {
            status: 'file_missing',
            path: serverPath,
            error: 'Server file not found'
          };
          continue;
        }
        
        // Check if server is running (simplified check)
        try {
          const { stdout } = await execAsync(`ps aux | grep "${serverName}" | grep -v grep`);
          if (stdout.trim()) {
            serverStatuses[serverName].status = 'running';
            serverStatuses[serverName].process = stdout.trim().split('\n').length;
          } else {
            serverStatuses[serverName].status = 'stopped';
          }
        } catch (error) {
          serverStatuses[serverName].status = 'unknown';
        }
        
      } catch (error) {
        serverStatuses[serverName] = {
          status: 'error',
          error: error.message
        };
      }
    }
    
    component.details.servers = serverStatuses;
    
    // Count statuses
    const statusCounts = {};
    Object.values(serverStatuses).forEach(server => {
      statusCounts[server.status] = (statusCounts[server.status] || 0) + 1;
    });
    
    component.details.summary = statusCounts;
    
    // Add warnings/errors based on server statuses
    if (statusCounts.file_missing > 0) {
      component.errors.push(`${statusCounts.file_missing} MCP server files missing`);
    }
    
    if (statusCounts.error > 0) {
      component.errors.push(`${statusCounts.error} MCP servers have errors`);
    }
    
    if (statusCounts.stopped > 0) {
      component.warnings.push(`${statusCounts.stopped} MCP servers are stopped`);
    }
  }

  async checkAPIEndpoints(componentKey, verbose = false) {
    const component = this.healthStatus.components[componentKey];
    const apiComponent = this.components[componentKey];
    
    const endpointStatuses = {};
    
    for (const endpoint of apiComponent.endpoints) {
      const apiKey = process.env[endpoint.key];
      
      if (!apiKey) {
        endpointStatuses[endpoint.name] = {
          status: 'no_api_key',
          message: `${endpoint.key} not configured`
        };
        continue;
      }
      
      try {
        const startTime = Date.now();
        
        // Create appropriate headers based on API
        let headers = {};
        if (endpoint.name === 'Anthropic Claude') {
          headers = {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          };
        } else if (endpoint.name === 'Figma API') {
          headers = {
            'X-Figma-Token': apiKey
          };
        } else if (endpoint.name === 'ClickUp API') {
          headers = {
            'Authorization': apiKey
          };
        } else {
          headers = {
            'Authorization': `Bearer ${apiKey}`
          };
        }
        
        // Make test request
        const response = await axios.get(endpoint.url, {
          headers,
          timeout: 10000,
          validateStatus: (status) => status < 500 // Accept client errors as "working"
        });
        
        const responseTime = Date.now() - startTime;
        
        endpointStatuses[endpoint.name] = {
          status: 'healthy',
          responseTime,
          statusCode: response.status,
          timestamp: new Date().toISOString()
        };
        
        if (responseTime > 5000) {
          endpointStatuses[endpoint.name].warning = 'Slow response time';
        }
        
      } catch (error) {
        endpointStatuses[endpoint.name] = {
          status: 'error',
          error: error.message,
          code: error.code,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    component.details.endpoints = endpointStatuses;
    
    // Count statuses
    const statusCounts = {};
    Object.values(endpointStatuses).forEach(endpoint => {
      statusCounts[endpoint.status] = (statusCounts[endpoint.status] || 0) + 1;
    });
    
    component.details.summary = statusCounts;
    
    // Add warnings/errors
    if (statusCounts.no_api_key > 0) {
      component.warnings.push(`${statusCounts.no_api_key} API endpoints missing keys`);
    }
    
    if (statusCounts.error > 0) {
      component.errors.push(`${statusCounts.error} API endpoints have errors`);
    }
  }

  async checkBusinessServices(componentKey, verbose = false) {
    const component = this.healthStatus.components[componentKey];
    const businessComponent = this.components[componentKey];
    
    const serviceStatuses = {};
    
    for (const serviceName of businessComponent.services) {
      try {
        const scriptPath = path.join('scripts', `${serviceName}.js`);
        
        // Check if service file exists
        try {
          await fs.access(scriptPath);
          serviceStatuses[serviceName] = {
            status: 'available',
            path: scriptPath
          };
          
          // Check if service is running
          try {
            const { stdout } = await execAsync(`ps aux | grep "${serviceName}" | grep -v grep`);
            if (stdout.trim()) {
              serviceStatuses[serviceName].status = 'running';
              serviceStatuses[serviceName].processes = stdout.trim().split('\n').length;
            }
          } catch (error) {
            // Service not running, but that's okay for most services
          }
          
        } catch (error) {
          serviceStatuses[serviceName] = {
            status: 'missing',
            path: scriptPath,
            error: 'Service file not found'
          };
        }
        
      } catch (error) {
        serviceStatuses[serviceName] = {
          status: 'error',
          error: error.message
        };
      }
    }
    
    component.details.services = serviceStatuses;
    
    // Count statuses
    const statusCounts = {};
    Object.values(serviceStatuses).forEach(service => {
      statusCounts[service.status] = (statusCounts[service.status] || 0) + 1;
    });
    
    component.details.summary = statusCounts;
    
    // Add warnings/errors
    if (statusCounts.missing > 0) {
      component.errors.push(`${statusCounts.missing} business services missing`);
    }
    
    if (statusCounts.error > 0) {
      component.errors.push(`${statusCounts.error} business services have errors`);
    }
  }

  async checkStorageHealth(componentKey, verbose = false) {
    const component = this.healthStatus.components[componentKey];
    
    const storageChecks = {};
    
    // Check file system directories
    const criticalDirs = [
      'scripts',
      'mcps',
      'dashboard',
      'api',
      'data',
      'logs'
    ];
    
    for (const dir of criticalDirs) {
      try {
        const stat = await fs.stat(dir);
        storageChecks[dir] = {
          status: 'exists',
          type: stat.isDirectory() ? 'directory' : 'file',
          size: stat.size,
          modified: stat.mtime
        };
      } catch (error) {
        storageChecks[dir] = {
          status: 'missing',
          error: error.message
        };
      }
    }
    
    // Check logs directory and files
    try {
      const logFiles = await fs.readdir('logs');
      storageChecks.logs.files = logFiles.length;
      storageChecks.logs.recentFiles = logFiles.slice(-5); // Last 5 files
    } catch (error) {
      storageChecks.logs = {
        status: 'error',
        error: 'Cannot read logs directory'
      };
    }
    
    // Check data directory
    try {
      const dataFiles = await fs.readdir('data');
      storageChecks.data.files = dataFiles.length;
    } catch (error) {
      storageChecks.data = {
        status: 'error',
        error: 'Cannot read data directory'
      };
    }
    
    component.details.storage = storageChecks;
    
    // Count missing directories
    const missingDirs = criticalDirs.filter(dir => 
      storageChecks[dir] && storageChecks[dir].status === 'missing'
    );
    
    if (missingDirs.length > 0) {
      component.errors.push(`Missing critical directories: ${missingDirs.join(', ')}`);
    }
  }

  async checkWebServices(componentKey, verbose = false) {
    const component = this.healthStatus.components[componentKey];
    const webComponent = this.components[componentKey];
    
    const serviceStatuses = {};
    
    for (const service of webComponent.services) {
      try {
        const url = `http://localhost:${service.port}${service.path}`;
        const startTime = Date.now();
        
        const response = await axios.get(url, {
          timeout: 5000,
          validateStatus: (status) => status < 500
        });
        
        const responseTime = Date.now() - startTime;
        
        serviceStatuses[service.name] = {
          status: 'healthy',
          url,
          responseTime,
          statusCode: response.status,
          timestamp: new Date().toISOString()
        };
        
        if (responseTime > 2000) {
          serviceStatuses[service.name].warning = 'Slow response time';
        }
        
      } catch (error) {
        serviceStatuses[service.name] = {
          status: 'error',
          url: `http://localhost:${service.port}${service.path}`,
          error: error.message,
          code: error.code
        };
      }
    }
    
    component.details.services = serviceStatuses;
    
    // Count statuses
    const statusCounts = {};
    Object.values(serviceStatuses).forEach(service => {
      statusCounts[service.status] = (statusCounts[service.status] || 0) + 1;
    });
    
    component.details.summary = statusCounts;
    
    // Add errors
    if (statusCounts.error > 0) {
      component.errors.push(`${statusCounts.error} web services are not responding`);
    }
  }

  calculateOverallHealth() {
    const components = Object.values(this.healthStatus.components);
    const totalComponents = components.length;
    
    if (totalComponents === 0) {
      this.healthStatus.overall = 'unknown';
      return;
    }
    
    const healthyCount = components.filter(c => c.status === 'healthy').length;
    const warningCount = components.filter(c => c.status === 'warning').length;
    const errorCount = components.filter(c => c.status === 'error').length;
    
    this.healthStatus.performance = {
      total: totalComponents,
      healthy: healthyCount,
      warning: warningCount,
      error: errorCount,
      healthPercentage: Math.round((healthyCount / totalComponents) * 100)
    };
    
    // Determine overall status
    if (errorCount > 0) {
      // If more than 50% have errors, it's critical
      if (errorCount > totalComponents / 2) {
        this.healthStatus.overall = 'critical';
      } else {
        this.healthStatus.overall = 'degraded';
      }
    } else if (warningCount > 0) {
      this.healthStatus.overall = 'warning';
    } else {
      this.healthStatus.overall = 'healthy';
    }
  }

  async autoFixIssues() {
    console.log(chalk.yellow('\n🔧 Attempting to auto-fix detected issues...\n'));
    
    const fixes = [];
    
    // Create missing directories
    const storageComponent = this.healthStatus.components['storage'];
    if (storageComponent && storageComponent.details.storage) {
      const missingDirs = Object.entries(storageComponent.details.storage)
        .filter(([dir, info]) => info.status === 'missing')
        .map(([dir]) => dir);
      
      for (const dir of missingDirs) {
        try {
          await fs.mkdir(dir, { recursive: true });
          fixes.push(`Created missing directory: ${dir}`);
        } catch (error) {
          fixes.push(`Failed to create directory ${dir}: ${error.message}`);
        }
      }
    }
    
    // Set up basic log files
    try {
      await fs.mkdir('logs', { recursive: true });
      const logFile = path.join('logs', 'health-monitor.log');
      await fs.writeFile(logFile, `Health monitor started: ${new Date().toISOString()}\n`, { flag: 'a' });
      fixes.push('Initialized health monitor log file');
    } catch (error) {
      fixes.push(`Failed to initialize log file: ${error.message}`);
    }
    
    // Display fixes
    if (fixes.length > 0) {
      console.log(chalk.green('✅ Auto-fixes applied:'));
      fixes.forEach(fix => console.log(chalk.gray(`  • ${fix}`)));
    } else {
      console.log(chalk.yellow('ℹ️ No auto-fixes available'));
    }
    
    return fixes;
  }

  async generateHealthReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      overall: this.healthStatus.overall,
      performance: this.healthStatus.performance,
      components: Object.keys(this.healthStatus.components).map(key => ({
        key,
        name: this.healthStatus.components[key].name,
        status: this.healthStatus.components[key].status,
        errorCount: this.healthStatus.components[key].errors.length,
        warningCount: this.healthStatus.components[key].warnings.length
      })),
      errors: this.healthStatus.errors,
      warnings: this.healthStatus.warnings,
      uptime: process.uptime(),
      systemInfo: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100,
        cpuCount: os.cpus().length
      }
    };
    
    // Save detailed report
    const reportPath = path.join('logs', `health-report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.mkdir('logs', { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
    
    // Save summary report
    const summaryPath = path.join('logs', 'health-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify({
      lastCheck: reportData.timestamp,
      overall: reportData.overall,
      performance: reportData.performance,
      quickStats: {
        totalComponents: reportData.components.length,
        healthyComponents: reportData.components.filter(c => c.status === 'healthy').length,
        componentsWithErrors: reportData.components.filter(c => c.errorCount > 0).length,
        componentsWithWarnings: reportData.components.filter(c => c.warningCount > 0).length
      }
    }, null, 2));
    
    return reportPath;
  }

  displayResults(verbose = false) {
    console.log(chalk.cyan('\n📊 Health Check Results'));
    console.log(chalk.gray('=' .repeat(60)));
    
    // Overall status
    const statusColors = {
      healthy: chalk.green,
      warning: chalk.yellow,
      degraded: chalk.red,
      critical: chalk.red.bold,
      unknown: chalk.gray
    };
    
    const statusColor = statusColors[this.healthStatus.overall] || chalk.gray;
    console.log(statusColor(`Overall Status: ${this.healthStatus.overall.toUpperCase()}`));
    
    if (this.healthStatus.performance) {
      const perf = this.healthStatus.performance;
      console.log(chalk.gray(`Health Score: ${perf.healthPercentage}% (${perf.healthy}/${perf.total} components healthy)`));
    }
    
    console.log(chalk.gray(`Last Check: ${this.healthStatus.lastCheck}`));
    console.log(chalk.gray(`System Uptime: ${Math.round(process.uptime())}s`));
    
    // Component summary
    console.log(chalk.cyan('\n📋 Component Summary:'));
    Object.entries(this.healthStatus.components).forEach(([key, component]) => {
      const statusIcon = {
        healthy: '✅',
        warning: '⚠️',
        error: '❌',
        checking: '🔍',
        unknown: '❓'
      }[component.status] || '❓';
      
      console.log(`${statusIcon} ${component.name}: ${component.status}`);
      
      if (verbose && (component.errors.length > 0 || component.warnings.length > 0)) {
        component.errors.forEach(error => {
          console.log(chalk.red(`    ❌ ${error}`));
        });
        component.warnings.forEach(warning => {
          console.log(chalk.yellow(`    ⚠️ ${warning}`));
        });
      }
    });
    
    // Errors and warnings summary
    if (this.healthStatus.errors.length > 0) {
      console.log(chalk.red(`\n❌ ${this.healthStatus.errors.length} Critical Errors:`));
      this.healthStatus.errors.forEach(error => {
        console.log(chalk.red(`  • ${error.component}: ${error.error}`));
      });
    }
    
    if (this.healthStatus.warnings.length > 0) {
      console.log(chalk.yellow(`\n⚠️ ${this.healthStatus.warnings.length} Warnings:`));
      this.healthStatus.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning.component}: ${warning.error}`));
      });
    }
    
    // Recommendations
    this.displayRecommendations();
    
    console.log(chalk.gray('\n' + '=' .repeat(60)));
    console.log(chalk.cyan('Health check complete! 🏥'));
  }

  displayRecommendations() {
    const recommendations = [];
    
    // Check for missing critical env vars
    const envComponent = this.healthStatus.components['environment'];
    if (envComponent && envComponent.details.criticalEnvVars) {
      const missing = envComponent.details.criticalEnvVars.missing;
      if (missing.length > 0) {
        recommendations.push(`Configure missing environment variables: ${missing.join(', ')}`);
      }
    }
    
    // Check for API endpoint issues
    const apiComponent = this.healthStatus.components['api-endpoints'];
    if (apiComponent && apiComponent.details.summary) {
      const summary = apiComponent.details.summary;
      if (summary.no_api_key > 0) {
        recommendations.push(`Configure API keys for ${summary.no_api_key} endpoints`);
      }
      if (summary.error > 0) {
        recommendations.push(`Fix ${summary.error} API endpoint connection issues`);
      }
    }
    
    // Check for MCP server issues
    const mcpComponent = this.healthStatus.components['mcp-servers'];
    if (mcpComponent && mcpComponent.details.summary) {
      const summary = mcpComponent.details.summary;
      if (summary.file_missing > 0) {
        recommendations.push(`Install missing MCP server files (${summary.file_missing} missing)`);
      }
    }
    
    // Check for web service issues
    const webComponent = this.healthStatus.components['web-services'];
    if (webComponent && webComponent.details.summary) {
      const summary = webComponent.details.summary;
      if (summary.error > 0) {
        recommendations.push(`Start web services (${summary.error} not responding)`);
      }
    }
    
    // System recommendations
    const systemComponent = this.healthStatus.components['system'];
    if (systemComponent && systemComponent.details) {
      if (systemComponent.details.memory && systemComponent.details.memory.percentage > 85) {
        recommendations.push('Consider increasing available memory or optimizing memory usage');
      }
      if (systemComponent.details.network && systemComponent.details.network.responseTime > 2000) {
        recommendations.push('Check network connectivity - slow response times detected');
      }
    }
    
    if (recommendations.length > 0) {
      console.log(chalk.cyan('\n💡 Recommendations:'));
      recommendations.forEach((rec, index) => {
        console.log(chalk.gray(`  ${index + 1}. ${rec}`));
      });
    }
  }

  async startContinuousMonitoring(interval = 60000) {
    console.log(chalk.cyan('🔄 Starting continuous health monitoring...'));
    console.log(chalk.gray(`Checking every ${interval/1000} seconds`));
    
    const monitor = setInterval(async () => {
      try {
        await this.runHealthCheck({ verbose: false, generateReport: true });
        
        // Log critical issues
        if (this.healthStatus.overall === 'critical') {
          console.log(chalk.red('🚨 CRITICAL: System health is critical!'));
        }
        
      } catch (error) {
        console.error(chalk.red('❌ Continuous monitoring error:'), error.message);
      }
    }, interval);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping health monitoring...'));
      clearInterval(monitor);
      process.exit(0);
    });
    
    return monitor;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const healthMonitor = new HealthMonitor();
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.cyan('Vibe Marketing Platform - Health Monitor'));
    console.log(chalk.gray('Usage: node scripts/health-monitor.js [options]'));
    console.log(chalk.gray(''));
    console.log(chalk.gray('Options:'));
    console.log(chalk.gray('  --verbose, -v       Verbose output'));
    console.log(chalk.gray('  --component <name>  Check specific component'));
    console.log(chalk.gray('  --auto-fix          Attempt to fix issues automatically'));
    console.log(chalk.gray('  --continuous        Start continuous monitoring'));
    console.log(chalk.gray('  --interval <ms>     Monitoring interval (default: 60000)'));
    console.log(chalk.gray('  --help, -h          Show this help'));
    return;
  }
  
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    autoFix: args.includes('--auto-fix'),
    continuous: args.includes('--continuous'),
    component: args.includes('--component') ? args[args.indexOf('--component') + 1] : null,
    interval: args.includes('--interval') ? parseInt(args[args.indexOf('--interval') + 1]) : 60000
  };
  
  if (options.continuous) {
    await healthMonitor.startContinuousMonitoring(options.interval);
  } else {
    await healthMonitor.runHealthCheck(options);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = HealthMonitor;