#!/usr/bin/env node

/**
 * Enhanced Error Handling System
 * Comprehensive error management with retry mechanisms, structured logging,
 * and graceful degradation for the Vibe Marketing Automation Platform
 */

const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');
const { EventEmitter } = require('events');

class EnhancedErrorHandler extends EventEmitter {
    constructor() {
        super();
        this.setupLogger();
        this.setupErrorTracking();
        this.setupRetryMechanisms();
    }

    setupLogger() {
        // Create logs directory
        const logsDir = path.join(__dirname, '../logs');
        fs.ensureDirSync(logsDir);

        // Configure Winston logger
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: { service: 'vibe-marketing-platform' },
            transports: [
                new winston.transports.File({ 
                    filename: path.join(logsDir, 'error.log'), 
                    level: 'error',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                }),
                new winston.transports.File({ 
                    filename: path.join(logsDir, 'combined.log'),
                    maxsize: 5242880, // 5MB
                    maxFiles: 5
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        });

        // Add uncaught exception handling
        this.logger.exceptions.handle(
            new winston.transports.File({ 
                filename: path.join(logsDir, 'exceptions.log') 
            })
        );

        // Add unhandled rejection handling
        this.logger.rejections.handle(
            new winston.transports.File({ 
                filename: path.join(logsDir, 'rejections.log') 
            })
        );
    }

    setupErrorTracking() {
        this.errorStats = {
            totalErrors: 0,
            errorsByType: {},
            errorsByService: {},
            recentErrors: [],
            maxRecentErrors: 100
        };

        // Track errors by type and service
        this.on('error', (error) => {
            this.errorStats.totalErrors++;
            
            // Track by type
            const errorType = error.type || 'unknown';
            this.errorStats.errorsByType[errorType] = (this.errorStats.errorsByType[errorType] || 0) + 1;
            
            // Track by service
            const service = error.service || 'unknown';
            this.errorStats.errorsByService[service] = (this.errorStats.errorsByService[service] || 0) + 1;
            
            // Add to recent errors
            this.errorStats.recentErrors.unshift({
                timestamp: new Date().toISOString(),
                message: error.message,
                type: errorType,
                service: service,
                stack: error.stack
            });

            // Keep only recent errors
            if (this.errorStats.recentErrors.length > this.errorStats.maxRecentErrors) {
                this.errorStats.recentErrors.pop();
            }
        });
    }

    setupRetryMechanisms() {
        this.retryConfig = {
            maxAttempts: 5,
            baseDelay: 1000,
            maxDelay: 30000,
            backoffFactor: 2,
            jitter: true
        };
    }

    // Enhanced retry mechanism with exponential backoff
    async retryWithBackoff(fn, options = {}) {
        const config = { ...this.retryConfig, ...options };
        let lastError;
        
        for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
            try {
                const result = await fn();
                
                // Log successful retry if not first attempt
                if (attempt > 1) {
                    this.logger.info({
                        event: 'retry_success',
                        attempt,
                        function: fn.name || 'anonymous'
                    });
                }
                
                return result;
            } catch (error) {
                lastError = error;
                
                this.logger.warn({
                    event: 'retry_attempt',
                    attempt,
                    maxAttempts: config.maxAttempts,
                    error: error.message,
                    function: fn.name || 'anonymous'
                });

                // Don't retry on final attempt
                if (attempt === config.maxAttempts) {
                    break;
                }

                // Calculate delay with exponential backoff
                let delay = Math.min(
                    config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
                    config.maxDelay
                );

                // Add jitter to prevent thundering herd
                if (config.jitter) {
                    delay = delay * (0.5 + Math.random() * 0.5);
                }

                await this.sleep(delay);
            }
        }

        // All attempts failed
        const finalError = new Error(`Operation failed after ${config.maxAttempts} attempts: ${lastError.message}`);
        finalError.originalError = lastError;
        finalError.attempts = config.maxAttempts;
        
        this.handleError(finalError, { 
            type: 'retry_exhausted',
            service: options.service || 'unknown'
        });
        
        throw finalError;
    }

    // Sleep utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Main error handling method
    handleError(error, context = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack,
            type: context.type || error.name || 'Error',
            service: context.service || 'unknown',
            severity: context.severity || this.determineSeverity(error),
            ...context
        };

        // Log the error
        this.logger.error(errorInfo);

        // Emit error event for tracking
        this.emit('error', errorInfo);

        // Handle critical errors
        if (errorInfo.severity === 'critical') {
            this.handleCriticalError(errorInfo);
        }

