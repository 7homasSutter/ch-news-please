FROM node:20.0-slim
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./src ./src
COPY ./resources ./resources

RUN npm install --production
EXPOSE 3000
CMD ["node", "src/index.js"]
