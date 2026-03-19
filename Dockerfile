FROM node:20-bookworm

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx gettext-base ca-certificates netcat-openbsd \
  && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install server dependencies
WORKDIR /app/server
RUN npm install --production --legacy-peer-deps && npm rebuild bcrypt --build-from-source

# Install client dependencies
WORKDIR /app/client
RUN npm install --legacy-peer-deps

# Copy source code
WORKDIR /app
COPY server ./server
COPY client ./client
COPY docker ./docker

# Build client (Next.js)
ENV NEXT_PUBLIC_API_URL=/api
RUN cd /app/client && npm run build

# Setup nginx
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

ENV NODE_ENV=production
ENV BACKEND_PORT=5555
ENV FRONTEND_PORT=3000

EXPOSE 8080

CMD ["/start.sh"]
