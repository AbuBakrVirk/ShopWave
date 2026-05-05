/**
 * products.js - Product Routes
 * Defines all product-related API endpoints
 */

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);                          // GET /api/products
router.get('/categories', getCategories);                // GET /api/products/categories
router.get('/:id', getProductById);                      // GET /api/products/:id
router.post('/:id/review', verifyToken, addReview);      // POST /api/products/:id/review

// Admin-only routes
router.post('/', verifyToken, verifyAdmin, createProduct);         // POST /api/products
router.put('/:id', verifyToken, verifyAdmin, updateProduct);       // PUT /api/products/:id
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);    // DELETE /api/products/:id

module.exports = router;
