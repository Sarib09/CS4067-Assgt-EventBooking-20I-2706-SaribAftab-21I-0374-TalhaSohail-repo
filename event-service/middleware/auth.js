const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');
const { logger } = require('../utils/logger');
const axios = require('axios');

/**
 * Authentication middleware to protect routes
 * This middleware verifies the JWT token by calling the User Service
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authentication required', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError('Authentication required', 401);
    }
    
    try {
      // Verify token by calling User Service
      const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // If verification is successful, set user in request
      if (response.data && response.data.data && response.data.data.user) {
        req.user = response.data.data.user;
        next();
      } else {
        throw new ApiError('Invalid user data from authentication service', 401);
      }
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      
      if (error.response && error.response.status === 401) {
        throw new ApiError('Invalid or expired token', 401);
      } else {
        throw new ApiError('Authentication service unavailable', 503);
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate }; 