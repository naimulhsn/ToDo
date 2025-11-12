const Transport = require('winston-transport');
const axios = require('axios');

class LogstashHttpTransport extends Transport {
  constructor(options = {}) {
    super(options);
    
    this.name = 'logstash-http';
    this.level = options.level || 'info';
    this.logstashHost = options.logstashHost || 'localhost';
    this.logstashPort = options.logstashPort || 5044;
    this.service = options.service || 'unknown';
    this.environment = options.environment || 'development';
    
    this.logstashUrl = `http://${this.logstashHost}:${this.logstashPort}`;
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Prepare log entry for Logstash
    const logEntry = {
      '@timestamp': new Date().toISOString(),
      level: info.level,
      message: info.message,
      service: this.service,
      environment: this.environment,
      log_source: 'backend',
      ...info
    };

    // Send to Logstash via HTTP
    this.sendToLogstash(logEntry)
      .then(() => {
        callback();
      })
      .catch((error) => {
        // Don't fail the application if Logstash is unavailable
        console.warn('Failed to send log to Logstash:', error.message);
        callback();
      });
  }

  async sendToLogstash(logEntry) {
    try {
      await axios.post(this.logstashUrl, logEntry, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Log the error but don't throw it
      console.warn('Logstash HTTP transport error:', error.message);
    }
  }
}

module.exports = LogstashHttpTransport;
