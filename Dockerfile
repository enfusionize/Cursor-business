# MCP Business Operations Development Environment
FROM node:18-bullseye-slim

# Set working directory
WORKDIR /workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    python3 \
    python3-pip \
    build-essential \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g \
    @anthropic-ai/claude-dev \
    vercel \
    @playwright/mcp@latest \
    typescript \
    ts-node

# Create app user
RUN useradd -m -s /bin/bash appuser && \
    chown -R appuser:appuser /workspace

USER appuser

# Copy package files
COPY --chown=appuser:appuser package*.json ./
COPY --chown=appuser:appuser .env.example ./

# Install project dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install chromium

# Copy project files
COPY --chown=appuser:appuser . .

# Create necessary directories
RUN mkdir -p \
    content/context \
    workflows \
    templates \
    src/pages \
    src/components \
    src/lib \
    public

# Expose development port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Default command
CMD ["npm", "run", "dev"]