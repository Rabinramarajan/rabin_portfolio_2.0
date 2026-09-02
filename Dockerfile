# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Dependency layer — cached until package*.json changes
COPY package*.json ./
RUN npm ci

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
