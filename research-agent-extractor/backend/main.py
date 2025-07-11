"""
Research Agent Extractor
Domain-specific version of Content Rhythm Extractor
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import asyncio
from datetime import datetime

from core.domain_manager import DomainManager
from core.domain_config import Domain
from models.content import ContentItem

# Initialize domain manager
domain_manager = DomainManager(Domain.RESEARCH)

app = FastAPI(
    title="Research Agent Extractor",
    description="AI agent research and academic content optimization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize domain manager on startup"""
    await domain_manager.initialize()

@app.get("/")
async def root():
    """Root endpoint with domain information"""
    return {
        "name": "Research Agent Extractor",
        "domain": "research",
        "description": "AI agent research and academic content optimization",
        "version": "1.0.0",
        "status": "active",
        "initialized": domain_manager.initialized
    }

@app.get("/domain/info")
async def get_domain_info():
    """Get domain information"""
    return domain_manager.get_domain_info()

@app.get("/domain/categories")
async def get_categories():
    """Get content categories for this domain"""
    return domain_manager.get_categories()



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
