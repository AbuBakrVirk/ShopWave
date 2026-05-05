/**
 * orderController.js - Order Management
 * Handles order creation and retrieval from orders.json
 */

const { readDB, insertOne, findOne, updateOne } = require('../utils/fileDB');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/orders
 * Creates a new order and saves it to orders.json
 */
const createOrder = (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;

    // Validate required fields
    if (!customer || !items || !items.length || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields: customer, items, totalAmount' });
    }

    if (!customer.name || !customer.email || !customer.address || !customer.phone) {
      return res.status(400).json({ error: 'Customer info required: name, email, address, phone' });
    }

    // Build order object
    const newOrder = {
      id: uuidv4(),
      orderNumber: `SW-${Date.now()}`,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city || '',
        zipCode: customer.zipCode || ''
      },
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        subtotal: item.price * item.quantity
      })),
      totalAmount: parseFloat(totalAmount),
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedOrder = insertOne('orders', newOrder);

    res.status(201).json({
      message: 'Order placed successfully!',
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
};

/**
 * GET /api/orders
 * Returns all orders (Admin only)
 */
const getAllOrders = (req, res) => {
  try {
    const orders = readDB('orders');
    // Sort by newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
};

/**
 * GET /api/orders/:id
 * Returns a single order by ID
 */
const getOrderById = (req, res) => {
  try {
    const order = findOne('orders', 'id', req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
};

/**
 * GET /api/orders/number/:orderNumber
 * Returns order by order number (for order tracking)
 */
const getOrderByNumber = (req, res) => {
  try {
    const orders = readDB('orders');
    const order = orders.find(o => o.orderNumber === req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
};

/**
 * PUT /api/orders/:id/status
 * Updates order status (Admin only)
 */
const updateOrderStatus = (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = updateOne('orders', req.params.id, { status });
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status', message: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrderByNumber, updateOrderStatus };
