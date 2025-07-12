/**
 * Mobile Components Library for Responsive Tools Dashboard
 * Handles touch gestures, swipe navigation, and mobile-specific UI patterns
 */

class MobileComponents {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50;
        this.tapThreshold = 10;
        this.longPressThreshold = 500;
        this.longPressTimer = null;
        this.isLongPress = false;
        
        this.init();
    }

    init() {
        this.setupTouchEvents();
        this.setupViewportHandling();
        this.setupOrientationHandling();
        this.setupKeyboardHandling();
        this.setupPullToRefresh();
    }

    // Touch Events Management
    setupTouchEvents() {
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        document.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.isLongPress = false;
        
        // Start long press timer
        this.longPressTimer = setTimeout(() => {
            this.isLongPress = true;
            this.handleLongPress(e);
        }, this.longPressThreshold);
    }

    handleTouchMove(e) {
        // Clear long press timer if finger moves
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }

        const deltaX = e.touches[0].clientX - this.touchStartX;
        const deltaY = e.touches[0].clientY - this.touchStartY;

        // Handle pull-to-refresh
        if (window.scrollY === 0 && deltaY > 0) {
            this.handlePullToRefresh(deltaY);
        }

        // Prevent default scroll behavior for horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.swipeThreshold) {
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }

        if (this.isLongPress) {
            return; // Don't process as tap/swipe
        }

        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;

        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        // Determine gesture type
        if (Math.abs(deltaX) < this.tapThreshold && Math.abs(deltaY) < this.tapThreshold) {
            this.handleTap(e);
        } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.swipeThreshold) {
            this.handleHorizontalSwipe(deltaX > 0 ? 'right' : 'left', e);
        } else if (Math.abs(deltaY) > this.swipeThreshold) {
            this.handleVerticalSwipe(deltaY > 0 ? 'down' : 'up', e);
        }
    }

    handleTouchCancel(e) {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    handleTap(e) {
        // Enhanced tap handling with haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        // Custom tap event
        const tapEvent = new CustomEvent('mobileTap', {
            detail: {
                x: this.touchEndX,
                y: this.touchEndY,
                target: e.target
            }
        });
        document.dispatchEvent(tapEvent);
    }

    handleLongPress(e) {
        // Haptic feedback for long press
        if (navigator.vibrate) {
            navigator.vibrate([50, 10, 50]);
        }

        // Custom long press event
        const longPressEvent = new CustomEvent('mobileLongPress', {
            detail: {
                x: this.touchStartX,
                y: this.touchStartY,
                target: e.target
            }
        });
        document.dispatchEvent(longPressEvent);
    }

    handleHorizontalSwipe(direction, e) {
        // Haptic feedback for swipe
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }

        // Custom swipe event
        const swipeEvent = new CustomEvent('mobileSwipe', {
            detail: {
                direction: direction,
                distance: Math.abs(this.touchEndX - this.touchStartX),
                target: e.target
            }
        });
        document.dispatchEvent(swipeEvent);
    }

    handleVerticalSwipe(direction, e) {
        // Custom vertical swipe event
        const swipeEvent = new CustomEvent('mobileVerticalSwipe', {
            detail: {
                direction: direction,
                distance: Math.abs(this.touchEndY - this.touchStartY),
                target: e.target
            }
        });
        document.dispatchEvent(swipeEvent);
    }

    // Viewport Handling
    setupViewportHandling() {
        // Handle viewport changes
        window.addEventListener('resize', this.handleViewportChange.bind(this));
        
        // Set initial viewport
        this.updateViewportClasses();
    }

    handleViewportChange() {
        this.updateViewportClasses();
        this.adjustLayoutForViewport();
    }

    updateViewportClasses() {
        const html = document.documentElement;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Remove existing viewport classes
        html.classList.remove('viewport-xs', 'viewport-sm', 'viewport-md', 'viewport-lg', 'viewport-xl');

        // Add appropriate viewport class
        if (width < 475) {
            html.classList.add('viewport-xs');
        } else if (width < 640) {
            html.classList.add('viewport-sm');
        } else if (width < 768) {
            html.classList.add('viewport-md');
        } else if (width < 1024) {
            html.classList.add('viewport-lg');
        } else {
            html.classList.add('viewport-xl');
        }

        // Add aspect ratio classes
        const aspectRatio = width / height;
        html.classList.remove('aspect-portrait', 'aspect-landscape', 'aspect-square');
        
        if (aspectRatio < 0.9) {
            html.classList.add('aspect-portrait');
        } else if (aspectRatio > 1.1) {
            html.classList.add('aspect-landscape');
        } else {
            html.classList.add('aspect-square');
        }
    }

    adjustLayoutForViewport() {
        const width = window.innerWidth;
        
        // Adjust grid columns based on viewport
        const grids = document.querySelectorAll('.dashboard-grid');
        grids.forEach(grid => {
            if (width < 475) {
                grid.style.gridTemplateColumns = '1fr';
            } else if (width < 640) {
                grid.style.gridTemplateColumns = '1fr';
            } else if (width < 1024) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else if (width < 1280) {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            } else {
                grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            }
        });
    }

    // Orientation Handling
    setupOrientationHandling() {
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        this.handleOrientationChange(); // Set initial orientation
    }

    handleOrientationChange() {
        setTimeout(() => {
            const orientation = window.orientation;
            const html = document.documentElement;
            
            html.classList.remove('orientation-portrait', 'orientation-landscape');
            
            if (Math.abs(orientation) === 90) {
                html.classList.add('orientation-landscape');
            } else {
                html.classList.add('orientation-portrait');
            }
            
            this.updateViewportClasses();
        }, 100);
    }

    // Keyboard Handling
    setupKeyboardHandling() {
        // Handle virtual keyboard appearance
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', this.handleKeyboardToggle.bind(this));
        }
    }

    handleKeyboardToggle() {
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - viewportHeight;
        
        const html = document.documentElement;
        
        if (keyboardHeight > 150) {
            html.classList.add('keyboard-visible');
            html.style.setProperty('--keyboard-height', keyboardHeight + 'px');
        } else {
            html.classList.remove('keyboard-visible');
            html.style.removeProperty('--keyboard-height');
        }
    }

    // Pull to Refresh
    setupPullToRefresh() {
        this.pullToRefreshElement = this.createPullToRefreshElement();
        document.body.appendChild(this.pullToRefreshElement);
    }

    createPullToRefreshElement() {
        const element = document.createElement('div');
        element.className = 'pull-to-refresh';
        element.innerHTML = `
            <div class="pull-to-refresh-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 21v-5h5"/>
                </svg>
            </div>
            <div class="pull-to-refresh-text">Pull to refresh</div>
        `;
        return element;
    }

    handlePullToRefresh(deltaY) {
        const threshold = 100;
        const progress = Math.min(deltaY / threshold, 1);
        
        this.pullToRefreshElement.style.transform = `translateY(${Math.min(deltaY, threshold)}px)`;
        this.pullToRefreshElement.style.opacity = progress;
        
        if (progress >= 1) {
            this.pullToRefreshElement.classList.add('active');
            this.pullToRefreshElement.querySelector('.pull-to-refresh-text').textContent = 'Release to refresh';
        } else {
            this.pullToRefreshElement.classList.remove('active');
            this.pullToRefreshElement.querySelector('.pull-to-refresh-text').textContent = 'Pull to refresh';
        }
    }

    triggerRefresh() {
        this.pullToRefreshElement.classList.add('refreshing');
        this.pullToRefreshElement.querySelector('.pull-to-refresh-text').textContent = 'Refreshing...';
        
        // Dispatch refresh event
        const refreshEvent = new CustomEvent('pullToRefresh');
        document.dispatchEvent(refreshEvent);
        
        // Hide after animation
        setTimeout(() => {
            this.pullToRefreshElement.style.transform = 'translateY(-100px)';
            this.pullToRefreshElement.style.opacity = '0';
            this.pullToRefreshElement.classList.remove('active', 'refreshing');
        }, 1000);
    }

    // Utility Methods
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    }

    // Safe Area Handling
    setupSafeArea() {
        const html = document.documentElement;
        
        // Check for safe area support
        if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
            html.classList.add('safe-area-supported');
        }
        
        // Add safe area CSS variables
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --safe-area-top: env(safe-area-inset-top, 0px);
                --safe-area-right: env(safe-area-inset-right, 0px);
                --safe-area-bottom: env(safe-area-inset-bottom, 0px);
                --safe-area-left: env(safe-area-inset-left, 0px);
            }
        `;
        document.head.appendChild(style);
    }

    // Performance Optimization
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Add focus management for mobile
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));
        
        // Add keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleFocusIn(e) {
        // Ensure focused element is visible
        const element = e.target;
        if (element && element.scrollIntoView) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }

    handleFocusOut(e) {
        // Handle focus out if needed
    }

    handleKeyDown(e) {
        // Handle keyboard navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }

    // Animation Utilities
    animateElement(element, animation, duration = 300) {
        return new Promise((resolve) => {
            element.style.animation = `${animation} ${duration}ms ease-in-out`;
            
            const handleAnimationEnd = () => {
                element.style.animation = '';
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            
            element.addEventListener('animationend', handleAnimationEnd);
        });
    }

    // Haptic Feedback
    hapticFeedback(pattern = 'light') {
        if (!navigator.vibrate) return;
        
        const patterns = {
            light: 10,
            medium: 20,
            heavy: 50,
            success: [10, 10, 10],
            error: [50, 10, 50, 10, 50],
            warning: [20, 10, 20]
        };
        
        navigator.vibrate(patterns[pattern] || patterns.light);
    }

    // Network Status
    setupNetworkHandling() {
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
        
        // Check initial status
        this.updateNetworkStatus();
    }

    handleOnline() {
        document.body.classList.remove('offline');
        document.body.classList.add('online');
        this.showNetworkStatus('Connected', 'success');
    }

    handleOffline() {
        document.body.classList.remove('online');
        document.body.classList.add('offline');
        this.showNetworkStatus('Disconnected', 'error');
    }

    updateNetworkStatus() {
        if (navigator.onLine) {
            this.handleOnline();
        } else {
            this.handleOffline();
        }
    }

    showNetworkStatus(message, type) {
        const notification = document.createElement('div');
        notification.className = `network-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Initialize all components
    initializeAll() {
        this.setupSafeArea();
        this.setupAccessibility();
        this.setupNetworkHandling();
    }
}

