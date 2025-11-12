# Setup Guide

This guide will help you set up the Todo App with ELK Stack on your local machine.

## Prerequisites

- **Docker Desktop** installed and running
  - Windows: Download from [docker.com](https://www.docker.com/products/docker-desktop)
  - Mac: Download from [docker.com](https://www.docker.com/products/docker-desktop)
  - Linux: Install Docker Engine and Docker Compose
- **Git** installed
- **8GB+ RAM** recommended (ELK stack requires significant memory)
- **Ports available**: 3000, 3001, 8080, 27017, 5044, 5601, 9200

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/todo-app.git
cd todo-app
```

### 2. Verify Docker is Running

```bash
docker --version
docker-compose --version
```

### 3. Start All Services

```bash
docker-compose up -d
```

This command will:
- Pull required Docker images (if not already present)
- Build custom images for backend, auth, and frontend services
- Start all services in the correct order (respecting dependencies)
- Wait for health checks to pass

### 4. Monitor Service Startup

Watch the logs to see services starting:

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f elasticsearch
```

### 5. Verify Services are Healthy

Check service status:

```bash
docker-compose ps
```

All services should show "healthy" status. Wait 1-2 minutes for all services to fully start.

### 6. Access the Application

Once all services are healthy:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Auth API**: http://localhost:3001
- **Kibana**: http://localhost:5601
- **Elasticsearch**: http://localhost:9200

## First-Time Kibana Setup

1. Open http://localhost:5601
2. Wait for Kibana to fully load (may take 1-2 minutes)
3. Go to **Analytics → Discover**
4. Create index pattern: `todo-app-logs-*`
5. Select `@timestamp` as the time field
6. Click "Create index pattern"
7. Start exploring your logs!

## Troubleshooting

### Services Won't Start

**Check Docker resources:**
- Ensure Docker Desktop has enough memory allocated (minimum 4GB, recommended 8GB)
- Check Docker Desktop settings → Resources

**Check port conflicts:**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5601

# Mac/Linux
lsof -i :3000
lsof -i :5601
```

**View detailed logs:**
```bash
docker-compose logs [service-name]
```

### Elasticsearch Fails to Start

Elasticsearch requires significant memory. If it fails:

1. Check Docker Desktop memory allocation (increase to 8GB+)
2. Check Elasticsearch logs: `docker-compose logs elasticsearch`
3. Look for "max virtual memory areas" error
4. On Linux, you may need to increase `vm.max_map_count`:
   ```bash
   sudo sysctl -w vm.max_map_count=262144
   ```

### Logs Not Appearing in Kibana

1. **Wait for Elasticsearch**: Ensure Elasticsearch is healthy
   ```bash
   curl http://localhost:9200/_cluster/health
   ```

2. **Check Logstash**: Verify Logstash is processing logs
   ```bash
   docker-compose logs logstash | tail -20
   ```

3. **Verify Index Pattern**: In Kibana, ensure index pattern `todo-app-logs-*` exists

4. **Check Time Range**: In Kibana Discover, expand the time range to see older logs

### MongoDB Connection Issues

1. Check MongoDB is running: `docker-compose ps mongodb`
2. Check MongoDB logs: `docker-compose logs mongodb`
3. Verify connection strings in `docker-compose.yaml`

## Stopping Services

```bash
# Stop all services (keeps data)
docker-compose stop

# Stop and remove containers (keeps data volumes)
docker-compose down

# Stop and remove everything including volumes (fresh start)
docker-compose down -v
```

## Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f logstash

# Last 100 lines
docker-compose logs --tail=100 backend
```

## Fresh Start (Delete Everything)

If you want to start completely fresh:

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images (optional)
docker system prune -a

# Start fresh
docker-compose up -d
```

## Next Steps

- Read the [README.md](README.md) for usage instructions
- Check [LOGGING_ARCHITECTURE.md](LOGGING_ARCHITECTURE.md) to understand the logging setup
- Explore [KIBANA_SETUP_GUIDE.md](KIBANA_SETUP_GUIDE.md) for Kibana configuration

## Getting Help

If you encounter issues:
1. Check the logs: `docker-compose logs [service-name]`
2. Review the troubleshooting section above
3. Check service health: `docker-compose ps`
4. Open an issue on GitHub with:
   - Error messages
   - Service logs
   - Your environment (OS, Docker version)

