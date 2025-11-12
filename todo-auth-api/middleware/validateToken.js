const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to validate JWT token for protected routes
 */
const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn({
        message: 'Access denied: No token provided',
        requestId: req.requestId,
        request_path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        action_type: 'token_validation_failed'
      });
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.warn({
        message: 'Access denied: User not found',
        requestId: req.requestId,
        userId: decoded.userId,
        request_path: req.originalUrl,
        method: req.method,
        action_type: 'token_validation_failed'
      });
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      fullName: user.fullName
    };

    next();
  } catch (error) {
    logger.warn({
      message: 'Access denied: Invalid token',
      requestId: req.requestId,
      request_path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      action_type: 'token_validation_failed',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });
    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

module.exports = validateToken;
