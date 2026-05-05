/**
 * productController.js - Product CRUD Operations
 * Handles all product-related business logic
 */

const { readDB, findOne, insertOne, updateOne, deleteOne } = require('../utils/fileDB');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/products
 * Returns all products with optional filtering, sorting, and pagination
 */
const getAllProducts = (req, res) => {
  try {
    let products = readDB('products');

    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12, featured } = req.query;

    // Filter by category
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.featured === true);
    }

    // Search by name, description, brand, or tags
    if (search) {
      const query = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Filter by price range
    if (minPrice) products = products.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) products = products.filter(p => p.price <= parseFloat(maxPrice));

    // Sorting
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'popular':
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
};

/**
 * GET /api/products/categories
 * Returns all unique product categories
 */
const getCategories = (req, res) => {
  try {
    const products = readDB('products');
    const categories = [...new Set(products.map(p => p.category))];
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * GET /api/products/:id
 * Returns a single product by ID
 */
const getProductById = (req, res) => {
  try {
    const product = findOne('products', 'id', req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', message: error.message });
  }
};

/**
 * POST /api/products
 * Creates a new product (Admin only)
 */
const createProduct = (req, res) => {
  try {
    const { name, category, price, originalPrice, image, description, brand, stock, tags, specifications } = req.body;

    // Validate required fields
    if (!name || !category || !price || !image || !description || !brand) {
      return res.status(400).json({ error: 'Missing required fields: name, category, price, image, description, brand' });
    }

    const newProduct = {
      id: uuidv4(),
      name,
      category,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      image,
      images: [image],
      description,
      brand,
      stock: parseInt(stock) || 0,
      rating: 0,
      reviewCount: 0,
      featured: false,
      tags: tags || [],
      specifications: specifications || {},
      createdAt: new Date().toISOString()
    };

    const created = insertOne('products', newProduct);
    res.status(201).json({ message: 'Product created successfully', product: created });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
};

/**
 * PUT /api/products/:id
 * Updates an existing product (Admin only)
 */
const updateProduct = (req, res) => {
  try {
    const existing = findOne('products', 'id', req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Parse numeric fields if provided
    const updates = { ...req.body };
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
    if (updates.stock) updates.stock = parseInt(updates.stock);

    const updated = updateOne('products', req.params.id, updates);
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
};

/**
 * DELETE /api/products/:id
 * Deletes a product (Admin only)
 */
const deleteProduct = (req, res) => {
  try {
    const deleted = deleteOne('products', req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', message: error.message });
  }
};

/**
 * POST /api/products/:id/review
 * Add a rating/review to a product
 */
const addReview = (req, res) => {
  try {
    const product = findOne('products', 'id', req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { rating, comment, userName } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Recalculate average rating
    const newReviewCount = product.reviewCount + 1;
    const newRating = ((product.rating * product.reviewCount) + parseFloat(rating)) / newReviewCount;

    const updated = updateOne('products', req.params.id, {
      rating: Math.round(newRating * 10) / 10,
      reviewCount: newReviewCount
    });

    res.json({ message: 'Review added successfully', product: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review', message: error.message });
  }
};

module.exports = { getAllProducts, getCategories, getProductById, createProduct, updateProduct, deleteProduct, addReview };
