#!/bin/sh

mkdir -p ./db_data/postgres/
mkdir -p ./db_data/news_data/
mkdir ./redis
mkdir ./redis/data
touch .env
echo "DB_PASSWORD=chnewsplease" >> .env
echo "DB_USER=chnewsplease" >> .env
echo "DB_NAME=chnewsplease" >> .env
echo "REDIS_PASSWORD=chnewsplease" >> .env
echo "REDIS_PORT=6379" >> .env
echo "#REDIS_HOST=redis" >> .env
