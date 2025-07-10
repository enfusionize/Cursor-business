# Complete MCP Business Operations Setup Guide

This guide will get you from zero to a fully functional MCP business operations environment in under 30 minutes.

## 🚀 Quick Start (Automated Setup)

### Option 1: Automated Setup Script (Recommended)
```bash
# Clone or download this repository
git clone <repository-url>
cd cursor-mcp-business-environment

# Run the automated setup
npm run setup
```

The setup script will:
- ✅ Check prerequisites (Node.js, npm, etc.)
- ✅ Install all dependencies and MCP servers
- ✅ Configure Cursor automatically
- ✅ Create personalized environment files
- ✅ Set up sample project structure
- ✅ Install Claude Code globally
- ✅ Validate everything is working

### Option 2: Docker Development Environment
```bash
# Clone the repository
git clone <repository-url>
cd cursor-mcp-business-environment

# Copy environment file
cp .env.example .env

# Edit .env with your API keys (optional for basic testing)
nano .env

# Start with Docker Compose
docker-compose up -d

# Access at http://localhost:3000
```

### Option 3: Manual Setup
Follow the detailed steps below if you prefer manual control.

## 📋 Prerequisites

### Required
- **Node.js 18+** - [Download](https://nodejs.org)
- **npm or yarn** - Comes with Node.js
- **Cursor IDE** - [Download](https://cursor.sh)
- **Git** - [Download](https://git-scm.com)

### Optional (for full functionality)
- **Docker & Docker Compose** - For containerized development
- **API Keys** - For advanced MCP features (see API Keys section)

## 🔧 Step-by-Step Setup

### 1. Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd cursor-mcp-business-environment

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Variables
Edit `.env` file with your details:
```bash
# Required for Claude Code
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional but recommended
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Your business details
BUSINESS_NAME="Your Business Name"
BUSINESS_DOMAIN="yourdomain.com"
BUSINESS_INDUSTRY="your_industry"
```

### 3. Install Global Tools
```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-dev

# Install Vercel for deployment
npm install -g vercel

# Install Playwright browsers
npx playwright install
```

### 4. Configure Cursor MCPs

#### Automatic Configuration
```bash
# Run the setup script to auto-configure Cursor
npm run setup
```

#### Manual Configuration
1. Open Cursor → Preferences (`Cmd+,` or `Ctrl+,`)
2. Go to **Features → MCP Servers**
3. Click **"+ Add New MCP Server"**
4. Copy configuration from `mcp-config-template.json`

### 5. Validate Setup
```bash
# Test all MCP connections
npm run test-mcps

# Validate complete setup
npm run validate-setup
```

### 6. Start Development
```bash
# Start the development server
npm run dev

# In another terminal, test Claude Code
claude
```

## 🔑 API Keys Setup

### Free Tier (Get Started Immediately)
- **Playwright MCP**: No API key required
- **Anthropic Claude**: Free tier available
- **Vercel**: Free deployment tier

### Paid Services (Recommended for Production)
1. **Firecrawl**: [Get API Key](https://firecrawl.dev) - $15/month for 10k pages
2. **Perplexity**: [Get API Key](https://www.perplexity.ai/settings/api) - $20/month
3. **DataForSEO**: [Get Credentials](https://dataforseo.com) - $25/month
4. **Xero**: [Developer Account](https://developer.xero.com) - Free for basic integration

### API Key Priority
1. **Start with**: Anthropic Claude (required for Claude Code)
2. **Add next**: Firecrawl (web scraping)
3. **Then**: Perplexity (research)
4. **Advanced**: DataForSEO, Xero (specialized features)

## 🐳 Docker Development

### Simple Docker Setup
```bash
# Basic development environment
docker-compose up -d

# View logs
docker-compose logs -f mcp-business-app

# Stop services
docker-compose down
```

### Full Stack with Database
```bash
# Run with PostgreSQL
docker-compose --profile full up -d

# Run with monitoring
docker-compose --profile monitoring up -d

# Run everything
docker-compose --profile full --profile monitoring up -d
```

### Docker Commands Reference
```bash
# Rebuild containers
docker-compose build

# Shell into main container
docker-compose exec mcp-business-app bash

# View all services
docker-compose ps

# Clean up everything
docker-compose down -v --remove-orphans
```

## 📱 Cursor Usage

### 3-Column Layout Setup
1. **Left Panel**: File Explorer (already visible)
2. **Center Panel**: Code/Content area (already active)
3. **Right Panel**: Cursor Agent (`Cmd+L` or `Ctrl+L`)
4. **Bottom Panel**: Terminal (`Ctrl+``)

### First Test in Cursor
1. Open Cursor Agent (`Cmd+L`)
2. Switch to "Agent" mode
3. Try this prompt:
```
Use Playwright MCP to take a screenshot of google.com and analyze the homepage design
```

### Claude Code in Terminal
1. Open terminal in Cursor (`Ctrl+``)
2. Type: `claude`
3. Try this prompt:
```
Help me understand this project structure and suggest a simple comparison page I could build
```

## 🔄 Development Workflow

### James's Proven Workflow
1. **Research Phase** (Cursor Agent):
   ```
   Use FireCrawl MCP to scrape [competitor-site.com]
   Use Perplexity MCP to research [industry] tool comparison keywords
   Use DataForSEO MCP to validate search volumes
   Create a PRD for building comparison pages
   ```

2. **Implementation Phase** (Claude Code):
   ```bash
   # In terminal
   claude
   
   # Then tell Claude Code:
   Find the PRD file and build comparison pages with:
   - Interactive features
   - SEO optimization
   - Deploy to Vercel
   ```

3. **Deploy & Scale**:
   ```bash
   # Deploy to production
   npm run deploy
   
   # Scale to more pages
   # Repeat workflow with different keywords
   ```

## 📊 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run deploy       # Deploy to Vercel
```

### MCP Management
```bash
npm run test-mcps    # Test all MCP connections
npm run install-mcps # Install/update MCP servers
npm run validate-setup # Validate complete setup
```

### Utilities
```bash
npm run setup        # Complete automated setup
npm run backup-config # Backup Cursor configuration
npm run restore-config # Restore Cursor configuration
```

### Claude Code
```bash
claude              # Start Claude Code interface
claude --help       # Show available commands
claude --version    # Show version
```

## 🎯 Testing Your Setup

### Quick Tests
1. **Playwright**: Take a screenshot of any website
2. **Firecrawl**: Scrape content from a webpage
3. **Perplexity**: Research any topic
4. **Claude Code**: Build a simple component
5. **Deployment**: Deploy to Vercel

### Example Test Prompts
```
# Test in Cursor Agent:
Use Playwright to screenshot google.com and analyze the design

Use Firecrawl to scrape the homepage of stripe.com and summarize their value proposition

Use Perplexity to research the top 5 AI tools for content marketing in 2024

# Test in Claude Code terminal:
Build me a simple comparison page comparing ChatGPT vs Claude, including:
- Feature comparison table
- Pricing information
- Pros and cons
- Call-to-action buttons
Deploy it to Vercel when complete
```

## 🚨 Troubleshooting

### Common Issues

#### "MCP server not found"
```bash
# Check if MCPs are installed
npm run test-mcps

# Reinstall if needed
npm run install-mcps

# Restart Cursor after configuration changes
```

#### "Claude Code command not found"
```bash
# Install globally
npm install -g @anthropic-ai/claude-dev

# Check installation
claude --version
```

#### "Playwright browsers not installed"
```bash
# Install browsers
npx playwright install

# Or install specific browser
npx playwright install chromium
```

#### "API key errors"
1. Check `.env` file has correct keys
2. Verify API key format (see test-mcps output)
3. Check API key permissions and limits
4. Restart application after .env changes

### Getting Help
1. Run `npm run test-mcps` for diagnostic information
2. Check the troubleshooting sections in individual guides
3. Review Docker logs: `docker-compose logs`
4. Create an issue with full error messages

## 🎉 Success Checklist

After setup, you should be able to:
- [ ] Take screenshots with Playwright MCP
- [ ] Scrape websites with Firecrawl MCP
- [ ] Research topics with Perplexity MCP
- [ ] Build apps with Claude Code
- [ ] Deploy to Vercel
- [ ] See your development server at http://localhost:3000

## 📚 Next Steps

1. **Read the guides**:
   - `advanced-claude-code-workflow.md` - James's development method
   - `example-prompts.md` - Ready-to-use prompts
   - `cost-analysis-and-roi.md` - Understand the economics

2. **Start building**:
   - Create your first comparison page
   - Research your industry keywords
   - Build and deploy a production site

3. **Scale your operation**:
   - Add more MCP servers
   - Automate your workflows
   - Build multiple business applications

## 🎯 Quick Commands Summary

```bash
# Complete setup in one command
npm run setup

# Test everything
npm run test-mcps

# Start development
npm run dev

# Start Claude Code
claude

# Deploy to production
npm run deploy
```

**You're now ready to build production applications with AI!** 🚀

Start with the example prompts in `example-prompts.md` or follow James's advanced workflow in `advanced-claude-code-workflow.md`.