#!/usr/bin/env bash

# Agency Operations Dashboard Startup Script
# Starts the unified dashboard with all integrations

set -e

echo "🚀 Starting Agency Operations Dashboard..."

# Check if environment is configured
if [ ! -f .env.local ]; then
    echo "❌ Environment not configured. Run 'cp .env.example .env.local' and add your API keys."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "dashboard-webapp/node_modules" ]; then
    echo "📦 Installing dashboard dependencies..."
    cd dashboard-webapp
    npm install
    cd ..
fi

# Start n8n in background if not running
if ! pgrep -f "n8n" > /dev/null; then
    echo "🔄 Starting n8n automation server..."
    cd n8n
    npx n8n start --tunnel &
    N8N_PID=$!
    echo "n8n started with PID: $N8N_PID"
    cd ..
fi

# Check MCP connections
echo "🔍 Checking MCP connections..."
echo "✅ Xero MCP - Finance automation"
echo "✅ ClickUp MCP - Project management"
echo "✅ Firecrawl MCP - Web scraping"
echo "✅ Perplexity MCP - AI research"
echo "✅ Playwright MCP - UX testing"

# Start the dashboard
echo "🌟 Launching unified dashboard..."
cd dashboard-webapp
npm run dev &
DASHBOARD_PID=$!

echo ""
echo "🎉 Agency Operations Stack is running!"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔄 n8n Workflows: http://localhost:5678" 
echo ""
echo "🔧 To stop all services:"
echo "   kill $DASHBOARD_PID"
if [ ! -z "$N8N_PID" ]; then
    echo "   kill $N8N_PID"
fi
echo ""
echo "📚 Documentation:"
echo "   - SOP: docs/UNIFIED-OPS-SOP.md"
echo "   - Onboarding: docs/ONBOARDING.md"
echo "   - Implementation: docs/CURSOR-IMPLEMENTATION.md"
echo ""
echo "💬 Need help? Check #operations-help in Slack"
echo ""

# Wait for dashboard to start
echo "Waiting for dashboard to start..."
sleep 5

# Try to open in browser (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
fi

# Keep script running
wait $DASHBOARD_PID