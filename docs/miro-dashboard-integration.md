# Miro Real-Time Dashboard Integration

## Overview

The Miro Real-Time Dashboard integration provides a comprehensive visual interface for monitoring all aspects of the Vibe Marketing Platform. It creates dynamic Miro boards that display real-time data about system health, business metrics, automation flows, and site performance.

## Features

### 🎯 Dashboard Types
- **System Overview**: Real-time system health, API status, and performance metrics
- **Business Analytics**: Revenue tracking, customer analytics, and growth metrics
- **Automation Flows**: Tool usage, workflow monitoring, and success rates
- **Site Monitoring**: Page performance, traffic analysis, and SEO metrics

### 📊 Real-Time Capabilities
- **Live Data Updates**: Automatic refresh every 30-60 seconds
- **Interactive Visualizations**: Color-coded status indicators and charts
- **Alert System**: Real-time error tracking and notifications
- **Performance Monitoring**: CPU, memory, and response time tracking

### 🔧 Advanced Features
- **System Flowcharts**: Visual architecture diagrams
- **Analytics Visualizations**: Custom charts and graphs
- **Data Export**: JSON, CSV, PDF, and PNG formats
- **Monitoring Controls**: Start/stop real-time updates

## Quick Start

### 1. Setup Miro API Access

```bash
# Get your Miro API key from https://developers.miro.com/
export MIRO_API_KEY="your-miro-api-key-here"

# Or add to your .env file
echo "MIRO_API_KEY=your-miro-api-key-here" >> .env
```

### 2. Install Dependencies

```bash
npm install axios @modelcontextprotocol/sdk
```

### 3. Create Your First Dashboard

```bash
# Create a system overview dashboard
npm run miro-system-overview

# Create a business analytics dashboard
npm run miro-business-analytics

# Create an automation flows dashboard
npm run miro-automation-flows

# Create a site monitoring dashboard
npm run miro-site-monitoring
```

### 4. Run Tests

```bash
# Run comprehensive test suite
npm run test-miro

# Test specific dashboard type
npm run test-miro -- --type=system-overview
```

## Dashboard Templates

### System Overview Dashboard

**Sections:**
- System Health: Overall status and component health
- API Endpoints: Status and response times for all integrations
- MCP Servers: Real-time server status and connections
- Performance Charts: CPU, memory, and disk usage
- Error Tracking: Active alerts and error logs
- Resource Usage: Real-time resource consumption

**Data Sources:**
- Health Monitor API
- MCP Server Status
- System Performance Metrics
- Error Logs and Alerts

### Business Analytics Dashboard

**Sections:**
- Revenue Metrics: Monthly revenue and growth trends
- Customer Analytics: User acquisition and retention
- Growth Tracking: Key performance indicators
- Conversion Funnels: Sales pipeline visualization
- Traffic Sources: Website traffic analysis
- Goal Progress: Target achievement tracking

**Data Sources:**
- Revenue Tracking System
- Customer Database
- Analytics Platform
- Conversion Tracking

### Automation Flows Dashboard

**Sections:**
- Active Automations: Currently running workflows
- Tool Usage Stats: MCP tool utilization
- Workflow Status: Success/failure rates
- Success Rates: Performance metrics
- Error Analysis: Failure pattern analysis
- Performance Impact: Resource usage by automation

**Data Sources:**
- Automation Engine
- MCP Tool Metrics
- Workflow Logs
- Performance Data

### Site Monitoring Dashboard

**Sections:**
- Page Performance: Load times and optimization
- Traffic Flow: User journey mapping
- Engagement Metrics: User interaction data
- Load Times: Performance benchmarks
- Error Rates: Page error tracking
- SEO Metrics: Search optimization data

**Data Sources:**
- Web Analytics
- Performance Monitoring
- SEO Tools
- Error Tracking

## API Reference

### Creating Dashboards

```javascript
// Create a new dashboard
const response = await callMiroMCP('create_realtime_dashboard', {
  dashboard_type: 'system-overview',
  board_name: 'My System Dashboard',
  update_interval: 30,
  data_sources: ['system', 'apis', 'performance']
});
```

