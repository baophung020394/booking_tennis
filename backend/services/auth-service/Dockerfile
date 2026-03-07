# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package*.json ../../
COPY ../../libs/common/package*.json ../../libs/common/
COPY ../../libs/database/package*.json ../../libs/database/
COPY ../../libs/messaging/package*.json ../../libs/messaging/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
COPY ../../libs ../../libs
COPY ../../tsconfig.json ../../

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../package*.json ../../
COPY ../../libs/common/package*.json ../../libs/common/
COPY ../../libs/database/package*.json ../../libs/database/
COPY ../../libs/messaging/package*.json ../../libs/messaging/

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create keys directory
RUN mkdir -p /app/keys

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main.js"]
