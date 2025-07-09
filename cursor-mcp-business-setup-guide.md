# Complete Guide: Setting Up Cursor as Your Business Operations Hub with MCPs

This guide will help you replicate the workflow shown in Amir's demo, where Cursor serves as a unified interface for finance, analytics, UX analysis, marketing, and more through Model Context Protocols (MCPs).

## Table of Contents
1. [Understanding MCPs](#understanding-mcps)
2. [Initial Cursor Setup](#initial-cursor-setup)
3. [Core MCP Servers Setup](#core-mcp-servers-setup)
4. [Business Workflow Configurations](#business-workflow-configurations)
5. [Example Use Cases](#example-use-cases)
6. [Troubleshooting](#troubleshooting)

## Understanding MCPs

Model Context Protocol (MCP) is like "USB-C for AI applications" - it provides a standardized way for LLMs to connect with external tools, databases, and services. Think of MCPs as bridges that allow Cursor's AI to interact with:

- **Finance Systems** (Xero, QuickBooks)
- **Browser Automation** (Playwright for screenshots, testing)
- **Web Scraping** (Firecrawl for content extraction)
- **Research Tools** (Perplexity for AI-powered search)
- **Your own custom tools** and databases

## Initial Cursor Setup

### Step 1: Verify Cursor Version
Ensure you have Cursor version 0.45.6 or later for MCP support.

### Step 2: Access MCP Settings
1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Navigate to **Features > MCP Servers**
3. You'll see options to add new MCP servers

## Core MCP Servers Setup

Here are the essential MCPs from Amir's demo:

### 1. Finance Automation: Xero MCP

**What it does:** Connect to Xero accounting software to get invoices, P&L reports, create quotes, etc.

**Setup:**
```json
{
  "mcpServers": {
    "xero": {
      "command": "npx",
      "args": ["-y", "mcp-server-xero"],
      "env": {
        "XERO_CLIENT_ID": "your-xero-client-id",
        "XERO_CLIENT_SECRET": "your-xero-client-secret",
        "XERO_REDIRECT_URI": "your-redirect-uri"
      }
    }
  }
}
```

**Getting Xero Credentials:**
1. Go to [Xero Developer Portal](https://developer.xero.com/)
2. Create a new app
3. Get your Client ID and Client Secret
4. Set up OAuth redirect URI

### 2. UX Analysis: Playwright MCP

**What it does:** Browser automation, taking screenshots, form filling, testing - perfect for UX analysis.

**Setup:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Alternative setup for headed browser (to see the browser window):**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless=false"]
    }
  }
}
```

### 3. Marketing/Sales: Firecrawl MCP

**What it does:** Web scraping, content extraction, generating context files for your business.

**Setup:**
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-firecrawl-api-key"
      }
    }
  }
}
```

**Getting Firecrawl API Key:**
1. Visit [Firecrawl](https://firecrawl.dev)
2. Sign up and get your API key
3. Add it to the configuration above

### 4. Research: Perplexity MCP

**What it does:** AI-powered research and search capabilities.

**Setup:**
```json
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "perplexity-mcp"],
      "env": {
        "PERPLEXITY_API_KEY": "your-perplexity-api-key"
      }
    }
  }
}
```

**Getting Perplexity API Key:**
1. Visit [Perplexity API](https://docs.perplexity.ai/)
2. Sign up for API access
3. Generate your API key

### Complete MCP Configuration

Here's your complete `mcp.json` configuration combining all servers:

```json
{
  "mcpServers": {
    "xero": {
      "command": "npx",
      "args": ["-y", "mcp-server-xero"],
      "env": {
        "XERO_CLIENT_ID": "your-xero-client-id",
        "XERO_CLIENT_SECRET": "your-xero-client-secret",
        "XERO_REDIRECT_URI": "your-redirect-uri"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-firecrawl-api-key"
      }
    },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "perplexity-mcp"],
      "env": {
        "PERPLEXITY_API_KEY": "your-perplexity-api-key"
      }
    }
  }
}
```

## Business Workflow Configurations

### Project Structure

Create a folder structure similar to what Amir showed:

```
business-operations/
├── finance/
│   ├── reports/
│   ├── invoices/
│   └── financial-analysis.md
├── analytics/
│   ├── traffic-data/
│   ├── conversion-reports/
│   └── insights.md
├── ux-review/
│   ├── screenshots/
│   ├── analysis/
│   └── recommendations.md
├── marketing/
│   ├── content/
│   ├── keyword-research/
│   └── campaigns.md
├── sales/
│   ├── outbound/
│   ├── templates/
│   └── leads.md
└── context-files/
    ├── company-llm.txt
    ├── product-info.md
    └── icp-analysis.md
```

### Custom Modes Setup

Create custom modes in Cursor for specialized workflows:

**Finance Mode:**
```markdown
You are a financial analyst assistant. You have access to Xero MCP for accounting data. 
Focus on:
- Generating P&L reports
- Analyzing cash flow
- Creating financial summaries
- Identifying trends and anomalies

Always cite your data sources and provide actionable insights.
```

**UX Analysis Mode:**
```markdown
You are a UX/UI specialist with access to Playwright for browser automation.
Focus on:
- Taking screenshots of web pages
- Analyzing user experience
- Identifying conversion optimization opportunities
- Testing user flows

Provide specific, actionable recommendations with visual evidence.
```

**Marketing Research Mode:**
```markdown
You are a marketing strategist with access to Firecrawl and Perplexity.
Focus on:
- Competitive research
- Content analysis
- Keyword research
- Market trends analysis

Use Perplexity for research and Firecrawl for content extraction. Always provide sources.
```

## Example Use Cases

### 1. Finance Operations

**Prompt Example:**
```
Use the Xero MCP to get my profit and loss report for the last quarter. Then analyze the key trends and create a summary dashboard.
```

**Expected Workflow:**
1. Cursor connects to Xero via MCP
2. Retrieves P&L data
3. Analyzes financial trends
4. Creates a markdown report with insights

### 2. UX Analysis

**Prompt Example:**
```
Use Playwright to take a screenshot of humbolytics.com homepage, then analyze the UX and suggest 5 conversion optimization improvements.
```

**Expected Workflow:**
1. Playwright MCP takes screenshot
2. AI analyzes the visual layout
3. Provides specific UX recommendations
4. Suggests A/B testing opportunities

### 3. Marketing Research

**Prompt Example:**
```
Use Perplexity to research the top 10 split testing tools in 2024, then use Firecrawl to extract content from their websites and create a competitive analysis report.
```

**Expected Workflow:**
1. Perplexity researches split testing tools
2. Firecrawl extracts content from competitor sites
3. Comprehensive competitive analysis generated
4. Strategic recommendations provided

### 4. Content Creation

**Prompt Example:**
```
Based on my company context file, use Perplexity to research recent trends in [your industry], then create a blog post outline and first draft.
```

## Context Files Setup

### Company LLM Context File

Create `context-files/company-llm.txt`:

```
Company: [Your Company Name]
Industry: [Your Industry]
Target Market: [Your ICP]
Key Products/Services:
- [Product 1]: [Description]
- [Product 2]: [Description]

Value Propositions:
- [Primary value prop]
- [Secondary value prop]

Competitors:
- [Competitor 1]
- [Competitor 2]

Recent Updates:
- [Recent company news]
- [Product launches]
- [Market changes]
```

### Keyword Data File

Create `context-files/keyword-data.csv`:

```csv
keyword,search_volume,difficulty,intent
"your main keyword",1000,45,commercial
"secondary keyword",500,30,informational
```

## Workflow Examples

### Daily Finance Check
```
Every morning at 9 AM:
1. Get yesterday's transaction summary from Xero
2. Check cash flow status
3. Identify any unusual transactions
4. Generate daily finance brief
```

### Weekly UX Review
```
Every Monday:
1. Take screenshots of key landing pages
2. Analyze conversion funnels
3. Check for broken elements
4. Generate UX improvement recommendations
```

### Monthly Marketing Analysis
```
First Monday of each month:
1. Research industry trends with Perplexity
2. Analyze competitor content with Firecrawl
3. Update keyword strategy
4. Plan content calendar
```

## Troubleshooting

### Common Issues

**MCP Server Not Starting:**
- Check Node.js installation (`node --version`)
- Verify API keys are correct
- Check network connectivity

**Playwright Browser Issues:**
- Install browsers: `npx playwright install`
- For headed mode, ensure display is available
- Check permissions for browser automation

**API Rate Limits:**
- Implement delays between requests
- Check your API plan limits
- Use caching where appropriate

**Authentication Errors:**
- Verify API keys are current
- Check OAuth token expiration (for Xero)
- Ensure proper scopes are granted

### Performance Tips

1. **Use Parallel Operations:** When possible, run multiple MCP operations simultaneously
2. **Cache Results:** Store frequently accessed data locally
3. **Batch Requests:** Group similar operations together
4. **Monitor Usage:** Keep track of API costs and usage patterns

## Advanced Configurations

### Custom MCP Servers

You can also create custom MCP servers for your specific tools:

```typescript
// custom-database-mcp.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server(
  {
    name: "custom-database",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Add your custom tools here
```

### Environment Management

Use environment-specific configurations:

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["./custom-mcp.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

## Security Considerations

1. **API Key Management:** Never commit API keys to version control
2. **Environment Variables:** Use `.env` files for sensitive data
3. **Network Security:** Ensure MCP connections are secure
4. **Access Control:** Limit MCP server permissions
5. **Data Privacy:** Be mindful of data being processed by external services

## Getting Started Checklist

- [ ] Update Cursor to latest version
- [ ] Set up basic MCP configuration
- [ ] Install Playwright MCP for browser automation
- [ ] Get Firecrawl API key and configure
- [ ] Set up Perplexity API access
- [ ] Configure Xero (if using accounting features)
- [ ] Create business folder structure
- [ ] Set up context files
- [ ] Test each MCP server individually
- [ ] Create custom modes for your workflows
- [ ] Document your specific use cases

## Next Steps

Once you have this basic setup:

1. **Start Simple:** Begin with one workflow (e.g., daily finance check)
2. **Iterate:** Gradually add more complex automations
3. **Customize:** Adapt prompts and workflows to your specific needs
4. **Scale:** Add more MCP servers as needed
5. **Monitor:** Track which workflows provide the most value

This setup will give you a powerful, Cursor-based business operations hub similar to what Amir demonstrated, allowing you to manage finance, UX analysis, marketing research, and more from a single interface.