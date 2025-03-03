require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { logger } = require('./utils/logger');
const { initializeRabbitMQ } = require('./config/rabbitmq');
const { startNotificationConsumer } = require('./controllers/notificationController');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Initialize RabbitMQ and start consuming messages
initializeRabbitMQ()
  .then((channel) => {
    logger.info('RabbitMQ initialized successfully');
    return startNotificationConsumer(channel);
  })
  .then(() => {
    logger.info('Notification consumer started');
  })
  .catch((error) => {
    logger.error('Failed to initialize RabbitMQ or start consumer:', error);
    process.exit(1);
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Notification Service running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app; // For testing purposes 