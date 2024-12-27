export type Article = {
    id: string,
    title: string,
    text: string,
    newspaper: string
    position: number[],
    location: string,
    keywords?: string
}

export type ArticleResponse = {
    articles: Article[]
    success: boolean
    message: string
}

export type ErrorMessageProps = {
    error: boolean | null
    message: string
}

export type NewspaperResponse = {
    newspapers: string[]
    success: boolean
    message: string
}

export type FilterData = {
    limit: number,
    newspapers: string[],
    keywords: string[],
    maxAge: number
}
