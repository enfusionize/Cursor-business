/**
 * Grok Debug MCP Integration for Sandbox Dashboard
 * Adds one-click debugging capabilities to the main dashboard
 */

// Add Grok Debug button to dashboard
function addGrokDebugButton() {
    // Check if we're on the main dashboard
    if (document.getElementById('grok-debug-btn')) {
        return; // Already added
    }

    // Create Grok Debug button
    const grokButton = document.createElement('button');
    grokButton.id = 'grok-debug-btn';
    grokButton.className = 'bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center space-x-2';
    grokButton.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Grok Debug</span>
    `;
    
    // Add click handler
    grokButton.addEventListener('click', function() {
        openGrokDebugWidget();
    });

    // Find the actions container or create one
    let actionsContainer = document.getElementById('actions-container');
    if (!actionsContainer) {
        actionsContainer = document.createElement('div');
        actionsContainer.id = 'actions-container';
        actionsContainer.className = 'flex flex-wrap gap-4 mb-6';
        
        // Insert at the top of the main content
        const mainContent = document.querySelector('.main-content') || document.body;
        mainContent.insertBefore(actionsContainer, mainContent.firstChild);
    }

    // Add the button to the actions container
    actionsContainer.appendChild(grokButton);
}

// Open Grok Debug Widget
function openGrokDebugWidget() {
    // Check if widget is already open
    if (document.getElementById('grok-debug-modal')) {
        return;
    }

    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'grok-debug-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-2xl font-bold text-gray-800">Grok Debug MCP</h2>
                <button id="close-grok-modal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <iframe src="grok-debug-widget.html" class="w-full h-[600px] border-0 rounded-lg"></iframe>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Add close functionality
    document.getElementById('close-grok-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('grok-debug-modal')) {
            document.body.removeChild(document.getElementById('grok-debug-modal'));
        }
    });
}

// Add status indicator for Grok API
function addGrokStatusIndicator() {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'grok-status-indicator';
    statusIndicator.className = 'fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-3 flex items-center space-x-2 z-40';
    statusIndicator.innerHTML = `
        <div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        <span class="text-sm font-medium text-gray-700">Grok: Checking...</span>
    `;

    document.body.appendChild(statusIndicator);

    // Check Grok API status
    checkGrokStatus();
}

// Check Grok API status
async function checkGrokStatus() {
    const statusIndicator = document.getElementById('grok-status-indicator');
    if (!statusIndicator) return;

    try {
        const response = await fetch('/api/grok/health');
        const data = await response.json();
        
        const statusDot = statusIndicator.querySelector('div');
        const statusText = statusIndicator.querySelector('span');
        
        if (data.grokAPI === 'available') {
            statusDot.className = 'w-3 h-3 bg-green-500 rounded-full';
            statusText.textContent = 'Grok: Available';
        } else {
            statusDot.className = 'w-3 h-3 bg-orange-500 rounded-full';
            statusText.textContent = 'Grok: Fallback Mode';
        }
    } catch (error) {
        const statusDot = statusIndicator.querySelector('div');
        const statusText = statusIndicator.querySelector('span');
        
        statusDot.className = 'w-3 h-3 bg-red-500 rounded-full';
        statusText.textContent = 'Grok: Offline';
    }
}

// Add quick debug functionality to any code blocks
function addQuickDebugToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code, .code-block, textarea[class*="code"]');
    
    codeBlocks.forEach(block => {
        if (block.dataset.grokEnabled) return; // Already processed
        
        // Create debug button
        const debugBtn = document.createElement('button');
        debugBtn.className = 'absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors';
        debugBtn.innerHTML = '🔍 Debug';
        debugBtn.title = 'Debug with Grok';
        
        // Make parent relative if needed
        const parent = block.parentElement;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        // Add button to parent
        parent.appendChild(debugBtn);
        
        // Add click handler
        debugBtn.addEventListener('click', function() {
            const code = block.textContent || block.value;
            debugCodeWithGrok(code);
        });
        
        // Mark as processed
        block.dataset.grokEnabled = 'true';
    });
}

// Debug code with Grok
async function debugCodeWithGrok(code) {
    if (!code || !code.trim()) {
        alert('No code to debug');
        return;
    }

    // Show loading
    const loadingModal = document.createElement('div');
    loadingModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingModal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p class="text-gray-700">Debugging code with Grok...</p>
        </div>
    `;
    document.body.appendChild(loadingModal);

    try {
        const response = await fetch('/api/grok/debug-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                language: 'javascript', // Default, could be auto-detected
                description: 'Quick debug from dashboard'
            })
        });

        const data = await response.json();
        
        // Remove loading
        document.body.removeChild(loadingModal);
        
        if (data.success) {
            showDebugResults(data.result);
        } else {
            alert('Debug failed: ' + data.error);
        }
    } catch (error) {
        document.body.removeChild(loadingModal);
        alert('Debug failed: ' + error.message);
    }
}

// Show debug results
function showDebugResults(result) {
    const resultsModal = document.createElement('div');
    resultsModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    resultsModal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-2xl font-bold text-gray-800">Debug Results</h2>
                <button id="close-results-modal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div class="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                ${formatDebugResults(result)}
            </div>
        </div>
    `;

    document.body.appendChild(resultsModal);

    // Add close functionality
    document.getElementById('close-results-modal').addEventListener('click', function() {
        document.body.removeChild(resultsModal);
    });

    // Close on overlay click
    resultsModal.addEventListener('click', function(e) {
        if (e.target === resultsModal) {
            document.body.removeChild(resultsModal);
        }
    });
}

// Format debug results
function formatDebugResults(result) {
    let html = '';
    
    if (result.issues && result.issues.length > 0) {
        html += `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-red-600 mb-3">Issues Found:</h3>
                <ul class="list-disc list-inside space-y-2">
                    ${result.issues.map(issue => `<li class="text-gray-700">${issue}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (result.rootCause) {
        html += `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-orange-600 mb-3">Root Cause:</h3>
                <p class="text-gray-700">${result.rootCause}</p>
            </div>
        `;
    }
    
    if (result.fixes && result.fixes.length > 0) {
        html += `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-green-600 mb-3">Recommended Fixes:</h3>
                <ul class="list-disc list-inside space-y-2">
                    ${result.fixes.map(fix => `<li class="text-gray-700">${fix}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (result.prevention && result.prevention.length > 0) {
        html += `
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-blue-600 mb-3">Prevention Tips:</h3>
                <ul class="list-disc list-inside space-y-2">
                    ${result.prevention.map(tip => `<li class="text-gray-700">${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (result.fallback) {
        html += `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p class="text-yellow-800">
                    <strong>Note:</strong> Grok API was unavailable, so fallback debugging was used. 
                    For full functionality, configure your Grok API key.
                </p>
            </div>
        `;
    }
    
    return html || '<p class="text-gray-500">No specific issues found.</p>';
}

// Initialize Grok integration
function initializeGrokIntegration() {
    // Add Grok Debug button
    addGrokDebugButton();
    
    // Add status indicator
    addGrokStatusIndicator();
    
    // Add quick debug to code blocks
    addQuickDebugToCodeBlocks();
    
    // Periodically check for new code blocks
    setInterval(addQuickDebugToCodeBlocks, 2000);
    
    // Periodically update status
    setInterval(checkGrokStatus, 30000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGrokIntegration);
} else {
    initializeGrokIntegration();
}

// Export for use in other scripts
window.GrokDebugIntegration = {
    addGrokDebugButton,
    openGrokDebugWidget,
    debugCodeWithGrok,
    checkGrokStatus
};