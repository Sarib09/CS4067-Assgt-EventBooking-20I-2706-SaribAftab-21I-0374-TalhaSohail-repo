import { notificationApi } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmation' | 'booking_cancellation' | 'event_update' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  async getNotifications() {
    const response = await notificationApi.get('/notifications');
    return response.data.data.notifications;
  },

  async markAsRead(id: string) {
    const response = await notificationApi.put(`/notifications/${id}/read`);
    return response.data.data.notification;
  },

  async markAllAsRead() {
    const response = await notificationApi.put('/notifications/read-all');
    return response.data.data.notifications;
  },

  async deleteNotification(id: string) {
    await notificationApi.delete(`/notifications/${id}`);
  }
}; 