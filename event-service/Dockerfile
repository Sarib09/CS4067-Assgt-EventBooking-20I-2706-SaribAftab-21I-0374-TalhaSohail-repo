FROM node:18-alpine

WORKDIR /app

# Add dependencies for better Node.js networking
RUN apk add --no-cache libc6-compat

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Add a simple health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Expose the port the app runs on
EXPOSE 3002

# Command to run the application
CMD ["npm", "start"] 