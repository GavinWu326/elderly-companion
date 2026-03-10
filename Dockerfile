FROM node:18-alpine AS client-builder

WORKDIR /client

COPY client/package*.json ./
RUN npm install --registry=https://registry.npmmirror.com

COPY client/ .
RUN npm run build

FROM node:18-alpine

RUN apk add --no-cache python3 make g++

ENV npm_config_nodedir=/usr/local

WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev --registry=https://registry.npmmirror.com

COPY server/ .
RUN mkdir -p data

COPY --from=client-builder /client/dist ./client/dist

EXPOSE 3000

CMD ["node", "src/server.js"]
