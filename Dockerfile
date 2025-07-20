# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the built app with a lightweight web server
FROM node:18-alpine AS runner

WORKDIR /app

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port (Railway will set $PORT)
EXPOSE 8080

# Start the app
CMD ["serve", "-s", "dist", "-l", "8080"]