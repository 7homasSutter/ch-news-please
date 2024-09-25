FROM python:3.11-alpine

RUN mkdir /ch-news-please
RUN apk add -U --no-cache curl git make gcc libffi-dev musl-dev libxml2-dev libxslt-dev openssl-dev zlib-dev jpeg-dev
COPY . /ch-news-please/
RUN cd /ch-news-please && pip3 install -r requirements.txt

COPY docker.sh /
RUN chmod +x /docker.sh

CMD ["/docker.sh"]