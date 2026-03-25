# Stage 0: Dev
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]
