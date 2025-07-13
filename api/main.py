from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
import os
# import aiofiles  # Uncomment to use async file operations

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/users")
async def get_users():
    # Mock user data
    return [
        {"id": 1, "name": "John Doe", "email": "john@example.com"},
        {"id": 2, "name": "Jane Smith", "email": "jane@example.com"}
    ]

@app.get("/api/data")
async def get_data():
    # Mock data endpoint
    return {"data": "sample data", "count": 100}

@app.get("/dashboard", response_class=HTMLResponse)
async def get_dashboard():
    """
    Dashboard endpoint that serves the HTML file.
    
    This endpoint has a file handle resource leak issue where the file
    is opened but never properly closed, which can lead to resource
    exhaustion over time.
    """
    try:
        # FIXED: Using context manager to ensure proper file handle cleanup
        with open("dashboard/index.html", "r", encoding="utf-8") as file:
            content = file.read()
        
        # Alternative async approach using aiofiles (requires: pip install aiofiles):
        # async with aiofiles.open("dashboard/index.html", "r", encoding="utf-8") as file:
        #     content = await file.read()
        
        return HTMLResponse(content=content)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/settings")
async def get_settings():
    return {"theme": "dark", "notifications": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)