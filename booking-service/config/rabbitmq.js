const amqp = require('amqplib');
const { logger } = require('../utils/logger');

let channel = null;

/**
 * Initialize RabbitMQ connection and channel
 */
const initializeRabbitMQ = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    
    // Create a channel
    channel = await connection.createChannel();
    
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

/**
 * Send a message to the notification queue
 * @param {Object} message - Message to send
 */
const sendNotification = async (message) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    
    // Send message to notification queue
    channel.sendToQueue(
      'booking_notifications',
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    logger.info('Notification sent to queue:', message);
    return true;
  } catch (error) {
    logger.error('Error sending notification:', error);
    throw error;
  }
};

module.exports = {
  initializeRabbitMQ,
  sendNotification
}; 