const mongoose = require('mongoose');
const logger = require('../logger');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/todo-app';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info({
      message: 'Connected to MongoDB for todos',
      action_type: 'database_connected'
    });
  } catch (error) {
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
  }
};

module.exports = connectDB;
