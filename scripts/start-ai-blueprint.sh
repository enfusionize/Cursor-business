#!/bin/bash

# AI Agent Blueprint Startup Script
# Launches the complete AI Agent Deployment Blueprint system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLIENT_TYPE=${1:-"saas"}
DEPLOYMENT_TIMELINE=${2:-"standard_8_weeks"}
DAEMON_MODE=${3:-"false"}

echo -e "${BLUE}🚀 AI Agent Blueprint Startup${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Client Type: ${GREEN}${CLIENT_TYPE}${NC}"
echo -e "Timeline: ${GREEN}${DEPLOYMENT_TIMELINE}${NC}"
echo -e "Daemon Mode: ${GREEN}${DAEMON_MODE}${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run from project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Create logs directory
mkdir -p logs

# Start the AI Agent Blueprint system
echo -e "${BLUE}🤖 Starting AI Agent Blueprint System...${NC}"

if [ "$DAEMON_MODE" = "true" ]; then
    echo -e "${YELLOW}🔄 Starting in daemon mode...${NC}"
    
    # Start MCP server in background
    nohup npm run ai-blueprint > logs/ai-blueprint-mcp.log 2>&1 &
    MCP_PID=$!
    echo $MCP_PID > logs/ai-blueprint-mcp.pid
    
    # Start deployment process in background
    nohup npm run ai-deploy $CLIENT_TYPE $DEPLOYMENT_TIMELINE > logs/ai-deployment.log 2>&1 &
    DEPLOY_PID=$!
    echo $DEPLOY_PID > logs/ai-deployment.pid
    
    echo -e "${GREEN}✅ AI Agent Blueprint started in daemon mode${NC}"
    echo -e "MCP Server PID: ${MCP_PID}"
    echo -e "Deployment PID: ${DEPLOY_PID}"
    echo -e "Logs: logs/ai-blueprint-mcp.log, logs/ai-deployment.log"
    
else
    echo -e "${YELLOW}🔄 Starting in interactive mode...${NC}"
    
    # Start MCP server in background
    npm run ai-blueprint &
    MCP_PID=$!
    
    # Give MCP server time to start
    sleep 3
    
    # Start deployment process
    npm run ai-deploy $CLIENT_TYPE $DEPLOYMENT_TIMELINE
    
    # Clean up background process
    kill $MCP_PID 2>/dev/null || true
fi

echo -e "${GREEN}🎉 AI Agent Blueprint system ready!${NC}"