        return errorInfo;
    }

    // Determine error severity
    determineSeverity(error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return 'high';
        }
        if (error.status >= 500) {
            return 'high';
        }
        if (error.status >= 400) {
            return 'medium';
        }
        if (error.name === 'ValidationError') {
            return 'low';
        }
        return 'medium';
    }

    // Handle critical errors
    handleCriticalError(errorInfo) {
        this.logger.error({
            event: 'critical_error',
            ...errorInfo
        });

        // Could trigger alerts, notifications, etc.
        this.emit('critical_error', errorInfo);
    }

    // Wrapper for API calls with error handling
    async apiCall(fn, options = {}) {
        const service = options.service || 'api';
        
        return this.retryWithBackoff(async () => {
            try {
                return await fn();
            } catch (error) {
                // Add API-specific error handling
                if (error.response) {
                    // HTTP error
                    const apiError = new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
                    apiError.status = error.response.status;
                    apiError.response = error.response;
                    throw apiError;
                } else if (error.request) {
                    // Network error
                    const networkError = new Error('Network Error: No response received');
                    networkError.code = 'NETWORK_ERROR';
                    throw networkError;
                } else {
                    // Other error
                    throw error;
                }
            }
        }, { service, ...options });
    }

    // Database operation wrapper
    async dbOperation(fn, options = {}) {
        return this.retryWithBackoff(async () => {
            try {
                return await fn();
            } catch (error) {
                // Add database-specific error handling
                if (error.code === 'ECONNREFUSED') {
                    const dbError = new Error('Database connection refused');
                    dbError.code = 'DB_CONNECTION_ERROR';
                    throw dbError;
                }
                throw error;
            }
        }, { service: 'database', ...options });
    }

    // File operation wrapper
    async fileOperation(fn, options = {}) {
        return this.retryWithBackoff(async () => {
            try {
                return await fn();
            } catch (error) {
                // Add file-specific error handling
                if (error.code === 'ENOENT') {
                    const fileError = new Error('File not found');
                    fileError.code = 'FILE_NOT_FOUND';
                    throw fileError;
                } else if (error.code === 'EACCES') {
                    const permError = new Error('Permission denied');
                    permError.code = 'PERMISSION_DENIED';
                    throw permError;
                }
                throw error;
            }
        }, { service: 'filesystem', maxAttempts: 3, ...options });
    }

    // MCP operation wrapper
    async mcpOperation(fn, mcpName, options = {}) {
        return this.retryWithBackoff(async () => {
            try {
                return await fn();
            } catch (error) {
                // Add MCP-specific error handling
                const mcpError = new Error(`MCP ${mcpName} Error: ${error.message}`);
                mcpError.mcpName = mcpName;
                mcpError.originalError = error;
                throw mcpError;
            }
        }, { service: `mcp-${mcpName}`, ...options });
    }

    // Circuit breaker pattern
    createCircuitBreaker(fn, options = {}) {
        const config = {
            failureThreshold: 5,
            resetTimeout: 60000,
            monitoringPeriod: 10000,
            ...options
        };

        let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        let failures = 0;
        let lastFailureTime = null;
        let successes = 0;

        return async (...args) => {
            if (state === 'OPEN') {
                if (Date.now() - lastFailureTime > config.resetTimeout) {
                    state = 'HALF_OPEN';
                    successes = 0;
                } else {
                    throw new Error('Circuit breaker is OPEN');
                }
            }

            try {
                const result = await fn(...args);
                
                if (state === 'HALF_OPEN') {
                    successes++;
                    if (successes >= config.failureThreshold) {
                        state = 'CLOSED';
                        failures = 0;
                    }
                } else {
                    failures = 0;
                }

                return result;
            } catch (error) {
                failures++;
                lastFailureTime = Date.now();

                if (failures >= config.failureThreshold) {
                    state = 'OPEN';
                    this.logger.warn({
                        event: 'circuit_breaker_opened',
                        function: fn.name || 'anonymous',
                        failures
                    });
                }

                throw error;
            }
        };
    }

    // Error recovery strategies
    async recoverFromError(error, strategy = 'default') {
        this.logger.info({
            event: 'error_recovery_attempt',
            strategy,
            error: error.message
        });

        switch (strategy) {
            case 'restart_service':
                return this.restartService(error.service);
            case 'clear_cache':
                return this.clearCache();
            case 'fallback_mode':
                return this.enableFallbackMode();
            case 'default':
            default:
                return this.defaultRecovery(error);
        }
    }

    async restartService(serviceName) {
        this.logger.info({
            event: 'service_restart',
            service: serviceName
        });
        // Implementation depends on service architecture
    }

    async clearCache() {
        this.logger.info({
            event: 'cache_clear'
        });
        // Clear application cache
    }

    async enableFallbackMode() {
        this.logger.info({
            event: 'fallback_mode_enabled'
        });
        // Enable fallback systems
    }

    async defaultRecovery(error) {
        this.logger.info({
            event: 'default_recovery',
            error: error.message
        });
        // Default recovery actions
    }

    // Generate error report
    generateErrorReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalErrors: this.errorStats.totalErrors,
                errorTypes: Object.keys(this.errorStats.errorsByType).length,
                affectedServices: Object.keys(this.errorStats.errorsByService).length
            },
            errorsByType: this.errorStats.errorsByType,
            errorsByService: this.errorStats.errorsByService,
            recentErrors: this.errorStats.recentErrors.slice(0, 10),
            systemHealth: this.assessSystemHealth()
        };

        return report;
    }

    // Assess system health based on error patterns
    assessSystemHealth() {
        const recentErrorCount = this.errorStats.recentErrors.filter(
            error => Date.now() - new Date(error.timestamp).getTime() < 300000 // 5 minutes
        ).length;

        if (recentErrorCount > 20) {
            return 'critical';
        } else if (recentErrorCount > 10) {
            return 'warning';
        } else if (recentErrorCount > 5) {
            return 'degraded';
        } else {
            return 'healthy';
        }
    }

    // Export error logs
    async exportErrorLogs(format = 'json') {
        const logsDir = path.join(__dirname, '../logs');
        const exportDir = path.join(logsDir, 'exports');
        fs.ensureDirSync(exportDir);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `error-export-${timestamp}.${format}`;
        const filepath = path.join(exportDir, filename);

        const report = this.generateErrorReport();

        if (format === 'json') {
            await fs.writeJson(filepath, report, { spaces: 2 });
        } else if (format === 'csv') {
            // Convert to CSV format
            const csv = this.convertToCSV(report.recentErrors);
            await fs.writeFile(filepath, csv);
        }

        this.logger.info({
            event: 'error_logs_exported',
            filepath,
            format
        });

        return filepath;
    }

    convertToCSV(errors) {
        const headers = ['timestamp', 'message', 'type', 'service'];
        const rows = errors.map(error => [
            error.timestamp,
            error.message.replace(/"/g, '""'),
            error.type,
            error.service
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }
}

// Global error handler instance
const errorHandler = new EnhancedErrorHandler();

// Export utility functions
module.exports = {
    errorHandler,
    retryWithBackoff: errorHandler.retryWithBackoff.bind(errorHandler),
    handleError: errorHandler.handleError.bind(errorHandler),
    apiCall: errorHandler.apiCall.bind(errorHandler),
    dbOperation: errorHandler.dbOperation.bind(errorHandler),
    fileOperation: errorHandler.fileOperation.bind(errorHandler),
    mcpOperation: errorHandler.mcpOperation.bind(errorHandler),
    createCircuitBreaker: errorHandler.createCircuitBreaker.bind(errorHandler),
    recoverFromError: errorHandler.recoverFromError.bind(errorHandler),
    generateErrorReport: errorHandler.generateErrorReport.bind(errorHandler),
    exportErrorLogs: errorHandler.exportErrorLogs.bind(errorHandler)
};

// CLI interface
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'report':
            console.log(JSON.stringify(errorHandler.generateErrorReport(), null, 2));
            break;
        case 'export':
            const format = process.argv[3] || 'json';
            errorHandler.exportErrorLogs(format)
                .then(filepath => console.log(`Exported to: ${filepath}`))
                .catch(console.error);
            break;
        case 'stats':
            console.log('Error Statistics:');
            console.log(`Total Errors: ${errorHandler.errorStats.totalErrors}`);
            console.log(`Error Types: ${Object.keys(errorHandler.errorStats.errorsByType).length}`);
            console.log(`Affected Services: ${Object.keys(errorHandler.errorStats.errorsByService).length}`);
            console.log(`System Health: ${errorHandler.assessSystemHealth()}`);
            break;
        default:
            console.log('Enhanced Error Handling System');
            console.log('Usage: node enhanced-error-handling.js [command]');
            console.log('Commands:');
            console.log('  report  - Generate error report');
            console.log('  export  - Export error logs');
            console.log('  stats   - Show error statistics');
    }
}