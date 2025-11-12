const express = require('express');
const router = express.Router();
const logger = require('../logger');

/**
 * Receive critical frontend errors
 * Only logs critical errors from frontend, not all logs
 */
router.post('/', async (req, res) => {
  try {
    const logData = req.body;
    
    // Validate log data (standardized format)
    if (!logData || !logData.level || !logData.message) {
      return res.status(400).json({
        success: false,
        message: 'Invalid log data. Required fields: level, message'
      });
    }

    // Enrich with backend metadata
    const enrichedLog = {
      ...logData,
      receivedAt: new Date().toISOString(),
      receivedFrom: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Log using Winston (which sends to Logstash)
    const level = logData.level.toLowerCase();
    const logEntry = {
      message: `[Frontend] ${logData.message}`,
      ...enrichedLog
    };
    
    switch (level) {
      case 'error':
        logger.error(logEntry);
        break;
      case 'warn':
        logger.warn(logEntry);
        break;
      case 'info':
      default:
        logger.info(logEntry);
        break;
    }

    // Respond quickly (non-blocking)
    res.json({
      success: true,
      message: 'Log received'
    });

  } catch (error) {
    logger.error({
      message: 'Error processing frontend log',
      requestId: req.requestId,
      action_type: 'frontend_log_processing_error',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error processing log'
    });
  }
});

// Health check endpoint for frontend logging
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Frontend logging endpoint is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
