FROM node:20.0-slim as builder

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM node:20.0-slim as final
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/index.js"]
