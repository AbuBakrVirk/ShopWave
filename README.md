# 🛍️ ShopWave — Full-Stack E-Commerce App

A modern, professional e-commerce web application built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express** (backend), using **JSON files** as the data store.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start the Backend

```bash
cd backend
npm run dev       # with nodemon (auto-restart)
# OR
npm start         # production
```

Backend runs on: **http://localhost:5000**

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 🔐 Demo Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@shopwave.com     | admin123  |
| User  | john@example.com       | user123   |

---

## 📁 Project Structure

```
shopwave/
├── backend/
│   ├── data/
│   │   ├── products.json     ← Product catalog (18 products)
│   │   ├── users.json        ← User accounts
│   │   └── orders.json       ← Customer orders
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── auth.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js           ← JWT middleware
│   ├── utils/
│   │   └── fileDB.js         ← JSON file database utility
│   └── server.js
│
└── frontend/
    └── src/
        ├── context/
        │   ├── CartContext.jsx      ← Cart state (localStorage)
        │   ├── AuthContext.jsx      ← JWT auth state
        │   ├── WishlistContext.jsx  ← Wishlist (localStorage)
        │   └── ThemeContext.jsx     ← Dark/light mode
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   └── Footer.jsx
        │   └── ui/
        │       ├── ProductCard.jsx
        │       ├── ProductSkeleton.jsx
        │       └── StarRating.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── ProductsPage.jsx
        │   ├── ProductDetailPage.jsx
        │   ├── CartPage.jsx
        │   ├── CheckoutPage.jsx
        │   ├── OrderConfirmationPage.jsx
        │   ├── LoginPage.jsx
        │   ├── WishlistPage.jsx
        │   └── admin/
        │       ├── AdminLayout.jsx
        │       ├── AdminDashboard.jsx
        │       ├── AdminProducts.jsx
        │       └── AdminOrders.jsx
        └── App.jsx
```

---

## 🌟 Features

### 🛍️ Shopping
- Product listing with grid layout
- Category filtering, search, sorting (price, rating, popularity)
- Pagination (12 products per page)
- Product detail page with image gallery, specs, reviews
- Add to cart / wishlist with localStorage persistence

### 🛒 Cart & Checkout
- Cart with quantity management
- Dynamic price calculation (subtotal, shipping, tax)
- Checkout form with validation
- Multiple payment methods (COD, Card, EasyPaisa, JazzCash)
- Order confirmation page with tracking steps

### 👤 Authentication
- JWT-based login/register
- Protected routes
- Admin vs user roles

### 🔧 Admin Panel
- Dashboard with stats (products, orders, revenue, users)
- Product CRUD (add, edit, delete)
- Order management with status updates
- Low stock alerts

### 🎨 UI/UX
- Dark/light mode toggle
- Loading skeletons
- Smooth animations and hover effects
- Fully responsive (mobile-first)
- Toast notifications

---

## 🔌 API Endpoints

| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| GET    | /api/products               | List products (filters)  | Public   |
| GET    | /api/products/categories    | Get all categories       | Public   |
| GET    | /api/products/:id           | Get product by ID        | Public   |
| POST   | /api/products               | Create product           | Admin    |
| PUT    | /api/products/:id           | Update product           | Admin    |
| DELETE | /api/products/:id           | Delete product           | Admin    |
| POST   | /api/products/:id/review    | Add review               | User     |
| POST   | /api/orders                 | Place order              | Public   |
| GET    | /api/orders                 | Get all orders           | Admin    |
| GET    | /api/orders/:id             | Get order by ID          | Admin    |
| PUT    | /api/orders/:id/status      | Update order status      | Admin    |
| POST   | /api/auth/register          | Register user            | Public   |
| POST   | /api/auth/login             | Login user               | Public   |
| GET    | /api/auth/me                | Get current user         | User     |
| GET    | /api/admin/stats            | Dashboard stats          | Admin    |
