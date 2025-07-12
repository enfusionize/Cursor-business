#!/usr/bin/env python3
"""
MCP Business Operations Dashboard API
Integrates with existing Node.js MCP system via FastAPI
Provides real-time dashboard with live data sharing
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
import asyncio
import json
import subprocess
import os
import sqlite3
import aiofiles
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import psutil
import requests
from pathlib import Path
import logging
import yaml

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="MCP Business Operations Dashboard",
    description="Real-time dashboard for Cursor MCP Business Operations",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state management
class DashboardState:
    def __init__(self):
        self.connected_clients: Dict[str, WebSocket] = {}
        self.mcp_processes: Dict[str, Any] = {}
        self.system_metrics: Dict[str, Any] = {}
        self.automation_queue: List[Dict[str, Any]] = []
        self.active_workflows: Dict[str, Any] = {}
        
dashboard_state = DashboardState()

# Utility functions
async def run_node_command(command: str) -> Dict[str, Any]:
    """Execute Node.js MCP commands and return results"""
    try:
        process = await asyncio.create_subprocess_exec(
            'node', '-e', command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=Path(__file__).parent.parent
        )
        stdout, stderr = await process.communicate()
        
        return {
            "success": process.returncode == 0,
            "stdout": stdout.decode() if stdout else "",
            "stderr": stderr.decode() if stderr else "",
            "return_code": process.returncode
        }
    except Exception as e:
        logger.error(f"Node command failed: {e}")
        return {"success": False, "error": str(e)}

async def get_mcp_status() -> Dict[str, Any]:
    """Get status of all MCP servers"""
    try:
        # Read MCP config
        config_path = Path(__file__).parent.parent / "mcp-config-template.json"
        if config_path.exists():
            async with aiofiles.open(config_path, 'r') as f:
                config_content = await f.read()
                mcp_config = json.loads(config_content)
        else:
            mcp_config = {"mcpServers": {}}
        
        # Check process status
        mcp_status = {}
        for server_name, config in mcp_config.get("mcpServers", {}).items():
            mcp_status[server_name] = {
                "name": server_name,
                "configured": True,
                "running": await check_mcp_process(server_name),
                "config": config
            }
        
        return mcp_status
    except Exception as e:
        logger.error(f"Failed to get MCP status: {e}")
        return {}

async def check_mcp_process(server_name: str) -> bool:
    """Check if specific MCP server is running"""
    try:
        # Check for node processes containing the server name
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            if proc.info['name'] == 'node' and proc.info['cmdline']:
                cmdline = ' '.join(proc.info['cmdline'])
                if server_name in cmdline:
                    return True
        return False
    except Exception:
        return False

async def get_system_metrics() -> Dict[str, Any]:
    """Get real-time system metrics"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "timestamp": datetime.now().isoformat(),
            "cpu": {
                "percent": cpu_percent,
                "cores": psutil.cpu_count()
            },
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": (disk.used / disk.total) * 100
            },
            "processes": len(psutil.pids())
        }
    except Exception as e:
        logger.error(f"Failed to get system metrics: {e}")
        return {}

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        dashboard_state.connected_clients[client_id] = websocket
        logger.info(f"Client {client_id} connected")
    
    def disconnect(self, websocket: WebSocket, client_id: str):
        self.active_connections.remove(websocket)
        if client_id in dashboard_state.connected_clients:
            del dashboard_state.connected_clients[client_id]
        logger.info(f"Client {client_id} disconnected")
    
    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(data))
            except Exception as e:
                logger.error(f"Failed to send to client: {e}")

manager = ConnectionManager()

# API Routes
@app.get("/")
async def get_dashboard():
    """Serve the main dashboard"""
    return HTMLResponse(content=open("dashboard/index.html").read())

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/status")
async def get_status():
    """Get complete system status"""
    return {
        "mcp_servers": await get_mcp_status(),
        "system_metrics": await get_system_metrics(),
        "connected_clients": len(dashboard_state.connected_clients),
        "active_workflows": len(dashboard_state.active_workflows),
        "automation_queue": len(dashboard_state.automation_queue)
    }

@app.get("/api/mcp/servers")
async def list_mcp_servers():
    """List all MCP servers and their status"""
    return await get_mcp_status()

