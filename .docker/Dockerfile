FROM node:22-alpine AS dependencies-dev

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install


FROM node:22-alpine AS dependencies-prod

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production



FROM node:22-alpine AS builder-dev

RUN apk add --no-cache redis

WORKDIR /app

COPY --from=dependencies-dev /app/node_modules ./node_modules


CMD ["sh", "-c", "redis-server --daemonize yes && npm run dev"]
