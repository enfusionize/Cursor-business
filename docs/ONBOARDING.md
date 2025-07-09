# Agency Operations Onboarding Guide

Welcome to our unified agency operations stack! This guide will get you up and running with our S.A.I.A.S.™ framework in 3 weeks.

## Week 1: Orientation & Setup

### Day 1-2: Environment Setup
1. **Clone the repository**
   ```bash
   git clone [repo-url] agency-ops
   cd agency-ops
   ```

2. **Run bootstrap script**
   ```bash
   bash scripts/bootstrap.sh
   ```

3. **Configure API keys**
   - Copy `.env.example` to `.env.local`
   - Request API keys from Operations Lead
   - Fill in all required credentials

### Day 3-5: Tool Familiarization
- [ ] **Cursor Setup**: Install Cursor IDE, authenticate Claude Code
- [ ] **MCP Installation**: Practice installing and listing MCPs
- [ ] **Dashboard Tour**: Explore the unified dashboard interface
- [ ] **Mode Switching**: Learn Plan (⇧⌘1), Exec (⇧⌘2), QA (⇧⌘3) modes

## Week 2: Vibe Loop Exercises

### Exercise 1: Finance Bot Demo
**Goal**: Generate a P&L report using voice commands

1. Open Cursor Agent panel (⌥⌘A)
2. Run: `connect to xero mcp and list profit and loss for last month`
3. Review the markdown table output
4. Export to CSV using: `export last month P&L to CSV format`

**Success criteria**: ✅ Generate P&L report, ✅ Export to CSV

### Exercise 2: Project Management
**Goal**: Create and manage ClickUp tasks

1. Switch to Exec mode (⇧⌘2)
2. Run: `create clickup task "Review onboarding process" assigned to me, due Friday, priority high`
3. List current tasks: `show my clickup tasks this week`
4. Update task status: `mark task "Review onboarding process" as in progress`

**Success criteria**: ✅ Create task, ✅ List tasks, ✅ Update status

### Exercise 3: Micro-Tool Build
**Goal**: Build a keyword extractor tool and deploy to Vercel

1. Plan mode: "Design a simple keyword extraction tool for blog posts"
2. Exec mode: "Build the tool using Next.js and deploy to Vercel"
3. Test the deployed tool
4. Share the URL with your mentor

**Success criteria**: ✅ Tool built, ✅ Deployed to Vercel, ✅ Functional demo

## Week 3: Integrated Project

### Final Challenge: Programmatic SEO Workflow
Execute the complete programmatic SEO pipeline for a sandbox domain:

1. **Discovery Phase**
   ```
   use firecrawl mcp to scrape example-competitor.com and create summary.md
   use perplexity mcp to find programmatic keyword ideas for [your niche]
   use dataforseo mcp to enrich keyword list with volume and difficulty
   ```

2. **PRD Generation**
   ```
   reference summary.md and keyword_volume.csv to create product requirement document
   prioritize AI tool comparison keywords
   ```

3. **Implementation**
   ```
   claude: find programmatic-seo-comparison-prd.md, plan and build page templates
   push to production: /vercel deploy --prod
   ```

4. **SEO Audit & Fix**
   ```
   use firecrawl mcp to audit deployed site and fix technical SEO issues
   claude: implement fixes now
   ```

5. **Presentation**
   - Present traffic projections
   - Demo the live pages
   - Explain the automation workflow

## Daily Practice (30 min/day)

### Week 1 Focus: Basic Commands
- Generate invoices via Xero MCP
- Create ClickUp tasks
- Take screenshots with Playwright
- Run simple Perplexity research queries

### Week 2 Focus: Automation
- Set up n8n workflows
- Connect multiple MCPs in sequences
- Practice mode switching for different task types
- Use Gumloop for AI-enhanced workflows

### Week 3 Focus: Integration
- Build complete workflows from lead → close
- Practice financial reporting automation
- Master the unified dashboard
- Teach a feature to another team member

## Common Troubleshooting

### MCP Connection Issues
```bash
# Check MCP status
list mcps

# Reconnect if needed
disconnect mcp xero
install mcp xero
```

### API Rate Limits
- Monitor usage in dashboard
- Switch to cheaper models for bulk operations
- Use batch operations where possible

### Environment Variables
- Verify `.env.local` has all keys
- Check for trailing spaces or quotes
- Restart Cursor after env changes

## Resources

- [Unified Operations SOP](UNIFIED-OPS-SOP.md)
- [Cursor Implementation Guide](CURSOR-IMPLEMENTATION.md)
- [Slack #operations-help](slack://channel?team=T1234&id=C1234) for questions
- Office Hours: Tuesdays & Thursdays 2-3 PM EST

## Graduation Checklist

By the end of 3 weeks, you should be able to:

- [ ] Navigate Cursor with keyboard shortcuts
- [ ] Switch between Plan/Exec/QA modes fluidly
- [ ] Connect and use 5+ MCPs independently
- [ ] Generate financial reports on demand
- [ ] Create and deploy simple web applications
- [ ] Set up automated workflows with n8n
- [ ] Troubleshoot common integration issues
- [ ] Execute the programmatic SEO workflow end-to-end

**Welcome to the team! You're about to experience operations that truly glide. 🚀**