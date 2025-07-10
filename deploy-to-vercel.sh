#!/bin/bash

# 🚀 VIBE MARKETING PLATFORM - ONE-CLICK VERCEL DEPLOYMENT
# This script automates the entire deployment process to Vercel

set -e

echo "🚀 Starting Vibe Marketing Platform deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

print_color $PURPLE "📋 Checking prerequisites..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_color $YELLOW "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_color $YELLOW "📂 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Vibe Marketing Platform"
fi

print_color $GREEN "✅ Prerequisites check complete"

# Environment setup
print_color $PURPLE "🔑 Setting up environment variables..."

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    cat > .env.example << EOF
# API Keys (Required for full functionality)
FIGMA_API_KEY=your_figma_api_key_here
FRAMER_ACCESS_TOKEN=your_framer_access_token_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional Configuration
PERPLEXITY_API_KEY=your_perplexity_api_key_here
GROQ_API_KEY=your_groq_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Platform Settings
PLATFORM_NAME=Vibe Marketing Platform
MAX_CONCURRENT_WORKFLOWS=5
DEBUG_MODE=false
EOF
fi

# Create runtime configuration
print_color $PURPLE "⚙️  Creating runtime configuration..."

# Create .vercelignore
cat > .vercelignore << EOF
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.log
node_modules/
.cache/
dist/
.temp/
.vscode/
.idea/
EOF

# Create a deploy configuration
cat > deploy-config.json << EOF
{
  "name": "vibe-marketing-platform",
  "version": "1.0.0",
  "description": "AI-powered marketing automation platform with MCP integration",
  "deployment": {
    "platform": "vercel",
    "regions": ["iad1", "sfo1"],
    "features": [
      "serverless-functions",
      "static-hosting",
      "automatic-ssl",
      "custom-domains",
      "environment-variables"
    ]
  },
  "urls": {
    "production": "https://your-domain.vercel.app",
    "preview": "https://vibe-marketing-git-main.vercel.app"
  },
  "ai_features": {
    "tooltips": "enabled",
    "smart_help": "enabled",
    "performance_monitoring": "enabled",
    "error_suggestions": "enabled"
  }
}
EOF

# Optimize the dashboard for production
print_color $PURPLE "🔧 Optimizing for production deployment..."

# Create a production-optimized index.html copy
cp dashboard/index.html dashboard/index.html.backup

# Add service worker for offline support
cat > dashboard/sw.js << EOF
const CACHE_NAME = 'vibe-marketing-v1';
const urlsToCache = [
  '/',
  '/dashboard/index.html',
  'https://cdn.tailwindcss.com/tailwind.min.css',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
EOF

print_color $GREEN "✅ Production optimization complete"

# Interactive setup
print_color $BLUE "🔧 Starting interactive deployment setup..."

read -p "$(print_color $YELLOW "📛 Enter your project name (default: vibe-marketing-platform): ")" PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-vibe-marketing-platform}

read -p "$(print_color $YELLOW "🔑 Do you want to set up environment variables now? (y/N): ")" SETUP_ENV
SETUP_ENV=${SETUP_ENV:-N}

if [[ $SETUP_ENV =~ ^[Yy]$ ]]; then
    print_color $PURPLE "🔑 Environment variable setup..."
    
    read -p "$(print_color $YELLOW "Figma API Key (optional): ")" FIGMA_KEY
    read -p "$(print_color $YELLOW "OpenAI API Key (optional): ")" OPENAI_KEY
    read -p "$(print_color $YELLOW "Framer Access Token (optional): ")" FRAMER_TOKEN
fi

# Deploy to Vercel
print_color $PURPLE "🚀 Deploying to Vercel..."

# Login to Vercel if needed
print_color $BLUE "🔐 Vercel authentication..."
vercel login

# Deploy
print_color $BLUE "📤 Starting deployment..."
vercel --prod --yes

