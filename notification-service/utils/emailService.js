const nodemailer = require('nodemailer');
const { logger } = require('./logger');

/**
 * Create a nodemailer transporter
 */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @returns {Promise} Nodemailer send mail promise
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Generate booking confirmation email
 * @param {Object} data - Booking data
 * @returns {Object} Email options
 */
const generateBookingConfirmationEmail = (data) => {
  const { user_email, event_title, tickets, booking_id, status } = data;
  
  return {
    to: user_email,
    subject: `Booking Confirmation: ${event_title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4CAF50;">Booking Confirmed!</h2>
        <p>Dear Customer,</p>
        <p>Your booking for <strong>${event_title}</strong> has been ${status}.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details:</h3>
          <p><strong>Booking ID:</strong> ${booking_id}</p>
          <p><strong>Event:</strong> ${event_title}</p>
          <p><strong>Number of Tickets:</strong> ${tickets}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
        <p>Thank you for using our service!</p>
        <p>Best regards,<br>Event Booking Team</p>
      </div>
    `
  };
};

/**
 * Generate booking status update email
 * @param {Object} data - Booking data
 * @returns {Object} Email options
 */
const generateBookingStatusUpdateEmail = (data) => {
  const { user_email, event_title, tickets, booking_id, status } = data;
  
  return {
    to: user_email,
    subject: `Booking Status Update: ${event_title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #2196F3;">Booking Status Update</h2>
        <p>Dear Customer,</p>
        <p>Your booking for <strong>${event_title}</strong> has been updated to <strong>${status}</strong>.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details:</h3>
          <p><strong>Booking ID:</strong> ${booking_id}</p>
          <p><strong>Event:</strong> ${event_title}</p>
          <p><strong>Number of Tickets:</strong> ${tickets}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
        <p>If you have any questions, please contact our support team.</p>
        <p>Thank you for using our service!</p>
        <p>Best regards,<br>Event Booking Team</p>
      </div>
    `
  };
};

module.exports = {
  sendEmail,
  generateBookingConfirmationEmail,
  generateBookingStatusUpdateEmail
}; 