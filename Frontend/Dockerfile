FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 5173

CMD ["/app/docker-entrypoint.sh"]
