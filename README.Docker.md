# Todo App - Docker Setup

This project contains a full-stack Todo application with logging capabilities, containerized using Docker and Docker Compose.

## Architecture

- **Frontend**: Vue.js 2 application served by HTTP server
- **Backend**: Node.js Express API with Winston logging
- **ELK Stack**: Elasticsearch, Logstash, Kibana for centralized logging
- **Database**: In-memory storage (todos are stored in memory)

## Services

### Backend (logging-api)
- **Port**: 3000
- **Container**: todo-backend
- **Features**: 
  - RESTful API for todo management
  - Winston logging with daily rotation
  - CORS enabled for frontend communication
  - Health checks

### Frontend (logging-api-frontend)
- **Port**: 8080
- **Container**: todo-frontend
- **Features**:
  - Vue.js 2 SPA
  - Simple HTTP server (http-server)
  - Responsive design
  - Real-time logging in browser console
  - Centralized logging via backend API

### ELK Stack Services

#### Elasticsearch
- **Port**: 9200
- **Container**: todo-elasticsearch
- **Features**: Log storage and indexing

#### Logstash
- **Ports**: 5000 (TCP), 5044 (HTTP)
- **Container**: todo-logstash
- **Features**: Log processing and forwarding

#### Kibana
- **Port**: 5601
- **Container**: todo-kibana
- **Features**: Log visualization and analysis

## Quick Start

1. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - Kibana (Logs): http://localhost:5601
   - Elasticsearch: http://localhost:9200

3. **View logs**:
   ```bash
   # View all logs
   docker-compose logs -f
   
   # View backend logs only
   docker-compose logs -f backend
   
   # View frontend logs only
   docker-compose logs -f frontend
   ```

## Development Commands

```bash
# Start services in background
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build --force-recreate

# View service status
docker-compose ps

# Execute commands in running containers
docker-compose exec backend sh
docker-compose exec frontend sh
```

## API Endpoints

### Todo API
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Logging API
- `POST /api/logs` - Receive frontend logs
- `GET /api/logs/health` - Logging endpoint health check

### System API
- `GET /` - Health check
- `GET /error` - Test error logging

## Logging

### Centralized Logging (ELK Stack)
- **Backend Logs**: Winston → Logstash → Elasticsearch
- **Frontend Logs**: Browser → Backend API → Logstash → Elasticsearch
- **Visualization**: Kibana dashboard
- **Storage**: Elasticsearch with daily indices
- **Backup**: Local file logs in `./logging-api/logs/`

### Log Types
- Application logs (info, warn, error)
- User actions and interactions
- API requests and responses
- System health and performance
- Error tracking and debugging

## File Structure

```
.
├── docker-compose.yaml          # Main compose configuration
├── logging-api/                 # Backend service
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── index.js
│   ├── package.json
│   ├── logger.js
│   ├── controllers/
│   ├── routes/
│   └── logs/
├── logging-api-frontend/        # Frontend service
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── index.html
│   ├── css/
│   └── js/
└── README.Docker.md
```

## Environment Variables

### Backend
- `NODE_ENV`: production
- `PORT`: 3000

### Frontend
- No environment variables required

## Health Checks

Both services include health checks:
- **Backend**: HTTP GET to `/` endpoint
- **Frontend**: HTTP GET to nginx root

## Networking

Services communicate through a custom bridge network (`todo-network`):
- Frontend can reach backend via `http://backend:3000`
- External access via exposed ports

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080, 3000, 5601, 9200, 5000, and 5044 are available
2. **Build failures**: Check Docker daemon is running
3. **API connection issues**: Verify backend health check passes
4. **Permission issues**: Check logs directory permissions

### Debug Commands

```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Inspect containers
docker-compose exec backend sh
docker-compose exec frontend sh

# Check network connectivity
docker-compose exec frontend ping backend
```

## ELK Stack Usage

For detailed ELK stack usage instructions, see [README.ELK.md](README.ELK.md).

### Quick ELK Commands
```bash
# View all logs in Kibana
# 1. Open http://localhost:5601
# 2. Create index pattern: logs-*
# 3. Go to Discover to view logs

# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# View recent logs
curl "http://localhost:9200/logs-*/_search?pretty&size=10"
```

## Production Considerations

- Use environment-specific configurations
- Implement proper secrets management
- Set up monitoring and alerting
- Configure log aggregation with ELK stack
- Use multi-stage builds for smaller images
- Implement proper backup strategies for persistent data
- Enable ELK stack security features
- Configure proper resource limits for Elasticsearch
