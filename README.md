# Marketplace API

## Overview

REST API for a marketplace application built with Express.js, PostgreSQL, and Drizzle ORM.

## Prerequisites

- Node.js 18.18.2
- pnpm
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>

# Copy environment file
cp .env.example .env

# Start with Docker Compose
docker compose up
```

## Local Development Setup

```bash
# Install dependencies
pnpm install

# Setup database
pnpm run generate # Generate migrations

pnpm run migrate # Run migrations

# Start development server
pnpm dev

```

## Environment Variables

Copy .env.example to .env and configure:

```
TENANT_ID=47dd6b24-0b23-46b0-a662-776158d089ba
JWT_SECRET=auth_ms_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
PORT=8000
NODE_ENV=development

```

## Available Scripts

```bash
pnpm dev # Development mode with hot reload
pnpm build # Build production
pnpm start # Start production server
pnpm generate # Generate DB migrations
pnpm migrate # Run DB migrations
```

## API Endpoints

Base URL: http://localhost:8000

## Core endpoints

```
GET /health - Health check
GET / - API information
GET /api/product - List products
POST /api/auth - Authentication
GET /api/order - Orders
GET /api/cart - Shopping cart
```

## Database Schema

Managed through Drizzle ORM with migrations in drizzle directory.

## Workload Design

```
artillery run test-load.yaml --output result.json
artillery report result.json
```

## A03 | Kubernetes Deployment

```
#runthrough

docker login

docker tag aaw-marketplace-authentication farrasjay/authentication:latest
docker push farrasjay/authentication:latest

docker tag aaw-marketplace-orders farrasjay/orders:latest
docker push farrasjay/orders:latest

docker tag aaw-marketplace-products farrasjay/products:latest
docker push farrasjay/products:latest

docker tag aaw-marketplace-tenant farrasjay/tenant:latest
docker push farrasjay/tenant:latest

docker tag aaw-marketplace-wishlist farrasjay/wishlist:latest
docker push farrasjay/wishlist:latest

kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f postgresql.yaml

kubectl apply -f authentication.yaml
kubectl apply -f orders.yaml
kubectl apply -f products.yaml
kubectl apply -f tenant.yaml
kubectl apply -f wishlist.yaml

kubectl get deployments -n marketplace -o wide
```
