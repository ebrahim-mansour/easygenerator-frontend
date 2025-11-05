FROM node:24.11.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.28.0-alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY start-nginx.sh /start-nginx.sh

# Default PORT for Cloud Run (will be overridden by Cloud Run)
ENV PORT=8080
ENV BACKEND_URL=https://auth-backend-7v5surudzq-uc.a.run.app

# Make startup script executable
RUN chmod +x /start-nginx.sh

EXPOSE 8080

CMD ["/start-nginx.sh"]

