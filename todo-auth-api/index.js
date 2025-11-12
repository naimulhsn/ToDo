const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./logger');
const authController = require('./controllers/authController');
const validateToken = require('./middleware/validateToken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/todo-auth';

mongoose.connect(MONGODB_URI)
.then(() => {
  logger.info({
    message: 'Connected to MongoDB',
    action_type: 'database_connected'
  });
})
.catch((error) => {
  logger.error({
    message: 'MongoDB connection error',
    action_type: 'database_connection_error',
    error: {
      message: error.message,
      type: error.name,
      stack: error.stack
    }
  });
  process.exit(1);
});

// Enable CORS for all routes
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Correlation id middleware
app.use((req, res, next) => {
  req.requestId = uuidv4();
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile', validateToken, authController.getProfile);
app.post('/api/auth/logout', validateToken, authController.logout);
app.post('/api/auth/validate', authController.validateToken);

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error({
    message: 'Unhandled error',
    requestId: req.requestId,
    request_path: req.originalUrl,
    method: req.method,
    action_type: 'unhandled_error',
    error: {
      message: error.message,
      type: error.name,
      stack: error.stack
    }
  });
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn({
    message: 'Route not found',
    requestId: req.requestId,
    request_path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    action_type: 'route_not_found'
  });
  
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(port, () => {
  logger.info({
    message: `Auth service is running on http://localhost:${port}`,
    action_type: 'service_started',
    port
  });
});
