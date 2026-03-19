FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --production --legacy-peer-deps && npm rebuild bcrypt --build-from-source

COPY . .

ENV NODE_ENV=production
ENV PORT=5555

EXPOSE 5555

CMD ["node", "app.js"]
