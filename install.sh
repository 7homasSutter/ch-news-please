#!/bin/sh

mkdir -p ./db_data/postgres/
mkdir -p ./db_data/news_data/
touch .env
echo "DB_PASSWORD=chnewsplease" >> .env
echo "DB_USER=chnewsplease" >> .env
echo "DB_NAME=chnewsplease" >> .env
