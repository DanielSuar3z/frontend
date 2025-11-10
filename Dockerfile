# Primera etapa: Construir la aplicación React
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Construye la aplicación React para producción
# Asegúrate de que 'npm run build' crea la carpeta 'build' o 'dist'
RUN npm run build

# Segunda etapa: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia la configuración de Nginx (crearemos este archivo después)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de construcción de React desde la etapa 'build'
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80 (puerto HTTP estándar para Nginx)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]