@app.post("/api/mcp/start/{server_name}")
async def start_mcp_server(server_name: str, background_tasks: BackgroundTasks):
    """Start specific MCP server"""
    try:
        # Execute the start.js launcher command for specific server
        command = f"const launcher = require('./start.js'); launcher.startMCPServer('{server_name}');"
        result = await run_node_command(command)
        
        if result["success"]:
            background_tasks.add_task(broadcast_status_update)
            return {"message": f"MCP server {server_name} started", "success": True}
        else:
            raise HTTPException(status_code=500, detail=f"Failed to start {server_name}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/mcp/stop/{server_name}")
async def stop_mcp_server(server_name: str, background_tasks: BackgroundTasks):
    """Stop specific MCP server"""
    try:
        # Find and terminate the process
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            if proc.info['name'] == 'node' and proc.info['cmdline']:
                cmdline = ' '.join(proc.info['cmdline'])
                if server_name in cmdline:
                    proc.terminate()
                    background_tasks.add_task(broadcast_status_update)
                    return {"message": f"MCP server {server_name} stopped", "success": True}
        
        return {"message": f"MCP server {server_name} not found", "success": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/automation/create")
async def create_automation(automation_data: dict, background_tasks: BackgroundTasks):
    """Create new automation using String.com-style natural language"""
    try:
        # Use the existing string automation engine
        command = f"""
        const StringEngine = require('./scripts/string-automation-engine.js');
        const engine = new StringEngine();
        engine.createAutomation({json.dumps(automation_data)});
        """
        
        result = await run_node_command(command)
        
        if result["success"]:
            automation_id = f"auto_{len(dashboard_state.automation_queue) + 1}"
            dashboard_state.automation_queue.append({
                "id": automation_id,
                "data": automation_data,
                "status": "created",
                "timestamp": datetime.now().isoformat()
            })
            
            background_tasks.add_task(broadcast_status_update)
            return {"automation_id": automation_id, "success": True}
        else:
            raise HTTPException(status_code=500, detail="Failed to create automation")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/automation/queue")
async def get_automation_queue():
    """Get current automation queue"""
    return {"queue": dashboard_state.automation_queue}

@app.post("/api/launcher/action/{action}")
async def execute_launcher_action(action: str, parameters: dict = None):
    """Execute MCP launcher actions"""
    try:
        if parameters is None:
            parameters = {}
        
        # Map to existing start.js functions
        command_map = {
            "setup": "launcher.runSetup()",
            "validate": "launcher.runValidation()",
            "test-mcps": "launcher.testMCPs()",
            "dev": "launcher.startDevelopment()",
            "docker": "launcher.startDocker()",
            "claude": "launcher.startClaude()",
            "ai-testing": "launcher.runAITesting()",
            "figma-sync": "launcher.runFigmaSync()",
            "knowledge-engine": "launcher.runKnowledgeEngine()",
            "learning-daemon": "launcher.runLearningDaemon()",
            "clickup": "launcher.runClickUpIntegration()",
            "demo": "launcher.runDemo()",
            "string-automation": "launcher.runStringAutomation()",
            "automation-templates": "launcher.runAutomationTemplates()",
            "business-intelligence": "launcher.runBusinessIntelligence()"
        }
        
        if action not in command_map:
            raise HTTPException(status_code=400, detail=f"Unknown action: {action}")
        
        command = f"""
        const MCPLauncher = require('./start.js');
        const launcher = new MCPLauncher();
        {command_map[action]};
        """
        
        result = await run_node_command(command)
        return {
            "action": action,
            "success": result["success"],
            "output": result.get("stdout", ""),
            "error": result.get("stderr", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents")
async def list_documents():
    """List all documentation files with live preview capability"""
    try:
        docs = []
        doc_extensions = ['.md', '.txt', '.json', '.yml', '.yaml']
        
        for file_path in Path('.').rglob('*'):
            if file_path.is_file() and file_path.suffix in doc_extensions:
                try:
                    stat = file_path.stat()
                    docs.append({
                        "name": file_path.name,
                        "path": str(file_path),
                        "size": stat.st_size,
                        "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        "type": file_path.suffix[1:],
                        "clickable": True
                    })
                except Exception as e:
                    logger.warning(f"Could not stat file {file_path}: {e}")
        
        return {"documents": sorted(docs, key=lambda x: x['modified'], reverse=True)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/content")
async def get_document_content(path: str):
    """Get live document content"""
    try:
        file_path = Path(path)
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Document not found")
        
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
        
        return {
            "path": path,
            "content": content,
            "size": len(content),
            "modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scripts")
async def list_scripts():
    """List all executable scripts with status"""
    try:
        scripts = []
        script_dirs = ['scripts/', 'mcps/', '.']
        
        for script_dir in script_dirs:
            script_path = Path(script_dir)
            if script_path.exists():
                for file_path in script_path.rglob('*.js'):
                    if file_path.is_file():
                        scripts.append({
                            "name": file_path.name,
                            "path": str(file_path),
                            "directory": script_dir,
                            "executable": True,
                            "size": file_path.stat().st_size,
                            "modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
                        })
        
        return {"scripts": scripts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scripts/execute")
async def execute_script(script_data: dict, background_tasks: BackgroundTasks):
    """Execute script with live output streaming"""
    try:
        script_path = script_data.get("path")
        parameters = script_data.get("parameters", [])
        
        if not script_path or not Path(script_path).exists():
            raise HTTPException(status_code=404, detail="Script not found")
        
        # Execute script and stream output
        execution_id = f"exec_{datetime.now().timestamp()}"
        dashboard_state.active_workflows[execution_id] = {
            "script": script_path,
            "parameters": parameters,
            "status": "running",
            "started": datetime.now().isoformat()
        }
        
        background_tasks.add_task(run_script_background, script_path, parameters, execution_id)
        
        return {
            "execution_id": execution_id,
            "status": "started",
            "script": script_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def run_script_background(script_path: str, parameters: List[str], execution_id: str):
    """Run script in background and broadcast updates"""
    try:
        process = await asyncio.create_subprocess_exec(
            'node', script_path, *parameters,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        result = {
            "execution_id": execution_id,
            "success": process.returncode == 0,
            "stdout": stdout.decode() if stdout else "",
            "stderr": stderr.decode() if stderr else "",
            "finished": datetime.now().isoformat()
        }
        
        dashboard_state.active_workflows[execution_id].update({
            "status": "completed" if result["success"] else "failed",
            "result": result
        })
        
        await manager.broadcast({
            "type": "script_completed",
            "data": result
        })
        
    except Exception as e:
        dashboard_state.active_workflows[execution_id].update({
            "status": "error",
            "error": str(e)
        })
        await manager.broadcast({
            "type": "script_error",
            "data": {"execution_id": execution_id, "error": str(e)}
        })

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Send periodic updates
            await asyncio.sleep(5)
            status_data = {
                "type": "status_update",
                "data": {
                    "mcp_servers": await get_mcp_status(),
                    "system_metrics": await get_system_metrics(),
                    "timestamp": datetime.now().isoformat()
                }
            }
            await websocket.send_text(json.dumps(status_data))
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)

async def broadcast_status_update():
    """Broadcast status update to all connected clients"""
    status_data = {
        "type": "status_update",
        "data": {
            "mcp_servers": await get_mcp_status(),
            "system_metrics": await get_system_metrics(),
            "timestamp": datetime.now().isoformat()
        }
    }
    await manager.broadcast(status_data)

# Background tasks
@app.on_event("startup")
async def startup_event():
    """Initialize dashboard on startup"""
    logger.info("MCP Business Operations Dashboard starting...")
    
    # Create necessary directories
    Path("dashboard").mkdir(exist_ok=True)
    Path("logs").mkdir(exist_ok=True)
    
    # Start background monitoring
    asyncio.create_task(background_monitoring())

async def background_monitoring():
    """Background task for continuous monitoring"""
    while True:
        try:
            # Update system metrics
            dashboard_state.system_metrics = await get_system_metrics()
            
            # Check MCP server health
            mcp_status = await get_mcp_status()
            
            # Broadcast updates if clients are connected
            if dashboard_state.connected_clients:
                await broadcast_status_update()
                
        except Exception as e:
            logger.error(f"Background monitoring error: {e}")
        
        await asyncio.sleep(10)

# Mount static files for dashboard
app.mount("/static", StaticFiles(directory="dashboard/static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")