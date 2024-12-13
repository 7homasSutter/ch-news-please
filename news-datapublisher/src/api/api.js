import {getAllDistinctNewspapers, getArticlesByQuery} from "../services/persistenceService.js";
import {improveLocation} from "../services/locationService.js";

export async function getAllLocationArticles(ctx) {
    try {
        const query = ctx.request.query
        const articles = await getArticlesByQuery(query)
        for (const index in articles) {
            articles[index] = await improveLocation(articles[index])
        }
        //articles.forEach(article => console.log(article))
        ctx.body = transformArticles(articles)
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = []
    }
}

export async function getAllNewspapers(ctx) {
    try {
        ctx.body = await getAllDistinctNewspapers()
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = []
    }
}


function transformArticles(articles) {

    return articles
        .filter(article => article.geo !== null && article.geo !== undefined && article.geo !== 'Unknown')
        .map(article => {
            try {
                const geolocation = JSON.parse(article.geo)
                return {
                    id: article.id,
                    title: article.title,
                    text: article.maintext,
                    newspaper: article.source_domain,
                    position: [geolocation.lat, geolocation.lng],
                    location: article.location,
                    keywords: article.keywords
                }
            } catch (error) {
                console.log(article, error)
                return undefined
            }
        })
        .filter(article => article !== undefined)
}
