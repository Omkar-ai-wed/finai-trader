FROM node:20-alpine AS base

WORKDIR /app
COPY .dist/frontend/package.json .dist/frontend/package-lock.json* ./
RUN npm ci --prefer-offline

COPY .dist/frontend .

# Build
FROM base AS builder
RUN npm run build

# Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
