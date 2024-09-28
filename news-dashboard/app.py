from flask import Flask, render_template

from src import persistenceService

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def get_sources():  # put application's code here
    sources = persistenceService.get_all_sources()
    return render_template("sources.html", sources=sources)

@app.route('/<source>')
def get_article_by_source(source):
    articles = persistenceService.get_all_articles_by_source(source)
    return render_template("articles_overview.html", source=source, articles=articles)

@app.route('/<source>/<article_id>')
def get_article(source, article_id):
    print(source)
    article = persistenceService.get_article_by_source_and_id(source, article_id)
    return render_template("article.html", article=article)

if __name__ == '__main__':
    app.run()
