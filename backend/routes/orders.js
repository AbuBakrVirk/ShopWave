/**
 * orders.js - Order Routes
 */

const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, getOrderByNumber, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public routes
router.post('/', createOrder);                                              // POST /api/orders
router.get('/track/:orderNumber', getOrderByNumber);                        // GET /api/orders/track/:orderNumber

// Admin-only routes
router.get('/', verifyToken, verifyAdmin, getAllOrders);                     // GET /api/orders
router.get('/:id', verifyToken, verifyAdmin, getOrderById);                 // GET /api/orders/:id
router.put('/:id/status', verifyToken, verifyAdmin, updateOrderStatus);     // PUT /api/orders/:id/status

module.exports = router;
