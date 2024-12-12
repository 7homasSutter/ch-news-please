import './index.css'
import Map from "./components/Map.tsx";
import {ArticleSelection} from "./components/ArticleSelection.tsx";
import {MantineProvider} from '@mantine/core';
import {Article} from "./types";
import {useEffect, useState} from "react";
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css'
import {ArticeOverlay} from "./components/ArticeOverlay.tsx";
import {useArticles} from "./services/hooks/hooks/useArticles.tsx";
import Filter from "./components/Filter.tsx";

 function App() {

   const {getArticles, errorMessageProps, isLoading} = useArticles()

   const [articles, setArticles] = useState<Article[]>([])

    useEffect(() => {
        const loadArticles = async () => {
            const loadedArticles = await getArticles({})
            setArticles(loadedArticles)
        }
        loadArticles().then()
    }, []);

    const [activeArticle, setActiveArticle] = useState<Article|undefined>()

    const [visibleArticles, setVisibleArticles] = useState<Article[]>([])

    const onArticleSelected = (article: Article) => {
        setActiveArticle(article)
    }

    const onMarkerSelected = (article: Article) => {
        setActiveArticle(article)
    }


    return (
        <MantineProvider
            //@ts-ignore
            withCSSVariables
            withGlobalStyles
        >
            <div >
                <Map articles={articles} onMapSectionChanged={setVisibleArticles} notifyParentOnMarkerSelection={onMarkerSelected} selectedMarker={activeArticle} />
                <ArticleSelection data={visibleArticles} selectedArticle={activeArticle}  notifyParentOnArticleSelection={onArticleSelected}/>
                <ArticeOverlay defaultArticle={activeArticle} />
                <Filter/>
            </div>
        </MantineProvider>

    )

}

export default App
