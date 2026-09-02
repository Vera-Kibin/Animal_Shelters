# Animal Shelters API — Quick Start

## 📦 Installation

```bash
# From project root
cd /home/kravchenski/Projects/own/animal-shelters
npm install

# Go to server directory
cd server
npm install

# Initialize data store
echo '[]' > data/users.json

# Start server
node index.js
```

## 🌐 API Base URL

All endpoints: `http://localhost:3000/api`

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | none | Server health check |
| POST | `/api/auth/register` | none | Register new user |
| POST | `/api/auth/login` | none | Login, get Bearer token |
| GET | `/api/auth/me` | Bearer | Get current user profile |
| POST | `/api/consent` | Bearer | Record GDPR consent |
| GET | `/api/surveys` | Bearer | List surveys |
| GET | `/api/animals` | Bearer | List animals (supports `?limit=N&offset=N`) |
| GET | `/api/animals/:id` | Bearer | Get animal by UUID |
| POST | `/api/animals` | Bearer | Create animal |
| PUT | `/api/animals/:id` | Bearer | Update animal |
| DELETE | `/api/animals/:id` | Bearer | Delete animal |
| GET | `/api/shelters` | Bearer | List all shelters |
| POST | `/api/shelters` | Bearer | Create shelter |
| PUT | `/api/shelters/:id` | Bearer | Update shelter |
| DELETE | `/api/shelters/:id` | Bearer | Delete shelter |
| GET | `/api/adoptions` | Bearer | List adoption requests |
| POST | `/api/adoptions` | Bearer | Create adoption request |
| PUT | `/api/adoptions/:id` | Bearer | Update adoption status |
| DELETE | `/api/adoptions/:id` | Bearer | Delete adoption request |

## 🔐 Authentication

1. Register → `POST /api/auth/register`
2. Login → `POST /api/auth/login` (returns token)
3. Use token: `Authorization: Bearer <token>`

## 📁 Server Structure — Brief Folder Guide

| Folder | Contains |
|--------|----------|
| `server/index.js` | Entry point — starts Express server on port 3000 |
| `server/app.js` | Express config — helmet, CORS, rate-limit, Swagger, routes |
| `server/data/` | `store.js` — CRUD adapter with UUID v4, auto timestamps<br>`users.json` — Data store (empty array `[]` on first run) |
| `server/config/` | `swagger.js` — OpenAPI 3.0.3 spec with 8 tags |
| `server/routes/` | All API routes: health, users, auth, animals, shelters, adoptions, consent, surveys |
| `server/controllers/` | Thin controllers → repo handlers (users, auth, animals, shelters, adoptions) |
| `server/middleware/` | logger, validate (dead ternary removed), errorHandler, notFound |
| `server/repositories/` | Per-entity repos: user, animal, shelter, adoption |
| `server/schemas/` | `common.js` — shared `idParam` and `pagination` schemas |

## ⌨️ Commands Cheat Sheet

```bash
# Start server
node index.js

# Health check
curl http://localhost:3000/api/health

# Register
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login & get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}' | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d);console.log(j.token)})")

# Use token
curl -s http://localhost:3000/api/auth/me -H "Authorization: Bearer $TOKEN"

# List animals with pagination
curl "http://localhost:3000/api/animals?limit=3&offset=0" -H "Authorization: Bearer $TOKEN"

# Swagger UI
open http://localhost:3000/api/docs
```