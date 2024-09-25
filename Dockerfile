FROM python:3.11-alpine

RUN pip3 install news-please
RUN mkdir /config-news-please
COPY config-news-please /config-news-please
COPY start_news_please.sh /
RUN chmod +x /start_news_please.sh

CMD ["/start_news_please.sh"]