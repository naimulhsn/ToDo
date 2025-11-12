# Kibana Dashboards & Analytics Guide

## 📊 Overview

This guide provides comprehensive instructions for setting up Kibana dashboards and analytics for the Todo Application's ELK Stack logging system. The application uses the industry-standard `logs-{service}-date` index naming pattern for optimal organization and analytics.

---

## 🏗️ Index Patterns Setup

### 1. Access Kibana
- URL: http://localhost:5601
- Wait for all services to be healthy before accessing

### 2. Create Index Patterns

#### Primary Pattern (Recommended)
Create this main index pattern in Kibana:

1. **logs-*** (Primary Pattern)
   - Time field: `@timestamp`
   - Description: All application logs for unified analytics
   - **This is the main pattern you'll use for most dashboards**

#### Service-Specific Patterns (Optional)
For focused analytics, you can also create:

1. **logs-todo-frontend-*** 
   - Time field: `@timestamp`
   - Description: Frontend logs and errors only

2. **logs-todo-api-***
   - Time field: `@timestamp` 
   - Description: Backend API logs and operations only

3. **logs-todo-auth-api-***
   - Time field: `@timestamp`
   - Description: Authentication service logs only

#### Steps to Create Index Pattern:
1. Go to **Stack Management** → **Index Patterns**
2. Click **Create index pattern**
3. Enter pattern name: `logs-*`
4. Click **Next step**
5. Select `@timestamp` as time field
6. Click **Create index pattern**

**Note**: If you don't see the pattern, wait for more logs to be generated or check that your services are running and generating logs.

---

## 📈 Dashboard Configurations

### 1. User Analytics Dashboard

#### **Total Users Registered**
- **Visualization Type**: Metric (using Lens)
- **Index Pattern**: `logs-*`
- **Query**: `action_type:"user_signup"`
- **Aggregation**: Count
- **Description**: Shows total number of registered users

#### **Daily Login Count**
- **Visualization Type**: Line Chart
- **Index Pattern**: `todo-auth-api-*`
- **Query**: `action_type:"user_login"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Count
- **Interval**: 1 day
- **Description**: Shows login trends over time

#### **Active Users (Daily)**
- **Visualization Type**: Line Chart
- **Index Pattern**: `todo-auth-api-*`
- **Query**: `action_type:"user_login"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Unique Count (`userId`)
- **Interval**: 1 day
- **Description**: Shows unique users logging in per day

#### **Failed Login Attempts**
- **Visualization Type**: Line Chart
- **Index Pattern**: `todo-auth-api-*`
- **Query**: `level:"warn" AND message:"Login failed"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Count
- **Interval**: 1 hour
- **Description**: Monitors security threats

### 2. Todo Analytics Dashboard

#### **Total Tasks Created**
- **Visualization Type**: Metric (using Lens)
- **Index Pattern**: `logs-*`
- **Query**: `action_type:"todo_created"`
- **Aggregation**: Count
- **Description**: Shows total number of tasks created

#### **Daily Task Creation Trend**
- **Visualization Type**: Line Chart
- **Index Pattern**: `todo-api-*`
- **Query**: `action_type:"todo_created"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Count
- **Interval**: 1 day
- **Description**: Shows task creation trends

#### **Daily Task Completion Trend**
- **Visualization Type**: Line Chart
- **Index Pattern**: `todo-api-*`
- **Query**: `action_type:"todo_updated" AND completion_changed:true AND is_completed:true`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Count
- **Interval**: 1 day
- **Description**: Shows task completion trends

#### **Tasks by Status**
- **Visualization Type**: Pie Chart
- **Index Pattern**: `todo-api-*`
- **Query**: `action_type:"todo_created"`
- **Buckets**: Terms (`todo_status`)
- **Description**: Shows distribution of pending vs completed tasks

#### **Top Users by Task Count**
- **Visualization Type**: Data Table
- **Index Pattern**: `todo-api-*`
- **Query**: `action_type:"todo_created"`
- **Buckets**: Terms (`userId`)
- **Metric**: Count
- **Size**: 10
- **Description**: Shows most active users

