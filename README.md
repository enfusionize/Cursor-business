# Agency Operations - Unified Stack

> **S.A.I.A.S.™ Framework**: Streamline → Automate → Integrate → Accelerate → Scale

## Overview

This workspace implements our complete agency operations stack inside Cursor, providing a unified interface for:

- **Finance & Administration** (Xero + Stripe)
- **Project & Task Management** (ClickUp)
- **Design & Creative** (Figma + Framer)
- **Marketing & Sales** (GoHighLevel)
- **Workflow Automation** (n8n + Gumloop)
- **AI Assistants & Analytics** (Lindy, MiniMax, Humbolytics)

## Quick Start

1. **Bootstrap Environment**
   ```bash
   bash scripts/bootstrap.sh
   ```

2. **Configure API Keys**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Install MCPs**
   ```bash
   # In Cursor Agent panel (⌥⌘A)
   install mcp xero firecrawl perplexity dataforseo playwright stripe_clickup ghl_slack miro n8n_lindy minimax
   ```

4. **Launch Dashboard**
   ```bash
   cd dashboard-webapp
   npm run dev
   ```

## Workspace Structure

```
agency-ops/
├─ .env.local             # All service API keys
├─ mcp-config/            # Model Context Protocol manifests
├─ n8n/                   # Workflow automation configs
├─ gumloop/               # AI automation pipelines
├─ dashboard-webapp/      # Next.js unified dashboard
├─ docs/                  # SOPs and documentation
└─ scripts/               # Setup and maintenance scripts
```

## Custom Modes

- **Plan Mode** (⇧⌘1): Claude 3 Opus Max for strategy & reasoning
- **Exec Mode** (⇧⌘2): Sonnet 3.0 for agentic actions & code
- **QA Mode** (⇧⌘3): Gemini 2.5 for testing & validation

## Documentation

- [Unified Operations SOP](docs/UNIFIED-OPS-SOP.md)
- [Cursor Implementation Guide](docs/CURSOR-IMPLEMENTATION.md)
- [Team Onboarding](docs/ONBOARDING.md)

---

*"Operations glide, revenue snowballs"* 🚀