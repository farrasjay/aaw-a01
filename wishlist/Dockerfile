FROM node:18.18.2 AS builder

WORKDIR /marketplace/wishlist

COPY package.json ./

# Install pnpm
RUN npm install -g pnpm typescript

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Build
RUN pnpm run build

# Production image
FROM node:18.18.2-slim

ENV PORT 8000
ENV NODE_ENV production

WORKDIR /marketplace/wishlist

COPY --from=builder /marketplace/wishlist/dist ./dist
COPY --from=builder /marketplace/wishlist/package.json ./package.json

RUN npm install --only=production

EXPOSE 8000

CMD ["node", "dist/src/server.js"]