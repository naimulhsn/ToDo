# Logging Architecture Documentation

## 📊 Overview

This document describes the standardized logging architecture across all services in the todo application.

---

## 🏗️ Architecture Design

### **Principles**
1. **Standardized Format**: All logs follow the same JSON structure
2. **Appropriate Channels**: Each service logs through the most efficient path
3. **Critical Errors Only from Frontend**: Frontend only sends critical errors to backend
4. **Non-blocking**: Logging never blocks the main application flow
5. **ELK Stack Integration**: All backend logs go to Elasticsearch via Logstash

### **Flow Diagram**

```
┌─────────────────┐
│   Frontend      │
│  (Browser)      │
└────────┬────────┘
         │
         │ All logs → Console (Development)
         │ Critical errors only ↓
         │
         ↓
┌─────────────────┐       ┌──────────────┐       ┌──────────────┐
│   Todo API      │───────│   Logstash   │───────│Elasticsearch │
│   (Winston)     │  HTTP │   (HTTP)     │       │              │
└─────────────────┘       └──────────────┘       └──────┬───────┘
         ↑                        ↑                      │
         │                        │                      │
┌─────────────────┐               │                      │
│ Todo Auth API   │───────────────┘                      │
│   (Winston)     │                                      │
└─────────────────┘                                      ↓
                                                  ┌──────────────┐
                                                  │    Kibana    │
                                                  │ (Visualize)  │
                                                  └──────────────┘
```

---

## 📝 Standardized Log Format

All services use this JSON structure:

```json
{
  "@timestamp": "2025-10-16T12:00:00.000Z",
  "level": "info|warn|error",
  "message": "Human-readable log message",
  "service": "todo-auth-api|todo-api|todo-frontend",
  "environment": "development|production",
  "hostname": "container-name",
  "context": {
    "userId": "optional-user-id",
    "action": "optional-action-name",
    "method": "GET|POST|PUT|DELETE",
    "url": "/api/endpoint",
    "statusCode": 200,
    "duration": 123,
    "custom": "any-custom-fields"
  },
  "error": {
    "message": "Error description",
    "stack": "Stack trace",
    "name": "ErrorType"
  },
  "metadata": {
    "userAgent": "Browser user agent",
    "ip": "Client IP address",
    "referrer": "Previous URL"
  }
}
```

---

## 🎯 Service-Specific Logging

### **1. Frontend (Browser)**

**Location**: `todo-frontend/js/logger.js`

**Strategy**:
- All logs go to **browser console** for development debugging
- Only **critical errors** are sent to backend
- **Non-blocking** error sending using `fetch` with `keepalive`
- Automatic capture of uncaught errors and unhandled promise rejections

**Usage**:
```javascript
// Console only
Logger.info('User logged in', { userId: '123' });
Logger.warn('Token expiring soon');

// Console + Backend (for critical errors)
Logger.error('Failed to fetch todos', error);

// Convenience methods
Logger.logApiRequest('GET', '/api/todos');
Logger.logApiResponse('GET', '/api/todos', 200, data);
Logger.logUserAction('Create Todo', { title: 'Test' });
```

**Configuration**:
```javascript
Logger.config = {
  backendUrl: 'http://localhost:3000/api/logs',
  sendCriticalErrors: true,  // Only errors go to backend
  environment: 'development'
};
```

**Benefits**:
- ✅ Fast - no network overhead for info/warn logs
- ✅ Efficient - only critical errors sent to backend
- ✅ Developer-friendly - all logs visible in browser console
- ✅ Automatic error capture - catches global errors

---

### **2. Backend Services (Node.js)**

**Location**: 
- `todo-auth-api/logger.js`
- `todo-api/logger.js`

**Strategy**:
- All logs go through **Winston**
- Winston sends to **Logstash HTTP endpoint**
- Also logs to **file** (with rotation) for backup
- **Console output** in development mode

**Usage**:
```javascript
const logger = require('./logger');

// Standard logging
logger.info('User registered', { userId, email, fullName });
logger.warn('Invalid token attempt', { token, ip });
logger.error('Database connection failed', { error: error.message, stack: error.stack });

// Context-rich logging
logger.info({
  message: 'Todo created',
  userId: user.id,
  todoId: todo.id,
  title: todo.title
});
```

**Configuration** (Winston):
```javascript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'todo-auth-api',  // or 'todo-api'
    environment: process.env.NODE_ENV || 'development',
    hostname: require('os').hostname()
  },
  transports: [
    new DailyRotateFile({...}),  // File with rotation
    new LogstashHttpTransport({...})  // Logstash HTTP
  ]
});
```

