export type Article = {
    id: string,
    title: string,
    text: string,
    newspaper: string
    position: number[],
    location: string
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
