# Автор: Ткаченко Дар'я, ЗАІ-231
# MusicHealth — Node.js застосунок

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
