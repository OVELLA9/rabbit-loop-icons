# Pinned to a patched Node.js release (security fixes of 21 Oct 2026).
# Bump this when Node.js publishes a new security release.
FROM node:22.23.4-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "start"]
