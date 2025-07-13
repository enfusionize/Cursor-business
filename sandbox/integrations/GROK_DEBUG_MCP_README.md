# Grok Debug MCP Integration

## Overview

The Grok Debug MCP (Model Context Protocol) integration provides one-click code debugging capabilities using Grok AI as the primary debugging engine, with comprehensive fallback redundancy systems. This integration seamlessly works with your existing sandbox environment and provides real-time debugging assistance.

## Features

### 🔍 **Core Debugging Capabilities**
- **Code Analysis**: Deep code inspection and issue identification
- **Error Explanation**: Clear, human-readable error explanations
- **Auto-Fix**: Intelligent code fixing with explanations
- **Code Optimization**: Performance and quality improvements
- **Multi-Language Support**: JavaScript, Python, TypeScript, JSX, TSX, JSON, YAML

### 🛡️ **Redundancy & Reliability**
- **Primary System**: Grok AI via X.AI API
- **Fallback Systems**: Cursor, Claude, Local debugging
- **Graceful Degradation**: Automatic fallback when primary system unavailable
- **Session Management**: Persistent debugging sessions with history

### 🚀 **Integration Features**
- **One-Click Access**: Direct integration with sandbox dashboard
- **Real-Time Status**: Live API status monitoring
- **Quick Debug**: Debug code blocks directly from any interface
- **Batch Processing**: Debug entire projects or file sets
- **Export Results**: Copy and share debugging results

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Grok API key (optional, fallback available)

### Setup

1. **Install Dependencies**
```bash
cd sandbox
./start-grok-debug.sh --install-deps
```

2. **Configure API Key (Optional)**
```bash
export GROK_API_KEY="your-grok-api-key-here"
# OR
export XAI_API_KEY="your-xai-api-key-here"
```

3. **Start the MCP Server**
```bash
# Interactive mode
./start-grok-debug.sh

# Daemon mode
./start-grok-debug.sh --daemon

# Custom port
./start-grok-debug.sh -p 3102
```

## Usage

### Dashboard Integration

The Grok Debug MCP automatically integrates with your sandbox dashboard:

1. **Main Dashboard Button**: Look for the "Grok Debug" button in your actions toolbar
2. **Status Indicator**: Bottom-right corner shows real-time API status
3. **Quick Debug**: Hover over any code block to see debug options

### Direct API Usage

#### Debug Code
```javascript
POST /api/grok/debug-code
{
  "code": "function example() { return undefinedVariable; }",
  "language": "javascript",
  "description": "Function with undefined variable",
  "errorMessage": "ReferenceError: undefinedVariable is not defined"
}
```

#### Fix Code
```javascript
POST /api/grok/fix-code
{
  "code": "function broken() { return x + y }",
  "language": "javascript",
  "issues": "Variables x and y are not defined",
  "requirements": "Make it work with default values"
}
```

#### Optimize Code
```javascript
POST /api/grok/optimize-code
{
  "code": "for(let i=0; i<array.length; i++) { console.log(array[i]); }",
  "language": "javascript",
  "optimizationGoals": "performance,readability"
}
```

#### Explain Error
```javascript
POST /api/grok/explain-error
{
  "errorMessage": "TypeError: Cannot read property 'length' of undefined",
  "code": "function getLength(arr) { return arr.length; }",
  "language": "javascript",
  "context": "runtime"
}
```

### CLI Commands

```bash
# Start Grok Debug MCP
npm run grok-debug

# Start as daemon
npm run grok-debug-daemon

# Open debug widget
npm run grok-debug-widget

# Check environment
./start-grok-debug.sh --check-env
```

### File and Project Debugging

#### Debug Single File
```javascript
POST /api/grok/debug-file
{
  "filePath": "/path/to/your/file.js",
  "issues": "Performance issues in loops"
}
```

#### Debug Entire Project
```javascript
POST /api/grok/debug-project
{
  "projectPath": "/path/to/project",
  "includePatterns": ["**/*.js", "**/*.ts"],
  "excludePatterns": ["node_modules/**", "dist/**"]
}
```

## Configuration

### Environment Variables

```bash
# Primary API configuration
GROK_API_KEY=your-grok-api-key
XAI_API_KEY=your-xai-api-key  # Alternative

# Server configuration
GROK_MCP_PORT=3101  # Default port

# Debugging options
GROK_DEBUG_TIMEOUT=30000  # 30 seconds
GROK_MAX_FILE_SIZE=1048576  # 1MB
```

### API Configuration

The MCP server uses the following default configuration:

```javascript
{
  grokAPI: {
    baseURL: 'https://api.x.ai/v1',
    model: 'grok-beta',
    maxTokens: 4096,
    temperature: 0.1
  },
  debugging: {
    maxFileSize: 1024 * 1024, // 1MB
    supportedLanguages: ['javascript', 'python', 'typescript', 'jsx', 'tsx', 'json', 'yaml'],
    timeout: 30000
  },
  redundancy: {
    enabled: true,
    fallbackSystems: ['cursor', 'claude', 'local'],
    retryAttempts: 3
  }
}
```

## Advanced Features

### Session Management

All debugging sessions are automatically saved and can be retrieved:

```javascript
// Get all sessions
GET /api/grok/sessions

// Get specific session
GET /api/grok/sessions/debug-1703123456789

// Delete session
DELETE /api/grok/sessions/debug-1703123456789
```

### Batch Operations

