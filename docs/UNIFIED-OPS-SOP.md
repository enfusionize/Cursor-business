# UNIFIED OPERATIONS SOP — CURSOR AI AND MCP‑DRIVEN WORKFLOWS 

**VERSION 1.0** • **DATE 2025‑01‑09** • **OWNER OPERATIONS LEAD**

## TABLE OF CONTENTS
1. [PURPOSE AND SCOPE](#1-purpose-and-scope)
2. [DEFINITIONS](#2-definitions)  
3. [ROLES AND RESPONSIBILITIES](#3-roles-and-responsibilities)
4. [SYSTEM REQUIREMENTS AND STACK OVERVIEW](#4-system-requirements-and-stack-overview)
5. [ARCHITECTURE AND DATA FLOW DIAGRAMS](#5-architecture-and-data-flow-diagrams)
6. [INITIAL INSTALLATION AND CONFIGURATION](#6-initial-installation-and-configuration)
7. [STANDARD OPERATING WORKFLOWS](#7-standard-operating-workflows)
8. [TRAINING AND ONBOARDING PLAN](#8-training-and-onboarding-plan)
9. [MAINTENANCE AND CONTINUOUS IMPROVEMENT](#9-maintenance-and-continuous-improvement)
10. [APPENDICES](#10-appendices)

## 1 PURPOSE AND SCOPE

This SOP establishes a single‑interface operational model that centralises finance, analytics, UX, marketing, QA testing, and deployment inside Cursor AI. Third‑party services are accessed through Model Context Protocols (MCPs). Claude Code operates in the integrated terminal to execute code reliably. The document is written for non‑technical and technical team members who will adopt an AI‑first workflow within three weeks.

## 2 DEFINITIONS

- **Cursor Agent**: Chat‑like assistant inside Cursor for research, context gathering, and high‑level planning
- **Claude Code**: Anthropic CLI tool that lives in the Cursor terminal and executes code, manages files, and deploys projects while streaming progress check‑marks
- **MCP**: Model Context Protocol, a declarative wrapper that allows LLMs to connect to external APIs or services such as Firecrawl, Perplexity, Xero, Playwright, Vercel, DataForSEO, and Humbo‑lytics
- **Thinking Model**: High‑context model (Claude 3 Opus Max, Gemini 2.5, o3) used for planning and complex reasoning
- **Agentic Model**: Action‑oriented model (Sonnet, Opus 4, GPT‑4o mini) used for file writes, CLI commands, and browser automation
- **Vibe Loop**: Iterative prompt‑response cycle that refines outputs by conversational back‑and‑forth instead of single long prompts

## 3 ROLES AND RESPONSIBILITIES

- **Operations Lead**: Owns this SOP, oversees integration, monitors token spend, and approves production pushes
- **Finance Bot (Xero MCP)**: Generates P&L, invoices, and quotes with single‑sentence commands
- **Analytics Bot (Humbo‑lytics MCP)**: Surfaces traffic data, growth insights, and split‑test results
- **UX Bot (Playwright MCP)**: Captures landing‑page screenshots, performs heuristic analysis, and returns AB‑test suggestions
- **Marketing Bot (Firecrawl + Perplexity MCPs)**: Scrapes site content, mines keyword nets, and drafts PRDs for programmatic SEO
- **QA Bot (Playwright or BrowserBase MCP)**: Executes test plans, fills forms, and bypasses captchas where permitted
- **Deployment Bot (Vercel CLI)**: Publishes builds, returns preview and production URLs

## 4 SYSTEM REQUIREMENTS AND STACK OVERVIEW

### Hardware
- macOS or Linux workstation, 16 GB RAM minimum

### Core Software
- Cursor IDE latest stable
- Node 18+
- Git

### LLM Credentials
- Anthropic API key (Claude Code)
- OpenAI key optional
- Perplexity API key
- Firecrawl key
- DataForSEO key

### MCP Packages
- firecrawl
- perplexity  
- playwright
- xero
- dataforseo
- humbo‑lytics
- browser‑base

Install via cursor agent: `install <package_name> mcp`

### Deployment
- Vercel CLI linked to GitHub repo

### Auxiliary
- Anima Figma plugin for Tailwind export (design import)
- Mermaid for architecture diagrams

## 5 ARCHITECTURE AND DATA FLOW DIAGRAMS

**Flow**: Team prompt → Cursor Agent (Thinking Model) → MCP calls → Context files (.md) → Claude Code (Agentic Model) → Codebase edits → Vercel deploy → Firecrawl technical audit → Iterative improvement loop

## 6 INITIAL INSTALLATION AND CONFIGURATION

1. Install Cursor and open a fresh workspace
2. In terminal pane bottom, run: `curl -s https://claude.ai/install | bash`
3. Authenticate Claude Code via browser link when prompted
4. Add MCPs: In cursor agent chat, issue sequential commands:
   ```
   install firecrawl mcp
   install perplexity mcp
   install dataforseo mcp
   install playwright mcp
   install xero mcp
   install vercel mcp
   ```
5. Configure environment variables in `.env.local`:
   ```
   ANTHROPIC_API_KEY=...
   FIRECRAWL_API_KEY=...
   PERPLEXITY_API_KEY=...
   DATAFORSEO_API_KEY=...
   XERO_CLIENT_ID=...
   XERO_CLIENT_SECRET=...
   VERCEL_TOKEN=...
   ```
6. Lay out workspace: Files explorer left, scratch‑pad note top‑right, Claude terminal bottom

## 7 STANDARD OPERATING WORKFLOWS

### 7.1 FINANCE AND ACCOUNTING AUTOMATION

**Objective**: Single‑sentence control of Xero ledger

**Commands**:
- `connect to xero mcp and list profit and loss for May 2025`
- `create quote for UX services for ABC Furniture`
- `generate payroll report for Q2 2025 and export csv`

Outputs are returned as markdown tables or direct Xero deep‑links.

### 7.2 ANALYTICS AND DASHBOARDS

**Objective**: Continuous growth insight without leaving Cursor

**Steps**:
1. `refer to humbolytics mcp and get summary insights`
2. `update landing‑page UX recommendations based on traffic anomalies`
3. `deploy dashboard.html using Claude Code with embedded chart.js pulling Humbo‑lytics API`

### 7.3 UX AND DESIGN ITERATION

#### 7.3.1 Screenshot & Analysis
1. `use playwright mcp to go to vibemarketer.com and take screenshot`
2. `reference screenshot and provide ux growth suggestions and ab tests`

#### 7.3.2 Figma Import
1. In Figma dev mode export Tailwind via Anima plugin
2. Paste exported component blocks to Claude Code: `integrate into components/Design.tsx`
3. Run local dev server: `/vercel dev`

### 7.4 MARKETING AND PROGRAMMATIC SEO

**Goal**: 1,000 comparison pages generating 20,000 organic visits within 90 days

**Procedure**:

a) **Discovery**
```
use firecrawl mcp to scrape the vibemarketer.com and create summary.md
use perplexity mcp to find relevant programmatic keyword ideas for my business
use dataforseo mcp to enrich keyword list with monthly volume and difficulty
```

b) **PRD Generation**
```
reference summary.md keyword_volume.csv and create product requirement document prioritising AI tool comparisons
```

c) **Execution**
```
claude (terminal): find programmatic‑seo‑comparison‑prd.md, plan, build page templates, confirm tasks
When prompted: push to production site folder /sites/vibe
```

d) **Deployment**
```
/vercel deploy --prod
```

e) **Technical SEO Fixes**
```
use firecrawl mcp to audit vibemarketer.com and fix all technical seo issues
claude: implement fixes now
```

f) **Scale**
Loop through keyword matrix and generate additional pages via Claude Code multi‑task run

### 7.5 QUALITY ASSURANCE TESTING

**Test Plan YAML** stored in `tests/plan.yaml`

**Example execution**:
```
use playwright mcp and run tests/plan.yaml
report failures only
auto‑retry flaky tests up to 3 times
```

**Captcha handling**: enable playwright stealth mode; if captcha fails, label as manual review

### 7.6 DEPLOYMENT AND VERSION CONTROL

```
claude: git init if absent
claude: commit -m "feat: add comparison page template"
/vercel deploy or /vercel link for first time
```

On successful deploy Claude returns preview and production URLs.

### 7.7 M.A.P.P.™ LAUNCH FUNNEL MANAGEMENT

**Objective**: Automate lead-to-revenue conversion through AI-powered insights

**Core Workflows**:

a) **Lead Intake Processing**
```
use fastapi_mcp submit intake form with business_data="{{form_data}}"
trigger lead scoring and validation workflow
generate free report automatically
```

b) **AI Insight Generation**
```
use ai_insight_generator create report for lead_id="12345" type="free_snapshot"
use ai_insight_generator create report for lead_id="67890" type="premium_deep_dive"
schedule automated delivery via email
```

c) **Funnel Analytics & Optimization**
```
use fastapi_mcp get funnel analytics timeframe="30d"
analyze conversion rates by stage
identify bottlenecks and optimization opportunities
```

d) **Revenue Tracking**
```
show mapp revenue metrics: leads, conversions, mrr, avg_deal_value
track premium report sales and dashboard subscriptions
monitor 3D Miro board funnel visualization
```

