# Quick Start: Essential MCP Setup for Cursor

This is a condensed guide to get you up and running with the core MCPs from Amir's demo in 15 minutes.

## Prerequisites

1. **Cursor version 0.45.6+** - Check your version in Help > About
2. **Node.js** - Download from [nodejs.org](https://nodejs.org)
3. **API Keys** - You'll need these for full functionality (can start without them)

## Immediate Setup (No API Keys Required)

### 1. Browser Automation - Playwright MCP

This works out of the box without any API keys:

1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Go to **Features > MCP Servers**
3. Click **"+ Add New MCP Server"**
4. Add this configuration:

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

**Test it immediately:**
- Open Cursor Composer (`Cmd/Ctrl + L`)
- Switch to "Agent" mode
- Try: "Take a screenshot of google.com and analyze the homepage design"

### 2. Web Scraping - Firecrawl MCP (Free Tier)

1. Get a free API key from [firecrawl.dev](https://firecrawl.dev)
2. Add to your MCP configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Test it:**
- "Use Firecrawl to scrape the content from techcrunch.com and summarize the top 3 articles"

## Essential Prompts to Try

### UX Analysis Workflow
```
Use Playwright to take a screenshot of [your-website.com], then analyze the homepage for:
1. Conversion optimization opportunities
2. User experience issues
3. Mobile responsiveness concerns
4. Accessibility problems

Provide specific, actionable recommendations.
```

### Competitive Research
```
Use Firecrawl to scrape content from [competitor-website.com], then analyze their:
1. Value proposition
2. Pricing strategy
3. Feature set
4. Content strategy

Create a competitive analysis report.
```

### Content Research
```
Use Firecrawl to extract content from the top 5 search results for "[your keyword]", then create:
1. Content gap analysis
2. Topic suggestions for our blog
3. SEO improvement recommendations
```

## Folder Structure Setup

Create this structure in your workspace:

```
mkdir -p business-hub/{finance,analytics,ux-analysis,marketing,sales,context-files}
```

## Context File Template

Create `context-files/company-info.md`:

```markdown
# Company Context

## Basic Info
- Company: [Your Company]
- Industry: [Your Industry]  
- Target Audience: [Your ICP]
- Main Product/Service: [Description]

## Current Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]

## Competitors
- [Competitor 1]
- [Competitor 2]
- [Competitor 3]

## Key Metrics to Track
- [Metric 1]
- [Metric 2]
- [Metric 3]
```

## Next Steps (15-minute intervals)

### Interval 1: Basic Setup (15 min)
- ✅ Install Playwright MCP
- ✅ Test screenshot functionality
- ✅ Create folder structure

### Interval 2: Web Scraping (15 min)
- ✅ Get Firecrawl API key
- ✅ Configure Firecrawl MCP
- ✅ Test content extraction

### Interval 3: Research Tools (15 min)
- ✅ Get Perplexity API key
- ✅ Configure Perplexity MCP
- ✅ Test research capabilities

### Interval 4: Finance Integration (30 min)
- ✅ Set up Xero developer account
- ✅ Configure Xero MCP
- ✅ Test financial data retrieval

## Common First-Time Issues

**"MCP server not found"**
- Solution: Wait 30 seconds after adding, then refresh Cursor

**"Command not found: npx"**
- Solution: Install Node.js from nodejs.org

**"Permission denied"**
- Solution: Run `npm install -g @playwright/test` first

**Playwright browser not opening**
- Solution: Run `npx playwright install` in terminal

## Power User Tips

1. **Custom Modes**: Create specialized prompts for different tasks
2. **Context Files**: Always reference your company context for better results
3. **Combine MCPs**: Use multiple MCPs in one prompt for powerful workflows
4. **Save Templates**: Create reusable prompt templates for common tasks

## Example Combined Workflow

```
Using my company context file:

1. Use Playwright to take screenshots of our homepage and our top 3 competitors
2. Use Firecrawl to extract their pricing information and features
3. Create a competitive analysis report with recommendations for our Q1 strategy

Focus on:
- UX/UI differences
- Pricing positioning
- Feature gaps
- Market opportunities
```

This setup gives you immediate access to browser automation and web scraping capabilities. Add the research and finance MCPs as you get API keys to unlock the full potential of Cursor as your business operations hub.