// CSS Styles for Mobile Components
const mobileStyles = `
    .pull-to-refresh {
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
        opacity: 0;
    }

    .pull-to-refresh.active {
        background: rgba(59, 130, 246, 0.9);
        color: white;
    }

    .pull-to-refresh.refreshing .pull-to-refresh-icon {
        animation: spin 1s linear infinite;
    }

    .pull-to-refresh-icon {
        margin-bottom: 0.5rem;
    }

    .pull-to-refresh-text {
        font-size: 0.875rem;
        font-weight: 500;
    }

    .network-notification {
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        padding: 0.75rem 1rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transition: transform 0.3s ease;
    }

    .network-notification.show {
        transform: translateX(-50%) translateY(0);
    }

    .network-notification.success {
        background-color: #10b981;
    }

    .network-notification.error {
        background-color: #ef4444;
    }

    /* Keyboard navigation styles */
    .keyboard-navigation *:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }

    /* Safe area styles */
    .safe-area-supported .header {
        padding-top: calc(1rem + var(--safe-area-top));
    }

    .safe-area-supported .mobile-nav {
        padding-bottom: calc(0.75rem + var(--safe-area-bottom));
    }

    /* Keyboard visible styles */
    .keyboard-visible .mobile-nav {
        display: none;
    }

    .keyboard-visible .main-content {
        padding-bottom: 2rem;
    }

    /* Orientation styles */
    .orientation-landscape .mobile-nav {
        padding: 0.5rem 0.75rem;
    }

    .orientation-landscape .mobile-nav-text {
        display: none;
    }

    /* Viewport specific styles */
    .viewport-xs .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .viewport-xs .tool-card {
        padding: 1rem;
    }

    .viewport-xs .metric-card {
        padding: 1rem;
    }

    .viewport-xs .metric-value {
        font-size: 1.5rem;
    }

    /* Animation keyframes */
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    /* Touch feedback */
    .touch-feedback {
        position: relative;
        overflow: hidden;
    }

    .touch-feedback::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
    }

    .touch-feedback:active::after {
        width: 200px;
        height: 200px;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileStyles;
document.head.appendChild(styleSheet);

// Export for use
window.MobileComponents = MobileComponents;