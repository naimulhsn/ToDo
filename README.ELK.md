# ELK Stack Integration Guide

This document explains how to use the ELK (Elasticsearch, Logstash, Kibana) stack for centralized logging in the Todo application.

## Architecture Overview

```
Frontend (Browser) → Backend API → Logstash → Elasticsearch → Kibana
     ↓                    ↓
  Console Logs      Winston Logs
```

### Components

- **Elasticsearch**: Stores and indexes log data
- **Logstash**: Processes and forwards logs from multiple sources
- **Kibana**: Web interface for visualizing and analyzing logs
- **Backend**: Winston logger sends logs directly to Logstash via TCP
- **Frontend**: Sends logs to backend API which forwards to Logstash

## Quick Start

1. **Start the complete stack**:
   ```bash
   docker-compose up --build
   ```

2. **Wait for services to be healthy** (~60-90 seconds):
   ```bash
   docker-compose ps
   ```

3. **Access the applications**:
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:3000
   - **Kibana**: http://localhost:5601
   - **Elasticsearch**: http://localhost:9200

## Kibana Setup

### 1. Create Index Pattern

1. Open Kibana: http://localhost:5601
2. Go to **Stack Management** → **Index Patterns**
3. Click **Create index pattern**
4. Enter pattern: `logs-*`
5. Select **@timestamp** as the time field
6. Click **Create index pattern**

### 2. View Logs

1. Go to **Discover** in the left sidebar
2. Select the `logs-*` index pattern
3. You should see logs from both frontend and backend

## Log Sources

### Backend Logs
- **Service**: `todo-backend`
- **Transport**: Winston → Logstash (TCP port 5000)
- **Log Types**: 
  - Application logs
  - Request/response logs
  - Error logs
  - System logs

### Frontend Logs
- **Service**: `todo-frontend`
- **Transport**: Browser → Backend API → Logstash (HTTP port 5044)
- **Log Types**:
  - User actions
  - API requests/responses
  - Error logs
  - Application events

## Log Fields

### Common Fields
- `@timestamp`: Log timestamp
- `level`: Log level (info, warn, error)
- `message`: Log message
- `service`: Service name (todo-backend, todo-frontend)
- `log_source`: Source type (backend, frontend)
- `hostname`: Container hostname
- `environment`: Environment (development, production)

### Backend-Specific Fields
- `timestamp`: Original timestamp from Winston
- `method`: HTTP method
- `url`: Request URL
- `ip`: Client IP address

### Frontend-Specific Fields
- `data`: Additional log data
- `userAgent`: Browser user agent
- `action`: User action type

## Sample Kibana Queries

### View All Logs
```
*
```

### Filter by Service
```
service: "todo-backend"
```

### Filter by Log Level
```
level: "error"
```

### Filter by Time Range
```
@timestamp: [now-1h TO now]
```

### Search for Specific Messages
```
message: "API Request"
```

### Combine Filters
```
service: "todo-frontend" AND level: "error"
```

## Useful Kibana Visualizations

### 1. Log Volume Over Time
1. Go to **Visualize** → **Create visualization**
2. Choose **Line chart**
3. Select `logs-*` index
4. X-axis: `@timestamp` (Date Histogram)
5. Y-axis: Count

### 2. Log Levels Distribution
1. Create **Pie chart** visualization
2. Bucket: `level` (Terms)
3. Metric: Count

### 3. Top Services
1. Create **Data table** visualization
2. Bucket: `service` (Terms)
3. Metric: Count

### 4. Error Logs by Service
1. Create **Bar chart** visualization
2. X-axis: `service` (Terms)
3. Y-axis: Count
4. Filter: `level: "error"`

## Monitoring and Alerts

### Health Checks
All services include health checks:
- **Elasticsearch**: `/_cluster/health`
- **Logstash**: `/_node/stats`
- **Kibana**: `/api/status`
- **Backend**: HTTP GET to `/`
- **Frontend**: HTTP GET to `/`

### Log Monitoring
Monitor these key metrics:
- Log volume per service
- Error rate by service
- Response times
- Failed log transmissions

## Troubleshooting

### Common Issues

1. **Kibana shows no data**:
   - Wait for services to be fully healthy
   - Check if index pattern is created correctly
   - Verify time range in Discover

2. **Frontend logs not appearing**:
   - Check browser console for errors
   - Verify backend API is accessible
   - Check Logstash HTTP input is working

3. **Backend logs not appearing**:
   - Check Winston Logstash transport configuration
   - Verify Logstash TCP input is working
   - Check network connectivity between services

4. **High memory usage**:
   - Elasticsearch is configured with 512MB heap
   - Adjust `ES_JAVA_OPTS` in docker-compose.yaml if needed

### Debug Commands

```bash
# Check service health
docker-compose ps

# View service logs
docker-compose logs elasticsearch
docker-compose logs logstash
docker-compose logs kibana
docker-compose logs backend
docker-compose logs frontend

# Check Elasticsearch indices
curl http://localhost:9200/_cat/indices

# Check Logstash pipeline
curl http://localhost:9600/_node/stats/pipelines

# Test Logstash HTTP input
curl -X POST http://localhost:5044 \
  -H "Content-Type: application/json" \
  -d '{"level":"info","message":"Test log","service":"test"}'
```

### Log Levels

- **INFO**: General information
- **WARN**: Warning messages
- **ERROR**: Error conditions

### Performance Tuning

1. **Elasticsearch**:
   - Adjust heap size based on available memory
   - Configure shard settings for production

2. **Logstash**:
   - Adjust pipeline workers and batch size
   - Monitor pipeline performance

3. **Frontend Logging**:
   - Batch size: 5 logs
   - Batch timeout: 2 seconds
   - Retry attempts: 3

## Data Retention

- **Elasticsearch**: Data persists in Docker volume `elasticsearch-data`
- **Log Rotation**: Backend files rotate daily, keep 14 days
- **Index Management**: Consider setting up ILM (Index Lifecycle Management) for production

## Security Considerations

- ELK stack runs without authentication (development setup)
- For production, enable X-Pack security
- Consider network isolation
- Implement proper access controls

## Production Recommendations

1. **Enable Security**: Configure X-Pack security features
2. **SSL/TLS**: Use encrypted connections
3. **Backup Strategy**: Implement regular backups
4. **Monitoring**: Set up external monitoring
5. **Resource Limits**: Configure proper resource limits
6. **High Availability**: Use multi-node Elasticsearch cluster
7. **Index Management**: Implement proper index lifecycle policies
