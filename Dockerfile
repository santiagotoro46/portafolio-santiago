# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Instala dependencias de producción
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Instala dependencias completas para compilar Astro
FROM base AS build-deps
COPY package.json package-lock.json ./
RUN npm ci

# Construye el proyecto Astro SSR
FROM build-deps AS build
COPY . .
RUN npm run build

# Imagen final para ejecutar Astro como servidor Node
FROM base AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

RUN addgroup -S astro && adduser -S astro -G astro

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

USER astro

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]