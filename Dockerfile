# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Add dependencies for development and OpenSSL
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev

# Copy prisma schema
COPY prisma ./prisma/

# Install dependencies
COPY package*.json ./

RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Copy prisma schema
COPY prisma ./prisma/

# Install production dependencies only
COPY package*.json ./
RUN npm install --production

# generate client
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
