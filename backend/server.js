/**
 * ShopWave E-Commerce Backend Server
 * Configured for Railway deployment
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');
const authRoutes    = require('./routes/auth');
const adminRoutes   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// FRONTEND_URL is set in Railway environment variables
// e.g. https://shopwave.vercel.app
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean); // remove undefined if env var not set yet

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, Railway health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/admin',    adminRoutes);

// Health check — Railway uses this to confirm the service is up
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'ShopWave API is running', timestamp: new Date().toISOString() });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ShopWave API  →  http://0.0.0.0:${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}\n`);
});

module.exports = app;
