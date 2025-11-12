# Kibana Setup Guide - Working with logs-* Index Pattern

## 🎯 Current Status
✅ **Logstash Configuration**: Updated to use `logs-{service}-date` pattern  
✅ **Services Running**: All Docker services are healthy  
✅ **Log Flow**: Logs are being processed and sent to Elasticsearch  
✅ **Index Created**: `.ds-logs-todo-api-2025.01.20-2025.10.20-000001`  

## 📊 Index Pattern Naming
The new configuration creates indices with this pattern:
- `logs-todo-frontend-2025.10.20`
- `logs-todo-api-2025.10.20`  
- `logs-todo-auth-api-2025.10.20`

This allows:
- **Unified view**: Pattern `logs-*` captures all services
- **Service-specific**: Pattern `logs-todo-api-*` for specific service
- **Logs Stream compatibility**: Works with Kibana Logs app

## 🔧 Step-by-Step Kibana Setup

### Step 1: Access Kibana
1. Open browser: http://localhost:5601
2. Wait for Kibana to fully load (may take 1-2 minutes)

### Step 2: Create Index Pattern
1. Go to **Stack Management** → **Index Patterns**
2. Click **Create index pattern**
3. Enter: `logs-*`
4. Click **Next step**
5. Select `@timestamp` as time field
6. Click **Create index pattern**

### Step 3: Verify Index Pattern
You should see:
- **Index pattern name**: `logs-*`
- **Time field**: `@timestamp`
- **Available fields**: service, action_type, level, userId, message, etc.

### Step 4: Test Logs Stream
1. Go to **Observability** → **Logs** → **Stream**
2. Select index pattern: `logs-*`
3. You should see logs flowing in real-time

### Step 5: Test Discover
1. Go to **Analytics** → **Discover**
2. Select index pattern: `logs-*`
3. Set time range to "Last 15 minutes"
4. You should see log entries with all fields

## 🧪 Generate Test Logs

### Method 1: Use the Application
1. Open http://localhost:8080 (Frontend)
2. Create a new user account
3. Login with the account
4. Create some todos
5. Complete some todos
6. Delete some todos

### Method 2: API Calls
```bash
# Test auth service
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'

# Test todo API
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Method 3: Health Check Endpoints
```bash
# Generate logs from all services
curl http://localhost:3000/
curl http://localhost:3001/
curl http://localhost:8080/
```

## 📈 Create Analytics Dashboards

### Dashboard 1: Executive Summary
1. Go to **Analytics** → **Dashboard** → **Create dashboard**
2. Click **Add panel** → **Lens**
3. Select index pattern: `logs-*`
4. Create visualizations:
   - **Metric**: Count of all logs
   - **Line Chart**: Logs over time
   - **Pie Chart**: Logs by service
   - **Data Table**: Recent logs

### Dashboard 2: User Analytics
Using `logs-*` pattern with filters:
- **User Registrations**: Filter `action_type:"user_signup"`
- **User Logins**: Filter `action_type:"user_login"`
- **Active Users**: Unique count of `userId`
- **Failed Logins**: Filter `level:"warn" AND message contains "failed"`

### Dashboard 3: Todo Analytics
Using `logs-*` pattern with filters:
- **Tasks Created**: Filter `action_type:"todo_created"`
- **Tasks Completed**: Filter `completion_changed:true`
- **Top Users**: Data table grouped by `userId`
- **Task Operations**: Pie chart by `action_type`

### Dashboard 4: System Health
Using `logs-*` pattern:
- **Error Rate**: Filter `level:"error"`
- **Logs by Service**: Pie chart by `service`
- **Log Volume**: Line chart over time
- **Recent Errors**: Data table with error details

## 🔍 Key Fields for Analytics

### Available Fields:
- `@timestamp` - Time of log entry
- `service` - Service name (todo-frontend, todo-api, todo-auth-api)
- `level` - Log level (info, warn, error)
- `message` - Log message
- `action_type` - User action (user_signup, user_login, todo_created, etc.)
- `userId` - User identifier
- `environment` - Environment (production)
- `hostname` - Container hostname

### Sample KQL Queries:
```kql
# All user actions
action_type:"user_login" OR action_type:"user_signup"

# All todo actions  
action_type:"todo_created" OR action_type:"todo_updated" OR action_type:"todo_deleted"

# Errors only
level:"error"

# Specific service
service:"todo-api"

# Recent activity
@timestamp:[now-1h TO now]
```

## 🚨 Troubleshooting

### If Logs Don't Appear:
1. Check service health: `docker-compose ps`
2. Check Logstash logs: `docker-compose logs logstash`
3. Check Elasticsearch indices: `curl http://localhost:9200/_cat/indices`
4. Verify index pattern in Kibana

### If Index Pattern Not Found:
1. Wait for more logs to be generated
2. Check Elasticsearch indices: `curl http://localhost:9200/_cat/indices`
3. Manually create index pattern with exact index name

### If Fields Missing:
1. Generate more diverse logs (different actions)
2. Check Logstash configuration
3. Verify service names in logger configurations

## ✅ Success Criteria
- [ ] Index pattern `logs-*` created in Kibana
- [ ] Logs visible in Logs Stream
- [ ] Logs visible in Discover
- [ ] All key fields present (service, action_type, userId, etc.)
- [ ] Can filter by service and action type
- [ ] At least one dashboard created and working

## 🎯 Next Steps
1. Create the index pattern in Kibana
2. Generate test logs using the application
3. Verify logs appear in Logs Stream and Discover
4. Create your first dashboard using Lens
5. Experiment with different visualizations and filters

---

**Current Index**: `.ds-logs-todo-api-2025.01.20-2025.10.20-000001`  
**Expected Pattern**: `logs-*`  
**Time Field**: `@timestamp`  
**Status**: Ready for Kibana setup
