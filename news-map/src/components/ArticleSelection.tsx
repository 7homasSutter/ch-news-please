import {Article} from "../types";
import {useState, useEffect, useRef} from "react";
import {Carousel, Embla} from '@mantine/carousel';

interface ArticleSelectionProps {
    data: Article[]
    selectedArticle?: Article
    notifyParentOnArticleSelection: (article: Article) => void

}

export function ArticleSelection({data, selectedArticle, notifyParentOnArticleSelection}: ArticleSelectionProps) {
    const [articles, setArticles] = useState<Article[]>(data)
    const [activeArticle, setActiveArticle] = useState<Article|undefined>()
    const [embla, setEmbla] = useState<Embla | null>(null)
    const stateRef = useRef()

    // @ts-ignore
    stateRef.current = articles

    useEffect(() => {
        setArticles(data)
    }, [data]);

    useEffect(() => {
        if(selectedArticle){
            selectArticle(selectedArticle)
        }else{
            if(data.length > 0){
                // if articles not initialized yet
                const source = articles ? articles : data
                const article = source[Math.floor(data.length/2)]
                selectArticle(article)
            }
        }
    }, [selectedArticle]);

/*    const onChange = (index: number, ref: React.MutableRefObject<Article[]|undefined>) => {
        if(stateRef.current){
            console.log(index, stateRef.current[index], ref)
        }
    }*/

    const selectArticle = (article: Article, notifyParent=false) => {
        const index = getIndexOfArticleById(article.id)
        embla?.scrollTo(index)
        setActiveArticle(article)

        if(notifyParent){
            notifyParentOnArticleSelection(article)
        }
    }

    const getIndexOfArticleById = (id: string): number => {
        if (!data) {
            return -1
        }
        return articles.map((article: Article) => article.id).indexOf(id)
    }


    return (
        <div className={"header"} style={{width: '100%', paddingBottom: 20}}>
            <Carousel
                //onSlideChange={(index: number) => onChange(index, articleRef )}
                getEmblaApi={setEmbla}
                withIndicators={false}
                withControls={false}
                slideSize={{ base: '50%', sm: '33.33%', md: '10%' }}
                align='center'
            >
                {articles.map((article: Article, index: number) => (
                    <Carousel.Slide key={index} onClick={() => selectArticle(article, true)}>
                        <Box article={article} isActive={activeArticle?.id === article.id}/>
                    </Carousel.Slide>
                ))}
            </Carousel>

        </div>

    )
}

interface BoxProps {
    article: Article,
    isActive: boolean
}

function Box({article, isActive}: BoxProps) {
    return (
        <div
            style={{
                backgroundColor: 'rgba(241,239,239, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                margin: 5,
                cursor: 'pointer',
                height: '8vw',
                width: '30vh',
                boxShadow: isActive? 'rgba(240,0,0,0.2) 0 0 20px 10px' : "",
                pointerEvents: 'all'

            }}>
            <div style={{fontWeight: 800}}>{article.title}</div>
            <div>{article.newspaper}</div>
        </div>
    )
}
