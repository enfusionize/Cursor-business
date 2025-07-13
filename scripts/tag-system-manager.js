#!/usr/bin/env node

/**
 * Tag System Manager
 * Comprehensive tagging system for organizing tools, components, users, and integrations
 */

const fs = require('fs').promises;
const path = require('path');

class TagSystemManager {
    constructor() {
        this.tagFile = path.join(__dirname, '../data/tags.json');
        this.tags = new Map();
        this.tagHierarchy = new Map();
        this.entityTagMap = new Map();
        this.init();
    }

    async init() {
        await this.loadTags();
        this.setupTagHierarchy();
        this.setupPredefinedTags();
    }

    async loadTags() {
        try {
            const data = await fs.readFile(this.tagFile, 'utf8');
            const parsedData = JSON.parse(data);
            
            for (const [entity, entityTags] of Object.entries(parsedData)) {
                this.entityTagMap.set(entity, new Map(Object.entries(entityTags)));
            }
        } catch (error) {
            // File doesn't exist yet, start with empty tags
            console.log('No existing tag file found, starting fresh');
        }
    }

    async saveTags() {
        try {
            await fs.mkdir(path.dirname(this.tagFile), { recursive: true });
            
            const data = {};
            for (const [entity, entityMap] of this.entityTagMap.entries()) {
                data[entity] = Object.fromEntries(entityMap);
            }
            
            await fs.writeFile(this.tagFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Failed to save tags:', error);
        }
    }

    setupTagHierarchy() {
        // Define tag categories and their hierarchies
        this.tagHierarchy.set('system', {
            parent: null,
            children: ['performance', 'security', 'monitoring', 'health'],
            description: 'System-level tags'
        });

        this.tagHierarchy.set('category', {
            parent: null,
            children: ['automation', 'analytics', 'development', 'business', 'integration'],
            description: 'Functional category tags'
        });

        this.tagHierarchy.set('technology', {
            parent: null,
            children: ['ai', 'ml', 'api', 'database', 'frontend', 'backend'],
            description: 'Technology stack tags'
        });

        this.tagHierarchy.set('access', {
            parent: null,
            children: ['public', 'private', 'admin-only', 'user-restricted'],
            description: 'Access control tags'
        });

        this.tagHierarchy.set('status', {
            parent: null,
            children: ['active', 'inactive', 'maintenance', 'deprecated', 'beta'],
            description: 'Status and lifecycle tags'
        });

        this.tagHierarchy.set('priority', {
            parent: null,
            children: ['critical', 'high', 'medium', 'low'],
            description: 'Priority level tags'
        });
    }

    setupPredefinedTags() {
        // MCP Server Tags
        this.definePredefinedTags('mcpServers', {
            'playwright-mcp': ['automation', 'testing', 'browser', 'web-scraping', 'active', 'public'],
            'firecrawl-mcp': ['data-extraction', 'web-crawling', 'content-analysis', 'active', 'public'],
            'perplexity-mcp': ['ai', 'research', 'analysis', 'nlp', 'active', 'public'],
            'clickup-mcp': ['project-management', 'tasks', 'collaboration', 'api', 'active', 'public'],
            'figma-mcp': ['design', 'ui-ux', 'collaboration', 'api', 'active', 'public']
        });

        // Automation Tools Tags
        this.definePredefinedTags('automationTools', {
            'string-automation': ['automation', 'nlp', 'workflows', 'text-processing', 'active', 'public'],
            'clickup-daemon': ['automation', 'background-tasks', 'scheduler', 'daemon', 'active', 'admin-only'],
            'learning-daemon': ['machine-learning', 'automation', 'insights', 'background', 'active', 'admin-only']
        });

        // Monitoring Tools Tags
        this.definePredefinedTags('monitoringTools', {
            'health-monitor': ['monitoring', 'health', 'system-status', 'real-time', 'active', 'public'],
            'auto-fix-engine': ['automation', 'remediation', 'fixes', 'diagnostic', 'active', 'admin-only'],
            'performance-analytics': ['analytics', 'performance', 'metrics', 'optimization', 'active', 'public']
        });

        // Development Tools Tags
        this.definePredefinedTags('developmentTools', {
            'multi-model-test': ['testing', 'ai-models', 'comparison', 'evaluation', 'active', 'public'],
            'claude-workflow': ['ai', 'code-generation', 'workflows', 'claude', 'active', 'public'],
            'figma-plugin': ['figma', 'plugins', 'development', 'design-tools', 'active', 'public']
        });

        // Business Tools Tags
        this.definePredefinedTags('businessTools', {
            'knowledge-engine': ['knowledge-management', 'search', 'content', 'indexing', 'active', 'public'],
            'business-intelligence': ['business-intelligence', 'analytics', 'insights', 'reporting', 'active', 'public'],
            'miro-dashboard': ['visualization', 'collaboration', 'dashboards', 'whiteboard', 'active', 'public']
        });

        // Frontend Components Tags
        this.definePredefinedTags('frontendComponents', {
            'dashboard-overview': ['dashboard', 'overview', 'metrics', 'summary', 'active', 'public'],
            'analytics-charts': ['analytics', 'visualization', 'charts', 'data-display', 'active', 'public'],
            'tool-management': ['tools', 'management', 'configuration', 'admin', 'active', 'admin-only'],
            'user-interface': ['ui', 'frontend', 'user-experience', 'interface', 'active', 'public'],
            'real-time-updates': ['real-time', 'websocket', 'live-data', 'updates', 'active', 'public']
        });

        // Backend Services Tags
        this.definePredefinedTags('backendServices', {
            'main-dashboard': ['dashboard', 'backend', 'api', 'websocket', 'active', 'critical'],
            'admin-system': ['admin', 'user-management', 'api-keys', 'security', 'active', 'critical'],
            'analytics-mcp': ['analytics', 'mcp', 'data-processing', 'multi-platform', 'active', 'high'],
            'demo-space': ['demo', 'client-presentation', 'data-upload', 'testing', 'active', 'medium'],
            'website-integration': ['website', 'tracking', 'lead-capture', 'integration', 'active', 'high'],
            'frontend-backend-bridge': ['integration', 'bridge', 'real-time-sync', 'orchestration', 'active', 'critical']
        });

        // Integration Points Tags
        this.definePredefinedTags('integrations', {
            'google-analytics': ['analytics', 'web-tracking', 'google', 'api', 'active', 'public'],
            'wicked-reports': ['analytics', 'marketing', 'attribution', 'api', 'active', 'public'],
            'hubspot': ['crm', 'marketing', 'sales', 'api', 'active', 'public'],
            'salesforce': ['crm', 'sales', 'enterprise', 'api', 'active', 'public'],
            'clickup-api': ['project-management', 'tasks', 'api', 'collaboration', 'active', 'public'],
            'figma-api': ['design', 'collaboration', 'api', 'ui-ux', 'active', 'public'],
            'claude-api': ['ai', 'nlp', 'api', 'anthropic', 'active', 'public'],
            'perplexity-api': ['ai', 'research', 'api', 'search', 'active', 'public']
        });

        // User Roles Tags
        this.definePredefinedTags('userRoles', {
            'super-admin': ['admin', 'full-access', 'system-control', 'security', 'critical', 'private'],
            'admin': ['admin', 'management', 'configuration', 'user-control', 'high', 'private'],
            'power-user': ['advanced-features', 'automation', 'analytics', 'tools', 'medium', 'user-restricted'],
            'standard-user': ['basic-features', 'dashboard', 'reports', 'view-only', 'low', 'public'],
            'demo-user': ['demo', 'limited-access', 'presentation', 'temporary', 'low', 'public']
        });
    }

    definePredefinedTags(entity, tagMappings) {
        if (!this.entityTagMap.has(entity)) {
            this.entityTagMap.set(entity, new Map());
        }

        const entityMap = this.entityTagMap.get(entity);
        
        for (const [id, tags] of Object.entries(tagMappings)) {
            entityMap.set(id, tags);
        }
    }

    // Core Tag Management Methods
    addTag(entity, entityId, tag) {
        if (!this.entityTagMap.has(entity)) {
            this.entityTagMap.set(entity, new Map());
        }

        const entityMap = this.entityTagMap.get(entity);
        if (!entityMap.has(entityId)) {
            entityMap.set(entityId, []);
        }

        const tags = entityMap.get(entityId);
        if (!tags.includes(tag)) {
            tags.push(tag);
            this.saveTags();
        }
    }

    removeTag(entity, entityId, tag) {
        if (!this.entityTagMap.has(entity)) return;

        const entityMap = this.entityTagMap.get(entity);
        if (!entityMap.has(entityId)) return;

        const tags = entityMap.get(entityId);
        const index = tags.indexOf(tag);
        if (index > -1) {
            tags.splice(index, 1);
            this.saveTags();
        }
    }

    setTags(entity, entityId, tags) {
        if (!this.entityTagMap.has(entity)) {
            this.entityTagMap.set(entity, new Map());
        }

        const entityMap = this.entityTagMap.get(entity);
        entityMap.set(entityId, [...tags]);
        this.saveTags();
    }

    getTags(entity, entityId) {
        if (!this.entityTagMap.has(entity)) return [];

        const entityMap = this.entityTagMap.get(entity);
        return entityMap.get(entityId) || [];
    }

    // Query Methods
    findByTag(tag) {
        const results = {};

        for (const [entity, entityMap] of this.entityTagMap.entries()) {
            results[entity] = [];
            
            for (const [entityId, tags] of entityMap.entries()) {
                if (tags.includes(tag)) {
                    results[entity].push(entityId);
                }
            }
        }

        return results;
    }

    findByTags(tags, operator = 'AND') {
        const results = {};

        for (const [entity, entityMap] of this.entityTagMap.entries()) {
            results[entity] = [];
            
            for (const [entityId, entityTags] of entityMap.entries()) {
                let matches = false;
                
                if (operator === 'AND') {
                    matches = tags.every(tag => entityTags.includes(tag));
                } else if (operator === 'OR') {
                    matches = tags.some(tag => entityTags.includes(tag));
                }
                
                if (matches) {
                    results[entity].push(entityId);
                }
            }
        }

        return results;
    }

    findByCategory(category) {
        const categoryTags = this.tagHierarchy.get(category);
        if (!categoryTags || !categoryTags.children) return {};

        return this.findByTags(categoryTags.children, 'OR');
    }

    // Analytics Methods
    getTagStatistics() {
        const stats = {
            totalEntities: this.entityTagMap.size,
            totalTags: 0,
            tagFrequency: new Map(),
            entitiesPerTag: new Map(),
            averageTagsPerEntity: 0
        };

        let totalTagCount = 0;
        let totalEntitiesCount = 0;

        for (const [entity, entityMap] of this.entityTagMap.entries()) {
            totalEntitiesCount += entityMap.size;
            
            for (const [entityId, tags] of entityMap.entries()) {
                totalTagCount += tags.length;
                
                for (const tag of tags) {
                    stats.tagFrequency.set(tag, (stats.tagFrequency.get(tag) || 0) + 1);
                    
                    if (!stats.entitiesPerTag.has(tag)) {
                        stats.entitiesPerTag.set(tag, new Set());
                    }
                    stats.entitiesPerTag.get(tag).add(`${entity}:${entityId}`);
                }
            }
        }

        stats.totalTags = stats.tagFrequency.size;
        stats.averageTagsPerEntity = totalEntitiesCount > 0 ? totalTagCount / totalEntitiesCount : 0;

        // Convert Sets to counts for entitiesPerTag
        const entitiesPerTagObj = {};
        for (const [tag, entities] of stats.entitiesPerTag.entries()) {
            entitiesPerTagObj[tag] = entities.size;
        }
        stats.entitiesPerTag = entitiesPerTagObj;

        return {
            ...stats,
            tagFrequency: Object.fromEntries(stats.tagFrequency),
            entitiesPerTag: entitiesPerTagObj
        };
    }

    getMostUsedTags(limit = 10) {
        const stats = this.getTagStatistics();
        return Object.entries(stats.tagFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([tag, count]) => ({ tag, count }));
    }

    getUnusedTags() {
        const allDefinedTags = new Set();
        const usedTags = new Set();

        // Collect all defined tags from hierarchy
        for (const [category, info] of this.tagHierarchy.entries()) {
            if (info.children) {
                info.children.forEach(tag => allDefinedTags.add(tag));
            }
        }

        // Collect all used tags
        for (const [entity, entityMap] of this.entityTagMap.entries()) {
            for (const [entityId, tags] of entityMap.entries()) {
                tags.forEach(tag => usedTags.add(tag));
            }
        }

        return Array.from(allDefinedTags).filter(tag => !usedTags.has(tag));
    }

    // Validation Methods
    validateTags(entity, entityId, tags) {
        const validationResult = {
            valid: true,
            errors: [],
            warnings: []
        };

        for (const tag of tags) {
            // Check if tag is recognized
            const isRecognized = this.isTagRecognized(tag);
            if (!isRecognized) {
                validationResult.warnings.push(`Tag '${tag}' is not in predefined tag hierarchy`);
            }

            // Check for conflicts (e.g., both 'active' and 'inactive')
            const conflicts = this.findTagConflicts(tags);
            if (conflicts.length > 0) {
                validationResult.errors.push(`Conflicting tags found: ${conflicts.join(', ')}`);
                validationResult.valid = false;
            }
        }

        return validationResult;
    }

    isTagRecognized(tag) {
        for (const [category, info] of this.tagHierarchy.entries()) {
            if (info.children && info.children.includes(tag)) {
                return true;
            }
        }
        return false;
    }

    findTagConflicts(tags) {
        const conflicts = [];
        const conflictSets = [
            ['active', 'inactive'],
            ['public', 'private'],
            ['critical', 'low'],
            ['beta', 'deprecated']
        ];

        for (const conflictSet of conflictSets) {
            const foundConflicts = conflictSet.filter(tag => tags.includes(tag));
            if (foundConflicts.length > 1) {
                conflicts.push(...foundConflicts);
            }
        }

        return [...new Set(conflicts)];
    }

    // Export/Import Methods
    exportTags() {
        const exportData = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            hierarchy: Object.fromEntries(this.tagHierarchy),
            entities: {}
        };

        for (const [entity, entityMap] of this.entityTagMap.entries()) {
            exportData.entities[entity] = Object.fromEntries(entityMap);
        }

        return exportData;
    }

