import { bookingApi } from './api';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  tickets: number;
  amount: number;
  status: 'confirmed' | 'cancelled' | 'refunded';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  event?: any; // Will be populated when getting booking details
}

export interface CreateBookingData {
  eventId: string;
  tickets: number;
}

export const bookingService = {
  async createBooking(data: CreateBookingData) {
    const response = await bookingApi.post('/bookings', data);
    return response.data.data.booking;
  },

  async getBooking(id: string) {
    const response = await bookingApi.get(`/bookings/${id}`);
    return response.data.data.booking;
  },

  async getUserBookings() {
    const response = await bookingApi.get('/bookings');
    return response.data.data.bookings;
  },

  async updateBookingStatus(id: string, status: Booking['status']) {
    const response = await bookingApi.put(`/bookings/${id}/status`, { status });
    return response.data.data.booking;
  }
}; 