import {useState} from "react";
import {ArticleResponse, ErrorMessageProps, FilterData} from "../../../types";
import {articleService} from "../../api/ArticleService.ts";

export const useArticles = () => {
    const [errorMessageProps, setErrorMessageProps] = useState<ErrorMessageProps>({error: false, message: ''})
    const [isLoading, setIsLoading] = useState(false)

    const getArticles = async (params: FilterData) => {
        setIsLoading(true)
        setErrorMessageProps({error: false, message: ''})


        const articleResponse: ArticleResponse = await articleService.get(paramsToFilter(params))
        if (!articleResponse.success) {
            setErrorMessageProps({error: true, message: articleResponse.message})
        }
        setIsLoading(false)
        return articleResponse.articles
    }

    return {getArticles, isLoading, errorMessageProps}

}

function paramsToFilter(params: { [key: string]: any }): string {
    const values = Object.entries(params)
        .filter(([_, value]) => !(value === undefined || value.length === 0))
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return [key, value.join("-")]
            }
            return [key, value]
        })
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    return values.length === 0 ? '' : `?${values}`
}
