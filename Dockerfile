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

# Default PORT for Cloud Run (will be overridden by Cloud Run)
ENV PORT=8080
ENV BACKEND_URL=https://auth-backend-220638362045.us-central1.run.app
ENV SERVER_NAME=https://auth-frontend-220638362045.us-central1.run.app

EXPOSE 8080

CMD ["sh", "-c", "envsubst '$$PORT $$BACKEND_URL $$SERVER_NAME' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

