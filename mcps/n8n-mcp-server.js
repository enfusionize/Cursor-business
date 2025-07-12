#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

class N8nMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'n8n-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.n8nBaseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.n8nApiKey = process.env.N8N_API_KEY;
    this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_workflows',
            description: 'List all available n8n workflows',
            inputSchema: {
              type: 'object',
              properties: {
                active_only: {
                  type: 'boolean',
                  description: 'Only return active workflows',
                  default: false
                }
              }
            }
          },
          {
            name: 'execute_workflow',
            description: 'Execute a specific n8n workflow by ID',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_id: {
                  type: 'string',
                  description: 'The ID of the workflow to execute'
                },
                data: {
                  type: 'object',
                  description: 'Data to pass to the workflow execution',
                  default: {}
                }
              },
              required: ['workflow_id']
            }
          },
          {
            name: 'get_workflow_details',
            description: 'Get detailed information about a specific workflow',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_id: {
                  type: 'string',
                  description: 'The ID of the workflow to get details for'
                }
              },
              required: ['workflow_id']
            }
          },
          {
            name: 'create_workflow',
            description: 'Create a new n8n workflow',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the workflow'
                },
                nodes: {
                  type: 'array',
                  description: 'Array of workflow nodes'
                },
                connections: {
                  type: 'object',
                  description: 'Workflow connections between nodes'
                },
                active: {
                  type: 'boolean',
                  description: 'Whether the workflow should be active',
                  default: false
                }
              },
              required: ['name', 'nodes', 'connections']
            }
          },
          {
            name: 'update_workflow',
            description: 'Update an existing n8n workflow',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_id: {
                  type: 'string',
                  description: 'The ID of the workflow to update'
                },
                name: {
                  type: 'string',
                  description: 'New name for the workflow'
                },
                nodes: {
                  type: 'array',
                  description: 'Updated array of workflow nodes'
                },
                connections: {
                  type: 'object',
                  description: 'Updated workflow connections'
                },
                active: {
                  type: 'boolean',
                  description: 'Whether the workflow should be active'
                }
              },
              required: ['workflow_id']
            }
          },
          {
            name: 'delete_workflow',
            description: 'Delete a workflow from n8n',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_id: {
                  type: 'string',
                  description: 'The ID of the workflow to delete'
                }
              },
              required: ['workflow_id']
            }
          },
          {
            name: 'get_execution_history',
            description: 'Get execution history for a workflow',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_id: {
                  type: 'string',
                  description: 'The ID of the workflow'
                },
                limit: {
                  type: 'number',
                  description: 'Number of executions to return',
                  default: 10
                }
              },
              required: ['workflow_id']
            }
          },
          {
            name: 'trigger_webhook',
            description: 'Trigger a workflow via webhook',
            inputSchema: {
              type: 'object',
              properties: {
                webhook_path: {
                  type: 'string',
                  description: 'The webhook path to trigger'
                },
                data: {
                  type: 'object',
                  description: 'Data to send with the webhook',
                  default: {}
                }
              },
              required: ['webhook_path']
            }
          },
          {
            name: 'get_workflow_statistics',
            description: 'Get statistics for a workflow',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_id: {
                  type: 'string',
                  description: 'The ID of the workflow'
                },
                days: {
                  type: 'number',
                  description: 'Number of days to get statistics for',
                  default: 30
                }
              },
              required: ['workflow_id']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_workflows':
            return await this.listWorkflows(args.active_only);
          case 'execute_workflow':
            return await this.executeWorkflow(args.workflow_id, args.data);
          case 'get_workflow_details':
            return await this.getWorkflowDetails(args.workflow_id);
          case 'create_workflow':
            return await this.createWorkflow(args);
          case 'update_workflow':
            return await this.updateWorkflow(args);
          case 'delete_workflow':
            return await this.deleteWorkflow(args.workflow_id);
          case 'get_execution_history':
            return await this.getExecutionHistory(args.workflow_id, args.limit);
          case 'trigger_webhook':
            return await this.triggerWebhook(args.webhook_path, args.data);
          case 'get_workflow_statistics':
            return await this.getWorkflowStatistics(args.workflow_id, args.days);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      url: `${this.n8nBaseUrl}/api/v1${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': this.n8nApiKey
      }
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`n8n API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async listWorkflows(activeOnly = false) {
    const workflows = await this.makeRequest('/workflows');
    let filteredWorkflows = workflows.data || workflows;

    if (activeOnly) {
      filteredWorkflows = filteredWorkflows.filter(w => w.active);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Found ${filteredWorkflows.length} workflow(s):\n\n${filteredWorkflows.map(w => 
            `- ID: ${w.id}\n  Name: ${w.name}\n  Active: ${w.active}\n  Created: ${w.createdAt}\n`
          ).join('\n')}`
        }
      ]
    };
  }

  async executeWorkflow(workflowId, data = {}) {
    const execution = await this.makeRequest(`/workflows/${workflowId}/execute`, 'POST', {
      data
    });

    return {
      content: [
        {
          type: 'text',
          text: `Workflow execution started:\n\nExecution ID: ${execution.id}\nStatus: ${execution.status}\nStarted: ${execution.startedAt}`
        }
      ]
    };
  }

  async getWorkflowDetails(workflowId) {
    const workflow = await this.makeRequest(`/workflows/${workflowId}`);

    return {
      content: [
        {
          type: 'text',
          text: `Workflow Details:\n\nID: ${workflow.id}\nName: ${workflow.name}\nActive: ${workflow.active}\nNodes: ${workflow.nodes?.length || 0}\nCreated: ${workflow.createdAt}\nUpdated: ${workflow.updatedAt}`
        }
      ]
    };
  }

  async createWorkflow(args) {
    const workflow = await this.makeRequest('/workflows', 'POST', {
      name: args.name,
      nodes: args.nodes,
      connections: args.connections,
      active: args.active || false
    });

    return {
      content: [
        {
          type: 'text',
          text: `Workflow created successfully:\n\nID: ${workflow.id}\nName: ${workflow.name}\nActive: ${workflow.active}`
        }
      ]
    };
  }

  async updateWorkflow(args) {
    const workflow = await this.makeRequest(`/workflows/${args.workflow_id}`, 'PUT', {
      name: args.name,
      nodes: args.nodes,
      connections: args.connections,
      active: args.active
    });

    return {
      content: [
        {
          type: 'text',
          text: `Workflow updated successfully:\n\nID: ${workflow.id}\nName: ${workflow.name}\nActive: ${workflow.active}`
        }
      ]
    };
  }

  async deleteWorkflow(workflowId) {
    await this.makeRequest(`/workflows/${workflowId}`, 'DELETE');

    return {
      content: [
        {
          type: 'text',
          text: `Workflow ${workflowId} deleted successfully.`
        }
      ]
    };
  }

  async getExecutionHistory(workflowId, limit = 10) {
    const executions = await this.makeRequest(`/executions?workflowId=${workflowId}&limit=${limit}`);

    return {
      content: [
        {
          type: 'text',
          text: `Execution History for Workflow ${workflowId}:\n\n${executions.data?.map(exec => 
            `- Execution ID: ${exec.id}\n  Status: ${exec.status}\n  Started: ${exec.startedAt}\n  Finished: ${exec.finishedAt || 'Running'}\n`
          ).join('\n') || 'No executions found.'}`
        }
      ]
    };
  }

  async triggerWebhook(webhookPath, data = {}) {
    const webhookUrl = `${this.n8nBaseUrl}/webhook/${webhookPath}`;
    
    try {
      const response = await axios.post(webhookUrl, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        content: [
          {
            type: 'text',
            text: `Webhook triggered successfully:\n\nPath: ${webhookPath}\nStatus: ${response.status}\nResponse: ${JSON.stringify(response.data, null, 2)}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Webhook trigger failed: ${error.message}`);
    }
  }

  async getWorkflowStatistics(workflowId, days = 30) {
    const stats = await this.makeRequest(`/workflows/${workflowId}/statistics?days=${days}`);

    return {
      content: [
        {
          type: 'text',
          text: `Workflow Statistics (${days} days):\n\nTotal Executions: ${stats.totalExecutions || 0}\nSuccessful: ${stats.successfulExecutions || 0}\nFailed: ${stats.failedExecutions || 0}\nAverage Duration: ${stats.averageDuration || 0}ms`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('n8n MCP server started');
  }
}

if (require.main === module) {
  const server = new N8nMCP();
  server.run().catch(console.error);
}

module.exports = N8nMCP;