Debug multiple files or code snippets in a single request:

```javascript
// Project-wide debugging
POST /api/grok/debug-project
{
  "projectPath": "./src",
  "includePatterns": ["**/*.js", "**/*.ts"],
  "excludePatterns": ["node_modules/**", "*.test.js"]
}
```

### Real-Time Monitoring

The system provides real-time status updates via WebSocket connections and HTTP polling:

```javascript
// Health check endpoint
GET /api/grok/health

// Response
{
  "status": "healthy",
  "grokAPI": "available",
  "sessions": 5,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Troubleshooting

### Common Issues

#### 1. API Key Not Working
```bash
# Check environment
./start-grok-debug.sh --check-env

# Test API connection
curl -H "Authorization: Bearer $GROK_API_KEY" https://api.x.ai/v1/models
```

#### 2. Port Already in Use
```bash
# Use different port
./start-grok-debug.sh -p 3102

# Check what's using the port
lsof -i :3101
```

#### 3. Dependencies Missing
```bash
# Install all dependencies
./start-grok-debug.sh --install-deps

# Manual installation
npm install axios fs-extra chalk ora glob
```

#### 4. Fallback Mode Active
- **Cause**: Grok API key not configured or API unavailable
- **Solution**: Configure API key or use fallback systems
- **Impact**: Reduced functionality but still operational

### Debug Logs

Enable verbose logging:

```bash
# View real-time logs
tail -f /tmp/grok-debug-mcp.log

# Start with debug output
DEBUG=grok-mcp ./start-grok-debug.sh
```

### Performance Optimization

#### 1. File Size Limits
```javascript
// Adjust in configuration
debugging: {
  maxFileSize: 2 * 1024 * 1024, // 2MB
}
```

#### 2. Timeout Settings
```javascript
// Increase timeout for large files
debugging: {
  timeout: 60000, // 60 seconds
}
```

#### 3. Concurrent Sessions
```javascript
// Limit concurrent debugging sessions
const maxConcurrentSessions = 10;
```

## Security Considerations

### API Key Security
- Store API keys in environment variables
- Never commit API keys to version control
- Use different keys for development and production
- Regularly rotate API keys

### Code Privacy
- All code is sent to Grok API for analysis
- Consider using fallback mode for sensitive code
- Implement local debugging for confidential projects

### Network Security
- Use HTTPS for all API communications
- Implement rate limiting for API calls
- Monitor for unusual API usage patterns

## Integration Examples

### React Component Debugging
```javascript
// Debug React component
const componentCode = `
function MyComponent({ data }) {
  return (
    <div>
      {data.map(item => <span key={item.id}>{item.name}</span>)}
    </div>
  );
}
`;

// Send to Grok Debug
window.GrokDebugIntegration.debugCodeWithGrok(componentCode);
```

### Node.js API Debugging
```javascript
// Debug API endpoint
const apiCode = `
app.get('/api/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});
`;

fetch('/api/grok/debug-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: apiCode,
    language: 'javascript',
    description: 'Express API endpoint'
  })
});
```

### Python Script Debugging
```python
# Python debugging example
python_code = """
def calculate_average(numbers):
    return sum(numbers) / len(numbers)

result = calculate_average([])
print(result)
"""

# Send to debug endpoint
requests.post('http://localhost:3101/api/grok/debug-code', json={
    'code': python_code,
    'language': 'python',
    'description': 'Calculate average function'
})
```

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/grok/debug-code` | Debug code snippet |
| POST | `/api/grok/fix-code` | Fix code issues |
| POST | `/api/grok/optimize-code` | Optimize code |
| POST | `/api/grok/explain-error` | Explain error message |
| POST | `/api/grok/debug-file` | Debug single file |
| POST | `/api/grok/debug-project` | Debug entire project |
| GET | `/api/grok/sessions` | List debug sessions |
| GET | `/api/grok/sessions/:id` | Get specific session |
| DELETE | `/api/grok/sessions/:id` | Delete session |
| GET | `/api/grok/health` | Health check |

### Response Format

All endpoints return JSON responses with this structure:

```javascript
{
  "success": true,
  "sessionId": "debug-1703123456789",
  "result": {
    "issues": ["Array of issues found"],
    "rootCause": "Primary cause of the problem",
    "fixes": ["Array of recommended fixes"],
    "prevention": ["Array of prevention tips"]
  }
}
```

### Error Responses

```javascript
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run grok-debug`

### Testing

```bash
# Run basic tests
npm test

# Test API endpoints
curl -X POST http://localhost:3101/api/grok/debug-code \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(x)", "language": "javascript"}'
```

### Code Style

- Use ESLint configuration
- Follow existing code patterns
- Add comprehensive error handling
- Include JSDoc comments

## Support

### Getting Help

1. Check this documentation
2. Review troubleshooting section
3. Check GitHub issues
4. Contact support team

### Reporting Issues

When reporting issues, include:
- Error messages
- Code that caused the issue
- Environment details
- Steps to reproduce

### Feature Requests

Submit feature requests with:
- Clear description
- Use case examples
- Expected behavior
- Implementation suggestions

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Core debugging functionality
- Dashboard integration
- Fallback systems
- Session management

### Planned Features
- VS Code extension
- GitHub integration
- Slack notifications
- Advanced analytics
- Custom debugging rules

---

**Powered by S.A.I.A.S.™ Framework**  
**Enfusionize™ - Elevating Development Experience**