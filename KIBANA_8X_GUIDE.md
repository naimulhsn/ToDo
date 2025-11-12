# Kibana 8.x Analytics Dashboard Guide

## 🎯 **Complete Setup Guide for Todo App Analytics**

This guide provides **tested, step-by-step instructions** for creating analytics dashboards in Kibana 8.x with your Todo application's ELK stack logging system.

---

## 📊 **Current Data Streams**

Your system has the following data streams:
- **`logs-todo_api-default`** - Backend API logs (including frontend errors)
- **`logs-todo_auth_api-default`** - Authentication service logs
- **`logs-unknown-default`** - Logs with parsing issues

---

## 🚀 **Step 1: Create Data View**

### 1.1 Access Kibana
1. Open browser: **http://localhost:5601**
2. Wait for Kibana to fully load

### 1.2 Create Data View
1. Click **Stack Management** (gear icon in left sidebar)
2. Click **Data Views**
3. Click **Create data view**
4. **Name**: `logs-*`
5. **Index pattern**: `logs-*`
6. **Time field**: Select `@timestamp`
7. Click **Save data view to Kibana**

### 1.3 Verify Fields
After creation, you should see these key fields:
- `@timestamp` - Time of log entry
- `service.name` - Service name (todo-api, todo-auth-api, todo-frontend)
- `log.level` - Log level (info, warn, error)
- `message` - Log message
- `action_type` - User action type
- `userId` - User identifier
- `environment` - Environment (production, development)

**Note**: If you see field type conflicts (warning icons), this is normal and won't affect functionality. The conflicts occur because some fields appear in multiple data streams with slightly different types.

---

## 📈 **Step 2: Test Logs Stream**

### 2.1 Access Logs Stream
1. Click **Observability** (compass icon in left sidebar)
2. Click **Logs**
3. Click **Stream**

### 2.2 Verify Real-time Logs
- You should see live logs from all services
- Filter by service: `service.name: "todo-api"`
- Filter by level: `log.level: "error"`

---

## 🎨 **Step 3: Create Analytics Dashboards**

### 3.1 Create Dashboard
1. Click **Analytics** (chart icon in left sidebar)
2. Click **Dashboard**
3. Click **Create dashboard**
4. Click **Add panel**
5. Select **Lens**

---

## 📊 **Dashboard 1: System Overview**

### Panel 1: Total Log Volume
1. **Data view**: `logs-*`
2. **Visualization**: Metric
3. **Configuration**:
   - **Metric**: Count
   - **Time range**: Last 24 hours
4. **Title**: "Total Logs (24h)"

### Panel 2: Logs by Service
1. **Data view**: `logs-*`
2. **Visualization**: Donut chart
3. **Configuration**:
   - **Breakdown**: `service.name`
   - **Metric**: Count
4. **Title**: "Logs by Service"

### Panel 3: Error Rate Over Time
1. **Data view**: `logs-*`
2. **Visualization**: Line chart
3. **Configuration**:
   - **X-axis**: `@timestamp` (Date histogram)
   - **Y-axis**: Count
   - **Filter**: `log.level: "error"`
4. **Title**: "Error Rate Over Time"

### Panel 4: Log Volume Timeline
1. **Data view**: `logs-*`
2. **Visualization**: Area chart
3. **Configuration**:
   - **X-axis**: `@timestamp` (Date histogram)
   - **Y-axis**: Count
   - **Breakdown**: `service.name`
4. **Title**: "Log Volume by Service"

---

## 👥 **Dashboard 2: User Analytics**

### Panel 1: User Registrations
1. **Data view**: `logs-*`
2. **Visualization**: Metric
3. **Configuration**:
   - **Metric**: Count
   - **Filter**: `action_type: "user_signup"`
4. **Title**: "Total User Registrations"

### Panel 2: User Logins
1. **Data view**: `logs-*`
2. **Visualization**: Line chart
3. **Configuration**:
   - **X-axis**: `@timestamp` (Date histogram)
   - **Y-axis**: Count
   - **Filter**: `action_type: "user_login"`
4. **Title**: "User Logins Over Time"

### Panel 3: Active Users
1. **Data view**: `logs-*`
2. **Visualization**: Metric
3. **Configuration**:
   - **Metric**: Unique count of `userId`
   - **Time range**: Last 24 hours
4. **Title**: "Active Users (24h)"

### Panel 4: Failed Logins
1. **Data view**: `logs-*`
2. **Visualization**: Data table
3. **Configuration**:
   - **Filter**: `log.level: "warn" AND message: *failed*`
   - **Columns**: `@timestamp`, `message`, `userId`
4. **Title**: "Failed Login Attempts"

---

## ✅ **Dashboard 3: Todo Analytics**

### Panel 1: Tasks Created
1. **Data view**: `logs-*`
2. **Visualization**: Line chart
3. **Configuration**:
   - **X-axis**: `@timestamp` (Date histogram)
   - **Y-axis**: Count
   - **Filter**: `action_type: "todo_created"`
4. **Title**: "Tasks Created Over Time"

### Panel 2: Tasks Completed
1. **Data view**: `logs-*`
2. **Visualization**: Line chart
3. **Configuration**:
   - **X-axis**: `@timestamp` (Date histogram)
   - **Y-axis**: Count
   - **Filter**: `action_type: "todo_updated" AND completion_changed: true AND is_completed: true`
4. **Title**: "Tasks Completed Over Time"

