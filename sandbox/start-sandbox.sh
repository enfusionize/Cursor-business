#!/bin/bash

# Enfusionize™ Sandbox System Startup Script
# Powered by S.A.I.A.S.™ Framework

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Function to print banner
print_banner() {
    print_color $BLUE "
╔══════════════════════════════════════════════════════════════════════════════╗
║                    Enfusionize™ Advanced Sandbox System                     ║
║                     Powered by S.A.I.A.S.™ Framework                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_color $YELLOW "🔍 Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_color $RED "❌ Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        print_color $RED "❌ Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_color $RED "❌ npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    # Check Docker
    if ! command_exists docker; then
        print_color $RED "❌ Docker is not installed. Please install Docker and try again."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_color $RED "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    print_color $GREEN "✅ All prerequisites met!"
}

# Function to install dependencies
install_dependencies() {
    print_color $YELLOW "📦 Installing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        print_color $GREEN "✅ Dependencies already installed"
    fi
}

# Function to create necessary directories
create_directories() {
    print_color $YELLOW "📁 Creating necessary directories..."
    
    local directories=(
        "sandbox/environments"
        "sandbox/apps"
        "sandbox/configs"
        "sandbox/scripts"
        "sandbox/monitoring"
        "sandbox/deployment"
        "sandbox/tests"
        "sandbox/backups"
        "sandbox/logs"
        "sandbox/dashboard"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
    done
    
    print_color $GREEN "✅ Directories created"
}

# Function to check and create default configuration
setup_configuration() {
    print_color $YELLOW "⚙️  Setting up configuration..."
    
    local config_file="sandbox/configs/sandbox-config.json"
    
    if [ ! -f "$config_file" ]; then
        print_color $YELLOW "📝 Creating default configuration..."
        # Configuration will be created by the sandbox manager on first run
    fi
    
    print_color $GREEN "✅ Configuration ready"
}

# Function to start the sandbox system
start_sandbox() {
    print_color $YELLOW "🚀 Starting Enfusionize™ Sandbox System..."
    
    # Check if port 3100 is available
    if lsof -Pi :3100 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_color $RED "❌ Port 3100 is already in use. Please stop the existing service and try again."
        exit 1
    fi
    
    print_color $GREEN "✅ Starting sandbox manager..."
    print_color $BLUE "📊 Dashboard will be available at: http://localhost:3100/dashboard"
    print_color $BLUE "🖥️  CLI commands available via: npm run sandbox-cli"
    
    # Start the sandbox manager
    node sandbox/sandbox-manager.js
}

# Function to show usage information
show_usage() {
    print_color $BLUE "
Usage: $0 [OPTIONS]

Options:
  --help, -h          Show this help message
  --check-only        Only check prerequisites, don't start
  --cli               Start in CLI mode
  --interactive       Start in interactive CLI mode
  --dashboard-only    Start only the dashboard
  --version           Show version information

Examples:
  $0                  # Start the full sandbox system
  $0 --cli            # Start in CLI mode
  $0 --interactive    # Start interactive CLI
  $0 --check-only     # Only check prerequisites
"
}

# Function to show version
show_version() {
    print_color $BLUE "Enfusionize™ Sandbox System v1.0.0"
    print_color $BLUE "Powered by S.A.I.A.S.™ Framework"
}

# Main function
main() {
    print_banner
    
    # Parse command line arguments
    case "${1:-}" in
        --help|-h)
            show_usage
            exit 0
            ;;
        --version)
            show_version
            exit 0
            ;;
        --check-only)
            check_prerequisites
            print_color $GREEN "✅ All checks passed!"
            exit 0
            ;;
        --cli)
            check_prerequisites
            install_dependencies
            print_color $GREEN "🚀 Starting CLI mode..."
            node sandbox/cli.js "${@:2}"
            exit 0
            ;;
        --interactive)
            check_prerequisites
            install_dependencies
            print_color $GREEN "🚀 Starting interactive CLI mode..."
            node sandbox/cli.js interactive
            exit 0
            ;;
        --dashboard-only)
            check_prerequisites
            install_dependencies
            create_directories
            setup_configuration
            print_color $GREEN "🚀 Starting dashboard only..."
            node sandbox/sandbox-manager.js --dashboard-only
            exit 0
            ;;
        "")
            # Default: start full system
            ;;
        *)
            print_color $RED "❌ Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
    
    # Run full startup sequence
    check_prerequisites
    install_dependencies
    create_directories
    setup_configuration
    start_sandbox
}

# Trap Ctrl+C
trap 'print_color $YELLOW "\n🛑 Shutting down sandbox system..."; exit 0' INT

# Run main function
main "$@"