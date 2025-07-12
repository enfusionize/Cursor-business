# 🚀 Deployment Guide

Complete guide for deploying the Cursor MCP Business Automation Platform in production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Docker Deployment](#docker-deployment)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)

---

## 🔧 Prerequisites

### System Requirements

**Minimum Requirements:**
- **CPU**: 2 cores, 2.4 GHz
- **RAM**: 4 GB
- **Storage**: 20 GB SSD
- **Network**: 100 Mbps

**Recommended Requirements:**
- **CPU**: 4+ cores, 3.0 GHz
- **RAM**: 8+ GB
- **Storage**: 50+ GB SSD
- **Network**: 1 Gbps

### Software Dependencies

```bash
# Node.js (v18 or higher)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo apt-get install docker-compose

# Git
sudo apt-get install git

# Additional tools
sudo apt-get install curl wget unzip
```

---

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/cursor-mcp-platform.git
cd cursor-mcp-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
nano .env
```

### 4. Start Development Server

```bash
npm run dev
```

🎉 **Platform accessible at:** http://localhost:3000

---

## 🏭 Production Deployment

### Method 1: Docker Deployment (Recommended)

```bash
# 1. Build and deploy
./scripts/deploy.sh production

# 2. Verify deployment
./scripts/deploy.sh status

# 3. View logs
./scripts/deploy.sh logs
```

### Method 2: Manual Deployment

```bash
# 1. Install production dependencies
npm ci --only=production

# 2. Build application
npm run build

# 3. Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production

# 4. Configure reverse proxy (Nginx)
sudo cp deployment/nginx.conf /etc/nginx/sites-available/cursor-mcp-platform
sudo ln -s /etc/nginx/sites-available/cursor-mcp-platform /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🔐 Environment Configuration

### Core Configuration

```bash
# Required Settings
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/cursor_mcp
REDIS_URL=redis://localhost:6379

# Security (Generate strong secrets)
JWT_SECRET=$(openssl rand -base64 32)
API_KEY_ENCRYPTION_KEY=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
```

### AI Model APIs

```bash
# Primary AI Model
ANTHROPIC_API_KEY=your-claude-api-key

# Backup Models
OPENAI_API_KEY=your-openai-api-key
MINIMAX_API_KEY=your-minimax-api-key
```

### Business Integrations

```bash
# Communication
SLACK_BOT_TOKEN=xoxb-your-slack-token
DISCORD_BOT_TOKEN=your-discord-token

# CRM
SALESFORCE_CLIENT_ID=your-salesforce-id
HUBSPOT_API_KEY=your-hubspot-key

# E-commerce
SHOPIFY_API_KEY=your-shopify-key
STRIPE_SECRET_KEY=your-stripe-key
```

### Security Configuration

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# API Security
API_RATE_LIMIT_PER_HOUR=1000
WEBHOOK_SECRET=$(openssl rand -base64 32)
```

---

## 🗄️ Database Setup

### PostgreSQL (Recommended)

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE cursor_mcp;
CREATE USER cursor_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE cursor_mcp TO cursor_user;
\q

# Configure connection
DATABASE_URL=postgresql://cursor_user:secure_password@localhost:5432/cursor_mcp
```

### Redis Setup

```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis-server

# Configure connection
REDIS_URL=redis://:your_redis_password@localhost:6379
```

### Database Migration

```bash
# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

---

## 🐳 Docker Deployment

### Single Server Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./data:/app/data

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: cursor_mcp
      POSTGRES_USER: cursor_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass secure_password
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployment/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Multi-Server Deployment

```bash
# Deploy to swarm
docker swarm init
docker stack deploy -c docker-compose.swarm.yml cursor-mcp-stack
```

---

## ☁️ Cloud Platform Deployment

### AWS Deployment

```bash
# Using AWS CLI and CloudFormation
aws cloudformation deploy \
  --template-file deployment/aws-cloudformation.yml \
  --stack-name cursor-mcp-platform \
  --parameter-overrides \
    KeyName=your-key-pair \
    InstanceType=t3.medium

# Using ECS Fargate
aws ecs create-cluster --cluster-name cursor-mcp-cluster
aws ecs create-service --cli-input-json file://deployment/ecs-service.json
```

### Google Cloud Platform

```bash
# Using Cloud Run
gcloud run deploy cursor-mcp-platform \
  --image gcr.io/your-project/cursor-mcp-platform \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Using GKE
kubectl apply -f deployment/k8s/
```

### Microsoft Azure

```bash
# Using Container Instances
az container create \
  --resource-group cursor-mcp-rg \
  --name cursor-mcp-platform \
  --image your-registry/cursor-mcp-platform \
  --dns-name-label cursor-mcp-platform \
  --ports 3000
```

### DigitalOcean

```bash
# Using App Platform
doctl apps create --spec deployment/digitalocean-app.yml

# Using Kubernetes
doctl kubernetes cluster kubeconfig save cursor-mcp-cluster
kubectl apply -f deployment/k8s/
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Platform health endpoint
curl http://localhost:3000/health

# Detailed status
curl http://localhost:3000/api/v1/status

# Database connectivity
curl http://localhost:3000/api/v1/health/database
```

### Logging

```bash
# Application logs
npm run logs

# Docker logs
docker-compose logs -f

# System logs
journalctl -u cursor-mcp-platform -f
```

### Performance Monitoring

```javascript
// New Relic configuration
{
  "app_name": ["Cursor MCP Platform"],
  "license_key": "your-newrelic-license-key",
  "logging": {
    "level": "info"
  }
}
```

### Backup Strategy

```bash
# Database backup
pg_dump cursor_mcp > backup_$(date +%Y%m%d_%H%M%S).sql

# Redis backup
redis-cli --rdb dump_$(date +%Y%m%d_%H%M%S).rdb

# Application data backup
tar -czf app_data_$(date +%Y%m%d_%H%M%S).tar.gz ./data/
```

### Update Process

```bash
# 1. Backup current deployment
./scripts/backup.sh

# 2. Pull latest changes
git pull origin main

# 3. Update dependencies
npm ci

# 4. Run database migrations
npm run migrate

# 5. Deploy updates
./scripts/deploy.sh production

# 6. Verify deployment
./scripts/deploy.sh status
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Port already in use**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Issue: Database connection failed**
```bash
# Test database connection
psql $DATABASE_URL
# Check PostgreSQL status
sudo systemctl status postgresql
```

**Issue: Redis connection failed**
```bash
# Test Redis connection
redis-cli ping
# Check Redis status
sudo systemctl status redis-server
```

**Issue: Docker build fails**
```bash
# Clear Docker cache
docker system prune -a
# Rebuild without cache
docker build --no-cache -t cursor-mcp-platform .
```

### Performance Issues

**High CPU Usage:**
```bash
# Check Node.js processes
top -p $(pgrep node)
# Monitor with htop
htop
```

**Memory Leaks:**
```bash
# Monitor memory usage
free -h
# Node.js memory debugging
node --inspect=0.0.0.0:9229 app.js
```

**Database Performance:**
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
```

### Log Analysis

```bash
# Error patterns
grep -i "error" /var/log/cursor-mcp-platform.log

# Performance patterns
grep -i "slow" /var/log/cursor-mcp-platform.log

# Security patterns
grep -i "401\|403\|failed" /var/log/nginx/access.log
```

---

## 🛡️ Security Considerations

### SSL/TLS Configuration

```nginx
# Nginx SSL configuration
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3000/tcp  # Block direct access to app
```

### API Security

```javascript
// Rate limiting configuration
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP"
}
```

### Database Security

```sql
-- Create restricted user for application
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE ALL PRIVILEGES ON pg_stat_statements FROM app_user;
```

### Environment Security

```bash
# Secure environment files
chmod 600 .env*
chown root:root .env*

# Rotate secrets regularly
./scripts/rotate-secrets.sh
```

---

## 📞 Support & Help

### Community Resources

- **Documentation**: [GitHub Wiki](https://github.com/your-org/cursor-mcp-platform/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-org/cursor-mcp-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/cursor-mcp-platform/discussions)

### Professional Support

- **Email**: support@cursor-mcp-platform.com
- **Enterprise Support**: enterprise@cursor-mcp-platform.com
- **Security Issues**: security@cursor-mcp-platform.com

### Deployment Services

We offer professional deployment services:

- **Basic Setup**: $500 - Standard deployment with support
- **Advanced Setup**: $2,000 - Custom configuration and integration
- **Enterprise Setup**: $10,000 - Full managed deployment with SLA

Contact: deployment@cursor-mcp-platform.com

---

**📈 Ready to scale your business with AI automation?**

Start your deployment today and join thousands of businesses already using the Cursor MCP Business Automation Platform to streamline their operations and drive growth.