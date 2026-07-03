# --- Etapa 1: Compilación ---
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar el proyecto
COPY . .
RUN npm run build

# --- Etapa 2: Servidor de Producción ---
FROM nginx:alpine

# Modificado para Astro: Copia el contenido de /app/dist directamente a Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80 para tráfico web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]