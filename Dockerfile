FROM node:21-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:21-alpine
USER node
WORKDIR /app
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/build build/
COPY client-cert.pem client-cert.pem
COPY client-key.pem client-key.pem
COPY serve.js serve.js
ENV NODE_ENV=production
CMD [ "node", "serve" ]
