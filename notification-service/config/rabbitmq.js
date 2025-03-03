const amqp = require('amqplib');
const { logger } = require('../utils/logger');

/**
 * Initialize RabbitMQ connection and channel
 */
const initializeRabbitMQ = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    
    // Create a channel
    const channel = await connection.createChannel();
    
    // Assert notification queue
    await channel.assertQueue('booking_notifications', {
      durable: true
    });
    
    logger.info('Connected to RabbitMQ');
    
    // Handle connection close
    connection.on('close', () => {
      logger.error('RabbitMQ connection closed');
      setTimeout(initializeRabbitMQ, 5000);
    });
    
    return channel;
  } catch (error) {
    logger.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

module.exports = {
  initializeRabbitMQ
}; 