# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Dependency layer. The layer cache alone is not enough here: publish.js bumps
# the version in package.json on every release, so this COPY is invalidated
# each time and npm ci always re-runs. The cache mount is what keeps that cheap
# — the package tarballs persist across builds, so the re-run is a local
# extract instead of a full registry download.
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline --no-audit --fund=false

# Source layer
COPY . .
RUN npm run build

# ---------- runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# standalone output already excludes dev deps and untraced modules
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

CMD ["node", "server.js"]
