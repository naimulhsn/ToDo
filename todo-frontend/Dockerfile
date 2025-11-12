# Use Node.js to serve static files with http-server
FROM node:22-alpine

# Install http-server and wget for health checks
RUN npm install -g http-server && apk add --no-cache wget

# Set working directory
WORKDIR /usr/src/app

# Copy frontend files
COPY . .

# Expose port 8080
EXPOSE 8080

# Start http-server
CMD ["http-server", "-p", "8080", "-c-1", "--cors"]
