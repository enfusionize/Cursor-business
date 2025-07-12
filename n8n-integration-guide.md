# n8n MCP Integration Guide

## Overview

The n8n MCP integration provides seamless access to n8n workflow automation capabilities through the Model Context Protocol (MCP). This integration allows you to manage workflows, execute automations, trigger webhooks, and monitor workflow performance directly from your MCP client.

## Features

- **Workflow Management**: List, create, update, and delete n8n workflows
- **Workflow Execution**: Execute workflows with custom data
- **Webhook Integration**: Trigger workflows via webhooks
- **Execution History**: View workflow execution history and statistics
- **Real-time Monitoring**: Get workflow statistics and performance metrics

## Prerequisites

1. **n8n Instance**: A running n8n instance (local or cloud)
2. **API Access**: n8n API key (optional, depending on your setup)
3. **Node.js**: Version 18+ for running the MCP server

## Quick Start

### 1. Start n8n

```bash
# Using npx (recommended for development)
npx n8n start

# Using Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Using Docker Compose
docker-compose up n8n
```

### 2. Setup n8n MCP Integration

```bash
# Run the automated setup
npm run setup-n8n

# Or manually configure
cp mcp-config-template.json mcp-config.json
# Edit mcp-config.json with your n8n settings
```

### 3. Test the Integration

```bash
# Test the complete integration
npm run test-n8n

# Test individual components
node scripts/test-n8n-integration.js
```

## Configuration

### Environment Variables

The n8n MCP server uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_BASE_URL` | n8n instance URL | `http://localhost:5678` |
| `N8N_API_KEY` | n8n API key (optional) | - |
| `N8N_WEBHOOK_URL` | n8n webhook base URL | `http://localhost:5678/webhook` |

### MCP Configuration

