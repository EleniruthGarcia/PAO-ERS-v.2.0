FROM node:21-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build
RUN npm prune --production

FROM node:21-alpine
USER node
WORKDIR /app
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/build build/
CMD [ "node", "build" ]
