# Animal Shelters API — Quick Start

## Installation

```bash
# From project root
cd server
npm install

# Create .env from template
cp .env.example .env
# Edit .env — set JWT_SECRET and JWT_EXPIRES_IN

# Start server
node index.js
```

## Docker

```bash
# Build from server/ directory
cd server
docker build -t animal-shelters-api .

# Run container (pass required env vars)
docker run -d -p 3000:3000 \
  -e JWT_SECRET=your-secret-key-min-32-chars \
  -e JWT_EXPIRES_IN=24h \
  --name animal-shelters-api animal-shelters-api

# Check logs
docker logs animal-shelters-api

# Stop
docker stop animal-shelters-api
```

## API Base URL

All endpoints: `http://localhost:3000/api`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | none | Server health check |
| POST | `/api/auth/register` | none | Register new user (email, password, name) |
| POST | `/api/auth/login` | none | Login, returns real JWT Bearer token |
| GET | `/api/auth/me` | Bearer | Get current user profile from JWT |
| POST | `/api/consent` | Bearer | Record GDPR consent (user_id from token) |
| GET | `/api/surveys` | Bearer | List surveys (own only; admin/moderator see all) |
| GET | `/api/surveys/:id` | Bearer | Get survey by ID (own only; admin/moderator see all) |
| POST | `/api/surveys` | Bearer | Submit survey (user_id from token) |
| GET | `/api/animals` | none | List animals (supports `?shelter_id=X&species=Y&limit=N&offset=N`) |
| GET | `/api/animals/:id` | none | Get animal by UUID |
| POST | `/api/animals` | Bearer | Create animal |
| PUT | `/api/animals/:id` | Bearer | Update animal |
| DELETE | `/api/animals/:id` | Bearer (admin) | Delete animal |
| GET | `/api/shelters` | none | List shelters (supports `?city=X&country=Y&limit=N&offset=N`) |
| GET | `/api/shelters/:id` | none | Get shelter by UUID |
| POST | `/api/shelters` | Bearer | Create shelter |
| PUT | `/api/shelters/:id` | Bearer | Update shelter |
| DELETE | `/api/shelters/:id` | Bearer (admin) | Delete shelter |
| GET | `/api/adoptions` | Bearer | List adoption requests (own only; admin/moderator can filter by user_id) |
| GET | `/api/adoptions/:id` | Bearer | Get adoption by ID (own only; admin/moderator see all) |
| POST | `/api/adoptions` | Bearer | Create adoption request (user_id from token) |
| PUT | `/api/adoptions/:id/status` | Bearer (admin, moderator) | Update adoption status |
| DELETE | `/api/adoptions/:id` | Bearer | Cancel own adoption (admin/moderator can cancel any) |
| GET | `/api/users` | Bearer | List users (admin only) |
| GET | `/api/users/:id` | Bearer | Get user by ID (admin only) |
| POST | `/api/users` | Bearer (admin) | Create user |
| PUT | `/api/users/:id` | Bearer (admin) | Update user |
| DELETE | `/api/users/:id` | Bearer (admin) | Delete user |

## Authentication

1. **Register** → `POST /api/auth/register` with `{ email, password, name }`
2. **Login** → `POST /api/auth/login` with `{ email, password }` → returns real JWT token
3. **Use token** → `Authorization: Bearer <token>` header on protected endpoints

**Token payload:** `{ id, email, role, iat, exp }` (24h expiry by default, configurable via `JWT_EXPIRES_IN`)

**Roles:** `volunteer` (default), `admin`, `moderator`

**Security notes:**
- Passwords hashed with bcrypt (12 rounds) before storage
- JWT_SECRET and JWT_EXPIRES_IN are **required** env vars — server throws on startup if missing
- Auth endpoints rate-limited to 10 req/min; general endpoints 100 req/15min
- Helmet security headers, strict CORS, 100kb body limit

## Server Structure — Folder Guide

