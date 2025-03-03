const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', userController.register);

/**
 * @route POST /api/users/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', userController.login);

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route DELETE /api/users/profile
 * @desc Delete user account
 * @access Private
 */
router.delete('/profile', authenticate, userController.deleteAccount);

/**
 * @route GET /api/users/verify-token
 * @desc Verify JWT token
 * @access Private
 */
router.get('/verify-token', authenticate, userController.verifyToken);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID (for internal service communication)
 * @access Public
 */
router.get('/:id', userController.getUserById);

module.exports = router; 