### Updating Data

```javascript
// Update dashboard with new data
const response = await callMiroMCP('update_dashboard_data', {
  board_id: 'board-id-here',
  data_type: 'metrics',
  data: {
    overall_health: 'HEALTHY',
    performance_score: 85,
    healthy_components: 23,
    total_components: 25
  }
});
```

### System Flowcharts

```javascript
// Create system architecture diagram
const response = await callMiroMCP('create_system_flowchart', {
  board_id: 'board-id-here',
  components: [
    { 
      name: 'Web Server', 
      type: 'server', 
      status: 'healthy', 
      connections: ['Database', 'Cache'] 
    },
    { 
      name: 'Database', 
      type: 'database', 
      status: 'healthy', 
      connections: ['Backup'] 
    }
  ]
});
```

### Analytics Visualization

```javascript
// Create analytics charts
const response = await callMiroMCP('create_analytics_visualization', {
  board_id: 'board-id-here',
  analytics_data: {
    revenue: { monthly: 45000, growth: 12.5 },
    customers: { total: 1250, new_this_month: 89 }
  },
  chart_type: 'line'
});
```

### Real-Time Monitoring

```javascript
// Start real-time monitoring
const response = await callMiroMCP('start_realtime_monitoring', {
  board_id: 'board-id-here',
  interval: 30,
  data_sources: ['system', 'apis', 'performance']
});

// Stop monitoring
const response = await callMiroMCP('stop_realtime_monitoring', {
  board_id: 'board-id-here'
});
```

## Data Sources Integration

### Health Monitor Integration

```javascript
// Connect to health monitor API
const healthData = await axios.get('http://localhost:3000/api/health');

// Update dashboard with health data
await callMiroMCP('update_dashboard_data', {
  board_id: boardId,
  data_type: 'metrics',
  data: {
    overall_health: healthData.overall,
    performance_score: healthData.performance.healthPercentage,
    healthy_components: healthData.performance.healthy,
    total_components: healthData.performance.total
  }
});
```

### API Status Monitoring

```javascript
// Monitor API endpoints
const apiEndpoints = [
  { name: 'Anthropic', url: 'https://api.anthropic.com/v1/messages' },
  { name: 'Figma', url: 'https://api.figma.com/v1/me' },
  { name: 'ClickUp', url: 'https://api.clickup.com/api/v2/user' }
];

// Check status and update dashboard
const statuses = await Promise.all(
  apiEndpoints.map(async (api) => {
    try {
      const startTime = Date.now();
      await axios.get(api.url, { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      return { [api.name]: { healthy: true, response_time: responseTime } };
    } catch (error) {
      return { [api.name]: { healthy: false, error: error.message } };
    }
  })
);
```

## Customization

### Custom Dashboard Templates

```javascript
// Create custom template
const customTemplate = {
  name: 'Custom Monitoring Dashboard',
  description: 'Specialized monitoring for specific use case',
  sections: [
    { 
      name: 'Custom Metrics', 
      type: 'custom_metrics', 
      position: { x: 0, y: 0 } 
    },
    { 
      name: 'Custom Charts', 
      type: 'custom_charts', 
      position: { x: 400, y: 0 } 
    }
  ]
};

// Register template
this.boardTemplates.set('custom-monitoring', customTemplate);
```

### Custom Data Sources

```javascript
// Add custom data collection
async getCustomData() {
  try {
    const response = await axios.get('https://api.example.com/metrics');
    return {
      custom_metric_1: response.data.metric1,
      custom_metric_2: response.data.metric2,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch custom data:', error);
    return {};
  }
}
```

## Configuration

### Environment Variables

```bash
# Required
MIRO_API_KEY=your-miro-api-key

# Optional
MIRO_TEAM_ID=your-team-id
MIRO_DEFAULT_UPDATE_INTERVAL=30
MIRO_MAX_BOARDS=10
MIRO_ENABLE_WEBHOOKS=true
```

### MCP Configuration

