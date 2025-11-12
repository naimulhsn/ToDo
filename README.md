# Todo App with ELK Stack Logging

A full-stack todo application with centralized logging using Elasticsearch, Logstash, and Kibana (ELK Stack). This project demonstrates microservices architecture with comprehensive logging and monitoring capabilities.

## 🚀 Features

- **RESTful API** for todo management (CRUD operations)
- **JWT-based Authentication** with separate auth microservice
- **Centralized Logging** with ELK Stack (Elasticsearch, Logstash, Kibana)
- **Request Correlation** using `requestId` for tracing requests across services
- **Docker Containerization** with Docker Compose for easy deployment
- **ECS-compliant Logging** following Elastic Common Schema standards
- **Modern Frontend** with vanilla JavaScript, HTML, and CSS

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data persistence
- **JWT** for authentication
- **Winston** for structured logging

### Frontend
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Responsive design

### Logging & Monitoring
- **Elasticsearch 8.11.0** - Search and analytics engine
- **Logstash 8.11.0** - Log processing pipeline
- **Kibana 8.11.0** - Data visualization dashboard

### Infrastructure
- **Docker** & **Docker Compose**
- **MongoDB 7.0**

## 🏗️ Architecture

```
┌─────────────┐
│  Frontend   │ (Port 8080)
│  (Static)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│  Backend    │◄────►│    Auth     │
│  API        │      │   Service   │
│ (Port 3000) │      │ (Port 3001) │
└──────┬──────┘      └──────┬──────┘
       │                    │
       │                    │
       └──────────┬─────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   MongoDB        │
         │  (Port 27017)    │
         └─────────────────┘

┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Backend    │─────►│  Logstash   │─────►│Elasticsearch│
│  API        │      │  (Port 5044)│      │ (Port 9200) │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                                                  ▼
                                            ┌─────────────┐
                                            │   Kibana    │
                                            │ (Port 5601) │
                                            └─────────────┘
```

## 📁 Project Structure

```
todo-app/
├── todo-api/              # Backend API service
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── transports/       # Winston log transports
│   └── config/           # Database configuration
│
├── todo-auth-api/        # Authentication service
│   ├── controllers/      # Auth handlers
│   ├── middleware/       # Token validation
│   ├── models/          # User model
│   └── transports/      # Winston log transports
│
├── todo-frontend/        # Frontend application
│   ├── js/              # JavaScript modules
│   ├── css/             # Stylesheets
│   └── *.html           # HTML pages
│
├── logstash/             # Logstash configuration
│   ├── config/          # Logstash config files
│   └── pipeline/        # Log processing pipeline
│
├── docker-compose.yaml   # Docker Compose configuration
└── README.md            # This file
```

## 🛠️ Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** + **Docker Compose** (Linux)
- **Git** for cloning the repository
- **8GB+ RAM** recommended (for ELK stack)
- **Ports available**: 3000, 3001, 8080, 27017, 5044, 5601, 9200

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/todo-app.git
cd todo-app
```

### 2. Start All Services

```bash
docker-compose up -d
```

This will start all services:
- MongoDB
- Backend API (Port 3000)
- Auth Service (Port 3001)
- Frontend (Port 8080)
- Elasticsearch (Port 9200)
- Logstash (Port 5044)
- Kibana (Port 5601)

### 3. Wait for Services to be Healthy

Services will start in order with health checks. Wait for all containers to be healthy:

```bash
docker-compose ps
```

### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Auth API**: http://localhost:3001
- **Kibana Dashboard**: http://localhost:5601
- **Elasticsearch**: http://localhost:9200

## 📝 Usage

### 1. Create an Account

1. Navigate to http://localhost:8080
2. Click "Sign Up"
3. Fill in your details and create an account

### 2. Login

1. Use your credentials to log in
2. You'll receive a JWT token (stored in localStorage)

### 3. Manage Todos

- Create new todos
- Mark todos as complete
- Update todo details
- Delete todos

### 4. View Logs in Kibana

1. Open http://localhost:5601
2. Go to **Analytics → Discover**
3. Select index pattern: `todo-app-logs-*`
4. View and filter logs by:
   - `service.name` (todo-api, todo-auth-api)
   - `log.level` (info, warn, error)
   - `action_type` (user_signup, todo_created, etc.)
   - `requestId` (trace requests across services)

## 🔧 Configuration

### Environment Variables

Create `.env` files in each service directory if needed. See `.env.example` for reference.

**Backend API** (`todo-api/.env`):
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/todo-app
AUTH_SERVICE_URL=http://auth-service:3001
LOGSTASH_HOST=logstash
LOGSTASH_PORT=5044
```

