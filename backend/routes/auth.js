/**
 * auth.js - Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);           // POST /api/auth/register
router.post('/login', login);                 // POST /api/auth/login
router.get('/me', verifyToken, getProfile);   // GET /api/auth/me

module.exports = router;