### Panel 3: Top Users by Tasks
1. **Data view**: `logs-*`
2. **Visualization**: Data table
3. **Configuration**:
   - **Filter**: `action_type: "todo_created"`
   - **Group by**: `userId`
   - **Metric**: Count
   - **Sort**: Descending
4. **Title**: "Top Users by Task Creation"

### Panel 4: Task Operations
1. **Data view**: `logs-*`
2. **Visualization**: Bar chart
3. **Configuration**:
   - **X-axis**: `action_type`
   - **Y-axis**: Count
   - **Filter**: `action_type: *todo*`
4. **Title**: "Task Operations Breakdown"

---

## 🚨 **Dashboard 4: Error Monitoring**

### Panel 1: Errors by Service
1. **Data view**: `logs-*`
2. **Visualization**: Bar chart
3. **Configuration**:
   - **X-axis**: `service.name`
   - **Y-axis**: Count
   - **Filter**: `log.level: "error"`
4. **Title**: "Errors by Service"

### Panel 2: Recent Errors
1. **Data view**: `logs-*`
2. **Visualization**: Data table
3. **Configuration**:
   - **Filter**: `log.level: "error"`
   - **Columns**: `@timestamp`, `service.name`, `message`, `userId`
   - **Sort**: `@timestamp` (Descending)
4. **Title**: "Recent Errors"

### Panel 3: Error Trend
1. **Data view**: `logs-*`
2. **Visualization**: Line chart
3. **Configuration**:
   - **X-axis**: `@timestamp` (Date histogram)
   - **Y-axis**: Count
   - **Filter**: `log.level: "error"`
4. **Title**: "Error Trend Over Time"

### Panel 4: Error Rate by Service
1. **Data view**: `logs-*`
2. **Visualization**: Donut chart
3. **Configuration**:
   - **Breakdown**: `service.name`
   - **Metric**: Count
   - **Filter**: `log.level: "error"`
4. **Title**: "Error Distribution by Service"

---

## 🔍 **Useful KQL Queries**

### Service-specific Queries
```kql
# All logs from todo-api
service.name: "todo-api"

# All logs from auth service
service.name: "todo-auth-api"

# Frontend errors (processed by Log API)
service.name: "todo-frontend"
```

### Action-based Queries
```kql
# User registrations
action_type: "user_signup"

# User logins
action_type: "user_login"

# Todo operations
action_type: "todo_created" OR action_type: "todo_updated" OR action_type: "todo_deleted"

# Task completions
action_type: "todo_updated" AND completion_changed: true AND is_completed: true
```

### Error Queries
```kql
# All errors
log.level: "error"

# Warnings
log.level: "warn"

# Failed operations
log.level: "warn" AND message: *failed*

# API errors
service.name: "todo-api" AND log.level: "error"
```

### User-specific Queries
```kql
# Logs for specific user
userId: "68f0891b2cafb8f7ae001182"

# Active users (last 24h)
@timestamp >= now-24h AND userId: *

# User activity
userId: * AND action_type: *
```

### Time-based Queries
```kql
# Last hour
@timestamp >= now-1h

# Last 24 hours
@timestamp >= now-24h

# Last 7 days
@timestamp >= now-7d

# Specific time range
@timestamp >= "2025-10-20T00:00:00" AND @timestamp <= "2025-10-20T23:59:59"
```

---

## 🛠️ **Troubleshooting**

### Issue: No logs in Logs Stream
**Solution**: 
1. Check if data streams exist: `http://localhost:9200/_data_stream`
2. Verify Logstash is running: `docker logs todo-logstash`
3. Generate test logs: Hit API endpoints

### Issue: Data View not created
**Solution**:
1. Ensure data streams exist first
2. Use exact pattern: `logs-*`
3. Select `@timestamp` as time field

### Issue: No data in visualizations
**Solution**:
1. Check time range (set to "Last 24 hours")
2. Verify filters are correct
3. Ensure data exists for the time range

### Issue: Fields not available
**Solution**:
1. Refresh field list in Data View
2. Check if logs are being parsed correctly
3. Verify Logstash configuration

---

## 📝 **Best Practices**

### 1. Time Ranges
- Use "Last 24 hours" for real-time monitoring
- Use "Last 7 days" for trend analysis
- Use "Last 30 days" for historical analysis

### 2. Filters
- Always filter by time range first
- Use specific service filters for focused analysis
- Combine multiple filters for detailed insights

### 3. Visualizations
- Use Line charts for trends over time
- Use Bar charts for comparisons
- Use Donut charts for distributions
- Use Data tables for detailed views

### 4. Dashboard Organization
- Group related panels together
- Use descriptive titles
- Add filters at dashboard level
- Set appropriate refresh intervals

---

## 🎯 **Success Criteria**

✅ **Data View created**: `logs-*` with `@timestamp`  
✅ **Logs Stream working**: Real-time logs visible  
✅ **4 Dashboards created**: System, User, Todo, Error monitoring  
✅ **All visualizations working**: Data appears correctly  
✅ **Filters functional**: Can filter by service, level, action  
✅ **Real-time updates**: Dashboards refresh with new data  

---

## 🚀 **Next Steps**

1. **Customize dashboards** for your specific needs
2. **Add alerts** for critical errors
3. **Create saved searches** for common queries
4. **Set up automated reports** for stakeholders
5. **Monitor performance** and optimize queries

---

**Your Todo application now has a complete, production-ready analytics system!** 🎉
