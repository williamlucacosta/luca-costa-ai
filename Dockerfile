# 1 · build the static export (next build -> out/, then the postbuild prefetch fix)
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2 · serve it with nginx (Traefik in Coolify terminates TLS in front)
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/headers.conf /etc/nginx/snippets/headers.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
