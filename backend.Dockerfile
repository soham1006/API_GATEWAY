FROM node:18

WORKDIR /app

COPY backend/package*.json ./
RUN npm install || true

COPY backend ./backend

EXPOSE 4000

CMD ["node", "backend/backend.js"]
