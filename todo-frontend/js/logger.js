/**
 * Frontend Logger Utility
 * Provides color-coded console logging with timestamps and log levels
 * Sends only critical errors to backend for centralized logging
 */

const Logger = {
    // Log levels
    LEVELS: {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
    },

    // Colors for different log levels
    COLORS: {
        info: '#0066cc',    // Blue
        warn: '#ff9900',    // Orange
        error: '#cc0000'    // Red
    },

    // Configuration
    config: {
        backendUrl: 'http://localhost:3000/api/logs',
        sendCriticalErrors: true,  // Only send critical errors to backend
        environment: 'development'
    },

    /**
     * Format timestamp in ISO format
     */
    getTimestamp() {
        return new Date().toISOString();
    },

    /**
     * Format timestamp for display
     */
    getDisplayTimestamp() {
        const now = new Date();
        const date = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format
        const time = now.toLocaleTimeString('en-US', { hour12: false });
        return `${date} ${time}`;
    },

    /**
     * Create standardized log entry
     */
    createLogEntry(level, message, context = null, error = null) {
        const logEntry = {
            '@timestamp': this.getTimestamp(),
            level: level.toLowerCase(),
            message,
            service: 'todo-frontend',
            environment: this.config.environment,
            hostname: window.location.hostname
        };

        if (context) {
            logEntry.context = context;
        }

        if (error) {
            logEntry.error = {
                message: error.message || String(error),
                stack: error.stack || null,
                name: error.name || 'Error'
            };
        }

        // Add browser metadata
        logEntry.metadata = {
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer || null
        };

        return logEntry;
    },

    /**
     * Core logging function (console only)
     */
    log(level, message, data = null) {
        const timestamp = this.getDisplayTimestamp();
        const color = this.COLORS[level];
        
        // Console output with styling
        console.log(
            `%c[${timestamp}] [${level.toUpperCase()}]%c ${message}`,
            `color: ${color}; font-weight: bold;`,
            'color: inherit;'
        );

        // If there's additional data, log it separately
        if (data) {
            console.log('%cData:', 'color: #666; font-style: italic;', data);
        }
    },

    /**
     * Info level logging
     */
    info(message, data = null) {
        this.log(this.LEVELS.INFO, message, data);
    },

    /**
     * Warning level logging
     */
    warn(message, data = null) {
        this.log(this.LEVELS.WARN, message, data);
    },

    /**
     * Error level logging
     * Also sends critical errors to backend
     */
    error(message, data = null) {
        this.log(this.LEVELS.ERROR, message, data);
        
        // Send critical errors to backend for tracking
        if (this.config.sendCriticalErrors) {
            const error = data instanceof Error ? data : null;
            const context = data && !(data instanceof Error) ? data : null;
            this.sendCriticalError(message, context, error);
        }
    },

    /**
     * Log API request
     */
    logApiRequest(method, url, payload = null) {
        const data = { method, url };
        if (payload) {
            data.payload = payload;
        }
        this.info(`API Request: ${method} ${url}`, data);
    },

    /**
     * Log API response
     */
    logApiResponse(method, url, status, response = null) {
        const data = { method, url, status };
        if (response) {
            data.response = response;
        }
        
        if (status >= 200 && status < 300) {
            this.info(`API Response: ${method} ${url} - ${status}`, data);
        } else if (status >= 400) {
            this.error(`API Error: ${method} ${url} - ${status}`, data);
        } else {
            this.warn(`API Response: ${method} ${url} - ${status}`, data);
        }
    },

    /**
     * Log user action
     */
    logUserAction(action, details = null) {
        this.info(`User Action: ${action}`, details);
    },

    /**
     * Send only critical errors to backend
     */
    async sendCriticalError(message, context = null, error = null) {
        try {
            const logEntry = this.createLogEntry(this.LEVELS.ERROR, message, context, error);
            
            // Non-blocking send
            fetch(this.config.backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logEntry),
                // Use keepalive to ensure the request completes even if page unloads
                keepalive: true
            }).catch(err => {
                // Silently fail - don't log to prevent infinite loop
                console.debug('Failed to send error to backend:', err.message);
            });
        } catch (err) {
            // Silently fail
            console.debug('Error creating log entry:', err.message);
        }
    },

    /**
     * Backward compatibility - these methods just call the standard ones
     */
    logApiRequestWithBackend(method, url, payload = null) {
        this.logApiRequest(method, url, payload);
    },

    logApiResponseWithBackend(method, url, status, response = null) {
        this.logApiResponse(method, url, status, response);
    },

    logUserActionWithBackend(action, details = null) {
        this.logUserAction(action, details);
    }
};

// Make logger available globally
window.Logger = Logger;

// Capture global errors and send to backend
window.addEventListener('error', (event) => {
    Logger.error('Uncaught Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    Logger.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
    });
});