| Folder | Contains |
|--------|----------|
| `server/index.js` | Entry point — starts Express server on port 3000 |
| `server/app.js` | Express config — helmet, CORS, rate-limit (auth + general), Swagger, routes |
| `server/data/` | `store.js` — JSON CRUD with bcrypt, file locking, UUID v4, auto timestamps<br>`users.json` — Data store (empty array `[]` on first run) |
| `server/config/` | `swagger.js` — OpenAPI 3.0.3 spec with 8 tags, component schemas, security |
| `server/routes/` | Mounted routers: health (`/api`), users (`/api/users`), auth (`/api/auth`), animals (`/api/animals`), shelters (`/api/shelters`), adoptions (`/api/adoptions`), consent (`/api/consent`), surveys (`/api/surveys`) |
| `server/controllers/` | Route handlers: auth (JWT register/login/me), users, animals, shelters, adoptions, consent, surveys, health |
| `server/middleware/` | `auth.js` (JWT verify + requireRole), `validate.js` (Joi factory), `errorHandler.js`, `notFound.js`, `logger.js` |
| `server/repositories/` | Per-entity repos: user (uses `data/store.js`), animal, shelter, adoption (in-memory arrays) |
| `server/schemas/` | Joi validation: auth, common (idParam, pagination), animal, shelter, adoption, user, consent, survey |
| `server/Dockerfile` | Multi-stage build (deps → runner), non-root user, healthcheck |
| `server/.dockerignore` | Excludes node_modules, .env, .git from build context |
| `server/.env.example` | Template for required env vars |

**Key architectural notes:**
- `controllers/auth.js` is the **real JWT implementation** (mounted at `/api/auth`)
- `controllers/{users,animals,shelters,adoptions}.js` are Router files that import from repositories
- `routes/*.js` import handlers from controllers and apply middleware (auth, validate, role checks)
- In-memory repos for animals/shelters/adoptions — suitable for demo; replace with DB for production
- Docker build context is `server/` — all paths in Dockerfile are relative to it

## Commands Cheat Sheet

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

# Public animals list (no auth)
curl "http://localhost:3000/api/animals?limit=3&offset=0"

# Public shelters list (no auth)
curl "http://localhost:3000/api/shelters?city=Warszawa"

# Create animal (requires auth)
curl -s -X POST http://localhost:3000/api/animals \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Rex","species":"dog","breed":"German Shepherd","age":2,"shelter_id":"1"}'

# Create adoption (user_id from token)
curl -s -X POST http://localhost:3000/api/adoptions \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"animal_id":"1","notes":"I have a garden"}'

# Submit survey (user_id from token)
curl -s -X POST http://localhost:3000/api/surveys \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"shelter_id":"1","ratings":{"cleanliness":5,"animal_care":4,"staff_friendliness":5,"overall":4}}'

# Record consent (user_id from token)
curl -s -X POST http://localhost:3000/api/consent \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"consent_type":"analytics","granted":true}'

# List own adoptions
curl -s http://localhost:3000/api/adoptions -H "Authorization: Bearer $TOKEN"

# Swagger UI
open http://localhost:3000/api/docs

# OpenAPI JSON
curl http://localhost:3000/api/openapi.json
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | `development` | Set to `production` for production mode |
| `JWT_SECRET` | **(required)** | Secret key for JWT signing — no default, server throws if missing |
| `JWT_EXPIRES_IN` | **(required)** | JWT token expiry (e.g., `1h`, `24h`, `7d`) — server throws if missing |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated allowed origins |
| `DATA_FILE` | `data/users.json` | Path to users JSON store |

**Required env vars (server won't start without):**
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Error Response Format

All errors return:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400,
    "details": [
      { "field": "email", "message": "Email must be a valid email address" }
    ]
  }
}
```

`details` only present on validation errors (400).

## Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 42, "limit": 10, "offset": 0 }
}
```

`meta` present on paginated list responses.