**Benefits**:
- ✅ Centralized - all backend logs in one place (ELK)
- ✅ Structured - JSON format for easy querying
- ✅ Persistent - file backup with rotation
- ✅ Real-time - immediate visibility in Kibana

---

### **3. Frontend Error Endpoint**

**Location**: `todo-api/routes/logs.js`

**Purpose**: Receive only critical errors from frontend

**Endpoint**: `POST /api/logs`

**Request Format**:
```json
{
  "@timestamp": "2025-10-16T12:00:00.000Z",
  "level": "error",
  "message": "Failed to fetch todos",
  "service": "todo-frontend",
  "error": {
    "message": "Network error",
    "stack": "..."
  },
  "metadata": {
    "userAgent": "...",
    "url": "http://localhost:8080"
  }
}
```

**Processing**:
1. Validates log structure
2. Enriches with backend metadata (IP, timestamp)
3. Logs through Winston (which sends to Logstash)
4. Responds immediately (non-blocking)

**Benefits**:
- ✅ Single path - all logs go through Winston to Logstash
- ✅ Enriched - adds server-side context
- ✅ Simple - no direct Logstash connection from frontend
- ✅ Filtered - only critical errors tracked

---

## 🔍 Querying Logs in Kibana

### **Access Kibana**
URL: http://localhost:5601

### **Create Index Pattern**
1. Go to "Management" → "Index Patterns"
2. Create pattern: `logs-*`
3. Select `@timestamp` as time field

### **Common Queries**

**All logs from a service**:
```
service:"todo-auth-api"
service:"todo-api"
service:"todo-frontend"
```

**Logs by level**:
```
level:error
level:warn
level:info
```

**User-specific logs**:
```
context.userId:"68f081938ebde2e024a6287f"
```

**API errors**:
```
level:error AND context.method:* AND context.statusCode:>=400
```

**Frontend errors**:
```
service:"todo-frontend" AND level:error
```

**Service-specific indices**:
```
# Frontend logs
index:"todo-frontend-*"

# API logs  
index:"todo-api-*"

# Auth service logs
index:"todo-auth-api-*"

# All application logs
index:"todo-*"
```

**Authentication events**:
```
message:"User logged in" OR message:"User registered"
```

**Time range queries**:
- Use Kibana's time picker (top right)
- Select: Last 15 minutes, Last hour, Last 24 hours, etc.

---

## 📈 Log Levels

### **INFO** - Normal operations
- User authentication (login, logout, signup)
- API requests and responses
- Todo CRUD operations
- Service health checks

**Examples**:
```javascript
logger.info('User logged in', { userId, email });
logger.info('Todo created', { userId, todoId, title });
logger.info('API Request', { method: 'GET', url: '/api/todos' });
```

### **WARN** - Warning conditions
- Failed login attempts
- Invalid data submissions
- Token expiration warnings
- Deprecated API usage

**Examples**:
```javascript
logger.warn('Login failed: Invalid credentials', { email });
logger.warn('Token validation failed', { token });
logger.warn('Rate limit approaching', { userId, requests });
```

### **ERROR** - Error conditions
- Exceptions and crashes
- Database connection failures
- External API failures
- Uncaught errors

**Examples**:
```javascript
logger.error('Database connection failed', { 
  error: error.message, 
  stack: error.stack 
});
logger.error('Failed to create todo', { 
  userId, 
  error: error.message 
});
```

---

## 🛠️ Best Practices

### **DO**
✅ Use structured logging (objects, not strings)
✅ Include relevant context (userId, todoId, etc.)
✅ Log errors with stack traces
✅ Use appropriate log levels
✅ Add timestamps (automatic in our setup)
✅ Keep messages concise and descriptive

### **DON'T**
❌ Log sensitive data (passwords, tokens in full)
❌ Log in hot loops (high-frequency operations)
❌ Use console.log directly (use Logger utility)
❌ Send all frontend logs to backend (only errors)
❌ Block application flow with logging
❌ Log raw request/response bodies (can be huge)

### **Examples**

**Good**:
```javascript
logger.info('User authenticated', {
  userId: user._id,
  email: user.email,
  loginMethod: 'password'
});

logger.error('Todo creation failed', {
  userId: user._id,
  title: todo.title,
  error: error.message,
  stack: error.stack
});
```

**Bad**:
```javascript
logger.info('User ' + user.email + ' logged in at ' + new Date());

logger.error('Error: ' + error);  // No context or stack

logger.info('Creating todo', { 
  password: user.password  // NEVER log passwords!
});
```

---

## 🔐 Security Considerations

### **Sensitive Data**
Never log:
- Passwords (plain or hashed)
- Full JWT tokens (only first/last few chars for debugging)
- Credit card numbers
- Personal identification numbers
- Full session tokens

