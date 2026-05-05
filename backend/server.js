/**
 * ShopWave E-Commerce Backend
 * Configured for Railway deployment
 */

const express = require('express');
const cors    = require('cors');

const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');
const authRoutes    = require('./routes/auth');
const adminRoutes   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// FRONTEND_URL  →  set this in Railway Variables to your Vercel URL
// e.g.  https://shopwave.vercel.app
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://shopwave-production-d1ad.up.railway.app',
  'https://e-shop-one-swart.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman, Railway health checks, curl)
    if (!origin) return callback(null, true);

    // Allow any vercel.app subdomain (covers preview deployments too)
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Allow exact matches from allowedOrigins list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    callback(new Error(`CORS blocked: ${origin}`));
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

// Health check — Railway pings this to confirm the service is alive
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    message:   'ShopWave API is running',
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV || 'development',
  });
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
// Bind to 0.0.0.0 — required by Railway (not just localhost)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ShopWave API  →  http://0.0.0.0:${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}\n`);
});

module.exports = app;