Add the following to your `mcp-config.json`:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["./mcps/n8n-mcp-server.js"],
      "env": {
        "N8N_BASE_URL": "http://localhost:5678",
        "N8N_API_KEY": "your-n8n-api-key-here",
        "N8N_WEBHOOK_URL": "http://localhost:5678/webhook"
      },
      "description": "n8n workflow automation and orchestration integration"
    }
  }
}
```

## Available Tools

### 1. List Workflows

Lists all available n8n workflows.

**Parameters:**
- `active_only` (boolean, optional): Only return active workflows

**Example:**
```json
{
  "name": "list_workflows",
  "arguments": {
    "active_only": true
  }
}
```

### 2. Execute Workflow

Executes a specific n8n workflow by ID.

**Parameters:**
- `workflow_id` (string, required): The ID of the workflow to execute
- `data` (object, optional): Data to pass to the workflow execution

**Example:**
```json
{
  "name": "execute_workflow",
  "arguments": {
    "workflow_id": "123",
    "data": {
      "message": "Hello from MCP",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 3. Get Workflow Details

Retrieves detailed information about a specific workflow.

**Parameters:**
- `workflow_id` (string, required): The ID of the workflow

**Example:**
```json
{
  "name": "get_workflow_details",
  "arguments": {
    "workflow_id": "123"
  }
}
```

### 4. Create Workflow

Creates a new n8n workflow.

**Parameters:**
- `name` (string, required): Name of the workflow
- `nodes` (array, required): Array of workflow nodes
- `connections` (object, required): Workflow connections between nodes
- `active` (boolean, optional): Whether the workflow should be active

**Example:**
```json
{
  "name": "create_workflow",
  "arguments": {
    "name": "My New Workflow",
    "nodes": [
      {
        "id": "manual-trigger",
        "name": "Manual Trigger",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [240, 300],
        "parameters": {}
      }
    ],
    "connections": {},
    "active": false
  }
}
```

### 5. Update Workflow

Updates an existing n8n workflow.

**Parameters:**
- `workflow_id` (string, required): The ID of the workflow to update
- `name` (string, optional): New name for the workflow
- `nodes` (array, optional): Updated array of workflow nodes
- `connections` (object, optional): Updated workflow connections
- `active` (boolean, optional): Whether the workflow should be active

### 6. Delete Workflow

Deletes a workflow from n8n.

**Parameters:**
- `workflow_id` (string, required): The ID of the workflow to delete

### 7. Get Execution History

Retrieves execution history for a workflow.

**Parameters:**
- `workflow_id` (string, required): The ID of the workflow
- `limit` (number, optional): Number of executions to return (default: 10)

### 8. Trigger Webhook

Triggers a workflow via webhook.

**Parameters:**
- `webhook_path` (string, required): The webhook path to trigger
- `data` (object, optional): Data to send with the webhook

**Example:**
```json
{
  "name": "trigger_webhook",
  "arguments": {
    "webhook_path": "my-workflow",
    "data": {
      "email": "user@example.com",
      "subject": "Test Email",
      "message": "Hello from webhook!"
    }
  }
}
```

### 9. Get Workflow Statistics

Retrieves statistics for a workflow.

**Parameters:**
- `workflow_id` (string, required): The ID of the workflow
- `days` (number, optional): Number of days to get statistics for (default: 30)

## Example Workflows

The setup script creates example workflows in `examples/n8n-workflows/`:

### Simple Webhook Trigger
A basic workflow that responds to webhook triggers.

**Path:** `/webhook/simple-trigger`

### Data Processing Workflow
A workflow that processes data and makes HTTP requests.

**Trigger:** Manual execution

### Email Notification Workflow
A workflow that sends emails based on webhook data.

**Path:** `/webhook/email-notification`

## Use Cases

### 1. Automated Data Processing

```json
{
  "name": "execute_workflow",
  "arguments": {
    "workflow_id": "data-processing-workflow",
    "data": {
      "source": "api",
      "filters": {
        "date_range": "last_7_days",
        "status": "active"
      }
    }
  }
}
```

### 2. Email Notifications

```json
{
  "name": "trigger_webhook",
  "arguments": {
    "webhook_path": "email-notification",
    "data": {
      "email": "admin@company.com",
      "subject": "System Alert",
      "message": "Critical system update completed"
    }
  }
}
```

### 3. Workflow Monitoring

```json
{
  "name": "get_workflow_statistics",
  "arguments": {
    "workflow_id": "critical-workflow",
    "days": 7
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Connection Failed
**Error:** `n8n API error: connect ECONNREFUSED`

**Solution:**
- Ensure n8n is running on the correct port
- Check if n8n is accessible at the configured URL
- Verify firewall settings

#### 2. Authentication Failed
**Error:** `n8n API error: 401 Unauthorized`

**Solution:**
- Check if API key is required for your n8n instance
- Verify the API key is correct
- Ensure the API key has the necessary permissions

#### 3. Workflow Not Found
**Error:** `n8n API error: 404 Not Found`

**Solution:**
- Verify the workflow ID exists
- Check if the workflow is accessible with your API key
- Ensure the workflow hasn't been deleted

#### 4. Webhook Not Triggered
**Error:** `Webhook trigger failed: 404 Not Found`

**Solution:**
- Verify the webhook path is correct
- Ensure the workflow is active
- Check if the webhook is properly configured in n8n

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
export DEBUG=n8n-mcp:*
node mcps/n8n-mcp-server.js
```

### Testing Individual Components

```bash
# Test n8n connection
curl http://localhost:5678/api/v1/health

# Test webhook endpoint
curl -X POST http://localhost:5678/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test API with key
curl -H "X-N8N-API-KEY: your-key" \
  http://localhost:5678/api/v1/workflows
```

## Security Considerations

### API Key Management
- Store API keys securely (use environment variables)
- Rotate API keys regularly
- Use minimal required permissions

### Webhook Security
- Use HTTPS for webhook URLs in production
- Implement webhook signature verification
- Rate limit webhook endpoints

### Network Security
- Use VPN or private networks for sensitive workflows
- Implement proper firewall rules
- Monitor network access logs

## Performance Optimization

### Connection Pooling
The MCP server uses axios for HTTP requests with connection pooling enabled.

### Caching
Consider implementing caching for frequently accessed workflows:

```javascript
// Example cache implementation
const workflowCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedWorkflow(id) {
  const cached = workflowCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const workflow = await fetchWorkflow(id);
  workflowCache.set(id, {
    data: workflow,
    timestamp: Date.now()
  });
  
  return workflow;
}
```

### Batch Operations
For multiple workflow operations, consider implementing batch processing:

```javascript
// Example batch execution
async function executeMultipleWorkflows(workflowIds, data) {
  const promises = workflowIds.map(id => 
    executeWorkflow(id, data)
  );
  
  return Promise.allSettled(promises);
}
```

## Integration with Other MCP Servers

### ClickUp Integration
Combine n8n workflows with ClickUp task management:

```json
{
  "name": "execute_workflow",
  "arguments": {
    "workflow_id": "clickup-automation",
    "data": {
      "task_id": "clickup-task-123",
      "action": "complete",
      "notes": "Automated completion via MCP"
    }
  }
}
```

### Figma Integration
Trigger design workflows from Figma updates:

```json
{
  "name": "trigger_webhook",
  "arguments": {
    "webhook_path": "figma-update",
    "data": {
      "file_key": "figma-file-key",
      "node_id": "design-node-id",
      "action": "updated"
    }
  }
}
```

## Development

### Adding New Tools

To add new tools to the n8n MCP server:

1. Add the tool definition to `setupToolHandlers()`
2. Implement the tool logic in a new method
3. Add the case to the switch statement in `CallToolRequestSchema`
4. Update the documentation

### Testing

```bash
# Run all tests
npm run test-n8n

# Run specific test
node scripts/test-n8n-integration.js

# Test with custom configuration
N8N_BASE_URL=http://custom-n8n.com npm run test-n8n
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review n8n documentation
3. Check the MCP server logs
4. Create an issue in the repository

## Changelog

### Version 1.0.0
- Initial release
- Basic workflow management
- Webhook integration
- Execution history
- Statistics and monitoring

## License

This integration is licensed under the MIT License.