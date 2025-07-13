#!/usr/bin/env node

/**
 * Enfusionize™ Grok Debug MCP Integration
 * One-click code debugging with Grok AI as backup redundancy
 * Powered by S.A.I.A.S.™ Framework
 */

const express = require('express');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { EventEmitter } = require('events');
const chalk = require('chalk');
const ora = require('ora');

class GrokDebugMCP extends EventEmitter {
    constructor() {
        super();
        this.config = this.loadConfig();
        this.debugSessions = new Map();
        this.app = express();
        
        this.setupExpress();
        this.initializeGrokAPI();
    }

    loadConfig() {
        return {
            grokAPI: {
                baseURL: 'https://api.x.ai/v1',
                model: 'grok-beta',
                maxTokens: 4096,
                temperature: 0.1
            },
            debugging: {
                maxFileSize: 1024 * 1024, // 1MB
                supportedLanguages: ['javascript', 'python', 'typescript', 'jsx', 'tsx', 'json', 'yaml'],
                timeout: 30000
            },
            redundancy: {
                enabled: true,
                fallbackSystems: ['cursor', 'claude', 'local'],
                retryAttempts: 3
            }
        };
    }

    setupExpress() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static(path.join(__dirname, '../dashboard')));
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        this.setupRoutes();
    }

    setupRoutes() {
        // One-click debug endpoints
        this.app.post('/api/grok/debug-code', this.debugCode.bind(this));
        this.app.post('/api/grok/fix-code', this.fixCode.bind(this));
        this.app.post('/api/grok/optimize-code', this.optimizeCode.bind(this));
        this.app.post('/api/grok/explain-error', this.explainError.bind(this));
        
        // File debugging
        this.app.post('/api/grok/debug-file', this.debugFile.bind(this));
        this.app.post('/api/grok/debug-project', this.debugProject.bind(this));
        
        // Session management
        this.app.get('/api/grok/sessions', this.getSessions.bind(this));
        this.app.get('/api/grok/sessions/:id', this.getSession.bind(this));
        this.app.delete('/api/grok/sessions/:id', this.deleteSession.bind(this));
        
        // Health check
        this.app.get('/api/grok/health', this.healthCheck.bind(this));
    }

    async initializeGrokAPI() {
        try {
            // Test Grok API connection
            const response = await this.makeGrokRequest('ping', { message: 'test' });
            console.log(chalk.green('✅ Grok API initialized successfully'));
        } catch (error) {
            console.log(chalk.yellow('⚠️ Grok API not available, using fallback systems'));
        }
    }

    async debugCode(req, res) {
        try {
            const { code, language, description, errorMessage } = req.body;
            
            if (!code) {
                return res.status(400).json({
                    success: false,
                    error: 'Code is required'
                });
            }

            const sessionId = `debug-${Date.now()}`;
            const spinner = ora('Debugging code with Grok...').start();

            const debugResult = await this.performCodeDebug(code, language, description, errorMessage);
            
            // Store session
            this.debugSessions.set(sessionId, {
                id: sessionId,
                type: 'debug',
                originalCode: code,
                language,
                result: debugResult,
                timestamp: new Date()
            });

            spinner.succeed('Code debugging completed');
            
            res.json({
                success: true,
                sessionId,
                result: debugResult
            });

        } catch (error) {
            console.error('Debug error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async fixCode(req, res) {
        try {
            const { code, language, issues, requirements } = req.body;
            
            const sessionId = `fix-${Date.now()}`;
            const spinner = ora('Fixing code with Grok...').start();

            const fixResult = await this.performCodeFix(code, language, issues, requirements);
            
            this.debugSessions.set(sessionId, {
                id: sessionId,
                type: 'fix',
                originalCode: code,
                language,
                result: fixResult,
                timestamp: new Date()
            });

            spinner.succeed('Code fixing completed');
            
            res.json({
                success: true,
                sessionId,
                result: fixResult
            });

        } catch (error) {
            console.error('Fix error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async optimizeCode(req, res) {
        try {
            const { code, language, optimizationGoals } = req.body;
            
            const sessionId = `optimize-${Date.now()}`;
            const spinner = ora('Optimizing code with Grok...').start();

            const optimizeResult = await this.performCodeOptimization(code, language, optimizationGoals);
            
            this.debugSessions.set(sessionId, {
                id: sessionId,
                type: 'optimize',
                originalCode: code,
                language,
                result: optimizeResult,
                timestamp: new Date()
            });

            spinner.succeed('Code optimization completed');
            
            res.json({
                success: true,
                sessionId,
                result: optimizeResult
            });

        } catch (error) {
            console.error('Optimization error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async explainError(req, res) {
        try {
            const { errorMessage, code, language, context } = req.body;
            
            const sessionId = `explain-${Date.now()}`;
            const spinner = ora('Explaining error with Grok...').start();

            const explanation = await this.performErrorExplanation(errorMessage, code, language, context);
            
            this.debugSessions.set(sessionId, {
                id: sessionId,
                type: 'explain',
                errorMessage,
                code,
                language,
                result: explanation,
                timestamp: new Date()
            });

            spinner.succeed('Error explanation completed');
            
            res.json({
                success: true,
                sessionId,
                result: explanation
            });

        } catch (error) {
            console.error('Explanation error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async debugFile(req, res) {
        try {
            const { filePath, issues } = req.body;
            
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
            }

            const fileStats = await fs.stat(filePath);
            if (fileStats.size > this.config.debugging.maxFileSize) {
                return res.status(413).json({
                    success: false,
                    error: 'File too large for debugging'
                });
            }

            const code = await fs.readFile(filePath, 'utf8');
            const language = this.detectLanguage(filePath);
            
            const sessionId = `file-debug-${Date.now()}`;
            const spinner = ora(`Debugging file: ${path.basename(filePath)}`).start();

            const debugResult = await this.performCodeDebug(code, language, `Debug file: ${filePath}`, issues);
            
            this.debugSessions.set(sessionId, {
                id: sessionId,
                type: 'file-debug',
                filePath,
                language,
                result: debugResult,
                timestamp: new Date()
            });

            spinner.succeed(`File debugging completed: ${path.basename(filePath)}`);
            
            res.json({
                success: true,
                sessionId,
                filePath,
                result: debugResult
            });

        } catch (error) {
            console.error('File debug error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async debugProject(req, res) {
        try {
            const { projectPath, includePatterns, excludePatterns } = req.body;
            
            const sessionId = `project-debug-${Date.now()}`;
            const spinner = ora('Debugging project with Grok...').start();

            const files = await this.scanProjectFiles(projectPath, includePatterns, excludePatterns);
            const debugResults = [];

            for (const file of files) {
                try {
                    const code = await fs.readFile(file, 'utf8');
                    const language = this.detectLanguage(file);
                    
                    const result = await this.performCodeDebug(code, language, `Project file: ${file}`);
                    debugResults.push({
                        file,
                        language,
                        result
                    });
                } catch (error) {
                    debugResults.push({
                        file,
                        error: error.message
                    });
                }
            }

            this.debugSessions.set(sessionId, {
                id: sessionId,
                type: 'project-debug',
                projectPath,
                filesDebugged: files.length,
                results: debugResults,
                timestamp: new Date()
            });

            spinner.succeed(`Project debugging completed: ${files.length} files processed`);
            
            res.json({
                success: true,
                sessionId,
                projectPath,
                filesDebugged: files.length,
                results: debugResults
            });

        } catch (error) {
            console.error('Project debug error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async performCodeDebug(code, language, description, errorMessage) {
        const prompt = this.buildDebugPrompt(code, language, description, errorMessage);
        
        try {
            // Try Grok first
            const grokResult = await this.makeGrokRequest('debug', { prompt });
            return this.parseDebugResult(grokResult);
        } catch (error) {
            console.log(chalk.yellow('Grok unavailable, trying fallback...'));
            return await this.useFallbackDebug(code, language, description, errorMessage);
        }
    }

    async performCodeFix(code, language, issues, requirements) {
        const prompt = this.buildFixPrompt(code, language, issues, requirements);
        
        try {
            const grokResult = await this.makeGrokRequest('fix', { prompt });
            return this.parseFixResult(grokResult);
        } catch (error) {
            console.log(chalk.yellow('Grok unavailable, trying fallback...'));
            return await this.useFallbackFix(code, language, issues, requirements);
        }
    }

    async performCodeOptimization(code, language, optimizationGoals) {
        const prompt = this.buildOptimizePrompt(code, language, optimizationGoals);
        
        try {
            const grokResult = await this.makeGrokRequest('optimize', { prompt });
            return this.parseOptimizeResult(grokResult);
        } catch (error) {
            console.log(chalk.yellow('Grok unavailable, trying fallback...'));
            return await this.useFallbackOptimize(code, language, optimizationGoals);
        }
    }

    async performErrorExplanation(errorMessage, code, language, context) {
        const prompt = this.buildExplainPrompt(errorMessage, code, language, context);
        
        try {
            const grokResult = await this.makeGrokRequest('explain', { prompt });
            return this.parseExplainResult(grokResult);
        } catch (error) {
            console.log(chalk.yellow('Grok unavailable, trying fallback...'));
            return await this.useFallbackExplain(errorMessage, code, language, context);
        }
    }

    buildDebugPrompt(code, language, description, errorMessage) {
        return `
Debug the following ${language} code:

${description ? `Description: ${description}` : ''}
${errorMessage ? `Error Message: ${errorMessage}` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Identified issues and bugs
2. Root cause analysis
3. Step-by-step debugging approach
4. Recommended fixes
5. Prevention strategies

Format your response as JSON with the following structure:
{
  "issues": [],
  "rootCause": "",
  "debugSteps": [],
  "fixes": [],
  "prevention": []
}
        `.trim();
    }

    buildFixPrompt(code, language, issues, requirements) {
        return `
Fix the following ${language} code:

Issues to address: ${issues}
Requirements: ${requirements || 'Standard best practices'}

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Fixed code
2. Explanation of changes
3. Testing recommendations
4. Performance improvements

Format your response as JSON with the following structure:
{
  "fixedCode": "",
  "changes": [],
  "testing": [],
  "improvements": []
}
        `.trim();
    }

    buildOptimizePrompt(code, language, optimizationGoals) {
        return `
Optimize the following ${language} code:

Optimization Goals: ${optimizationGoals || 'Performance, readability, maintainability'}

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Optimized code
2. Performance improvements
3. Code quality enhancements
4. Best practices applied

Format your response as JSON with the following structure:
{
  "optimizedCode": "",
  "performanceGains": [],
  "qualityImprovements": [],
  "bestPractices": []
}
        `.trim();
    }

    buildExplainPrompt(errorMessage, code, language, context) {
        return `
Explain the following error in ${language} code:

Error Message: ${errorMessage}
Context: ${context || 'General debugging'}

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Error explanation in simple terms
2. What caused the error
3. How to fix it
4. How to prevent it in the future

Format your response as JSON with the following structure:
{
  "explanation": "",
  "cause": "",
  "solution": "",
  "prevention": ""
}
        `.trim();
    }

    async makeGrokRequest(action, data) {
        const apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
        
        if (!apiKey) {
            throw new Error('Grok API key not configured');
        }

        const response = await axios.post(`${this.config.grokAPI.baseURL}/chat/completions`, {
            model: this.config.grokAPI.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are Grok, an expert code debugger and optimizer. Provide detailed, accurate, and helpful debugging assistance.'
                },
                {
                    role: 'user',
                    content: data.prompt
                }
            ],
            max_tokens: this.config.grokAPI.maxTokens,
            temperature: this.config.grokAPI.temperature
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: this.config.debugging.timeout
        });

        return response.data.choices[0].message.content;
    }

    parseDebugResult(result) {
        try {
            return JSON.parse(result);
        } catch (error) {
            return {
                issues: ['Failed to parse Grok response'],
                rootCause: 'Response parsing error',
                debugSteps: ['Review the original response'],
                fixes: ['Manual review required'],
                prevention: ['Improve response parsing'],
                rawResponse: result
            };
        }
    }

    parseFixResult(result) {
        try {
            return JSON.parse(result);
        } catch (error) {
            return {
                fixedCode: result,
                changes: ['Response parsing failed'],
                testing: ['Manual testing required'],
                improvements: ['Review needed'],
                rawResponse: result
            };
        }
    }

    parseOptimizeResult(result) {
        try {
            return JSON.parse(result);
        } catch (error) {
            return {
                optimizedCode: result,
                performanceGains: ['Response parsing failed'],
                qualityImprovements: ['Manual review required'],
                bestPractices: ['Review needed'],
                rawResponse: result
            };
        }
    }

    parseExplainResult(result) {
        try {
            return JSON.parse(result);
        } catch (error) {
            return {
                explanation: result,
                cause: 'Response parsing failed',
                solution: 'Manual review required',
                prevention: 'Review needed',
                rawResponse: result
            };
        }
    }

    async useFallbackDebug(code, language, description, errorMessage) {
        // Implement fallback debugging logic
        return {
            issues: ['Fallback debugging system used'],
            rootCause: 'Primary system unavailable',
            debugSteps: ['Manual code review required'],
            fixes: ['Use alternative debugging tools'],
            prevention: ['Ensure primary system availability'],
            fallback: true
        };
    }

    async useFallbackFix(code, language, issues, requirements) {
        // Implement fallback fixing logic
        return {
            fixedCode: code,
            changes: ['Fallback system used - manual fixes required'],
            testing: ['Comprehensive testing recommended'],
            improvements: ['Manual optimization needed'],
            fallback: true
        };
    }

    async useFallbackOptimize(code, language, optimizationGoals) {
        // Implement fallback optimization logic
        return {
            optimizedCode: code,
            performanceGains: ['Fallback system used'],
            qualityImprovements: ['Manual optimization required'],
            bestPractices: ['Review best practices manually'],
            fallback: true
        };
    }

    async useFallbackExplain(errorMessage, code, language, context) {
        // Implement fallback explanation logic
        return {
            explanation: 'Fallback system used - manual error analysis required',
            cause: 'Primary explanation system unavailable',
            solution: 'Use alternative debugging methods',
            prevention: 'Ensure primary system availability',
            fallback: true
        };
    }

    detectLanguage(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const languageMap = {
            '.js': 'javascript',
            '.jsx': 'jsx',
            '.ts': 'typescript',
            '.tsx': 'tsx',
            '.py': 'python',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.sass': 'sass',
            '.php': 'php',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c',
            '.go': 'go',
            '.rs': 'rust',
            '.rb': 'ruby'
        };
        return languageMap[ext] || 'text';
    }

    async scanProjectFiles(projectPath, includePatterns = ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'], excludePatterns = ['node_modules/**', 'dist/**', 'build/**']) {
        const glob = require('glob');
        const files = [];
        
        for (const pattern of includePatterns) {
            const matches = glob.sync(path.join(projectPath, pattern), {
                ignore: excludePatterns.map(p => path.join(projectPath, p))
            });
            files.push(...matches);
        }
        
        return [...new Set(files)]; // Remove duplicates
    }

    // Session management
    async getSessions(req, res) {
        const sessions = Array.from(this.debugSessions.values());
        res.json({
            success: true,
            sessions: sessions.map(s => ({
                id: s.id,
                type: s.type,
                timestamp: s.timestamp,
                language: s.language
            }))
        });
    }

    async getSession(req, res) {
        const { id } = req.params;
        const session = this.debugSessions.get(id);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }
        
        res.json({
            success: true,
            session
        });
    }

    async deleteSession(req, res) {
        const { id } = req.params;
        const deleted = this.debugSessions.delete(id);
        
        res.json({
            success: deleted,
            message: deleted ? 'Session deleted' : 'Session not found'
        });
    }

    async healthCheck(req, res) {
        const health = {
            status: 'healthy',
            grokAPI: 'unknown',
            sessions: this.debugSessions.size,
            timestamp: new Date()
        };

        try {
            await this.makeGrokRequest('ping', { message: 'health check' });
            health.grokAPI = 'available';
        } catch (error) {
            health.grokAPI = 'unavailable';
            health.fallbackActive = true;
        }

        res.json(health);
    }

    start(port = 3101) {
        this.app.listen(port, () => {
            console.log(chalk.green(`🚀 Grok Debug MCP running on port ${port}`));
            console.log(chalk.blue(`🔧 Debug API: http://localhost:${port}/api/grok/debug-code`));
        });
    }
}

// CLI interface
if (require.main === module) {
    const grokMCP = new GrokDebugMCP();
    grokMCP.start();
}

module.exports = GrokDebugMCP;