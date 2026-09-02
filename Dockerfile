# --- Dependencies: server only ---
FROM node:26-alpine AS deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# --- Runtime ---
FROM node:26-alpine AS runner
WORKDIR /app/server

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/server/node_modules ./node_modules
COPY server/ ./

# data dir must be writable by the non-root runtime user (stub JSON store)
RUN chown -R appuser:appgroup ./data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

USER appuser

CMD ["node", "index.js"]