    async importTags(importData) {
        try {
            // Validate import data
            if (!importData.entities) {
                throw new Error('Invalid import data: missing entities');
            }

            // Merge with existing tags
            for (const [entity, entityData] of Object.entries(importData.entities)) {
                if (!this.entityTagMap.has(entity)) {
                    this.entityTagMap.set(entity, new Map());
                }

                const entityMap = this.entityTagMap.get(entity);
                
                for (const [entityId, tags] of Object.entries(entityData)) {
                    entityMap.set(entityId, tags);
                }
            }

            await this.saveTags();
            return { success: true, message: 'Tags imported successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Suggestion Methods
    suggestTags(entity, entityId, context = {}) {
        const suggestions = new Set();
        
        // Suggest based on entity type
        const entitySuggestions = this.getEntityTypeSuggestions(entity);
        entitySuggestions.forEach(tag => suggestions.add(tag));

        // Suggest based on similar entities
        const similarSuggestions = this.getSimilarEntitySuggestions(entity, entityId);
        similarSuggestions.forEach(tag => suggestions.add(tag));

        // Suggest based on context
        if (context.category) {
            const categorySuggestions = this.getCategorySuggestions(context.category);
            categorySuggestions.forEach(tag => suggestions.add(tag));
        }

        return Array.from(suggestions);
    }

    getEntityTypeSuggestions(entity) {
        const suggestions = {
            'mcpServers': ['automation', 'api', 'integration', 'active'],
            'automationTools': ['automation', 'workflow', 'background', 'active'],
            'monitoringTools': ['monitoring', 'system', 'health', 'active'],
            'developmentTools': ['development', 'tools', 'code', 'active'],
            'businessTools': ['business', 'analytics', 'management', 'active'],
            'frontendComponents': ['frontend', 'ui', 'component', 'active'],
            'backendServices': ['backend', 'service', 'api', 'active'],
            'integrations': ['integration', 'api', 'external', 'active'],
            'userRoles': ['user', 'role', 'access', 'security']
        };

        return suggestions[entity] || ['active'];
    }

    getSimilarEntitySuggestions(entity, entityId) {
        const suggestions = new Set();
        
        if (!this.entityTagMap.has(entity)) return Array.from(suggestions);

        const entityMap = this.entityTagMap.get(entity);
        
        // Find entities with similar names or IDs
        for (const [otherId, tags] of entityMap.entries()) {
            if (otherId !== entityId && this.calculateSimilarity(entityId, otherId) > 0.5) {
                tags.forEach(tag => suggestions.add(tag));
            }
        }

        return Array.from(suggestions);
    }

    getCategorySuggestions(category) {
        const categoryHierarchy = this.tagHierarchy.get(category);
        return categoryHierarchy ? categoryHierarchy.children : [];
    }

    calculateSimilarity(str1, str2) {
        // Simple similarity calculation based on common substrings
        const words1 = str1.toLowerCase().split(/[-_]/);
        const words2 = str2.toLowerCase().split(/[-_]/);
        
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
    }

    // API Methods for integration
    getAPIEndpoints() {
        return {
            GET: {
                '/api/tags': 'Get all tags',
                '/api/tags/:entity': 'Get tags for entity type',
                '/api/tags/:entity/:entityId': 'Get tags for specific entity',
                '/api/tags/search': 'Search by tags',
                '/api/tags/statistics': 'Get tag statistics',
                '/api/tags/hierarchy': 'Get tag hierarchy'
            },
            POST: {
                '/api/tags/:entity/:entityId': 'Set tags for entity',
                '/api/tags/import': 'Import tags from file',
                '/api/tags/validate': 'Validate tag set'
            },
            PUT: {
                '/api/tags/:entity/:entityId/:tag': 'Add single tag',
            },
            DELETE: {
                '/api/tags/:entity/:entityId/:tag': 'Remove single tag'
            }
        };
    }

    // Summary for documentation
    generateDocumentation() {
        const stats = this.getTagStatistics();
        
        return {
            overview: {
                totalEntities: stats.totalEntities,
                totalTags: stats.totalTags,
                averageTagsPerEntity: Math.round(stats.averageTagsPerEntity * 100) / 100
            },
            hierarchy: Object.fromEntries(this.tagHierarchy),
            mostUsedTags: this.getMostUsedTags(10),
            entityBreakdown: this.getEntityBreakdown(),
            apiEndpoints: this.getAPIEndpoints()
        };
    }

    getEntityBreakdown() {
        const breakdown = {};
        
        for (const [entity, entityMap] of this.entityTagMap.entries()) {
            breakdown[entity] = {
                count: entityMap.size,
                examples: Array.from(entityMap.keys()).slice(0, 3)
            };
        }
        
        return breakdown;
    }
}

// Export for use in other modules
module.exports = TagSystemManager;

// Run if called directly
if (require.main === module) {
    const tagManager = new TagSystemManager();
    
    setTimeout(async () => {
        console.log('\n🏷️ Tag System Manager');
        console.log('====================');
        
        const documentation = tagManager.generateDocumentation();
        console.log('\n📊 System Overview:');
        console.log(`   • Total Entities: ${documentation.overview.totalEntities}`);
        console.log(`   • Total Tags: ${documentation.overview.totalTags}`);
        console.log(`   • Average Tags per Entity: ${documentation.overview.averageTagsPerEntity}`);
        
        console.log('\n🔝 Most Used Tags:');
        documentation.mostUsedTags.forEach(({ tag, count }) => {
            console.log(`   • ${tag}: ${count} uses`);
        });
        
        console.log('\n📁 Entity Breakdown:');
        Object.entries(documentation.entityBreakdown).forEach(([entity, info]) => {
            console.log(`   • ${entity}: ${info.count} items`);
        });
        
        await tagManager.saveTags();
        console.log('\n✅ Tag system initialized and saved!');
    }, 100);
}