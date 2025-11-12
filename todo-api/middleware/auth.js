const axios = require('axios');
const logger = require('../logger');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

/**
 * Middleware to validate JWT token by calling auth-service
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

    // Call auth-service to validate token
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/validate`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    if (response.data.success) {
      // Add user info to request object
      req.user = response.data.data;
      next();
    } else {
      logger.warn({
        message: 'Token validation failed',
        requestId: req.requestId,
        request_path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        action_type: 'token_validation_failed'
      });
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
  } catch (error) {
    logger.error({
      message: 'Token validation error',
      requestId: req.requestId,
      request_path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      action_type: 'token_validation_error',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication service unavailable'
    });
  }
};

module.exports = validateToken;
