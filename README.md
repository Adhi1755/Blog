# BlogSpace — AI-Powered Full-Stack Blog Platform

> A premium, editorial-grade blogging platform built with Next.js 16, Flask, and a machine-learning category prediction engine.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Flask](https://img.shields.io/badge/Flask-3.1-000?logo=flask)](https://flask.palletsprojects.com)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://docker.com)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-live-black?logo=vercel)](https://vercel.com)

---

## 📸 Screenshots


| Page | Preview |
|------|---------|
| **Feed / Home** | `docs/screenshots/feed.png` |
| **Blog Reader** | `docs/screenshots/reader.png` |
| **Editor — AI Category** | `docs/screenshots/editor_ai_category.png` |
| **Dashboard** | `docs/screenshots/dashboard.png` |
| **Login / Register** | `docs/screenshots/auth.png` |
---

## ✨ Features

### Core Platform
- **Magazine-style feed** — editorial grid layout with featured post hero, category badges, read-time estimates, and live like/view counters.
- **Full blog reader** — markdown-to-blocks renderer with cinematic page-transition animations (GSAP).
- **Rich editor** — markdown toolbar (Heading, Bold, Italic, List, Code, Link), live character counter, excerpt summary field, thumbnail URL preview with validation.
- **Dashboard** — manage all your posts with edit, delete, and featured-toggle actions.
- **Author profile page** — stats overview, post grid, and edit controls.

### 🤖 AI-Powered Category Prediction
The editor's **Category** sidebar card calls a live ML API instead of a manual dropdown:

1. User types a **title** and **summary**.
2. Clicks **"Predict Category"** — the frontend POSTs to `https://blogengine-zovn.onrender.com/predict`.
3. The SVM + TF-IDF model returns a predicted category (e.g. `Next.js`, `React`, `Backend`).
4. The result is displayed as an **orange accent badge** with a lightbulb icon.
5. The user can click **"Re-predict Category"** at any time.

### Authentication
- JWT-based register / login via Flask backend.
- Protected routes — unauthenticated users are redirected to `/login`.
- Persistent session via `localStorage` + React Context.

### Infrastructure
- **Containerised** with a multi-stage Docker build (Node 22 Alpine).
- **CI/CD** via GitHub Actions (lint → build → deploy pipeline).
- **Deployed** frontend on Vercel, backend on Render.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Next.js 16.2.4 (App Router, Turbopack) |
| UI language | TypeScript 5 + React 19 |
| Styling | Vanilla CSS (inline styles + global CSS) |
| Animations | GSAP 3 + `@gsap/react` |
| Auth state | React Context + JWT |
| Backend API | Flask 3.1 + Flask-JWT-Extended |
| Auth security | Werkzeug `pbkdf2:sha256` password hashing |
| Database | SQLite3 (via Flask `g` helpers) |
| ML inference | Remote SVM + TF-IDF model (Render microservice) |
| Container | Docker (multi-stage, `node:22-alpine`) |
| Hosting | Vercel (frontend) · Render (backend + ML API) |
| Linting | ESLint 9 + `eslint-config-next` · Flake8 (Python) |

---

## 📂 Project Structure

```
blog/
├── app/                        # Next.js App Router
│   ├── blog/                   # Dynamic blog reader [slug]
│   ├── components/             # Shared UI components (AppHeader, …)
│   ├── context/                # AuthContext (JWT session)
│   ├── dashboard/              # Author dashboard page
│   ├── data/                   # Seed post data
│   ├── editor/                 # Create / edit post page  ← AI category here
│   ├── hooks/                  # usePosts, CATEGORY_OPTIONS
│   ├── login/                  # Login page
│   ├── profile/                # Author profile page
│   ├── register/               # Registration page
│   ├── utils/                  # Markdown parser, helpers
│   ├── globals.css             # Global design tokens & animations
│   ├── layout.tsx              # Root layout (fonts, meta)
│   └── page.tsx                # Feed / home page
│
├── backend/
│   ├── app.py                  # Flask API (auth, JWT, SQLite)
│   ├── requirements.txt        # Python dependencies
│   └── blogspace.db            # SQLite database (git-ignored in prod)
│
├── Dockerfile                  # Multi-stage production build
├── vercel.json                 # Vercel deployment config
├── next.config.ts              # Next.js configuration
└── .github/workflows/          # CI/CD pipeline
```

---

## 🤖 ML Category Prediction API

The prediction is powered by a separately deployed microservice:

**Endpoint:** `POST https://blogengine-zovn.onrender.com/predict`

**Request:**
```json
{
  "title": "Getting Started with Server Components in Next.js",
  "description": "A deep dive into React Server Components and how Next.js leverages them."
}
```

**Response:**
```json
{
  "prediction": "Next.js"
}
```

The model internally uses a **TF-IDF vectoriser** + **Support Vector Machine (SVM)** trained on labelled blog titles and descriptions. The frontend maps the returned label to a colour from `CATEGORY_OPTIONS` for badge styling.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.10 (for local backend)
- Docker (optional, for containerised run)

### 1. Clone the repo
```bash
git clone https://github.com/Adhi1755/Blog.git
cd Blog
```

### 2. Frontend (Next.js)
```bash
npm install
npm run dev
# → http://localhost:3000
```

### 3. Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# → http://localhost:5001
```

### 4. Environment variables
Copy `.env.example` and fill in your values:
```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL of the Flask backend |
| `JWT_SECRET_KEY` | Secret used to sign JWT tokens |
| `CORS_ORIGINS` | Comma-separated allowed origins |

### 5. Docker (production build)
```bash
docker build -t blogspace .
docker run -p 3000:3000 blogspace
```

---

## 🌐 Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://blog-five-xi-40.vercel.app |
| Backend (Render) | Set via `NEXT_PUBLIC_API_URL` |
| ML API (Render) | https://blogengine-zovn.onrender.com |

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint app/ directory with ESLint
```

---

## 🔒 Auth Flow

```
Register / Login
      ↓
Flask /api/auth/register or /api/auth/login
      ↓
JWT access token (8-hour expiry)
      ↓
Stored in localStorage via AuthContext
      ↓
Protected routes check context → redirect to /login if null
```

---

## 📋 API Endpoints (Flask Backend)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ✗ | Create new account |
| `POST` | `/api/auth/login` | ✗ | Login, returns JWT |
| `GET` | `/api/auth/me` | ✓ JWT | Get current user profile |
| `GET` | `/api/health` | ✗ | Health check |

---

## 📄 License

MIT © 2026 Adithyan

---

<div align="center">
  Built with ❤️ using Next.js, Flask, and machine learning.
</div>
