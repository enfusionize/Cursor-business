#!/bin/bash
# Research Agent Extractor Startup Script

echo "Starting Research Agent Extractor..."

# Set environment
export DOMAIN=research
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Run the application
echo "Starting Research Agent Extractor on port 8000..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
