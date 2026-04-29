/**
 * API client — wraps axios with auth header injection.
 * Set API_BASE in .env or use the dev default.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Domain helpers
export const auth = {
  login: (phone, password) => api.post('/auth/login', { phone, password }).then(r => r.data),
  register: (data) => api.post('/auth/register', data).then(r => r.data),
};

export const services = {
  categories: () => api.get('/services/categories').then(r => r.data.categories),
};

export const vendors = {
  list: (params) => api.get('/vendors', { params }).then(r => r.data.vendors),
  detail: (id) => api.get(`/vendors/${id}`).then(r => r.data),
};

export const bookings = {
  create: (payload) => api.post('/bookings', payload).then(r => r.data.booking),
  mine: () => api.get('/bookings/me').then(r => r.data.bookings),
  detail: (id) => api.get(`/bookings/${id}`).then(r => r.data.booking),
  updateStatus: (id, status, finalPrice) =>
    api.patch(`/bookings/${id}/status`, { status, finalPrice }).then(r => r.data.booking),
};

export const reviews = {
  create: (payload) => api.post('/reviews', payload).then(r => r.data.review),
};
