const Booking = require('../models/bookingModel');
const { ApiError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const axios = require('axios');

/**
 * Booking controller for handling booking-related requests
 */
const bookingController = {
  /**
   * Create a new booking
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createBooking: async (req, res, next) => {
    try {
      const { eventId, tickets } = req.body;
      const userId = req.user.id;
      
      if (!eventId || !tickets || tickets <= 0) {
        throw new ApiError('Event ID and number of tickets are required', 400);
      }
      
      // Get event details to calculate amount
      let eventDetails;
      try {
        const response = await axios.get(`${process.env.EVENT_SERVICE_URL}/api/events/${eventId}`);
        eventDetails = response.data.data.event;
      } catch (error) {
        logger.error('Error fetching event details:', error);
        throw new ApiError('Event not found or service unavailable', 404);
      }
      
      // Calculate total amount
      const amount = eventDetails.price * tickets;
      
      // Create booking
      const booking = await Booking.create({
        userId,
        eventId,
        tickets,
        amount
      });
      
      res.status(201).json({
        status: 'success',
        data: {
          booking
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get a booking by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getBooking: async (req, res, next) => {
    try {
      const bookingId = req.params.id;
      
      // Get booking
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        throw new ApiError('Booking not found', 404);
      }
      
      // Check if user is authorized to view this booking
      if (booking.user_id !== req.user.id) {
        throw new ApiError('You are not authorized to view this booking', 403);
      }
      
      // Get event details
      let eventDetails;
      try {
        const response = await axios.get(`${process.env.EVENT_SERVICE_URL}/api/events/${booking.event_id}`);
        eventDetails = response.data.data.event;
      } catch (error) {
        logger.error('Error fetching event details:', error);
        eventDetails = { title: 'Event details unavailable' };
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          booking,
          event: eventDetails
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get all bookings for the current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getUserBookings: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        throw new ApiError('User not authenticated', 401);
      }

      const bookings = await Booking.findByUserId(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: {
          bookings
        }
      });
    } catch (error) {
      logger.error('Error in getUserBookings:', error);
      next(error);
    }
  },
  
  /**
   * Update booking status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateBookingStatus: async (req, res, next) => {
    try {
      const bookingId = req.params.id;
      const { status } = req.body;
      
      if (!status || !['confirmed', 'cancelled', 'refunded'].includes(status)) {
        throw new ApiError('Valid status is required (confirmed, cancelled, refunded)', 400);
      }
      
      // Get booking
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        throw new ApiError('Booking not found', 404);
      }
      
      // Check if user is authorized to update this booking
      if (booking.user_id !== req.user.id) {
        throw new ApiError('You are not authorized to update this booking', 403);
      }
      
      // Update booking status
      const updatedBooking = await Booking.updateStatus(bookingId, status);
      
      res.status(200).json({
        status: 'success',
        data: {
          booking: updatedBooking
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bookingController; 