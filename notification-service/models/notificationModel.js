const mongoose = require('mongoose');

/**
 * Notification Schema
 */
const notificationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: [true, 'Booking ID is required']
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required']
  },
  eventTitle: {
    type: String,
    required: [true, 'Event title is required']
  },
  tickets: {
    type: Number,
    required: [true, 'Number of tickets is required']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['confirmed', 'cancelled', 'refunded']
  },
  notificationType: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: ['email', 'sms']
  },
  sent: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 