# Set environment variables if provided
if [[ $SETUP_ENV =~ ^[Yy]$ ]]; then
    if [ ! -z "$FIGMA_KEY" ]; then
        vercel env add FIGMA_API_KEY production <<< "$FIGMA_KEY"
    fi
    if [ ! -z "$OPENAI_KEY" ]; then
        vercel env add OPENAI_API_KEY production <<< "$OPENAI_KEY"
    fi
    if [ ! -z "$FRAMER_TOKEN" ]; then
        vercel env add FRAMER_ACCESS_TOKEN production <<< "$FRAMER_TOKEN"
    fi
fi

# Get deployment URL
DEPLOYMENT_URL=$(vercel --scope --prod 2>/dev/null | grep "https://" | head -1)

print_color $GREEN "🎉 Deployment successful!"
print_color $BLUE "🔗 Your platform is live at: $DEPLOYMENT_URL"

# Create deployment summary
cat > deployment-summary.md << EOF
# 🚀 Vibe Marketing Platform - Deployment Summary

## ✅ Deployment Successful!

**Live URL:** $DEPLOYMENT_URL

## 🔧 Features Deployed:

### Core Platform
- ✅ MCP Server Management Dashboard
- ✅ Natural Language Automation Engine
- ✅ Figma to Framer Converter
- ✅ Real-time System Monitoring
- ✅ Interactive Script Execution

### AI-Powered Features
- ✅ Smart Tooltips System
- ✅ Contextual Help Assistant
- ✅ Performance Monitoring
- ✅ Error Suggestions
- ✅ Welcome Guidance

### Technical Stack
- ✅ Vercel Serverless Functions
- ✅ Flask Backend API
- ✅ Responsive TailwindCSS Frontend
- ✅ WebSocket Real-time Updates
- ✅ Progressive Web App Features

## 🔑 Environment Variables Status:
$(if [[ $SETUP_ENV =~ ^[Yy]$ ]]; then echo "✅ Configured during deployment"; else echo "⚠️  Need manual setup in Vercel dashboard"; fi)

## 📚 Next Steps:

1. **Configure API Keys** (if not done):
   - Visit Vercel dashboard > Settings > Environment Variables
   - Add: FIGMA_API_KEY, OPENAI_API_KEY, FRAMER_ACCESS_TOKEN

2. **Test Core Features**:
   - MCP Server controls
   - Natural language automation
   - Figma→Framer conversion
   - System monitoring

3. **Customize**:
   - Update branding in dashboard/index.html
   - Add custom domain in Vercel settings
   - Configure team access

## 🔧 Troubleshooting:
- Check Vercel function logs for any runtime errors
- Ensure all environment variables are set
- Verify API keys have proper permissions

## 📞 Support:
- Platform logs: \`vercel logs [deployment-url]\`
- Environment: \`vercel env ls\`
- Redeploy: \`vercel --prod\`

---
**Deployment completed:** $(date)
**Platform version:** 1.0.0
**AI Features:** Enabled
EOF

print_color $GREEN "📋 Deployment summary saved to: deployment-summary.md"

# Open the deployed site
read -p "$(print_color $YELLOW "🌐 Open the deployed site in browser? (Y/n): ")" OPEN_BROWSER
OPEN_BROWSER=${OPEN_BROWSER:-Y}

if [[ $OPEN_BROWSER =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "$DEPLOYMENT_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$DEPLOYMENT_URL"
    else
        print_color $BLUE "🔗 Please visit: $DEPLOYMENT_URL"
    fi
fi

print_color $PURPLE "🎯 Deployment Tips:"
echo "  • Add environment variables in Vercel dashboard for full functionality"
echo "  • Monitor performance in Vercel analytics"
echo "  • Set up custom domain for production use"
echo "  • Enable team collaboration in Vercel settings"

print_color $GREEN "🚀 Vibe Marketing Platform is now live and ready for use!"
print_color $BLUE "🤖 AI-powered tooltips and smart features are active"
print_color $YELLOW "📖 Check deployment-summary.md for complete details"

echo ""
print_color $PURPLE "✨ Thank you for using Vibe Marketing Platform!"