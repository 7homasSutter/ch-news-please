FROM node:18-alpine3.20 as build
WORKDIR /app

COPY package.json ./
RUN npm install
RUN npm i -g serve

COPY . .

ARG VITE_API_HOST
ARG VITE_API_PORT
ENV VITE_API_HOST $VITE_API_HOST
ENV VITE_API_PORT $VITE_API_PORT

RUN npm run build
EXPOSE 3000
CMD ["serve", "-s", "dist"]
# ---
#FROM fholzer/nginx-brotli:v1.19.1
#WORKDIR /etc/nginx
#ADD nginx.conf /etc/nginx/nginx.conf
#COPY --from=build /app/build /usr/share/nginx/html
#EXPOSE 8080
#CMD ["nginx", "-g", "daemon off;"]

