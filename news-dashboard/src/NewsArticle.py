
class NewsArticle(object):
    """
    Class representing a single news article containing all the information that news-please can extract.
    """
    authors = []
    date_download = None
    date_modify = None
    date_publish = None
    description = None
    filename = None
    image_url = None
    language = None
    localpath = None
    source_domain = None
    maintext = None
    text = None
    title = None
    title_page = None
    title_rss = None
    url = None

    def get_serializable_dict(self):
        """
        Get a serializable dict of the instance of this class.
        :return:
        """
        tmp = self.get_dict()
        tmp['date_download'] = str(tmp['date_download'])
        tmp['date_modify'] = str(tmp['date_modify'])
        tmp['date_publish'] = str(tmp['date_publish'])
        return tmp

    def get_dict(self):
        """
        Get the dict of the instance of this class.
        :return:
        """
        return {
            'authors': self.authors,
            'date_download': self.date_download,
            'date_modify': self.date_modify,
            'date_publish': self.date_publish,
            'description': self.description,
            'filename': self.filename,
            'image_url': self.image_url,
            'language': self.language,
            'localpath': self.localpath,
            'maintext': self.maintext,
            'source_domain': self.source_domain,
            'text': self.text,
            'title': self.title,
            'title_page': self.title_page,
            'title_rss': self.title_rss,
            'url': self.url
        }

    @staticmethod
    def get_obj(data):
        article = NewsArticle()
        article.id = data[0]
        article.date_modify = data[1]
        article.date_download = data[2]
        article.localpath = data[3]
        article.filename = data[4]
        article.source_domain = data[5]
        article.url = data[6]
        article.image_url = data[7]
        article.title = data[8]
        article.title_page = data[9]
        article.title_rss = data[10]
        article.maintext = data[11]
        article.description = data[12]
        article.date_publish = data[13]
        article.authors = data[14]
        article.language = data[15]
        return article