**Auth Service** (`todo-auth-api/.env`):
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/todo-auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production
LOGSTASH_HOST=logstash
LOGSTASH_PORT=5044
```

### Logstash Configuration

Logstash pipeline configuration is in `logstash/pipeline/logstash.conf`. It:
- Receives logs via HTTP on port 5044
- Parses JSON logs
- Transforms fields to ECS (Elastic Common Schema) format
- Sends logs to Elasticsearch

## 📊 Logging Features

### Structured Logging

All logs follow a consistent structure:
```json
{
  "@timestamp": "2025-11-12T10:00:00.000Z",
  "level": "info",
  "message": "Todo created successfully",
  "service": "todo-api",
  "requestId": "uuid-here",
  "action_type": "todo_created",
  "request_path": "/api/todos",
  "method": "POST",
  "userId": "user-id-here"
}
```

### Log Levels

- **info**: General information (successful operations)
- **warn**: Warnings (validation failures, non-critical issues)
- **error**: Errors (exceptions, failures)

### Request Correlation

Every request gets a unique `requestId` that traces through all services, making it easy to:
- Track a request across microservices
- Debug issues by filtering logs by `requestId`
- Analyze request flow and timing

## 🧪 Testing

### Health Checks

All services have health check endpoints:

```bash
# Backend API
curl http://localhost:3000/

# Auth Service
curl http://localhost:3001/

# Elasticsearch
curl http://localhost:9200/_cluster/health

# Kibana
curl http://localhost:5601/api/status
```

### API Testing

```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get todos (with token)
curl http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛑 Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

## 📚 Documentation

- [ELK Stack Setup Guide](README.ELK.md)
- [Docker Setup Guide](README.Docker.md)
- [Logging Architecture](LOGGING_ARCHITECTURE.md)
- [Kibana Setup Guide](KIBANA_SETUP_GUIDE.md)
- [Kibana Dashboards](KIBANA_DASHBOARDS.md)

## 🐛 Troubleshooting

### Services not starting

1. Check Docker is running: `docker ps`
2. Check logs: `docker-compose logs [service-name]`
3. Check port conflicts: Ensure ports 3000, 3001, 8080, 27017, 5044, 5601, 9200 are available

### Logs not appearing in Kibana

1. Wait for Elasticsearch to be healthy: `docker-compose ps elasticsearch`
2. Check Logstash logs: `docker-compose logs logstash`
3. Verify index pattern in Kibana: `todo-app-logs-*`
4. Check Elasticsearch indices: `curl http://localhost:9200/_cat/indices`

### MongoDB connection issues

1. Ensure MongoDB container is healthy: `docker-compose ps mongodb`
2. Check MongoDB logs: `docker-compose logs mongodb`
3. Verify connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Your Name - [Your GitHub Profile](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Elastic for ELK Stack
- MongoDB for database
- Express.js community
- All open-source contributors

---

**Note**: This is a learning/demonstration project. For production use, consider:
- Adding proper security measures
- Implementing rate limiting
- Adding input validation
- Setting up proper CI/CD
- Using environment-specific configurations
- Adding comprehensive tests

