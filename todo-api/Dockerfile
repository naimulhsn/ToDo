# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (use npm install to respect updated package-lock in container)
RUN npm install --omit=dev && npm cache clean --force

# Copy application source
COPY . .

# Create logs directory and set proper permissions
RUN mkdir -p logs && chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
