const Event = require('../models/eventModel');
const { ApiError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Event controller for handling event-related requests
 */
const eventController = {
  /**
   * Get all events
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getAllEvents: async (req, res, next) => {
    try {
      const events = await Event.find();
      res.status(200).json({
        status: 'success',
        data: {
          events
        }
      });
    } catch (error) {
      logger.error('Error getting events:', error);
      next(error);
    }
  },
  
  /**
   * Get a single event by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getEvent: async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        throw new ApiError('Event not found', 404);
      }
      res.status(200).json({
        status: 'success',
        data: {
          event
        }
      });
    } catch (error) {
      logger.error('Error getting event:', error);
      next(error);
    }
  },
  
  /**
   * Create a new event
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createEvent: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        throw new ApiError('User not authenticated', 401);
      }

      const eventData = {
        ...req.body,
        createdBy: req.user.id,
        availableTickets: req.body.totalTickets
      };

      const event = await Event.create(eventData);
      res.status(201).json({
        status: 'success',
        data: {
          event
        }
      });
    } catch (error) {
      logger.error('Error creating event:', error);
      next(error);
    }
  },
  
  /**
   * Update an event
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateEvent: async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        throw new ApiError('Event not found', 404);
      }

      if (event.createdBy !== req.user.id) {
        throw new ApiError('Not authorized to update this event', 403);
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: 'success',
        data: {
          event: updatedEvent
        }
      });
    } catch (error) {
      logger.error('Error updating event:', error);
      next(error);
    }
  },
  
  /**
   * Delete an event
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  deleteEvent: async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        throw new ApiError('Event not found', 404);
      }

      if (event.createdBy !== req.user.id) {
        throw new ApiError('Not authorized to delete this event', 403);
      }

      await Event.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      logger.error('Error deleting event:', error);
      next(error);
    }
  },
  
  /**
   * Check event availability
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  checkAvailability: async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        throw new ApiError('Event not found', 404);
      }

      const requestedTickets = parseInt(req.query.tickets) || 1;
      const isAvailable = event.availableTickets >= requestedTickets;

      res.status(200).json({
        status: 'success',
        data: {
          isAvailable,
          availableTickets: event.availableTickets,
          requestedTickets
        }
      });
    } catch (error) {
      logger.error('Error checking availability:', error);
      next(error);
    }
  },
  
  /**
   * Update ticket availability after booking
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateAvailability: async (req, res, next) => {
    try {
      const { tickets } = req.body;
      if (!tickets) {
        throw new ApiError('Number of tickets is required', 400);
      }

      const event = await Event.findById(req.params.id);
      if (!event) {
        throw new ApiError('Event not found', 404);
      }

      const newAvailability = event.availableTickets - tickets;
      if (newAvailability < 0) {
        throw new ApiError('Not enough tickets available', 400);
      }

      event.availableTickets = newAvailability;
      await event.save();

      res.status(200).json({
        status: 'success',
        data: {
          availableTickets: event.availableTickets
        }
      });
    } catch (error) {
      logger.error('Error updating availability:', error);
      next(error);
    }
  }
};

module.exports = eventController; 