FROM python:3.11-alpine

# Install necessary build tools
RUN apk add -U --no-cache curl git make gcc libffi-dev musl-dev libxml2-dev libxslt-dev openssl-dev zlib-dev jpeg-dev

# Create necessary directories
RUN mkdir /config-news-please
RUN mkdir /news-scraper

# Copy configuration and source code
COPY config-news-please /config-news-please
COPY start_news_please.sh /
COPY ./news-scraper /news-scraper

# Set working directory and install dependencies
WORKDIR /news-scraper
RUN pip3 install --upgrade pip || exit
RUN pip3 install -r requirements.txt || exit
RUN pip3 install build || exit
RUN python3 -m build || exit
RUN pip3 install dist/*.whl || exit

# Set working directory and make the start script executable
WORKDIR /
RUN chmod +x /start_news_please.sh

# Set the command to run the start script
CMD ["/start_news_please.sh"]