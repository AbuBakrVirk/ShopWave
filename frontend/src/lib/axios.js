/**
 * axios.js — pre-configured Axios instance
 *
 * In development:  VITE_API_URL is not set, so requests go to /api/*
 *                  and Vite's dev-server proxy forwards them to localhost:5000.
 *
 * In production:   VITE_API_URL = https://your-app.up.railway.app
 *                  All requests go directly to Railway.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

export default api;
