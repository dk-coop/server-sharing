FROM node:14.16.0-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY src src
COPY client client

RUN npm run build

EXPOSE 3000
CMD ["node", "server.js"]
