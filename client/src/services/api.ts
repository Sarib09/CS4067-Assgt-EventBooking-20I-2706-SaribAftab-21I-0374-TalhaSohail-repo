import axios from 'axios';

const API_URLS = {
  user: 'http://localhost:3001/api',
  event: 'http://localhost:3002/api',
  booking: 'http://localhost:3003/api',
  notification: 'http://localhost:3004/api',
};

// Create axios instances for each service
export const userApi = axios.create({
  baseURL: API_URLS.user,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventApi = axios.create({
  baseURL: API_URLS.event,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingApi = axios.create({
  baseURL: API_URLS.booking,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notificationApi = axios.create({
  baseURL: API_URLS.notification,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
const addAuthToken = (api: any) => {
  api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

// Add auth token to all APIs
addAuthToken(userApi);
addAuthToken(eventApi);
addAuthToken(bookingApi);
addAuthToken(notificationApi);

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
}; 