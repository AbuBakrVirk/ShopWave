/**
 * admin.js - Admin Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const { readDB } = require('../utils/fileDB');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(verifyToken, verifyAdmin);

/**
 * GET /api/admin/stats
 * Returns dashboard statistics
 */
router.get('/stats', (req, res) => {
  try {
    const products = readDB('products');
    const orders = readDB('orders');
    const users = readDB('users');

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;

    res.json({
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

module.exports = router;