#### **Completion Rate**
- **Visualization Type**: Metric
- **Index Pattern**: `todo-api-*`
- **Query**: `action_type:"todo_updated" AND completion_changed:true`
- **Aggregation**: Average (`is_completed`)
- **Description**: Shows overall completion rate

### 3. System Health Dashboard

#### **Error Rate by Service**
- **Visualization Type**: Line Chart (using Lens)
- **Index Pattern**: `logs-*`
- **Query**: `level:"error"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Count
- **Split Series**: Terms (`service`)
- **Interval**: 1 hour
- **Description**: Monitors errors across all services

#### **API Request Volume**
- **Visualization Type**: Area Chart
- **Index Pattern**: `todo-api-*`
- **Query**: `action_type:"todos_fetched"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Count
- **Interval**: 1 hour
- **Description**: Shows API usage patterns

#### **Service Availability**
- **Visualization Type**: Metric
- **Index Pattern**: `todo-*`
- **Query**: `level:"info"`
- **Aggregation**: Count
- **Time Range**: Last 24 hours
- **Description**: Shows overall system activity

### 4. Combined Analytics Dashboard

#### **User Activity Heatmap**
- **Visualization Type**: Heatmap
- **Index Pattern**: `todo-*`
- **Query**: `action_type:"user_login"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Terms (`userId`)
- **Description**: Shows user activity patterns

#### **Most Active Users**
- **Visualization Type**: Data Table
- **Index Pattern**: `todo-*`
- **Query**: `action_type:"todo_created" OR action_type:"todo_updated"`
- **Buckets**: Terms (`userId`)
- **Metric**: Count
- **Size**: 20
- **Description**: Shows most engaged users

#### **Average Tasks per User**
- **Visualization Type**: Metric
- **Index Pattern**: `todo-api-*`
- **Query**: `action_type:"todo_created"`
- **Aggregation**: Average (`userId`)
- **Description**: Shows user engagement level

#### **Peak Usage Times**
- **Visualization Type**: Bar Chart
- **Index Pattern**: `todo-*`
- **Query**: `action_type:"user_login"`
- **X-Axis**: Date Histogram (`@timestamp`)
- **Y-Axis**: Count
- **Interval**: 1 hour
- **Description**: Shows peak usage hours

---

## 🔍 Sample KQL Queries

### User Analytics Queries

```kql
# All user logins
action_type:"user_login"

# User registrations
action_type:"user_signup"

# Failed login attempts
level:"warn" AND message:"Login failed"

# Active users in last 24 hours
action_type:"user_login" AND @timestamp:[now-24h TO now]

# User logout events
action_type:"user_logout"
```

### Todo Analytics Queries

```kql
# All task creations
action_type:"todo_created"

# Task completions
action_type:"todo_updated" AND completion_changed:true AND is_completed:true

# Task deletions
action_type:"todo_deleted"

# Tasks by specific user
action_type:"todo_created" AND userId:"USER_ID_HERE"

# Pending tasks
action_type:"todo_created" AND todo_status:"pending"

# Task updates
action_type:"todo_updated"
```

### System Health Queries

```kql
# All errors
level:"error"

# Errors by service
level:"error" AND service:"todo-api"

# API requests
action_type:"todos_fetched"

# Authentication events
action_type:"token_validated"

# Frontend errors
service:"todo-frontend" AND level:"error"
```

### Cross-Service Queries

```kql
# All user actions
action_type:"user_login" OR action_type:"user_signup" OR action_type:"user_logout"

# All todo actions
action_type:"todo_created" OR action_type:"todo_updated" OR action_type:"todo_deleted"

# High activity users
action_type:"todo_created" AND userId:*

# Recent activity (last hour)
@timestamp:[now-1h TO now]

