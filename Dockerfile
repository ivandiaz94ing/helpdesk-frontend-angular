# ==========================================
    # Etapa 1: Construcción (Build)
    # ==========================================
    # Usamos una imagen de Node.js
    FROM node:20-alpine AS builder

    # Establecemos el directorio de trabajo dentro del contenedor
    WORKDIR /app

    # Copiamos solo los archivos de dependencias primero (optimiza la caché de Docker)
    COPY package*.json ./

    # Instalamos las dependencias
    RUN npm install --legacy-peer-deps

    # Copiamos el resto del código del proyecto
    COPY . .

    # Compilamos la aplicación de Angular
    # Nota: En versiones recientes de Angular, esto genera los archivos en 'dist/helpDesk/browser'
    RUN npm run build

    # ==========================================
    # Etapa 2: Servidor de Producción
    # ==========================================
    # Usamos una imagen ligera de Nginx
    FROM nginx:alpine

    # Copiamos nuestra configuración de Nginx para reemplazar la que viene por defecto
    COPY nginx.conf /etc/nginx/conf.d/default.conf

    # Copiamos los archivos compilados desde la "Etapa 1" (builder) a la carpeta que lee Nginx
    # Revisa en tu máquina local dentro de la carpeta 'dist/' si la ruta exacta es'helpDesk/browser' o solo 'helpDesk'
    COPY --from=builder /app/dist/helpDesk/browser /usr/share/nginx/html

    # Exponemos el puerto 80 (el estándar para web)
    EXPOSE 80

    # Comando para iniciar Nginx
    CMD ["nginx", "-g", "daemon off;"]
