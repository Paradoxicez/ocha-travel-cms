# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# .env.local must be present at build time for NEXT_PUBLIC_* to be inlined
COPY .env.local .env.local
RUN npm run build

# Stage 3: Production
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install Sharp for image processing in production
RUN npm install sharp

# Copy public assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/pics ./pics

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy seed script and dictionaries for initial setup
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/dictionaries ./dictionaries
COPY --from=builder /app/lib ./lib

# Create data directory with correct permissions
RUN mkdir -p /data/uploads && chown -R nextjs:nodejs /data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
