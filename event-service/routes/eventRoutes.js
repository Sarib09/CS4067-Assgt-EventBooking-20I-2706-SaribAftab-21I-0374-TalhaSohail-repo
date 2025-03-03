const express = require('express');
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/events
 * @desc Get all events
 * @access Public
 */
router.get('/', eventController.getAllEvents);

/**
 * @route GET /api/events/:id
 * @desc Get a single event
 * @access Public
 */
router.get('/:id', eventController.getEvent);

/**
 * @route POST /api/events
 * @desc Create a new event
 * @access Private
 */
router.post('/', authenticate, eventController.createEvent);

/**
 * @route PUT /api/events/:id
 * @desc Update an event
 * @access Private
 */
router.put('/:id', authenticate, eventController.updateEvent);

/**
 * @route DELETE /api/events/:id
 * @desc Delete an event
 * @access Private
 */
router.delete('/:id', authenticate, eventController.deleteEvent);

/**
 * @route GET /api/events/:id/availability
 * @desc Check event availability
 * @access Public
 */
router.get('/:id/availability', eventController.checkAvailability);

/**
 * @route PUT /api/events/:id/availability
 * @desc Update ticket availability after booking
 * @access Private (should be called from Booking Service)
 */
router.put('/:id/availability', eventController.updateAvailability);

module.exports = router; 