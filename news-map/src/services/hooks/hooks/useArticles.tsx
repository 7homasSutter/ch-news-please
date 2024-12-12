import {useState} from "react";
import {ArticleResponse, ErrorMessageProps} from "../../../types";
import {articleService} from "../../api/ArticleService.ts";

export const useArticles = () => {
    const [errorMessageProps, setErrorMessageProps] = useState<ErrorMessageProps>({error: false, message: ''})
    const [isLoading, setIsLoading] = useState(false)

    const getArticles = async(params: {[key: string]: string}) => {
        setIsLoading(true)
        setErrorMessageProps({error: false, message: ''})


        const articleResponse: ArticleResponse = await articleService.get(paramsToFilter(params))
        if(!articleResponse.success){
            setErrorMessageProps({error: true, message: articleResponse.message})
        }
        setIsLoading(false)
        return articleResponse.articles
    }

    return {getArticles, isLoading, errorMessageProps}

}

function paramsToFilter(params: {[key: string]: string}): string{
    const values = Object.entries(params).map((key, value) => `${key}=${value}`).join("&")
    return values.length === 0 ? '' : `?${values}`
}
