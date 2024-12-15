import {ArticleResponse} from "../../types";
import {baseURL} from "./urlConfig.ts";

class ArticleService{
    URL: string = baseURL
    async get(filter: string): Promise<ArticleResponse>{
        let articleResponse: ArticleResponse = {success: false, message: '', articles: []}
        try {
            console.log(`${this.URL}/articles${filter}`)
            const response: Response = await fetch(`${this.URL}/articles${filter}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            if(!response.ok){
                articleResponse.message = response.statusText
                return articleResponse
            }

            articleResponse.articles = await response.json()
            articleResponse.success = true
            return articleResponse

        }catch (error: any){
            articleResponse.message = error
            return articleResponse
        }
    }
}

export const articleService = new ArticleService()
