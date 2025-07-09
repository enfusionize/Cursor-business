#!/usr/bin/env bash

# Agency Operations Bootstrap Script
# One-time workstation setup for unified Cursor stack

set -e

echo "🚀 Setting up Agency Operations Stack..."

# Detect OS and install package manager if needed
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    INSTALL_CMD="brew install"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    INSTALL_CMD="sudo apt-get install -y"
    sudo apt-get update
else
    echo "Unsupported OS. Please install manually."
    exit 1
fi

# Install core dependencies
echo "📦 Installing core dependencies..."
$INSTALL_CMD nodejs npm git

# Install global npm packages
echo "📦 Installing global npm packages..."
npm install -g @anthropic-ai/claude-code vercel

# Install MCP CLI (if available via package manager, otherwise use npm)
if command -v mcp-cli &> /dev/null; then
    echo "✅ MCP CLI already installed"
else
    echo "📦 Installing MCP CLI..."
    npm install -g @modelcontextprotocol/cli || echo "⚠️  MCP CLI installation failed - will install MCPs manually"
fi

# Authenticate Claude Code
echo "🔐 Authenticating Claude Code..."
if ! claude auth status &> /dev/null; then
    echo "Please authenticate Claude Code in the browser..."
    claude login
else
    echo "✅ Claude Code already authenticated"
fi

# Authenticate Vercel
echo "🔐 Authenticating Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "Please authenticate Vercel..."
    vercel login
else
    echo "✅ Vercel already authenticated"
fi

# Copy environment template
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANT: Edit .env.local with your API keys before proceeding"
else
    echo "✅ Environment file already exists"
fi

# Create necessary directories
echo "📁 Creating workspace structure..."
mkdir -p mcp-config n8n gumloop dashboard-webapp docs knowledge tests

# Make scripts executable
chmod +x scripts/*.sh

echo "✅ Bootstrap complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Open Cursor and run: install mcp xero firecrawl perplexity dataforseo playwright stripe_clickup ghl_slack miro n8n_lindy minimax"
echo "3. Launch dashboard: cd dashboard-webapp && npm run dev"
echo ""
echo "🎉 Ready to streamline operations!"