FROM node:18-alpine AS client-builder

WORKDIR /client

COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build

FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server/ .
RUN mkdir -p data

COPY --from=client-builder /client/dist ./client/dist

EXPOSE 3000

CMD ["node", "src/server.js"]
