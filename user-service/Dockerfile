FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy environment variables
COPY .env .env

# Expose the port
EXPOSE 3001

# Start the application using npm start
CMD ["npm", "start"] 