const Notification = require('../models/notificationModel');
const { logger } = require('../utils/logger');
const { 
  sendEmail, 
  generateBookingConfirmationEmail, 
  generateBookingStatusUpdateEmail 
} = require('../utils/emailService');

/**
 * Start consuming messages from the notification queue
 * @param {Object} channel - RabbitMQ channel
 */
const startNotificationConsumer = async (channel) => {
  try {
    // Consume messages from the notification queue
    await channel.consume('booking_notifications', async (message) => {
      try {
        if (message) {
          // Parse message content
          const content = JSON.parse(message.content.toString());
          logger.info('Received notification message:', content);
          
          // Process notification
          await processNotification(content);
          
          // Acknowledge message
          channel.ack(message);
        }
      } catch (error) {
        logger.error('Error processing notification message:', error);
        // Reject message and requeue
        channel.nack(message, false, true);
      }
    });
    
    return true;
  } catch (error) {
    logger.error('Error starting notification consumer:', error);
    throw error;
  }
};

/**
 * Process a notification
 * @param {Object} data - Notification data
 */
const processNotification = async (data) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      bookingId: data.booking_id,
      userEmail: data.user_email,
      eventTitle: data.event_title,
      tickets: data.tickets,
      status: data.status,
      notificationType: 'email'
    });
    
    // Generate email based on status
    let emailOptions;
    if (data.status === 'confirmed') {
      emailOptions = generateBookingConfirmationEmail(data);
    } else {
      emailOptions = generateBookingStatusUpdateEmail(data);
    }
    
    // Send email
    await sendEmail(emailOptions);
    
    // Update notification record
    notification.sent = true;
    notification.sentAt = new Date();
    await notification.save();
    
    logger.info(`Notification sent for booking ${data.booking_id}`);
    return true;
  } catch (error) {
    logger.error('Error processing notification:', error);
    throw error;
  }
};

module.exports = {
  startNotificationConsumer,
  processNotification
}; 