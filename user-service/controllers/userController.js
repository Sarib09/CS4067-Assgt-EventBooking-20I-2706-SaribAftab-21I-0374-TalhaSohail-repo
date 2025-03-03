const User = require('../models/userModel');
const { ApiError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const jwt = require('jsonwebtoken');

/**
 * User controller for handling user-related requests
 */
const userController = {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  register: async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new ApiError('User with this email already exists', 400);
      }
      
      // Create new user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phone
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        throw new ApiError('Invalid email or password', 401);
      }
      
      // Check if password is correct
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError('Invalid email or password', 401);
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Get user profile
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phone, email, password } = req.body;
      
      // Update user profile
      const updatedUser = await User.update(userId, {
        firstName,
        lastName,
        phone,
        email,
        password
      });
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            phone: updatedUser.phone
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Delete user account
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  deleteAccount: async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Delete user account
      await User.delete(userId);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  verifyToken: async (req, res, next) => {
    try {
      // Token is already verified by the authenticate middleware
      // Just return the user data
      const userId = req.user.id;
      
      // Get user profile
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getUserById: async (req, res, next) => {
    try {
      const userId = req.params.id;
      
      // Get user by ID
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController; 