### **Acceptable to Log**
- User IDs (MongoDB ObjectIds)
- Email addresses (for audit trail)
- Usernames
- Action types
- Timestamps
- IP addresses (for security monitoring)
- Request methods and URLs (without query params with sensitive data)

### **Sanitization**
```javascript
// Good - sanitized token
logger.info('Token validated', {
  tokenPreview: token.substring(0, 10) + '...'
});

// Bad - full token
logger.info('Token validated', { token });  // ❌
```

---

## 📊 Monitoring & Alerts

### **Key Metrics to Monitor**

1. **Error Rate**
   - Query: `level:error`
   - Alert if > 10 errors/minute

2. **Authentication Failures**
   - Query: `message:"Login failed"`
   - Alert if > 5 failures from same IP in 5 minutes

3. **API Response Times**
   - Use `context.duration` field
   - Alert if average > 1000ms

4. **Frontend Errors**
   - Query: `service:"todo-frontend" AND level:error`
   - Alert if > 5 errors/minute

### **Setting Up Alerts in Kibana**

1. Go to "Alerting" → "Create Alert"
2. Define query (e.g., `level:error`)
3. Set threshold (e.g., count > 10 in 5 minutes)
4. Configure notification (email, Slack, webhook)

---

## 🧪 Testing Logs

### **Test Frontend Logging**
```javascript
// In browser console
Logger.info('Test info log');
Logger.warn('Test warning log');
Logger.error('Test error log', new Error('Test error'));
```

### **Test Backend Logging**
```javascript
// In any controller or service
logger.info('Test backend log', { test: true });
logger.error('Test error', { error: new Error('Test').message });
```

### **Verify in Kibana**
1. Open http://localhost:5601
2. Go to "Discover"
3. Search for your test messages
4. Verify all fields are present

---

## 🔄 Log Rotation

### **File Logs** (Backup)
- Daily rotation
- Compress old logs (gzip)
- Keep logs for 14 days
- Max file size: 20MB

**Configuration**:
```javascript
new DailyRotateFile({
  filename: 'logs/%DATE%-application.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
```

### **Elasticsearch Indices**
- Daily indices: `logs-YYYY.MM.DD`
- Managed by Elasticsearch Index Lifecycle Management (ILM)
- Consider setting retention policy (e.g., 30 days)

---

## 📚 Additional Resources

### **Winston Documentation**
- https://github.com/winstonjs/winston

### **Logstash Documentation**
- https://www.elastic.co/guide/en/logstash/current/index.html

### **Kibana Query Language (KQL)**
- https://www.elastic.co/guide/en/kibana/current/kuery-query.html

### **ELK Stack Best Practices**
- https://www.elastic.co/guide/en/elasticsearch/reference/current/best-practices.html

---

## 🎯 Summary

### **Key Improvements**
1. ✅ **Standardized format** across all services
2. ✅ **Efficient logging** - Frontend logs only to console (except errors)
3. ✅ **Single path** - All backend logs through Winston → Logstash
4. ✅ **Critical errors only** - Frontend only sends important errors
5. ✅ **Non-blocking** - Logging never slows down the app
6. ✅ **Structured data** - Easy to query and analyze
7. ✅ **Automatic enrichment** - Service, timestamp, hostname added automatically
8. ✅ **Separate indices** - Service-specific indices for better organization
9. ✅ **Enhanced analytics** - Structured action types for comprehensive dashboards
10. ✅ **Kibana integration** - Ready-to-use dashboard configurations

### **Benefits**
- 🚀 **Performance** - Minimal overhead
- 🔍 **Visibility** - All logs searchable in Kibana
- 🛡️ **Security** - Proper data sanitization
- 📊 **Analytics** - Structured data for metrics
- 🔧 **Debugging** - Rich context for troubleshooting
- 📈 **Scalability** - Handles high log volumes

---

## 📊 Kibana Dashboards

For comprehensive analytics and monitoring, see the detailed guide:
**[KIBANA_DASHBOARDS.md](./KIBANA_DASHBOARDS.md)**

This guide includes:
- Index pattern setup instructions
- Pre-configured dashboard layouts
- Sample KQL queries for analytics
- Visualization examples
- Monitoring and alerting setup
- Best practices for dashboard design

### Quick Start
1. Access Kibana at http://localhost:5601
2. Create index patterns: `todo-frontend-*`, `todo-api-*`, `todo-auth-api-*`
3. Follow the dashboard creation guide
4. Set up monitoring alerts for production use

---

**Last Updated**: October 20, 2025  
**Version**: 3.0.0

