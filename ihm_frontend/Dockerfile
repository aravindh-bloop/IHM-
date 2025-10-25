# Multi-stage build for React frontend
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and manually add musl rollup package
RUN npm ci --legacy-peer-deps || npm install && \
    npm install --no-save @rollup/rollup-linux-x64-musl

# Copy source code
COPY . .

# Expose development port
EXPOSE 5173

# Development command with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - use npm ci with legacy peer deps to avoid optional dependency issues
# Then manually install the musl rollup package
RUN npm ci --legacy-peer-deps || npm install && \
    npm install --no-save @rollup/rollup-linux-x64-musl

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]