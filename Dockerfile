FROM node:14.16.0-slim

WORKDIR /usr/src

COPY package*.json server.js routes.js ./
COPY src src
COPY client client

RUN npm install \
    && npm run build-client

CMD ["node", "server.js"]
