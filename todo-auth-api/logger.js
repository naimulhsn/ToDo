const winston = require('winston');
require('winston-daily-rotate-file');
const LogstashHttpTransport = require('./transports/logstash-http');
const fs = require('fs');
const path = require('path');

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-application.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true, 
  maxSize: '20m',
  maxFiles: '14d'
});

// Logstash HTTP transport configuration
const logstashHost = process.env.LOGSTASH_HOST || 'localhost';
const logstashPort = process.env.LOGSTASH_PORT || 5044;

const logstashHttpTransport = new LogstashHttpTransport({
  logstashHost: logstashHost,
  logstashPort: logstashPort,
  service: 'todo-auth-api',
  environment: process.env.NODE_ENV || 'development'
});

const logger = winston.createLogger({
  level: 'info',

  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),

  defaultMeta: { 
    service: 'todo-auth-api',
    environment: process.env.NODE_ENV || 'development'
  },
  
  transports: [
    dailyRotateFileTransport,
    logstashHttpTransport
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;
