# Deployment Guide

## Overview

| Service  | Platform | Folder     |
|----------|----------|------------|
| Backend  | Railway  | `/backend` |
| Frontend | Vercel   | `/frontend`|

---

## 1 — Deploy Backend to Railway

### Step 1 — Push to GitHub
Make sure your project is in a GitHub repository.

### Step 2 — Create Railway project
1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect Node.js via `backend/package.json`

### Step 3 — Set the root directory
In Railway → your service → **Settings** → **Root Directory**:
```
backend
```

### Step 4 — Set environment variables
In Railway → your service → **Variables**, add:

| Variable       | Value                                      |
|----------------|--------------------------------------------|
| `JWT_SECRET`   | any long random string (e.g. 64 char hex)  |
| `FRONTEND_URL` | your Vercel URL (added after step 2 below) |

Railway sets `PORT` automatically — do **not** add it manually.

### Step 5 — Deploy
Railway deploys automatically on every push to your main branch.

After deploy, copy your Railway URL — it looks like:
```
https://shopwave-backend.up.railway.app
```

---

## 2 — Deploy Frontend to Vercel

### Step 1 — Import project
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Framework preset: **Vite** (auto-detected)

### Step 2 — Set environment variable
In Vercel → your project → **Settings** → **Environment Variables**:

| Variable       | Value                                          |
|----------------|------------------------------------------------|
| `VITE_API_URL` | your Railway URL, e.g. `https://shopwave-backend.up.railway.app` |

> No trailing slash on the URL.

### Step 3 — Deploy
Click **Deploy**. Vercel builds with `npm run build` and serves `dist/`.

After deploy, copy your Vercel URL — it looks like:
```
https://shopwave.vercel.app
```

---

## 3 — Connect them together

Go back to **Railway** → **Variables** and update:
```
FRONTEND_URL = https://shopwave.vercel.app
```

Redeploy the Railway service (or it picks up the variable on next push).

---

## Local Development (unchanged)

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

The Vite dev server proxies `/api/*` to `localhost:5000` automatically.
No `.env` file needed locally.

---

## Environment Variables Summary

### backend/.env (local only, never commit)
```
JWT_SECRET=any_long_random_string
FRONTEND_URL=http://localhost:5173
```

### frontend/.env.local (local only, never commit)
```
# Leave empty for local dev — Vite proxy handles it
# VITE_API_URL=
```
