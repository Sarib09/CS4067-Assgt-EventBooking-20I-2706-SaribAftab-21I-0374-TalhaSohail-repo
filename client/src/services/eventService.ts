import { eventApi } from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Conference' | 'Workshop' | 'Seminar' | 'Concert' | 'Exhibition' | 'Other';
  price: number;
  totalTickets: number;
  availableTickets: number;
  image?: string;
  organizer: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: Event['category'];
  price: number;
  totalTickets: number;
  image?: string;
  organizer: string;
}

export const eventService = {
  async getAllEvents() {
    const response = await eventApi.get('/events');
    return response.data.data.events;
  },

  async getEvent(id: string) {
    const response = await eventApi.get(`/events/${id}`);
    return response.data.data.event;
  },

  async createEvent(data: CreateEventData) {
    const response = await eventApi.post('/events', data);
    return response.data.data.event;
  },

  async updateEvent(id: string, data: Partial<CreateEventData>) {
    const response = await eventApi.put(`/events/${id}`, data);
    return response.data.data.event;
  },

  async deleteEvent(id: string) {
    await eventApi.delete(`/events/${id}`);
  },

  async checkAvailability(id: string, tickets: number) {
    const response = await eventApi.get(`/events/${id}/availability`, {
      params: { tickets }
    });
    return response.data.data;
  }
}; 