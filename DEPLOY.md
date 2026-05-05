# Deployment Guide — Railway + Vercel

## Your Railway Backend URL
```
https://shopwave-production-d1ad.up.railway.app
```
Test it now in your browser:
```
https://shopwave-production-d1ad.up.railway.app/api/health
```
Expected response: `{ "status": "ok", "message": "ShopWave API is running" }`

---

## Railway — Variables to set

Go to Railway → your service → **Variables** tab and add:

| Variable       | Value                                      |
|----------------|--------------------------------------------|
| `JWT_SECRET`   | any long random string (min 32 chars)      |
| `FRONTEND_URL` | your Vercel URL (add after Vercel deploy)  |

> `PORT` is set by Railway automatically — do NOT add it.

---

## Vercel — Deploy Frontend

### 1. Import project
- [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
- **Root Directory** → `frontend`
- Framework: **Vite** (auto-detected)

### 2. Environment Variable
Vercel → **Settings** → **Environment Variables** → add:

| Variable       | Value                                                    |
|----------------|----------------------------------------------------------|
| `VITE_API_URL` | `https://shopwave-production-d1ad.up.railway.app`        |

> The `frontend/.env.production` file already has this set, so Vercel will
> pick it up automatically even without the dashboard variable — but setting
> it in the dashboard is best practice so you can change it without redeploying.

### 3. Deploy
Click **Deploy**. After it finishes, copy your Vercel URL.

---

## Final step — connect Vercel URL back to Railway

1. Copy your Vercel URL (e.g. `https://shopwave.vercel.app`)
2. Railway → Variables → set `FRONTEND_URL` = `https://shopwave.vercel.app`
3. Railway redeploys automatically

---

## Local Development

```bash
# Terminal 1 — backend
cd backend && npm run dev      # http://localhost:5000

# Terminal 2 — frontend  
cd frontend && npm run dev     # http://localhost:5173
```

Vite proxies `/api/*` → `localhost:5000` in dev mode.
The `.env.production` file is only used during `npm run build`.
