const { supabase } = require('../config/supabase');
const { logger } = require('../utils/logger');
const axios = require('axios');
const { sendNotification } = require('../config/rabbitmq');

/**
 * Booking model for interacting with Supabase
 */
class Booking {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Object} Created booking
   */
  static async create(bookingData) {
    try {
      // Check event availability
      const eventAvailability = await this.checkEventAvailability(
        bookingData.eventId,
        bookingData.tickets
      );
      
      if (!eventAvailability.isAvailable) {
        throw new Error('Not enough tickets available');
      }
      
      // Process payment
      const paymentResult = await this.processPayment({
        userId: bookingData.userId,
        amount: bookingData.amount
      });
      
      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }
      
      // Insert booking into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: bookingData.userId,
          event_id: bookingData.eventId,
          tickets: bookingData.tickets,
          amount: bookingData.amount,
          status: 'confirmed',
          payment_id: paymentResult.paymentId
        }])
        .select()
        .single();
      
      if (error) {
        logger.error('Error creating booking:', error);
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error('Failed to create booking');
      }
      
      // Update event availability
      await this.updateEventAvailability(bookingData.eventId, bookingData.tickets);
      
      // Send notification
      await this.sendBookingNotification(data);
      
      return data;
    } catch (error) {
      logger.error('Error in Booking.create:', error);
      throw error;
    }
  }
  
  /**
   * Find a booking by ID
   * @param {string} id - Booking ID
   * @returns {Object|null} Booking or null if not found
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        logger.error('Error finding booking by ID:', error);
        throw new Error(error.message);
      }
      
      return data || null;
    } catch (error) {
      logger.error('Error in Booking.findById:', error);
      throw error;
    }
  }
  
  /**
   * Find bookings by user ID
   * @param {string} userId - User ID
   * @returns {Array} Array of bookings
   */
  static async findByUserId(userId) {
    try {
      // Get bookings from Supabase
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Error finding bookings by user ID:', error);
        throw new Error(error.message);
      }

      // Fetch event details for each booking
      const bookingsWithEvents = await Promise.all(
        (bookings || []).map(async (booking) => {
          try {
            const response = await axios.get(
              `${process.env.EVENT_SERVICE_URL}/api/events/${booking.event_id}`
            );

            if (response.data?.data?.event) {
              return {
                ...booking,
                event: response.data.data.event
              };
            } else {
              logger.error(`No event data found for booking ${booking.id}`);
              return {
                ...booking,
                event: null
              };
            }
          } catch (error) {
            logger.error(`Error fetching event details for booking ${booking.id}:`, error);
            return {
              ...booking,
              event: null
            };
          }
        })
      );
      
      return bookingsWithEvents;
    } catch (error) {
      logger.error('Error in findByUserId:', error);
      throw error;
    }
  }
  
  /**
   * Update booking status
   * @param {string} id - Booking ID
   * @param {string} status - New status
   * @returns {Object} Updated booking
   */
  static async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        logger.error('Error updating booking status:', error);
        throw new Error(error.message);
      }
      
      // Send notification for status update
      await this.sendBookingNotification(data);
      
      return data;
    } catch (error) {
      logger.error('Error in Booking.updateStatus:', error);
      throw error;
    }
  }
  
  /**
   * Check event availability
   * @param {string} eventId - Event ID
   * @param {number} tickets - Number of tickets
   * @returns {Object} Availability information
   */
  static async checkEventAvailability(eventId, tickets) {
    try {
      const response = await axios.get(
        `${process.env.EVENT_SERVICE_URL}/api/events/${eventId}/availability`,
        {
          params: { tickets }
        }
      );
      
      return response.data.data;
    } catch (error) {
      logger.error('Error checking event availability:', error);
      throw new Error('Failed to check event availability');
    }
  }
  
  /**
   * Update event availability
   * @param {string} eventId - Event ID
   * @param {number} tickets - Number of tickets
   * @returns {boolean} True if successful
   */
  static async updateEventAvailability(eventId, tickets) {
    try {
      await axios.put(
        `${process.env.EVENT_SERVICE_URL}/api/events/${eventId}/availability`,
        { tickets }
      );
      
      return true;
    } catch (error) {
      logger.error('Error updating event availability:', error);
      throw new Error('Failed to update event availability');
    }
  }
  
  /**
   * Process payment (mock)
   * @param {Object} paymentData - Payment data
   * @returns {Object} Payment result
   */
  static async processPayment(paymentData) {
    try {
      // In a real application, this would call a payment gateway
      // For this assignment, we'll mock a successful payment
      
      // Simulate API call to payment gateway
      const paymentId = `pay_${Date.now()}`;
      
      return {
        success: true,
        paymentId,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      logger.error('Error processing payment:', error);
      return {
        success: false,
        message: 'Payment processing failed'
      };
    }
  }
  
  /**
   * Send booking notification
   * @param {Object} booking - Booking data
   * @returns {boolean} True if successful
   */
  static async sendBookingNotification(booking) {
    try {
      // Get user email
      const userResponse = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/users/${booking.user_id}`
      );
      
      const userEmail = userResponse.data.data.user.email;
      
      // Get event details
      const eventResponse = await axios.get(
        `${process.env.EVENT_SERVICE_URL}/api/events/${booking.event_id}`
      );
      
      const eventTitle = eventResponse.data.data.event.title;
      
      // Send notification to queue
      await sendNotification({
        booking_id: booking.id,
        user_email: userEmail,
        event_title: eventTitle,
        tickets: booking.tickets,
        status: booking.status,
        timestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      logger.error('Error sending booking notification:', error);
      // Don't throw error here, as this is a non-critical operation
      return false;
    }
  }
}

module.exports = Booking; 