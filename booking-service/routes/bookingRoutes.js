const express = require('express');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 * @access Private
 */
router.post('/', auth, bookingController.createBooking);

/**
 * @route GET /api/bookings/:id
 * @desc Get a booking by ID
 * @access Private
 */
router.get('/:id', auth, bookingController.getBooking);

/**
 * @route GET /api/bookings
 * @desc Get all bookings for the current user
 * @access Private
 */
router.get('/', auth, bookingController.getUserBookings);

/**
 * @route PUT /api/bookings/:id/status
 * @desc Update booking status
 * @access Private
 */
router.put('/:id/status', auth, bookingController.updateBookingStatus);

module.exports = router; 