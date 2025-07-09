# 🚀 Agency Operations Stack - Getting Started

Your complete agency operations environment has been set up! Here's what you have and what to do next.

## 📁 What's Been Created

### Core Structure
```
agency-ops/
├── 📄 README.md                    # Main project overview
├── 🔧 .env.example                 # API keys template
├── 🚫 .gitignore                   # Protects sensitive data
├── 📋 GETTING-STARTED.md           # This file
│
├── 📜 scripts/
│   ├── bootstrap.sh                # One-time setup script
│   └── start-dashboard.sh          # Dashboard startup script
│
├── ⚙️ mcp-config/                   # Model Context Protocol configs
│   ├── xero.yaml                   # Finance automation
│   ├── firecrawl.yaml              # Web scraping
│   ├── perplexity.yaml             # AI research
│   ├── clickup.yaml                # Project management
│   ├── playwright.yaml             # UX testing
│   └── dataforseo.yaml             # SEO analysis
│
├── 🤖 n8n/
│   └── lead-intake.json            # Sample automation workflow
│
├── 🧪 tests/
│   └── plan.yaml                   # Sample test plan
│
├── 🌐 dashboard-webapp/             # Next.js unified dashboard
│   ├── package.json                # Dependencies
│   ├── next.config.js              # Next.js config
│   ├── tailwind.config.js          # Styling config
│   ├── tsconfig.json               # TypeScript config
│   ├── postcss.config.js           # CSS processing
│   ├── pages/
│   │   ├── _app.tsx                # App wrapper
│   │   └── index.tsx               # Main dashboard
│   └── styles/
│       └── globals.css             # Global styles
│
└── 📚 docs/
    ├── UNIFIED-OPS-SOP.md          # Complete operations manual
    └── ONBOARDING.md               # 3-week training plan
```

## 🛠️ What You Need to Do Next

### Step 1: Run the Bootstrap Script
```bash
# Make sure you're in the project root
cd agency-ops

# Run the one-time setup
bash scripts/bootstrap.sh
```

This will:
- Install Node.js, Git, and other dependencies
- Install Claude Code and Vercel CLI
- Authenticate with Anthropic and Vercel
- Create the `.env.local` file

### Step 2: Configure API Keys
```bash
# Copy the environment template
cp .env.example .env.local

# Edit with your actual API keys
nano .env.local  # or use your preferred editor
```

**Required API Keys:**
- **Anthropic**: For Claude Code and AI assistance
- **Vercel**: For deployments
- **Xero**: For accounting automation
- **Stripe**: For payment processing
- **Firecrawl**: For web scraping
- **Perplexity**: For AI research
- **DataForSEO**: For keyword research
- **ClickUp**: For project management
- **Slack**: For team communication
- **GoHighLevel**: For marketing automation

### Step 3: Install MCPs in Cursor
1. Open Cursor IDE
2. Open this project folder
3. Press `⌥⌘A` to open Cursor Agent
4. Run these commands one by one:
   ```
   install mcp xero
   install mcp firecrawl
   install mcp perplexity
   install mcp dataforseo
   install mcp playwright
   install mcp clickup
   ```

### Step 4: Launch the Dashboard
```bash
bash scripts/start-dashboard.sh
```

This will:
- Start n8n automation server
- Launch the Next.js dashboard
- Open http://localhost:3000 in your browser

## 🎯 Key Features Ready to Use

### Finance Automation (Xero + Stripe)
```
# In Cursor Agent:
connect to xero mcp and list profit and loss for last month
create invoice for Project Alpha, amount $10000, due in 7 days
```

### Project Management (ClickUp)
```
# In Cursor Agent:
create clickup task "New landing page design" assigned to design team, due Friday
show all tasks in progress this week
```

### Marketing Research (Perplexity + DataForSEO)
```
# In Cursor Agent:
use perplexity mcp to research "AI marketing automation trends 2025"
use dataforseo mcp to find keyword opportunities for "marketing agency"
```

### UX Testing (Playwright)
```
# In Cursor Agent:
use playwright mcp to screenshot homepage and provide UX recommendations
run automated tests from tests/plan.yaml
```

### Web Scraping (Firecrawl)
```
# In Cursor Agent:
use firecrawl mcp to scrape competitor.com and create competitive analysis
audit our website for technical SEO issues
```

## 📖 Learning Resources

### Essential Reading (in order)
1. [Unified Operations SOP](docs/UNIFIED-OPS-SOP.md) - Complete technical manual
2. [Onboarding Guide](docs/ONBOARDING.md) - 3-week training program

### Cursor Modes
- **Plan Mode** (`⇧⌘1`): Strategic thinking and planning
- **Exec Mode** (`⇧⌘2`): Executing tasks and code changes
- **QA Mode** (`⇧⌘3`): Testing and quality assurance

## 🚨 Troubleshooting

### Environment Issues
```bash
# Check if all keys are set
cat .env.local

# Restart Cursor after env changes
```

### MCP Connection Problems
```bash
# In Cursor Agent:
list mcps                  # Check what's connected
disconnect mcp xero        # Disconnect if needed
install mcp xero          # Reinstall
```

### Dashboard Won't Start
```bash
# Install dependencies manually
cd dashboard-webapp
npm install

# Check for port conflicts
lsof -i :3000
```

## 🎉 Next Steps

1. **Complete the Bootstrap** - Get all API keys and run the setup
2. **Take the Onboarding Tour** - Follow the 3-week program in `docs/ONBOARDING.md`
3. **Build Your First Automation** - Start with the lead intake workflow
4. **Deploy Your First Project** - Use the programmatic SEO workflow

## 💬 Support

- 📖 Documentation: All docs are in the `docs/` folder
- 🔧 Issues: Check the troubleshooting section above
- 💡 Training: Follow the onboarding guide step-by-step

---

**Ready to experience operations that glide and revenue that snowballs? 🚀**

Run `bash scripts/bootstrap.sh` to begin!