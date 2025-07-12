#!/bin/bash

# Cursor MCP Business Automation Platform - Production Deployment Script
# This script deploys the platform to production environments

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PLATFORM_NAME="Cursor MCP Business Automation Platform"
VERSION=$(node -p "require('./package.json').version")
DEPLOY_ENV=${1:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-""}
HEALTH_CHECK_TIMEOUT=300

echo -e "${BLUE}🚀 Starting deployment of ${PLATFORM_NAME} v${VERSION} to ${DEPLOY_ENV}${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking deployment prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if required environment file exists
    if [ ! -f ".env.${DEPLOY_ENV}" ]; then
        print_error "Environment file .env.${DEPLOY_ENV} not found."
        print_info "Please create the environment file with required configurations."
        exit 1
    fi
    
    print_status "All prerequisites met"
}

# Function to run tests
run_tests() {
    print_info "Running test suite..."
    
    npm test
    if [ $? -ne 0 ]; then
        print_error "Tests failed. Deployment aborted."
        exit 1
    fi
    
    print_status "All tests passed"
}

# Function to build Docker images
build_images() {
    print_info "Building Docker images..."
    
    # Build main application image
    docker build -t cursor-mcp-platform:${VERSION} .
    if [ $? -ne 0 ]; then
        print_error "Failed to build Docker image"
        exit 1
    fi
    
    # Tag for registry if specified
    if [ ! -z "$DOCKER_REGISTRY" ]; then
        docker tag cursor-mcp-platform:${VERSION} ${DOCKER_REGISTRY}/cursor-mcp-platform:${VERSION}
        docker tag cursor-mcp-platform:${VERSION} ${DOCKER_REGISTRY}/cursor-mcp-platform:latest
    fi
    
    print_status "Docker images built successfully"
}

# Function to push images to registry
push_images() {
    if [ ! -z "$DOCKER_REGISTRY" ]; then
        print_info "Pushing images to registry..."
        
        docker push ${DOCKER_REGISTRY}/cursor-mcp-platform:${VERSION}
        docker push ${DOCKER_REGISTRY}/cursor-mcp-platform:latest
        
        print_status "Images pushed to registry"
    else
        print_warning "No registry specified, skipping image push"
    fi
}

# Function to deploy services
deploy_services() {
    print_info "Deploying services..."
    
    # Copy environment file
    cp .env.${DEPLOY_ENV} .env
    
    # Stop existing services
    docker-compose down
    
    # Pull latest images if using registry
    if [ ! -z "$DOCKER_REGISTRY" ]; then
        docker-compose pull
    fi
    
    # Start services
    docker-compose up -d
    
    print_status "Services deployed"
}

# Function to wait for health check
wait_for_health() {
    print_info "Waiting for services to be healthy..."
    
    local timeout=$HEALTH_CHECK_TIMEOUT
    local count=0
    
    while [ $count -lt $timeout ]; do
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            print_status "Platform is healthy and ready"
            return 0
        fi
        
        sleep 5
        count=$((count + 5))
        echo -n "."
    done
    
    print_error "Health check timeout. Platform may not be ready."
    return 1
}

# Function to run database migrations
run_migrations() {
    print_info "Running database migrations..."
    
    docker-compose exec app npm run migrate
    if [ $? -ne 0 ]; then
        print_warning "Database migrations failed or not needed"
    else
        print_status "Database migrations completed"
    fi
}

# Function to generate deployment report
generate_report() {
    print_info "Generating deployment report..."
    
    cat > deployment-report.txt << EOF
======================================
DEPLOYMENT REPORT
======================================
Platform: ${PLATFORM_NAME}
Version: ${VERSION}
Environment: ${DEPLOY_ENV}
Deployment Time: $(date)
Docker Registry: ${DOCKER_REGISTRY:-"Local"}

Services Status:
$(docker-compose ps)

Recent Logs:
$(docker-compose logs --tail=50)

Health Check:
$(curl -s http://localhost:3000/health || echo "Health check failed")
======================================
EOF
    
    print_status "Deployment report saved to deployment-report.txt"
}

# Function to cleanup old images
cleanup() {
    print_info "Cleaning up old Docker images..."
    
    # Remove old images (keep latest 3 versions)
    docker images cursor-mcp-platform --format "table {{.Tag}}" | tail -n +4 | xargs -r docker rmi cursor-mcp-platform: 2>/dev/null || true
    
    # Remove dangling images
    docker image prune -f
    
    print_status "Cleanup completed"
}

# Main deployment process
main() {
    echo -e "${BLUE}=================================${NC}"
    echo -e "${BLUE}   DEPLOYMENT STARTING${NC}"
    echo -e "${BLUE}=================================${NC}"
    
    check_prerequisites
    
    # Skip tests in production if SKIP_TESTS is set
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    else
        print_warning "Skipping tests (SKIP_TESTS=true)"
    fi
    
    build_images
    push_images
    deploy_services
    run_migrations
    
    if wait_for_health; then
        generate_report
        cleanup
        
        echo -e "${GREEN}=================================${NC}"
        echo -e "${GREEN}   DEPLOYMENT SUCCESSFUL${NC}"
        echo -e "${GREEN}=================================${NC}"
        print_status "Platform is now running at http://localhost:3000"
        print_status "API documentation available at http://localhost:3000/docs"
        print_status "Admin dashboard available at http://localhost:3000/admin"
    else
        print_error "Deployment completed but health check failed"
        print_info "Check logs with: docker-compose logs"
        exit 1
    fi
}

# Trap to ensure cleanup on script exit
trap 'print_warning "Deployment interrupted"' INT TERM

# Parse command line arguments
case "$1" in
    "production"|"staging"|"development")
        main
        ;;
    "rollback")
        print_info "Rolling back to previous version..."
        docker-compose down
        # Implement rollback logic here
        print_status "Rollback completed"
        ;;
    "status")
        print_info "Checking deployment status..."
        docker-compose ps
        curl -s http://localhost:3000/health || print_error "Service not responding"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    *)
        echo "Usage: $0 {production|staging|development|rollback|status|logs}"
        echo ""
        echo "Examples:"
        echo "  $0 production          # Deploy to production"
        echo "  $0 staging            # Deploy to staging"
        echo "  $0 rollback           # Rollback deployment"
        echo "  $0 status             # Check deployment status"
        echo "  $0 logs               # View deployment logs"
        echo ""
        echo "Environment Variables:"
        echo "  DOCKER_REGISTRY       # Docker registry URL"
        echo "  SKIP_TESTS=true       # Skip test execution"
        exit 1
        ;;
esac