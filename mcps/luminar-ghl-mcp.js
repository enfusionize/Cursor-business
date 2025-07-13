#!/usr/bin/env node

/**
 * Luminar GoHighLevel MCP Server
 * Comprehensive integration for GHL CRM and marketing automation
 * Part of the Luminar Tech Stack Infrastructure
 */

const express = require('express');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { EventEmitter } = require('events');
const chalk = require('chalk');
const winston = require('winston');

class LuminarGHLMCP extends EventEmitter {
    constructor() {
        super();
        this.config = this.loadConfig();
        this.app = express();
        this.logger = this.setupLogger();
        this.ghlClient = null;
        this.webhookQueue = [];
        this.retryAttempts = new Map();
        
        this.setupExpress();
        this.initializeGHLClient();
        this.setupWebhookHandlers();
        this.startHealthMonitoring();
    }

    loadConfig() {
        return {
            port: process.env.LUMINAR_GHL_PORT || 3200,
            ghlApiKey: process.env.GHL_API_KEY,
            ghlLocationId: process.env.GHL_LOCATION_ID,
            webhookSecret: process.env.GHL_WEBHOOK_SECRET,
            n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
            fastApiBaseUrl: process.env.FASTAPI_BASE_URL || 'http://localhost:8000',
            slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
            retryAttempts: 3,
            retryDelay: 30000, // 30 seconds
            standardTags: {
                sources: ['src_paid', 'src_organic', 'src_referral', 'src_direct'],
                stages: ['stage_landing_submitted', 'stage_tripwire', 'stage_call_booked', 'stage_customer'],
                behaviors: ['rt_proreport_abandon', 'bought_tripwire', 'booked_call', 'call_no_show']
            }
        };
    }

