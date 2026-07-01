<div align="center">

# 🥐 Levain — Artisan Bakehouse

### A cinematic, full-stack storefront for a small-batch bakery.

Browse a handcrafted menu, build a basket, and order for delivery — with a full-screen cinematic hero and an editorial design system.

[**▶ Live Demo**](https://frontend-rho-seven-22.vercel.app) · [Report a bug](https://github.com/shahriar-ahmed-seam/levain-bakehouse/issues)

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Overview

**Levain** is a production-grade e-commerce storefront for an artisan bakery. The frontend is a polished single-page React app; the backend is a FastAPI + MongoDB service exposing a clean REST API for products, orders and reviews.

It's designed to run **two ways**:

- **Standalone (demo)** — the frontend ships with a bundled catalog and completes orders client-side, so it deploys to Vercel with zero backend. Great for showcasing.
- **Full-stack** — point the frontend at the FastAPI backend (on Render + MongoDB Atlas) for live products, persisted orders and reviews.

The frontend automatically falls back to demo mode if the backend is unset or unreachable, so it never shows a broken state.

## Features

- 🎬 **Cinematic hero** — full-screen 4K imagery with a Ken Burns effect and layered gradients.
- 🧑‍🍳 **Editorial design system** — Fraunces display serif + Inter, a warm artisan palette, glassmorphism and motion.
- 🛒 **Persistent cart** — add, adjust and remove items; state survives refreshes via `localStorage`.
- 🧭 **Category filtering** and responsive product grid with graceful image loading.
- 📝 **Order flow** — delivery zones, live totals, validation and confirmation.
- 💬 **Reviews** with aggregate rating.
- 🔌 **Graceful data layer** — live API when available, bundled catalog otherwise.
- ⚙️ **Clean REST API** — FastAPI with Pydantic models, seeding and a health probe.

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, React Router, Tailwind CSS, Radix UI, lucide-react, sonner |
| Build | CRA + CRACO |
| Backend | FastAPI, Motor (async MongoDB), Pydantic v2 |
| Database | MongoDB (local or Atlas) |
| Hosting | Vercel (frontend) · Render (backend) |

## Project structure

```
Levain/
├── frontend/                 # React storefront (deploys to Vercel)
│   ├── src/
│   │   ├── components/       # Header, Hero, Products, Story, Reviews, OrderForm, Footer, CartSheet
│   │   ├── contexts/         # CartContext (localStorage-backed)
│   │   ├── lib/              # data.js (API + fallback), images.js (Unsplash)
│   │   └── mock.js           # bundled catalog for demo mode
│   └── vercel.json
├── backend/                  # FastAPI service (deploys to Render)
│   ├── server.py             # API routes + startup seeding + health
│   ├── models.py             # Pydantic models
│   ├── seed_data.py          # initial products & reviews
│   └── requirements.txt
├── render.yaml               # Render blueprint for the backend
└── contracts.md              # API contract reference
```

## Getting started

### Frontend (standalone demo)

```bash
cd frontend
npm install
npm start        # http://localhost:3000
```

With `REACT_APP_BACKEND_URL` empty (default), it runs in demo mode.

### Full-stack (with backend)

1. Start MongoDB locally (or use an Atlas connection string).
2. Run the backend:

   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env        # set MONGO_URL, DB_NAME, CORS_ORIGINS
   uvicorn server:app --reload --port 8000
   ```

   The API is at <http://localhost:8000/api>, docs at <http://localhost:8000/docs>.

3. Point the frontend at it:

   ```bash
   # frontend/.env
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | List products (optional `?category=`) |
| GET | `/api/products/{id}` | Single product |
| POST | `/api/products` | Create product |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List orders |
| GET | `/api/reviews` | List reviews |
| POST | `/api/reviews` | Create review |
| GET | `/api/health` | Health / DB ping |

The database is seeded with products and reviews on first startup.

## Deploy

**Frontend → Vercel**
- Import the repo, set the root directory to `frontend`.
- (Optional) set `REACT_APP_BACKEND_URL` to your Render URL for full-stack mode.

**Backend → Render**
- Use the included [`render.yaml`](render.yaml) blueprint (root directory `backend`).
- Provision **MongoDB Atlas** and set `MONGO_URL` in Render.
- Set `CORS_ORIGINS` to your Vercel domain.

## Credits

Imagery from [Unsplash](https://unsplash.com). Photographers are credited in the app footer and image sources.

## License

MIT © [Shahriar Ahmed](https://github.com/shahriar-ahmed-seam)
