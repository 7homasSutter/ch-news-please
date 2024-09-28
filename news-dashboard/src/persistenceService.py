import psycopg2
from . import NewsArticle

conn = psycopg2.connect(
    host='localhost',
    port=5432,
    database='chnewsplease',
    user='chnewsplease',
    password='chnewsplease')


def get_all_sources():
    with conn.cursor() as curs:
        try:
            curs.execute("SELECT source_domain from currentversions group by source_domain")
            result = curs.fetchall()
            return list(map(lambda x: x[0], result))


        except(Exception, psycopg2.DatabaseError) as error:
            print(error)
            return []


def get_all_articles_by_source(source):
    with conn.cursor() as curs:
        try:
            curs.execute("SELECT id, title, date_publish from currentversions where source_domain = %s order by date_publish desc", (source,))
            result = curs.fetchall()
            return list(map(lambda x: {"id": x[0], "title": x[1], "date_publish": x[2]}, result))

        except(Exception, psycopg2.DatabaseError) as error:
            print(error)
            return []


def get_article_by_source_and_id(source, article_id):
    with conn.cursor() as curs:
        try:
            curs.execute("SELECT * from currentversions where source_domain = %s and id = %s", (source, int(article_id)))
            return NewsArticle.NewsArticle.get_obj(curs.fetchone())


        except(Exception, psycopg2.DatabaseError) as error:
            print(error)
            return []
