#!/bin/bash

# Enfusionize™ Grok Debug MCP Startup Script
# Powered by S.A.I.A.S.™ Framework

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
GROK_MCP_PORT=3101
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INTEGRATIONS_DIR="$SCRIPT_DIR/integrations"
GROK_MCP_SCRIPT="$INTEGRATIONS_DIR/grok-debug-mcp.js"

echo -e "${BLUE}🚀 Enfusionize™ Grok Debug MCP Startup${NC}"
echo -e "${BLUE}=====================================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Function to install missing dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing missing dependencies...${NC}"
    
    # Check if package.json exists
    if [ ! -f "$SCRIPT_DIR/../package.json" ]; then
        echo -e "${RED}❌ package.json not found. Please run from sandbox directory.${NC}"
        exit 1
    fi
    
    cd "$SCRIPT_DIR/.."
    
    # Install required packages
    local packages=(
        "axios"
        "fs-extra"
        "chalk"
        "ora"
        "glob"
    )
    
    for package in "${packages[@]}"; do
        if ! npm list "$package" >/dev/null 2>&1; then
            echo -e "${YELLOW}Installing $package...${NC}"
            npm install "$package" --save
        fi
    done
    
    cd "$SCRIPT_DIR"
}

# Function to check environment variables
check_environment() {
    echo -e "${BLUE}🔍 Checking environment configuration...${NC}"
    
    if [ -z "$GROK_API_KEY" ] && [ -z "$XAI_API_KEY" ]; then
        echo -e "${YELLOW}⚠️  No Grok API key found in environment variables.${NC}"
        echo -e "${YELLOW}   Set GROK_API_KEY or XAI_API_KEY to enable full functionality.${NC}"
        echo -e "${YELLOW}   Fallback systems will be used instead.${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Grok API key found${NC}"
        return 0
    fi
}

# Function to start the Grok Debug MCP
start_grok_mcp() {
    echo -e "${PURPLE}🔧 Starting Grok Debug MCP...${NC}"
    
    # Check if the script exists
    if [ ! -f "$GROK_MCP_SCRIPT" ]; then
        echo -e "${RED}❌ Grok Debug MCP script not found: $GROK_MCP_SCRIPT${NC}"
        exit 1
    fi
    
    # Make script executable
    chmod +x "$GROK_MCP_SCRIPT"
    
    # Start the MCP server
    cd "$INTEGRATIONS_DIR"
    echo -e "${GREEN}🚀 Grok Debug MCP starting on port $GROK_MCP_PORT...${NC}"
    node grok-debug-mcp.js
}

# Function to show usage
show_usage() {
    echo -e "${BLUE}Usage: $0 [OPTIONS]${NC}"
    echo -e ""
    echo -e "Options:"
    echo -e "  -p, --port PORT    Set port number (default: 3101)"
    echo -e "  -h, --help         Show this help message"
    echo -e "  --install-deps     Install missing dependencies"
    echo -e "  --check-env        Check environment setup"
    echo -e "  --daemon           Run as daemon process"
    echo -e ""
    echo -e "Environment Variables:"
    echo -e "  GROK_API_KEY       Your Grok API key"
    echo -e "  XAI_API_KEY        Alternative API key variable"
    echo -e ""
    echo -e "Examples:"
    echo -e "  $0                 Start Grok Debug MCP"
    echo -e "  $0 -p 3102         Start on port 3102"
    echo -e "  $0 --daemon        Start as background process"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            GROK_MCP_PORT="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        --install-deps)
            install_dependencies
            exit 0
            ;;
        --check-env)
            check_environment
            exit $?
            ;;
        --daemon)
            DAEMON_MODE=true
            shift
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
main() {
    echo -e "${BLUE}🔍 Performing system checks...${NC}"
    
    # Check if Node.js is installed
    if ! command_exists node; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="14.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Please upgrade to v14.0.0 or higher.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"
    
    # Check if port is available
    if ! check_port $GROK_MCP_PORT; then
        echo -e "${RED}❌ Port $GROK_MCP_PORT is already in use${NC}"
        echo -e "${YELLOW}💡 Try using a different port with -p option${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Port $GROK_MCP_PORT is available${NC}"
    
    # Install dependencies if needed
    install_dependencies
    
    # Check environment
    API_KEY_AVAILABLE=false
    if check_environment; then
        API_KEY_AVAILABLE=true
    fi
    
    # Create integrations directory if it doesn't exist
    mkdir -p "$INTEGRATIONS_DIR"
    
    # Set port environment variable
    export GROK_MCP_PORT
    
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo -e ""
    echo -e "${BLUE}🔧 Configuration:${NC}"
    echo -e "  Port: $GROK_MCP_PORT"
    echo -e "  API Key: $([ "$API_KEY_AVAILABLE" = true ] && echo "✅ Available" || echo "❌ Not configured")"
    echo -e "  Fallback: ✅ Enabled"
    echo -e ""
    
    # Start the service
    if [ "$DAEMON_MODE" = true ]; then
        echo -e "${PURPLE}🔧 Starting Grok Debug MCP as daemon...${NC}"
        nohup node "$GROK_MCP_SCRIPT" > /tmp/grok-debug-mcp.log 2>&1 &
        DAEMON_PID=$!
        echo -e "${GREEN}✅ Grok Debug MCP started as daemon (PID: $DAEMON_PID)${NC}"
        echo -e "${BLUE}📊 Dashboard: http://localhost:$GROK_MCP_PORT${NC}"
        echo -e "${BLUE}📋 Log file: /tmp/grok-debug-mcp.log${NC}"
        echo -e "${BLUE}🛑 Stop daemon: kill $DAEMON_PID${NC}"
    else
        start_grok_mcp
    fi
}

# Handle interrupts
trap 'echo -e "\n${YELLOW}🛑 Shutting down Grok Debug MCP...${NC}"; exit 0' INT TERM

# Run main function
main "$@"