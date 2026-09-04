# Animal Shelters API — Quick Start

> **Status: stub backend.** All endpoints return mock data from in-memory arrays and
> reset on server restart. Auth endpoints return mock tokens without verification.
> The full implementation (JWT auth, bcrypt, file store, validation, RBAC) lives in
> the `maks/api-full` branch and will return once SSO and database decisions are made.

## Installation

```bash
# From project root
cd server
npm install

# Optional: create .env from template (defaults work out of the box)
cp .env.example .env

# Start server
node index.js
```

## Docker

```bash
# Build from server/ directory
cd server
docker build -t animal-shelters-api .

# Run container (no required env vars)
docker run -d -p 3000:3000 --name animal-shelters-api animal-shelters-api

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
| GET | `/api/health` | none | Server health check (real) |
| POST | `/api/auth/register` | none | Stub — returns mock user, no data stored |
| POST | `/api/auth/login` | none | Stub — returns mock token for any credentials |
| GET | `/api/auth/me` | none | Stub — returns fixed mock profile |
| POST | `/api/consent` | none | Record consent stub (in-memory) |
| GET | `/api/surveys` | none | List surveys stub |
| GET | `/api/surveys/:id` | none | Get survey by ID stub |
| POST | `/api/surveys` | none | Submit survey stub |
| GET | `/api/animals` | none | List animals (in-memory, `?shelter_id=X&species=Y&limit=N&offset=N`) |
| GET | `/api/animals/:id` | none | Get animal by ID |
| POST | `/api/animals` | none | Create animal stub |
| PUT | `/api/animals/:id` | none | Update animal stub |
| DELETE | `/api/animals/:id` | none | Delete animal stub |
| GET | `/api/shelters` | none | List shelters (in-memory, `?city=X&country=Y&limit=N&offset=N`) |
| GET | `/api/shelters/:id` | none | Get shelter by ID |
| POST | `/api/shelters` | none | Create shelter stub |
| PUT | `/api/shelters/:id` | none | Update shelter stub |
| DELETE | `/api/shelters/:id` | none | Delete shelter stub |
| GET | `/api/adoptions` | none | List adoption requests stub |
| GET | `/api/adoptions/:id` | none | Get adoption by ID stub |
| POST | `/api/adoptions` | none | Create adoption request stub |
| PUT | `/api/adoptions/:id/status` | none | Update adoption status stub |
| DELETE | `/api/adoptions/:id` | none | Cancel adoption stub |
| GET | `/api/users` | none | List users stub |
| GET | `/api/users/:id` | none | Get user by ID stub |
| POST | `/api/users` | none | Create user stub |
| PUT | `/api/users/:id` | none | Update user stub |
| DELETE | `/api/users/:id` | none | Delete user stub |

Authentication and role checks from the original design are **not enforced** in this
stub version; they will be reintroduced together with SSO.

## Authentication (stub)

1. **Register** → `POST /api/auth/register` with `{ email, password, name }` → 201, mock user
2. **Login** → `POST /api/auth/login` with `{ email, password }` → 200, `mock-token-<uuid>`
3. The token is not verified anywhere — frontend can develop the auth flow against this contract

**Roles:** `volunteer` (default), `admin`, `moderator` — accepted in payloads, not enforced.

**Security notes:**
- Helmet security headers, strict CORS, 100kb body limit
- No real auth, no rate limiting, no persistence — do not deploy as-is

## Server Structure

| Folder / File | Contains |
|--------|----------|
| `server/index.js` | Entry point — loads `.env`, starts Express on port 3000 |
| `server/app.js` | Express config — helmet, CORS, routes, Swagger |
| `server/env.js` | `.env` loading (optional, defaults work without it) |
| `server/routes/` | One file per entity: inline stub handlers + OpenAPI annotations |
| `server/middleware/` | `logger.js`, `notFound.js`, `errorHandler.js` |
| `server/config/` | `swagger.js` — OpenAPI 3.0.3 spec |
| `server/Dockerfile` | Multi-stage build (deps → runner), non-root user, healthcheck |
| `server/.dockerignore` | Excludes node_modules, .env, data from build context |
| `server/.env.example` | Template for optional env vars |

## Commands Cheat Sheet

```bash
# Start server
node index.js

# Health check
curl http://localhost:3000/api/health

# Register (stub)
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login (stub — returns mock token)
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}'

# Public animals list
curl "http://localhost:3000/api/animals?limit=3&offset=0"

# Public shelters list
curl "http://localhost:3000/api/shelters?city=Warszawa"

# Create animal (stub)
curl -s -X POST http://localhost:3000/api/animals \
  -H "Content-Type: application/json" \
  -d '{"name":"Rex","species":"dog","breed":"German Shepherd","age":2,"shelter_id":"1"}'

# Create adoption (stub)
curl -s -X POST http://localhost:3000/api/adoptions \
  -H "Content-Type: application/json" \
  -d '{"animal_id":"1","notes":"I have a garden"}'

# Swagger UI
open http://localhost:3000/api/docs

# OpenAPI JSON
curl http://localhost:3000/api/openapi.json
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | `development` | Set to `production` to disable Swagger UI |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:3000` | Comma-separated allowed origins |

All env vars are optional — the server starts with defaults. `.env` files
(`server/.env`, root `.env`) are loaded automatically if present.

## Error Response Format

All errors return:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400
  }
}
```

## Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 42, "limit": 10, "offset": 0 }
}
```

`meta` present on paginated list responses.
