# Advanced Workflow: Cursor Agent + Claude Code for Business Development

This guide incorporates James's (The Boring Marketer) advanced workflow that combines Cursor Agent for research with Claude Code for implementation, enabling non-technical people to build production applications in weeks.

## Overview: The Two-Tool Approach

**Cursor Agent**: Research, planning, and strategy development
**Claude Code**: Implementation, deployment, and technical execution

This separation provides better results than using either tool alone.

## Why This Approach Works

As James discovered:
- **Claude Code has deeper context** on file structures and codebases
- **More detailed planning** through PRDs (Product Requirements Documents)
- **Better debugging** and fewer errors than typical vibe coding platforms
- **Closed-loop environment** from insight to production deployment
- **Natural language throughout** - no need to learn complex tools

## Setup Requirements

### Prerequisites
1. **Cursor** (latest version with MCP support)
2. **Claude Code** installed in terminal
3. **Vercel** for deployment
4. **Node.js** for MCP servers

### Installing Claude Code
```bash
# In Cursor's terminal (or any terminal)
# Ask any LLM: "How do I install Claude Code in my terminal?"
# Follow the one-line installation command
# Enter your Anthropic credentials when prompted
```

### Installing Vercel
```bash
# Ask Claude Code or any LLM:
# "How can I deploy on Vercel with Claude Code from my terminal?"
# Follow the installation and setup instructions
```

## Enhanced MCP Configuration

Add these additional MCPs to your existing setup:

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
        "FIRECRAWL_API_KEY": "your-firecrawl-api-key"
      }
    },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "perplexity-mcp"],
      "env": {
        "PERPLEXITY_API_KEY": "your-perplexity-api-key"
      }
    },
    "dataforseo": {
      "command": "npx",
      "args": ["-y", "dataforseo-mcp"],
      "env": {
        "DATAFORSEO_LOGIN": "your-login",
        "DATAFORSEO_PASSWORD": "your-password"
      }
    }
  }
}
```

## The Complete Workflow

### Phase 1: Research & Strategy (Cursor Agent)

#### Step 1: Website Analysis
```
Use the FireCrawl MCP to scrape [your-website.com] and create a comprehensive markdown summary file.
```

**What this does:**
- Scrapes all content from your website
- Creates a context file for future reference
- Provides complete business context to AI

#### Step 2: Keyword Research
```
Use the Perplexity MCP to find relevant programmatic keyword ideas for my business.
```

**Follow up with:**
```
Find AI tool comparison keywords for [your industry]
```

#### Step 3: Keyword Validation
```
Use the DataForSEO MCP to research these keywords and give me search volume data and potential traffic estimates.
```

#### Step 4: Create a PRD (Product Requirements Document)
```
Create a PRD that I can use to build my first programmatic page template based on this strategy. Use the information gathered to prioritize:

a) Tool comparisons relevant to my business
b) High-priority keywords we can create solid content around  
c) Success metrics (target: 10,000 organic visits/month within 90 days)

