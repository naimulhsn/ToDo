const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const logger = require('./logger');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todos');
const logRoutes = require('./routes/logs');
const { v4: uuidv4 } = require('uuid');

// Connect to MongoDB
connectDB();

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

// --- API Routes ---

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Todo API is running',
        service: 'todo-backend',
        timestamp: new Date().toISOString()
    });
});

// Todo API Routes
app.use('/api/todos', todoRoutes);

// Frontend Logging Routes
app.use('/api/logs', logRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  logger.info({
    message: `Todo API server is running on http://localhost:${port}`,
    action_type: 'service_started',
    port
  });
});