# Service-specific queries
service:"todo-api" AND action_type:"todo_created"
service:"todo-auth-api" AND action_type:"user_login"
service:"todo-frontend" AND level:"error"
```

---

## 📊 Visualization Examples

### 1. Line Chart: Daily Logins
```json
{
  "type": "line",
  "params": {
    "grid": {"categoryLines": false, "style": {"color": "#eee"}},
    "categoryAxes": [{"id": "CategoryAxis-1", "type": "category", "position": "bottom", "show": true}],
    "valueAxes": [{"id": "ValueAxis-1", "name": "LeftAxis-1", "type": "value", "position": "left", "show": true}],
    "seriesParams": [{"data": {"id": "1"}, "type": "line", "mode": "normal"}]
  },
  "aggs": [
    {"id": "1", "type": "count", "schema": "metric", "params": {}},
    {"id": "2", "type": "date_histogram", "schema": "segment", "params": {"field": "@timestamp", "interval": "1d"}}
  ]
}
```

### 2. Pie Chart: Tasks by Status
```json
{
  "type": "pie",
  "params": {
    "addTooltip": true,
    "addLegend": true,
    "legendPosition": "right",
    "isDonut": true
  },
  "aggs": [
    {"id": "1", "type": "count", "schema": "metric", "params": {}},
    {"id": "2", "type": "terms", "schema": "segment", "params": {"field": "todo_status", "size": 5}}
  ]
}
```

### 3. Data Table: Top Users
```json
{
  "type": "table",
  "params": {
    "perPage": 10,
    "showPartialRows": false,
    "showMeticsAtAllLevels": false
  },
  "aggs": [
    {"id": "1", "type": "count", "schema": "metric", "params": {}},
    {"id": "2", "type": "terms", "schema": "bucket", "params": {"field": "userId", "size": 10, "order": "desc", "orderBy": "1"}}
  ]
}
```

---

## 🎯 Dashboard Creation Steps (Kibana 8.x)

### Step 1: Create Dashboard
1. Go to **Analytics** → **Dashboard**
2. Click **Create dashboard**
3. Click **Add panel**
4. Select **Lens** (the new visualization tool)

### Step 2: Configure Visualization in Lens
1. Select index pattern: `logs-*`
2. Choose visualization type (line, bar, pie, metric, etc.)
3. Drag fields to appropriate areas:
   - **X-axis**: `@timestamp` for time-based charts
   - **Y-axis**: Count or other metrics
   - **Breakdown**: `service`, `action_type`, `level` for grouping
4. Add filters using the filter bar
5. Save panel with descriptive name

### Step 3: Add More Panels
1. Click **Add panel** again
2. Repeat Step 2 for additional visualizations
3. Arrange panels by dragging
4. Resize panels as needed

### Step 4: Configure Dashboard Settings
- **Time Range**: Set default time range (e.g., Last 7 days)
- **Auto Refresh**: Enable for real-time monitoring
- **Filters**: Add global filters for better focus
- **Save**: Give dashboard a descriptive name

---

## 📋 Recommended Dashboard Layouts

### Layout 1: Executive Summary
```
┌─────────────────┬─────────────────┐
│   Total Users   │  Total Tasks    │
├─────────────────┼─────────────────┤
│  Daily Logins   │ Task Creation   │
│   (Line Chart)  │  (Line Chart)   │
├─────────────────┴─────────────────┤
│        System Health              │
│      (Error Rate Chart)           │
└───────────────────────────────────┘
```

### Layout 2: User Analytics
```
┌─────────────────┬─────────────────┐
│  Active Users   │ Failed Logins   │
│  (Line Chart)   │  (Line Chart)   │
├─────────────────┼─────────────────┤
│   Top Users     │ User Activity   │
│ (Data Table)    │   (Heatmap)     │
└─────────────────┴─────────────────┘
```

### Layout 3: Todo Analytics
```
┌─────────────────┬─────────────────┐
│ Tasks Created   │ Tasks Completed │
│  (Line Chart)   │  (Line Chart)   │
├─────────────────┼─────────────────┤
│ Tasks by Status │  Top Users      │
│  (Pie Chart)    │ (Data Table)    │
└─────────────────┴─────────────────┘
```

---

## 🔧 Advanced Analytics

### Custom Aggregations

#### User Engagement Score
```json
{
  "aggs": {
    "user_engagement": {
      "scripted_metric": {
        "init_script": "state.tasks = 0; state.logins = 0",
        "map_script": "if (doc['action_type'].value == 'todo_created') state.tasks++; if (doc['action_type'].value == 'user_login') state.logins++",
        "combine_script": "return [state.tasks, state.logins]",
        "reduce_script": "return states"
      }
    }
  }
}
```

#### Task Completion Velocity
```json
{
  "aggs": {
    "completion_velocity": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "1d"
      },
      "aggs": {
        "completions": {
          "filter": {
            "term": {"action_type": "todo_updated"}
          }
        }
      }
    }
  }
}
```

---

## 📱 Monitoring & Alerts

### Key Metrics to Monitor

1. **Error Rate**: > 10 errors/minute
2. **Login Failures**: > 5 failures from same IP in 5 minutes
3. **API Response Time**: Average > 1000ms
4. **Frontend Errors**: > 5 errors/minute
5. **User Registration**: Unusual spikes or drops

### Setting Up Alerts

1. Go to **Stack Management** → **Watcher**
2. Create new watch
3. Define trigger condition
4. Set up notification (email, Slack, webhook)
5. Test and activate

### Sample Alert Configuration
```json
{
  "trigger": {
    "schedule": {"interval": "5m"}
  },
  "input": {
    "search": {
      "request": {
        "search_type": "query_then_fetch",
        "indices": ["todo-*"],
        "body": {
          "query": {
            "bool": {
              "must": [
                {"term": {"level": "error"}},
                {"range": {"@timestamp": {"gte": "now-5m"}}}
              ]
            }
          }
        }
      }
    }
  },
  "condition": {
    "compare": {"ctx.payload.hits.total": {"gt": 10}}
  },
  "actions": {
    "send_email": {
      "email": {
        "to": ["admin@example.com"],
        "subject": "High Error Rate Alert",
        "body": "Error count: {{ctx.payload.hits.total}}"
      }
    }
  }
}
```

---

## 🎨 Dashboard Best Practices

### Design Principles
1. **Clarity**: Use clear titles and descriptions
2. **Consistency**: Maintain consistent color schemes
3. **Hierarchy**: Place most important metrics at top
4. **Context**: Include time ranges and filters
5. **Actionability**: Focus on metrics that drive decisions

### Performance Optimization
1. **Index Patterns**: Use specific patterns when possible
2. **Time Ranges**: Limit to necessary time periods
3. **Aggregations**: Use appropriate aggregation levels
4. **Refresh Rates**: Balance real-time needs with performance
5. **Caching**: Enable query caching for repeated queries

### Maintenance
1. **Regular Review**: Update dashboards monthly
2. **User Feedback**: Gather feedback from dashboard users
3. **Performance Monitoring**: Monitor dashboard load times
4. **Data Quality**: Verify data accuracy regularly
5. **Documentation**: Keep dashboard documentation updated

---

## 🚀 Getting Started Checklist

- [ ] All services running and healthy
- [ ] Elasticsearch indices created
- [ ] Index patterns configured in Kibana
- [ ] Sample data flowing to indices
- [ ] Basic visualizations created
- [ ] Dashboards assembled
- [ ] Alerts configured
- [ ] Team trained on dashboard usage
- [ ] Documentation shared with stakeholders

---

## 📚 Additional Resources

- [Kibana Documentation](https://www.elastic.co/guide/en/kibana/current/index.html)
- [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
- [Kibana Query Language (KQL)](https://www.elastic.co/guide/en/kibana/current/kuery-query.html)
- [Elasticsearch Aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)

---

## 🚀 Quick Start Guide

### Immediate Steps:
1. **Access Kibana**: http://localhost:5601
2. **Create Index Pattern**: `logs-*` with `@timestamp` field
3. **Test Logs Stream**: Go to **Observability** → **Logs** → **Stream**
4. **Generate Test Logs**: Use the application at http://localhost:8080
5. **Create First Dashboard**: Use **Analytics** → **Dashboard** → **Create dashboard**

### Current Status:
✅ **Services Running**: All Docker containers healthy  
✅ **Log Flow**: Logs being processed by Logstash  
✅ **Indices Created**: 
- `logs-todo-api-*`
- `logs-todo-auth-api-*`  
- `logs-unknown-*`

### Ready for Analytics:
- **Index Pattern**: `logs-*` (unified view)
- **Key Fields**: service, action_type, level, userId, message
- **Time Field**: @timestamp
- **Sample Data**: Available for testing

---

**Last Updated**: October 20, 2025  
**Version**: 2.0.0 (Updated for Kibana 8.x and logs-* pattern)
