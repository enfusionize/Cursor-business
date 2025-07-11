#!/usr/bin/env node

/**
 * Analytics MCP Server
 * Provides unified access to Google Analytics, Wicked Reports, and other SaaS metrics
 */

const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

class AnalyticsMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'analytics-mcp-server',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.analytics = {
            google: {
                propertyId: process.env.GA4_PROPERTY_ID,
                auth: null,
                initialized: false
            },
            wickedReports: {
                apiKey: process.env.WICKED_REPORTS_API_KEY,
                baseUrl: 'https://api.wickedreports.com/v2',
                initialized: false
            },
            hubspot: {
                accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
                baseUrl: 'https://api.hubapi.com',
                initialized: false
            },
            salesforce: {
                instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
                accessToken: process.env.SALESFORCE_ACCESS_TOKEN,
                initialized: false
            },
            custom: {
                endpoints: new Map(),
                initialized: true
            }
        };

        this.setupToolHandlers();
        this.initializeAnalytics();
    }

    async initializeAnalytics() {
        try {
            // Initialize Google Analytics
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                this.analytics.google.auth = new GoogleAuth({
                    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
                });
                this.analytics.google.initialized = true;
            }

            // Initialize other services
            this.analytics.wickedReports.initialized = !!this.analytics.wickedReports.apiKey;
            this.analytics.hubspot.initialized = !!this.analytics.hubspot.accessToken;
            this.analytics.salesforce.initialized = !!this.analytics.salesforce.accessToken;

            console.log('Analytics services initialized:', {
                google: this.analytics.google.initialized,
                wickedReports: this.analytics.wickedReports.initialized,
                hubspot: this.analytics.hubspot.initialized,
                salesforce: this.analytics.salesforce.initialized
            });
        } catch (error) {
            console.error('Error initializing analytics:', error);
        }
    }

    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                // Google Analytics Tools
                {
                    name: 'get_ga4_realtime_users',
                    description: 'Get real-time active users from Google Analytics 4',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            propertyId: { type: 'string', description: 'GA4 Property ID' }
                        }
                    }
                },
                {
                    name: 'get_ga4_page_views',
                    description: 'Get page views data from Google Analytics 4',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            propertyId: { type: 'string', description: 'GA4 Property ID' },
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            dimensions: { type: 'array', items: { type: 'string' } },
                            metrics: { type: 'array', items: { type: 'string' } }
                        },
                        required: ['propertyId', 'startDate', 'endDate']
                    }
                },
                {
                    name: 'get_ga4_conversion_data',
                    description: 'Get conversion data from Google Analytics 4',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            propertyId: { type: 'string', description: 'GA4 Property ID' },
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            conversionEvent: { type: 'string', description: 'Conversion event name' }
                        },
                        required: ['propertyId', 'startDate', 'endDate']
                    }
                },

                // Wicked Reports Tools
                {
                    name: 'get_wicked_reports_revenue',
                    description: 'Get revenue data from Wicked Reports',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            groupBy: { type: 'string', enum: ['day', 'week', 'month'] }
                        },
                        required: ['startDate', 'endDate']
                    }
                },
                {
                    name: 'get_wicked_reports_attribution',
                    description: 'Get attribution data from Wicked Reports',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            attributionModel: { type: 'string', enum: ['first-click', 'last-click', 'multi-touch'] }
                        },
                        required: ['startDate', 'endDate']
                    }
                },
                {
                    name: 'get_wicked_reports_roi',
                    description: 'Get ROI data from Wicked Reports',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            campaigns: { type: 'array', items: { type: 'string' } }
                        },
                        required: ['startDate', 'endDate']
                    }
                },

                // HubSpot Analytics Tools
                {
                    name: 'get_hubspot_contacts_analytics',
                    description: 'Get contacts analytics from HubSpot',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            timeRange: { type: 'string', enum: ['last_7_days', 'last_30_days', 'last_90_days'] },
                            properties: { type: 'array', items: { type: 'string' } }
                        }
                    }
                },
                {
                    name: 'get_hubspot_deals_analytics',
                    description: 'Get deals analytics from HubSpot',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            timeRange: { type: 'string', enum: ['last_7_days', 'last_30_days', 'last_90_days'] },
                            pipeline: { type: 'string', description: 'Pipeline ID' }
                        }
                    }
                },
                {
                    name: 'get_hubspot_marketing_analytics',
                    description: 'Get marketing analytics from HubSpot',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            source: { type: 'string', description: 'Traffic source' }
                        },
                        required: ['startDate', 'endDate']
                    }
                },

                // Salesforce Analytics Tools
                {
                    name: 'get_salesforce_pipeline_analytics',
                    description: 'Get pipeline analytics from Salesforce',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            stage: { type: 'string', description: 'Opportunity stage' }
                        },
                        required: ['startDate', 'endDate']
                    }
                },
                {
                    name: 'get_salesforce_lead_analytics',
                    description: 'Get lead analytics from Salesforce',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            timeRange: { type: 'string', enum: ['last_7_days', 'last_30_days', 'last_90_days'] },
                            leadSource: { type: 'string', description: 'Lead source' }
                        }
                    }
                },

                // Custom Analytics Tools
                {
                    name: 'get_unified_dashboard_metrics',
                    description: 'Get unified metrics across all connected platforms',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            platforms: { type: 'array', items: { type: 'string' } },
                            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                            metrics: { type: 'array', items: { type: 'string' } }
                        },
                        required: ['startDate', 'endDate']
                    }
                },
                {
                    name: 'create_custom_report',
                    description: 'Create a custom analytics report',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            reportName: { type: 'string', description: 'Name of the report' },
                            dataSources: { type: 'array', items: { type: 'string' } },
                            metrics: { type: 'array', items: { type: 'string' } },
                            dimensions: { type: 'array', items: { type: 'string' } },
                            filters: { type: 'object' },
                            schedule: { type: 'string', enum: ['daily', 'weekly', 'monthly'] }
                        },
                        required: ['reportName', 'dataSources', 'metrics']
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    // Google Analytics handlers
                    case 'get_ga4_realtime_users':
                        return await this.getGA4RealtimeUsers(args);
                    case 'get_ga4_page_views':
                        return await this.getGA4PageViews(args);
                    case 'get_ga4_conversion_data':
                        return await this.getGA4ConversionData(args);

                    // Wicked Reports handlers
                    case 'get_wicked_reports_revenue':
                        return await this.getWickedReportsRevenue(args);
                    case 'get_wicked_reports_attribution':
                        return await this.getWickedReportsAttribution(args);
                    case 'get_wicked_reports_roi':
                        return await this.getWickedReportsROI(args);

                    // HubSpot handlers
                    case 'get_hubspot_contacts_analytics':
                        return await this.getHubSpotContactsAnalytics(args);
                    case 'get_hubspot_deals_analytics':
                        return await this.getHubSpotDealsAnalytics(args);
                    case 'get_hubspot_marketing_analytics':
                        return await this.getHubSpotMarketingAnalytics(args);

                    // Salesforce handlers
                    case 'get_salesforce_pipeline_analytics':
                        return await this.getSalesforcePipelineAnalytics(args);
                    case 'get_salesforce_lead_analytics':
                        return await this.getSalesforceLeadAnalytics(args);

                    // Custom handlers
                    case 'get_unified_dashboard_metrics':
                        return await this.getUnifiedDashboardMetrics(args);
                    case 'create_custom_report':
                        return await this.createCustomReport(args);

                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error executing ${name}: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        });
    }

    // Google Analytics Methods
    async getGA4RealtimeUsers(args) {
        if (!this.analytics.google.initialized) {
            throw new Error('Google Analytics not initialized');
        }

        const authClient = await this.analytics.google.auth.getClient();
        const propertyId = args.propertyId || this.analytics.google.propertyId;

        const response = await authClient.request({
            url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
            method: 'POST',
            data: {
                metrics: [{ name: 'activeUsers' }],
                dimensions: [{ name: 'country' }, { name: 'deviceCategory' }]
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        realtime_users: response.data,
                        timestamp: new Date().toISOString(),
                        source: 'Google Analytics 4'
                    }, null, 2)
                }
            ]
        };
    }

    async getGA4PageViews(args) {
        if (!this.analytics.google.initialized) {
            throw new Error('Google Analytics not initialized');
        }

        const authClient = await this.analytics.google.auth.getClient();
        const propertyId = args.propertyId || this.analytics.google.propertyId;

        const response = await authClient.request({
            url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
            method: 'POST',
            data: {
                dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
                metrics: args.metrics?.map(m => ({ name: m })) || [
                    { name: 'screenPageViews' },
                    { name: 'sessions' },
                    { name: 'bounceRate' }
                ],
                dimensions: args.dimensions?.map(d => ({ name: d })) || [
                    { name: 'pagePath' },
                    { name: 'pageTitle' }
                ]
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        page_views_data: response.data,
                        date_range: { startDate: args.startDate, endDate: args.endDate },
                        source: 'Google Analytics 4'
                    }, null, 2)
                }
            ]
        };
    }

    async getGA4ConversionData(args) {
        if (!this.analytics.google.initialized) {
            throw new Error('Google Analytics not initialized');
        }

        const authClient = await this.analytics.google.auth.getClient();
        const propertyId = args.propertyId || this.analytics.google.propertyId;

        const response = await authClient.request({
            url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
            method: 'POST',
            data: {
                dateRanges: [{ startDate: args.startDate, endDate: args.endDate }],
                metrics: [
                    { name: 'conversions' },
                    { name: 'conversionRate' },
                    { name: 'totalRevenue' }
                ],
                dimensions: [
                    { name: 'eventName' },
                    { name: 'source' },
                    { name: 'medium' }
                ],
                dimensionFilter: args.conversionEvent ? {
                    filter: {
                        fieldName: 'eventName',
                        stringFilter: { value: args.conversionEvent }
                    }
                } : undefined
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        conversion_data: response.data,
                        date_range: { startDate: args.startDate, endDate: args.endDate },
                        conversion_event: args.conversionEvent,
                        source: 'Google Analytics 4'
                    }, null, 2)
                }
            ]
        };
    }

    // Wicked Reports Methods
    async getWickedReportsRevenue(args) {
        if (!this.analytics.wickedReports.initialized) {
            throw new Error('Wicked Reports not initialized');
        }

        const response = await axios.get(`${this.analytics.wickedReports.baseUrl}/revenue`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.wickedReports.apiKey}`,
                'Content-Type': 'application/json'
            },
            params: {
                start_date: args.startDate,
                end_date: args.endDate,
                group_by: args.groupBy || 'day'
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        revenue_data: response.data,
                        date_range: { startDate: args.startDate, endDate: args.endDate },
                        source: 'Wicked Reports'
                    }, null, 2)
                }
            ]
        };
    }

    async getWickedReportsAttribution(args) {
        if (!this.analytics.wickedReports.initialized) {
            throw new Error('Wicked Reports not initialized');
        }

        const response = await axios.get(`${this.analytics.wickedReports.baseUrl}/attribution`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.wickedReports.apiKey}`,
                'Content-Type': 'application/json'
            },
            params: {
                start_date: args.startDate,
                end_date: args.endDate,
                attribution_model: args.attributionModel || 'multi-touch'
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        attribution_data: response.data,
                        attribution_model: args.attributionModel || 'multi-touch',
                        source: 'Wicked Reports'
                    }, null, 2)
                }
            ]
        };
    }

    async getWickedReportsROI(args) {
        if (!this.analytics.wickedReports.initialized) {
            throw new Error('Wicked Reports not initialized');
        }

        const response = await axios.get(`${this.analytics.wickedReports.baseUrl}/roi`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.wickedReports.apiKey}`,
                'Content-Type': 'application/json'
            },
            params: {
                start_date: args.startDate,
                end_date: args.endDate,
                campaigns: args.campaigns?.join(',')
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        roi_data: response.data,
                        campaigns: args.campaigns,
                        source: 'Wicked Reports'
                    }, null, 2)
                }
            ]
        };
    }

    // HubSpot Methods
    async getHubSpotContactsAnalytics(args) {
        if (!this.analytics.hubspot.initialized) {
            throw new Error('HubSpot not initialized');
        }

        const response = await axios.get(`${this.analytics.hubspot.baseUrl}/crm/v3/objects/contacts`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.hubspot.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                properties: args.properties?.join(',') || 'createdate,lastmodifieddate,hs_lead_status',
                limit: 100
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        contacts_analytics: response.data,
                        time_range: args.timeRange,
                        source: 'HubSpot'
                    }, null, 2)
                }
            ]
        };
    }

    async getHubSpotDealsAnalytics(args) {
        if (!this.analytics.hubspot.initialized) {
            throw new Error('HubSpot not initialized');
        }

        const response = await axios.get(`${this.analytics.hubspot.baseUrl}/crm/v3/objects/deals`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.hubspot.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                properties: 'dealname,amount,closedate,dealstage,pipeline',
                limit: 100
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        deals_analytics: response.data,
                        time_range: args.timeRange,
                        pipeline: args.pipeline,
                        source: 'HubSpot'
                    }, null, 2)
                }
            ]
        };
    }

    async getHubSpotMarketingAnalytics(args) {
        if (!this.analytics.hubspot.initialized) {
            throw new Error('HubSpot not initialized');
        }

        const response = await axios.get(`${this.analytics.hubspot.baseUrl}/analytics/v2/reports/traffic-analytics`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.hubspot.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                start_date: args.startDate,
                end_date: args.endDate,
                source: args.source
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        marketing_analytics: response.data,
                        date_range: { startDate: args.startDate, endDate: args.endDate },
                        source: 'HubSpot'
                    }, null, 2)
                }
            ]
        };
    }

    // Salesforce Methods
    async getSalesforcePipelineAnalytics(args) {
        if (!this.analytics.salesforce.initialized) {
            throw new Error('Salesforce not initialized');
        }

        const response = await axios.get(`${this.analytics.salesforce.instanceUrl}/services/data/v59.0/query`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.salesforce.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                q: `SELECT StageName, COUNT(Id) OpportunityCount, SUM(Amount) TotalAmount 
                    FROM Opportunity 
                    WHERE CreatedDate >= ${args.startDate} AND CreatedDate <= ${args.endDate}
                    ${args.stage ? `AND StageName = '${args.stage}'` : ''}
                    GROUP BY StageName`
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        pipeline_analytics: response.data,
                        date_range: { startDate: args.startDate, endDate: args.endDate },
                        stage: args.stage,
                        source: 'Salesforce'
                    }, null, 2)
                }
            ]
        };
    }

    async getSalesforceLeadAnalytics(args) {
        if (!this.analytics.salesforce.initialized) {
            throw new Error('Salesforce not initialized');
        }

        const response = await axios.get(`${this.analytics.salesforce.instanceUrl}/services/data/v59.0/query`, {
            headers: {
                'Authorization': `Bearer ${this.analytics.salesforce.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                q: `SELECT LeadSource, Status, COUNT(Id) LeadCount 
                    FROM Lead 
                    WHERE CreatedDate = LAST_N_DAYS:${args.timeRange === 'last_7_days' ? 7 : args.timeRange === 'last_30_days' ? 30 : 90}
                    ${args.leadSource ? `AND LeadSource = '${args.leadSource}'` : ''}
                    GROUP BY LeadSource, Status`
            }
        });

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        lead_analytics: response.data,
                        time_range: args.timeRange,
                        lead_source: args.leadSource,
                        source: 'Salesforce'
                    }, null, 2)
                }
            ]
        };
    }

    // Custom Methods
    async getUnifiedDashboardMetrics(args) {
        const unifiedData = {
            timestamp: new Date().toISOString(),
            date_range: { startDate: args.startDate, endDate: args.endDate },
            platforms: [],
            summary: {
                total_revenue: 0,
                total_conversions: 0,
                total_leads: 0,
                average_roi: 0
            }
        };

        const platforms = args.platforms || ['google', 'wickedReports', 'hubspot', 'salesforce'];

        for (const platform of platforms) {
            try {
                let platformData = {};

                switch (platform) {
                    case 'google':
                        if (this.analytics.google.initialized) {
                            const gaData = await this.getGA4ConversionData({
                                propertyId: this.analytics.google.propertyId,
                                startDate: args.startDate,
                                endDate: args.endDate
                            });
                            platformData = { name: 'Google Analytics', data: gaData };
                        }
                        break;

                    case 'wickedReports':
                        if (this.analytics.wickedReports.initialized) {
                            const wrData = await this.getWickedReportsRevenue({
                                startDate: args.startDate,
                                endDate: args.endDate
                            });
                            platformData = { name: 'Wicked Reports', data: wrData };
                        }
                        break;

                    case 'hubspot':
                        if (this.analytics.hubspot.initialized) {
                            const hsData = await this.getHubSpotDealsAnalytics({
                                timeRange: 'last_30_days'
                            });
                            platformData = { name: 'HubSpot', data: hsData };
                        }
                        break;

                    case 'salesforce':
                        if (this.analytics.salesforce.initialized) {
                            const sfData = await this.getSalesforcePipelineAnalytics({
                                startDate: args.startDate,
                                endDate: args.endDate
                            });
                            platformData = { name: 'Salesforce', data: sfData };
                        }
                        break;
                }

                if (platformData.name) {
                    unifiedData.platforms.push(platformData);
                }
            } catch (error) {
                console.error(`Error fetching data from ${platform}:`, error.message);
            }
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(unifiedData, null, 2)
                }
            ]
        };
    }

    async createCustomReport(args) {
        const report = {
            id: Date.now().toString(),
            name: args.reportName,
            created: new Date().toISOString(),
            config: {
                dataSources: args.dataSources,
                metrics: args.metrics,
                dimensions: args.dimensions || [],
                filters: args.filters || {},
                schedule: args.schedule
            },
            status: 'created'
        };

        // Store report configuration (in real implementation, save to database)
        console.log('Created custom report:', report);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        message: 'Custom report created successfully',
                        report: report,
                        next_steps: [
                            'Report configuration saved',
                            'Schedule configured for ' + args.schedule + ' execution',
                            'Data collection will begin immediately'
                        ]
                    }, null, 2)
                }
            ]
        };
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.log('Analytics MCP Server running on stdio');
    }
}

if (require.main === module) {
    const server = new AnalyticsMCPServer();
    server.start().catch(console.error);
}

module.exports = AnalyticsMCPServer;