### 7.8 AUTOMATED COST MANAGEMENT

**Every Monday at 09:00 run**:
```
claude: /cost
cursor agent: summarise token spend by model and suggest optimisation (switch long‑running tasks to haiku, batch MCP calls)
```

**Budget threshold**: 500 USD per month; operations lead receives alert when 80 percent reached.

## 8 TRAINING AND ONBOARDING PLAN

- **Week 1**: Orientation: Install stack, run finance bot demo, complete MCP installation checklist
- **Week 2**: Vibe Loop Exercises: Build a micro‑tool (keyword extractor) and deploy to Vercel
- **Week 3**: Integrated Project: Execute full programmatic SEO workflow for a sandbox domain, present traffic projections

**Daily practice**: Spend minimum 30 minutes in Cursor performing small tasks to break intimidation barrier.

## 9 MAINTENANCE AND CONTINUOUS IMPROVEMENT

- Review Firecrawl tech audit weekly; address errors in next deploy cycle
- Rotate API keys quarterly
- Benchmark page load speed via Vercel analytics monthly; target <1.5 s TTFB
- Update MCP versions bi‑weekly via: `upgrade <package_name> mcp`

## 10 APPENDICES

### A EXAMPLE PROMPTS AND COMMANDS

```
install firecrawl mcp
use perplexity mcp to research "ai crm vs traditional crm" longtail keyword
claude: cost
use playwright mcp to go to humbolytics.com and take screenshot
```

### B PRD TEMPLATE

- Title
- Objective
- Success Metrics
- Persona
- Keyword Set
- Page Components
- CTA Placement
- Timeline

### C GLOSSARY

- **PRD**: Product Requirement Document
- **TTFB**: Time to first byte
- **CLI**: Command‑line interface
- **S.A.I.A.S.™**: Streamline → Automate → Integrate → Accelerate → Scale

---

*This SOP enables "operations that glide, revenue that snowballs" through unified AI-driven workflows.*