Include:
- Project overview and objectives
- User personas and intent analysis
- Technical requirements
- Content strategy
- Success metrics
```

### Phase 2: Implementation (Claude Code)

#### Step 1: Project Setup
Open Claude Code in Cursor's terminal:
```bash
claude
```

Tell Claude Code about your project:
```
We have a new project to work on for [your website] production website. Find the programmatic SEO comparison PRD file in our environment - that is our project.
```

#### Step 2: Let Claude Code Plan
Claude Code will:
- Read your PRD
- Analyze your existing codebase
- Create a detailed implementation plan
- Ask for confirmation before proceeding

#### Step 3: Implementation & Deployment
```
Integrate this into my existing production site and start building.
```

Claude Code will:
- Set up project structure
- Create data structures
- Build page templates
- Implement interactive features
- Add SEO optimization
- Deploy to production

### Phase 3: Deployment & Optimization

#### Step 1: Deploy to Vercel
Claude Code handles this automatically when you ask:
```
Deploy this to our Vercel project.
```

#### Step 2: Post-Deployment SEO Audit
Back in Cursor Agent:
```
Use the FireCrawl MCP to crawl my complete website and find any technical SEO errors that you can fix. Then provide the fixes to Claude Code.
```

## Real Example: AI Tool Comparison Site

Here's James's actual workflow for building programmatic SEO pages:

### Research Phase (Cursor Agent)
1. **Scraped vibemarketer.com** with FireCrawl MCP
2. **Researched AI tool comparison keywords** with Perplexity MCP
3. **Validated search volumes** with DataForSEO MCP
4. **Created comprehensive PRD** with success metrics

### Implementation Phase (Claude Code)
1. **Analyzed existing codebase** and brand requirements
2. **Built comparison page template** with interactive features
3. **Created pricing calculators** and comparison tables
4. **Implemented community review sections** for SEO value
5. **Added proper internal linking** and FAQ sections
6. **Deployed to production** automatically

### Results
- **Complete comparison page** built in ~30 minutes
- **Professional design** matching existing brand
- **SEO-optimized content** with proper schema markup
- **Interactive features** (pricing calculators, comparison tables)
- **Community elements** for user-generated content signals
- **Ready for scaling** to thousands of similar pages

## Advanced Techniques

### Figma to Code Integration
1. **Get Figma file** of your design
2. **Enter Dev Mode** in Figma
3. **Install Anima plugin** for Tailwind code export
4. **Copy Tailwind code** from each design layer
5. **Paste into Claude Code** for perfect brand matching

### Model Optimization
Claude Code automatically optimizes model usage:
- **Opus** for complex planning and architecture
- **Sonnet** for general development tasks  
- **Haiku** for simple edits and updates

### Cost Management
- **Check costs**: Type `/cost` in Claude Code
- **Typical app cost**: ~$20 for a complete application
- **ROI calculation**: If one signup = $200 revenue, 10:1 ROI

### Programmatic SEO Scaling
Once you have one successful page:
1. **Identify patterns** in successful keywords
2. **Create template variations** for different tool categories
3. **Scale to hundreds/thousands** of targeted pages
4. **Monitor and optimize** performance

## Common Workflow Patterns

### Daily Content Creation
```
1. Research trending topics (Perplexity MCP)
2. Analyze competitor content (FireCrawl MCP)
3. Create content brief (Cursor Agent)
4. Build and deploy page (Claude Code)
5. Technical SEO check (FireCrawl MCP)
```

### Competitor Analysis
```
1. Scrape competitor sites (FireCrawl MCP)
2. Analyze their keyword strategy (DataForSEO MCP)
3. Find content gaps (Perplexity MCP)
4. Build better alternative (Claude Code)
5. Deploy and monitor (Vercel)
```

### Product Launch Pages
```
1. Research market trends (Perplexity MCP)
2. Analyze competitor positioning (FireCrawl MCP)
3. Create launch strategy PRD (Cursor Agent)
4. Build landing pages (Claude Code)
5. A/B test variations (deploy multiple versions)
```

## Troubleshooting

### Claude Code Issues
- **Stuck in loop**: Stop and restart with simpler request
- **Errors in deployment**: Ask Claude Code to debug and fix
- **Model costs too high**: Switch to default mode (uses cheaper models when appropriate)

### MCP Integration Problems
- **API limits**: Monitor usage in DataForSEO and other paid services
- **Rate limiting**: Add delays between requests
- **Authentication errors**: Verify API keys in MCP configuration

## Success Metrics

Track these KPIs for your workflow:
- **Pages created per week**
- **Organic traffic growth**
- **Keyword ranking improvements**
- **Cost per page created**
- **Time from idea to deployment**

## Advanced Use Cases

### E-commerce Site Builder
1. **Research product niches** (Perplexity MCP)
2. **Analyze competitor pricing** (FireCrawl MCP)
3. **Build product comparison pages** (Claude Code)
4. **Add affiliate tracking** for monetization

### SaaS Landing Page Generator
1. **Research feature comparisons** (Perplexity + DataForSEO)
2. **Scrape competitor messaging** (FireCrawl MCP)
3. **Build feature comparison matrices** (Claude Code)
4. **A/B test different positioning**

### Content Marketing Hub
1. **Identify content gaps** (Perplexity MCP)
2. **Research trending topics** (DataForSEO MCP)
3. **Build topic cluster pages** (Claude Code)
4. **Internal link optimization** (automated)

## Next Steps

1. **Start with one successful page** using this workflow
2. **Analyze what works** in terms of traffic and conversions
3. **Scale the successful patterns** across more keywords
4. **Automate routine tasks** with saved prompts
5. **Monitor and optimize** based on performance data

This workflow transforms non-technical people into builders who can create production-ready applications that get thousands of monthly visitors, all through natural language interactions with AI tools.