    setupLogger() {
        return winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: { service: 'luminar-ghl-mcp' },
            transports: [
                new winston.transports.File({ 
                    filename: path.join(__dirname, '../logs/luminar-ghl-error.log'), 
                    level: 'error' 
                }),
                new winston.transports.File({ 
                    filename: path.join(__dirname, '../logs/luminar-ghl-combined.log') 
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        });
    }

    setupExpress() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            next();
        });

        this.setupRoutes();
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                service: 'luminar-ghl-mcp',
                timestamp: new Date().toISOString(),
                config: {
                    hasApiKey: !!this.config.ghlApiKey,
                    hasLocationId: !!this.config.ghlLocationId,
                    webhookQueueSize: this.webhookQueue.length
                }
            });
        });

        // GHL webhook receiver
        this.app.post('/webhook/ghl', this.handleGHLWebhook.bind(this));

        // Contact management
        this.app.post('/contacts/create', this.createContact.bind(this));
        this.app.get('/contacts/:contactId', this.getContact.bind(this));
        this.app.put('/contacts/:contactId', this.updateContact.bind(this));
        this.app.post('/contacts/:contactId/tags', this.addContactTags.bind(this));
        this.app.delete('/contacts/:contactId/tags', this.removeContactTags.bind(this));

        // Campaign management
        this.app.get('/campaigns', this.getCampaigns.bind(this));
        this.app.post('/campaigns/:campaignId/trigger', this.triggerCampaign.bind(this));

        // Pipeline management
        this.app.get('/pipelines', this.getPipelines.bind(this));
        this.app.post('/pipelines/:pipelineId/opportunities', this.createOpportunity.bind(this));
        this.app.put('/opportunities/:opportunityId/stage', this.updateOpportunityStage.bind(this));

        // Analytics and reporting
        this.app.get('/analytics/contacts', this.getContactAnalytics.bind(this));
        this.app.get('/analytics/campaigns', this.getCampaignAnalytics.bind(this));
        this.app.get('/analytics/funnels', this.getFunnelAnalytics.bind(this));

        // AI Agent endpoints
        this.app.post('/ai-agent/score-contact', this.scoreContact.bind(this));
        this.app.post('/ai-agent/optimize-campaign', this.optimizeCampaign.bind(this));
        this.app.post('/ai-agent/auto-tag', this.autoTagContact.bind(this));

        // Bulk operations
        this.app.post('/bulk/import-contacts', this.bulkImportContacts.bind(this));
        this.app.post('/bulk/update-tags', this.bulkUpdateTags.bind(this));
        this.app.post('/bulk/trigger-campaigns', this.bulkTriggerCampaigns.bind(this));

        // Error handling middleware
        this.app.use(this.errorHandler.bind(this));
    }

    async initializeGHLClient() {
        if (!this.config.ghlApiKey) {
            this.logger.error('GHL API key not provided');
            return;
        }

        this.ghlClient = axios.create({
            baseURL: 'https://services.leadconnectorhq.com',
            headers: {
                'Authorization': `Bearer ${this.config.ghlApiKey}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            timeout: 30000
        });

        // Test connection
        try {
            await this.ghlClient.get('/locations');
            this.logger.info('GHL client initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize GHL client:', error.message);
        }
    }

    setupWebhookHandlers() {
        // Process webhook queue every 5 seconds
        setInterval(() => {
            this.processWebhookQueue();
        }, 5000);

        // Retry failed webhooks every 30 seconds
        setInterval(() => {
            this.retryFailedWebhooks();
        }, 30000);
    }

    async handleGHLWebhook(req, res) {
        const webhookData = req.body;
        const eventId = webhookData.id || Date.now().toString();
        
        this.logger.info('Received GHL webhook', {
            eventId,
            type: webhookData.type,
            contactId: webhookData.contactId
        });

        try {
            // Verify webhook signature if secret is provided
            if (this.config.webhookSecret) {
                const signature = req.headers['x-ghl-signature'];
                if (!this.verifyWebhookSignature(req.body, signature)) {
                    return res.status(401).json({ error: 'Invalid signature' });
                }
            }

            // Add to processing queue
            this.webhookQueue.push({
                id: eventId,
                data: webhookData,
                timestamp: new Date(),
                attempts: 0
            });

            // Immediate response to GHL
            res.status(200).json({ 
                status: 'received', 
                eventId,
                queuePosition: this.webhookQueue.length
            });

            // Process immediately if queue is small
            if (this.webhookQueue.length <= 5) {
                setTimeout(() => this.processWebhookQueue(), 100);
            }

        } catch (error) {
            this.logger.error('Error handling GHL webhook:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async processWebhookQueue() {
        if (this.webhookQueue.length === 0) return;

        const webhook = this.webhookQueue.shift();
        
        try {
            await this.processWebhookEvent(webhook);
            
            // Tag success in GHL
            if (webhook.data.contactId) {
                await this.addSuccessTag(webhook.data.contactId, webhook.data.type);
            }

            this.logger.info('Webhook processed successfully', {
                eventId: webhook.id,
                type: webhook.data.type
            });

        } catch (error) {
            this.logger.error('Webhook processing failed', {
                eventId: webhook.id,
                error: error.message,
                attempts: webhook.attempts
            });

            // Retry logic
            webhook.attempts++;
            if (webhook.attempts < this.config.retryAttempts) {
                this.retryAttempts.set(webhook.id, webhook);
            } else {
                await this.handleWebhookFailure(webhook, error);
            }
        }
    }

    async processWebhookEvent(webhook) {
        const { data } = webhook;
        
        switch (data.type) {
            case 'ContactCreate':
                await this.handleContactCreate(data);
                break;
            case 'ContactUpdate':
                await this.handleContactUpdate(data);
                break;
            case 'ContactTagUpdate':
                await this.handleContactTagUpdate(data);
                break;
            case 'OpportunityCreate':
                await this.handleOpportunityCreate(data);
                break;
            case 'OpportunityStageUpdate':
                await this.handleOpportunityStageUpdate(data);
                break;
            case 'FormSubmission':
                await this.handleFormSubmission(data);
                break;
            case 'EmailClick':
                await this.handleEmailClick(data);
                break;
            case 'SMSReply':
                await this.handleSMSReply(data);
                break;
            default:
                this.logger.warn('Unknown webhook type:', data.type);
        }

        // Forward to n8n if configured
        if (this.config.n8nWebhookUrl) {
            await this.forwardToN8n(webhook);
        }
    }

    async handleContactCreate(data) {
        this.logger.info('Processing contact creation', { contactId: data.contactId });
        
        // Auto-tag based on source
        const sourceTags = this.determineSourceTags(data);
        if (sourceTags.length > 0) {
            await this.addContactTags({ params: { contactId: data.contactId } }, null, sourceTags);
        }

        // Trigger scoring via FastAPI
        await this.triggerContactScoring(data.contactId);

        // Send Slack notification for high-value leads
        if (data.customFields && data.customFields.company_size > 100) {
            await this.sendSlackAlert('high-value-lead', {
                contactId: data.contactId,
                email: data.email,
                company: data.customFields.company
            });
        }
    }

    async handleContactTagUpdate(data) {
        this.logger.info('Processing tag update', { 
            contactId: data.contactId, 
            tags: data.tags 
        });

        // Check for trigger tags
        const triggerTags = ['bought_tripwire', 'booked_call', 'call_no_show'];
        const addedTags = data.tags.filter(tag => triggerTags.includes(tag));

        for (const tag of addedTags) {
            await this.handleTagTrigger(data.contactId, tag);
        }
    }

    async handleTagTrigger(contactId, tag) {
        switch (tag) {
            case 'bought_tripwire':
                await this.handleTripwirePurchase(contactId);
                break;
            case 'booked_call':
                await this.handleCallBooking(contactId);
                break;
            case 'call_no_show':
                await this.handleCallNoShow(contactId);
                break;
        }
    }

    async handleTripwirePurchase(contactId) {
        this.logger.info('Processing tripwire purchase', { contactId });

        // Get contact details
        const contact = await this.getContactById(contactId);
        
        // Create trial account via FastAPI
        await this.createTrialAccount(contact);
        
        // Start onboarding sequence
        await this.triggerCampaign({ 
            params: { campaignId: 'onboarding-sequence' } 
        }, null, { contactId });
        
        // Notify SDR if high score
        const score = await this.getContactScore(contactId);
        if (score > 75) {
            await this.notifySDR(contactId, 'high-score-tripwire');
        }

        // Send Slack alert
        await this.sendSlackAlert('tripwire-purchase', {
            contactId,
            email: contact.email,
            score
        });
    }

    async handleCallBooking(contactId) {
        this.logger.info('Processing call booking', { contactId });

        // Get booking metadata
        const contact = await this.getContactById(contactId);
        
        // Store LTV projection via FastAPI
        await this.calculateAndStoreLTV(contactId, contact);
        
        // Update opportunity stage
        const opportunities = await this.getContactOpportunities(contactId);
        if (opportunities.length > 0) {
            await this.updateOpportunityStage({
                params: { opportunityId: opportunities[0].id }
            }, null, { stage: 'call-scheduled' });
        }

        // Send booking confirmation
        await this.sendBookingConfirmation(contact);
    }

    async handleCallNoShow(contactId) {
        this.logger.info('Processing call no-show', { contactId });

        // Start retargeting sequence
        await this.startRetargetingSequence(contactId);
        
        // Trigger retargeting ads
        await this.triggerRetargetingAds(contactId);
        
        // Notify sales team
        await this.sendSlackAlert('call-no-show', { contactId });
    }

    // Contact management methods
    async createContact(req, res) {
        try {
            const contactData = req.body;
            const response = await this.ghlClient.post('/contacts', {
                locationId: this.config.ghlLocationId,
                ...contactData
            });

            res.json(response.data);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getContact(req, res) {
        try {
            const { contactId } = req.params;
            const response = await this.ghlClient.get(`/contacts/${contactId}`);
            res.json(response.data);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async updateContact(req, res) {
        try {
            const { contactId } = req.params;
            const updateData = req.body;
            
            const response = await this.ghlClient.put(`/contacts/${contactId}`, updateData);
            res.json(response.data);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async addContactTags(req, res, tags = null) {
        try {
            const { contactId } = req.params;
            const tagsToAdd = tags || req.body.tags;
            
            const response = await this.ghlClient.post(`/contacts/${contactId}/tags`, {
                tags: tagsToAdd
            });

            if (res) res.json(response.data);
            return response.data;
        } catch (error) {
            if (res) this.handleError(error, res);
            throw error;
        }
    }

    async removeContactTags(req, res) {
        try {
            const { contactId } = req.params;
            const { tags } = req.body;
            
            const response = await this.ghlClient.delete(`/contacts/${contactId}/tags`, {
                data: { tags }
            });

            res.json(response.data);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    // AI Agent methods
    async scoreContact(req, res) {
        try {
            const { contactId } = req.body;
            
            // Get contact data
            const contact = await this.getContactById(contactId);
            
            // Call FastAPI scoring endpoint
            const scoreResponse = await axios.post(`${this.config.fastApiBaseUrl}/ai-agent/score-contact`, {
                contact,
                historicalData: await this.getContactHistory(contactId)
            });

            const score = scoreResponse.data.score;
            
            // Update contact with score
            await this.updateContact({
                params: { contactId }
            }, null, {
                customFields: { ai_score: score }
            });

            // Auto-tag based on score
            if (score > 90) {
                await this.addContactTags({ params: { contactId } }, null, ['agent_score_95+']);
            } else if (score > 75) {
                await this.addContactTags({ params: { contactId } }, null, ['agent_score_75+']);
            }

            res.json({ contactId, score, updated: true });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async optimizeCampaign(req, res) {
        try {
            const { campaignId, optimizationType } = req.body;
            
            // Get campaign performance data
            const performance = await this.getCampaignPerformance(campaignId);
            
            // Call FastAPI optimization endpoint
            const optimizationResponse = await axios.post(`${this.config.fastApiBaseUrl}/ai-agent/optimize-campaign`, {
                campaignId,
                performance,
                optimizationType
            });

            const optimizations = optimizationResponse.data;
            
            // Apply optimizations
            if (optimizations.subject_lines) {
                await this.updateCampaignSubjects(campaignId, optimizations.subject_lines);
            }
            
            if (optimizations.pause_ads) {
                await this.pauseCampaignAds(campaignId);
            }

            res.json({ 
                campaignId, 
                optimizations: optimizations.actions_taken,
                performance: performance 
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    // Analytics methods
    async getContactAnalytics(req, res) {
        try {
            const { startDate, endDate, tags } = req.query;
            
            const analytics = await this.calculateContactAnalytics({
                startDate,
                endDate,
                tags: tags ? tags.split(',') : null
            });

            res.json(analytics);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getFunnelAnalytics(req, res) {
        try {
            const { funnelId, timeframe } = req.query;
            
            const analytics = await this.calculateFunnelAnalytics(funnelId, timeframe);
            
            res.json(analytics);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    // Utility methods
    async getContactById(contactId) {
        const response = await this.ghlClient.get(`/contacts/${contactId}`);
        return response.data.contact;
    }

    async getContactScore(contactId) {
        try {
            const contact = await this.getContactById(contactId);
            return contact.customFields?.ai_score || 0;
        } catch (error) {
            return 0;
        }
    }

    async addSuccessTag(contactId, eventType) {
        const tag = `n8n_success_${eventType}_${new Date().toISOString().split('T')[0]}`;
        await this.addContactTags({ params: { contactId } }, null, [tag]);
    }

    async sendSlackAlert(alertType, data) {
        if (!this.config.slackWebhookUrl) return;

        const messages = {
            'high-value-lead': `🎯 High-value lead detected: ${data.email} from ${data.company}`,
            'tripwire-purchase': `💰 Tripwire purchase: ${data.email} (Score: ${data.score})`,
            'call-no-show': `⚠️ Call no-show: Contact ${data.contactId}`,
            'system-error': `🚨 System error: ${data.error}`
        };

        try {
            await axios.post(this.config.slackWebhookUrl, {
                text: messages[alertType] || `📢 Alert: ${alertType}`,
                channel: this.getSlackChannel(alertType)
            });
        } catch (error) {
            this.logger.error('Failed to send Slack alert:', error.message);
        }
    }

    getSlackChannel(alertType) {
        const channels = {
            'high-value-lead': '#leads-premium',
            'tripwire-purchase': '#leads-tripwire',
            'call-no-show': '#calls-no-show',
            'system-error': '#system-alerts'
        };
        return channels[alertType] || '#general';
    }

    determineSourceTags(data) {
        const tags = [];
        
        if (data.source) {
            if (data.source.includes('google') || data.source.includes('facebook')) {
                tags.push('src_paid');
            } else if (data.source.includes('organic')) {
                tags.push('src_organic');
            } else if (data.source.includes('referral')) {
                tags.push('src_referral');
            } else {
                tags.push('src_direct');
            }
        }
        
        return tags;
    }

    async forwardToN8n(webhook) {
        if (!this.config.n8nWebhookUrl) return;

        try {
            await axios.post(this.config.n8nWebhookUrl, webhook.data, {
                timeout: 10000
            });
        } catch (error) {
            this.logger.error('Failed to forward to n8n:', error.message);
        }
    }

    async retryFailedWebhooks() {
        for (const [eventId, webhook] of this.retryAttempts) {
            if (webhook.attempts < this.config.retryAttempts) {
                this.logger.info(`Retrying webhook ${eventId}, attempt ${webhook.attempts + 1}`);
                this.webhookQueue.push(webhook);
                this.retryAttempts.delete(eventId);
            }
        }
    }

    async handleWebhookFailure(webhook, error) {
        this.logger.error('Webhook permanently failed', {
            eventId: webhook.id,
            error: error.message,
            attempts: webhook.attempts
        });

        // Send alert
        await this.sendSlackAlert('system-error', {
            error: `Webhook ${webhook.id} failed after ${webhook.attempts} attempts`
        });

        // Store failure for manual review
        await this.storeFailed Webhook(webhook, error);
    }

    startHealthMonitoring() {
        setInterval(async () => {
            try {
                await this.ghlClient.get('/locations');
                this.emit('health-check', { status: 'healthy', timestamp: new Date() });
            } catch (error) {
                this.emit('health-check', { status: 'unhealthy', error: error.message, timestamp: new Date() });
            }
        }, 60000); // Check every minute
    }

    errorHandler(error, req, res, next) {
        this.logger.error('API Error:', {
            error: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method
        });

        res.status(error.status || 500).json({
            error: 'Internal server error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }

    handleError(error, res) {
        this.logger.error('Request error:', error.message);
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data
        });
    }

    start() {
        const server = this.app.listen(this.config.port, () => {
            console.log(chalk.green(`🚀 Luminar GHL MCP Server running on port ${this.config.port}`));
            this.logger.info(`Luminar GHL MCP Server started on port ${this.config.port}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log(chalk.yellow('📡 Shutting down Luminar GHL MCP Server...'));
            server.close(() => {
                this.logger.info('Luminar GHL MCP Server shut down gracefully');
                process.exit(0);
            });
        });

        return server;
    }
}

// Start server if run directly
if (require.main === module) {
    const server = new LuminarGHLMCP();
    server.start();
}

module.exports = LuminarGHLMCP;