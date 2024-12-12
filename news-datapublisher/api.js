import {getArticlesByQuery} from "./persistenceService.js";

export async function getAllLocationArticles(ctx) {
    try {
        const query = ctx.request.query
        const articles = await getArticlesByQuery(query)
        ctx.body = transformArticles(articles)
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = error
    }


}


function transformArticles(articles){

    return articles.map(article =>  {
        const geolocation = JSON.parse(article.geo)
        return {
            id: article.id,
            title: article.title,
            text: article.maintext,
            newspaper: article.source_domain,
            position: [geolocation.lat, geolocation.lng],
            location: article.location
        }
    })
}