```json
{
  "mcpServers": {
    "miro-realtime-dashboard": {
      "command": "node",
      "args": ["mcps/miro-realtime-dashboard.js"],
      "env": {
        "MIRO_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

#### 1. API Key Authentication

```bash
# Verify API key is set
echo $MIRO_API_KEY

# Test API connection
curl -H "Authorization: Bearer $MIRO_API_KEY" https://api.miro.com/v2/boards
```

#### 2. Board Creation Failures

```javascript
// Check permissions
const response = await axios.get('https://api.miro.com/v2/boards', {
  headers: { 'Authorization': `Bearer ${process.env.MIRO_API_KEY}` }
});
console.log('Available boards:', response.data.data.length);
```

#### 3. Real-Time Update Issues

```javascript
// Debug monitoring intervals
console.log('Active intervals:', this.updateIntervals.size);
console.log('Dashboard count:', this.activeDashboards.size);

// Check data collection
const testData = await this.collectRealtimeData(['system']);
console.log('Collected data:', testData);
```

### Performance Optimization

#### 1. Update Interval Tuning

```javascript
// Adjust update intervals based on data type
const intervals = {
  'system-overview': 30,      // 30 seconds for system data
  'business-analytics': 300,  // 5 minutes for business data
  'automation-flows': 60,     // 1 minute for automation data
  'site-monitoring': 120      // 2 minutes for site data
};
```

#### 2. Data Source Optimization

```javascript
// Batch data collection
async collectAllData() {
  const [systemData, apiData, performanceData] = await Promise.all([
    this.getSystemHealthData(),
    this.getAPIStatusData(),
    this.getPerformanceData()
  ]);
  
  return { system: systemData, apis: apiData, performance: performanceData };
}
```

### Error Handling

```javascript
// Comprehensive error handling
try {
  await this.updateDashboardData(args);
} catch (error) {
  console.error('Dashboard update failed:', error);
  
  // Retry logic
  if (error.response?.status === 429) {
    await this.delay(60000); // Wait 1 minute for rate limit
    return this.updateDashboardData(args);
  }
  
  // Fallback to cached data
  return this.updateWithCachedData(args);
}
```

## Best Practices

### 1. Dashboard Organization

- Use consistent naming conventions
- Group related dashboards by team/function
- Set appropriate update intervals
- Monitor API rate limits

### 2. Data Management

- Cache frequently accessed data
- Implement data validation
- Use compression for large datasets
- Archive old dashboard data

### 3. Performance Monitoring

- Track dashboard load times
- Monitor API response times
- Set up alerting for failures
- Regular performance audits

### 4. Security

- Secure API keys properly
- Use environment variables
- Implement access controls
- Regular security audits

## Advanced Features

### Webhook Integration

```javascript
// Set up Miro webhooks for real-time updates
const webhook = await axios.post('https://api.miro.com/v2/webhooks', {
  url: 'https://your-domain.com/miro-webhook',
  events: ['board:updated', 'item:created', 'item:updated']
}, {
  headers: { 'Authorization': `Bearer ${process.env.MIRO_API_KEY}` }
});
```

### Custom Widgets

```javascript
// Create custom dashboard widgets
const customWidget = {
  type: 'app_card',
  data: {
    title: 'System Status',
    description: 'Real-time system health',
    fields: [
      { name: 'Status', value: 'HEALTHY', color: 'green' },
      { name: 'Uptime', value: '99.9%', color: 'blue' }
    ]
  }
};
```

### Integration with Other Tools

```javascript
// Slack notifications for critical alerts
async sendSlackAlert(message) {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `🚨 Miro Dashboard Alert: ${message}`,
    channel: '#alerts'
  });
}

// Email reports
async sendEmailReport(reportData) {
  await axios.post('/api/send-email', {
    to: 'team@company.com',
    subject: 'Daily Dashboard Report',
    body: this.generateEmailReport(reportData)
  });
}
```

## Support

For issues, questions, or feature requests:

1. Check the troubleshooting section above
2. Review the [Miro API documentation](https://developers.miro.com/docs)
3. Submit an issue to the project repository
4. Contact the development team

## License

This integration is part of the Vibe Marketing Platform and is licensed under MIT License.