const { supabase } = require('../config/supabase');
const { logger } = require('../utils/logger');
const bcrypt = require('bcrypt');

/**
 * User model for interacting with Supabase
 */
class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Insert user into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password: hashedPassword,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || null,
          created_at: new Date().toISOString()
        })
        .select('id, email, first_name, last_name, phone, created_at')
        .single();
      
      if (error) {
        logger.error('Error creating user:', error);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      logger.error('Error in User.create:', error);
      throw error;
    }
  }
  
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Object|null} User or null if not found
   */
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        logger.error('Error finding user by email:', error);
        throw new Error(error.message);
      }
      
      return data || null;
    } catch (error) {
      logger.error('Error in User.findByEmail:', error);
      throw error;
    }
  }
  
  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Object|null} User or null if not found
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, phone, created_at')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        logger.error('Error finding user by ID:', error);
        throw new Error(error.message);
      }
      
      return data || null;
    } catch (error) {
      logger.error('Error in User.findById:', error);
      throw error;
    }
  }
  
  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Object} Updated user
   */
  static async update(id, userData) {
    try {
      const updateData = {};
      
      // Only include fields that are provided
      if (userData.firstName) updateData.first_name = userData.firstName;
      if (userData.lastName) updateData.last_name = userData.lastName;
      if (userData.phone) updateData.phone = userData.phone;
      if (userData.email) updateData.email = userData.email;
      
      // If password is provided, hash it
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(userData.password, salt);
      }
      
      // Update user in Supabase
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, email, first_name, last_name, phone, created_at')
        .single();
      
      if (error) {
        logger.error('Error updating user:', error);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      logger.error('Error in User.update:', error);
      throw error;
    }
  }
  
  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {boolean} True if successful
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        logger.error('Error deleting user:', error);
        throw new Error(error.message);
      }
      
      return true;
    } catch (error) {
      logger.error('Error in User.delete:', error);
      throw error;
    }
  }
  
  /**
   * Verify user password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {boolean} True if password matches
   */
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 