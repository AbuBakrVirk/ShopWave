/**
 * axios.js — pre-configured Axios instance
 *
 * LOCAL DEV:   VITE_API_URL is not set → requests go to /api/*
 *              Vite proxy in vite.config.js forwards them to localhost:5000
 *
 * PRODUCTION:  VITE_API_URL = https://xxxx.up.railway.app  (set in Vercel env vars)
 *              All requests go directly to the Railway public URL
 *
 * NOTE: shopwave.railway.internal is a PRIVATE internal URL — only works
 *       between Railway services. You need the PUBLIC domain from:
 *       Railway dashboard → your service → Settings → Networking → Generate Domain
 */

import axios from 'axios';

const api = axios.create({
  // Falls back to '' so relative /api/* paths work with Vite proxy locally
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  timeout: 15000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopwave_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage but don't redirect (AuthContext handles it)
      localStorage.removeItem('shopwave_token');
    }
    return Promise.reject(error);
  }
);

export default api;
